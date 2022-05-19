import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import PageContent from "../../../../components/Layout/PageContent";
import PostItem from "../../../../components/Posts/PostItem";
import { auth } from "../../../../firebase/clientApp";
import usePosts from "../../../../hooks/usePosts";

const PostPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const { postStateValue, setPostStateValue, onDeletePost, onVote } =
    usePosts();
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
