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
    <Flex justify={"center"} p={"16px 0px"}>
      <Flex width={"95%"} maxWidth={"860px"}>
        <Stack>
          <Text fontSize={"10pt"} fontWeight={600} mb={4}>
            Trending today
          </Text>
          <Flex gap={4}>
            {postStateValue.posts
              .filter((post) => post.imageURL)
              .reverse()
              .slice(0, 3)
              .map((post) => (
                <>
                  <Box maxW="300px" width={"100%"}>
                    <Image
                      borderRadius="md"
                      src={post.imageURL}
                      _hover={{ cursor: "pointer" }}
                      onClick={() => onSelectPost(post)}
                      objectFit={"cover"}
                      height={"100%"}
                      filter={"brightness(75%)"}
                    />
                  </Box>{" "}
                </>
              ))}
          </Flex>
        </Stack>
      </Flex>
    </Flex>
  );
};
export default TrendingToday;
