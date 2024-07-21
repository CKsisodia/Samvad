const express = require("express");
require("dotenv").config();
const cors = require("cors");
const sequelize = require("./db/database");

const app = express();

const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contacts");
const chatRoutes = require("./routes/chats");
const groupRoutes = require("./routes/group")

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(
  cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
app.options(
  "*",
  cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

app.use("/auth", authRoutes);
app.use("/user", contactRoutes);
app.use("/chats", chatRoutes);
app.use("/group", groupRoutes);

sequelize
  .sync()
  .then(
    app.listen(process.env.APP_PORT, () => {
      console.log(`Server is running on port ${process.env.APP_PORT}`);
    })
  )
  .catch((err) => {
    console.log(err);
  });
