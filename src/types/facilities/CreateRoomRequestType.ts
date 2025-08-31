import type { RoomSensorData } from "./RoomSensorType";

export interface CreateRoomRequestData {
  roomNumber: string;
  roomType: string;
  sensors: RoomSensorData[];
}