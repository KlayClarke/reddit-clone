import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Flex,
} from "@chakra-ui/react";
import React from "react";
import { useRecoilState } from "recoil";
import { AuthModalState } from "../../../atoms/authModalAtom";
import Login from "./Login";
import OAuthButtons from "./OAuthButtons";
import Signup from "./Signup";

const AuthModal: React.FC = () => {
  const [modalState, setModalState] = useRecoilState(AuthModalState);
  const handleClose = () => {
    setModalState((prev) => ({
      ...prev,
      open: false,
    }));
  };
  return (
    <>
      <Modal isOpen={modalState.open} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {modalState.view === "login"
              ? "Log In"
              : modalState.view === "signup"
              ? "Sign Up"
              : ""}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Flex
              direction={"column"}
              align={"center"}
              justify={"center"}
              width={"70%"}
            >
              <OAuthButtons />
              <Flex direction={"column"} align={"center"} width={"100%"} mt={4}>
                {modalState.view === "signup" ? (
                  <Signup />
                ) : modalState.view === "login" ? (
                  <Login />
                ) : (
                  ""
                )}
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default AuthModal;
