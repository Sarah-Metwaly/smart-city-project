import React, { useState } from 'react';

type RiskLevel = 'high' | 'medium' | 'low';

interface Zone {
  id: number;
  name: string;
  x: string;
  y: string;
  risk: RiskLevel;
  rate: number;
  size: number;
}

const ZONES: Zone[] = [
  { id: 1, name: "East Side", x: "68%", y: "35%", risk: "high", rate: 85, size: 150 },
  { id: 3, name: "Central", x: "50%", y: "56%", risk: "medium", rate: 52, size: 120 },
  { id: 4, name: "North Bridge", x: "56%", y: "20%", risk: "medium", rate: 45, size: 115 },
  { id: 6, name: "West Gate", x: "17%", y: "63%", risk: "low", rate: 30, size: 100 },
];

const RISK: Record<RiskLevel, { dot: string; text: string; border: string; ring: string; heatColor: string }> = {
  high: { dot: "bg-[#ff4d4d]", text: "text-[#ff4d4d]", border: "border-[rgba(255,77,77,0.35)]", ring: "text-[#ff4d4d]", heatColor: "rgba(255,77,77" },
  medium: { dot: "bg-[#f5a623]", text: "text-[#f5a623]", border: "border-[rgba(245,166,35,0.3)]", ring: "text-[#f5a623]", heatColor: "rgba(245,166,35" },
  low: { dot: "bg-[#4caf8a]", text: "text-[#4caf8a]", border: "border-[rgba(76,175,138,0.28)]", ring: "text-[#4caf8a]", heatColor: "rgba(76,175,138" },
};

const CitySurveillanceMap: React.FC = () => {
  const [mode, setMode] = useState<string>("both");
  const showHeat = mode === "heat" || mode === "both";
  const showPins = mode === "pins" || mode === "both";

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[rgba(30,58,70,0.7)] shrink-0">
        <span className="text-[10px] font-medium tracking-[2px] uppercase text-aman-white">City Surveillance Map</span>
        <div className="flex bg-aman-teal border border-[rgba(30,58,70,0.8)] rounded overflow-hidden">
          {["heat", "pins", "both"].map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`px-2.5 py-1 text-[8px] font-bold tracking-wide uppercase transition-all duration-150
                border-r last:border-r-0 border-[rgba(30,58,70,0.7)]
                ${mode === m ? "bg-aman-dark text-aman-white" : "bg-transparent text-aman-gray hover:text-aman-light"}`}
            >{m}</button>
          ))}
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden" style={{ background: "#050c10", minHeight: "200px" }}>
        <div className="absolute inset-0 pointer-events-none z-1"
          style={{ backgroundImage: "linear-gradient(rgba(126,207,207,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(126,207,207,0.04) 1px,transparent 1px)", backgroundSize: "36px 36px" }}
        />
        {[28, 55, 78].map(t => (
          <div key={t} className="absolute left-0 right-0 h-px z-2" style={{ top: `${t}%`, background: "rgba(30,58,70,0.5)" }} />
        ))}
        {[32, 65].map(l => (
          <div key={l} className="absolute top-0 bottom-0 w-px z-2" style={{ left: `${l}%`, background: "rgba(30,58,70,0.5)" }} />
        ))}

        {showHeat && ZONES.map(z => {
          const hc = RISK[z.risk].heatColor;
          return (
            <div key={z.id} className="absolute rounded-full pointer-events-none z-3 animate-pulse"
              style={{
                left: z.x, top: z.y, width: `${z.size}px`, height: `${z.size}px`,
                transform: "translate(-50%,-50%)",
                background:
                  z.risk === "high"
                    ? `radial-gradient(circle,${hc},0.4) 0%,${hc},0.18) 30%,${hc},0.06) 55%,transparent 72%)`
                    : z.risk === "medium"
                      ? `radial-gradient(circle,${hc},0.3) 0%,${hc},0.13) 30%,${hc},0.04) 55%,transparent 72%)`
                      : `radial-gradient(circle,${hc},0.22) 0%,${hc},0.09) 35%,transparent 65%)`,
              }}
            />
          );
        })}

        {showPins && ZONES.map(z => {
          const rc = RISK[z.risk];
          return (
            <div key={z.id} className="absolute flex flex-col items-center transition-transform duration-200 cursor-pointer z-7 hover:scale-110"
              style={{ left: z.x, top: z.y, transform: "translate(-50%,-50%)" }}
            >
              <div className={`relative w-2.5 h-2.5 rounded-full border-2 border-white/20 ${rc.dot}`}>
                <span className={`absolute -inset-1 rounded-full border border-current animate-ping opacity-75 ${rc.ring}`} />
              </div>
              <div className={`mt-1.5 px-1.5 py-1 rounded bg-[rgba(5,12,16,0.9)] backdrop-blur-sm border ${rc.border} whitespace-nowrap`}>
                <p className="text-[8px] font-semibold text-aman-white">{z.name}</p>
                <p className={`text-[7px] font-bold mt-0.5 ${rc.text}`}>{z.rate}% crime</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between px-3.5 py-2 border-t border-[rgba(30,58,70,0.7)] shrink-0">
        <div className="flex items-center gap-1.5 text-[8px] text-aman-gray">
          <span>LOW</span>
          <div className="h-1 rounded-full w-14" style={{ background: "linear-gradient(to right,rgba(76,175,138,0.6),rgba(245,166,35,0.6),rgba(255,77,77,0.8))" }} />
          <span>HIGH</span>
        </div>
        <div className="flex gap-3">
          {[["ZONES", "6"], ["ACTIVE", "3"]].map(([k, v]) => (
            <span key={k} className="text-[8px] text-aman-gray tracking-[1px]">
              {k} <span className="text-white">{v}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CitySurveillanceMap;
