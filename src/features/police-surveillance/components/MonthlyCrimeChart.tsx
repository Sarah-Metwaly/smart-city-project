
// import React from "react";

// const MonthlyCrimeChartSVG: React.FC = () => {
//   return (
//     <div className=" bg-aman-dark rounded-xl" style={{ padding: "18px", animationDelay: ".23s" }}>
//       {/* Label Section */}
//       <div className="chart-label flex items-center gap-2 mb-4 text-cyan-400 text-[12px] uppercase tracking-widest font-mono">
//         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7ecfcf" strokeWidth="1.8" strokeLinecap="round">
//           <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
//           <polyline points="17 6 23 6 23 12" />
//         </svg>
//         Monthly Crime Rate
//       </div>

//       {/* SVG Chart */}
//       <svg className="chart-svg w-full h-[180px]" viewBox="0 0 480 180" preserveAspectRatio="none">
//         <defs>
//           <linearGradient id="aG" x1="0" y1="0" x2="0" y2="1">
//             <stop offset="5%" stopColor="#E63946" stopOpacity=".28" />
//             <stop offset="95%" stopColor="#E63946" stopOpacity="0" />
//           </linearGradient>
//         </defs>

//         {/* Grid Lines */}
//         {[36, 72, 108, 144].map((y) => (
//           <line key={y} x1="0" y1={y} x2="480" y2={y} stroke="rgba(30,58,70,.6)" strokeWidth="1" />
//         ))}

//         {/* Area Fill */}
//         <polygon points="0,148 80,112 160,124 240,88 320,96 400,124 480,148" fill="url(#aG)" />

//         {/* Weapons Line (Red) */}
//         <polyline
//           points="0,148 80,112 160,124 240,88 320,96 400,124 480,148"
//           fill="none"
//           stroke="#E63946"
//           strokeWidth="2"
//         />

//         {/* Arrests Line (Green - Dashed) */}
//         <polyline
//           points="0,162 80,136 160,144 240,112 320,120 400,140 480,152"
//           fill="none"
//           stroke="#4caf8a"
//           strokeWidth="2"
//           strokeDasharray="4 3"
//         />

//         {/* Weapons Dots */}
//         {[
//           { cx: 0, cy: 148 },
//           { cx: 80, cy: 112 },
//           { cx: 160, cy: 124 },
//           { cx: 240, cy: 88 },
//           { cx: 320, cy: 96 },
//           { cx: 400, cy: 124 },
//         ].map((dot, i) => (
//           <circle key={i} cx={dot.cx} cy={dot.cy} r="3" fill="#E63946" />
//         ))}

//         {/* X-Axis Labels */}
//         {[
//           { x: 0, label: "Sep" },
//           { x: 68, label: "Oct" },
//           { x: 148, label: "Nov" },
//           { x: 228, label: "Dec" },
//           { x: 308, label: "Jan" },
//           { x: 388, label: "Feb" },
//         ].map((item, i) => (
//           <text key={i} x={item.x} y="174" fill="#58717D" fontSize="10" fontFamily="DM Mono,monospace">
//             {item.label}
//           </text>
//         ))}
//       </svg>

//       {/* Legend Section */}
//       <div className="chart-legend flex gap-4 mt-4 text-[12px] font-mono">
//         <div className="flex items-center gap-2 text-gray-400 leg-item">
//           <span className="w-2 h-2 rounded-full leg-dot" style={{ background: "#E63946" }}></span>
//           Weapons
//         </div>
//         <div className="flex items-center gap-2 text-gray-400 leg-item">
//           <span className="w-2 h-2 rounded-full leg-dot" style={{ background: "#4caf8a" }}></span>
//           Arrests
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MonthlyCrimeChartSVG;


import React from "react";

const MonthlyCrimeChart: React.FC = () => {
  return (
    <div className="flex flex-col justify-between w-full h-full bg-aman-teal rounded-xl" style={{ padding: "24px" }}>
      
      {/* 1. Header Section */}
      <div className="flex items-center gap-2 mb-6 text-aman-white text-[11px] uppercase tracking-[0.3em] font-black italic opacity-90">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
        Monthly Crime Rate
      </div>

      {/* 2. SVG Chart Area */}
      <div className="flex-1 w-full min-h-0">
        <svg 
          className="w-full h-full" 
          viewBox="0 0 480 180" 
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="aG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#E63946" stopOpacity=".3" />
              <stop offset="95%" stopColor="#E63946" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid Lines - تعديل اللون ليكون Cyan خفيف جداً وواضح فوق الـ Teal */}
          {[36, 72, 108, 144].map((y) => (
            <line 
              key={y} 
              x1="0" 
              y1={y} 
              x2="480" 
              y2={y} 
              stroke="rgba(126, 207, 207, 0.15)" // لون Cyan بـ Opacity قليل
              strokeWidth="1" 
            />
          ))}

          {/* Area Fill */}
          <path 
            d="M0,148 L80,112 L160,124 L240,88 L320,96 L400,124 L480,148 V180 H0 Z" 
            fill="url(#aG)" 
          />

          {/* Weapons Line (Red) */}
          <polyline
            points="0,148 80,112 160,124 240,88 320,96 400,124 480,148"
            fill="none"
            stroke="#E63946"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Arrests Line (Green - Dashed) */}
          <polyline
            points="0,162 80,136 160,144 240,112 320,120 400,140 480,152"
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            strokeDasharray="6 4"
            strokeLinejoin="round"
          />

          {/* Dots */}
          {[
            { cx: 80, cy: 112 },
            { cx: 160, cy: 124 },
            { cx: 240, cy: 88 },
            { cx: 320, cy: 96 },
            { cx: 400, cy: 124 }
          ].map((dot, i) => (
            <circle key={i} cx={dot.cx} cy={dot.cy} r="4" fill="#E63946" />
          ))}

          {/* X-Axis Labels - تعديل اللون ليكون أفتح (Slate-300) عشان يظهر فوق الـ Teal */}
          {[
            { x: 0, label: "Sep" },
            { x: 80, label: "Oct" },
            { x: 160, label: "Nov" },
            { x: 240, label: "Dec" },
            { x: 320, label: "Jan" },
            { x: 400, label: "Feb" }
          ].map((item, i) => (
            <text 
              key={i} 
              x={item.x} 
              y="178" 
              fill="#cbd5e1" // Slate-300
              fontSize="11" 
              fontWeight="bold"
              className="font-mono"
            >
              {item.label}
            </text>
          ))}
        </svg>
      </div>

      {/* 3. Legend Section */}
      <div className="flex gap-8 mt-6">
        <div className="flex items-center gap-2 text-slate-300 text-[10px] font-black uppercase tracking-[0.2em]">
          <span className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(230,57,70,0.5)]" style={{ background: "#E63946" }}></span>
          Weapons
        </div>
        <div className="flex items-center gap-2 text-slate-300 text-[10px] font-black uppercase tracking-[0.2em]">
          <span className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" style={{ background: "#10b981" }}></span>
          Arrests
        </div>
      </div>
    </div>
  );
};

export default MonthlyCrimeChart;