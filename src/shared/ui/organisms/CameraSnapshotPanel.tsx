import React from "react";
import { Camera } from "lucide-react";

interface CameraProps {
  id: string;
  isAlert?: boolean;
  status: "LIVE" | "ALERT";
}

const CameraCell: React.FC<CameraProps> = ({ id, isAlert, status }) => (
  <div className={`snap-cell ${isAlert ? 'alert-cam-cell' : ''} relative border-radius-[6px] overflow-hidden aspect-video bg-[#050c10] border border-cyan-900/50`}>
    {/* Scanlines Effect */}
    <div className="absolute inset-0 z-10 pointer-events-none opacity-20 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,.5)_2px,rgba(0,0,0,.5)_4px)]"></div>
    
    {/* Detection Box Example */}
    {isAlert && (
      <div className="det-box weapon absolute border-[1.5px] border-red-500 z-12 top-1/4 left-1/4 w-1/3 h-1/3 rounded-sm pointer-events-none">
        <span className="det-tag weapon absolute -top-4 left-0 bg-red-500 text-white text-[7px] px-1.5 font-bold rounded-sm">WEAPON DETECTED</span>
      </div>
    )}

    {/* Overlays */}
    <div className="absolute top-0 left-0 right-0 flex items-start justify-between p-2 snap-overlay-top z-15 bg-linear-to-b from-black/70 to-transparent">
      <span className="snap-cam-id text-[8px] font-bold text-white tracking-widest">{id}</span>
      <div className={`snap-status ${status === 'ALERT' ? 'text-red-500 bg-red-500/20 border-red-500/40' : 'text-green-500 bg-green-500/20 border-green-500/40'} text-[7px] font-bold px-2 py-0.5 rounded border flex items-center gap-1`}>
        <div className="w-1 h-1 bg-current rounded-full snap-dot animate-pulse" />
        {status}
      </div>
    </div>
    
    <div className="snap-overlay-bot absolute bottom-0 left-0 right-0 p-1.5 z-15 flex justify-between bg-linear-to-t from-black/70 to-transparent text-[7px] text-cyan-500 font-mono">
      <span>REC ●</span>
      <span>2026-04-21 13:10:04</span>
    </div>
  </div>
);

export const CameraSnapshotPanel: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  if (!isOpen) return null;
  return (
    <div className="p-4 duration-200 border-t border-gray-800 snap-panel animate-in fade-in">
      <div className="snap-title flex items-center gap-2 text-[10px] font-bold tracking-widest text-gray-300 mb-4 uppercase font-mono">
        <Camera size={14} className="text-cyan-400" />
        Tactical Camera Feed
      </div>
      <div className="grid grid-cols-2 gap-3 snap-grid">
        <CameraCell id="CAM-01" status="ALERT" isAlert />
        <CameraCell id="CAM-04" status="LIVE" />
      </div>
    </div>
  );
};