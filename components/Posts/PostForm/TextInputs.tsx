import { Button, Flex, Input, Stack, Textarea } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase/clientApp";

type TextInputsProps = {
  textInputs: {
    title: string;
    body: string;
  };
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleCreatePost: () => void;
  loading: boolean;
};

const TextInputs: React.FC<TextInputsProps> = ({
  textInputs,
  onChange,
  handleCreatePost,
  loading,
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
        value={textInputs.title}
        onChange={onChange}
      />
      <Textarea
        name="body"
        fontSize={"10pt"}
        borderRadius={4}
        height={"100px"}
        placeholder={"Text (Optional)"}
        _placeholder={{ color: "gray.500" }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "black",
        }}
        value={textInputs.body}
        onChange={onChange}
      />
      <Flex justify={"flex-end"}>
        <Button
          height={"34px"}
          padding={"0px 30px"}
          disabled={!textInputs.title}
          isLoading={loading}
          onClick={handleCreatePost}
        >
          Post
        </Button>
      </Flex>
    </Stack>
  );
};
export default TextInputs;
