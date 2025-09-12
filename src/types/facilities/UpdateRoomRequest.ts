import type { CreateRoomDataType } from "./CreateRoomDataType";

export interface UpdateRoomRequest {
  roomNumber: string;
  roomTypeId: number;
  dataTypes: CreateRoomDataType[];
}