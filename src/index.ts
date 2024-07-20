import * as dotenv from 'dotenv';
import { MqttHelper } from './helper/MqttHelper';
import { MqttFe2Mapping } from './entities/MqttFe2Mapping';
import * as fs from 'fs-extra';
import { Fe2Helper } from './helper/Fe2Helper';

dotenv.config();

const main = () => {
  // read device list from file
  const mqttFe2Mapping: MqttFe2Mapping[] = fs.readJsonSync('./deviceList.json');

  // init mqtt helper to listen to ttn
  const mqttHelper: MqttHelper = new MqttHelper(mqttFe2Mapping);
  const fe2Helper: Fe2Helper = new Fe2Helper();

  mqttHelper.registerForDeviceLocationChangeUpdates(
    (mqttFe2Mapping, latitude, longitude, altitude, receivedAt) => {
      console.log(
        mqttFe2Mapping.name,
        latitude,
        longitude,
        altitude,
        receivedAt
      );
      fe2Helper.sendLocation(
        mqttFe2Mapping,
        latitude,
        longitude,
        altitude,
        receivedAt
      );
    }
  );
};

main();
