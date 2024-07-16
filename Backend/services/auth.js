const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

exports.generateAccessToken = async (user) => {
  try {
    const accessTokenSecretKey = process.env.ACCESSTOKEN_SECRET_KEY;

    const userData = {
      id: user.id,
      email: user.email,
      mobile: user.mobile
    };

    const jwtToken = jwt.sign(userData, accessTokenSecretKey, {
      // expiresIn: "30m",
       expiresIn: "24h",
    });

    return jwtToken;
  } catch (error) {
    console.error("Error generating access token:", error);
    throw error;
  }
};

exports.generateRefreshToken = async (user) => {
  try {
    const refreshTokenSecretKey = process.env.REFRESHTOKEN_SECRET_KEY;

    const userData = {
      id: user.id,
      email: user.email,
    };

    const refreshToken = jwt.sign(userData, refreshTokenSecretKey, {
      expiresIn: "24h",
    });

    const saltRounds = 10;
    const hashedRefreshToken = await bcrypt.hash(refreshToken, saltRounds);

    return {
      refreshToken: refreshToken,
      hashedRefreshToken: hashedRefreshToken,
    };
  } catch (error) {
    console.error("Error generating refresh token:", error);
    throw error;
  }
};
