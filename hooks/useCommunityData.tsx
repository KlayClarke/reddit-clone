import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";
import {
  Community,
  CommunitySnippet,
  communityState,
} from "../atoms/communitiesAtom";
import { auth, firestore } from "../firebase/clientApp";

const useCommunityData = () => {
  const [user] = useAuthState(auth);
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const onJoinOrLeaveCommunity = (
    communityData: Community,
    isJoined: boolean
  ) => {
    // check if the user is signed in
    // if not, open auth modal and prompt user to sign in
    if (isJoined) {
      leaveCommunity(communityData.id);
      return;
    }
    joinCommunity(communityData);
  };
  const getSnippets = async () => {
    setLoading(true);
    try {
      const snippetDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/communitySnippets`)
      );
      const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: snippets as CommunitySnippet[],
      }));
    } catch (error) {
      console.log("getSnippets error:", error);
    }
    setLoading(false);
  };
  const joinCommunity = (communityData: Community) => {};
  const leaveCommunity = (communityId: string) => {};
  useEffect(() => {
    if (!user) return;
    getSnippets();
  }, [user]);
  return {
    communityStateValue,
    onJoinOrLeaveCommunity,
    loading,
  };
};
export default useCommunityData;
