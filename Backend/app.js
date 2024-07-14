const express = require("express");
require("dotenv").config();
const cors = require("cors");
const sequelize = require("./db/database");

const app = express();

const authRoutes = require("./routes/auth");

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

app.use("/user", authRoutes);

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
