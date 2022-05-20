import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Community } from "../../../../atoms/communitiesAtom";
import { Post } from "../../../../atoms/postsAtom";
import About from "../../../../components/Community/About";
import PageContent from "../../../../components/Layout/PageContent";
import Comments from "../../../../components/Posts/Comments/Comments";
import PostItem from "../../../../components/Posts/PostItem";
import { auth, firestore } from "../../../../firebase/clientApp";
import useCommunityData from "../../../../hooks/useCommunityData";
import usePosts from "../../../../hooks/usePosts";

const PostPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const { postStateValue, setPostStateValue, onDeletePost, onVote } =
    usePosts();
  const { communityStateValue, setCommunityStateValue } = useCommunityData();
  const router = useRouter();
  const fetchPost = async (postId: string) => {
    try {
      const postDocumentReference = doc(firestore, "posts", postId);
      const postDocument = await getDoc(postDocumentReference);
      setPostStateValue((prev) => ({
        ...prev,
        selectedPost: { id: postDocument.id, ...postDocument.data() } as Post,
      }));
    } catch (error) {
      console.log("fetchPost error: ", error);
    }
  };
  const fetchCommunity = async (communityId: string) => {
    try {
      const communityDocumentReference = doc(
        firestore,
        "communities",
        communityId
      );
      const communityDocument = await getDoc(communityDocumentReference);
      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: {
          id: communityDocument.id,
          ...communityDocument.data(),
        } as Community,
      }));
    } catch (error) {
      console.log("fetchCommunity error: ", error);
    }
  };

  useEffect(() => {
    const { pid } = router.query;

    if (!postStateValue.selectedPost && pid) {
      fetchPost(pid as string);
    }
  }, [router.query, postStateValue.selectedPost]);

  useEffect(() => {
    const { communityId } = router.query;

    if (!communityStateValue.currentCommunity && communityId) {
      fetchCommunity(communityId as string);
    }
  }, [router.query, communityStateValue.currentCommunity]);

  return (
    <PageContent>
      <>
        {/* seelcted post */}
        {postStateValue.selectedPost && (
          <PostItem
            post={postStateValue.selectedPost}
            userVoteValue={
              postStateValue.postVotes.find(
                (item) => item.postId === postStateValue.selectedPost?.id
              )?.voteValue
            }
            userIsCreator={postStateValue.selectedPost?.creatorId === user?.uid}
            onDeletePost={onDeletePost}
            onVote={onVote}
          />
        )}
        <Comments
          user={user as User}
          selectedPost={postStateValue.selectedPost}
          communityId={postStateValue.selectedPost?.communityId as string}
        />
      </>
      <>
        {communityStateValue.currentCommunity && (
          <About communityData={communityStateValue.currentCommunity} />
        )}
      </>
    </PageContent>
  );
};
export default PostPage;
