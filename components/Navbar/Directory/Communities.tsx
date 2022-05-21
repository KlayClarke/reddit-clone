import { Box, Flex, Icon, MenuItem, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import CreateCommunityModal from "../../Modal/CreateCommunity/CreateCommunityModal";
import { GrAdd } from "react-icons/gr";
import { useRecoilValue } from "recoil";
import { communityState } from "../../../atoms/communitiesAtom";
import MenuListItem from "./MenuListItem";
import { FaReddit } from "react-icons/fa";
import useCommunityData from "../../../hooks/useCommunityData";

type CommunitiesProps = {
  toggleMenuOpen: () => void;
};

const Communities: React.FC<CommunitiesProps> = ({ toggleMenuOpen }) => {
  const [open, setOpen] = useState(false);
  const mySnippets = useRecoilValue(communityState).mySnippets;
  const { communities } = useCommunityData();
  return (
    <>
      <CreateCommunityModal open={open} handleClose={() => setOpen(false)} />
      <Box mt={3} mb={4}>
        <Text
          pl={3}
          mb={1}
          fontSize={"7pt"}
          fontWeight={500}
          color={"gray.500"}
        >
          MODERATING
        </Text>
        {mySnippets
          .filter((snippet) => snippet.isModerator)
          .map((snippet, index) => (
            <MenuListItem
              key={index}
              displayText={`r/${snippet.communityId}`}
              link={`/r/${snippet.communityId}`}
              icon={FaReddit}
              iconColor={"brand.100"}
              imageURL={
                communities.find(
                  (community) => community.id === snippet.communityId
                )?.imageURL
              }
            />
          ))}
      </Box>
      <Box mt={3} mb={4}>
        <Text
          pl={3}
          mb={1}
          fontSize={"7pt"}
          fontWeight={500}
          color={"gray.500"}
        >
          My Communities
        </Text>
        <MenuItem
          width={"100%"}
          fontSize={"10pt"}
          onClick={() => {
            setOpen(true), toggleMenuOpen();
          }}
        >
          <Flex align={"center"}>
            <Icon as={GrAdd} fontSize={20} mr={2} />
            <Flex>Create Community</Flex>
          </Flex>
        </MenuItem>
        {mySnippets.map((snippet, index) => (
          <MenuListItem
            key={index}
            displayText={`r/${snippet.communityId}`}
            link={`/r/${snippet.communityId}`}
            icon={FaReddit}
            iconColor={"blue.500"}
            imageURL={
              communities.find(
                (community) => community.id === snippet.communityId
              )?.imageURL
            }
          />
        ))}
      </Box>
    </>
  );
};
export default Communities;
