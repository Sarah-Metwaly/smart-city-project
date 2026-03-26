import time
import json
import adafruit_dht
import board
import paho.mqtt.client as mqtt
import ssl

dhtDevice = adafruit_dht.DHT11(board.D4)

BROKER = "i5111178.ala.eu-central-1.emqxsl.com"
PORT = 8883
TOPIC = "smartcity/dht11"

USERNAME = "powerpuffgirls"
PASSWORD = "SCE2026grad"

client = mqtt.Client()
client.username_pw_set(USERNAME, PASSWORD)

client.tls_set(cert_reqs=ssl.CERT_NONE)
client.tls_insecure_set(True)

client.connect(BROKER, PORT, 60)

voltage = 5
current = 0.0025
power = round(voltage * current, 3)

def get_status(temp, hum):
    if temp is None or hum is None:
        return "FAULTY"
    elif temp >= 30:
        return "HIGH_TEMP"
    elif hum > 70:
        return "HIGH_HUMIDITY"
    else:
        return "NORMAL"

while True:
    try:
        temperature = dhtDevice.temperature
        humidity = dhtDevice.humidity

        status = get_status(temperature, humidity)

        payload = {
            "sensor_id": "DHT1",
            "temperature": float(temperature) if temperature else None,
            "humidity": float(humidity) if humidity else None,
            "status": status,
            "power": power
        }

        data = json.dumps(payload)

        print(data)

        client.publish(TOPIC, data)

    except Exception as e:
        print("Sensor error:", e)

    time.sleep(5)
