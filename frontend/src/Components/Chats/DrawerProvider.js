import { Search2Icon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserLoading from "./UserLoading";
import UserListItem from "./UserListItem";

const DrawerProvider = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [searchedUser, setSearchedUser] = useState([]);

  const toast = useToast();
  const { user, setUser, chats, setChats, selectedChat, setSelectedChat } =
    ChatState();

  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setChatLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setChatLoading(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setChatLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    setSearchLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setSearchedUser(data);
      setSearchLoading(false);
    } catch (error) {
      console.log(error);
      toast({
        title: "Some Error Occured",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      setSearchLoading(false);
    }
  };

  return (
    <>
      <Tooltip label="Search User" hasArrow placement="bottom">
        <Button variant="ghost" onClick={onOpen}>
          <Search2Icon />
          <Text d={{ base: "none", md: "flex" }} px="4">
            Search User
          </Text>
        </Button>
      </Tooltip>

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        // finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          {/* <DrawerCloseButton /> */}
          <DrawerHeader>Search User</DrawerHeader>

          <DrawerBody>
            <Box display="flex" mb="3">
              <Input
                placeholder="Search by name or email..."
                mr="3"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button colorScheme="whatsapp" onClick={handleSearch}>
                Go
              </Button>
            </Box>
            {searchLoading ? (
              <UserLoading />
            ) : (
              searchedUser.map((user) => (
                <UserListItem
                  key={user._id}
                  handleFunction={() => accessChat(user._id)}
                  user={user}
                />
              ))
            )}
            {chatLoading && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default DrawerProvider;
