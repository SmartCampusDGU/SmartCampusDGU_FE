import type { RoomTypeItem } from "./RoomTypeItem";

export interface RoomTypeResponseData {
  code: number;
  message: string;
  data: RoomTypeItem | Record<string, number>; 
}