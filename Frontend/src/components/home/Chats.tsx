import SendIcon from "@mui/icons-material/Send";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Paper,
  Typography,
} from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import CallIcon from "@mui/icons-material/Call";
import { styled } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
  selectAllChatData,
  selectContactsdata,
  selectedContactId,
} from "../../redux/reducers/chatSlice";
import { avtarNameHandler } from "../../utils/helperFunctions";
import {
  getAllMessageAction,
  sendMessageAction,
} from "../../redux/actions/asyncChatActions";
import { getUserInfoAction } from "../../redux/actions/asyncAuthActions";
import { io } from "socket.io-client";
import socket from "../../utils/socket";
import { selectUserData } from "../../redux/reducers/authSlice";
import { toast } from "react-toastify";
import { RiAttachment2 } from "react-icons/ri";
import axios from "axios";
import MediaDialog from "./MediaDialog";

const ChatContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "630px",
  backgroundColor: "#f0f0f0",
}));

const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2),
  backgroundColor: "#86C232",
  color: "#0A0A0A",
  justifyContent: "space-between",
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: "auto",
  padding: theme.spacing(2),
  backgroundImage: "url('/chat.png')",
  display: "flex",
  flexDirection: "column",
  // Custom scrollbar styles
  "&::-webkit-scrollbar": {
    width: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#888",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "#555",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "#f0f0f0",
  },
}));

const MessageBubble = styled(Paper)(({ theme }) => ({
  maxWidth: "50%",
  marginBottom: theme.spacing(0.5),
  padding: theme.spacing(1),
  borderRadius: "8px",
  wordWrap: "break-word",
  display: "inline-block",
  "&.media": {
    maxWidth: "30%",
  },
}));

const Chats = () => {
  const dispatch = useAppDispatch();
  const contactsData = useAppSelector(selectContactsdata);
  const chatsData = useAppSelector(selectAllChatData);
  const contactID =
    useAppSelector(selectedContactId) ||
    JSON.parse(localStorage.getItem("selectedContact") || "null");
  const user = useAppSelector(selectUserData);
  const userId = user?.data?.id;
  const roomID = "private_room_" + [userId, contactID].sort().join("_");

  const [input, setInput] = useState<string>("");
  const [media, setMedia] = useState<any>(null);
  const [openMedia, setOpenMedia] = useState<boolean>(false);
  const [dialogContent, setDialogContent] = useState<{
    type: string;
    url: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filterContact = contactsData?.data.filter(
    (item: any) => item?.contactUserID === contactID
  );

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  const handleMediaDialogClose = () => {
    setDialogContent(null);
    setOpenMedia(false);
  };

  useEffect(() => {
    dispatch(getAllMessageAction(contactID));
  }, [contactID]);

  useEffect(() => {
    scrollToBottom();
  }, [chatsData?.data]);

  useEffect(() => {
    dispatch(getUserInfoAction());

    if (roomID) {
      socket.emit("join_room", roomID);
    }

    socket.on("receive_private_message", (data) => {
      dispatch(getAllMessageAction(contactID));
    });

    return () => {
      socket.emit("leave_room", roomID);
      socket.off("receive_private_message");
    };
  }, [contactID]);

  useEffect(() => {
    if (media) {
      handleSend();
    }
  }, [media]);

  const uploadFile = async (file: File) => {
    const token = localStorage.getItem("accessToken");
    try {
      const getResponse = await axios.get(
        "http://localhost:3000/chats/presigned-url",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(file);

      const signedUrl = getResponse?.data?.data;
      await axios.put(signedUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      return {
        size: file.size,
        type: file.type,
        url: signedUrl.split("?")[0],
      };
    } catch (error) {
      console.error("File upload failed:", error);
      toast.error("Try again");
      return null;
    }
  };

  const handleSend = async () => {
    console.log(media);
    if (input === "" && !media) {
      return toast.error("Please type a message or select a file");
    }

    let fileMetadata = null;
    if (media) {
      fileMetadata = await uploadFile(media);
    }

    const sendData = {
      roomID: roomID,
      senderID: userId,
      receiverID: contactID,
      message: input,
      fileMetadata,
    };

    socket.emit("private_message", sendData);
    setInput("");
    setMedia(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      setMedia(files[0]);
    }
  };

  const renderMedia = (type: string, url: string) => {
    if (type.startsWith("image/")) {
      return (
        <img
          src={url}
          alt="try again"
          style={{ maxWidth: "100%" }}
          onClick={() => {
            setOpenMedia(true);
            setDialogContent({ type, url });
          }}
          className="media"
        />
      );
    } else if (type.startsWith("video/")) {
      return (
        <video
          // controls
          style={{ maxWidth: "100%" }}
          onClick={() => {
            setOpenMedia(true);
            setDialogContent({ type, url });
          }}
          className="media"
        >
          <source src={url} type={type} />
        </video>
      );
    } else if (type.startsWith("audio/")) {
      return (
        <audio controls>
          <source src={url} type={type} />
        </audio>
      );
    } else if (
      type === "application/pdf" ||
      type.includes("word") ||
      type.includes("xml")
    ) {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer">
          {type.split("/")[1]} file
        </a>
      );
    } else {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer">
          Download File
        </a>
      );
    }
  };

  return (
    <>
      {contactID ? (
        <ChatContainer>
          <Header>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                sx={{
                  marginRight: 2,
                  backgroundColor: "#61892F",
                  color: "#0A0A0A",
                }}
              >
                {avtarNameHandler(filterContact?.[0]?.contactUser?.name)}
              </Avatar>
              <Typography variant="h6">
                {filterContact?.[0]?.contactUser?.name}
              </Typography>
            </Box>

            <Box sx={{ display: "flex" , gap:1}}>
              <Button
                sx={{
                  backgroundColor: "#61892F",
                  color: "#0A0A0A",
                }}
              >
                <VideocamIcon />
              </Button>
              <Button
                sx={{
                  backgroundColor: "#61892F",
                  color: "#0A0A0A",
                }}
              >
                <CallIcon />
              </Button>
            </Box>
          </Header>
          <MessagesContainer>
            {chatsData?.data?.map((message) => (
              <MessageBubble
                key={message?.id}
                className={message?.status === "media" ? "media" : ""}
                style={{
                  alignSelf:
                    message?.receiverID === contactID
                      ? "flex-end"
                      : "flex-start",
                  backgroundColor:
                    message?.receiverID === contactID ? "#dcf8c6" : "#fff",
                }}
              >
                {message?.status === "text" && (
                  <Typography>{message?.message}</Typography>
                )}
                {message?.status === "media" &&
                  renderMedia(message?.type, message?.url)}
              </MessageBubble>
            ))}
            <div ref={messagesEndRef} />
          </MessagesContainer>
          <OutlinedInput
            id="send"
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={handleSend}>
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            }
            startAdornment={
              <InputAdornment position="start">
                <IconButton
                  onClick={() =>
                    fileInputRef.current && fileInputRef.current.click()
                  }
                >
                  <RiAttachment2 size="1.5rem" />
                </IconButton>
              </InputAdornment>
            }
            aria-describedby="send"
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
          />
          <input
            type="file"
            accept="image/*, audio/*, video/*,.txt,.doc,.docx,.xml, .pdf"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <MediaDialog
            open={openMedia}
            handleClose={handleMediaDialogClose}
            dialogContent={dialogContent}
          />
        </ChatContainer>
      ) : (
        <div style={{ textAlign: "center", padding: "24%" }}>
          <div style={{ fontSize: "24px", fontWeight: "bold" }}>
            Select contact to start chat
          </div>
          <div>Send and receive messages in real-time securely</div>
        </div>
      )}
    </>
  );
};

export default Chats;
