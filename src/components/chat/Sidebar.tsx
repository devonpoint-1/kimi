import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useTheme } from "@/hooks/useTheme";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MessageCircle,
  MoreVertical,
  Settings,
  Phone,
  Circle,
  LogOut,
  Moon,
  Sun,
  Users,
  Archive,
} from "lucide-react";
import { demoConversations, type DemoConversation } from "@/lib/demoData";
import { languageNames, type Language } from "@/i18n/translations";
import StatusView from "./StatusView";
import SettingsPanel from "./SettingsPanel";
import CallsView from "./CallsView";

interface SidebarProps {
  selectedChat: number | null;
  onSelectChat: (id: number) => void;
  activeView: string;
  onChangeView: (view: string) => void;
}

export default function Sidebar({
  selectedChat,
  onSelectChat,
  activeView,
  onChangeView,
}: SidebarProps) {
  const { t, isRTL, lang, setLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [chatTab, setChatTab] = useState("all");
  const [showStatus, setShowStatus] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCalls, setShowCalls] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const filteredChats = demoConversations.filter((chat) => {
    const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (chatTab === "unread") return matchesSearch && chat.unreadCount > 0;
    if (chatTab === "groups") return matchesSearch && chat.type === "group";
    return matchesSearch;
  });

  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString();
  };

  if (showStatus) {
    return <StatusView onBack={() => setShowStatus(false)} />;
  }

  if (showSettings) {
    return <SettingsPanel onBack={() => setShowSettings(false)} />;
  }

  if (showCalls) {
    return <CallsView onBack={() => setShowCalls(false)} onSelectChat={onSelectChat} />;
  }

  return (
    <div
      className="flex flex-col h-full border-r"
      style={{
        width: "420px",
        minWidth: "420px",
        backgroundColor: "var(--sc-bg-secondary)",
        borderColor: "var(--sc-border)",
      }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4"
        style={{
          height: "60px",
          backgroundColor: "var(--sc-bg-secondary)",
          borderBottom: "1px solid var(--sc-border)",
        }}
      >
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 cursor-pointer" onClick={() => setShowSettings(true)}>
            <AvatarImage src="https://ui-avatars.com/api/?name=User&background=00A884&color=fff" />
            <AvatarFallback style={{ backgroundColor: "var(--sc-accent)", color: "white" }}>
              U
            </AvatarFallback>
          </Avatar>
          <span
            className="text-lg font-semibold"
            style={{ color: "var(--sc-text-primary)" }}
          >
            {t("chats")}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowStatus(true)}
            className="p-2 rounded-full transition-colors"
            style={{ color: "var(--sc-text-secondary)" }}
            title={t("status")}
          >
            <Circle className="h-5 w-5" />
          </button>
          <button
            onClick={() => setShowCalls(true)}
            className="p-2 rounded-full transition-colors"
            style={{ color: "var(--sc-text-secondary)" }}
            title={t("calls")}
          >
            <Phone className="h-5 w-5" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-2 rounded-full transition-colors"
                style={{ color: "var(--sc-text-secondary)" }}
              >
                <MoreVertical className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              style={{
                backgroundColor: "var(--sc-bg-secondary)",
                borderColor: "var(--sc-border)",
              }}
            >
              <DropdownMenuItem
                onClick={() => setShowStatus(true)}
                style={{ color: "var(--sc-text-primary)" }}
              >
                <Circle className="mr-2 h-4 w-4" />
                {t("status")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowCalls(true)}
                style={{ color: "var(--sc-text-primary)" }}
              >
                <Phone className="mr-2 h-4 w-4" />
                {t("calls")}
              </DropdownMenuItem>
              <DropdownMenuSeparator style={{ backgroundColor: "var(--sc-border)" }} />
              <DropdownMenuItem
                onClick={toggleTheme}
                style={{ color: "var(--sc-text-primary)" }}
              >
                {theme === "dark" ? (
                  <Sun className="mr-2 h-4 w-4" />
                ) : (
                  <Moon className="mr-2 h-4 w-4" />
                )}
                {theme === "dark" ? t("lightMode") : t("darkMode")}
              </DropdownMenuItem>
              <DropdownMenuSeparator style={{ backgroundColor: "var(--sc-border)" }} />
              <DropdownMenuItem
                onClick={() => setShowSettings(true)}
                style={{ color: "var(--sc-text-primary)" }}
              >
                <Settings className="mr-2 h-4 w-4" />
                {t("settings")}
              </DropdownMenuItem>
              <DropdownMenuItem style={{ color: "var(--sc-danger)" }}>
                <LogOut className="mr-2 h-4 w-4" />
                {t("logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search */}
      <div
        className="px-4 py-2"
        style={{
          backgroundColor: "var(--sc-bg-primary)",
        }}
      >
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ backgroundColor: "var(--sc-bg-secondary)" }}
        >
          <Search className="h-4 w-4 shrink-0" style={{ color: "var(--sc-text-secondary)" }} />
          <Input
            placeholder={t("search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-7 text-sm px-0"
            style={{ color: "var(--sc-text-primary)" }}
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full" onValueChange={setChatTab}>
        <TabsList
          className="w-full rounded-none h-10"
          style={{
            backgroundColor: "var(--sc-bg-primary)",
            borderBottom: "1px solid var(--sc-border)",
          }}
        >
          <TabsTrigger
            value="all"
            className="flex-1 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            style={{
              color: chatTab === "all" ? "var(--sc-accent)" : "var(--sc-text-secondary)",
              borderBottom: chatTab === "all" ? "2px solid var(--sc-accent)" : "2px solid transparent",
            }}
          >
            {t("all")}
          </TabsTrigger>
          <TabsTrigger
            value="unread"
            className="flex-1 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            style={{
              color: chatTab === "unread" ? "var(--sc-accent)" : "var(--sc-text-secondary)",
              borderBottom: chatTab === "unread" ? "2px solid var(--sc-accent)" : "2px solid transparent",
            }}
          >
            {t("unread")}
          </TabsTrigger>
          <TabsTrigger
            value="groups"
            className="flex-1 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            style={{
              color: chatTab === "groups" ? "var(--sc-accent)" : "var(--sc-text-secondary)",
              borderBottom: chatTab === "groups" ? "2px solid var(--sc-accent)" : "2px solid transparent",
            }}
          >
            {t("groups")}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        {filteredChats.map((chat) => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            isSelected={selectedChat === chat.id}
            onClick={() => onSelectChat(chat.id)}
            formatTime={formatTime}
          />
        ))}
        {filteredChats.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12" style={{ color: "var(--sc-text-secondary)" }}>
            <MessageCircle className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-sm">{t("noChats")}</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

function ChatListItem({
  chat,
  isSelected,
  onClick,
  formatTime,
}: {
  chat: DemoConversation;
  isSelected: boolean;
  onClick: () => void;
  formatTime: (ts: string | null) => string;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
      style={{
        backgroundColor: isSelected ? "var(--sc-bg-hover)" : "transparent",
        borderBottom: "1px solid var(--sc-border)",
        borderLeft: isSelected ? "3px solid var(--sc-accent)" : "3px solid transparent",
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.backgroundColor = "var(--sc-bg-hover)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.backgroundColor = "transparent";
        }
      }}
    >
      <div className="relative shrink-0">
        <Avatar className="h-14 w-14">
          <AvatarImage src={chat.avatar} />
          <AvatarFallback style={{ backgroundColor: "var(--sc-accent)", color: "white" }}>
            {chat.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        {chat.participants[0]?.isOnline && (
          <div
            className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2"
            style={{
              backgroundColor: "var(--sc-status-online)",
              borderColor: "var(--sc-bg-secondary)",
            }}
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span
            className="font-medium truncate text-[15px]"
            style={{ color: "var(--sc-text-primary)" }}
          >
            {chat.name}
          </span>
          <span
            className="text-xs shrink-0 ml-2"
            style={{ color: chat.unreadCount > 0 ? "var(--sc-accent)" : "var(--sc-text-secondary)" }}
          >
            {formatTime(chat.lastMessage?.timestamp ?? null)}
          </span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span
            className="text-sm truncate"
            style={{
              color: chat.unreadCount > 0 ? "var(--sc-text-primary)" : "var(--sc-text-secondary)",
              fontWeight: chat.unreadCount > 0 ? 500 : 400,
            }}
          >
            {chat.type === "group" && chat.lastMessage && (
              <span>{chat.lastMessage.senderId === 0 ? "You: " : `${chat.participants.find(p => p.id === chat.lastMessage?.senderId)?.name ?? ''}: `}</span>
            )}
            {chat.lastMessage?.type === "audio" || chat.lastMessage?.type === "voice"
              ? "Voice message"
              : chat.lastMessage?.content}
          </span>
          {chat.unreadCount > 0 && (
            <Badge
              className="ml-2 shrink-0 h-5 min-w-5 flex items-center justify-center text-xs font-bold rounded-full"
              style={{
                backgroundColor: "var(--sc-badge)",
                color: "white",
              }}
            >
              {chat.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </button>
  );
}
