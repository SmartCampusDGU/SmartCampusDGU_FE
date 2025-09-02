import type { PageResponse } from "../common/PageResponse";
import type { RoomListItem } from "./RoomListItem";

export interface GetRoomsResponse {
  page: PageResponse;
  rooms: RoomListItem[];
}