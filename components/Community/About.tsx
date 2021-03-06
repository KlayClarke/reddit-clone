import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Image,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaReddit } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiCakeLine } from "react-icons/ri";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Community, communityState } from "../../atoms/communitiesAtom";
import { auth, firestore, storage } from "../../firebase/clientApp";
import useCommunityData from "../../hooks/useCommunityData";
import useSelectFile from "../../hooks/useSelectFile";

type AboutProps = {
  communityData: Community;
  postPage?: boolean;
};

const About: React.FC<AboutProps> = ({ communityData, postPage }) => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const selectedFileRef = useRef<HTMLInputElement>(null);
  const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const setCommunityStateValue = useSetRecoilState(communityState);
  const communityStateValue = useRecoilValue(communityState);
  const mySnippets = useRecoilValue(communityState).mySnippets;
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const checkIfJoined = () => {
    return !!communityStateValue.mySnippets.find(
      (item) => item.communityId === communityData.id
    );
  };
  const { loading, onJoinOrLeaveCommunity, communities } = useCommunityData();
  const onUpdateImage = async () => {
    if (!selectedFile) return; // if there is no file to upload, exit function
    setUploadingImage(true);
    try {
      const imageRef = ref(storage, `communities/${communityData.id}/image`);
      await uploadString(imageRef, selectedFile, "data_url");
      const downloadURL = await getDownloadURL(imageRef);
      await updateDoc(doc(firestore, "communities", communityData.id), {
        imageURL: downloadURL,
      });
      // update community state image url
      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: {
          ...prev.currentCommunity,
          imageURL: downloadURL,
        } as Community,
      }));
    } catch (error) {
      console.log("error onUpdateImage: ", error);
    }
    setSelectedFile("");
    setUploadingImage(false);
  };
  useEffect(() => {
    setIsJoined(checkIfJoined());
  }, [communityStateValue.mySnippets]);
  return (
    <Box position={"sticky"} top={"14px"}>
      <Flex
        justify={"space-between"}
        align={"center"}
        bg={"blue.400"}
        color={"white"}
        p={!postPage ? 3 : 5}
        borderRadius={"4px 4px 0px 0px"}
      >
        {!postPage && (
          <>
            <Text fontSize={"10pt"} fontWeight={700}>
              About Community
            </Text>
            <Icon as={HiOutlineDotsHorizontal} />
          </>
        )}
      </Flex>
      <Flex
        direction={"column"}
        p={3}
        bg={"white"}
        borderRadius={"0px 0px 4px 4px"}
      >
        <Stack>
          {postPage && (
            <Link href={`/r/${communityData.id}`}>
              <Flex align={"center"} _hover={{ cursor: "pointer" }}>
                <Image
                  src={communityData.imageURL}
                  borderRadius={"full"}
                  boxSize={"50px"}
                  alt={"community image"}
                  mr={2}
                />
                <Text
                  fontWeight={700}
                  _hover={{ cursor: "pointer", textDecoration: "underline" }}
                >{`r/${communityData.id}`}</Text>
              </Flex>
            </Link>
          )}
          <Flex width={"100%"} p={2} fontSize={"10pt"} fontWeight={700}>
            <Flex direction={"column"} flexGrow={1}>
              <Text>
                {communities &&
                  communities
                    .find((x) => x.id === communityData.id)
                    ?.numberOfMembers.toLocaleString()}
              </Text>
              <Text>Members</Text>
            </Flex>
            <Flex direction={"column"} flexGrow={1}>
              <Text>1</Text>
              <Text>Online</Text>
            </Flex>
          </Flex>
          <Divider />
          <Flex
            align={"center"}
            width={"100%"}
            p={1}
            fontWeight={500}
            fontSize={"10pt"}
          >
            <Icon as={RiCakeLine} fontSize={18} mr={2} />
            {communityData.createdAt && (
              <Text>
                Created{" "}
                {moment(
                  new Date(communityData.createdAt.seconds * 1000)
                ).format("MMM DD, YYYY")}
              </Text>
            )}
          </Flex>
          <Button
            variant={isJoined ? "outline" : "solid"}
            height="30px"
            pr={6}
            pl={6}
            onClick={() => {
              onJoinOrLeaveCommunity(communityData, isJoined);
            }}
            isLoading={loading}
          >
            {isJoined ? "Joined" : "Join"}
          </Button>
          {user && isJoined && (
            <Link href={`/r/${communityData.id}/submit`}>
              <Button mt={3} height={"30px"}>
                Create Post
              </Button>
            </Link>
          )}
          {user?.uid === communityData.creatorId && (
            <>
              <Divider />
              <Stack spacing={1} fontSize={"10pt"}>
                <Text fontWeight={600}>Admin</Text>
                <Flex align={"center"} justify={"space-between"}>
                  <Text
                    color={"blue.500"}
                    cursor={"pointer"}
                    _hover={{ textDecoration: "underline" }}
                    onClick={() => selectedFileRef.current?.click()}
                  >
                    Change Image
                  </Text>
                  {communityData.imageURL || selectedFile ? (
                    <Image
                      src={selectedFile || communityData.imageURL}
                      borderRadius={"full"}
                      boxSize={"40px"}
                      alt={selectedFile ? "selected image" : "community image"}
                    />
                  ) : (
                    <Icon
                      as={FaReddit}
                      fontSize={40}
                      color={"brand.100"}
                      mr={4}
                    />
                  )}
                </Flex>
                {selectedFile &&
                  (uploadingImage ? (
                    <Spinner />
                  ) : (
                    <Text
                      color={"blue.500"}
                      cursor={"pointer"}
                      _hover={{ textDecoration: "underline" }}
                      onClick={onUpdateImage}
                    >
                      Save Changes
                    </Text>
                  ))}
                <input
                  id="file-upload"
                  type={"file"}
                  accept={"image/x-png,image.gif,image/jpeg"}
                  hidden
                  ref={selectedFileRef}
                  onChange={onSelectFile}
                />
              </Stack>
            </>
          )}
        </Stack>
      </Flex>
    </Box>
  );
};
export default About;
