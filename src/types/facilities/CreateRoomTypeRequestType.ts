import type { RoomTypeSensorData } from "./RoomTypeSensorType";

export interface CreateRoomTypeRequestData {
  roomType: string;
  sensors: RoomTypeSensorData[];
}
