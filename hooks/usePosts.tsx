import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { AuthModalState } from "../atoms/authModalAtom";
import { communityState } from "../atoms/communitiesAtom";
import { Post, postState, PostVote } from "../atoms/postsAtom";
import { auth, firestore, storage } from "../firebase/clientApp";

const usePosts = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [postStateValue, setPostStateValue] = useRecoilState(postState);
  const currentCommunity = useRecoilValue(communityState).currentCommunity;
  const setAuthModalState = useSetRecoilState(AuthModalState);
  const onVote = async (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post,
    vote: number,
    communityId: string
  ) => {
    event.stopPropagation();
    // if user not authenticated, open modal, on successful login, handle vote
    if (!user) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }
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

      if (postStateValue.selectedPost) {
        setPostStateValue((prev) => ({
          ...prev,
          selectedPost: updatedPost,
        }));
      }

      // update post document
      const postReference = doc(firestore, "posts", post.id!);
      batch.update(postReference, {
        voteStatus: voteStatus + voteChange,
      });

      // commit changes on firestore database
      await batch.commit();
    } catch (error) {
      console.log("onVote error: ", error);
    }
  };
  const onSelectPost = (post: Post) => {
    setPostStateValue((prev) => ({
      ...prev,
      selectedPost: post,
    }));
    router.push(`/r/${post.communityId}/comments/${post.id}`);
  };
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
  const getPostVotes = async () => {
    const postVotesQuery = query(
      collection(firestore, "users", `${user?.uid}/postVotes`)
    );
    const postVoteDocuments = await getDocs(postVotesQuery);
    const postVotes = postVoteDocuments.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPostStateValue((prev) => ({
      ...prev,
      postVotes: postVotes as PostVote[],
    }));
  };

  useEffect(() => {
    if (!user || !currentCommunity) return; // if no user or current community, useless
    getPostVotes();
  }, [user, currentCommunity]); // rerender on change of user or current community

  useEffect(() => {
    if (!user) {
      // clear users post votes when user not authenticated
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: [],
      }));
    }
  }, [user]);

  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  };
};
export default usePosts;
