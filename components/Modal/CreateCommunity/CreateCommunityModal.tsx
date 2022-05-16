import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  Divider,
  Text,
  Input,
  Stack,
  Checkbox,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BsFillPersonFill, BsFillEyeFill } from "react-icons/bs";
import { HiLockClosed } from "react-icons/hi";
import { auth, firestore } from "../../../firebase/clientApp";

type CreateCommunityModalProps = {
  open: boolean;
  handleClose: () => void;
};

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
  open,
  handleClose,
}) => {
  const [user] = useAuthState(auth);
  const [communityName, setCommunityName] = useState("");
  const [charsRemaining, setCharsRemaining] = useState(21);
  const [communityType, setCommunityType] = useState("public");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 21) return;
    setCommunityName(event.target.value);
    setCharsRemaining(21 - event.target.value.length);
  };
  const onCommunityTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCommunityType(event.target.name);
  };
  const handleCreateCommunity = async () => {
    // validate community name
    const format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (format.test(communityName)) {
      setError(
        "Community names can only contain letters, numbers and underscores"
      );
      return;
    }

    // set loading state to true while app is connecting to firestore database
    setLoading(true);

    try {
      // check that name is unique -- if unique, create community
      const communityDocumentReference = doc(
        // get reference of document with same name in communities db
        firestore,
        "communities",
        communityName
      );
      const communityDoc = await getDoc(communityDocumentReference); // find document based on reference / check if exists
      if (communityDoc.exists()) {
        // if community doc exists
        throw new Error(
          `The name r/${communityName} is already taken. Please try another!`
        );
      }
      // create community (only runs if community name is unique and valid)
      await setDoc(communityDocumentReference, {
        creatorId: user?.uid,
        createdAt: serverTimestamp(), // create timestamp of current time
        numberOfMembers: 1,
        privacyType: communityType,
      });
    } catch (error: any) {
      console.log("handleCreateCommunity", error);
      setError(error.message);
    }

    // set loading state to false after document creation is complete
    setLoading(false);
  };
  return (
    <>
      <Modal isOpen={open} onClose={handleClose} size={"lg"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display={"flex"}
            flexDirection={"column"}
            fontSize={15}
            padding={3}
          >
            Create A Community
          </ModalHeader>
          <Box pl={3} pr={3}>
            <Divider />
            <ModalCloseButton />
            <ModalBody
              display={"flex"}
              flexDirection={"column"}
              padding={"10px 0px"}
            >
              <Text fontWeight={600} fontSize={15}>
                Name
              </Text>
              <Text fontSize={11} color={"gray.500"}>
                Community names including capitalization cannot be changed
              </Text>
              <Text
                position={"relative"}
                top={"28px"}
                left={"10px"}
                width={"20px"}
                color={"gray.400"}
              >
                r/
              </Text>
              <Input
                position={"relative"}
                value={communityName}
                size={"sm"}
                pl={"22px"}
                onChange={handleChange}
              />
              <Text
                color={charsRemaining === 0 ? "red" : "gray.500"}
                fontSize={"9pt"}
              >
                {charsRemaining} characters remaining
              </Text>
              <Text fontSize={"9pt"} color={"red"} pt={1}>
                {error}
              </Text>
              <Box mt={4} mb={4}>
                <Text fontWeight={600} fontSize={15}>
                  Community Type
                </Text>
                <Stack spacing={2}>
                  <Checkbox
                    name="public"
                    onChange={onCommunityTypeChange}
                    isChecked={communityType === "public" ? true : false}
                  >
                    <Flex align={"center"}>
                      <Icon as={BsFillPersonFill} color={"gray.500"} mr={2} />
                      <Text fontSize={"10pt"} mr={1}>
                        Public
                      </Text>
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    name="restricted"
                    onChange={onCommunityTypeChange}
                    isChecked={communityType === "restricted" ? true : false}
                  >
                    <Flex align={"center"}>
                      <Icon as={BsFillEyeFill} color={"gray.500"} mr={2} />
                      <Text fontSize={"10pt"} mr={1}>
                        Restricted
                      </Text>
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    name="private"
                    onChange={onCommunityTypeChange}
                    isChecked={communityType === "private" ? true : false}
                  >
                    <Flex align={"center"}>
                      <Icon as={HiLockClosed} color={"gray.500"} mr={2} />
                      <Text fontSize={"10pt"} mr={1}>
                        Private
                      </Text>
                    </Flex>
                  </Checkbox>
                </Stack>
              </Box>
            </ModalBody>
          </Box>
          <ModalFooter bg={"gray.100"} borderRadius={"0px 0px 10px 10px"}>
            <Button
              variant={"outline"}
              height={"30px"}
              mr={3}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              variant={"solid"}
              height={"30px"}
              onClick={handleCreateCommunity}
              isLoading={loading}
            >
              Create Community
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CreateCommunityModal;
