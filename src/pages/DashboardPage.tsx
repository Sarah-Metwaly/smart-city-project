import CityModel from '../components/CityModel/CityModel';
import { ActiveIncidentsPanel } from '../features/dashboard/components/ActiveIncidentsPanel';
import { DangerZonesPanel } from '../features/dashboard/components/DangerZonesPanel';
import { EnergyMonitoringPanel } from '../features/dashboard/components/EnergyMonitoringPanel';
import { EnvironmentalPanel } from '../features/dashboard/components/EnvironmentalPanel';
import SmartSensorsPanel from '../features/dashboard/components/SmartSensorsPanel';
import { WeeklyIncidentTrendPanel } from '../features/dashboard/components/Weeklyincidenttrendpanel';


 export function HomePage() {
  return (

    <div className="pt-20 sm:pt-22 min-h-screen lg:h-screen w-full lg:overflow-hidden overflow-y-auto bg-[#0a121e] text-slate-200 p-3 sm:p-4 box-border">
      <div
        className="
          grid gap-3 sm:gap-4
          grid-cols-1
          lg:grid-cols-[260px_minmax(0,1fr)_260px]
          xl:grid-cols-[300px_minmax(0,1fr)_300px]
          2xl:grid-cols-[320px_minmax(0,1fr)_320px]
          lg:h-full lg:grid-rows-1
        "
      >
        {/* ---------------- LEFT COLUMN ---------------- */}

        <div className="flex flex-col gap-3 sm:gap-4 order-2 lg:order-1 lg:h-full lg:min-h-0">
          <div className="h-[300px] sm:h-[340px] lg:h-auto lg:flex-1 lg:min-h-0"><ActiveIncidentsPanel /></div>
           <div className="h-[240px] sm:h-[270px] lg:h-auto lg:flex-1 lg:min-h-0"><WeeklyIncidentTrendPanel/></div>
          <div className="h-[260px] sm:h-[290px] lg:h-auto lg:flex-1 lg:min-h-0"><DangerZonesPanel /></div>
        </div>

        {/* ---------------- CENTER: CITY MODEL / LIVE FEED ---------------- */}
        <div className="order-1 lg:order-2 h-[440px] sm:h-[520px] md:h-[560px] lg:h-full lg:min-h-0">
          <CityModelPanel />
        </div>

        {/* ---------------- RIGHT COLUMN ---------------- */}
        <div className="flex flex-col gap-3 sm:gap-4 order-3 lg:h-full lg:min-h-0">
          <div className="h-[280px] sm:h-[310px] lg:h-auto lg:flex-1 lg:min-h-0"><SmartSensorsPanel /></div>
          <div className="h-[240px] sm:h-[270px] lg:h-auto lg:flex-1 lg:min-h-0"><EnergyMonitoringPanel /></div>
          <div className="h-[280px] sm:h-[310px] lg:h-auto lg:flex-1 lg:min-h-0"><EnvironmentalPanel /></div>
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
      {/* faint HUD grid backdrop — reinforces the "digital twin" read */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #67e8f9 1px, transparent 1px), linear-gradient(to bottom, #67e8f9 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* corner brackets */}
      <span className="pointer-events-none absolute top-3 left-3 h-4 w-4 border-t-2 border-l-2 border-cyan-400/50 rounded-tl-sm" />
      <span className="pointer-events-none absolute top-3 right-3 h-4 w-4 border-t-2 border-r-2 border-cyan-400/50 rounded-tr-sm" />
      <span className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 border-cyan-400/50 rounded-bl-sm" />
      <span className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2 border-cyan-400/50 rounded-br-sm" />

      {/* Top chrome: live feed label + REC indicator */}
      <div className="relative z-10 flex items-center justify-between px-4 sm:px-5 pt-3 sm:pt-4 text-[10px] sm:text-[11px] tracking-[0.2em] text-cyan-300/70 shrink-0">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          LIVE FEED · CAM 01
        </span>
        <span className="flex items-center gap-1.5 text-red-400">
          REC <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        </span>
      </div>

      {/* Title block */}
      <div className="relative z-10 text-center pt-1.5 sm:pt-2 pb-2 sm:pb-4 shrink-0">
        <p className="text-[9px] sm:text-[11px] tracking-[0.35em] sm:tracking-[0.5em] text-slate-400">
          DIGITAL TWIN · v4.2
        </p>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-wide text-white mt-1">
          AMAN SMART CITY
        </h1>
      </div>

      {/* 3D scene */}
      <div className="relative z-10 flex-1 min-h-0 mx-3 sm:mx-5 mb-14 sm:mb-16 rounded-xl bg-slate-200/90 overflow-hidden ring-1 ring-cyan-400/20">
        <div className="h-full w-full">
          <CityModel />
        </div>
      </div>

      {/* Bottom toolbar (annotate / draw / comment controls) */}
      <div className="absolute z-10 bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2.5 sm:gap-3 rounded-full border border-slate-700/60 bg-slate-900/80 px-3.5 sm:px-4 py-1.5 sm:py-2 backdrop-blur">
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