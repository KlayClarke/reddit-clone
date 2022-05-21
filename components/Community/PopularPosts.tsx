import { Flex, Icon, Input, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { AiFillFire } from "react-icons/ai";
import { BsCardHeading, BsThreeDots, BsChevronDown } from "react-icons/bs";
import { FaReddit } from "react-icons/fa";
import { IoImageOutline, IoPodiumOutline } from "react-icons/io5";
import { TiStarburstOutline } from "react-icons/ti";

type PopularPostsProps = {};

const PopularPosts: React.FC<PopularPostsProps> = () => {
  return (
    <>
      <Text fontSize={"10pt"} fontWeight={600} mb={4}>
        Popular posts
      </Text>
      <Flex
        justify={"space-between"}
        align={"center"}
        bg={"white"}
        height={"55px"}
        borderRadius={4}
        border={"1px solid"}
        borderColor={"gray.300"}
        p={2}
        mb={4}
      >
        <Flex align={"center"}>
          <Flex
            align={"center"}
            mr={3}
            bg={"gray.50"}
            _hover={{ bg: "gray.100", cursor: "pointer" }}
            borderRadius={"full"}
            p={"4px 8px"}
          >
            <Icon
              as={AiFillFire}
              fontSize={22}
              color={"blue.500"}
              cursor={"pointer"}
              mr={1}
            />
            <Text color={"blue.500"} fontWeight={700}>
              Hot
            </Text>
          </Flex>
          <Flex
            align={"center"}
            mr={3}
            bg={"gray.50"}
            _hover={{ bg: "gray.100", cursor: "pointer" }}
            borderRadius={"full"}
            p={"4px 8px"}
          >
            <Text color={"blue.500"} fontWeight={700} mr={2}>
              Everywhere
            </Text>
            <Icon as={BsChevronDown} fontSize={14} color={"blue.700"} />
          </Flex>
          <Flex
            align={"center"}
            mr={3}
            _hover={{ bg: "gray.100", cursor: "pointer" }}
            borderRadius={"full"}
            p={"4px 8px"}
          >
            <Icon
              as={TiStarburstOutline}
              fontSize={28}
              color={"gray.300"}
              mr={1}
            />
            <Text color={"gray.400"} fontWeight={700}>
              New
            </Text>
          </Flex>
          <Flex
            align={"center"}
            mr={3}
            _hover={{ bg: "gray.100", cursor: "pointer" }}
            borderRadius={"full"}
            p={"4px 8px"}
          >
            <Icon
              as={IoPodiumOutline}
              fontSize={24}
              color={"gray.300"}
              mr={1}
            />
            <Text color={"gray.400"} fontWeight={700}>
              Top
            </Text>
          </Flex>
          <Icon
            as={BsThreeDots}
            fontSize={32}
            color={"gray.400"}
            _hover={{ bg: "gray.100", cursor: "pointer" }}
            borderRadius={"full"}
            p={"8px"}
          />
        </Flex>
        <Flex
          align={"center"}
          _hover={{ bg: "gray.100", cursor: "pointer" }}
          p={"4px 8px"}
          borderRadius={"full"}
        >
          <Icon
            as={BsCardHeading}
            fontSize={24}
            color={"gray.400"}
            cursor={"pointer"}
            mr={1}
          />
          <Icon as={BsChevronDown} fontSize={11} color={"gray.400"} />
        </Flex>
      </Flex>
    </>
  );
};
export default PopularPosts;