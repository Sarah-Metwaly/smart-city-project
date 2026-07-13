
import StatCard from "./StatCard";
import type { LucideIcon } from "lucide-react";

interface Stat {
  title: string;
  value: string | number;
  icon: LucideIcon;
  badge?: string;
  colorClass: {
    text: string;
    bg: string;
  };
}

interface StatCardsProps {
  stats: Stat[];
}

const StatCards: React.FC<StatCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatCards;
