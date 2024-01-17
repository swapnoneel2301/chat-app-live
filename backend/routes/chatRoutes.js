import express from "express";
import {
  accessChat,
  addToGroup,
  createGroupChat,
  fetchChats,
  removeFromGroup,
  renameGroup,
} from "../controllers/chatControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, accessChat); // Create or fetch One to One Chat
router.route("/").get(protect, fetchChats); // Fetch all chats for a user
router.route("/group").post(protect, createGroupChat); // Create New Group Chat
router.route("/rename").put(protect, renameGroup); // rename group
router.route("/groupadd").put(protect, addToGroup); // add new user to group chat
router.route("/groupremove").put(protect, removeFromGroup); // remove user from group chat

// module.exports = router;
export default router;
