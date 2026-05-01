import useClock from '../hooks/useClock';
import { WifiOff } from 'lucide-react';

const PoliceLiveFeed = ({ isOffline = false }) => {
  const time = useClock();

  return (
    <div className="relative w-full overflow-hidden bg-[#060d14] aspect-21/9 max-h-100 min-h-62.5">
      
      {/*  SCANLINES */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ 
          background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 6px)" 
        }}
      />

      {/*  THE SCENE */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-linear-to-trom-[#111] to-transparent" />
        
        {[
          { bottom: "45%", left: "5%",  width: "18%", height: "52%" },
          { bottom: "45%", left: "28%", width: "12%", height: "32%" },
          { bottom: "45%", right: "8%", width: "22%", height: "44%" },
          { bottom: "45%", right: "30%", width: "10%", height: "28%" },
        ].map((b, i) => (
          <div 
            key={i} 
            className="absolute rounded-t-sm bg-black/60" 
            style={{ ...b }} 
          />
        ))}

        {[
          { bottom: "22%", left: "15%",  width: "50px", height: "22px" },
          { bottom: "22%", left: "45%",  width: "44px", height: "20px" },
          { bottom: "22%", right: "20%", width: "46px", height: "20px" },
        ].map((lb, i) => (
          <div 
            key={i} 
            className="absolute rounded-full blur-[10px] bg-aman-teal/10"
            style={{ ...lb }} 
          />
        ))}
      </div>

      {/* 3. RADAR SWEEP */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none animate-[sweep_4s_infinite_linear] w-[200%] -left-full"
        style={{ 
          background: "linear-gradient(to right, transparent, rgba(126,207,207,0.15), transparent)"
        }}
      />

      {/* 4. DETECTION BOXES */}
      {[
        { l: "22%", t: "38%", w: "8%", h: "30%", c: "97" },
        { l: "55%", t: "40%", w: "7%", h: "28%", c: "91" }
      ].map((b, i) => (
        <div 
          key={i} 
          className="absolute z-20 pointer-events-none rounded-xs border-[1.5px] border-aman-teal"
          style={{ left: b.l, top: b.t, width: b.w, height: b.h }}
        >
          <span className="absolute -top-3.5 left-0 text-[7px] font-bold px-1 py-0.5 rounded-xs bg-aman-teal text-aman-black whitespace-nowrap uppercase">
            Person {b.c}%
          </span>
        </div>
      ))}

      {/* 5. TOP OVERLAY */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-start justify-between p-4 bg-linear-to-b from-black/80 to-transparent">
        <div>
          <p className="text-[11px] font-bold tracking-[1.5px] text-aman-white uppercase">CAM-01 — October Bridge</p>
          <p className="text-[9px] text-aman-gray mt-0.5 tracking-[0.8px]">Sector Alpha · Primary Feed</p>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] font-bold tracking-[1.2px] text-green-400 bg-green-400/10 border border-green-400/30 px-2.5 py-1 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          LIVE
        </div>
      </div>

      {/* 6. BOTTOM OVERLAY */}
      <div className="absolute bottom-0 left-0 right-0 z-30 flex items-end justify-between p-4 bg-linear-to-t from-black/80 to-transparent">
        <div>
          <p className="text-[11px] font-medium tracking-wide text-aman-white">{time}</p>
          <p className="text-[9px] text-aman-gray mt-0.5">2026-03-16</p>
        </div>
        <p className="text-[9px] text-aman-gray tracking-[0.8px] font-mono">4K · 30fps · H.265</p>
      </div>

      {/* 7. OFFLINE STATUS */}
      {isOffline && (
        <div className="absolute inset-0 z-40 bg-[#060d14]/90 flex flex-col items-center justify-center gap-3">
          <WifiOff className="text-aman-gray animate-pulse" size={32} />
          <span className="text-[10px] tracking-[3px] text-aman-gray uppercase">Signal Lost</span>
        </div>
      )}

      <style>{`
        @keyframes sweep {
          0% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default PoliceLiveFeed;