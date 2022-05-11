import { Flex, Image } from "@chakra-ui/react";
import React from "react";

const Navbar: React.FC = () => {
  return (
    <Flex bg={"white"} height={"44px"} padding="6px 12px">
      <Flex align={"center"}>
        <Image src="/images/redditFace.svg" height={"30px"} />
        <Image
          src="/images/redditText.svg"
          height={"48px"}
          display={{ base: "none", md: "unset" }} // hide on small screens
        />
      </Flex>
    </Flex>
  );
};
export default Navbar;

// Flex is a div with css flexbox already applied to it
