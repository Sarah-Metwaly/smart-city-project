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
    <div className="relative p-3.5 transition-all border bg-aman-teal border-aman-teal/50 rounded-xl hover:border-aman-cyan/30 group overflow-hidden">
      {badge && (
        <span className={`absolute top-3 right-3 text-[7px] font-bold tracking-widest px-1.5 py-0.5 rounded uppercase bg-black/40 ${colorClass.text} border border-current opacity-70`}>
          {badge}
        </span>
      )}

      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 bg-white/5 border border-white/10 ${colorClass.text}`}>
        <Icon size={16} strokeWidth={1.5} />
      </div>
      
      <div className="space-y-0">
        <h3 className={`text-3xl font-bold tracking-tight leading-none ${colorClass.text}`}>
          {value}
        </h3>
        <p className="text-[11px] font-semibold tracking-wide text-slate-300 mt-1">
          {title}
        </p>
      </div>

      <div className={`absolute -bottom-6 -right-6 w-16 h-16 rounded-full blur-[35px] opacity-0 group-hover:opacity-15 transition-opacity ${colorClass.bg}`} />
    </div>
  );
};

export default StatCard;