import React from "react";
import { ChevronDownIcon, Search2Icon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useToast,
  Tooltip,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";
import ModalProvider from "./ModalProvider";
import DrawerProvider from "./DrawerProvider";

const Header = () => {
  const { user, setUser } = ChatState();
  const navigate = useNavigate();
  const toast = useToast();
  const logOut = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/");
    toast({
      title: "Successfully Logged Out",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "top",
    });
  };
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      bg="white"
      w="100%"
      p="5px 10px 5px 10px"
      borderWidth="5px"
      borderColor="white"
    >
      {/* Search Button */}
      <DrawerProvider />

      {/* Title */}
      <Text fontSize="2xl" fontFamily="Work sans">
        Whatsapp Clone
      </Text>

      {/* Profile Options */}
      <Menu>
        <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
          <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
        </MenuButton>
        <MenuList>
          <ModalProvider user={user}>
            <MenuItem>My Profile</MenuItem>
          </ModalProvider>
          <MenuItem onClick={logOut}>Log Out</MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
};

export default Header;
