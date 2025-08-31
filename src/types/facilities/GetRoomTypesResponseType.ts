import type { RoomTypeItem } from "./RoomTypeItemType";

export interface GetRoomTypesResponse {
  code: number;
  message: string;
  data: RoomTypeItem[];
}