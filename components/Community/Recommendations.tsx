import {
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
import { FaReddit } from "react-icons/fa";
import { Community, communityState } from "../../atoms/communitiesAtom";
import { auth } from "../../firebase/clientApp";
import useCommunityData from "../../hooks/useCommunityData";

const Recommendations: React.FC = () => {
  const [user] = useAuthState(auth);
  const [topCommunities, setTopCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);
  const { communityStateValue, communities } = useCommunityData();
  const getCommunityRecommendations = () => {};
  useEffect(() => {
    getCommunityRecommendations();
  }, []);
  return (
    <Flex
      direction={"column"}
      bg={"white"}
      borderRadius={4}
      border={"1px solid"}
      borderColor={"gray.300"}
    >
      <Flex
        align={"flex-end"}
        color={"white"}
        p={"6px 10px"}
        height={"70px"}
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
        {loading ? (
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
            {communities.map((community, index) => {
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
                    p={"10px 12px"}
                    _hover={{ cursor: "pointer" }}
                  >
                    <Flex width={"10%"} align={"center"}>
                      <Text>{index + 1}</Text>
                    </Flex>
                    <Flex align={"center"} width={"90%"}>
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
                      <Text fontWeight={700}>{`r/${community.id}`}</Text>
                    </Flex>
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
