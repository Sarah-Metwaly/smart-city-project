
import Crimetype from "../components/Report/Crimetype";
import CitySurveillanceMap from "../../../shared/ui/organisms/CitySurveillanceMap";
import IncidentChart from "../components/Report/IncidentChart";
import TimeResponseChart from "../components/Report/TimeResponseChart";
import CrimeStatus from "../components/Report/CrimeStatus";
import WeeklyType from "../components/Report/WeeklyIncType";

const ReportsView = () => {
  return (
  <section className="grid grid-cols-6 gap-4 mt-10">
              <div className="col-span-3 p-5 shadow-sm bg-aman-teal rounded-xl"><IncidentChart /></div>
              <div className="col-span-3 row-span-1 p-5 shadow-sm bg-aman-teal rounded-xl"><TimeResponseChart /></div>
              <div className="col-span-3 row-span-1 p-5 shadow-sm bg-aman-teal rounded-xl"><Crimetype /></div>
              <div className="col-span-3 row-span-1 shadow-sm bg-aman-teal rounded-xl"><CitySurveillanceMap /></div>
              <div className="col-span-4 row-span-1 p-5 shadow-sm bg-aman-dark rounded-xl"><WeeklyType /></div>
              <div className="col-span-2 row-span-1 p-4 shadow-sm bg-aman-teal rounded-xl"><CrimeStatus /></div>
            </section>  )
}

export default ReportsView