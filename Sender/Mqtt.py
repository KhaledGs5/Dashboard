import random
import paho.mqtt.client as paho

def generate_value():
    return random.randint(1, 100)

def on_connect(client, userdata, flags, rc):
    print(f"Connected with result code {rc}")
    client.publish("Temperature", 75, qos=0)
    client.publish("Vitesse",120, qos=0)
    client.disconnect()

def main():
    client = paho.Client()
    client.on_connect = on_connect
    client.connect("localhost", 1883, 60)
    client.loop_start()
    client.loop_stop()

main()
