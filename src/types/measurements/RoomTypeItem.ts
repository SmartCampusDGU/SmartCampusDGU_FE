import type { RoomTypeDataType } from "./RoomTypeDataType";

export interface RoomTypeItem {
  id: number;
  name: string;
  description: string;
  dataTypes: RoomTypeDataType[];
}