const ApiError = require("../utils/ApiError");
const jwt = require("jsonwebtoken");
require('dotenv').config()

exports.validateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json(new ApiError("Access Token Missing"));
    }

    jwt.verify(token, process.env.ACCESSTOKEN_SECRET_KEY, (err, user) => {
      if (err) {
        return res
          .status(403)
          .json(new ApiError("Unauthorized Access - Token Expired"));
      }
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json(new ApiError("Something went wrong"));
  }
};
