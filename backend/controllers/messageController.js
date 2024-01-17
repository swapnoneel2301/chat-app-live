import asyncHandler from "express-async-handler";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import Chat from "../models/chatModel.js";

const createMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  //   const sender = req.user;
  if (!content || !chatId) {
    res.status(400).send("Parameter is Missing in post body");
  }
  try {
    let message = await Message.create({
      sender: req.user._id,
      content: content,
      chat: chatId,
    });

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });

    message = await Message.find({ _id: message._id })
      .populate("sender", "name pic email")
      .populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    res.status(200).send(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const getAllMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  try {
    let allMessage = await Message.find({
      chat: chatId,
    })
      .populate("sender", "-password")
      .populate("chat");
    allMessage = await User.populate(allMessage, {
      path: "chat.users",
      select: "-password",
    });
    res.status(200).send(allMessage);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export { createMessage, getAllMessages };
