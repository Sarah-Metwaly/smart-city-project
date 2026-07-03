export type AQStatus = "normal" | "warning" | "danger" | "stable";

export interface MQ135Data {
  co: number;
  smoke: string;
  co2: number;
  benzene: string;
  aqi: number;
  aqiLevel: string;
}

export interface BMP180Data {
  pressure: number;
  altitude: number;
  temperature: number;
}

export interface DHT11Data {
  humidity: number;
  temperature: number;
}

export interface SensorData {
  mq135: MQ135Data;
  bmp180: BMP180Data;
  dht11: DHT11Data;
}