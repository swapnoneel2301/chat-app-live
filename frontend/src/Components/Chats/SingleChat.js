import React, { useEffect, useRef, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import {
  Box,
  Flex,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon, RepeatIcon, ViewIcon } from "@chakra-ui/icons";
import { getSender } from "./config/commonFunctions";
import ModalProvider from "./ModalProvider";
import axios from "axios";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
// import { Form } from "";
// import backgroundImage from '../'

const SingleChat = () => {
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const { user, selectedChat, setSelectedChat } = ChatState();
  const chatBgUrl =
    "https://i.pinimg.com/736x/85/ec/df/85ecdf1c3611ecc9b7fa85282d9526e0.jpg";

  const sender = getSender(user, selectedChat?.users);
  const toast = useToast();

  const handleSend = async (e) => {
    if (e.keyCode === 13) {
      if (!message) {
        toast({
          title: "Please type your message",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      }
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-type": "application/json",
          },
        };
        setMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: message,
            chatId: selectedChat?._id,
          },
          config
        );
        setAllMessages([...allMessages, data[0]]);
      } catch (error) {
        toast({
          title: error?.response?.data?.message
            ? error.response.data.message
            : "Something Went Wrong",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        console.log(error);
      }
    }
  };

  const fetchAllMessages = async () => {
    console.log("inside fetch func");
    if (!selectedChat) return;
    setChatLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setAllMessages(data);
      setChatLoading(false);
    } catch (error) {
      toast({
        title: error?.response?.data?.message
          ? error.response.data.message
          : "Something Went Wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      console.log(error);
    }
  };

  //   useEffect(() => {
  //     const interval = setInterval(fetchAllMessages, 20000);
  //   }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);
  useEffect(() => {
    console.log(selectedChat);
    fetchAllMessages();
  }, [selectedChat]);

  useEffect(() => {
    console.log(allMessages);
  }, [allMessages]);

  return (
    <>
      {selectedChat ? (
        <>
          <Box
            fontSize={{ base: "14px", md: "20px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {allMessages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {sender?.name}
                  <Box display="flex">
                    <IconButton
                      icon={<RepeatIcon />}
                      mr="2"
                      onClick={fetchAllMessages}
                    />
                    <ModalProvider user={sender}>
                      <IconButton
                        display={{ base: "flex" }}
                        icon={<ViewIcon />}
                      />
                    </ModalProvider>
                  </Box>
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <Box display="flex">
                    <IconButton
                      icon={<RepeatIcon />}
                      mr="2"
                      onClick={fetchAllMessages}
                    />
                    <UpdateGroupChatModal
                      chat={selectedChat}
                      //   fetchMessages={fetchMessages}
                      //   fetchAgain={fetchAgain}
                      //   setFetchAgain={setFetchAgain}
                    />
                  </Box>
                </>
              ))}
          </Box>
          <Flex
            h="80%"
            w="100%"
            overflowY="scroll"
            flexDirection="column"
            // justifyContent="flex-end"
            alignItems="center"
            bgGradient={`url("${chatBgUrl}")`}
            bgPosition="center"
            bgSize="292px"
            pt="2"
          >
            {chatLoading ? (
              <Spinner m="auto" size="xl" color="green.500" thickness="4px" />
            ) : (
              allMessages?.map((msg, index) => {
                return (
                  <Flex
                    key={index}
                    color="black"
                    mb="2"
                    w="100%"
                    justifyContent={
                      msg?.sender?._id === user._id ? "flex-end" : "flex-start"
                    }
                    bg="transparent"
                  >
                    <Box bg="#eae6df" py="1" px="3" mx="3" borderRadius="base">
                      {msg?.sender?._id !== user._id && (
                        <Text fontSize="12px" fontWeight="bold">
                          {msg.sender.name.split(" ")[0]}
                        </Text>
                      )}
                      <hr></hr>
                      {msg.content}
                    </Box>
                  </Flex>
                );
              })
            )}
            {!chatLoading && <Box ref={messagesEndRef}></Box>}
          </Flex>
          <Flex w="100%" mt="3">
            <FormControl onKeyDown={handleSend}>
              <Input
                placeholder="Type Your Message..."
                size="md"
                w="100%"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </FormControl>
          </Flex>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="2xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
