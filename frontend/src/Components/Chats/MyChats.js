import { Avatar, Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { AddIcon } from "@chakra-ui/icons";
import UserLoading from "./UserLoading";
import axios from "axios";
import GroupChatModal from "./GroupChatModal";
import { getSender } from "./config/commonFunctions";

const MyChats = () => {
  const { user, setUser, chats, setChats, selectedChat, setSelectedChat } =
    ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);
  // useEffect(() => {
  //   setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
  //   fetchChats();
  //   // eslint-disable-next-line
  // }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "15px", md: "20px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "15px", md: "10px", lg: "15px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => {
              const sender = getSender(user, chat.users);

              return (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  display="flex"
                  cursor="pointer"
                  bg={selectedChat === chat ? "#22c35e" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chat._id}
                >
                  <Avatar
                    mr={2}
                    size="sm"
                    cursor="pointer"
                    name={!chat.isGroupChat ? sender?.name : chat.chatName}
                    src={!chat.isGroupChat ? sender?.pic : ""}
                    bg="green.500"
                  />
                  <Box>
                    <Text>
                      {!chat.isGroupChat
                        ? // ? getSender(loggedUser, chat.users)
                          sender?.name
                        : chat.chatName}
                    </Text>
                    {chat.latestMessage && (
                      <Text fontSize="xs">
                        <b>
                          {chat?.latestMessage?.sender?._id === user?._id
                            ? "You : "
                            : `${
                                chat?.latestMessage?.sender?.name.split(" ")[0]
                              } : `}
                        </b>
                        {chat.latestMessage.content.length > 50
                          ? chat.latestMessage.content.substring(0, 51) + "..."
                          : chat.latestMessage.content}
                      </Text>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Stack>
        ) : (
          <UserLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
