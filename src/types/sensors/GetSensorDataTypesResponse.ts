import type { SensorDataType } from "./SensorDataType";

export interface GetSensorDataTypesResponse {
  code: number;
  message: string;
  data: SensorDataType[];
}