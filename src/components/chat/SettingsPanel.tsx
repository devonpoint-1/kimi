import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useTheme } from "@/hooks/useTheme";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  User,
  Lock,
  Bell,
  Palette,
  Globe,
  HelpCircle,
  Info,
  ChevronRight,
  Moon,
  Sun,
  Shield,
  MessageSquare,
  Phone,
  Key,
  Monitor,
  Users,
  Star,
  Smartphone,
  Mail,
  ExternalLink,
} from "lucide-react";
import { languageNames, type Language } from "@/i18n/translations";

interface SettingsPanelProps {
  onBack: () => void;
}

export default function SettingsPanel({ onBack }: SettingsPanelProps) {
  const { t, isRTL, lang, setLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const settingsSections = [
    { id: "account", icon: User, label: t("account") },
    { id: "privacy", icon: Lock, label: t("privacy") },
    { id: "notifications", icon: Bell, label: t("notifications") },
    { id: "appearance", icon: Palette, label: t("appearance") },
    { id: "language", icon: Globe, label: t("language") },
    { id: "help", icon: HelpCircle, label: t("help") },
  ];

  if (activeSection === "language") {
    return (
      <LanguageSettings
        onBack={() => setActiveSection(null)}
        currentLang={lang}
        onChangeLang={setLang}
      />
    );
  }

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
          {t("settings")}
        </span>
      </div>

      <ScrollArea className="flex-1">
        {/* Profile Section */}
        <div
          className="flex items-center gap-3 px-4 py-4 cursor-pointer transition-colors"
          style={{ borderBottom: "8px solid var(--sc-border)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--sc-bg-hover)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <Avatar className="h-16 w-16">
            <AvatarImage src="https://ui-avatars.com/api/?name=User&background=00A884&color=fff" />
            <AvatarFallback style={{ backgroundColor: "var(--sc-accent)", color: "white" }}>
              U
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p
              className="font-medium text-[17px]"
              style={{ color: "var(--sc-text-primary)" }}
            >
              SecureChat User
            </p>
            <p className="text-sm" style={{ color: "var(--sc-text-secondary)" }}>
              {t("encryptionInfo")}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0" style={{ color: "var(--sc-text-secondary)" }} />
        </div>

        {/* Settings Sections */}
        {settingsSections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className="w-full flex items-center gap-4 px-4 py-3 text-left transition-colors"
            style={{ borderBottom: "1px solid var(--sc-border)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--sc-bg-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <div
              className="p-2 rounded-lg"
              style={{
                backgroundColor: section.id === "account" ? "#00A88420" :
                  section.id === "privacy" ? "#FFD70020" :
                  section.id === "notifications" ? "#FF6B6B20" :
                  section.id === "appearance" ? "#4ECDC420" :
                  section.id === "language" ? "#45B7D120" :
                  "#8696A020",
              }}
            >
              <section.icon
                className="h-5 w-5"
                style={{
                  color: section.id === "account" ? "var(--sc-accent)" :
                    section.id === "privacy" ? "#FFD700" :
                    section.id === "notifications" ? "#FF6B6B" :
                    section.id === "appearance" ? "#4ECDC4" :
                    section.id === "language" ? "#45B7D1" :
                    "var(--sc-text-secondary)",
                }}
              />
            </div>
            <div className="flex-1">
              <p
                className="text-[15px]"
                style={{ color: "var(--sc-text-primary)" }}
              >
                {section.label}
              </p>
              {section.id === "language" && (
                <p className="text-sm" style={{ color: "var(--sc-text-secondary)" }}>
                  {languageNames[lang].localName}
                </p>
              )}
            </div>
            <ChevronRight className="h-5 w-5 shrink-0" style={{ color: "var(--sc-text-secondary)" }} />
          </button>
        ))}

        {/* About */}
        <div className="py-6 text-center">
          <p className="text-xs" style={{ color: "var(--sc-text-secondary)" }}>
            {t("appName")} v1.0.0
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--sc-text-secondary)" }}>
            {t("encryptionInfo")}
          </p>
        </div>
      </ScrollArea>
    </div>
  );
}

function LanguageSettings({
  onBack,
  currentLang,
  onChangeLang,
}: {
  onBack: () => void;
  currentLang: Language;
  onChangeLang: (lang: Language) => void;
}) {
  const { t, isRTL } = useLanguage();

  const languages: Language[] = ["ar", "en", "tr", "fa", "fr", "he", "es", "it", "ur", "ru", "zh"];

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
          {t("language")}
        </span>
      </div>

      <ScrollArea className="flex-1">
        <div className="py-2">
          <p
            className="px-4 py-2 text-xs font-medium uppercase"
            style={{ color: "var(--sc-text-secondary)" }}
          >
            {t("selectLanguage")}
          </p>
          {languages.map((lang) => {
            const info = languageNames[lang];
            return (
              <button
                key={lang}
                onClick={() => onChangeLang(lang)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                style={{
                  borderBottom: "1px solid var(--sc-border)",
                  backgroundColor: currentLang === lang ? "var(--sc-bg-hover)" : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (currentLang !== lang) {
                    e.currentTarget.style.backgroundColor = "var(--sc-bg-hover)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentLang !== lang) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                <span className="text-2xl">{info.flag}</span>
                <div className="flex-1">
                  <p
                    className="text-[15px] font-medium"
                    style={{ color: "var(--sc-text-primary)" }}
                  >
                    {info.name}
                  </p>
                  <p className="text-sm" style={{ color: "var(--sc-text-secondary)" }}>
                    {info.localName}
                  </p>
                </div>
                {currentLang === lang && (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "var(--sc-accent)" }}
                  >
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
