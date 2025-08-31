import type { RoomSensorThresholdData } from "./RoomSensorThresholdType";

export interface RoomSensorData {
  name: string;
  useDefault: boolean;
  unit: string;
  thresholds: {
    주의: RoomSensorThresholdData;
    위험: RoomSensorThresholdData;
    응급: RoomSensorThresholdData;
  };
}