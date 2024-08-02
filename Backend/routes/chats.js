const express = require("express");
const router = express.Router();
const chatsController = require("../controller/chats");
const { validateToken } = require("../middlewares/auth");

router.get("/presigned-url", validateToken, chatsController.getPresignedUrl);
router.get(
  "/all-messages/:receiverID",
  validateToken,
  chatsController.getAllChats
);

module.exports = router;
