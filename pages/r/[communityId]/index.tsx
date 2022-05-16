import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React from "react";
import { Community } from "../../../atoms/communitiesAtom";
import { firestore } from "../../../firebase/clientApp";
import safeJsonStringify from "safe-json-stringify";
import NotFound from "../../../components/Community/NotFound";
import Header from "../../../components/Community/Header";
import PageContent from "../../../components/Layout/PageContent";

type CommunityPageProps = {
  communityData: Community;
};

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
  if (!communityData) {
    return <NotFound />;
  }
  return (
    <>
      <Header communityData={communityData} />
      <PageContent>
        <>
          <div>Left</div>
        </>
        <>
          <div>Right</div>
        </>
      </PageContent>
    </>
  );
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
        communityData: communityDocument.exists()
          ? JSON.parse(
              safeJsonStringify({
                id: communityDocument.id,
                ...communityDocument.data(),
              })
            )
          : "", // extract data from community document
      },
    };
  } catch (error) {
    console.log("getServerSideProps error on community page", error);
  }
}

export default CommunityPage;
