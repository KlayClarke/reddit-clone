import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import { useRecoilState } from "recoil";
import { AuthModalState } from "../../../atoms/authModalAtom";

type LoginProps = {};

const Login: React.FC<LoginProps> = () => {
  const [modalState, setModalState] = useRecoilState(AuthModalState);
  return (
    <form>
      <Flex fontSize={"9pt"} justifyContent={"center"}>
        <Text mr={1}>New to Reddit?</Text>
        <Text
          color={"blue.500"}
          fontWeight={700}
          cursor={"pointer"}
          onClick={() => {
            setModalState((prev) => ({
              ...prev,
              view: "signup",
            }));
          }}
        >
          SIGN UP
        </Text>
      </Flex>
    </form>
  );
};
export default Login;
