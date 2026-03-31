import VisibilityImg from './../../../assets/images/weather/Visibility Icon 1.png';
import { EyeIcon} from '../../../shared/icons/EyeIcon';
interface VisibilityProps {
  value: number;
}

const VisibilityStatus = ({ value }: VisibilityProps) => {
 return (
    <div className="flex flex-col p-4 bg-aman-dark rounded-2xl min-h-40">
      <p className="mb-1 text-xs font-medium text-aman-light">Visibility</p>
      <div className="relative flex items-center justify-center flex-1">
            <img
              src={VisibilityImg}
              alt="Visibility"
              className="justify-center object-contain w-16 h-16 opacity-85"
            />
      </div>
           <div className="flex items-center justify-between mt-auto">
        <p className="text-lg font-bold text-aman-white">
          {value.toFixed(0)} <span className="text-aman-blue text-[16px] font-normal">km</span>
        </p>
        <p className="text-aman-gray font-medium text-[14px] flex items-center gap-1">
          <EyeIcon size={14} className="blue-icon" /> 
          {value < 5 ? "Haze is affecting visibility" : "Clear visibility"}
        </p>
      </div>

    </div>
  );
}

export default VisibilityStatus

