import { type AQStatus } from "./types/airQuality";

export const statusStyles: Record<AQStatus, {
  value: string; badge: string; iconWrap: string; cardBorder: string; bar: string;
}> = {
  danger: {
    value: "text-[#E63946]",
    badge: "bg-[#E63946]/10 text-[#E63946] border border-[#E63946]/25",
    iconWrap: "bg-[#E63946]/10 border border-[#E63946]/20",
    cardBorder: "border-[#E63946]/30",
    bar: "from-[#E63946]/40 to-[#E63946]",
  },
  warning: {
    value: "text-[#F4A623]",
    badge: "bg-[#F4A623]/10 text-[#F4A623] border border-[#F4A623]/25",
    iconWrap: "bg-[#F4A623]/10 border border-[#F4A623]/20",
    cardBorder: "border-[#F4A623]/30",
    bar: "from-[#F4A623]/40 to-[#F4A623]",
  },
  normal: {
    value: "text-[#2EC4A9]",
    badge: "bg-[#2EC4A9]/10 text-[#2EC4A9] border border-[#2EC4A9]/20",
    iconWrap: "bg-[#2EC4A9]/10 border border-[#2EC4A9]/20",
    cardBorder: "border-[#2EC4A9]/25",
    bar: "from-[#2EC4A9]/40 to-[#2EC4A9]",
  },
  stable: {
    value: "text-[#B4C3CC]",
    badge: "bg-[#58717D]/15 text-[#B4C3CC] border border-[#58717D]/30",
    iconWrap: "bg-[#58717D]/15 border border-[#58717D]/20",
    cardBorder: "border-[#58717D]/30",
    bar: "from-[#58717D]/40 to-[#B4C3CC]",
  },
};

export const statusLabel: Record<AQStatus, string> = {
  danger: "CRITICAL", warning: "WARNING", normal: "NORMAL", stable: "STABLE",
};

export const statusFill: Record<AQStatus, string> = {
  danger:  "bg-[#E63946]",
  warning: "bg-[#F4A623]",
  normal:  "bg-[#2EC4A9]",
  stable:  "bg-[#58717D]",
};

export const gasBarWidth: Record<AQStatus, string> = {
  danger:  "w-[88%]",
  warning: "w-[50%]",
  normal:  "w-[15%]",
  stable:  "w-[15%]",
};