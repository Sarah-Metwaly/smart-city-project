import CitySurveillanceMap from '../../../shared/ui/organisms/CitySurveillanceMap';
import CrimeStatus from '../components/ReportComponent/CrimeStatus';
import Crimetype from '../components/ReportComponent/Crimetype';
import IncidentChart from '../components/ReportComponent/IncidentChart';
import TimeResponseChart from '../components/ReportComponent/TimeResponseChart';
import WeeklyType from '../components/ReportComponent/WeeklyIncType';

const ReportsView = () => {
  return (
    <section className="flex flex-col w-full gap-4 px-2 mt-6 md:gap-6 md:mt-10 md:px-0">
      
      {/* first row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        <div className="shadow-sm rounded-xl">
          <IncidentChart />
        </div>
        <div className="shadow-sm rounded-xl">
          <TimeResponseChart />
        </div>
      </div>

      {/* second row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        <div className="shadow-sm rounded-xl">
          <Crimetype />
        </div>
        <div className="shadow-sm bg-aman-teal rounded-xl">
          <CitySurveillanceMap />
        </div>
      </div>

      {/* third row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-6">
        <div className="shadow-sm md:col-span-4 rounded-xl">
          <WeeklyType />
        </div>
        <div className="shadow-sm md:col-span-2 rounded-xl">
          <CrimeStatus />
        </div>
      </div>

    </section>
  );
};

export default ReportsView;