import mqtt, { MqttClient } from 'mqtt';
import { Logger } from './Logger';
import { MqttLocationDto } from 'src/entities/MqttLocationDto';
import { MqttFe2Mapping } from 'src/entities/MqttFe2Mapping';

export class MqttHelper {
  private URL: string = process.env.MQTT_URL;
  private USER_NAME: string = process.env.MQTT_USER_NAME;
  private PASSWORD: string = process.env.MQTT_PASSWORD;
  private PORT: number = parseInt(process.env.MQTT_PORT);
  private PROTOCOL_VERSION: 4 | 5 | 3 = 3;

  private LOGGER = Logger.getLogger(MqttHelper.name);
  private CLIENT: MqttClient;
  private DEVICE_UPDATE_CALLBACK_LIST: ((
    mqttFe2Mapping: MqttFe2Mapping,
    latitude: number,
    longitude: number,
    altitude: number,
    receivedAt: string
  ) => void)[] = [];

  private MQTT_FE2_MAPPING: MqttFe2Mapping[];

  constructor(mqttFe2Mapping: MqttFe2Mapping[]) {
    this.MQTT_FE2_MAPPING = mqttFe2Mapping;

    this.CLIENT = mqtt.connect(this.URL, {
      username: this.USER_NAME,
      password: this.PASSWORD,
      port: this.PORT,
      protocolVersion: this.PROTOCOL_VERSION
    });

    this.CLIENT.on('error', (error: any) => {
      this.error(error);
    });
    this.CLIENT.on('connect', (message: any) => {
      this.connect(message.toString());
    });
    this.CLIENT.on('message', (topic: string, payload: any) => {
      this.receivedLocation(topic, payload.toString());
    });

    this.init();
  }

  /**
   * Handle mqtt connect
   *
   * @param message Message
   */
  private connect(message: any) {
    this.LOGGER.info('Connected to ' + this.URL);

    // if connected, subscribe topics
    for (const mqttFe2Mapping of this.MQTT_FE2_MAPPING) {
      this.LOGGER.info(
        `Subscribe to mqttDeviceId ${mqttFe2Mapping.mqttDeviceId}`
      );

      this.CLIENT.subscribe(
        'v3/' +
          this.USER_NAME +
          '/devices/' +
          mqttFe2Mapping.mqttDeviceId +
          '/location/solved',
        err => {
          if (err) {
            this.error(err);
          }
        }
      );
    }
  }

  /**
   * Received payload from topic with location
   *
   * @param topic Topic
   * @param payload Payload with location data
   */
  private receivedLocation(topic: string, payload: any) {
    const mqttLocationDto: MqttLocationDto = JSON.parse(payload);

    const filteredMqttFe2MappingList: MqttFe2Mapping[] =
      this.MQTT_FE2_MAPPING.filter(
        mapping =>
          mapping.mqttDeviceId == mqttLocationDto.end_device_ids.device_id
      );

    // iterate all fe2 vehicles
    for (const mpttFe2Mapping of filteredMqttFe2MappingList) {
      // call the callback
      for (const callback of this.DEVICE_UPDATE_CALLBACK_LIST) {
        callback(
          mpttFe2Mapping,
          mqttLocationDto.location_solved.location.latitude,
          mqttLocationDto.location_solved.location.longitude,
          mqttLocationDto.location_solved.location.altitude,
          mqttLocationDto.received_at
        );
      }
    }
  }

  /**
   * Register for device location change updates
   * 
   * @param callback Callback that will be called if a device changed location
   */
  public registerForDeviceLocationChangeUpdates(
    callback: (
      mqttFe2Mapping: MqttFe2Mapping,
      latitude: number,
      longitude: number,
      altitude: number,
      receivedAt: string
    ) => void
  ) {
    this.DEVICE_UPDATE_CALLBACK_LIST.push(callback);
  }

  /**
   * Handle mqtt error
   *
   * @param error Mqtt error
   */
  private error(error: any) {
    this.LOGGER.error(error);
  }
}
