import React, { useState, useRef, useEffect } from 'react';
import {
  Avatar,
  Box,
  InputAdornment,
  OutlinedInput,
  Paper,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';

const ChatContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '630px',
  backgroundColor: '#f0f0f0',
}));

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  backgroundColor: '#00796b',
  color: '#fff',
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(2),
  backgroundColor: '#e5ddd5',
  display: 'flex',
  flexDirection: 'column',
}));

const MessageBubble = styled(Paper)(({ theme }) => ({
  maxWidth: '60%',
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1),
  borderRadius: '8px',
  wordWrap: 'break-word',
  display: 'inline-block',
  '&.own': {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
  },
}));

const Chats: React.FC = () => {
  const [messages, setMessages] = useState<{ text: string; isOwnMessage: boolean }[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, isOwnMessage: true }]);
      setInput('');
    }
  };

  return (
    <ChatContainer>
      <Header>
        <Avatar sx={{ marginRight: 2 }}>CK</Avatar>
        <Typography variant="h6">CK sisodia</Typography>
      </Header>
      <MessagesContainer>
        {messages.map((message, index) => (
          <MessageBubble
            key={index}
            className={message.isOwnMessage ? 'own' : ''}
            style={{
              alignSelf: message.isOwnMessage ? 'flex-end' : 'flex-start',
              backgroundColor: message.isOwnMessage ? '#dcf8c6' : '#fff',
            }}
          >
            <Typography>{message.text}</Typography>
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
          if (e.key === 'Enter') {
            handleSend();
          }
        }}
      />
    </ChatContainer>
  );
};

export default Chats;
