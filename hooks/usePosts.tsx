import { collection, deleteDoc, doc, writeBatch } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";
import { Post, postState, PostVote } from "../atoms/postsAtom";
import { auth, firestore, storage } from "../firebase/clientApp";

const usePosts = () => {
  const [user] = useAuthState(auth);
  const [postStateValue, setPostStateValue] = useRecoilState(postState);
  const onVote = async (post: Post, vote: number, communityId: string) => {
    try {
      const { voteStatus } = post;
      const existingVote = postStateValue.postVotes.find(
        (vote) => vote.postId === post.id
      );
      const batch = writeBatch(firestore);
      // to avoid mutating state in react
      const updatedPost = { ...post };
      const updatedPosts = [...postStateValue.posts];
      let updatedPostVotes = [...postStateValue.postVotes];
      let voteChange = vote;

      // if new vote
      if (!existingVote) {
        // create new post vote document
        const postVoteReference = doc(
          collection(firestore, "users", `${user?.uid}/postVotes`)
        );
        const newVote: PostVote = {
          id: postVoteReference.id,
          postId: post.id!,
          communityId,
          voteValue: vote, // will either be 1 (upvote) or -1 (downvote)
        };
        batch.set(postVoteReference, newVote);

        // update voteValue of post
        updatedPost.voteStatus = voteStatus + vote;
        updatedPostVotes = [...updatedPostVotes, newVote];
      } else {
        // vote already exists (we must either alter it or remove it completely from postVotes)
        const postVoteReference = doc(
          firestore,
          "users",
          `${user?.uid}/postVotes/${existingVote.id}`
        );
        // if removing vote altogether
        if (existingVote.voteValue === vote) {
          updatedPost.voteStatus = voteStatus - vote;
          updatedPostVotes = updatedPostVotes.filter(
            (vote) => vote.id !== existingVote.id
          );
          // delete current post's vote document
          batch.delete(postVoteReference);
          voteChange *= -1;
        } else {
          // if flipping vote (dv to uv or uv to dv) -- must add or subtract 2 from voteStatus of said post
          updatedPost.voteStatus = voteStatus + 2 * vote;
          const voteIndex = postStateValue.postVotes.findIndex(
            (vote) => vote.id === existingVote.id
          );
          // change vote value locally
          updatedPostVotes[voteIndex] = {
            ...existingVote,
            voteValue: vote,
          };
          // update vote document in firestore with new vote value
          batch.update(postVoteReference, {
            voteValue: vote,
          });

          voteChange = 2 * vote;
        }
      }
      // update post document
      const postReference = doc(firestore, "posts", post.id!);
      batch.update(postReference, {
        voteStatus: voteStatus + voteChange,
      });

      // commit changes on firestore database
      await batch.commit();

      // update state with updated postVotes
      const postIndex = postStateValue.posts.findIndex(
        (item) => item.id === post.id
      );
      updatedPosts[postIndex] = updatedPost;
      setPostStateValue((prev) => ({
        ...prev,
        posts: updatedPosts,
        postVotes: updatedPostVotes,
      }));
    } catch (error) {
      console.log("onVote error: ", error);
    }
  };
  const onSelectPost = () => {};
  const onDeletePost = async (post: Post): Promise<boolean> => {
    try {
      // if image in post, delete image from storage on firebase
      if (post.imageURL) {
        const imageRef = ref(storage, `posts/${post.id}/image`);
        await deleteObject(imageRef);
      }
      // delete post document from firestore
      const postDocumentReference = doc(firestore, "posts", post.id!);
      await deleteDoc(postDocumentReference);
      // update recoil image
      setPostStateValue((prev) => ({
        ...prev,
        posts: prev.posts.filter((item) => item.id !== post.id),
      }));
      return true;
    } catch (error: any) {
      return false;
    }
  };
  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  };
};
export default usePosts;
