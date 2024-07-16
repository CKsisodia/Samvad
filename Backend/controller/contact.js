const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Users = require("../models/users");
const Contacts = require("../models/contacts");
const { Op } = require("sequelize");

exports.findContact = async (req, res) => {
  try {
    const { email, mobile } = req.body;
    const adminEmail = req.user.email;
    const adminMobileNum = req.user.mobile;

    if (!(email || mobile)) {
      return res.status(400).json(new ApiError("Please enter email or mobile"));
    }

    const user = await Users.findOne({
      where: {
        [Op.or]: [{ email: email }, { mobile: mobile }],
      },
    });

    if (!user) {
      return res.status(404).json(new ApiError("Contact not found"));
    }

    if (email === adminEmail || mobile === adminMobileNum) {
      return res.status(400).json(new ApiError("Cannot add yourself"));
    }

    const contactData = {
      contactUserId: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    };

    return res
      .status(201)
      .json(new ApiResponse("Contact found successfully", contactData));
  } catch (error) {
    return res.status(500).json(new ApiError("Something went wrong"));
  }
};

exports.addContacts = async (req, res) => {
  try {
    const { contactUserId } = req.params;
    const userId = req.user.id;

    const isContactExist = await Contacts.findOne({
      where: {
        userID: userId,
        contactUserID: contactUserId,
      },
    });

    const isReverseContactExist = await Contacts.findOne({
      where: {
        userID: contactUserId,
        contactUserID: userId,
      },
    });

    if (isContactExist || isReverseContactExist) {
      return res.status(400).json(new ApiError("Contact already added"));
    }

    const addContact = await Contacts.create({
      userID: userId,
      contactUserID: contactUserId,
    });

    await Contacts.create({
      userID: contactUserId,
      contactUserID: userId,
    });

    return res
      .status(201)
      .json(new ApiResponse("contact added successfully", addContact));
  } catch (error) {
    return res.status(500).json(new ApiError("Something went wrong"));
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const { id } = req.user;

    const contacts = await Contacts.findAll({
      where: { userID: id },
      include: [
        {
          model: Users,
          as: "contactUser",
          attributes: ["id", "name", "email", "mobile"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res
      .status(200)
      .json(new ApiResponse("Contacts retrieved successfully", contacts));
  } catch (error) {
    console.error(error);
    return res.status(500).json(new ApiError("Something went wrong"));
  }
};
