import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Phone,
  Video,
  Search,
  MoreVertical,
  Smile,
  Paperclip,
  Mic,
  Send,
  Check,
  CheckCheck,
  PhoneCall,
  PhoneOff,
  ArrowLeft,
  Image,
  FileText,
  Play,
  Pause,
  Headphones,
  X,
} from "lucide-react";
import {
  demoConversations,
  conversationMessages,
  type DemoMessage,
  type DemoConversation,
  demoUsers,
} from "@/lib/demoData";

interface ChatAreaProps {
  chatId: number;
  onBack: () => void;
}

export default function ChatArea({ chatId, onBack }: ChatAreaProps) {
  const { t, isRTL } = useLanguage();
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<DemoMessage[]>([]);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const chat = demoConversations.find((c) => c.id === chatId);

  useEffect(() => {
    if (chatId) {
      const msgs = conversationMessages[chatId] ?? [];
      setMessages(msgs);
    }
  }, [chatId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!chat) {
    return (
      <div
        className="flex-1 flex flex-col items-center justify-center"
        style={{ backgroundColor: "var(--sc-bg-chat)" }}
      >
        <div className="text-center">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: "var(--sc-bg-secondary)" }}
          >
            <PhoneCall className="h-12 w-12" style={{ color: "var(--sc-text-secondary)" }} />
          </div>
          <h2
            className="text-2xl font-light mb-2"
            style={{ color: "var(--sc-text-secondary)" }}
          >
            {t("selectChat")}
          </h2>
          <p className="text-sm" style={{ color: "var(--sc-text-secondary)" }}>
            {t("selectChatDesc")}
          </p>
        </div>
      </div>
    );
  }

  const otherUser = chat.participants[0];

  const handleSend = () => {
    if (!messageText.trim()) return;

    const newMessage: DemoMessage = {
      id: Date.now(),
      senderId: 0,
      content: messageText.trim(),
      type: "text",
      timestamp: new Date().toISOString(),
      status: "sent",
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessageText("");

    // Simulate delivered
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === newMessage.id ? { ...m, status: "delivered" as const } : m
        )
      );
    }, 1000);

    // Simulate read
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === newMessage.id ? { ...m, status: "read" as const } : m
        )
      );
    }, 3000);

    // Simulate reply
    setTimeout(() => {
      const replies = [
        "ممتاز!",
        "تمام، فهمت",
        "هههههه 😂",
        "شكراً على المعلومة",
        "سأتحقق من ذلك",
        "رائع!",
        "اتفق معك",
        "حاضر",
      ];
      const reply: DemoMessage = {
        id: Date.now() + 1,
        senderId: otherUser?.id ?? 1,
        content: replies[Math.floor(Math.random() * replies.length)],
        type: "text",
        timestamp: new Date().toISOString(),
        status: "read",
      };
      setMessages((prev) => [...prev, reply]);
    }, 4000);
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <Check className="h-3 w-3" />;
      case "delivered":
        return <CheckCheck className="h-3 w-3" />;
      case "read":
        return <CheckCheck className="h-3 w-3" style={{ color: "#53BDEB" }} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full sc-animate-fadeIn" dir={isRTL ? "rtl" : "ltr"}>
      {/* Chat Header */}
      <div
        className="flex items-center gap-3 px-4"
        style={{
          height: "60px",
          backgroundColor: "var(--sc-bg-secondary)",
          borderBottom: "1px solid var(--sc-border)",
        }}
      >
        <button
          onClick={onBack}
          className="lg:hidden p-2 rounded-full"
          style={{ color: "var(--sc-text-secondary)" }}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <Avatar className="h-10 w-10 cursor-pointer">
          <AvatarImage src={chat.avatar} />
          <AvatarFallback style={{ backgroundColor: "var(--sc-accent)", color: "white" }}>
            {chat.name.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h3
            className="font-medium text-[15px] truncate"
            style={{ color: "var(--sc-text-primary)" }}
          >
            {chat.name}
          </h3>
          <p className="text-xs truncate" style={{ color: "var(--sc-status-online)" }}>
            {chat.type === "group"
              ? `${chat.participants.length} ${t("participants")}`
              : otherUser?.isOnline
              ? t("online")
              : `${t("lastSeen")} ${otherUser?.lastSeen}`}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            className="p-2 rounded-full transition-colors"
            style={{ color: "var(--sc-text-secondary)" }}
          >
            <Video className="h-5 w-5" />
          </button>
          <button
            className="p-2 rounded-full transition-colors"
            style={{ color: "var(--sc-text-secondary)" }}
          >
            <Phone className="h-5 w-5" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-2 rounded-full transition-colors"
                style={{ color: "var(--sc-text-secondary)" }}
              >
                <Search className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              style={{
                backgroundColor: "var(--sc-bg-secondary)",
                borderColor: "var(--sc-border)",
              }}
            >
              <DropdownMenuItem style={{ color: "var(--sc-text-primary)" }}>
                {t("search")}
              </DropdownMenuItem>
              <DropdownMenuSeparator style={{ backgroundColor: "var(--sc-border)" }} />
              <DropdownMenuItem style={{ color: "var(--sc-text-primary)" }}>
                {t("mute")}
              </DropdownMenuItem>
              <DropdownMenuItem style={{ color: "var(--sc-text-primary)" }}>
                {t("archive")}
              </DropdownMenuItem>
              <DropdownMenuItem style={{ color: "var(--sc-text-primary)" }}>
                {t("block")}
              </DropdownMenuItem>
              <DropdownMenuItem style={{ color: "var(--sc-danger)" }}>
                {t("delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto sc-chat-bg px-4 py-4"
        style={{ backgroundColor: "var(--sc-bg-chat)" }}
      >
        <div className="max-w-3xl mx-auto space-y-1">
          {messages.map((msg, index) => {
            const isMe = msg.senderId === 0;
            const showTail =
              index === messages.length - 1 ||
              messages[index + 1]?.senderId !== msg.senderId;

            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-start" : "justify-end"}`}
                style={{
                  flexDirection: isRTL
                    ? isMe
                      ? "row"
                      : "row-reverse"
                    : isMe
                    ? "row-reverse"
                    : "row",
                }}
              >
                <div
                  className={`max-w-[65%] px-3 py-2 relative sc-animate-slideUp`}
                  style={{
                    backgroundColor: isMe
                      ? "var(--sc-message-out)"
                      : "var(--sc-message-in)",
                    borderRadius: isMe
                      ? isRTL
                        ? "7.5px 0 7.5px 7.5px"
                        : "7.5px 0 7.5px 7.5px"
                      : isRTL
                      ? "0 7.5px 7.5px 7.5px"
                      : "0 7.5px 7.5px 7.5px",
                    marginTop: "2px",
                  }}
                >
                  {chat.type === "group" && !isMe && (
                    <p
                      className="text-xs font-medium mb-1"
                      style={{ color: "#53BDEB" }}
                    >
                      {demoUsers.find((u) => u.id === msg.senderId)?.name ?? "Unknown"}
                    </p>
                  )}

                  {msg.type === "image" && (
                    <div className="mb-1 rounded-lg overflow-hidden">
                      <img
                        src={`https://picsum.photos/seed/${msg.id}/400/300`}
                        alt="Shared"
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                  )}

                  {msg.type === "audio" || msg.type === "voice" ? (
                    <div className="flex items-center gap-2 min-w-[180px]">
                      <button className="p-1.5 rounded-full" style={{ color: "var(--sc-accent)" }}>
                        <Play className="h-4 w-4" />
                      </button>
                      <div className="flex-1 flex items-center gap-0.5">
                        {[...Array(20)].map((_, i) => (
                          <div
                            key={i}
                            className="w-0.5 rounded-full"
                            style={{
                              height: `${8 + Math.random() * 16}px`,
                              backgroundColor: "var(--sc-accent)",
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-xs" style={{ color: "var(--sc-text-secondary)" }}>
                        0:15
                      </span>
                    </div>
                  ) : (
                    <p
                      className="text-[14.2px] leading-[19px] break-words"
                      style={{ color: "var(--sc-text-primary)" }}
                    >
                      {msg.content}
                    </p>
                  )}

                  <div
                    className="flex items-center gap-1 mt-1"
                    style={{
                      justifyContent: isRTL ? "flex-start" : "flex-end",
                    }}
                  >
                    <span
                      className="text-[11px]"
                      style={{ color: "var(--sc-text-secondary)" }}
                    >
                      {formatMessageTime(msg.timestamp)}
                    </span>
                    {isMe && (
                      <span style={{ color: "var(--sc-text-secondary)" }}>
                        {getStatusIcon(msg.status)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Encryption Banner */}
      <div
        className="flex items-center justify-center py-2 px-4 text-center"
        style={{
          backgroundColor: "var(--sc-bg-chat)",
          borderTop: "1px solid var(--sc-border)",
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--sc-accent)" }} />
          <span className="text-xs" style={{ color: "var(--sc-text-secondary)" }}>
            {t("encryptionInfo")}
          </span>
        </div>
      </div>

      {/* Input Area */}
      <div
        className="flex items-end gap-2 px-4 py-3"
        style={{
          backgroundColor: "var(--sc-bg-secondary)",
          borderTop: "1px solid var(--sc-border)",
          minHeight: "60px",
        }}
      >
        <div className="relative">
          <button
            onClick={() => setShowAttachMenu(!showAttachMenu)}
            className="p-2 rounded-full transition-colors"
            style={{ color: "var(--sc-text-secondary)" }}
          >
            {showAttachMenu ? (
              <X className="h-6 w-6" style={{ color: "var(--sc-text-secondary)" }} />
            ) : (
              <Paperclip className="h-6 w-6" />
            )}
          </button>
          {showAttachMenu && (
            <div
              className="absolute bottom-full mb-2 p-2 rounded-xl shadow-lg sc-animate-scaleIn"
              style={{
                backgroundColor: "var(--sc-bg-secondary)",
                border: "1px solid var(--sc-border)",
                [isRTL ? "right" : "left"]: 0,
              }}
            >
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: Image, label: t("photo") },
                  { icon: Video, label: t("video") },
                  { icon: FileText, label: t("document") },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    className="flex flex-col items-center gap-1 p-3 rounded-lg transition-colors"
                    style={{
                      color: "var(--sc-text-primary)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--sc-bg-hover)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <Icon className="h-6 w-6" style={{ color: "var(--sc-accent)" }} />
                    <span className="text-xs">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button className="p-2 rounded-full transition-colors" style={{ color: "var(--sc-text-secondary)" }}>
          <Smile className="h-6 w-6" />
        </button>

        <div className="flex-1">
          <Input
            ref={inputRef}
            placeholder={t("typeMessage")}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="border-0 rounded-lg px-4 py-2.5 focus-visible:ring-0 focus-visible:ring-offset-0"
            style={{
              backgroundColor: "var(--sc-bg-input)",
              color: "var(--sc-text-primary)",
            }}
          />
        </div>

        {messageText.trim() ? (
          <button
            onClick={handleSend}
            className="p-2 rounded-full transition-colors sc-animate-scaleIn"
            style={{ color: "var(--sc-accent)" }}
          >
            <Send className="h-6 w-6" />
          </button>
        ) : (
          <button
            className="p-2 rounded-full transition-colors"
            style={{ color: "var(--sc-text-secondary)" }}
            onMouseDown={() => setIsRecording(true)}
            onMouseUp={() => setIsRecording(false)}
          >
            <Mic className="h-6 w-6" />
          </button>
        )}
      </div>
    </div>
  );
}
