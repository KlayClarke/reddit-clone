import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Flex,
  Icon,
  Text,
} from "@chakra-ui/react";
import React, { Dispatch, SetStateAction, useState } from "react";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { BiPoll } from "react-icons/bi";
import { IoDocumentText, IoImagesOutline } from "react-icons/io5";
import { Post } from "../../atoms/postsAtom";
import { User } from "firebase/auth";
import { useRouter } from "next/router";
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { firestore, storage } from "../../firebase/clientApp";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import useSelectFile from "../../hooks/useSelectFile";
import AdTextInputs from "./AdForm/AdTextInputs";
import TabItem from "../Posts/TabItem";
import ImageUpload from "../Posts/PostForm/ImageUpload";

type NewAdPostFormProps = {
  user?: User;
  adTitle: string;
  setAdTitle: Dispatch<SetStateAction<string>>;
  adLink: string;
  setAdLink: Dispatch<SetStateAction<string>>;
  selectedFile: string | undefined;
  setSelectedFile: Dispatch<SetStateAction<string | undefined>>;
  selectedTab: string;
  setSelectedTab: Dispatch<SetStateAction<string>>;
  onSelectFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
  formTabs: TabItem[];
};

export type TabItem = {
  title: string;
  icon: typeof Icon.arguments;
};

const NewAdPostForm: React.FC<NewAdPostFormProps> = ({
  user,
  adTitle,
  setAdTitle,
  adLink,
  setAdLink,
  selectedFile,
  setSelectedFile,
  selectedTab,
  setSelectedTab,
  onSelectFile,
  formTabs,
}) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const handleCreateAdPost = async () => {
    const newAdPost: Post = {
      creatorId: user!.uid,
      creatorDisplayName: user!.email!.split("@")[0],
      title: adTitle,
      link: adLink,
      numberOfComments: 0,
      voteStatus: 0,
      createdAt: serverTimestamp() as Timestamp,
    };
    setLoading(true);
    try {
      // store post in firestore database
      const postDocumentReference = await addDoc(
        collection(firestore, "adposts"),
        newAdPost
      );
      // check for selected file
      if (selectedFile) {
        // store file in storage
        const imageRef = ref(
          storage,
          `posts/${postDocumentReference.id}/image`
        );
        await uploadString(imageRef, selectedFile, "data_url");
        const downloadURL = await getDownloadURL(imageRef);

        // update post document by adding image url
        await updateDoc(postDocumentReference, {
          imageURL: downloadURL,
        });
      }
      // redirect user back to community page using the router
      router.back();
    } catch (error: any) {
      console.log("handleCreatePost error", error.message);
      setError(true);
    }
    setLoading(false);
  };

  const onTitleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setAdTitle(event.target.value);
  };
  const onLinkChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event.target.value.includes("https://")) setAdLink(event.target.value);
  };
  return (
    <Flex
      direction={"column"}
      bg={"white"}
      borderRadius={4}
      mt={2}
      width={"100%"}
    >
      <Flex width={"100%"}>
        {formTabs.map((item) => (
          <TabItem
            key={item.title}
            item={item}
            selected={item.title === selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </Flex>
      <Flex p={4}>
        {selectedTab === "Post" && (
          <AdTextInputs
            adTitle={adTitle}
            adLink={adLink}
            onTitleChange={onTitleChange}
            handleCreateAdPost={handleCreateAdPost}
            loading={loading}
            onLinkChange={onLinkChange}
            user={user}
          />
        )}
        {selectedTab === "Images & Video" && (
          <ImageUpload
            selectedFile={selectedFile}
            onSelectImage={onSelectFile}
            setSelectedFile={setSelectedFile}
            setSelectedTab={setSelectedTab}
          />
        )}
      </Flex>
      {error && (
        <Alert status="error">
          <AlertIcon />
          <Text>Error during post creation. Please try again!</Text>
        </Alert>
      )}
    </Flex>
  );
};
export default NewAdPostForm;
