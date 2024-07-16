const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Chats = require("../models/chats");
const Users = require("../models/users");
const { Op } = require("sequelize");

exports.deliverChats = async (req, res) => {
  try {
    const { receiverID } = req.params;
    const { message } = req.body;
    const { id: senderID } = req.user;

    if (!receiverID || !message) {
      return res.status(400).json(new ApiError("Type your message...."));
    }

    const receiver = await Users.findByPk(receiverID);
    if (!receiver) {
      return res.status(404).json(new ApiError("Receiver not found"));
    }

    const newChat = await Chats.create({
      senderID,
      receiverID,
      message,
    });

    return res
      .status(201)
      .json(new ApiResponse("Message delivered successfully", newChat));
  } catch (error) {
    return res.status(500).json(new ApiError("Something went wrong"));
  }
};

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

    const messages = await Chats.findAll({
      where: {
        [Op.or]: [
          { senderID, receiverID },
          { senderID: receiverID, receiverID: senderID },
        ],
      },
      order: [["createdAt", "ASC"]],
    });

    return res
      .status(200)
      .json(new ApiResponse("Messages retrieved successfully", messages));
  } catch (error) {
    return res.status(500).json(new ApiError("Something went wrong"));
  }
};
