import type { RoomDataType } from "./RoomDataType";

export interface RoomDetail {
  id: number;
  roomNumber: string;
  roomTypeId: number;
  roomType: string;
  dataTypes: RoomDataType[];
}