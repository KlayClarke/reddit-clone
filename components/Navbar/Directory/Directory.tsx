import { ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, Icon, Menu, MenuButton, MenuList, Text } from "@chakra-ui/react";
import { User } from "firebase/auth";
import React from "react";
import { TiHome } from "react-icons/ti";
import { useRecoilState } from "recoil";
import { AuthModalState } from "../../../atoms/authModalAtom";
import { auth } from "../../../firebase/clientApp";
import useDirectory from "../../../hooks/useDirectory";
import Communities from "./Communities";

type DirectoryProps = {
  user?: User | null;
};

const Directory: React.FC<DirectoryProps> = ({ user }) => {
  const [modalState, setModalState] = useRecoilState(AuthModalState);
  const { directoryState, toggleMenuOpen } = useDirectory();
  return (
    <Menu isOpen={directoryState.isOpen}>
      <MenuButton
        cursor={"pointer"}
        padding={"0px 6px"}
        borderRadius={4}
        _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
        mr={2}
        ml={1}
        onClick={toggleMenuOpen}
      >
        <Flex align={"center"} justify={"space-between"} width={"auto"}>
          <Flex align={"center"}>
            <Icon as={TiHome} fontSize={24} mr={{ base: 1, md: 2 }} />
            <Flex display={{ base: "none", md: "flex" }}>
              <Text fontWeight={600} fontSize={"10pt"}>
                Home
              </Text>
            </Flex>
          </Flex>
          <ChevronDownIcon color={"gray.400"} />
        </Flex>
      </MenuButton>
      <MenuList>
        <Communities />
      </MenuList>
    </Menu>
  );
};
export default Directory;
