export interface RoomMeasurementData {
  name: string;
  unit: string;
  thresholds: {
    [key: string]: number[];
  };
}