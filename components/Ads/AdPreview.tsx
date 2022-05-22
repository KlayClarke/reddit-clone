import {
  Flex,
  Icon,
  Alert,
  AlertIcon,
  Stack,
  Box,
  Button,
  Skeleton,
  Spinner,
  Text,
  Image,
} from "@chakra-ui/react";
import moment from "moment";
import error from "next/error";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { AiOutlineDelete } from "react-icons/ai";
import { BsDot, BsChat } from "react-icons/bs";
import { FaReddit } from "react-icons/fa";
import {
  IoArrowUpCircleSharp,
  IoArrowUpCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowDownCircleOutline,
  IoArrowRedoOutline,
  IoBookmarkOutline,
} from "react-icons/io5";
import { Community } from "../../atoms/communitiesAtom";
import { Post } from "../../atoms/postsAtom";
import { auth } from "../../firebase/clientApp";
import useCommunityData from "../../hooks/useCommunityData";

type AdPreviewProps = {
  notPreview?: boolean;
  adTitle: string;
  adLink?: string;
  selectedFile?: string;
  imageURL?: string;
};

const AdPreview: React.FC<AdPreviewProps> = ({
  adTitle,
  adLink,
  imageURL,
  selectedFile,
  notPreview,
}) => {
  const [loadingImage, setLoadingImage] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();
  const { loading } = useCommunityData();
  const [user] = useAuthState(auth);
  return (
    <Flex
      border={"1px solid"}
      bg="white"
      borderColor={"gray.300"}
      borderRadius={"4px"}
      maxWidth={!notPreview ? "500px" : ""}
      width={"100%"}
    >
      <Flex
        direction={"column"}
        align={"center"}
        bg={"gray.100"}
        p={2}
        width={"40px"}
        borderRadius={"3px 0px 0px 3px"}
      >
        <Icon
          as={IoArrowUpCircleOutline}
          color={"gray.400"}
          fontSize={22}
          cursor={"pointer"}
          _hover={{ bg: "gray.200", borderRadius: "sm", color: "brand.100" }}
        />
        <Text fontSize={"9pt"}>0</Text>
        <Icon
          as={IoArrowDownCircleOutline}
          color={"gray.400"}
          fontSize={22}
          cursor={"pointer"}
          _hover={{ bg: "gray.200", borderRadius: "sm", color: "#4379ff" }}
        />
      </Flex>
      <Flex direction={"column"} maxWidth={"450px"} width={"100%"}>
        {error && (
          <Alert status="error">
            <AlertIcon />
            <Text>{error}</Text>
          </Alert>
        )}
        <Stack spacing={1} p={"10px"} maxWidth={"500px"}>
          <Stack
            direction={"row"}
            spacing={0.6}
            align="center"
            fontSize={"9pt"}
            color={"gray.500"}
            justify={"space-between"}
          >
            <Flex align={"center"}>
              <>
                <Text fontWeight={700} color={"blue.500"}>
                  PROMOTED
                </Text>
              </>
            </Flex>
          </Stack>
          <Text
            fontSize={"12pt"}
            fontWeight={600}
            maxWidth={"100%"}
            isTruncated={true}
          >
            {adTitle}
          </Text>
          {adLink && adLink.length > 8 && (
            <Link href={adLink}>
              <a target={"_blank"}>
                <Text
                  fontSize={"10pt"}
                  color={"blue.500"}
                  isTruncated={true}
                  _hover={{ cursor: "pointer", textDecoration: "underline" }}
                >
                  {adLink}
                </Text>
              </a>
            </Link>
          )}
          {(imageURL || selectedFile) && (
            <Flex justify={"center"} align={"center"}>
              {(!selectedFile || loadingImage) && (
                <Skeleton height={"200px"} width={"100%"} borderRadius={4} />
              )}
              {(selectedFile || imageURL) && (
                <Image
                  maxHeight={"460px"}
                  alt="Post image"
                  onLoad={() => setLoadingImage(false)}
                  display={loadingImage ? "none" : "unset"}
                  maxWidth={"100%"}
                  src={selectedFile ? selectedFile : imageURL}
                />
              )}
            </Flex>
          )}
        </Stack>
      </Flex>
    </Flex>
  );
};
export default AdPreview;
