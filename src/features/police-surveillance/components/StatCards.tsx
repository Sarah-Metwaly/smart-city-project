import { Camera, Shield, FileText, AlertTriangle } from 'lucide-react';
import StatCard from './StatCard';

const statData = [
  { 
    title: "Active Cameras", 
    value: "24", 
    icon: Camera, 
    badge: "LIVE", 
    colorClass: { bg: 'bg-aman-red', text: 'text-[#ff4d4d]' } 
  },
  { 
    title: "Officers On Duty", 
    value: "08", 
    icon: Shield, 
    badge: "+2", 
    colorClass: { bg: 'bg-aman-green', text: 'text-[#4caf8a]' } 
  },
  { 
    title: "Incidents Today", 
    value: "12", 
    icon: FileText, 
    badge: "TODAY", 
    colorClass: { bg: 'bg-aman-cyan', text: 'text-[#7ecfcf]' } 
  },
  { 
    title: "Active Alerts", 
    value: "03", 
    icon: AlertTriangle, 
    badge: "URGENT", 
    colorClass: { bg: 'bg-aman-orange', text: 'text-[#f5a623]' } 
  },
];

const StatCards = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statData.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatCards;