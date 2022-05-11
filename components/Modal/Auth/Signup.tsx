import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import { useRecoilState } from "recoil";
import { AuthModalState } from "../../../atoms/authModalAtom";

type SignupProps = {};

const Signup: React.FC<SignupProps> = () => {
  const [modalState, setModalState] = useRecoilState(AuthModalState);
  return (
    <form>
      <Flex fontSize={"9pt"} justifyContent={"center"}>
        <Text mr={1}>Already a redditor?</Text>
        <Text
          color={"blue.500"}
          fontWeight={700}
          cursor={"pointer"}
          onClick={() => {
            setModalState((prev) => ({
              ...prev,
              view: "login",
            }));
          }}
        >
          LOG IN
        </Text>
      </Flex>
    </form>
  );
};
export default Signup;
