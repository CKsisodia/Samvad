const Group = require("../models/group");
const GroupChats = require("../models/groupChats");
const GroupMember = require("../models/groupMember");
const Users = require("../models/users");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { Op } = require("sequelize");

exports.createGroup = async (req, res) => {
  try {
    const { title } = req.body;
    const { id, name } = req.user;

    if (!title) {
      return res.status(400).json(new ApiError("Please enter title of group"));
    }
    console.log(req.user, "okok");
    const groupData = await Group.create({
      title: title,
      adminID: id,
      totalMembers: 1,
      createdBy: name,
    });

    await GroupMember.create({
      userID: id,
      groupID: groupData.id,
      isAdmin: true,
    });

    return res.status(201).json(new ApiResponse("Group created", groupData));
  } catch (error) {
    return res.status(500).json(new ApiError("Something went wrong"));
  }
};

exports.addMember = async (req, res) => {
  try {
    const { groupID } = req.params;
    const { userID, isAdmin } = req.body;

    if (!(groupID || userID)) {
      return res.status(400).json(new ApiError("Select group and user"));
    }

    const isExistingMember = await GroupMember.findOne({
      where: { groupID, userID },
    });

    if (isExistingMember) {
      return res.status(400).json(new ApiError("Already a group member"));
    }

    const newMember = await GroupMember.create({ groupID, userID, isAdmin });

    await Group.increment("totalMembers", { where: { id: groupID } });

    return res
      .status(201)
      .json(new ApiResponse("Welcome new member", newMember));
  } catch (error) {
    return res.status(500).json(new ApiError("Something went wrong"));
  }
};

exports.getGroupInfo = async (req, res) => {
  try {
    const { id } = req.user;

    const groupDetails = await GroupMember.findAll({
      where: {
        userID: id,
      },
      include: [
        {
          model: Group,
          attributes: ["title", "totalMembers"],
        },
      ],
      attributes: ["userID", "groupID", "createdAt"],
      raw: true,
      nest: false,
    });

    return res
      .status(200)
      .json(
        new ApiResponse("Group details fetched successfully", groupDetails)
      );
  } catch (error) {
    return res.status(500).json(new ApiError("Something went wrong"));
  }
};

exports.getSpecificGroupInfo = async (req, res) => {
  try {
    const { groupID } = req.params;

    const specificGroup = await GroupMember.findAll({
      where: { groupID },
      include: [
        {
          model: Users,
          attributes: ["id", "name", "email", "mobile"],
        },
        {
          model: Group,
          attributes: ["title", "totalMembers", "createdAt", "createdBy"],
        },
      ],
    });

    const groupData = {
      title: specificGroup[0].group.title,
      totalMembers: specificGroup[0].group.totalMembers,
      createdBy: specificGroup[0].group.createdBy,
      createdAt: specificGroup[0].group.createdAt,
    };

    const groupDetails = specificGroup.length > 0 ? groupData : null;

    const memberDetails = specificGroup.map((member) => {
      const { group, ...memberData } = member.toJSON();
      return memberData;
    });

    const specificGroupData = {
      memberDetails: memberDetails,
      groupDetails: groupDetails,
    };

    return res
      .status(200)
      .json(new ApiResponse("Specific group data fetched", specificGroupData));
  } catch (error) {
    return res.status(500).json(new ApiError("Something went wrong"));
  }
};

exports.renameGroup = async (req, res) => {
  try {
    const { newTitle } = req.body;
    const { groupID } = req.params;

    if (!(groupID && newTitle)) {
      return res.status(400).json(new ApiError("Please enter new title"));
    }

    const group = await Group.findByPk(groupID);

    group.title = newTitle;

    await group.save();

    return res
      .status(200)
      .json(new ApiResponse("Group renamed successfully", group));
  } catch (error) {
    return res.status(500).json(new ApiError("Something went wrong"));
  }
};

exports.memberAdminStatus = async (req, res) => {
  try {
    const { userID, isAdmin } = req.body;
    const { groupID } = req.params;

    if (!(userID && groupID)) {
      return res.status(400).json(new ApiError("Provide correct ID's"));
    }

    const groupMember = await GroupMember.findOne({
      where: {
        userID,
        groupID,
      },
    });

    if (!groupMember) {
      return res.status(404).json(new ApiError("Group member not found"));
    }

    groupMember.isAdmin = isAdmin;
    await groupMember.save();

    return res
      .status(200)
      .json(new ApiResponse("Admin status modified", groupMember));
  } catch (error) {
    return res.status(500).json(new ApiError("Something went wrong"));
  }
};

exports.removeGroupMember = async (req, res) => {
  try {
    const { groupID } = req.params;
    const { userID } = req.body;

    if (!(groupID && userID)) {
      return res.status(400).json(new ApiError("Try again later"));
    }

    const groupMember = await GroupMember.findOne({
      where: {
        groupID,
        userID,
      },
    });

    if (!groupMember) {
      return res.status(404).json(new ApiError("Group member not found"));
    }

    await Group.decrement("totalMembers", { where: { id: groupID } });

    await groupMember.destroy();

    return res
      .status(200)
      .json(new ApiResponse("Member removed successfully", groupMember));
  } catch (error) {
    return res.status(500).json(new ApiError("Something went wrong"));
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const { groupID } = req.params;

    if (!groupID) {
      return res.status(404).json(new ApiError("Please try again later"));
    }

    const groupToBeDeleted = await Group.findByPk(groupID);

    if (!groupToBeDeleted) {
      return res.status(404).json(new ApiError("Group not found"));
    }

    await groupToBeDeleted.destroy();

    return res
      .status(200)
      .json(new ApiResponse("Group deleted successfully", groupToBeDeleted));
  } catch (error) {
    return res.status(500).json(new ApiError("Something went wrong"));
  }
};

exports.sendGroupMessage = async (req, res) => {
  try {
    const { groupID } = req.params;
    const { message } = req.body;
    const { id: senderID } = req.user;

    if (!(groupID && senderID && message)) {
      return res.status(400).json(new ApiError("Message can't be sent"));
    }

    const isSenderGroupMember = await GroupMember.findOne({
      where: {
        userID: senderID,
        groupID: groupID,
      },
    });

    if (!isSenderGroupMember) {
      return res.status(404).json(new ApiError("You are not member of group"));
    }

    const newMessage = await GroupChats.create({
      senderID,
      groupID,
      message,
    });

    return res.status(200).json(new ApiResponse("Message Sent", newMessage));
  } catch (error) {
    return res.status(500).json(new ApiError("Something went wrong"));
  }
};

exports.getAllGroupMessage = async (req, res) => {
  try {
    const { groupID } = req.params;

    if (!groupID) {
      return res.status(400).json(new ApiError("can't fetch messages"));
    }

    const messages = await GroupChats.findAll({
      where: {
        groupID,
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
