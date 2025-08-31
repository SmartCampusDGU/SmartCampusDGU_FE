import type { RoomTypeItem } from "./RoomTypeItemType";

export interface GetRoomTypesResponseData {
  code: number;
  message: string;
  data: RoomTypeItem[];
}