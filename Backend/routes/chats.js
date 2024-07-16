const express = require("express");
const router = express.Router();
const chatsController = require("../controller/chats");
const { validateToken } = require("../middlewares/auth");

router.post("/send-message/:receiverID", validateToken, chatsController.deliverChats);
router.get("/all-messages/:receiverID", validateToken, chatsController.getAllChats);

module.exports = router;