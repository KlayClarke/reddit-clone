import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Post } from "../../../../atoms/postsAtom";
import PageContent from "../../../../components/Layout/PageContent";
import PostItem from "../../../../components/Posts/PostItem";
import { auth, firestore } from "../../../../firebase/clientApp";
import usePosts from "../../../../hooks/usePosts";

const PostPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const { postStateValue, setPostStateValue, onDeletePost, onVote } =
    usePosts();
  const router = useRouter();
  const fetchPost = async (postId: string) => {
    try {
      const postDocumentReference = doc(firestore, "posts", postId);
      const postDoc = await getDoc(postDocumentReference);
      setPostStateValue((prev) => ({
        ...prev,
        selectedPost: { id: postDoc.id, ...postDoc.data() } as Post,
      }));
    } catch (error) {
      console.log("fetchPost error: ", error);
    }
  };

  useEffect(() => {
    const { pid } = router.query;

    if (!postStateValue.selectedPost && pid) {
      fetchPost(pid as string);
    }
  }, [router.query, postStateValue.selectedPost]);
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
        {/* comments for selected post */}
      </>
      <>{/* about section */}</>
    </PageContent>
  );
};
export default PostPage;
