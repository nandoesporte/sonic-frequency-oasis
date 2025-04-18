
import { FrequencyData } from "./audio-context";
import { Brain, Heart, Coffee, Zap, MoonStar, Music, Sparkles, Focus, Microscope } from "lucide-react";

export type Category = {
  id: string;
  name: string;
  description: string;
  icon: any;  // Lucide icon component
}

export const categories: Category[] = [
  {
    id: "healing",
    name: "Healing",
    description: "Frequencies for physical healing and pain relief",
    icon: Heart
  },
  {
    id: "relaxation",
    name: "Relaxation",
    description: "Calm your mind and reduce stress",
    icon: MoonStar
  },
  {
    id: "focus",
    name: "Focus",
    description: "Enhance concentration and productivity",
    icon: Brain
  },
  {
    id: "energy",
    name: "Energy",
    description: "Boost your energy and vitality",
    icon: Zap
  },
  {
    id: "meditation",
    name: "Meditation",
    description: "Deepen your meditation practice",
    icon: Sparkles
  },
  {
    id: "sleep",
    name: "Sleep",
    description: "Improve sleep quality and relaxation",
    icon: MoonStar
  },
  {
    id: "creativity",
    name: "Creativity",
    description: "Enhance artistic expression and imagination",
    icon: Music
  },
  {
    id: "research",
    name: "Research",
    description: "Experimental frequencies based on research",
    icon: Microscope
  }
];

export const frequencies: FrequencyData[] = [
  {
    id: "1",
    name: "Delta Healing",
    hz: 1.5,
    purpose: "Pain Relief",
    category: "healing",
    description: "Deep healing for physical pain and inflammation with delta wave frequency",
    trending: true
  },
  {
    id: "2",
    name: "Theta Calmness",
    hz: 5.5,
    purpose: "Deep Relaxation",
    category: "relaxation",
    description: "Promote deep states of relaxation, meditation, and enhanced creativity"
  },
  {
    id: "3",
    name: "Alpha Focus",
    hz: 10.5,
    purpose: "Concentration",
    category: "focus",
    description: "Enhance mental clarity, focus, and reduce anxiety levels"
  },
  {
    id: "4",
    name: "Beta Energy",
    hz: 20,
    purpose: "Mental Energy",
    category: "energy",
    description: "Increase alertness, concentration, and cognitive function",
    trending: true
  },
  {
    id: "5",
    name: "Gamma Cognition",
    hz: 40,
    purpose: "Cognitive Enhancement",
    category: "focus",
    description: "Support high-level information processing and cognitive function",
    premium: true
  },
  {
    id: "6",
    name: "Theta Meditation",
    hz: 6,
    purpose: "Deep Meditation",
    category: "meditation",
    description: "Access deep meditative states and enhanced spirituality"
  },
  {
    id: "7",
    name: "Schumann Resonance",
    hz: 7.83,
    purpose: "Earth Harmony",
    category: "healing",
    description: "Align with Earth's natural electromagnetic frequency for improved wellbeing",
    trending: true
  },
  {
    id: "8",
    name: "Alpha Sleep",
    hz: 8,
    purpose: "Sleep Induction",
    category: "sleep",
    description: "Promote relaxation and prepare the mind for restful sleep"
  },
  {
    id: "9",
    name: "Creativity Boost",
    hz: 12.5,
    purpose: "Creative Enhancement",
    category: "creativity",
    description: "Stimulate creative thinking and artistic expression"
  },
  {
    id: "10",
    name: "Delta Deep Sleep",
    hz: 2,
    purpose: "Deep Sleep",
    category: "sleep",
    description: "Support deep, restorative sleep phases"
  },
  {
    id: "11",
    name: "Study Focus",
    hz: 14,
    purpose: "Learning",
    category: "focus",
    description: "Optimize brain function for learning and information retention"
  },
  {
    id: "12",
    name: "Gamma Insight",
    hz: 35,
    purpose: "Spiritual Insight",
    category: "meditation",
    description: "Access transcendent states of consciousness and spiritual awareness",
    premium: true
  },
  {
    id: "13",
    name: "Solfeggio 396 Hz",
    hz: 396,
    purpose: "Guilt Release",
    category: "healing",
    description: "Ancient frequency to liberate from guilt and fear"
  },
  {
    id: "14",
    name: "Solfeggio 417 Hz",
    hz: 417,
    purpose: "Change Facilitation",
    category: "healing",
    description: "Facilitate change and let go of old patterns"
  },
  {
    id: "15",
    name: "Solfeggio 528 Hz",
    hz: 528,
    purpose: "DNA Repair",
    category: "healing",
    description: "Known as the 'miracle tone' for healing and DNA repair",
    trending: true,
    premium: true
  },
  {
    id: "16",
    name: "Solfeggio 639 Hz",
    hz: 639,
    purpose: "Relationships",
    category: "healing",
    description: "Harmonize relationships and enhance communication"
  },
  {
    id: "17",
    name: "Solfeggio 741 Hz",
    hz: 741,
    purpose: "Problem Solving",
    category: "focus",
    description: "Awaken intuition and enhance problem-solving abilities"
  },
  {
    id: "18",
    name: "Solfeggio 852 Hz",
    hz: 852,
    purpose: "Spiritual Awareness",
    category: "meditation",
    description: "Return to spiritual order and higher consciousness",
    premium: true
  },
  {
    id: "19",
    name: "432 Hz Tuning",
    hz: 432,
    purpose: "Natural Harmony",
    category: "relaxation",
    description: "Alternative musical tuning aligned with natural vibrations",
    trending: true
  },
  {
    id: "20",
    name: "936 Hz Pineal",
    hz: 936,
    purpose: "Pineal Activation",
    category: "meditation",
    description: "Activates the pineal gland and awakens intuition",
    premium: true
  }
];

export function getFrequenciesByCategory(categoryId: string): FrequencyData[] {
  return frequencies.filter(freq => freq.category === categoryId);
}

export function getTrendingFrequencies(): FrequencyData[] {
  return frequencies.filter(freq => freq.trending);
}

export function getPremiumFrequencies(): FrequencyData[] {
  return frequencies.filter(freq => freq.premium);
}

export function getFrequencyById(id: string): FrequencyData | undefined {
  return frequencies.find(freq => freq.id === id);
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find(cat => cat.id === id);
}

export function getCategoryCount(categoryId: string): number {
  return frequencies.filter(freq => freq.category === categoryId).length;
}
