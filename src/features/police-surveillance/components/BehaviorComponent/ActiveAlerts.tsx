import { FC } from "react";

type Threat = "high" | "medium" | "low";

const style: Record<
  Threat,
  { bar: string; text: string; border: string; card: string }
> = {
  high: {
    bar: "bg-[#E05A5A]",
    text: "text-red-400",
    border: "border-[#E05A5A]",
    card: "bg-red-950/30",
  },
  medium: {
    bar: "bg-[#E09A3D]",
    text: "text-amber-400",
    border: "border-amber-600",
    card: "bg-amber-950/30",
  },
  low: {
    bar: "bg-emerald-400",
    text: "text-emerald-400",
    border: "border-emerald-700",
    card: "bg-[#061a0f]/30",
  },
};
//bar heigh
const barHeights: Record<Threat, string[]> = {
  high: ["40%", "70%", "100%"],
  medium: ["40%", "100%", "40%"],
  low: ["15%", "40%", "15%"],
};

const entries: {
  name: string;
  sub: string;
  pct: number | null;
  threat: Threat | null;
  scanning?: boolean;
}[] = [
  {
    name: "fainting",
    sub: "High",
    pct: 97,
    threat: "high",
  },
  {
    name: "Theft",
    sub: "Medium",
    pct: 61,
    threat: "medium",
  },
  {
    name: "Fight",
    sub: "Low",
    pct: 22,
    threat: "low",
  },
];

const ActiveAlerts: FC = () => (
  <div className="bg-aman-teal hover:bg-aman-teal border-aman-teal transition-all rounded-2xl p-4">
    <p className="text-[10px] font-inter tracking-widest text-slate-500 mb-3">
      ACTIVE ALERTS
    </p>

    {/* Threat Level Cards */}
    <div className="grid grid-cols-3 gap-2 mb-6">
      {(Object.keys(style) as Threat[]).map((level) => (
        <div
          key={level}
          className={`relative flex flex-col items-center gap-2 rounded-xl py-3 border overflow-hidden ${style[level].border} ${style[level].card}`}
        >
          <div
            className={`absolute top-0 inset-x-0 h-0.5 ${style[level].bar}`}
          />
          <div className="flex items-end gap-1 h-6">
            {barHeights[level].map((h, i) => (
              <div
                key={i}
                className={`w-2 rounded-sm ${style[level].bar}`}
                style={{ height: h }}
              />
            ))}
          </div>
          <span
            className={`text-[9px] tracking-widest font-bold ${style[level].text}`}
          >
            {level.toUpperCase()}
          </span>
        </div>
      ))}
    </div>

    <p className="text-[10px] tracking-widest text-slate-500 mb-3">
      MATCH QUEUE
    </p>

    {/* Queue Entries */}
    <div className="flex flex-col gap-2">
      {entries.map((e, i) => {
        const s = e.threat ? style[e.threat] : null;
        return (
          <div
            key={i}
            className={`rounded-xl border px-3 py-1 ${
              s ? `${s.border} ${s.card}` : "border-slate-700 bg-[#0f1f30]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-200">{e.name}</p>
                <p className="text-[11px] text-slate-500">{e.sub}</p>
              </div>
              <span
                className={`text-sm font-bold ${s ? s.text : "text-slate-500"}`}
              >
                {e.scanning ? "···" : e.pct != null ? `${e.pct}%` : "—"}
              </span>
            </div>
            <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  e.scanning
                    ? "animate-pulse bg-slate-600"
                    : s
                    ? s.bar
                    : "bg-slate-600"
                }`}
                style={{ width: e.pct != null ? `${e.pct}%` : "8%" }}
              />
            </div>
            {e.pct != null && (
              <div className="mt-1 flex justify-between text-[9px] text-slate-600">
                <span>0%</span>
                <span>100%</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

export default ActiveAlerts;
