import { Box, Flex, Text, Image, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Post } from "../../atoms/postsAtom";
import usePosts from "../../hooks/usePosts";

type TrendingTodayProps = {};

const TrendingToday: React.FC<TrendingTodayProps> = () => {
  const router = useRouter();
  const { postStateValue, onSelectPost } = usePosts();

  return (
    <Flex justify={"center"} p={"16px 0px 4px 0px"}>
      <Flex width={"95%"} maxWidth={"860px"}>
        <Stack>
          <Text fontSize={"10pt"} fontWeight={600} mb={1}>
            Trending today
          </Text>
          <Flex gap={4} maxHeight={"170px"}>
            {postStateValue.posts
              .filter((post) => post.imageURL)
              .reverse()
              .slice(0, 3)
              .map((post, index) => (
                <React.Fragment key={index}>
                  <Box maxW="300px" width={"100%"}>
                    <Image
                      borderRadius="md"
                      src={post.imageURL}
                      _hover={{ cursor: "pointer", filter: "brightness(70%)" }}
                      onClick={() => onSelectPost(post)}
                      objectFit={"cover"}
                      height={"100%"}
                      filter={"brightness(75%)"}
                      width={"100%"}
                      position={"relative"}
                      zIndex={1}
                    />
                    <Flex display={{ base: "none", md: "initial" }}>
                      <Text
                        position={"absolute"}
                        zIndex={10}
                        color={"white"}
                        top={"210px"}
                        maxWidth={"225px"}
                        noOfLines={1}
                      >
                        {post.title}
                      </Text>
                    </Flex>
                  </Box>{" "}
                </React.Fragment>
              ))}
          </Flex>
        </Stack>
      </Flex>
    </Flex>
  );
};
export default TrendingToday;
