import policebg from "../assets/police bg.png";
import radar from "../assets/radar.png";
import PageNavbar from "../shared/ui/atoms/PageNavbar";
import { HiLightningBolt } from "react-icons/hi";
import { MdOutlineLightbulb } from "react-icons/md";
import { RiFlashlightFill } from "react-icons/ri";
import { FaDollarSign } from "react-icons/fa";
import Card from "../shared/ui/molecules/Card";
import Crimetype from "../features/police-surveillance/components/Report/Crimetype";
import CitySurveillanceMap from "../features/police-surveillance/components/CitySurveillanceMap";
import IncidentChart from "../features/police-surveillance/components/Report/IncidentChart";
import TimeResponseChart from "../features/police-surveillance/components/Report/TimeResponseChart";
import CrimeStatus from "../features/police-surveillance/components/Report/CrimeStatus";
import WeeklyType from "../features/police-surveillance/components/Report/WeeklyIncType";

const policeLinks = [
  { name: "Live Events", id: "LiveEvents" },
  { name: "Reports", id: "Reports" },
  { name: "weapon", id: "weapon" },
  { name: "behavior", id: "behavior" },
];

const PolicePage = () => {
  return (
    // Main Page Wrapper with Gradient Background
    <div className="bg-[linear-gradient(180deg,#182B31_46%,#0D1218_65%)] min-h-screen">
      {/* Main Page Container */}
      <div className=" mx-auto w-full px-10 md:px-15 lg:px-15 ">
        {/* Header Section with Background Image */}
        <div className="relative h-[280px] w-full ">
          {/* Background Image Layer */}
          <img
            src={policebg}
            alt="Police Background"
            className="absolute inset-0 -m-10 w-full h-full object-cover object-center scale-105"
          />

          {/* Header Content Layer */}
          <header className="relative z-10 flex justify-between items-end h-full p-8   ">
            {/* Title & Status Group */}
            <div className="flex flex-col gap-5">
              {/* Live Status Badge */}
              <div className="flex items-center gap-2 bg-[#00C8A01F] border border-[#00C8A033] px-3 py-1 rounded-[20px] backdrop-blur-md w-fit">
                {/* Status Indicator Dot */}
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C8A0] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00C8A0]"></span>
                </div>
                {/* Badge Label  */}
                <span className="text-[#00C8A0] text-[10px] font-bold uppercase tracking-[2px]">
                  Live Monitoring Active
                </span>
              </div>

              {/* Page Main Title */}
              <h1 className="font-inter font-bold text-[42px] leading-tight tracking-tight">
                Police Command Center
              </h1>
              {/* 2. THE NAVBAR COMPONENT */}
              <PageNavbar links={policeLinks} />
            </div>

            {/* Spinning Radar Image */}
            <div className=" mr-[-20px] flex flex-col ">
              <img
                src={radar}
                alt="Radar Scanner"
                className="w-40 h-40  animate-spin opacity-80 [animation-duration:12s] [animation-timing-function:linear]"
              />
            </div>
          </header>
        </div>
        {/*********************************Cards section********************************** */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8 p-2 shrink-0">
          {/* 1. Total Active Load */}
          <Card
            icon={<HiLightningBolt size={22} />}
            trend="+2.5%"
            value="24"
            title="Active Cameras"
            colorClass="text-[#E05A5A]"
          />

          {/* 2. Active Street Lights */}
          <Card
            icon={<MdOutlineLightbulb size={22} />}
            trend="94%"
            value="08"
            title="Officers On Duty"
            colorClass="text-[#1A8A80]"
          />

          {/* 3. TOTAL ENERGY */}
          <Card
            icon={<RiFlashlightFill size={22} />}
            trend="-1.2%"
            value="12"
            title="Incidents Today"
            colorClass="text-[#F4FEFE]"
          />

          {/* 4. TOTAL COST */}
          <Card
            icon={<FaDollarSign size={20} />}
            trend="+$140"
            value="03"
            title="Active Alerts"
            colorClass="text-[#E09A3D]"
          />
        </div>

        {/* 3. Sections of the page */}
        <main className="space-y-20 px-30">
          <section id="LiveEvents" className=""></section>

          {/* --- PAGE CONTENT AREA --- */}
          <section id="Reports" className="grid grid-cols-6 gap-4 ">
            {/***********Incident chart*********** */}
            <div className="col-span-3  bg-aman-teal rounded-xl shadow-sm">
              <div className="p-5">
                <p className="text-[14px] font-montserrat text-aman-white">
                  Weekly Incident Trend
                </p>
                <p className="text-[14px] tracking-[1px] text-[#58717D] font-inter">
                  INCIDENTS PER DAY — CURRENT WEEK
                </p>
              </div>
              <IncidentChart />
            </div>

            {/********Time response********* */}
            <div className="col-span-3 row-span-1 bg-aman-teal rounded-xl shadow-sm p-5">
              <p className="text-[14px] font-montserrat text-aman-white ">
                Avg. Response Time
              </p>
              <p className="text-[10px] tracking-[1px] text-[#58717D]  pb-1.5 font-inter">
                Time per Day
              </p>
              <TimeResponseChart />
            </div>
            {/* ********Crimetype******* */}
            <div className="col-span-3 row-span-1 bg-aman-teal rounded-xl shadow-sm p-5">
              <p className="text-[14px] font-montserrat text-aman-white ">
                Crime Type Distribution
              </p>
              <p className="text-[10px] tracking-[1px] text-[#58717D]  pb-1.5 font-inter">
                BREAKDOWN BY CATEGORY — MTD
              </p>
              <Crimetype />
            </div>
            {/*********heatmap********* */}
            <div className="col-span-3 row-span-1 bg-aman-teal rounded-xl shadow-sm">
              <CitySurveillanceMap />
            </div>
            {/********crime type***** */}
            <div className="col-span-4 row-span-1 bg-aman-dark rounded-xl shadow-sm p-5">
              <p className="text-[14px] font-montserrat text-aman-white ">
                Weekly Inceident Type
              </p>
              <p className="text-[10px] tracking-[1px] text-[#58717D]  pb-1.5 font-inter">
                BREAKDOWN BY Type
              </p>
              <WeeklyType />
            </div>
            {/*********crime status********** */}
            <div className="col-span-2 row-span-1 bg-aman-teal rounded-xl shadow-sm p-4">
              <p className="text-[14px] font-montserrat text-aman-white ">
                Crime State Level
              </p>
              <p className="text-[10px] tracking-[1px] text-[#58717D]  pb-1.5 font-inter">
                BREAKDOWN BY State
              </p>
              <CrimeStatus />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default PolicePage;
