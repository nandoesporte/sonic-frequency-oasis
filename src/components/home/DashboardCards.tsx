import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Play, Heart, Crown, Lock, ChevronRight, Sparkles, Clock } from "lucide-react";
import { useAudio } from "@/lib/audio-context";
import { usePremium } from "@/contexts/PremiumContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import { getCategoryCount, FrequencyData } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

/**
 * Dark, glass-styled category card aligned with the landing page aesthetic.
 * Used inside the logged-in dashboard.
 */
interface DashboardCategoryCardProps {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  index?: number;
}

export function DashboardCategoryCard({ id, name, description, icon, index = 0 }: DashboardCategoryCardProps) {
  const [count, setCount] = useState<number | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    let mounted = true;
    getCategoryCount(id)
      .then((c) => mounted && setCount(c))
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleClick = () => {
    window.scrollTo(0, 0);
    navigate(`/categories/${id}`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      data-index={index}
      className="sp-glass group p-6 text-left hover:bg-brand-secondary hover:border-brand-border-strong hover:-translate-y-0.5 transition-[background-color,border-color,transform] duration-100 w-full"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-brand-secondary border border-brand-border text-brand-primary">
          {icon}
        </div>
        <ChevronRight className="h-4 w-4 text-brand-muted group-hover:text-brand-text group-hover:translate-x-1 transition-all duration-100" />
      </div>

      <h3 className="text-lg font-semibold text-brand-text mb-2 tracking-tight">{name}</h3>
      <p className="text-sm text-brand-muted leading-relaxed line-clamp-2 mb-4">{description}</p>

      <div className="flex items-center justify-between pt-4 border-t border-brand-border">
        <span className="text-xs uppercase tracking-[0.12em] text-brand-muted">
          {count !== null ? `${count} ${t("dashboard.card.freq")}` : "—"}
        </span>
        <span className="text-xs uppercase tracking-[0.12em] text-brand-text font-semibold">
          {t("dashboard.card.explore")}
        </span>
      </div>
    </button>
  );
}

/**
 * Dark, glass-styled frequency card (compact). Mirrors landing aesthetic.
 */
interface DashboardFrequencyCardProps {
  frequency: FrequencyData;
  onBeforePlay?: () => boolean;
}

export function DashboardFrequencyCard({ frequency, onBeforePlay }: DashboardFrequencyCardProps) {
  const { play, isPlaying, currentFrequency, addToFavorites, favorites } = useAudio();
  const { hasAccess } = usePremium();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!frequency) return null;

  const isCurrentlyPlaying = isPlaying && currentFrequency?.id === frequency.id;
  const isFavorite = favorites.some((f) => f.id === frequency.id);
  const locked = frequency.premium && !hasAccess;

  const handlePlay = () => {
    if (onBeforePlay && onBeforePlay()) return;
    if (!user && !loading) {
      toast.info(t("toasts.loginToListen"), { description: t("toasts.loginToListenDesc") });
      navigate("/auth");
      return;
    }
    if (locked) {
      toast.info(t("toasts.premiumContent"), { description: t("toasts.premiumContentDesc") });
      navigate("/premium#planos");
      return;
    }
    play(frequency);
  };

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user && !loading) {
      toast.info(t("toasts.loginToFavorite"));
      navigate("/auth");
      return;
    }
    addToFavorites(frequency);
  };

  return (
    <div
      className={cn(
        "sp-glass p-4 transition-colors duration-100 hover:bg-brand-secondary flex items-center gap-4",
        isCurrentlyPlaying && "border-brand-primary"
      )}
    >
      <button
        type="button"
        onClick={handlePlay}
        className={cn(
          "relative w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-100",
          isCurrentlyPlaying
            ? "bg-brand-primary text-brand-on-primary"
            : "bg-transparent text-brand-text border border-brand-border-strong hover:bg-brand-surface"
        )}
        aria-label={locked ? "Conteúdo premium" : "Tocar frequência"}
      >
        {locked ? <Lock className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
      </button>

      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <h3 className="font-semibold text-base text-brand-text truncate tracking-tight">{frequency.name}</h3>
          {frequency.premium && <Crown className="w-4 h-4 text-brand-accent flex-shrink-0" />}
        </div>
        <p className="text-xs text-brand-muted truncate">
          <span className="text-brand-text font-semibold">{frequency.hz} Hz</span>
          <span className="mx-2 text-brand-border-strong">•</span>
          {frequency.purpose}
        </p>
      </div>

      <button
        type="button"
        onClick={handleFav}
        className={cn(
          "w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-100",
          isFavorite ? "text-brand-primary" : "text-brand-muted hover:text-brand-text"
        )}
        aria-label="Favoritar"
      >
        <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
      </button>
    </div>
  );
}

/**
 * Dashboard quick-action tile.
 */
interface DashboardQuickActionProps {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  /** @deprecated mantido por compatibilidade; o visual usa os tokens da paleta */
  gradient?: string;
}

export function DashboardQuickAction({ to, icon, title, description }: DashboardQuickActionProps) {
  return (
    <Link to={to} className="sp-glass group p-6 text-left hover:bg-brand-secondary hover:border-brand-border-strong hover:-translate-y-0.5 transition-[background-color,border-color,transform] duration-100">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-brand-secondary border border-brand-border text-brand-primary">
          {icon}
        </div>
        <ChevronRight className="h-4 w-4 text-brand-muted group-hover:text-brand-text group-hover:translate-x-1 transition-all duration-100" />
      </div>
      <h3 className="font-semibold text-brand-text mb-2 tracking-tight">{title}</h3>
      <p className="text-sm text-brand-muted leading-relaxed">{description}</p>
    </Link>
  );
}

/**
 * Large featured frequency card aligned with the landing aesthetic.
 * Plays the pre-recorded MP3 (audioUrl) when available and respects premium gating.
 */
interface DashboardFeaturedCardProps {
  frequency: FrequencyData;
  durationLabel?: string;
}

export function DashboardFeaturedCard({ frequency, durationLabel = "20 min" }: DashboardFeaturedCardProps) {
  const { play, isPlaying, currentFrequency } = useAudio();
  const { hasAccess } = usePremium();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const isCurrent = isPlaying && currentFrequency?.id === frequency.id;
  const locked = frequency.premium && !hasAccess;

  const handlePlay = () => {
    if (!user && !loading) {
      toast.info(t("toasts.loginToListen"), { description: t("toasts.featuredLoginDesc") });
      navigate("/auth");
      return;
    }
    if (locked) {
      toast.info(t("toasts.premiumContent"), { description: t("toasts.premiumFeaturedDesc") });
      navigate("/premium#planos");
      return;
    }
    play(frequency);
  };

  return (
    <div
      className={cn(
        "sp-glass relative overflow-hidden p-6 sm:p-8 text-left transition-colors duration-100",
        isCurrent && "border-brand-primary"
      )}
    >
      {/* Halo de luz (claro-escuro) */}
      <div className="sp-halo w-80 h-80 -top-32 -right-24" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-brand-secondary border border-brand-border text-xs uppercase tracking-[0.12em] text-brand-text font-semibold">
              <Sparkles className="h-3 w-3 text-brand-accent" />
              {t("dashboard.featured.badge")}
            </span>
            {frequency.premium && (
              <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-brand-accent text-xs uppercase tracking-[0.12em] text-brand-on-primary font-semibold">
                <Crown className="h-3 w-3" />
                {t("dashboard.featured.premium")}
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full border border-brand-border text-xs uppercase tracking-[0.12em] text-brand-muted">
              <Clock className="h-3 w-3" />
              {durationLabel}
            </span>
          </div>

          <h3 className="sp-font-serif text-3xl sm:text-4xl font-bold tracking-tight text-brand-text mb-2">
            {frequency.name}
          </h3>
          <p className="text-base text-brand-muted leading-relaxed max-w-xl mb-4 line-clamp-3">
            {frequency.description}
          </p>

          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-brand-muted">
            <span className="text-brand-text font-semibold">{frequency.hz} Hz</span>
            <span className="text-brand-border-strong">•</span>
            <span>{frequency.purpose}</span>
          </div>
        </div>

        <div className="flex-shrink-0 flex sm:flex-col items-center sm:items-end gap-4">
          <button
            type="button"
            onClick={handlePlay}
            className="sp-btn sp-btn-primary min-w-[192px]"
            aria-label={locked ? "Conteúdo premium" : isCurrent ? "Tocando agora" : "Ouvir agora"}
          >
            {locked ? (
              <>
                <Lock className="h-4 w-4" />
                {t("dashboard.featured.unlock")}
              </>
            ) : (
              <>
                <Play className="h-4 w-4 ml-0.5" />
                {isCurrent ? t("dashboard.featured.playing") : t("dashboard.featured.listenNow")}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
