# About this project
This code can be used to push position data from The Things Network to an Alamos FE2 server.

- Used gateway: MikroTik LoRaWAN - wAP LoRa8 kit (optional)
- Used LoRaWAN gps tracker: ELV LoRaWAN GPS Tracker ELV-LW-GPS1


# FE2 settings
- Login as FE2 admin
- Navigate to "Administration" -> "Alarmeingang"
- Create new "Externe Schnittstelle" Alarmeingang and set in "Gültige Absender" input field a random (secure) access token. You can define multipe ones in multiple lines. Allow "HTTP POST".
- Navigate to "Wache" and select the vehicle you want to track.
- Go to "Tracking-Einstellung" in the modal and select "Immer" as "Tracking-Modus". Go to "Übersicht" and select the "Einsatzmittelkennung". If not set, set one. This string has to be passed to the deviceList.json described below.

# The Things Network settings
- Setup your gps tracker and, if necessary, your gateway
- Create an TTN "Application"
- Get the username and password from your applications Integrations/MQTT page
- These credentials have to be used in the .env file mentioned below

# Create .env file

```
MQTT_URL=mqtts://eu1.cloud.thethings.network
MQTT_USER_NAME=xyxxxx@ttn
MQTT_PASSWORD=0ntVJPH8CS2i
MQTT_PORT=8883
FE2_BASE_URL=https://{fe2Domain}/rest/external/http/position/v2
FE2_ACCESS_TOKEN=0ntVJPH8CS2i
```

# Create deviceList.json

```
[
  {
    "name": "MTW 14-1",
    "mqttDeviceId": "1233",
    "fe2VehicleId": "25695842632"
  }
]
```
