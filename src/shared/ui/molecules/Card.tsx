
// Sub-component:DRY dont repeat yourself
interface CardProps {
  icon: React.ReactNode;
  trend:React.ReactNode;
  value: string | number | boolean;
  title: string;
  colorClass: string;
}
const Card = ({ icon, trend, value, title, colorClass }: CardProps) => (
  <div className="bg-aman-teal rounded-[14px] gap-0.5 hover:bg-aman-blue/50 transition-all py-2 px-5 flex flex-col justify-between overflow-hidden">
    
    {/**icon and trend */}
    <div className="flex justify-between items-start">
      <div className="opacity-80 text-aman-white bg-aman-blue rounded-[10px] p-2 flex items-center justify-center">
        {icon}
      </div>
      <div className=" rounded-[10px] px-2 py-1 text-[11px] font-bold">
        {trend}
      </div>
    </div>

  {/**value */} 
    <div className="flex flex-col">
      <h3 className={`${colorClass} text-[20px] leading-8.5 font-bold font-montserrat tracking-wider mb-1 `}>
        {value}
      </h3>
      <p className="text-aman-white text-[15px] font-inter">
        {title}
      </p>
    </div>

  </div>
);

export default Card;
