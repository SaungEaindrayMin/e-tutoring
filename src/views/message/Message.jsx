import { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Avatar,
  Stack,
  IconButton,
  Chip,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import DataServices from "../../services/data-services";
import Configuration from "../../services/configuration";
import SocketService from "../../services/socket";
import Cookies from "js-cookie";
import Resources from "../../services/resources";




const MessageBubble = ({ message }) => {
  const isMe = message.sender === "me";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: isMe ? "flex-end" : "flex-start",
        mb: 1,
      }}
    >
      <Box
        sx={{
          maxWidth: "60%",
          bgcolor: isMe ? "primary.main" : "#f0f0f0",
          color: isMe ? "#fff" : "text.primary",
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

const ChatView = ({ contact, messageText, setMessageText, onSendMessage, messages, scrollContainerRef, onScroll, isFetchingMore }) => (
  <Box sx={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
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
      ref={scrollContainerRef}
      onScroll={onScroll}
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
      {isFetchingMore && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
          <CircularProgress size={20} />
        </Box>
      )}
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
    </Box>

    <Stack direction="row" spacing={1} alignItems="flex-end">
      <TextField
        fullWidth
        multiline
        maxRows={3}
        placeholder="Type your message..."
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSendMessage();
          }
        }}
        sx={{
          flex: 1,
          "& .MuiOutlinedInput-root": {
            borderRadius: 1,
            bgcolor: "background.paper",
          },
        }}
      />
      <IconButton
        onClick={onSendMessage}
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
  const config = new Configuration();
  const dataService = new DataServices();
  const resources = new Resources();


  const [selectedContact, setSelectedContact] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const token = Cookies.get(config.COOKIE_NAME_TOKEN);
  const user = Cookies.get(config.COOKIE_NAME_USER) ? JSON.parse(Cookies.get(config.COOKIE_NAME_USER)) : null;
  const isStudent = user?.role === "STUDENT";
  const [conversations, setConversations] = useState([]);

  // Pagination state
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const scrollContainerRef = useRef(null);
  const shouldScrollToBottom = useRef(true); // true for fresh/new messages, false when prepending old ones




  let myId = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      myId = payload.id || payload.sub || payload.userId;
    } catch (e) { }
  }

  const fetchMessages = useCallback(async (pageNumber = 1) => {
    if (pageNumber === 1) {
      setIsLoading(true);
    } else {
      setIsFetchingMore(true);
    }

    try {
      const endpoint = `${config.SERVICE_GET_MESSAGES}?page=${pageNumber}&limit=10`;
      const response = await dataService.retrieve(config.SERVICE_NAME, endpoint);

      if (response?.status === 'success') {
        const apiMessages = Array.isArray(response.data?.data)
          ? response.data.data
          : (Array.isArray(response.data) ? response.data : []);

        const pagination = response.data?.pagination || {};
        setHasNextPage(pagination.hasNextPage ?? false);
        setPage(pageNumber);

        const formatted = apiMessages.map((msg) => ({
          id: msg.id,
          text: msg.content,
          time: new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          fullDate: new Date(msg.createdAt).toLocaleString(),
          sender: msg.senderId === myId ? "me" : "other",
          senderId: msg.senderId,
          receiverId: msg.receiverId,
        })).reverse();

        if (pageNumber === 1) {
          shouldScrollToBottom.current = true;
          setMessages(formatted);
        } else {
          shouldScrollToBottom.current = false;
          const container = scrollContainerRef.current;
          const prevScrollHeight = container ? container.scrollHeight : 0;
          setMessages((prev) => [...formatted, ...prev]);
          requestAnimationFrame(() => {
            if (container) {
              container.scrollTop = container.scrollHeight - prevScrollHeight;
            }
          });
        }
      } else {
        setErrorMessage("Failed to fetch messages");
      }
    } catch (err) {
      setErrorMessage("Network error: Cannot connect to server");
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  }, [myId]);

  // Fetch page 1 on mount
  useEffect(() => {
    fetchMessages(1);
  }, []);

  useEffect(() => {
    if (shouldScrollToBottom.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    if (container.scrollTop === 0 && hasNextPage && !isFetchingMore) {
      fetchMessages(page + 1);
    }
  }, [hasNextPage, isFetchingMore, page, fetchMessages]);



  // Fetch conversations on component mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await dataService.retrieve(config.SERVICE_NAME, config.SERVICE_GET_CONVERSATIONS);
        if (response?.status === 'success') {
          if (isStudent) {
            setSelectedContact(response.data[0] || null);
          } else {
            setConversations(response.data || []);
          }
          console.log("Fetched conversations:", response.data[0]);
        } else {
          setErrorMessage("Failed to fetch conversations");
        }
      } catch (err) {
        setErrorMessage("Network error: Cannot connect to server");
        console.error(err);
      }
    };

    fetchConversations();
  }, []);

  // Initialize socket connection on component mount
  useEffect(() => {

    if (token) {
      SocketService.init(token, resources.BACKEND_SIDE_SOCKET_URL);

      SocketService.joinUserRoom();

      // Listen for incoming messages
      const handleReceiveMessage = (data) => {
        console.log("New message received via socket:", data.content);
        fetchMessages(1);
      };

      SocketService.onMessageReceived(handleReceiveMessage);

      return () => {
        SocketService.offMessageReceived();
      };
    }
  }, []);

  const handleSendMessage = async () => {
    if (messageText.trim() && selectedContact) {
      const text = messageText;
      setMessageText("");

      // Send via socket
      SocketService.sendMessage(selectedContact.id, text);

      // Send via API
      try {
        const payload = {
          conversationId: selectedContact.id,
          content: text,
        };
        const response = await dataService.retrievePOST(
          payload,
          config.SERVICE_NAME + config.SERVICE_SEND_MESSAGE
        );
        if (response?.status !== "success") {
          console.error("Failed to send message via API", response);
        }
      } catch (err) {
        console.error("Network error: Cannot send message", err);
      }

      // Add to local messages
      const newMessage = {
        id: (Array.isArray(messages) ? messages.length : 0) + 1,
        text: text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        fullDate: new Date().toLocaleString(),
        sender: "me",
      };
      setMessages((prev) => (Array.isArray(prev) ? [...prev, newMessage] : [newMessage]));
    }
  };

  if (isStudent) {
    if (!selectedContact) {
      return (
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Messages
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Chat with your tutor
          </Typography>
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
              No Conversation Yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You have not been assigned a tutor yet. Please check back later.
            </Typography>
          </Box>
        </Box>
      );
    }

    const tutor = {
      name: selectedContact?.tutorName || '',
      initials: selectedContact?.tutorInitialName || '',
      role: "Personal Tutor",
    };
    return (
      <Box sx={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
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
          onSendMessage={handleSendMessage}
          messages={messages}
          scrollContainerRef={scrollContainerRef}
          onScroll={handleScroll}
          isFetchingMore={isFetchingMore}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
      <Typography variant="h5" fontWeight={700}>
        Messages
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Communicate with your students
      </Typography>

      {errorMessage && (
        <Typography color="error" variant="body2" mb={2}>
          {errorMessage}
        </Typography>
      )}

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
        {(conversations).map((c) => (
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
              {c.initialName}
            </Avatar>
            <Typography
              variant="caption"
              textAlign="center"
              noWrap
              sx={{ width: 110 }}
            >
              {c.studentName}
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
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
          <Stack direction="row" spacing={2} alignItems="center" mb={3}>
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
              {selectedContact.initialName}
            </Avatar>
            <Box>
              <Typography fontWeight={600}>{selectedContact.studentName}</Typography>
              <Typography variant="caption" color="text.secondary">
                Student
              </Typography>
            </Box>
          </Stack>

          <Box
            ref={scrollContainerRef}
            onScroll={handleScroll}
            sx={{
              flex: 1,
              overflowY: "auto",
              px: 1,
              mb: 2,
              "&::-webkit-scrollbar": { width: 6 },
              "&::-webkit-scrollbar-thumb": { bgcolor: "#ccc", borderRadius: 3 },
            }}
          >
            {isFetchingMore && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
                <CircularProgress size={20} />
              </Box>
            )}
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
          </Box>

          <Stack direction="row" spacing={1} alignItems="flex-end">
            <TextField
              fullWidth
              multiline
              maxRows={3}
              placeholder="Type your message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                  bgcolor: "background.paper",
                },
              }}
            />
            <IconButton
              onClick={handleSendMessage}
              sx={{
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
      )}
    </Box>
  );
};

export default Message;
