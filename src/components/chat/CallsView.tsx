import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  Phone,
  Video,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  PhoneCall,
  Clock,
} from "lucide-react";
import { demoCalls, type DemoCall } from "@/lib/demoData";

interface CallsViewProps {
  onBack: () => void;
  onSelectChat: (id: number) => void;
}

export default function CallsView({ onBack, onSelectChat }: CallsViewProps) {
  const { t, isRTL } = useLanguage();
  const [callTab, setCallTab] = useState<"all" | "missed">("all");

  const filteredCalls = callTab === "missed"
    ? demoCalls.filter((c) => c.direction === "missed")
    : demoCalls;

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString();
  };

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return "";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{
        width: "420px",
        minWidth: "420px",
        backgroundColor: "var(--sc-bg-secondary)",
      }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header */}
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
          className="p-2 rounded-full"
          style={{ color: "var(--sc-text-secondary)" }}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span
          className="text-lg font-semibold"
          style={{ color: "var(--sc-text-primary)" }}
        >
          {t("calls")}
        </span>
      </div>

      {/* Tabs */}
      <div
        className="flex"
        style={{
          borderBottom: "1px solid var(--sc-border)",
        }}
      >
        <button
          onClick={() => setCallTab("all")}
          className="flex-1 py-3 text-center text-sm font-medium transition-colors"
          style={{
            color: callTab === "all" ? "var(--sc-accent)" : "var(--sc-text-secondary)",
            borderBottom: callTab === "all" ? "2px solid var(--sc-accent)" : "2px solid transparent",
          }}
        >
          {t("all")}
        </button>
        <button
          onClick={() => setCallTab("missed")}
          className="flex-1 py-3 text-center text-sm font-medium transition-colors"
          style={{
            color: callTab === "missed" ? "var(--sc-accent)" : "var(--sc-text-secondary)",
            borderBottom: callTab === "missed" ? "2px solid var(--sc-accent)" : "2px solid transparent",
          }}
        >
          {t("missed")}
        </button>
      </div>

      <ScrollArea className="flex-1">
        {filteredCalls.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12" style={{ color: "var(--sc-text-secondary)" }}>
            <PhoneCall className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-sm">{t("noCalls")}</p>
          </div>
        )}

        {filteredCalls.map((call) => (
          <CallItem
            key={call.id}
            call={call}
            formatTime={formatTime}
            formatDuration={formatDuration}
          />
        ))}
      </ScrollArea>
    </div>
  );
}

function CallItem({
  call,
  formatTime,
  formatDuration,
}: {
  call: DemoCall;
  formatTime: (ts: string) => string;
  formatDuration: (s: number) => string;
}) {
  const { isRTL } = useLanguage();

  const getIcon = () => {
    switch (call.direction) {
      case "incoming":
        return <PhoneIncoming className="h-4 w-4" style={{ color: "var(--sc-status-online)" }} />;
      case "outgoing":
        return <PhoneOutgoing className="h-4 w-4" style={{ color: "var(--sc-accent)" }} />;
      case "missed":
        return <PhoneMissed className="h-4 w-4" style={{ color: "var(--sc-danger)" }} />;
    }
  };

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors"
      style={{ borderBottom: "1px solid var(--sc-border)" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--sc-bg-hover)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      <Avatar className="h-12 w-12">
        <AvatarImage src={call.user.avatar} />
        <AvatarFallback style={{ backgroundColor: "var(--sc-accent)", color: "white" }}>
          {call.user.name.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p
          className="font-medium text-[15px] truncate"
          style={{
            color: call.direction === "missed" ? "var(--sc-danger)" : "var(--sc-text-primary)",
          }}
        >
          {call.user.name}
        </p>
        <div className="flex items-center gap-1.5">
          {getIcon()}
          <span className="text-sm" style={{ color: "var(--sc-text-secondary)" }}>
            {formatTime(call.timestamp)}
          </span>
          {call.duration > 0 && (
            <>
              <span style={{ color: "var(--sc-text-secondary)" }}>·</span>
              <span className="text-sm" style={{ color: "var(--sc-text-secondary)" }}>
                {formatDuration(call.duration)}
              </span>
            </>
          )}
        </div>
      </div>

      <button
        className="p-2 rounded-full transition-colors"
        style={{ color: "var(--sc-accent)" }}
      >
        {call.type === "video" ? (
          <Video className="h-5 w-5" />
        ) : (
          <Phone className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}
