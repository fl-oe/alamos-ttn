import axios from 'axios';
import { MqttFe2Mapping } from 'src/entities/MqttFe2Mapping';
import { Logger } from './Logger';

export class Fe2Helper {
  private LOGGER = Logger.getLogger(Fe2Helper.name);

  private BASE_URL: string = process.env.FE2_BASE_URL;
  private FE2_ACCESS_TOKEN: string = process.env.FE2_ACCESS_TOKEN;

  /**
   * Send location to fe2
   *
   * @param fe2VehicleId Fe2 vehicle id
   * @param latitude Latitude
   * @param longitude  Longitude
   * @param altitude Altitude
   * @param receivedAt Received at timestamp
   */
  public sendLocation(
    mqttFe2Mapping: MqttFe2Mapping,
    latitude: number,
    longitude: number,
    altitude: number,
    receivedAt: string
  ) {
    axios
      .post(this.BASE_URL, {
        authorization: this.FE2_ACCESS_TOKEN,
        address: mqttFe2Mapping.fe2VehicleId,
        timestamp: receivedAt,
        lat: latitude,
        lng: longitude,
        alt: altitude,
        heading: 0
      })
      .catch((err: any) => {
        this.LOGGER.error(err);
      });
  }
}
