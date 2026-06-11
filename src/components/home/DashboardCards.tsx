import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Play, Heart, Crown, Lock, ChevronRight, Sparkles, Clock } from "lucide-react";
import { useAudio } from "@/lib/audio-context";
import { usePremium } from "@/contexts/PremiumContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import { getCategoryCount, FrequencyData } from "@/lib/data";
import { cn } from "@/lib/utils";

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

  // Rotate gradients across cards for visual rhythm
  const gradients = [
    "linear-gradient(135deg, #8B5CF6, #A78BFA)",
    "linear-gradient(135deg, #3B82F6, #818CF8)",
    "linear-gradient(135deg, #A78BFA, #60A5FA)",
    "linear-gradient(135deg, #818CF8, #8B5CF6)",
  ];
  const grad = gradients[index % gradients.length];

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
      className="sp-glass group p-6 text-left hover:bg-white/[0.07] hover:-translate-y-0.5 transition-all duration-300 w-full"
    >
      <div className="flex items-start justify-between mb-5">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
          style={{ background: grad, boxShadow: "0 8px 24px -8px rgba(139,92,246,0.4)" }}
        >
          {icon}
        </div>
        <ChevronRight className="h-4 w-4 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
      </div>

      <h3 className="text-lg font-semibold text-white mb-1.5 tracking-tight">{name}</h3>
      <p className="text-xs text-white/50 leading-relaxed line-clamp-2 mb-4">{description}</p>

      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">
          {count !== null ? `${count} freq.` : "—"}
        </span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#A78BFA] font-medium">
          Explorar
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

  if (!frequency) return null;

  const isCurrentlyPlaying = isPlaying && currentFrequency?.id === frequency.id;
  const isFavorite = favorites.some((f) => f.id === frequency.id);
  const locked = frequency.premium && !hasAccess;

  const handlePlay = () => {
    if (onBeforePlay && onBeforePlay()) return;
    if (!user && !loading) {
      toast.info("Faça login para ouvir", { description: "É necessário estar logado para ouvir as frequências" });
      navigate("/auth");
      return;
    }
    if (locked) {
      toast.info("Conteúdo Premium", { description: "Assine um plano para desbloquear" });
      navigate("/premium#planos");
      return;
    }
    play(frequency);
  };

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user && !loading) {
      toast.info("Faça login para favoritar");
      navigate("/auth");
      return;
    }
    addToFavorites(frequency);
  };

  return (
    <div
      className={cn(
        "sp-glass p-4 transition-all duration-300 hover:bg-white/[0.07] flex items-center gap-3",
        isCurrentlyPlaying && "ring-1 ring-[#A78BFA]/60"
      )}
    >
      <button
        type="button"
        onClick={handlePlay}
        className={cn(
          "relative w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all hover:scale-105",
          isCurrentlyPlaying
            ? "text-white shadow-lg"
            : "bg-white/5 text-white border border-white/10 hover:border-white/20"
        )}
        style={
          isCurrentlyPlaying
            ? { background: "linear-gradient(135deg, #8B5CF6, #3B82F6)", boxShadow: "0 0 20px rgba(139,92,246,0.5)" }
            : undefined
        }
        aria-label={locked ? "Conteúdo premium" : "Tocar frequência"}
      >
        {locked ? <Lock className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
      </button>

      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <h3 className="font-semibold text-sm text-white truncate tracking-tight">{frequency.name}</h3>
          {frequency.premium && <Crown className="w-3 h-3 text-[#A78BFA] flex-shrink-0" />}
        </div>
        <p className="text-[11px] text-white/45 truncate">
          <span className="text-[#A78BFA] font-medium">{frequency.hz} Hz</span>
          <span className="mx-1.5 text-white/20">•</span>
          {frequency.purpose}
        </p>
      </div>

      <button
        type="button"
        onClick={handleFav}
        className={cn(
          "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
          isFavorite ? "text-rose-400" : "text-white/40 hover:text-white"
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
  gradient: string;
}

export function DashboardQuickAction({ to, icon, title, description, gradient }: DashboardQuickActionProps) {
  return (
    <Link to={to} className="sp-glass group p-6 hover:bg-white/[0.07] hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-lg"
          style={{ background: gradient, boxShadow: "0 8px 24px -8px rgba(139,92,246,0.4)" }}
        >
          {icon}
        </div>
        <ChevronRight className="h-4 w-4 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
      </div>
      <h3 className="font-semibold text-white mb-1 tracking-tight">{title}</h3>
      <p className="text-xs text-white/50 leading-relaxed">{description}</p>
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

  const isCurrent = isPlaying && currentFrequency?.id === frequency.id;
  const locked = frequency.premium && !hasAccess;

  const handlePlay = () => {
    if (!user && !loading) {
      toast.info("Faça login para ouvir", { description: "É necessário estar logado para acessar o destaque" });
      navigate("/auth");
      return;
    }
    if (locked) {
      toast.info("Conteúdo Premium", { description: "Assine um plano para desbloquear esta sessão" });
      navigate("/premium#planos");
      return;
    }
    play(frequency);
  };

  return (
    <div
      className={cn(
        "sp-glass relative overflow-hidden p-6 sm:p-8 transition-all duration-300",
        isCurrent && "ring-1 ring-[#A78BFA]/60"
      )}
    >
      {/* Ambient gradient */}
      <div
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.28) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] uppercase tracking-[0.22em] text-white/80">
              <Sparkles className="h-3 w-3 text-[#A78BFA]" />
              Destaque
            </span>
            {frequency.premium && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] text-[10px] uppercase tracking-[0.2em] text-white font-medium">
                <Crown className="h-3 w-3" />
                Premium
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-[0.2em] text-white/70">
              <Clock className="h-3 w-3" />
              {durationLabel}
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2 sp-glow-text">
            {frequency.name}
          </h3>
          <p className="text-sm text-white/60 leading-relaxed max-w-xl mb-4 line-clamp-3">
            {frequency.description}
          </p>

          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-white/50">
            <span className="text-[#A78BFA] font-medium">{frequency.hz} Hz</span>
            <span className="text-white/20">•</span>
            <span>{frequency.purpose}</span>
          </div>
        </div>

        <div className="flex-shrink-0 flex sm:flex-col items-center sm:items-end gap-3">
          <button
            type="button"
            onClick={handlePlay}
            className={cn(
              "group relative flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-medium text-white text-sm tracking-wide transition-all hover:scale-[1.03] active:scale-[0.98] shadow-lg",
              "min-w-[180px]"
            )}
            style={{
              background: locked
                ? "linear-gradient(135deg, rgba(139,92,246,0.6), rgba(59,130,246,0.6))"
                : "linear-gradient(135deg, #8B5CF6, #3B82F6)",
              boxShadow: "0 12px 32px -10px rgba(139,92,246,0.55)",
            }}
            aria-label={locked ? "Conteúdo premium" : isCurrent ? "Tocando agora" : "Ouvir agora"}
          >
            {locked ? (
              <>
                <Lock className="h-4 w-4" />
                Desbloquear
              </>
            ) : (
              <>
                <Play className="h-4 w-4 ml-0.5" />
                {isCurrent ? "Tocando" : "Ouvir agora"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
