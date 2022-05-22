import {
  collection,
  doc,
  getDocs,
  increment,
  query,
  writeBatch,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";
import { AuthModalState } from "../atoms/authModalAtom";
import {
  Community,
  CommunitySnippet,
  communityState,
} from "../atoms/communitiesAtom";
import { auth, firestore } from "../firebase/clientApp";

const useCommunityData = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [user] = useAuthState(auth);
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);
  const setAuthModalState = useSetRecoilState(AuthModalState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const onJoinOrLeaveCommunity = (
    communityData: Community,
    isJoined: boolean
  ) => {
    // check if the user is signed in
    // if not, open auth modal and prompt user to sign in
    if (!user) {
      // open modal
      setAuthModalState({ open: true, view: "login" });
      return;
    }
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
        snippetsFetched: true,
      }));
    } catch (error) {
      console.log("getSnippets error:", error);
    }
    setLoading(false);
  };
  const joinCommunity = async (communityData: Community) => {
    setLoading(true);
    // create new community snippet and add to user document
    try {
      const batch = writeBatch(firestore);
      const newSnippet: CommunitySnippet = {
        communityId: communityData.id,
        imageURL: communityData.imageURL || "",
        isModerator: user?.uid === communityData.creatorId,
      };
      batch.set(
        doc(
          firestore,
          `users/${user?.uid}/communitySnippets`,
          communityData.id
        ),
        newSnippet
      );
      batch.update(doc(firestore, "communities", communityData.id), {
        numberOfMembers: increment(1), // update current community's number of members by +1
      });
      await batch.commit(); // to execute the batch write functions

      // update recoil state to reflect change
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [...prev.mySnippets, newSnippet],
      }));
      // add user to number of members in community state (temporary --> but will allow us to render numberOfMembers change in real time)
      const communityIndex = communities.indexOf(
        communities.find((x) => x.id === communityData.id) as Community
      );
      let newCommunities = communities;
      newCommunities[communityIndex].numberOfMembers += 1;
      setCommunities(newCommunities);
    } catch (error: any) {
      console.log("join community error:", error);
      setError(error.message);
    }
    setLoading(false);
  };
  const leaveCommunity = async (communityId: string) => {
    setLoading(true);
    try {
      const batch = writeBatch(firestore);
      // delete community snippet from user
      batch.delete(
        doc(firestore, `users/${user?.uid}/communitySnippets`, communityId)
      );
      // update current community's number of members by -1
      batch.update(doc(firestore, "communities", communityId), {
        numberOfMembers: increment(-1),
      });
      await batch.commit(); // to execute the batch write functions

      // update recoil state to reflect change
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: prev.mySnippets.filter(
          (item) => item.communityId !== communityId
        ),
      }));
      // subtract user from number of members in community state (temporary --> but will allow us to render numberOfMembers change in real time)
      const communityIndex = communities.indexOf(
        communities.find((x) => x.id === communityId) as Community
      );
      let newCommunities = communities;
      newCommunities[communityIndex].numberOfMembers -= 1;
      setCommunities(newCommunities);
    } catch (error: any) {
      console.log("leave community error: ", error);
      setError(error.message);
    }
    setLoading(false);
  };
  const fetchCommunities = async () => {
    setLoading(true);
    try {
      // create reference to "communities" collection in db
      const communitiesReference = collection(firestore, "communities");
      // query "communities" collection to compare to user's snippets
      const communitiesQuery = query(communitiesReference);
      const communityDocuments = await getDocs(communitiesQuery);
      const communities = communityDocuments.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCommunities(communities as Community[]);
    } catch (error) {
      console.log("fetchCommunities error: ", error);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchCommunities();
    if (!user) {
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [],
        snippetsFetched: false,
      }));
      return;
    }
    getSnippets();
  }, [user]);
  return {
    communityStateValue,
    communities,
    setCommunityStateValue,
    onJoinOrLeaveCommunity,
    loading,
  };
};
export default useCommunityData;
