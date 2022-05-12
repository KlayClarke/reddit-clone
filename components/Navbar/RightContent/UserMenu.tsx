import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { signOut, User } from "firebase/auth";
import { FaRedditSquare } from "react-icons/fa";
import { VscAccount } from "react-icons/vsc";
import { IoSparkles } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { MdOutlineLogin } from "react-icons/md";
import { auth } from "../../../firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";
import { AuthModalState } from "../../../atoms/authModalAtom";

type UserMenuProps = {
  user?: User | null;
};

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const [modalState, setModalState] = useRecoilState(AuthModalState);
  return (
    <Menu>
      <MenuButton
        cursor={"pointer"}
        padding={"0px 6px"}
        borderRadius={4}
        _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
      >
        <Flex align={"center"}>
          <Flex align={"center"}>
            {user ? (
              <>
                <Icon
                  as={FaRedditSquare}
                  fontSize={24}
                  mr={1}
                  color={"gray.300"}
                />
              </>
            ) : (
              <Icon as={VscAccount} fontSize={24} color={"gray.400"} mr={1} />
            )}
          </Flex>
          <ChevronDownIcon />
        </Flex>
      </MenuButton>
      <MenuList>
        {user ? (
          <>
            <MenuItem
              fontSize={"10pt"}
              fontWeight={700}
              _hover={{ bg: "blue.500", color: "white" }}
            >
              <Flex align={"center"}>
                <Icon as={CgProfile} mr={2} fontSize={20} />
                Profile
              </Flex>
            </MenuItem>
            <MenuItem
              fontSize={"10pt"}
              fontWeight={700}
              _hover={{ bg: "blue.500", color: "white" }}
              borderTop={"1px solid"}
              borderColor={"gray.200"}
              onClick={() => signOut(auth)}
            >
              <Flex align={"center"}>
                <Icon as={MdOutlineLogin} mr={2} fontSize={20} />
                Logout
              </Flex>
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem
              fontSize={"10pt"}
              fontWeight={700}
              _hover={{ bg: "blue.500", color: "white" }}
              borderTop={"1px solid"}
              borderColor={"gray.200"}
              onClick={() =>
                setModalState((prev) => ({
                  ...prev,
                  open: true,
                  view: "login",
                }))
              }
            >
              <Flex align={"center"}>
                <Icon as={MdOutlineLogin} mr={2} fontSize={20} />
                Log In / Sign Up
              </Flex>
            </MenuItem>
          </>
        )}
      </MenuList>
    </Menu>
  );
};
export default UserMenu;