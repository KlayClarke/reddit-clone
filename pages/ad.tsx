import { Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { IoDocumentText, IoImagesOutline } from "react-icons/io5";
import AdPreview from "../components/Ads/AdPreview";
import NewAdPostForm, { TabItem } from "../components/Ads/NewAdForm";
import PageContent from "../components/Layout/PageContent";
import { auth } from "../firebase/clientApp";
import usePosts from "../hooks/usePosts";
import useSelectFile from "../hooks/useSelectFile";

const formTabs: TabItem[] = [
  {
    title: "Post",
    icon: IoDocumentText,
  },
  {
    title: "Images & Video",
    icon: IoImagesOutline,
  },
];

type adProps = {};

const ad: React.FC<adProps> = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const { onVote, onSelectPost, onDeletePost } = usePosts();
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();
  const [adTitle, setAdTitle] = useState("");
  const [adLink, setAdLink] = useState("https://");
  return (
    <PageContent>
      <>
        <AdPreview
          adTitle={adTitle}
          adLink={adLink}
          selectedFile={selectedFile}
        />
      </>
      <>
        <NewAdPostForm
          user={user!}
          adTitle={adTitle}
          setAdTitle={setAdTitle}
          adLink={adLink}
          setAdLink={setAdLink}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          formTabs={formTabs}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          onSelectFile={onSelectFile}
        />
      </>
    </PageContent>
  );
};
export default ad;
