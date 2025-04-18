import { FrequencyData } from "./audio-context";
import { Brain, Heart, Coffee, Zap, MoonStar, Music, Sparkles, Focus, Shield, Flower, AlertCircle, Pill, Stethoscope } from "lucide-react";

export type Category = {
  id: string;
  name: string;
  description: string;
  icon: any;
}

export const categories: Category[] = [
  {
    id: "pain-relief",
    name: "Pain Relief",
    description: "Frequencies for various types of pain management",
    icon: Pill
  },
  {
    id: "healing",
    name: "Healing",
    description: "General healing and regeneration frequencies",
    icon: Heart
  },
  {
    id: "relaxation",
    name: "Relaxation",
    description: "Frequencies for stress relief and relaxation",
    icon: MoonStar
  },
  {
    id: "emotional",
    name: "Emotional",
    description: "Balance emotional states and mood",
    icon: Brain
  },
  {
    id: "immune",
    name: "Immune System",
    description: "Support immune system function",
    icon: Shield
  },
  {
    id: "detox",
    name: "Detoxification",
    description: "Support body's natural detox processes",
    icon: Zap
  },
  {
    id: "wellness",
    name: "General Wellness",
    description: "Overall health and wellbeing frequencies",
    icon: Stethoscope
  },
  {
    id: "research",
    name: "Research",
    description: "Experimental and research frequencies",
    icon: Focus
  }
];

export const frequencies: FrequencyData[] = [
  {
    id: "1",
    name: "General Healing",
    hz: 7.83,
    purpose: "Schumann Resonance",
    category: "healing",
    description: "Earth's natural frequency for overall healing and wellbeing",
    trending: true
  },
  {
    id: "2",
    name: "Pain Relief",
    hz: 3.0,
    purpose: "General Pain Management",
    category: "pain-relief",
    description: "General pain relief frequency",
  },
  {
    id: "3",
    name: "Deep Relaxation",
    hz: 396,
    purpose: "Liberating Guilt & Fear",
    category: "relaxation",
    description: "Ancient Solfeggio frequency for deep relaxation",
    trending: true
  },
  {
    id: "4",
    name: "Emotional Balance",
    hz: 528,
    purpose: "DNA Repair",
    category: "emotional",
    description: "Known as the 'Miracle' frequency for emotional healing",
    premium: true
  },
  {
    id: "5",
    name: "Immune Boost",
    hz: 5000,
    purpose: "Immune System Support",
    category: "immune",
    description: "Stimulate immune system function",
    premium: true
  },
  {
    id: "6",
    name: "Detox",
    hz: 10000,
    purpose: "Body Detoxification",
    category: "detox",
    description: "Support natural detoxification processes"
  },
  {
    id: "7",
    name: "Inflammation",
    hz: 3.6,
    purpose: "Reduce Inflammation",
    category: "healing",
    description: "Anti-inflammatory frequency",
    trending: true
  },
  {
    id: "8",
    name: "Delta Sleep",
    hz: 2.5,
    purpose: "Deep Sleep",
    category: "relaxation",
    description: "Promote deep, restorative sleep"
  },
  {
    id: "9",
    name: "Anxiety Relief",
    hz: 6.3,
    purpose: "Reduce Anxiety",
    category: "emotional",
    description: "Calming frequency for anxiety relief"
  },
  {
    id: "10",
    name: "Energy Boost",
    hz: 20,
    purpose: "Vitality",
    category: "wellness",
    description: "Increase energy and vitality",
    trending: true
  },
  {
    id: "11",
    name: "Mental Clarity",
    hz: 10.5,
    purpose: "Focus Enhancement",
    category: "wellness",
    description: "Improve mental clarity and focus"
  },
  {
    id: "12",
    name: "Spiritual",
    hz: 963,
    purpose: "Spiritual Connection",
    category: "research",
    description: "Higher consciousness frequency",
    premium: true
  },
  {
    id: "13",
    name: "Cell Regeneration",
    hz: 432,
    purpose: "Cellular Health",
    category: "healing",
    description: "Support cellular repair and regeneration"
  },
  {
    id: "14",
    name: "Circulation",
    hz: 45,
    purpose: "Blood Flow",
    category: "wellness",
    description: "Improve blood circulation"
  },
  {
    id: "15",
    name: "Joint Relief",
    hz: 147.0,
    purpose: "Joint Pain",
    category: "pain-relief",
    description: "Specific frequency for joint pain relief",
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
