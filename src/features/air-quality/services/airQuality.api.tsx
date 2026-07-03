import axios from "axios";
import { type SensorData } from "../types/airQuality";
import { toMQ135Data, toBMP180Data, toDHT11Data } from "./airQuality.mappers";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getMQ135Latest = async () => {
  const res = await axios.get(`${BASE_URL}/api/v1/mq135/latest`);
  return res.data.data?.[0]; 
};

const getBMP180Latest = async () => {
  const res = await axios.get(`${BASE_URL}/api/v1/bmp180/latest`);
  return res.data.data;
};

const getDHT11Latest = async () => {
  const res = await axios.get(`${BASE_URL}/api/v1/dht11/latest`);
  return res.data.data;
};

export async function fetchAirQuality(): Promise<SensorData> {
  const [mq135Res, bmp180Res, dht11Res] = await Promise.all([
    getMQ135Latest(),
    getBMP180Latest(),
    getDHT11Latest(),
  ]);

  return {
    mq135: toMQ135Data(mq135Res),
    bmp180: toBMP180Data(bmp180Res),
    dht11: toDHT11Data(dht11Res),
  };
}