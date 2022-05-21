import { Flex, Image } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/clientApp";
import Directory from "./Directory/Directory";
import RightContent from "./RightContent/RightContent";
import SearchInput from "./SearchInput";

const Navbar: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  return (
    <Flex
      bg={"white"}
      height={"44px"}
      padding="6px 12px"
      justify={"space-between"}
    >
      {!loading && (
        <>
          <Flex
            align={"center"}
            onClick={() => {
              router.push("/");
            }}
            _hover={{ cursor: "pointer" }}
          >
            <Image
              src="/images/redditFace.svg"
              height={"30px"}
              mr={{ base: 2, md: 0 }}
            />
            <Image
              src="/images/redditText.svg"
              height={"48px"}
              display={{ base: "none", md: "unset" }} // hide on small screens
            />
          </Flex>
          {user && <Directory />}
          <SearchInput user={user} />
          <RightContent user={user} />
        </>
      )}
    </Flex>
  );
};
export default Navbar;

// Flex is a div with css flexbox already applied to it
