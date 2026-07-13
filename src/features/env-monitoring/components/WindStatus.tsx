import WindStatusIcon from "../../../shared/icons/WindStatusIcon";

interface WindProps {
  speed: number;
}
const WindStatus = ({ speed }: WindProps) => {
return(
    <div className="relative flex flex-col p-4 bg-aman-dark rounded-2xl min-h-40">
      <p className="text-xs font-medium text-aman-light">
        Wind Status
      </p>
      <div className="absolute w-full px-4 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 opacity-30">
        <WindStatusIcon />
      </div>
      <div className="relative z-10 flex items-end justify-between mt-auto">
        <span className="text-xl font-bold leading-none text-aman-light">
          <span className="text-aman-white">{speed.toFixed(2)}</span>{" "}
          <span className="text-aman-blue text-[11px] font-normal ">km/h</span>
        </span>
        <span className="text-aman-blue text-[11px]">6:20 AM</span>
      </div>
    </div>
  );
};

export default WindStatus;

