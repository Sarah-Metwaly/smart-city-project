import CityModel from '../components/CityModel/CityModel';
import { ActiveIncidentsPanel } from '../features/dashboard/components/ActiveIncidentsPanel';
import { DangerZonesPanel } from '../features/dashboard/components/DangerZonesPanel';
import { EnergyMonitoringPanel } from '../features/dashboard/components/EnergyMonitoringPanel';
import { EnvironmentalPanel } from '../features/dashboard/components/EnvironmentalPanel';
import SmartSensorsPanel from '../features/dashboard/components/SmartSensorsPanel';
import { WeeklyIncidentTrendPanel } from '../features/dashboard/components/Weeklyincidenttrendpanel';


 export function HomePage() {
  return (
   
    <div className="h-screen w-screen overflow-hidden bg-[#0a121e] text-slate-200 p-4 box-border">
      <div
        className="
          h-full grid gap-4
          grid-cols-1
          lg:grid-cols-[320px_minmax(0,1fr)_320px]
          lg:grid-rows-1
        "
      >
        {/* ---------------- LEFT COLUMN ---------------- */}
        
        <div className="flex flex-col gap-4 h-full min-h-0 order-2 lg:order-1">
          <div className="flex-1 min-h-0"><ActiveIncidentsPanel /></div>
           <div className="flex-1 min-h-0"><WeeklyIncidentTrendPanel/></div>
          <div className="flex-1 min-h-0"><DangerZonesPanel /></div> 
        </div>

        {/* ---------------- CENTER: CITY MODEL / LIVE FEED ---------------- */}
        <div className="h-full min-h-0 order-1 lg:order-2">
          <CityModelPanel />
        </div>

        {/* ---------------- RIGHT COLUMN ---------------- */}
        <div className="flex flex-col gap-4 h-full min-h-0 order-3">
          <div className="flex-1 min-h-0"><SmartSensorsPanel /></div>
          <div className="flex-1 min-h-0"><EnergyMonitoringPanel /></div>
          <div className="flex-1 min-h-0"><EnvironmentalPanel /></div>
        </div>
      </div>
    </div>
  );
}

/**
 * CityModelPanel
 * ---------------------------------------------------------------------------
 * Center hero panel. Built inline in HomePage (rather than its own file)
 * since it's the page's single centerpiece, not a repeatable card pattern
 * like the six side widgets. Houses the live-feed chrome (title, REC badge,
 * radar backdrop) around the actual <ThreeCityScene /> canvas, which we'll
 * wire up in a later step once the six side panels are done.
 * ---------------------------------------------------------------------------
 */
function CityModelPanel() {
  return (
    <div
      className="
        relative overflow-hidden rounded-2xl h-full
        border border-cyan-900/40
        bg-[radial-gradient(ellipse_at_center,_#0f2436_0%,_#0a1420_70%)]
        flex flex-col
      "
    >
      {/* Top chrome: live feed label + REC indicator */}
      <div className="flex items-center justify-between px-5 pt-4 text-[11px] tracking-[0.2em] text-cyan-300/70">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          LIVE FEED · CAM 01
        </span>
        <span className="flex items-center gap-1.5 text-red-400">
          REC <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        </span>
      </div>

      {/* Title block */}
      <div className="text-center pt-2 pb-4">
        <p className="text-[11px] tracking-[0.5em] text-slate-400">DIGITAL TWIN · v4.2</p>
        <h1 className="text-3xl lg:text-4xl font-semibold tracking-wide text-white mt-1">
          AMAN SMART CITY
        </h1>
      </div>

      {/* 3D scene */}
      <div className="flex-1 relative mx-5 mb-16 rounded-xl bg-slate-200/90 overflow-hidden">
        <div className="h-full">
          <CityModel />
        </div>
      </div>

      {/* Bottom toolbar (annotate / draw / comment controls) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 rounded-full border border-slate-700/60 bg-slate-900/80 px-4 py-2 backdrop-blur">
        <ToolbarIcon label="select" />
        <ToolbarIcon label="text" />
        <ToolbarIcon label="draw" />
        <ToolbarIcon label="comment" />
      </div>
    </div>
  );
}

function ToolbarIcon({ label }: { label: string }) {
  return (
    <span
      aria-label={label}
      className="h-4 w-4 rounded-sm bg-slate-500/60"
    />
  );
}
export default HomePage;
