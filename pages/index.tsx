import { Stack } from "@chakra-ui/react";
import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { communityState } from "../atoms/communitiesAtom";
import { Post } from "../atoms/postsAtom";
import AdItem from "../components/Ads/AdItem";
import CreatePostLink from "../components/Community/CreatePostLink";
import Recommendations from "../components/Community/Recommendations";
import PopularPosts from "../components/Homepage/PopularPosts";
import TrendingToday from "../components/Homepage/TrendingToday";
import PageContent from "../components/Layout/PageContent";
import PostItem from "../components/Posts/PostItem";
import PostLoader from "../components/Posts/PostLoader";
import { auth, firestore } from "../firebase/clientApp";
import useCommunityData from "../hooks/useCommunityData";
import usePosts from "../hooks/usePosts";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [adLoading, setAdLoading] = useState(true);
  const [adPost, setAdPost] = useState<Post>();
  const [user, loadingUser] = useAuthState(auth);
  const {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  } = usePosts();
  const { communityStateValue, communities } = useCommunityData();
  const setCommunityStateValue = useSetRecoilState(communityState);
  const buildUserHomeFeed = async () => {
    setLoading(true);
    try {
      if (communityStateValue.mySnippets.length) {
        // if user is member of some communities
        const myCommunityIds = communityStateValue.mySnippets.map(
          (snippet) => snippet.communityId
        );
        const postQuery = query(
          collection(firestore, "posts"),
          orderBy("createdAt", "desc"),
          where("communityId", "in", myCommunityIds),
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
      } else {
        // if user is member of no communities, render random posts using noUser function
        buildNoUserHomeFeed();
      }
    } catch (error) {
      console.log("buildUserHomeFeed error: ", error);
    }
    setLoading(false);
  };
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
  const fetchAd = async () => {
    try {
      const adQuery = query(
        collection(firestore, "adposts"),
        where(
          "creatorId",
          "==",
          process.env.NEXT_PUBLIC_FIREBASE_ADMIN_CREATOR_ID
        ),
        orderBy("createdAt", "desc")
      );
      const adDocuments = await getDocs(adQuery);
      const ads = adDocuments.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAdPost(ads[0] as Post);
      setAdLoading(false);
    } catch (error) {
      console.log("fetchAd error: ", error);
    }
  };
  useEffect(() => {
    // clear current community when user directs to home page
    setCommunityStateValue((prev) => ({
      ...prev,
      currentCommunity: undefined,
    }));
    // fetch ad post to display above PostItems
    fetchAd();
  }, []);
  useEffect(() => {
    if (
      communityStateValue.snippetsFetched &&
      communityStateValue.mySnippets.length >= 3
    )
      buildUserHomeFeed();
  }, [
    communityStateValue.snippetsFetched,
    communityStateValue.mySnippets.length,
    adPost,
  ]);
  useEffect(() => {
    if (!user || (communityStateValue.mySnippets.length < 3 && !loadingUser))
      buildNoUserHomeFeed();
  }, [user, loadingUser, communityStateValue.mySnippets.length, adPost]);

  return (
    <>
      <TrendingToday />
      <PageContent>
        <>
          <PopularPosts />
          {loading ? (
            <PostLoader />
          ) : (
            <Stack>
              {!adLoading && adPost && (
                <AdItem
                  adTitle={adPost.title}
                  adLink={adPost.link}
                  imageURL={adPost.imageURL}
                />
              )}
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
                  imageURL={
                    communities.find(
                      (community) => community.id === post.communityId
                    )?.imageURL
                  }
                />
              ))}
            </Stack>
          )}
        </>
        <>
          <Recommendations />
        </>
      </PageContent>
    </>
  );
};

export default Home;
