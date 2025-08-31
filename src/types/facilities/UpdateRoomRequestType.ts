import type { RoomMeasurementData } from "./RoomMeasurementType";

export interface UpdateRoomRequestData {
  roomType: string;
  measurements: RoomMeasurementData[];
}