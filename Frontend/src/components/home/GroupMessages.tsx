import CallIcon from "@mui/icons-material/Call";
import SendIcon from "@mui/icons-material/Send";
import VideocamIcon from "@mui/icons-material/Videocam";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
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
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1),
  borderRadius: "8px",
  wordWrap: "break-word",
  display: "inline-block",
}));

const GroupMessages = () => {
  const dispatch = useAppDispatch();
  const groupMessages = useAppSelector(selectGroupChatData);
  const user = useAppSelector(selectUserData);
  const [input, setInput] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const groupID =
    useAppSelector(selectedGroupID) ||
    JSON.parse(localStorage.getItem("selectedGroupID") || "null");
  const senderID = user?.data?.id;
  const senderName = user?.data?.name;
  const roomID = `group_room_${groupID}`;

  console.log(groupMessages);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [groupMessages]);

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

  const handleSend = () => {
    if (input === "") {
      return toast.error("Please type a message");
    }
    const sendData = {
      roomID: roomID,
      senderID: senderID,
      groupID: groupID,
      message: input,
      senderName: senderName,
    };
    socket.emit("group_message", sendData);
    // dispatch(sendGroupMessageAction({ groupID: groupID, message: input }));
    setInput("");
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
            <MessageBubble key={row?.id} style={messageStyle}>
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
              <Typography>{row?.message}</Typography>
            </MessageBubble>
          );
        })}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      <OutlinedInput
        id="send"
        endAdornment={
          <InputAdornment position="end">
            <SendIcon onClick={handleSend} />
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
    </ChatContainer>
  );
};

export default GroupMessages;
