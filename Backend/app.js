const express = require("express");
require("dotenv").config();
const cors = require("cors");
const sequelize = require("./db/database");
const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contacts");
const chatRoutes = require("./routes/chats");
const groupRoutes = require("./routes/group");
const http = require("http");
const { Server } = require("socket.io");
const connectionHandler = require("./web_sockets/connectionHandler");
const privateMessageHandler = require("./web_sockets/privateChatHandler");
const groupChatHandler = require("./web_sockets/groupChatHandler");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`New user connected: ${socket.id}`);

  connectionHandler(socket);
  privateMessageHandler(socket, io);
  groupChatHandler(socket, io);

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

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
  "http://localhost:3001",
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
    server.listen(process.env.APP_PORT, () => {
      console.log(`Server is running on port ${process.env.APP_PORT}`);
    })
  )
  .catch((err) => {
    console.log(err);
  });
