import { Flex, Icon, MenuItem } from "@chakra-ui/react";
import React, { useState } from "react";
import CreateCommunityModal from "../../Modal/CreateCommunity/CreateCommunityModal";
import { GrAdd } from "react-icons/gr";

type CommunitiesProps = {};

const Communities: React.FC<CommunitiesProps> = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <CreateCommunityModal open={open} handleClose={() => setOpen(false)} />
      <MenuItem width={"100%"} fontSize={"10pt"} onClick={() => setOpen(true)}>
        <Flex align={"center"}>
          <Icon as={GrAdd} fontSize={20} mr={2} />
          <Flex>Create Community</Flex>
        </Flex>
      </MenuItem>
    </>
  );
};
export default Communities;
