import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BsDashLg } from "react-icons/bs";
import { FaReddit } from "react-icons/fa";
import { HiOutlineChevronDown, HiOutlineChevronUp } from "react-icons/hi";
import { VscDash } from "react-icons/vsc";
import { Community, communityState } from "../../atoms/communitiesAtom";
import { auth } from "../../firebase/clientApp";
import useCommunityData from "../../hooks/useCommunityData";

const Recommendations: React.FC = () => {
  const [user] = useAuthState(auth);
  const [topCommunities, setTopCommunities] = useState<Community[]>([]);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const { communityStateValue, communities, onJoinOrLeaveCommunity, loading } =
    useCommunityData();
  const getCommunityRecommendations = () => {
    setTopCommunities(communities);
    setTimeout(() => {
      setLoadingFetch(false);
    }, 3000);
  };
  const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * max);
  };
  useEffect(() => {
    getCommunityRecommendations();
  }, [communities, user]);
  return (
    <Flex
      direction={"column"}
      bg={"white"}
      borderRadius={4}
      border={"1px solid"}
      borderColor={"gray.300"}
      maxWidth={"324px"}
    >
      <Flex
        align={"flex-end"}
        color={"white"}
        p={"6px 10px"}
        height={"80px"}
        borderRadius={"4px 4px 0px 0px"}
        fontWeight={700}
        bgImage={"url(/images/recCommsArt.png)"}
        backgroundSize={"cover"}
        bgGradient={
          "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.75)), url('images/recCommsArt.png')"
        }
      >
        Top Communities
      </Flex>
      <Flex direction={"column"}>
        {loadingFetch ? (
          <Stack mt={2} p={3}>
            <Flex justify={"space-between"} align={"center"}>
              <SkeletonCircle size={"10"} />
              <Skeleton height={"20px"} width={"80%"} />
            </Flex>
            <Flex justify={"space-between"} align={"center"}>
              <SkeletonCircle size={"10"} />
              <Skeleton height={"20px"} width={"80%"} />
            </Flex>
            <Flex justify={"space-between"} align={"center"}>
              <SkeletonCircle size={"10"} />
              <Skeleton height={"20px"} width={"80%"} />
            </Flex>
          </Stack>
        ) : (
          <>
            {topCommunities.map((community, index) => {
              const isJoined = !!communityStateValue.mySnippets.find(
                (snippet) => snippet.communityId === community.id
              );
              return (
                <Link key={community.id} href={`/r/${community.id}`}>
                  <Flex
                    align={"center"}
                    fontSize={"10pt"}
                    borderBottom={"1px solid"}
                    borderColor={"gray.200"}
                    p={"12px 12px"}
                    _hover={{ cursor: "pointer" }}
                  >
                    <Flex width={"5%"} align={"center"}>
                      <Text fontWeight={700}>{index + 1}</Text>
                    </Flex>
                    <Flex align={"center"} width={"90%"}>
                      {getRandomInt(3) === 2 &&
                      index !== topCommunities.length - 1 ? (
                        <>
                          <Icon
                            as={HiOutlineChevronUp}
                            fontSize={17}
                            mr={2}
                            color={"green.400"}
                          />
                        </>
                      ) : getRandomInt(3) === 1 && index > 0 ? (
                        <>
                          <Icon
                            as={HiOutlineChevronDown}
                            fontSize={17}
                            mr={2}
                            color={"red.400"}
                          />
                        </>
                      ) : getRandomInt(3) === 0 ? (
                        <>
                          <Icon
                            as={VscDash}
                            fontSize={17}
                            mr={2}
                            color={"black"}
                            visibility={"hidden"}
                          />
                        </>
                      ) : (
                        <>
                          <Icon
                            as={VscDash}
                            fontSize={17}
                            mr={2}
                            color={"black"}
                            visibility={"hidden"}
                          />
                        </>
                      )}

                      {community.imageURL ? (
                        <Image
                          src={community.imageURL}
                          borderRadius={"full"}
                          boxSize={"28px"}
                          mr={2}
                        />
                      ) : (
                        <Icon
                          as={FaReddit}
                          fontSize={30}
                          color={"brand.100"}
                          mr={2}
                        />
                      )}
                      <Text
                        fontWeight={700}
                        maxWidth={"50%"}
                        isTruncated
                      >{`r/${community.id}`}</Text>
                    </Flex>
                    <Button
                      variant={
                        communityStateValue.mySnippets.find(
                          (x) => x.communityId === community.id
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
                            (x) => x.id === community.id
                          ) as Community,
                          communityStateValue.mySnippets.find(
                            (x) => x.communityId === community.id
                          )
                            ? true
                            : false
                        );
                      }}
                      isLoading={loading}
                    >
                      {communityStateValue.mySnippets.find(
                        (x) => x.communityId === community.id
                      )
                        ? "Joined"
                        : "Join"}
                    </Button>
                  </Flex>
                </Link>
              );
            })}
          </>
        )}
      </Flex>
    </Flex>
  );
};
export default Recommendations;
