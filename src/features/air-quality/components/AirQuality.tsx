import { Wifi } from "lucide-react";
import { type SensorData } from "../types/airQuality";
import SensorCard from "./SensorCard";
import { MQ135Icon, PressureIcon, AltitudeIcon, HumidityIcon } from "../icons";
import {
  getAQIColor, getCoStatus, getCo2Status, getPressureStatus, getHumidityStatus,
  getAQIMarkerLeft,
} from "../helpers";
import { GasItem } from "./GasItem";
import { AirQualitySkeleton } from "./AirQualitySkeleton";
import { AirQualityError } from "./AirQualityError";
import { useAirQuality } from "../hooks/useAirQuality";

function AirQualityUI({ data }: { data: SensorData }) {
  const { mq135, bmp180, dht11 } = data;

  const aqiColor = getAQIColor(mq135.aqi);
  const coStatus = getCoStatus(mq135.co);
  const co2Status = getCo2Status(mq135.co2);
  const presStatus = getPressureStatus(bmp180.pressure);
  const humStatus = getHumidityStatus(dht11.humidity);

  const coColor = coStatus === "danger" ? "#E63946" : coStatus === "warning" ? "#F4A623" : "#2EC4A9";
  const presColor = presStatus === "warning" ? "#F4A623" : "#2EC4A9";
  const humColor = humStatus === "warning" ? "#F4A623" : "#2EC4A9";

  const coPct = Math.min((mq135.co / 50) * 100, 100);
  const presPct = Math.min(((bmp180.pressure - 950) / 100) * 100, 100);
  const altPct = Math.min((bmp180.altitude / 500) * 100, 100);
  const humPct = Math.min(dht11.humidity, 100);

  return (
    <div className="bg-[#0A0E14] py-10 px-5  rounded-2xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[25px] font-medium text-[#F4FEFE]">Air Quality</h2>
          <p className="text-[11px] text-[#58717D] mt-0.5">MQ-2 · MQ-135 · Pressure · Altitude · Humidity</p>
        </div>
        <div className="flex items-center gap-1.5 bg-[#2EC4A9]/10 border border-[#2EC4A9]/25 px-2.5 py-1 rounded-full">
          <Wifi size={11} color="#2EC4A9" />
          <span className="text-[9px] font-bold text-[#2EC4A9] tracking-widest">LIVE</span>
        </div>
      </div>

      {/* AQI Hero */}
      <div
        className="bg-[#182B31] rounded-xl p-4 flex items-center justify-between gap-6"
        style={{ border: `1px solid ${aqiColor}44` }}
      >
        <div>
          <p className="text-[10px] text-[#58717D] uppercase tracking-widest mb-1">AQI Index</p>
          <p className="text-5xl font-semibold leading-none tabular-nums" style={{ color: aqiColor }}>
            {mq135.aqi}
          </p>
          <p className="text-xs font-medium mt-1.5" style={{ color: aqiColor }}>
            {mq135.aqiLevel}
          </p>
          <p className="text-[10px] text-[#58717D] mt-0.5">Fire Station — Smart City</p>
        </div>

        <div className="flex-1">
          <div
            className="relative h-2 rounded-full overflow-visible mb-2"
            style={{ background: "linear-gradient(to right, #2EC4A9, #F4E623, #F4A623, #E63946)" }}
          >
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#F4FEFE] -translate-x-1/2 transition-all duration-700"
              style={{ left: getAQIMarkerLeft(mq135.aqi), border: `2px solid ${aqiColor}` }}
            />
          </div>
          <div className="flex justify-between">
            {(["Good", "Moderate", "Unhealthy", "Hazardous"] as const).map((l, i) => (
              <span key={l} className="text-[9px]" style={{ color: ["#2EC4A9", "#F4E623", "#F4A623", "#E63946"][i] }}>
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Sensor Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SensorCard
          label="CO Level" sub="Carbon monoxide (MQ-2)"
          value={mq135.co} unit="ppm"
          pct={coPct} status={coStatus}
          icon={<MQ135Icon color={coColor} />}
        />
        <SensorCard
          label="Pressure" sub="Atmospheric pressure"
          value={bmp180.pressure} unit="hPa"
          pct={presPct} status={presStatus}
          icon={<PressureIcon color={presColor} />}
        />
        <SensorCard
          label="Altitude" sub="Elevation above sea level"
          value={bmp180.altitude} unit="m"
          pct={altPct} status="stable"
          icon={<AltitudeIcon color="#B4C3CC" />}
        />
        <SensorCard
          label="Humidity" sub="Concentration of water vapor"
          value={dht11.humidity} unit="%"
          pct={humPct} status={humStatus}
          icon={<HumidityIcon color={humColor} />}
        />
      </div>

      {/* Gas Breakdown */}
      <div className="bg-[#182B31] border border-[#58717D]/20 rounded-xl p-4">
        <p className="text-[10px] text-[#58717D] uppercase tracking-widest font-medium mb-3">
          Gas Breakdown
        </p>
        <div className="grid grid-cols-2 gap-2">
          <GasItem
            name="CO — Carbon Monoxide (MQ-2)"
            value={`${mq135.co} ppm`}
            level={coStatus === "danger" ? "High" : coStatus === "warning" ? "Medium" : "Low"}
          />
          <GasItem
            name="CO₂ — Carbon Dioxide (MQ-135)"
            value={`${mq135.co2} ppm`}
            level={co2Status === "danger" ? "High" : co2Status === "warning" ? "Medium" : "Low"}
          />
          <GasItem
            name="Smoke particles (MQ-2)"
            value={mq135.smoke}
            level={mq135.smoke}
          />
          <GasItem
            name="NH₃ / Benzene (MQ-135)"
            value={mq135.benzene}
            level={mq135.benzene}
          />
        </div>
      </div>
    </div>
  );
}

// ── Root export ────────────────────────────────────────────────────────────
export default function AirQuality() {
  const { data, isLoading, isError } = useAirQuality();

  const isDataIncomplete = !data || !data.mq135 || !data.bmp180 || !data.dht11;

  if (isLoading) return <AirQualitySkeleton />;
  if (isError || isDataIncomplete) return <AirQualityError />;

  return <AirQualityUI data={data} />;
}