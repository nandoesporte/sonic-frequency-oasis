import { Globe, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/i18n";
import { cn } from "@/lib/utils";

const FLAGS: Record<SupportedLanguage, string> = {
  pt: "🇧🇷",
  en: "🇺🇸",
  es: "🇪🇸",
};

const NAMES: Record<SupportedLanguage, string> = {
  pt: "Português",
  en: "English",
  es: "Español",
};

interface Props {
  variant?: "icon" | "full";
  className?: string;
}

export function LanguageSelector({ variant = "icon", className }: Props) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = (i18n.resolvedLanguage || i18n.language || "pt").split("-")[0] as SupportedLanguage;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const change = (lng: SupportedLanguage) => {
    i18n.changeLanguage(lng);
    setOpen(false);
  };

  return (
    <div className={cn("relative", className)} ref={ref}>
      <Button
        variant="ghost"
        size={variant === "icon" ? "icon" : "sm"}
        onClick={() => setOpen((o) => !o)}
        aria-label="Language"
      >
        {variant === "icon" ? (
          <Globe className="h-5 w-5" />
        ) : (
          <span className="flex items-center gap-2">
            <span className="text-base leading-none">{FLAGS[current]}</span>
            <span className="text-sm">{NAMES[current]}</span>
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-md bg-popover shadow-lg ring-1 ring-black ring-opacity-5 z-50 py-1">
          {SUPPORTED_LANGUAGES.map((lng) => (
            <button
              key={lng}
              onClick={() => change(lng)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 text-sm text-foreground hover:bg-accent",
                current === lng && "font-semibold"
              )}
            >
              <span className="flex items-center gap-2">
                <span className="text-base leading-none">{FLAGS[lng]}</span>
                {NAMES[lng]}
              </span>
              {current === lng && <Check className="h-4 w-4 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
