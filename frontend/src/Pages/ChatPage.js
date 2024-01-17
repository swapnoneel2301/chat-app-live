import React, { useEffect } from "react";
import Header from "../Components/Chats/Header";
import { Box } from "@chakra-ui/react";
import MyChats from "../Components/Chats/MyChats";
import ChatBox from "../Components/Chats/ChatBox";
import { ChatState } from "../Context/ChatProvider";
import { useNavigate } from "react-router-dom";

const ChatPage = () => {
  const { user } = ChatState();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) navigate("/");
  }, [user]);
  return (
    <div style={{ width: "100%" }}>
      {user && <Header />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
};

export default ChatPage;
