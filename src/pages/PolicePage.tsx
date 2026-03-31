
import policebg from "../assets/police bg.png";
import radar from "../assets/radar.png";
import PageNavbar from '../shared/ui/atoms/PageNavbar'
import { HiLightningBolt } from "react-icons/hi"; // لـ Total Active Load
import { MdOutlineLightbulb } from "react-icons/md"; // لـ Active Street Lights
import { RiFlashlightFill } from "react-icons/ri"; // لـ TOTAL ENERGY
import { FaDollarSign } from "react-icons/fa"; // لـ TOTAL COST
import Card from '../shared/ui/molecules/Card'
import { useState } from 'react';


const policeLinks = [
  { name: 'Live Events', id: 'LiveEvents' },
  { name: 'Reports', id: 'Reports' },
  { name: 'weapon', id: 'weapon' },
  { name: 'behavior', id: 'behavior' }
];


const PolicePage = () => {
  return (
    // Main Page Wrapper with Gradient Background
    <div className="bg-[linear-gradient(180deg,#182B31_46%,#0D1218_65%)] min-h-screen text-white ">
      
      {/* Main Page Container */}
      <div className="max-w-[1440px] mx-auto w-full px-10 md:px-8 lg:px-18 pt-5">
        
        {/* Header Section with Background Image */}
        <div className="relative h-[280px] w-full ">
          
          {/* Background Image Layer */}
          <img
            src={policebg}
            alt="Police Background"
            className="absolute inset-0 -m-10 w-full h-full object-cover object-center scale-105"
          />

         
          
          {/* Header Content Layer */}
          <header className="relative z-10 flex justify-between items-end h-full p-8 mt-10  ">
            
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
        colorClass='text-[#E05A5A]'
      />

      {/* 2. Active Street Lights */}
      <Card 
        icon={<MdOutlineLightbulb size={22} />} 
        trend="94%" 
        value="08" 
        title="Officers On Duty" 
         colorClass='text-[#1A8A80]'
      />

      {/* 3. TOTAL ENERGY */}
      <Card 
        icon={<RiFlashlightFill size={22} />} 
        trend="-1.2%" 
        value="12" 
        title="Incidents Today" 
         colorClass='text-[#F4FEFE]'
      />

      {/* 4. TOTAL COST */}
      <Card 
        icon={<FaDollarSign size={20} />} 
        trend="+$140" 
        value="03" 
        title="Active Alerts" 
         colorClass='text-[#E09A3D]'
      />

        </div>

        {/* 3. Sections of the page */}
        <main className="space-y-20 pb-20">
          <section id="LiveEvents" className="h-[500px]">
          </section>
          
          <section id="Reports" className="h-[500px]">
            {/* Content for Live Map */}
          </section>
        </main>

        {/* --- PAGE CONTENT AREA --- */}
        <section className="mt-10 grid grid-cols-12 gap-6">
            {/* You can start adding your containers/cards here */}
        </section>

      </div>

</div>
  );
};

export default PolicePage;
