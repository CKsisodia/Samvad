import CallIcon from "@mui/icons-material/Call";
import SendIcon from "@mui/icons-material/Send";
import VideocamIcon from "@mui/icons-material/Videocam";
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
import { styled } from "@mui/material/styles";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
  selectedGroupID,
  selectGroupChatData,
} from "../../redux/reducers/chatSlice";
import {
  getGroupMessageAction,
  sendGroupMessageAction,
} from "../../redux/actions/asyncChatActions";
import { selectUserData } from "../../redux/reducers/authSlice";
import socket from "../../utils/socket";
import { toast } from "react-toastify";
import { RiAttachment2 } from "react-icons/ri";
import axios from "axios";
import MediaDialog from "./MediaDialog";

const ChatContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "558px",
  backgroundColor: "#f0f0f0",
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: "auto",
  padding: theme.spacing(2),
  backgroundColor: "#e5ddd5",
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
  maxWidth: "60%",
  marginBottom: theme.spacing(0.5),
  padding: theme.spacing(1),
  borderRadius: "8px",
  wordWrap: "break-word",
  display: "inline-block",
  "&.media": {
    maxWidth: "30%",
  },
}));

const GroupMessages = () => {
  const dispatch = useAppDispatch();
  const groupMessages = useAppSelector(selectGroupChatData);
  const user = useAppSelector(selectUserData);
  const [input, setInput] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const [openMedia, setOpenMedia] = useState<boolean>(false);
  const [dialogContent, setDialogContent] = useState<{
    type: string;
    url: string;
  } | null>(null);
  const [media, setMedia] = useState<any>(null);

  const groupID =
    useAppSelector(selectedGroupID) ||
    JSON.parse(localStorage.getItem("selectedGroupID") || "null");
  const senderID = user?.data?.id;
  const senderName = user?.data?.name;
  const roomID = `group_room_${groupID}`;

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
    scrollToBottom();
  }, [groupMessages]);

  useEffect(() => {
    if (media) {
      handleSend();
    }
  }, [media]);

  useEffect(() => {
    dispatch(getGroupMessageAction(groupID));
  }, [groupID, dispatch]);

  useEffect(() => {
    if (roomID) {
      console.log("user joined room", roomID);
      socket.emit("join_room", roomID);
    }

    socket.on("receive_group_message", (data) => {
      dispatch(getGroupMessageAction(groupID));
    });

    return () => {
      console.log("room left by", roomID);
      socket.emit("leave_room", roomID);
      socket.off("receive_group_message");
    };
  }, [groupID]);

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
    if (input === "" && !media) {
      return toast.error("Please type a message or select a file");
    }

    let fileMetaData = null;

    if (media) {
      fileMetaData = await uploadFile(media);
    }

    const sendData = {
      roomID: roomID,
      senderID: senderID,
      groupID: groupID,
      message: input,
      senderName: senderName,
      fileMetaData,
    };

    socket.emit("group_message", sendData);
    setInput("");
    setMedia(null);
    if (mediaInputRef.current) {
      mediaInputRef.current.value = "";
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
    <ChatContainer>
      <MessagesContainer>
        {groupMessages?.data?.map((row, index) => {
          const isOwnMessage = user?.data && row?.senderID === +user?.data?.id;
          const messageStyle = {
            alignSelf: isOwnMessage ? "flex-end" : "flex-start",
            backgroundColor: isOwnMessage ? "#dcf8c6" : "#fff",
          };
          const showSenderName =
            index === 0 ||
            row?.senderName !== groupMessages?.data[index - 1]?.senderName;

          return (
            <MessageBubble
              key={row?.id}
              style={messageStyle}
              className={row?.status === "media" ? "media" : ""}
            >
              {!isOwnMessage && showSenderName && (
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: row?.nameColor,
                  }}
                >
                  {row?.senderName}
                </Typography>
              )}
              {row?.status === "text" && (
                <Typography>{row?.message}</Typography>
              )}
              {row?.status === "media" && renderMedia(row?.type, row?.url)}
            </MessageBubble>
          );
        })}
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
                mediaInputRef.current && mediaInputRef.current.click()
              }
            >
              <RiAttachment2 size="1.5rem" />
            </IconButton>
          </InputAdornment>
        }
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
        ref={mediaInputRef}
        onChange={handleFileChange}
      />
      <MediaDialog
        open={openMedia}
        handleClose={handleMediaDialogClose}
        dialogContent={dialogContent}
      />
    </ChatContainer>
  );
};

export default GroupMessages;
