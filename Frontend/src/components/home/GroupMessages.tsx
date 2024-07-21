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
    Typography
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { FormEvent, useEffect, useRef, useState } from "react";

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
    "&.own": {
      alignSelf: "flex-end",
      backgroundColor: "#dcf8c6",
    },
  }));

const GroupMessages = () => {

    const [input, setInput] = useState<string>("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

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
      }, []);
    
      const handleSend = (e: FormEvent) => {
        e.preventDefault();
      };


  return (
    <ChatContainer>
    <MessagesContainer>
      {/* {chatsData?.data?.map((message) => (
        <MessageBubble
          key={message?.id}
          style={{
            alignSelf:
              message?.receiverID === contactID
                ? "flex-end"
                : "flex-start",
            backgroundColor:
              message?.receiverID === contactID ? "#dcf8c6" : "#fff",
          }}
        >
          <Typography>{message?.message}</Typography>
        </MessageBubble>
      ))} */}
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
          // handleSend();
        }
      }}
    />
  </ChatContainer>
  )
}

export default GroupMessages