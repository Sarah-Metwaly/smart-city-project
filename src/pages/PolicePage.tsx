import policebg from "../assets/police bg.png";
import radar from "../assets/radar.png";
import PageNavbar from "../shared/ui/atoms/PageNavbar";
import { useState } from "react";
import LiveEventsView from "../features/police-surveillance/views/LiveEventsView";
import WeaponView from "../features/police-surveillance/views/WeaponView";
import ReportsView from "../features/police-surveillance/views/ReportsView";
import Behavior from "../features/police-surveillance/views/Behavior";


const navLinks = [
  { name: 'Live Events', id: 'LiveEvents', path: '/live' },
  { name: 'Reports', id: 'Reports', path: '/reports' },
  { name: 'Weapon', id: 'weapon', path: '/weapon-detection' },
  { name: 'Behavior', id: 'behavior', path: '/behavior-analysis' }
];

const PolicePage = () => {
  const [activeView, setActiveView] = useState('LiveEvents');

  return (
    <div className="min-h-screen bg-aman-black">
      <div className="w-full px-10 mx-auto md:px-15 lg:px-15">
        <div className="relative w-full h-70 ">
          <img
            src={policebg}
            alt="Police Background"
            className="absolute inset-0 object-cover object-center w-full h-full -m-10 scale-105"
          />
          <header className="relative z-10 flex items-end justify-between h-full p-8 ">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2 bg-[#00C8A01F] border border-[#00C8A033] px-3 py-1 rounded-[20px] backdrop-blur-md w-fit">
                <div className="relative flex w-2 h-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C8A0] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00C8A0]"></span>
                </div>
                <span className="text-[#00C8A0] text-[10px] font-bold uppercase tracking-[2px]">
                  Live Monitoring Active
                </span>
              </div>
              <h1 className="font-inter font-bold text-[42px] leading-tight tracking-tight">
                Police Command Center
              </h1>
              <PageNavbar 
                activeView={activeView} 
                onViewChange={setActiveView} 
                links={navLinks} 
              />
            </div>
            <div className="flex flex-col -mr-5 ">
              <img
                src={radar}
                alt="Radar Scanner"
                className="w-40 h-40 animate-spin opacity-80 [animation-duration:12s] [animation-timing-function:linear]"
              />
            </div>
          </header>
        </div>

        <main className="p-6">
          {activeView === 'LiveEvents' && <LiveEventsView />}
          {activeView === 'weapon' && <WeaponView />}
          {activeView === 'Reports' && <ReportsView />}
          {activeView === 'behavior' && <Behavior />}

        </main>
      </div>
    </div>
  );
};

export default PolicePage;
