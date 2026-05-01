
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  badge?: string;
  colorClass: {
    text: string; // اللون الخاص بالرقم والأيقونة
    bg: string;   // ممكن تستخدميه للـ Badge لو حابة
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, badge, colorClass }) => {
  return (
    // bg-[#1d2d31] هو اللون الغامق الموحد للكروت في الصورة
    <div className="relative flex flex-col h-32 p-4 border justimanfy-between rounded-xl bg-aman-teal border-aman-teal/50">
      
      {/* صف الأيقونة والـ Badge */}
      <div className="flex items-start justify-between">
        <div className={`p-1.5 rounded-md bg-black/20 ${colorClass.text}`}>
          <Icon size={18} strokeWidth={2} />
        </div>
        
        {/* الـ Badge (تنسيقها بياخد لون خفيف من لون الـ text الخاص بالكارد) */}
        {badge && (
          <span className={`text-[9px] font-bold tracking-wider opacity-70 ${colorClass.text}`}>
            {badge}
          </span>
        )}
      </div>

      {/* الرقم والعنوان */}
      <div className="flex flex-col">
        <div className={`text-4xl font-bold ${colorClass.text}`}>
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