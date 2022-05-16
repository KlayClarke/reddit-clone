import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React from "react";
import { Community } from "../../../atoms/communitiesAtom";
import { firestore } from "../../../firebase/clientApp";
import safeJsonStringify from "safe-json-stringify";

type CommunityPageProps = {
  communityData: Community;
};

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
  return <div>{communityData.id}</div>;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // get community data and pass to client
  try {
    const communityDocumentReference = doc(
      firestore,
      "communities",
      context.query.communityId as string
    );
    const communityDocument = await getDoc(communityDocumentReference);
    return {
      props: {
        communityData: JSON.parse(
          safeJsonStringify({
            id: communityDocument.id,
            ...communityDocument.data(),
          })
        ), // extract data from community document
      },
    };
  } catch (error) {
    console.log("getServerSideProps error on community page", error);
  }
}

export default CommunityPage;
