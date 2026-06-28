import CitySurveillanceMap from '../../../shared/ui/organisms/CitySurveillanceMap';
import CrimeStatus from '../components/ReportComponent/CrimeStatus';
import Crimetype from '../components/ReportComponent/Crimetype';
import IncidentChart from '../components/ReportComponent/IncidentChart';
import TimeResponseChart from '../components/ReportComponent/TimeResponseChart';
import WeeklyType from '../components/ReportComponent/WeeklyIncType';

const ReportsView = () => {
  return (
    <section className="flex flex-col w-full gap-6 mt-10">
      {/* first row */}
      <div className="grid items-stretch w-full grid-cols-6 gap-6">
        <div className="flex flex-col col-span-3 shadow-sm rounded-xl">
          <IncidentChart />
        </div>
        <div className="flex flex-col col-span-3 shadow-sm rounded-xl">
          <TimeResponseChart />
        </div>
      </div>

      {/* second row */}
      <div className="grid items-stretch w-full grid-cols-6 gap-6">
        <div className="flex flex-col h-full col-span-3 shadow-sm rounded-xl">
          <Crimetype />
        </div>
        <div className="flex flex-col h-full col-span-3 shadow-sm bg-aman-teal rounded-xl">
          <CitySurveillanceMap />
        </div>
      </div>

      {/* third row*/}
      <div className="grid items-stretch w-full grid-cols-6 gap-6">
        <div className="flex flex-col h-full col-span-4 shadow-sm rounded-xl">
          <WeeklyType />
        </div>
        <div className="flex flex-col h-full col-span-2 shadow-sm rounded-xl">
          <CrimeStatus />
        </div>
      </div>
    </section>
  );
};

export default ReportsView;
