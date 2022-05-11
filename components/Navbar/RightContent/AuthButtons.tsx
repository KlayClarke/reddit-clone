import { Button } from "@chakra-ui/react";
import React from "react";
import { useRecoilState } from "recoil";
import { AuthModalState } from "../../../atoms/authModalAtom";

const AuthButtons: React.FC = () => {
  const [modalState, setModalState] = useRecoilState(AuthModalState);
  return (
    <>
      <Button
        variant={"outline"}
        height="28px"
        display={{ base: "none", sm: "flex" }}
        width={{ base: "70px", md: "110px" }}
        mr={2}
        onClick={() => {
          setModalState((prev) => ({
            ...prev,
            open: true,
          }));
        }}
      >
        Log In
      </Button>
      <Button
        variant={"solid"}
        height={"28px"}
        display={{ base: "none", sm: "flex" }}
        width={{ base: "70px", md: "110px" }}
        mr={2}
        onClick={() => {
          setModalState((prev) => ({
            ...prev,
            open: true,
          }));
        }}
      >
        Sign Up
      </Button>
    </>
  );
};
export default AuthButtons;
