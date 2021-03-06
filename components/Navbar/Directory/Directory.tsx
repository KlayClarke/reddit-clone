import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Flex,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import React from "react";
import { TiHome } from "react-icons/ti";
import { useRecoilState } from "recoil";
import { AuthModalState } from "../../../atoms/authModalAtom";
import { auth } from "../../../firebase/clientApp";
import useDirectory from "../../../hooks/useDirectory";
import Communities from "./Communities";

const Directory: React.FC = () => {
  const [modalState, setModalState] = useRecoilState(AuthModalState);
  const { directoryState, toggleMenuOpen } = useDirectory();
  return (
    <Menu>
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
            {directoryState.selectedMenuItem.imageURL ? (
              <Image
                src={directoryState.selectedMenuItem.imageURL}
                borderRadius={"full"}
                boxSize={"24px"}
                mr={2}
              />
            ) : (
              <>
                {directoryState.selectedMenuItem.icon && (
                  <Icon
                    as={directoryState.selectedMenuItem.icon}
                    color={directoryState.selectedMenuItem.iconColor}
                    fontSize={24}
                    mr={{ base: 1, md: 2 }}
                  />
                )}
              </>
            )}
            <Flex display={{ base: "none", md: "flex" }}>
              <Text fontWeight={600} fontSize={"10pt"}>
                {directoryState.selectedMenuItem.displayText}
              </Text>
            </Flex>
          </Flex>
          <ChevronDownIcon color={"gray.400"} />
        </Flex>
      </MenuButton>
      <MenuList>
        <Communities toggleMenuOpen={toggleMenuOpen} />
      </MenuList>
    </Menu>
  );
};
export default Directory;
