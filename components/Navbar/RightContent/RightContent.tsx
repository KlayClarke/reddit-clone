import { Flex } from "@chakra-ui/react";
import { userInfo } from "os";
import React from "react";
import AuthModal from "../../Modal/Auth/AuthModal";
import AuthButtons from "./AuthButtons";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase/clientApp";

type RightContentProps = {};

const RightContent: React.FC<RightContentProps> = () => {
  const [user, loading, error] = useAuthState(auth);
  return (
    <>
      {/* <AuthModal/> */}
      <Flex justify={"center"} align={"center"}>
        <AuthModal />
        {user ? user.displayName?.toString().split(" ")[0] : <AuthButtons />}
      </Flex>
    </>
  );
};
export default RightContent;
