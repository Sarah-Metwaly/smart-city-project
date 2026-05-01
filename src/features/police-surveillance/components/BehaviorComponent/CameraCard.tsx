import React from 'react';

//interface
interface CameraProps {
  id: number;
  title: string;
  isOnline?: boolean; 
}

const CameraCard: React.FC<CameraProps> = ({ id, title, isOnline = true }) => {

  return (
    <div className="group relative bg-[#111827] rounded-xl overflow-hidden border border-slate-800 hover:border-blue-500/50 transition-all duration-300 shadow-lg">
      
      
      <div className="aspect-video bg-slate-950 flex items-center justify-center relative">
        
        {/***overlay */}
        <div className="absolute top-0 left-0 w-full p-2 flex justify-between items-center z-10">
          <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded">
            <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
            <span className="text-[10px] text-white font-bold uppercase tracking-wider">
              {isOnline ? 'Live' : 'Offline'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">CAM_{id.toString().padStart(2, '0')}</span>
        </div>

        {/* middle icon */}
        <div className="text-center opacity-20">
          <svg className="w-10 h-10 mx-auto text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <p className="text-[10px] text-slate-500 mt-2 font-mono">SIGNAL LOST</p>
        </div>
      </div>

     {/******Camera Detailed**** */}
      <div className="p-3 bg-[#1f2937] border-t border-slate-800 flex justify-between items-center">
        <div>
          <h3 className="text-white text-sm font-medium leading-none">{title}</h3>
         
        </div>
        
        {/*  zoom buttom*/}
        <button className="text-slate-500 hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CameraCard;