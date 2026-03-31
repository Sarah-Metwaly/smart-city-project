import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

const useWebSocket = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const ws = new WebSocket(import.meta.env.VITE_WS_URL);

    ws.onopen = () => console.log("✅ WebSocket connected");
ws.onmessage = (event) => {
  try {
    const { topic } = JSON.parse(event.data);
    console.log("Incoming Topic:", topic);


    if (topic === "ldr") {
      queryClient.invalidateQueries({ queryKey: ["LDRValue"] });
      queryClient.invalidateQueries({ queryKey: ["lightStatus"] });
    } 
    else if (topic === "dht11") {
      queryClient.invalidateQueries({ queryKey: ["DHT11Value"] });
    } 
    else if (topic === "bmp180") {
      queryClient.invalidateQueries({ queryKey: ["BMB180Value"] });
    } 
    else if (topic === "mq135") {
      queryClient.invalidateQueries({ queryKey: ["MQ135Value"] });
    }

    const allSensors = ["ldr", "dht11", "bmp180", "mq135"];
    if (allSensors.includes(topic)) {
      queryClient.invalidateQueries({ queryKey: ["weeklySummary"] });
      queryClient.invalidateQueries({ queryKey: ["TotalData"] });
      console.log(`✅ Updated ${topic} and Summaries`);
    }

  } catch (err) {
    console.error("❌ Error in WS Message:", err);
  }
};

    ws.onclose = () => console.log("⚠️ WebSocket disconnected");
    ws.onerror = (error) => console.log("❌ WebSocket error:", error);

    return () => ws.close();
  }, []);
};

export default useWebSocket;
