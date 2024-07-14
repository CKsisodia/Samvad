const Users = require("../models/users");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const bcrypt = require("bcrypt");

exports.userSignUp = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (!(name && email && mobile && password)) {
      return res.status(400).json(new ApiError("All fileds are mandatory"));
    }

    const existingUser = await Users.findOne({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json(new ApiError("User already exists"));
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
