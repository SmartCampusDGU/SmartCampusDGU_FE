import type { RoomMeasurementData } from "./RoomMeasurementType";

export interface RoomDetailData {
  roomId: number;
  roomType: string;
  measurements: RoomMeasurementData[];
}