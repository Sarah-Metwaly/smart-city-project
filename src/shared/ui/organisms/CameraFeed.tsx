import React from "react";
import { Camera, Activity } from "lucide-react";

interface CameraFeedProps {
  imageUrl?: string; 
  location?: string;
  status?: "PROCESSING" | "IDLE" | "ALERT";
}

const CameraFeed: React.FC<CameraFeedProps> = ({ 
  imageUrl, 
  location = "EAST SIDE STATION",
  status = "PROCESSING"
}) => {
  return (
    <div className="flex flex-col h-full bg-[#050c10] border border-aman-teal/30 rounded-2xl overflow-hidden shadow-2xl">
      
      
      <div className="flex items-center justify-between p-3 border-b bg-black/60 border-aman-teal/10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2 py-0.5 bg-red-500/10 border border-red-500/30 rounded text-[9px] text-red-500 font-bold">
            <span className={`w-1.5 h-1.5 rounded-full bg-red-500 ${status === 'PROCESSING' ? 'animate-pulse' : ''}`}></span>
            AI FEED: {status}
          </div>
          <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">
            CAM-007 — {location}
          </span>
        </div>
        <Activity size={12} className="text-cyan-900" />
      </div>

      {/* Viewport - مساحة عرض الصورة */}
      <div className="relative flex items-center justify-center flex-1 overflow-hidden bg-black">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt="Live Camera Feed" 
            className="object-cover w-full h-full transition-opacity duration-500"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-cyan-900/40">
            <Camera size={48} strokeWidth={1} />
            <span className="text-[10px] tracking-widest">INITIALIZING LIVE FEED...</span>
          </div>
        )}

        {/* HUD Elements (المربعات والمؤشرات لتعزيز الشكل التقني) */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Scanlines Effect */}
          <div className="absolute inset-0 opacity-[0.03] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#fff_2px,#fff_4px)]"></div>
          
          {/* Viewfinder Corners */}
          <div className="absolute w-6 h-6 border-t-2 border-l-2 top-6 left-6 border-cyan-500/20"></div>
          <div className="absolute w-6 h-6 border-t-2 border-r-2 top-6 right-6 border-cyan-500/20"></div>
          <div className="absolute w-6 h-6 border-b-2 border-l-2 bottom-6 left-6 border-cyan-500/20"></div>
          <div className="absolute w-6 h-6 border-b-2 border-r-2 bottom-6 right-6 border-cyan-500/20"></div>
        </div>
      </div>

      {/* Technical Footer */}
      <div className="p-2 bg-black/80 border-t border-aman-teal/10 flex justify-between items-center text-[8px] font-mono text-cyan-800">
        <div className="flex gap-4">
          <span>LAT: 30.0444° N</span>
          <span>LON: 31.2357° E</span>
        </div>
        <div className="flex gap-3">
          <span>MODEL: FaceNet v3.2 / WeaponNet</span>
          <span>FPS: 24.0</span>
        </div>
      </div>
    </div>
  );
};

export default CameraFeed;