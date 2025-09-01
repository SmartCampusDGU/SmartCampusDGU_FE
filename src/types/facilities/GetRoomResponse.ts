import type { PageInfo } from "./PageInfo";
import type { RoomListItem } from "./RoomListItem";

export interface GetRoomsResponse {
  page: PageInfo;
  rooms: RoomListItem[];
}