import { Flex, Icon, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { BiPoll } from "react-icons/bi";
import { IoDocumentText, IoImagesOutline } from "react-icons/io5";
import TabItem from "./TabItem";
import TextInputs from "./PostForm/TextInputs";

type NewPostFormProps = {};

const formTabs: TabItem[] = [
  {
    title: "Post",
    icon: IoDocumentText,
  },
  {
    title: "Images & Video",
    icon: IoImagesOutline,
  },
  {
    title: "Link",
    icon: BsLink45Deg,
  },
  {
    title: "Poll",
    icon: BiPoll,
  },
  {
    title: "Talk",
    icon: BsMic,
  },
];

export type TabItem = {
  title: string;
  icon: typeof Icon.arguments;
};

const NewPostForm: React.FC<NewPostFormProps> = () => {
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [textInputs, setTextInputs] = useState({
    title: "",
    body: "",
  });
  const [selectedFile, setSelectedFile] = useState<string>();
  const [loading, setLoading] = useState(false);
  const handleCreatePost = () => {};
  const onSelectImage = () => {};
  const onTextChange = () => {};
  return (
    <Flex direction={"column"} bg={"white"} borderRadius={4} mt={2}>
      <Flex width={"100%"}>
        {formTabs.map((item) => (
          <TabItem
            item={item}
            selected={item.title === selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </Flex>
      <Flex p={4}>
        <TextInputs
          textInputs={textInputs}
          onChange={onTextChange}
          handleCreatePost={handleCreatePost}
          loading={loading}
        />
      </Flex>
    </Flex>
  );
};
export default NewPostForm;
