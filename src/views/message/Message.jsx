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
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import DataServices from "../../services/data-services";
import Configuration from "../../services/configuration";
import SocketService from "../../services/socket";
import Cookies from "js-cookie";
import Resources from "../../services/resources";

const PAGE_HEIGHT = {
  xs: "calc(100dvh - 120px)",
  md: "calc(100vh - 120px)",
};

const CARD_SURFACE = {
  border: "1px solid",
  borderColor: "rgba(15, 23, 42, 0.08)",
  borderRadius: 3,
  bgcolor: "background.paper",
  boxShadow: "0 12px 40px rgba(15, 23, 42, 0.06)",
};

const buildInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "?";

const getConversationName = (conversation) =>
  conversation?.studentName ||
  conversation?.tutorName ||
  conversation?.name ||
  "Unknown User";

const getConversationInitials = (conversation) =>
  conversation?.initialName ||
  conversation?.tutorInitialName ||
  conversation?.initials ||
  buildInitials(getConversationName(conversation));

const MessageBubble = ({ message, isUpdatingReadStatus }) => {
  const isMe = message.sender === "me";
  const canToggleRead = message.canUpdateReadStatus;

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
          maxWidth: { xs: "82%", sm: "70%", md: "60%" },
          bgcolor: isMe ? "primary.main" : "#f0f0f0",
          color: isMe ? "#fff" : "text.primary",
          borderRadius: 2,
          px: 2,
          py: 1.2,
          overflowWrap: "anywhere",
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

      {canToggleRead && (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
          <Chip
            label={
              isUpdatingReadStatus
                ? "Updating..."
                : message.isRead
                  ? "Read"
                  : "Unread"
            }
            size="small"
            sx={{
              fontSize: 10,
              height: 20,
              bgcolor: message.isRead ? "#E8F5E9" : "#FFEBEE",
              color: message.isRead ? "#2E7D32" : "#C62828",
            }}
          />
        </Stack>
      )}

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

const ConversationList = ({
  conversations,
  selectedContact,
  searchQuery,
  setSearchQuery,
  onSelect,
  emptyMessage,
}) => (
  <Box
    sx={{
      ...CARD_SURFACE,
      display: "flex",
      flexDirection: "column",
      width: { xs: "100%", md: 320 },
      flexShrink: 0,
      minHeight: 0,
      overflow: "hidden",
    }}
  >
    <Box
      sx={{
        p: { xs: 1.5, sm: 2 },
        borderBottom: "1px solid",
        borderColor: "rgba(15, 23, 42, 0.08)",
      }}
    >
      <TextField
        fullWidth
        placeholder="Search conversations..."
        size="small"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
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
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            bgcolor: "background.paper",
          },
        }}
      />
    </Box>

    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        p: 1,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      {conversations.length === 0 ? (
        <Box
          sx={{
            flex: 1,
            minHeight: 220,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "text.secondary",
            textAlign: "center",
            px: 2,
          }}
        >
          <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 40, mb: 1.5 }} />
          <Typography fontWeight={600} color="text.primary">
            No Conversations Found
          </Typography>
          <Typography variant="body2">{emptyMessage}</Typography>
        </Box>
      ) : (
        conversations.map((conversation) => {
          const isSelected = selectedContact?.id === conversation.id;
          const unreadCount = Number(conversation.unreadCount) || 0;

          return (
            <Box
              key={conversation.id}
              onClick={() => onSelect(conversation)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.25,
                borderRadius: 2,
                border: "1px solid",
                borderColor: isSelected ? "primary.main" : "transparent",
                bgcolor: isSelected ? "primary.active" : "transparent",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: isSelected ? "primary.active" : "rgba(15, 23, 42, 0.04)",
                },
              }}
            >
              <Box sx={{ position: "relative", flexShrink: 0 }}>
                <Avatar
                  sx={{
                    width: 46,
                    height: 46,
                    bgcolor: "#fce4ec",
                    color: "#e91e63",
                    fontWeight: 600,
                    fontSize: 15,
                  }}
                >
                  {getConversationInitials(conversation)}
                </Avatar>
                {unreadCount > 0 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: -4,
                      right: -4,
                      minWidth: 18,
                      height: 18,
                      px: 0.5,
                      borderRadius: "999px",
                      bgcolor: "#d32f2f",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 700,
                      lineHeight: 1,
                    }}
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </Box>
                )}
              </Box>

              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography fontWeight={600} noWrap>
                  {getConversationName(conversation)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Student
                </Typography>
              </Box>
            </Box>
          );
        })
      )}
    </Box>
  </Box>
);

const ChatView = ({
  contact,
  messageText,
  setMessageText,
  onSendMessage,
  messages,
  scrollContainerRef,
  onScroll,
  isLoading,
  isFetchingMore,
  readStatusLoadingIds,
  onBack,
  layoutMode = "compact",
}) => {
  const isDesktopLayout = layoutMode === "desktop";

  const composer = (
    <Stack direction="row" spacing={1} alignItems="flex-end">
      <TextField
        fullWidth
        multiline
        maxRows={3}
        placeholder="Type your message..."
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSendMessage();
          }
        }}
        sx={{
          flex: 1,
          "& .MuiOutlinedInput-root": {
            borderRadius: isDesktopLayout ? 1 : 2,
            bgcolor: "background.paper",
          },
        }}
      />
      <IconButton
        onClick={onSendMessage}
        disabled={!messageText.trim()}
        sx={{
          flexShrink: 0,
          bgcolor: "primary.main",
          color: "#fff",
          width: isDesktopLayout ? 48 : { xs: 44, sm: 48 },
          height: isDesktopLayout ? 48 : { xs: 44, sm: 48 },
          borderRadius: isDesktopLayout ? 1 : 2,
          "&:hover": { bgcolor: "primary.dark" },
          "&.Mui-disabled": {
            bgcolor: "rgba(22, 134, 215, 0.35)",
            color: "rgba(255,255,255,0.85)",
          },
        }}
      >
        <SendIcon />
      </IconButton>
    </Stack>
  );

  return (
    <Box
      sx={
        isDesktopLayout
          ? { display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }
          : {
              ...CARD_SURFACE,
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minHeight: 0,
              overflow: "hidden",
            }
      }
    >
      <Stack
        direction="row"
        spacing={isDesktopLayout ? 2 : 1.5}
        alignItems="center"
        sx={
          isDesktopLayout
            ? { mb: 2, flexShrink: 0 }
            : {
                px: { xs: 1.5, sm: 2.5 },
                py: 2,
                borderBottom: "1px solid",
                borderColor: "rgba(15, 23, 42, 0.08)",
                flexShrink: 0,
              }
        }
      >
        {!isDesktopLayout && onBack && (
          <IconButton
            onClick={onBack}
            size="small"
            sx={{
              flexShrink: 0,
              border: "1px solid rgba(15, 23, 42, 0.08)",
              borderRadius: 2,
            }}
          >
            <ArrowBackRoundedIcon fontSize="small" />
          </IconButton>
        )}

        <Avatar
          sx={{
            width: 44,
            height: 44,
            bgcolor: "#fce4ec",
            color: "#e91e63",
            fontWeight: 600,
            fontSize: 14,
            flexShrink: 0,
          }}
        >
          {contact.initials}
        </Avatar>

        <Box sx={{ minWidth: 0 }}>
          <Typography fontWeight={600} noWrap>
            {contact.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {contact.role}
          </Typography>
        </Box>
      </Stack>

      <Box
        ref={scrollContainerRef}
        onScroll={onScroll}
        sx={
          isDesktopLayout
            ? {
                flex: 1,
                overflowY: "auto",
                px: 1,
                mb: 2,
                "&::-webkit-scrollbar": { width: 6 },
                "&::-webkit-scrollbar-thumb": {
                  bgcolor: "#ccc",
                  borderRadius: 3,
                },
              }
            : {
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                px: { xs: 1, sm: 1.5 },
                py: 1.5,
                bgcolor: "#FAFBFC",
                "&::-webkit-scrollbar": { width: 6 },
                "&::-webkit-scrollbar-thumb": {
                  bgcolor: "#ccc",
                  borderRadius: 3,
                },
              }
        }
      >
        {isFetchingMore && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
            <CircularProgress size={20} />
          </Box>
        )}

        {!isDesktopLayout && isLoading && messages.length === 0 ? (
          <Box
            sx={{
              minHeight: 220,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress size={24} />
          </Box>
        ) : !isDesktopLayout && messages.length === 0 ? (
          <Box
            sx={{
              minHeight: 220,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "text.secondary",
              textAlign: "center",
              px: 2,
            }}
          >
            <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 40, mb: 1.5 }} />
            <Typography fontWeight={600} color="text.primary">
              No Messages Yet
            </Typography>
            <Typography variant="body2">
              Start the conversation by sending the first message.
            </Typography>
          </Box>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isUpdatingReadStatus={Boolean(readStatusLoadingIds[msg.id])}
            />
          ))
        )}
      </Box>

      {isDesktopLayout ? (
        composer
      ) : (
        <Box
          sx={{
            p: { xs: 1.25, sm: 1.5 },
            borderTop: "1px solid",
            borderColor: "rgba(15, 23, 42, 0.08)",
            bgcolor: "background.paper",
            flexShrink: 0,
          }}
        >
          {composer}
        </Box>
      )}
    </Box>
  );
};

const Message = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const config = useRef(new Configuration()).current;
  const dataService = useRef(new DataServices()).current;
  const resources = useRef(new Resources()).current;
  const cookieNameToken = config.COOKIE_NAME_TOKEN;
  const cookieNameUser = config.COOKIE_NAME_USER;
  const serviceName = config.SERVICE_NAME;
  const serviceGetConversations = config.SERVICE_GET_CONVERSATIONS;
  const serviceGetMessages = config.SERVICE_GET_MESSAGES;
  const serviceSendMessage = config.SERVICE_SEND_MESSAGE;
  const serviceMessageStatus = config.SERVICE_MESSAGE_STATUS;
  const socketUrl = resources.BACKEND_SIDE_SOCKET_URL;

  const [selectedContact, setSelectedContact] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConversationListMobile, setShowConversationListMobile] =
    useState(true);
  const token = Cookies.get(cookieNameToken);
  const user = Cookies.get(cookieNameUser)
    ? JSON.parse(Cookies.get(cookieNameUser))
    : null;
  const isStudent = user?.role === "STUDENT";
  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [readStatusLoadingIds, setReadStatusLoadingIds] = useState({});
  const scrollContainerRef = useRef(null);
  const shouldScrollToBottom = useRef(true);
  const selectedConversationIdRef = useRef(null);
  const conversationFetchRequestIdRef = useRef(0);
  const hasSelectedContact = Boolean(selectedContact?.id);

  let myId = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      myId = payload.id || payload.sub || payload.userId;
    } catch {
      myId = null;
    }
  }

  useEffect(() => {
    if (!isMobile) {
      setShowConversationListMobile(true);
      return;
    }

    if (!hasSelectedContact) {
      setShowConversationListMobile(true);
    }
  }, [hasSelectedContact, isMobile]);

  const updateMessageStatus = useCallback(
    async (messageId, isRead) => {
      const response = await dataService.retrievePOST(
        {
          messageId,
          isRead,
        },
        serviceName + serviceMessageStatus,
      );

      if (response?.status !== "success") {
        throw new Error(response?.message || "Failed to update message status");
      }

      return response;
    },
    [dataService, serviceMessageStatus, serviceName],
  );

  const fetchConversations = useCallback(
    async (searchValue = "") => {
      const normalizedSearch =
        typeof searchValue === "string" ? searchValue.trim() : "";
      const endpoint =
        !isStudent && normalizedSearch
          ? `${serviceGetConversations}?search=${encodeURIComponent(normalizedSearch)}`
          : serviceGetConversations;
      const requestId = ++conversationFetchRequestIdRef.current;

      try {
        const response = await dataService.retrieve(serviceName, endpoint);
        if (requestId !== conversationFetchRequestIdRef.current) {
          return;
        }

        if (response?.status === "success") {
          const list = response.data || [];
          if (isStudent) {
            setSelectedContact(list[0] || null);
          } else {
            setConversations(list);
            setSelectedContact((prev) => {
              if (!prev) return prev;
              return list.find((item) => item.id === prev.id) || null;
            });
          }
        } else {
          setErrorMessage("Failed to fetch conversations");
        }
      } catch (err) {
        setErrorMessage("Network error: Cannot connect to server");
        console.error(err);
      }
    },
    [dataService, isStudent, serviceGetConversations, serviceName],
  );

  const fetchMessages = useCallback(
    async (pageNumber = 1, conversationIdOverride = null) => {
      const conversationId = conversationIdOverride || selectedContact?.id || null;
      if (!conversationId) {
        if (pageNumber === 1) {
          setMessages([]);
          setPage(1);
          setHasNextPage(false);
        }
        return;
      }

      if (pageNumber === 1) {
        setIsLoading(true);
      } else {
        setIsFetchingMore(true);
      }

      try {
        const endpoint = `${serviceGetMessages}?conversationId=${conversationId}&page=${pageNumber}&limit=10`;
        const response = await dataService.retrieve(serviceName, endpoint);

        if (response?.status === "success") {
          if (conversationId !== selectedConversationIdRef.current) {
            return;
          }

          const apiMessages = Array.isArray(response.data?.data)
            ? response.data.data
            : Array.isArray(response.data)
              ? response.data
              : [];

          const pagination = response.data?.pagination || {};
          setHasNextPage(pagination.hasNextPage ?? false);
          setPage(pageNumber);

          const formatted = apiMessages
            .map((msg) => ({
              id: msg.id,
              conversationId: msg.conversationId,
              text: msg.content,
              time: new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              fullDate: new Date(msg.createdAt).toLocaleString(),
              sender: msg.senderId === myId ? "me" : "other",
              senderId: msg.senderId,
              receiverId: msg.receiverId,
              isRead: Boolean(msg.isRead),
              readAt: msg.readAt,
              canUpdateReadStatus: msg.receiverId === myId,
            }))
            .reverse();

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
    },
    [dataService, myId, selectedContact?.id, serviceGetMessages, serviceName],
  );

  useEffect(() => {
    selectedConversationIdRef.current = selectedContact?.id || null;
  }, [selectedContact?.id]);

  useEffect(() => {
    if (!selectedContact?.id) {
      setMessages([]);
      setPage(1);
      setHasNextPage(false);
      return;
    }

    setMessages([]);
    setPage(1);
    setHasNextPage(false);
    fetchMessages(1, selectedContact.id);
  }, [selectedContact?.id, fetchMessages]);

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

  useEffect(() => {
    if (isStudent) {
      fetchConversations("");
      return undefined;
    }

    const timer = setTimeout(() => {
      fetchConversations(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [isStudent, searchQuery, fetchConversations]);

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    SocketService.init(token, socketUrl);
    SocketService.joinUserRoom();

    const handleReceiveMessage = () => {
      if (selectedContact?.id) {
        fetchMessages(1, selectedContact.id);
      }
      fetchConversations(searchQuery);
    };

    SocketService.onMessageReceived(handleReceiveMessage);

    return () => {
      SocketService.offMessageReceived();
    };
  }, [
    token,
    fetchConversations,
    fetchMessages,
    selectedContact?.id,
    searchQuery,
    socketUrl,
  ]);

  useEffect(() => {
    if (!selectedContact || messages.length === 0) return;

    const unreadIncomingIds = messages
      .filter((msg) => msg.canUpdateReadStatus && !msg.isRead)
      .map((msg) => msg.id);

    if (unreadIncomingIds.length === 0) return;

    let cancelled = false;

    const autoMarkAsRead = async () => {
      setReadStatusLoadingIds((prev) => {
        const next = { ...prev };
        unreadIncomingIds.forEach((id) => {
          next[id] = true;
        });
        return next;
      });

      try {
        const results = await Promise.all(
          unreadIncomingIds.map((id) =>
            updateMessageStatus(id, true)
              .then((res) => res?.data?.id || null)
              .catch(() => null),
          ),
        );

        if (cancelled) return;

        const updatedIds = new Set(results.filter(Boolean));
        if (updatedIds.size > 0) {
          const nowIso = new Date().toISOString();
          setMessages((prev) =>
            prev.map((msg) =>
              updatedIds.has(msg.id)
                ? {
                    ...msg,
                    isRead: true,
                    readAt: msg.readAt || nowIso,
                  }
                : msg,
            ),
          );
          fetchConversations();
        }
      } finally {
        if (!cancelled) {
          setReadStatusLoadingIds((prev) => {
            const next = { ...prev };
            unreadIncomingIds.forEach((id) => {
              delete next[id];
            });
            return next;
          });
        }
      }
    };

    autoMarkAsRead();

    return () => {
      cancelled = true;
    };
  }, [messages, selectedContact, updateMessageStatus, fetchConversations]);

  const handleSendMessage = async () => {
    if (messageText.trim() && selectedContact) {
      const text = messageText;
      setMessageText("");

      SocketService.sendMessage(selectedContact.id, text);

      try {
        const payload = {
          conversationId: selectedContact.id,
          content: text,
        };
        const response = await dataService.retrievePOST(
          payload,
          serviceName + serviceSendMessage,
        );
        if (response?.status !== "success") {
          console.error("Failed to send message via API", response);
        }
      } catch (err) {
        console.error("Network error: Cannot send message", err);
      }

      const newMessage = {
        id: (Array.isArray(messages) ? messages.length : 0) + 1,
        text,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        fullDate: new Date().toLocaleString(),
        sender: "me",
        senderId: myId,
        receiverId: selectedContact.studentId || selectedContact.tutorId || "",
        isRead: false,
        readAt: null,
        canUpdateReadStatus: false,
      };
      setMessages((prev) =>
        Array.isArray(prev) ? [...prev, newMessage] : [newMessage],
      );
      fetchConversations(searchQuery);
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedContact(conversation);
    setMessageText("");
    if (isMobile) {
      setShowConversationListMobile(false);
    }
  };

  const pageShellSx = {
    display: "flex",
    flexDirection: "column",
    height: PAGE_HEIGHT,
    minHeight: 0,
  };

  if (isStudent) {
    if (!selectedContact) {
      return (
        <Box sx={pageShellSx}>
          <Typography variant="h5" fontWeight={700}>
            Messages
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Chat with your tutor
          </Typography>
          <Box
            sx={{
              ...(isDesktop ? {} : CARD_SURFACE),
              display: "flex",
              flex: 1,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 340,
              color: "text.secondary",
              textAlign: "center",
              px: 2,
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
      name: selectedContact?.tutorName || "",
      initials:
        selectedContact?.tutorInitialName ||
        buildInitials(selectedContact?.tutorName || ""),
      role: "Personal Tutor",
    };

    return (
      <Box sx={pageShellSx}>
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
          isLoading={isLoading}
          isFetchingMore={isFetchingMore}
          readStatusLoadingIds={readStatusLoadingIds}
          layoutMode={isDesktop ? "desktop" : "compact"}
        />
      </Box>
    );
  }

  const activeContact = selectedContact
    ? {
        name: getConversationName(selectedContact),
        initials: getConversationInitials(selectedContact),
        role: "Student",
      }
    : null;

  return (
    <Box sx={pageShellSx}>
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

      {isDesktop ? (
        <>
          <TextField
            fullWidth
            placeholder="Search conversations..."
            size="small"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
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
            {conversations.map((conversation) => {
              const conversationName = getConversationName(conversation);
              const conversationInitials = getConversationInitials(conversation);
              const unreadCount = Number(conversation.unreadCount) || 0;

              return (
                <Box
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation)}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    minWidth: 90,
                    cursor: "pointer",
                    opacity: selectedContact?.id === conversation.id ? 1 : 0.85,
                    transition: "opacity 0.2s",
                  }}
                >
                  <Box sx={{ position: "relative", mb: 1 }}>
                    <Avatar
                      sx={{
                        width: 52,
                        height: 52,
                        bgcolor: "#fce4ec",
                        color: "#e91e63",
                        fontWeight: 600,
                        fontSize: 16,
                        border:
                          selectedContact?.id === conversation.id
                            ? "2px solid #1686D7"
                            : "2px solid transparent",
                      }}
                    >
                      {conversationInitials}
                    </Avatar>
                    {unreadCount > 0 && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: -5,
                          right: -5,
                          minWidth: 18,
                          height: 18,
                          px: 0.5,
                          borderRadius: "999px",
                          bgcolor: "#d32f2f",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          fontWeight: 700,
                          lineHeight: 1,
                        }}
                      >
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </Box>
                    )}
                  </Box>
                  <Typography
                    variant="caption"
                    textAlign="center"
                    noWrap
                    sx={{ width: 110 }}
                  >
                    {conversationName}
                  </Typography>
                </Box>
              );
            })}
          </Stack>

          {!selectedContact ? (
            <Box
              sx={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 340,
                color: "text.secondary",
                textAlign: "center",
                px: 2,
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
              contact={activeContact}
              messageText={messageText}
              setMessageText={setMessageText}
              onSendMessage={handleSendMessage}
              messages={messages}
              scrollContainerRef={scrollContainerRef}
              onScroll={handleScroll}
              isLoading={isLoading}
              isFetchingMore={isFetchingMore}
              readStatusLoadingIds={readStatusLoadingIds}
              layoutMode="desktop"
            />
          )}
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            flex: 1,
            minHeight: 0,
            gap: 2,
          }}
        >
          {(!isMobile || showConversationListMobile || !selectedContact) && (
            <ConversationList
              conversations={conversations}
              selectedContact={selectedContact}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSelect={handleSelectConversation}
              emptyMessage="Search for a student or wait for a new conversation to appear."
            />
          )}

          {!selectedContact ? (
            !isMobile && (
              <Box
                sx={{
                  ...CARD_SURFACE,
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 340,
                  color: "text.secondary",
                  textAlign: "center",
                  px: 2,
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
            )
          ) : (
            (!isMobile || !showConversationListMobile) && (
              <ChatView
                contact={activeContact}
                messageText={messageText}
                setMessageText={setMessageText}
                onSendMessage={handleSendMessage}
                messages={messages}
                scrollContainerRef={scrollContainerRef}
                onScroll={handleScroll}
                isLoading={isLoading}
                isFetchingMore={isFetchingMore}
                readStatusLoadingIds={readStatusLoadingIds}
                onBack={isMobile ? () => setShowConversationListMobile(true) : undefined}
                layoutMode="compact"
              />
            )
          )}
        </Box>
      )}
    </Box>
  );
};

export default Message;
