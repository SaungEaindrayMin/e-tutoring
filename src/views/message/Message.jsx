import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Avatar,
  Stack,
  IconButton,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";

const contacts = [
  { id: 1, name: "Sarah Anderson", initials: "SA", role: "Student" },
  { id: 2, name: "Sarah Anderson", initials: "SA", role: "Student" },
  { id: 3, name: "Sarah Anderson", initials: "SA", role: "Student" },
  { id: 4, name: "Sarah Anderson", initials: "SA", role: "Student" },
  { id: 5, name: "Sarah Anderson", initials: "SA", role: "Student" },
  { id: 6, name: "Sarah Anderson", initials: "SA", role: "Student" },
];

const tutor = {
  name: "Dr.Sarah Anderson",
  initials: "SA",
  role: "Personal Tutor",
};

const mockMessages = [
  {
    id: 1,
    text: "Hi Sarah Anderson, I wanted to discuss with you.",
    time: "10:30",
    fullDate: "Feb 2, 2026, 10:30:00 AM",
    sender: "me",
  },
  {
    id: 2,
    text: "Of course Emma! I have time available this Thursday at 2pm. Does that work for you?",
    time: "11:15",
    fullDate: "Feb 2, 2026, 11:15:00 AM",
    sender: "other",
  },
  {
    id: 3,
    text: "That works perfectly, thank you!",
    time: "11:20",
    fullDate: "Feb 9, 2026, 11:20:00 PM",
    sender: "me",
  },
  {
    id: 4,
    text: "Seen You Soon!",
    time: "11:20",
    fullDate: "Feb 9, 2026, 11:20:00 PM",
    sender: "me",
  },
];

const MessageBubble = ({ message }) => {
  const isMe = message.sender === "me";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: isMe ? "flex-start" : "flex-end",
        mb: 1,
      }}
    >
      <Box
        sx={{
          maxWidth: "60%",
          bgcolor: isMe ? "#f0f0f0" : "primary.main",
          color: isMe ? "text.primary" : "#fff",
          borderRadius: 2,
          px: 2,
          py: 1.2,
        }}
      >
        <Typography variant="body2">{message.text}</Typography>
        <Typography
          variant="caption"
          sx={{ opacity: 0.7, display: "block", mt: 0.3 }}
        >
          {message.time}
        </Typography>
      </Box>
      <Chip
        label={message.fullDate}
        size="small"
        sx={{
          mt: 0.5,
          fontSize: 10,
          height: 20,
          bgcolor: "#e0e0e0",
          color: "text.secondary",
        }}
      />
    </Box>
  );
};

const ChatView = ({ contact, messageText, setMessageText }) => (
  <Box sx={{ display: "flex", flexDirection: "column", height: "calc(100vh - 340px)", minHeight: 300 }}>
    <Stack direction="row" spacing={2} alignItems="center" mb={2} flexShrink={0}>
      <Avatar
        sx={{
          width: 44,
          height: 44,
          bgcolor: "#fce4ec",
          color: "#e91e63",
          fontWeight: 600,
          fontSize: 14,
        }}
      >
        {contact.initials}
      </Avatar>
      <Box>
        <Typography fontWeight={600}>{contact.name}</Typography>
        <Typography variant="caption" color="text.secondary">
          {contact.role}
        </Typography>
      </Box>
    </Stack>

    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        px: 1,
        mb: 2,
        "&::-webkit-scrollbar": { width: 6 },
        "&::-webkit-scrollbar-thumb": {
          bgcolor: "#ccc",
          borderRadius: 3,
        },
      }}
    >
      {mockMessages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
    </Box>

    <Stack direction="row" spacing={1} alignItems="center">
      <TextField
        fullWidth
        multiline
        maxRows={3}
        placeholder="Type your message..."
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        sx={{
          flex: 1,
          "& .MuiOutlinedInput-root": {
            borderRadius: 1,
            bgcolor: "background.paper",
          },
        }}
      />
      <IconButton
        sx={{
          flexShrink: 0,
          bgcolor: "primary.main",
          color: "#fff",
          width: 48,
          height: 48,
          borderRadius: 1,
          "&:hover": { bgcolor: "primary.dark" },
        }}
      >
        <SendIcon />
      </IconButton>
    </Stack>
  </Box>
);

const Message = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [isStudent] = useState(false);

  if (isStudent) {
    return (
      <Box>
        <Typography variant="h5" fontWeight={700}>
          Messages
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Chat with your tutor
        </Typography>

        <ChatView
          contact={tutor}
          messageText={messageText}
          setMessageText={setMessageText}
        />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight={700}>
        Messages
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Communicate with your students
      </Typography>

      <TextField
        fullWidth
        placeholder="Search conversations..."
        size="small"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: 1,
            bgcolor: "background.paper",
          },
        }}
      />

      <Stack
        direction="row"
        spacing={3}
        sx={{
          overflowX: "auto",
          pb: 2,
          mb: 2,
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
        }}
      >
        {contacts.map((c) => (
          <Box
            key={c.id}
            onClick={() => setSelectedContact(c)}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: 90,
              cursor: "pointer",
              opacity: selectedContact?.id === c.id ? 1 : 0.85,
              transition: "opacity 0.2s",
            }}
          >
            <Avatar
              sx={{
                width: 52,
                height: 52,
                bgcolor: "#fce4ec",
                color: "#e91e63",
                fontWeight: 600,
                fontSize: 16,
                mb: 1,
                border:
                  selectedContact?.id === c.id
                    ? "2px solid #1686D7"
                    : "2px solid transparent",
              }}
            >
              {c.initials}
            </Avatar>
            <Typography
              variant="caption"
              textAlign="center"
              noWrap
              sx={{ width: 110 }}
            >
              {c.name}
            </Typography>
          </Box>
        ))}
      </Stack>

      {!selectedContact ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 340,
            color: "text.secondary",
          }}
        >
          <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 48, mb: 2 }} />
          <Typography fontWeight={600} color="text.primary">
            Select a Conversation
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Choose a contact to start messaging
          </Typography>
        </Box>
      ) : (
        <ChatView
          contact={selectedContact}
          messageText={messageText}
          setMessageText={setMessageText}
        />
      )}
    </Box>
  );
};

export default Message;
