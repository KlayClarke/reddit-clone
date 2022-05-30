import {
  Alert,
  AlertIcon,
  AspectRatio,
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Skeleton,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import moment from "moment";
import React, { useState } from "react";
import { BsChat, BsDot } from "react-icons/bs";
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowRedoOutline,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoBookmarkOutline,
} from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai";
import { Post } from "../../atoms/postsAtom";
import { useRouter } from "next/router";
import { FaReddit } from "react-icons/fa";
import Link from "next/link";
import useCommunityData from "../../hooks/useCommunityData";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/clientApp";
import { Community } from "../../atoms/communitiesAtom";

type PostItemProps = {
  post: Post;
  userIsCreator: boolean;
  userVoteValue?: number;
  onVote: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post,
    vote: number,
    communityId: string
  ) => void;
  onSelectPost?: (post: Post) => void;
  onDeletePost: (post: Post) => Promise<boolean>;
  homePage?: boolean;
  imageURL?: string;
  videoURL?: string;
  ad?: boolean;
};

const PostItem: React.FC<PostItemProps> = ({
  post,
  userIsCreator,
  userVoteValue,
  onVote,
  onSelectPost,
  onDeletePost,
  homePage,
  imageURL,
  videoURL,
}) => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [loadingImage, setLoadingImage] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const { communityStateValue, onJoinOrLeaveCommunity, communities, loading } =
    useCommunityData();
  const singlePostPage = !onSelectPost;
  const [error, setError] = useState(false);
  const handleDelete = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setLoadingDelete(true);
    try {
      const success = await onDeletePost(post);
      if (!success) {
        throw new Error("Failed to delete post");
      }
      if (singlePostPage) {
        router.push(`/r/${post.communityId}`);
      }
    } catch (error: any) {
      setError(error.message);
    }
    setLoadingDelete(false);
  };
  return (
    <Flex
      border={"1px solid"}
      bg="white"
      borderColor={singlePostPage ? "white" : "gray.300"}
      borderRadius={singlePostPage ? "4px 4px 0px 0px" : "4px"}
      _hover={{
        borderColor: singlePostPage ? "none" : "gray.500",
      }}
      cursor={singlePostPage ? "unset" : "pointer"}
      onClick={() => onSelectPost && onSelectPost(post)}
    >
      <Flex
        direction={"column"}
        align={"center"}
        bg={singlePostPage ? "none" : "gray.100"}
        p={2}
        width={"40px"}
        borderRadius={singlePostPage ? "0" : "3px 0px 0px 3px"}
      >
        <Icon
          as={
            userVoteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline
          }
          color={userVoteValue === 1 ? "brand.100" : "gray.400"}
          fontSize={22}
          onClick={(event) => onVote(event, post, 1, post.communityId!)}
          cursor={"pointer"}
          _hover={{ bg: "gray.200", borderRadius: "sm", color: "brand.100" }}
        />
        <Text fontSize={"9pt"}>{post.voteStatus}</Text>
        <Icon
          as={
            userVoteValue === -1
              ? IoArrowDownCircleSharp
              : IoArrowDownCircleOutline
          }
          color={userVoteValue === -1 ? "#4379ff" : "gray.400"}
          fontSize={22}
          onClick={(event) => onVote(event, post, -1, post.communityId!)}
          cursor={"pointer"}
          _hover={{ bg: "gray.200", borderRadius: "sm", color: "#4379ff" }}
        />
      </Flex>
      <Flex direction={"column"} width={"100%"}>
        {error && (
          <Alert status="error">
            <AlertIcon />
            <Text>{error}</Text>
          </Alert>
        )}
        <Stack spacing={1} p={"10px"}>
          <Stack
            direction={"row"}
            spacing={0.6}
            align="center"
            fontSize={"9pt"}
            color={"gray.500"}
            justify={"space-between"}
          >
            <Flex align={"center"}>
              {homePage && (
                <>
                  {imageURL ? (
                    <Image
                      src={imageURL}
                      borderRadius={"full"}
                      boxSize={"18px"}
                      mr={2}
                    />
                  ) : (
                    <Icon
                      as={FaReddit}
                      fontSize={"18pt"}
                      mr={1}
                      color={"blue.500"}
                    />
                  )}
                  <Link href={`/r/${post.communityId}`}>
                    <Text
                      fontWeight={700}
                      _hover={{ textDecoration: "underline" }}
                      onClick={(event) => event.stopPropagation()}
                    >{`r/${post.communityId}`}</Text>
                  </Link>
                  <Icon as={BsDot} color={"gray.500"} fontSize={8} />
                </>
              )}
              <Text>
                Posted by u/{post.creatorDisplayName}{" "}
                <Box
                  as="span"
                  display={homePage ? { base: "none", sm: "unset" } : {}}
                >
                  {moment(new Date(post.createdAt?.seconds * 1000)).fromNow()}
                </Box>
              </Text>
            </Flex>
            <Flex>
              {homePage && (
                <Button
                  variant={
                    communityStateValue.mySnippets.find(
                      (x) => x.communityId === post.communityId
                    )
                      ? "outline"
                      : "solid"
                  }
                  height="25px"
                  pr={4}
                  pl={4}
                  onClick={(
                    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                  ) => {
                    event.stopPropagation();
                    onJoinOrLeaveCommunity(
                      communities.find(
                        (x) => x.id === post.communityId
                      ) as Community,
                      communityStateValue.mySnippets.find(
                        (x) => x.communityId === post.communityId
                      )
                        ? true
                        : false
                    );
                  }}
                  isLoading={loading}
                >
                  {communityStateValue.mySnippets.find(
                    (x) => x.communityId === post.communityId
                  )
                    ? "Joined"
                    : "Join"}
                </Button>
              )}
            </Flex>
          </Stack>
          <Text fontSize={"12pt"} fontWeight={600}>
            {post.title}
          </Text>
          {!homePage && <Text fontSize={"10pt"}>{post.body}</Text>}
          {post.imageURL && (
            <Flex justify={"center"} align={"center"}>
              {loadingImage && (
                <Skeleton height={"200px"} width={"100%"} borderRadius={4} />
              )}
              <Image
                src={post.imageURL}
                maxHeight={"460px"}
                alt="Post image"
                onLoad={() => setLoadingImage(false)}
                display={loadingImage ? "none" : "unset"}
              />
            </Flex>
          )}
          {post.videoURL && (
            <Flex justify={"center"} align={"center"}>
              <video
                controls
                src={post.videoURL}
                loop
                preload="auto"
                muted
              ></video>
            </Flex>
          )}
        </Stack>
        <Flex ml={1} mb={0.5} color={"gray.500"} fontWeight={800}>
          <Flex
            align={"center"}
            p={"8px 10px"}
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor={"pointer"}
          >
            <Icon as={BsChat} mr={2} />
            <Text fontSize={"9pt"}>
              {post.numberOfComments}{" "}
              <Box as={"span"} display={{ base: "none", md: "unset" }}>
                Comments
              </Box>{" "}
            </Text>
          </Flex>
          <Flex
            align={"center"}
            p={"8px 10px"}
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor={"pointer"}
          >
            <Icon as={IoArrowRedoOutline} mr={2} />
            <Text fontSize={"9pt"} display={{ base: "none", sm: "unset" }}>
              Share
            </Text>
          </Flex>
          <Flex
            align={"center"}
            p={"8px 10px"}
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor={"pointer"}
          >
            <Icon as={IoBookmarkOutline} mr={2} />
            <Text fontSize={"9pt"} display={{ base: "none", sm: "unset" }}>
              Save
            </Text>
          </Flex>
          {userIsCreator && (
            <Flex
              align={"center"}
              p={"8px 10px"}
              borderRadius={4}
              _hover={{ bg: "gray.200" }}
              cursor={"pointer"}
              onClick={handleDelete}
            >
              {loadingDelete ? (
                <Spinner size={"sm"} />
              ) : (
                <>
                  <Icon as={AiOutlineDelete} mr={2} />
                  <Text
                    fontSize={"9pt"}
                    display={{ base: "none", sm: "unset" }}
                  >
                    Delete
                  </Text>
                </>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
export default PostItem;
