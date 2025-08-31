import type { RoomTypeSensorThresholdData } from "./RoomTypeSensorThresholdType";

export interface RoomTypeSensorData {
  name: string;
  useDefault: boolean;
  unit: string;
  thresholds: {
    주의: RoomTypeSensorThresholdData;
    위험: RoomTypeSensorThresholdData;
    응급: RoomTypeSensorThresholdData;
  };
}