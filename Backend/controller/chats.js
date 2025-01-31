const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Chats = require("../models/chats");
const Users = require("../models/users");
const { Op } = require("sequelize");
const { generatePresignedUrl } = require("../services/generatePresignedUrl");
const ArchivedChats = require("../models/archivedChats");

exports.getAllChats = async (req, res) => {
  try {
    const { receiverID } = req.params;
    const { id: senderID } = req.user;

    if (!receiverID) {
      return res.status(400).json(new ApiError("Receiver ID is required"));
    }

    const receiver = await Users.findByPk(receiverID);

    if (!receiver) {
      return res.status(404).json(new ApiError("Receiver not found"));
    }

    const chatData = await Chats.findAll({
      where: {
        [Op.or]: [
          { senderID, receiverID },
          { senderID: receiverID, receiverID: senderID },
        ],
      },
      order: [["createdAt", "ASC"]],
    });
    const archivedChatData = await ArchivedChats.findAll({
      where: {
        [Op.or]: [
          { senderID, receiverID },
          { senderID: receiverID, receiverID: senderID },
        ],
      },
      order: [["createdAt", "ASC"]],
    });

    const combinedChat = [...chatData, ...archivedChatData].sort((a, b) => {
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

    return res
      .status(200)
      .json(new ApiResponse("Chat retrieved successfully", combinedChat));
  } catch (error) {
    return res.status(500).json(new ApiError("Something went wrong"));
  }
};

exports.getPresignedUrl = async (req, res) => {
  try {
    const url = await generatePresignedUrl();
    if (url) {
      return res.status(200).json(new ApiResponse("url generated", url));
    }
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError("Something went wrong to generate url"));
  }
};
