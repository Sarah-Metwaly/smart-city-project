from gpiozero import LightSensor, MotionSensor, PWMLED
import paho.mqtt.client as mqtt
import time
import json
import random

# MQTT broker initialization
"""broker = "i5111178.ala.eu-central-1.emqxsl.com"
port = 8883
client = mqtt.Client()
client.username_pw_set("powerpuffgirls","SCE2026grad")
client.tls_set()
client.connect(broker, port)"""

# Sensors initialization
ldr1 = LightSensor(4)
pir1 = MotionSensor(17)

# leds initialization
led1 = PWMLED(18)

# main program
time.sleep(5)
while True:
    ldr_value = ldr1.value
    if ldr_value > 0.8:
        brightness = 0

    else:
        brightness = 0.3
        if pir1.motion_detected:
            brightness = 1
            print("Motion detected")

        else:
            print("No motion")

    led1.value = brightness
    print("LDR:", ldr_value)
    print("Brightness:", brightness)
    # power calculation
    LED_VOLTAGE = 3.3
    LED_CURRENT = 0.02
    MAX_POWER = LED_VOLTAGE * LED_CURRENT
    power = brightness * MAX_POWER

    if brightness > 0:
        status = "ON"
    else:
        status = "OFF"

    data = {
        "sensor_id": "LDR1",
        "ldr_value": ldr_value,
        "status": status,
        "power": power
    }

    # client.publish("smartcity/streetlight1", json.dumps(data))
    print(data)
    time.sleep(2)