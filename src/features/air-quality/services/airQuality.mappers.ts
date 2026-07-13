import { type MQ135Data,type  BMP180Data, type DHT11Data } from "../types/airQuality";

interface MQ135RawSensor {
  sensor_id: string;
  co?: number;
  smoke?:string;
  co2?: number;
  benzene?: string;
}

interface MQ135RawResponse {
  sensors: MQ135RawSensor[];
  air_quality: { aqi: number; level: string };
  power?: number;
}

export function toMQ135Data(raw: MQ135RawResponse): MQ135Data {
  const mq2Sensor = raw?.sensors?.find((s) => s.sensor_id === "mq2_sensor");
  const mq135Sensor = raw?.sensors?.find((s) => s.sensor_id === "mq135_sensor");

  return {
    co: mq2Sensor?.co ?? 0,
    smoke: mq2Sensor?.smoke ?? "Unknown",
    co2: mq135Sensor?.co2 ?? 0,
    benzene: mq135Sensor?.benzene ?? "Unknown",
    aqi: raw?.air_quality?.aqi ?? 0,
    aqiLevel: raw?.air_quality?.level ?? "Unknown",
    power: (raw as any)?.power ?? 0,
  };
}

export function toBMP180Data(raw: any): BMP180Data {
  const item = Array.isArray(raw) ? raw[0] : raw;
  return {
    pressure: Number(item?.pressure) || 0,
    altitude: Number(item?.altitude) || 0,
    temperature: Number(item?.temperature) || 0,
  };
}

export function toDHT11Data(raw: any): DHT11Data {
  const item = Array.isArray(raw) ? raw[0] : raw;
  return {
    humidity: item?.humidity ?? 0,
    temperature: item?.temperature ?? 0,
    power: item?.power ?? 0,
    status: item?.status ?? "UNKNOWN",
    timeStamp: item?.timeStamp ?? new Date().toISOString(), 
  };
}