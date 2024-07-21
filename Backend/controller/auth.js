const Users = require("../models/users");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../services/auth");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

exports.userSignUp = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (!(name && email && mobile && password)) {
      return res.status(400).json(new ApiError("All fileds are mandatory"));
    }

    const existingUser = await Users.findOne({
      where: {
        [Op.or]: [{ email }, { mobile }],
      },
    });

    if (existingUser) {
      const errorMessage =
        existingUser.email === email
          ? "User already exists with this email"
          : "User already exists with this mobile number";
      return res.status(400).json(new ApiError(errorMessage));
    }

    const saltRounds = 10;
    const hasshedPassword = await bcrypt.hash(password, saltRounds);

    const user = await Users.create({
      name,
      email,
      mobile,
      password: hasshedPassword,
    });

    return res
      .status(201)
      .json(new ApiResponse("Welcome! Account created", user));
  } catch (error) {
    return res.status(500).json(new ApiError("Something went wrong"));
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).json(new ApiError("All fields are mandatory"));
    }

    const isUserExists = await Users.findOne({ where: { email } });

    if (!isUserExists) {
      return res.status(400).json(new ApiError("Please create account"));
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      isUserExists.password
    );

    if (!isPasswordMatch) {
      return res
        .status(400)
        .json(new ApiError("Please enter correct credentials"));
    }

    const accessToken = await generateAccessToken(isUserExists);

    const { refreshToken, hashedRefreshToken } = await generateRefreshToken(
      isUserExists
    );

    const updateUser = await Users.update(
      {
        refreshToken: hashedRefreshToken,
      },
      {
        where: {
          id: isUserExists.id,
        },
      }
    );

    if (updateUser) {
      return res.status(200).json(
        new ApiResponse("Welcome to Samvad", {
          accessToken: accessToken,
          refreshToken: refreshToken,
        })
      );
    }
  } catch (error) {
    return res.status(500).json(new ApiError("Something went wrong"));
  }
};

exports.getRefreshToken = async (req, res) => {
  try {
    const { refreshToken, email } = req.body;

    if (!(refreshToken && email)) {
      return res
        .status(400)
        .json(new ApiError("Error occured in refresh token or email"));
    }

    const user = await Users.findOne({
      where: { email },
    });

    const isValidToken = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isValidToken) {
      return res.status(401).json(new ApiError("Invalid refresh token"));
    }

    const newAccessToken = await generateAccessToken(user);

    return res.status(200).json(
      new ApiResponse("Access token refreshed", {
        accessToken: newAccessToken,
      })
    );
  } catch (error) {
    return res.status(500).json(new ApiError("Something went wrong"));
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const userData = await Users.findOne({
      where: { id: userId },
    });

    if (!userData) {
      return res.status(404).json(new ApiError("User details not found"));
    }
    const userDetails = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
    };
    return res
      .status(200)
      .json(new ApiResponse("User details get successfully", userDetails));
  } catch (error) {
    return res.status(500).json(new ApiError("Something went wrong"));
  }
};
