import { Box, Flex, Text, Image, Stack, Icon } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { FaReddit } from "react-icons/fa";
import { Post } from "../../atoms/postsAtom";
import useCommunityData from "../../hooks/useCommunityData";
import usePosts from "../../hooks/usePosts";

type TrendingTodayProps = {};

const TrendingToday: React.FC<TrendingTodayProps> = () => {
  const router = useRouter();
  const { postStateValue, onSelectPost } = usePosts();
  const { communities } = useCommunityData();

  return (
    <>
      <Flex justify={"center"} p={"16px 0px 4px 0px"}>
        <Flex width={"95%"} maxWidth={"1000px"}>
          <Stack>
            <Text fontSize={"10pt"} fontWeight={600} mb={1}>
              Trending today
            </Text>
            <Flex gap={4} maxHeight={"170px"} zIndex={0}>
              {postStateValue.posts
                .filter((post) => post.imageURL)
                .reverse()
                .slice(0, 4)
                .map((post, index) => (
                  <React.Fragment key={index}>
                    <Box
                      maxW="100%"
                      width={"100%"}
                      display={
                        index === 2
                          ? { base: "none", lg: "unset" }
                          : index === 1
                          ? { base: "none", md: "unset" }
                          : {}
                      }
                    >
                      <Image
                        borderRadius="md"
                        src={post.imageURL}
                        _hover={{
                          cursor: "pointer",
                          filter: "brightness(60%)",
                        }}
                        onClick={() => onSelectPost(post)}
                        objectFit={"cover"}
                        height={"100%"}
                        filter={"brightness(65%)"}
                        width={"100%"}
                        position={"relative"}
                        zIndex={1}
                      />
                      <Flex
                        _hover={{ cursor: "pointer" }}
                        onClick={() => onSelectPost(post)}
                      >
                        <Stack
                          position={"absolute"}
                          top={"195px"}
                          zIndex={10}
                          p={"5px 10px"}
                          display={{ base: "none", md: "unset" }}
                        >
                          <Text
                            color={"white"}
                            maxWidth={"225px"}
                            fontWeight={700}
                            noOfLines={1}
                          >
                            {post.title}
                          </Text>
                          <Flex align={"center"}>
                            {communities ? (
                              <Image
                                src={
                                  communities.find(
                                    (x) => x.id === post.communityId
                                  )?.imageURL
                                }
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
                            <Text
                              color={"white"}
                              maxWidth={"225px"}
                              noOfLines={1}
                              fontSize={"xs"}
                            >{`r/${post.communityId} and more`}</Text>
                          </Flex>
                        </Stack>
                      </Flex>
                    </Box>{" "}
                  </React.Fragment>
                ))}
            </Flex>
          </Stack>
        </Flex>
      </Flex>
      <Flex justify={"center"} align={"center"}>
        <Text
          fontSize={"10pt"}
          fontWeight={600}
          mt={3}
          width={"95%"}
          maxWidth={"1000px"}
        >
          Popular posts
        </Text>
      </Flex>
    </>
  );
};
export default TrendingToday;
