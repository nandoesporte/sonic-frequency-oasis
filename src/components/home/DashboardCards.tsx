import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Play, Heart, Crown, Lock, ChevronRight } from "lucide-react";
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
  const { hasAccess, isInTrialPeriod, trialDaysLeft } = usePremium();
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
      if (isInTrialPeriod) {
        toast.info("Período de Teste", { description: `Você tem ${trialDaysLeft} dias restantes` });
      }
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
