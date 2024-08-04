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
const { CronJob } = require("cron");
const connectionHandler = require("./web_sockets/connectionHandler");
const privateMessageHandler = require("./web_sockets/privateChatHandler");
const groupChatHandler = require("./web_sockets/groupChatHandler");
const { archivedChats } = require("./cron_job/archivedChats");
const { archivedGroupChats } = require("./cron_job/archivedGroupChats");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://prod-samvad.d2jfovxlvu879a.amplifyapp.com",
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
  "https://prod-samvad.d2jfovxlvu879a.amplifyapp.com",
  cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

const job = new CronJob(
  "0 0 3 * * *",
  async () => {
    await archivedChats();
    await archivedGroupChats();
  },
  null,
  true,
  "Asia/Kolkata"
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
