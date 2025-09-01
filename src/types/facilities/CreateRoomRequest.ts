import type { CreateRoomDataType } from "./CreateRoomDataType";

export interface CreateRoomRequest {
  roomNumber: string;
  roomTypeId: number;
  dataTypes: CreateRoomDataType[];
}