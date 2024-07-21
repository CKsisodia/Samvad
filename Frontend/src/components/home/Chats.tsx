import SendIcon from "@mui/icons-material/Send";
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
  backgroundColor: "#00796b",
  color: "#fff",
  justifyContent: "space-between",
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

const Chats = () => {
  const dispatch = useAppDispatch();
  const contactsData = useAppSelector(selectContactsdata);
  const chatsData = useAppSelector(selectAllChatData);
  const contactID =
    useAppSelector(selectedContactId) ||
    JSON.parse(localStorage.getItem("selectedContact") || "null");

  const [input, setInput] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    scrollToBottom();
  }, [chatsData?.data]);

  useEffect(() => {
    const fetchMessages = () => {
      dispatch(getAllMessageAction(contactID));
    };
    fetchMessages();

    // const intervalId = setInterval(fetchMessages, 1000);

    // return () => clearInterval(intervalId);
  }, [contactID, dispatch]);

  const handleSend = () => {
    const sendData = {
      message: input,
      receiverID: contactID,
    };
    dispatch(sendMessageAction(sendData));
    setInput("");
  };

  return (
    <>
      {contactID ? (
        <ChatContainer>
          <Header>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar sx={{ marginRight: 2 }}>
                {avtarNameHandler(filterContact?.[0]?.contactUser?.name)}
              </Avatar>
              <Typography variant="h6">
                {filterContact?.[0]?.contactUser?.name}
              </Typography>
            </Box>

            <ButtonGroup
              disableElevation
              variant="contained"
              aria-label="Disabled button group"
            >
              <Button>
                <VideocamIcon />
              </Button>
              <Button>
                <CallIcon />
              </Button>
            </ButtonGroup>
          </Header>
          <MessagesContainer>
            {chatsData?.data?.map((message) => (
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
            ))}
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
