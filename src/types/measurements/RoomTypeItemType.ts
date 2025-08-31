import type { RoomTypeSensorData } from "./RoomTypeSensorType";

export interface RoomTypeItem {
  id: number;
  roomType: string;
  sensors: RoomTypeSensorData[];
}