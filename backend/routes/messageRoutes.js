import express from "express";
import {
  createMessage,
  getAllMessages,
} from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createMessage); // send a message
router.route("/:chatId").get(protect, getAllMessages); // get all the messages for a chat

export default router;
