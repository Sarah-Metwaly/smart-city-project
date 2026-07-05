import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  badge?: string;
  colorClass: {
    text: string;
    bg: string;   
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, badge, colorClass }) => {
  return (
    <div className="relative flex flex-col h-32 p-4 border justimanfy-between rounded-xl bg-aman-teal border-aman-teal/50">
      
      <div className="flex items-start justify-between">
        <div className={`p-1.5 rounded-md bg-black/20 ${colorClass.text}`}>
          <Icon size={18} strokeWidth={2} />
        </div>
        
        {badge && (
          <span className={`text-[10px] font-bold tracking-wider opacity-70 ${colorClass.text}`}>
            {badge}
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <div className={`text-2xl font-bold ${colorClass.text}`}>
          {value}
        </div>
        <h4 className="text-sm font-semibold text-white/90 mt-0.5">
          {title}
        </h4>
      </div>
    </div>
  );
};

export default StatCard;