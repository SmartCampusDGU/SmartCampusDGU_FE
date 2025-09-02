import type { PageResponse } from "../common/PageResponse";
import type { RoomTypeItem } from "./RoomTypeItem";

export interface GetRoomTypesResponse {
  code: number;
  message: string;
  data: {
    page: PageResponse;
    roomTypes: RoomTypeItem[];
  };
}