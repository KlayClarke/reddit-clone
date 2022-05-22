import { Button, Flex, Input, Stack, Textarea } from "@chakra-ui/react";
import { User } from "firebase/auth";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase/clientApp";

type AdTextInputsProps = {
  adTitle: string;
  adLink: string;
  onTitleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onLinkChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleCreateAdPost: () => void;
  loading: boolean;
  user?: User;
};

const AdTextInputs: React.FC<AdTextInputsProps> = ({
  adTitle,
  adLink,
  onTitleChange,
  onLinkChange,
  handleCreateAdPost,
  loading,
  user,
}) => {
  return (
    <Stack spacing={3} width={"100%"}>
      <Input
        name="title"
        fontSize={"10pt"}
        borderRadius={4}
        placeholder={"Title"}
        _placeholder={{ color: "gray.500" }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "black",
        }}
        value={adTitle}
        onChange={onTitleChange}
      />
      <Input
        name="link"
        fontSize={"10pt"}
        borderRadius={4}
        placeholder={"Link"}
        _placeholder={{ color: "gray.500" }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "black",
        }}
        value={adLink}
        onChange={onLinkChange}
      />
      <Flex justify={"flex-end"}>
        <Button
          height={"34px"}
          padding={"0px 30px"}
          disabled={!adTitle}
          isLoading={loading}
          onClick={handleCreateAdPost}
        >
          Post
        </Button>
      </Flex>
    </Stack>
  );
};
export default AdTextInputs;
