import { useLanguage } from "@/i18n/LanguageContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Plus, Circle } from "lucide-react";
import { demoStatuses, type DemoStatus } from "@/lib/demoData";

interface StatusViewProps {
  onBack: () => void;
}

export default function StatusView({ onBack }: StatusViewProps) {
  const { t, isRTL } = useLanguage();

  const viewedStatuses = demoStatuses.filter((s) => s.isViewed);
  const recentStatuses = demoStatuses.filter((s) => !s.isViewed);

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
          {t("status")}
        </span>
      </div>

      <ScrollArea className="flex-1">
        {/* My Status */}
        <div
          className="flex items-center gap-3 px-4 py-3 cursor-pointer"
          style={{ borderBottom: "1px solid var(--sc-border)" }}
        >
          <div className="relative">
            <Avatar className="h-14 w-14">
              <AvatarImage src="https://ui-avatars.com/api/?name=User&background=00A884&color=fff" />
              <AvatarFallback style={{ backgroundColor: "var(--sc-accent)", color: "white" }}>
                U
              </AvatarFallback>
            </Avatar>
            <div
              className="absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "var(--sc-accent)", border: "2px solid var(--sc-bg-secondary)" }}
            >
              <Plus className="h-3 w-3 text-white" />
            </div>
          </div>
          <div>
            <p
              className="font-medium text-[15px]"
              style={{ color: "var(--sc-text-primary)" }}
            >
              {t("myStatus")}
            </p>
            <p className="text-sm" style={{ color: "var(--sc-text-secondary)" }}>
              {t("tapToAdd")}
            </p>
          </div>
        </div>

        {/* Recent Updates */}
        {recentStatuses.length > 0 && (
          <div className="py-2">
            <p
              className="px-4 py-2 text-xs font-medium uppercase"
              style={{ color: "var(--sc-text-secondary)" }}
            >
              {t("recentUpdates")}
            </p>
            {recentStatuses.map((status) => (
              <StatusItem key={status.id} status={status} />
            ))}
          </div>
        )}

        {/* Viewed Updates */}
        {viewedStatuses.length > 0 && (
          <div className="py-2">
            <p
              className="px-4 py-2 text-xs font-medium uppercase"
              style={{ color: "var(--sc-text-secondary)" }}
            >
              {t("viewedUpdates")}
            </p>
            {viewedStatuses.map((status) => (
              <StatusItem key={status.id} status={status} viewed />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

function StatusItem({ status, viewed }: { status: DemoStatus; viewed?: boolean }) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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
      <div className="relative">
        <div
          className="p-0.5 rounded-full"
          style={{
            background: viewed
              ? "var(--sc-border)"
              : "linear-gradient(135deg, #00A884 0%, #005C4B 100%)",
          }}
        >
          <Avatar className="h-14 w-14 border-2" style={{ borderColor: "var(--sc-bg-secondary)" }}>
            <AvatarImage src={status.user.avatar} />
            <AvatarFallback style={{ backgroundColor: "var(--sc-accent)", color: "white" }}>
              {status.user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="font-medium text-[15px] truncate"
          style={{ color: "var(--sc-text-primary)" }}
        >
          {status.user.name}
        </p>
        <p className="text-sm truncate" style={{ color: "var(--sc-text-secondary)" }}>
          {formatTime(status.timestamp)}
        </p>
      </div>
    </div>
  );
}
