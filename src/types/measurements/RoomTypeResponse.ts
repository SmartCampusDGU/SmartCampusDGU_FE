import type { RoomTypeItem } from "./RoomTypeItem";

/**
 * PUT, POST 응답에서 data에 RoomTypeItem이 올 수 있음
 */
export interface RoomTypeResponseData {
  code: number;
  message: string;
  data: RoomTypeItem | Record<string, number>; 
  // POST 응답은 { additionalProp: number }, 
  // PUT 응답은 RoomTypeItem 구조
}