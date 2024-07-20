export class MqttLocationDto {
  end_device_ids: {
    device_id: string;
    application_ids: {
      application_id: string;
    };
    dev_eui: string;
    join_eui: string;
    dev_addr: string;
  };

  correlation_ids: string[];

  received_at: string; // "2024-07-12T07:13:55.789414557Z"
  location_solved: {
    service: string;
    location: {
      latitude: number;
      longitude: number;
      altitude: 297;
      source: string;
    };
  };
}
