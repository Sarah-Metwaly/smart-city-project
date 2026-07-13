
const ForecastHourCard = ({ time, temp, icon, isActive }: any) => {
  return (
    <div className={`flex flex-col items-center gap-2 px-1 py-4 rounded-2xl min-w-10 transition-all duration-300
      ${isActive 
        ? 'bg-aman-dark shadow-[0_8px_16px_rgba(0,0,0,0.4)] border border-white/10 scale-105' 
        : 'bg-aman-gray/25'}`}>
      
      <span className={`text-sm font-medium uppercase tracking-wider ${isActive ? 'text-white' : 'text-aman-light'}`}>
        {time}
      </span>
      <div className="flex items-center justify-center w-8 h-8">
        <img src={icon} alt="weather" className="object-contain w-full h-full" />
      </div>

      <span className="text-sm font-bold text-white">
        {temp}°
      </span>
    </div>
  );
};
export default ForecastHourCard;