import { Stack } from "@chakra-ui/react";
import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useRecoilValue } from "recoil";
import { communityState } from "../atoms/communitiesAtom";
import { Post } from "../atoms/postsAtom";
import CreatePostLink from "../components/Community/CreatePostLink";
import PageContent from "../components/Layout/PageContent";
import PostItem from "../components/Posts/PostItem";
import PostLoader from "../components/Posts/PostLoader";
import { auth, firestore } from "../firebase/clientApp";
import usePosts from "../hooks/usePosts";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [user, loadingUser] = useAuthState(auth);
  const {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  } = usePosts();
  const communityStateValue = useRecoilValue(communityState);
  const buildUserHomeFeed = () => {};
  const buildNoUserHomeFeed = async () => {
    setLoading(true);
    try {
      const postQuery = query(
        collection(firestore, "posts"),
        orderBy("createdAt", "desc"),
        limit(10)
      );
      const postDocuments = await getDocs(postQuery);
      const posts = postDocuments.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));
    } catch (error) {
      console.log("buildNoUserHomeFeed error: ", error);
    }
    setLoading(false);
  };
  const getUserPostVotes = () => {};
  useEffect(() => {
    if (!user && !loadingUser) buildNoUserHomeFeed();
  }, [user, loadingUser]);
  return (
    <PageContent>
      <>
        <CreatePostLink />
        {loading ? (
          <PostLoader />
        ) : (
          <Stack>
            {postStateValue.posts.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                userIsCreator={post.creatorId === user?.uid}
                userVoteValue={
                  postStateValue.postVotes.find(
                    (item) => item.postId === post.id
                  )?.voteValue
                }
                onVote={onVote}
                onSelectPost={onSelectPost}
                onDeletePost={onDeletePost}
                homePage
              />
            ))}
          </Stack>
        )}
      </>
      <>{/* recommendations */}</>
    </PageContent>
  );
};

export default Home;
