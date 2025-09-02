import { useQuery } from "@tanstack/react-query";
import { getRoomTypes } from "@/apis/measurements/roomTypes";
import type { GetRoomTypesResponse } from "@/types/measurements/GetRoomTypesResponse";
import type { RoomTypeItem } from "@/types/measurements/RoomTypeItem";
import { mockRoomTypes } from "@/mocks/measurements/mockRoomTypes";

export const ROOM_TYPES_QUERY_KEY = ["roomTypes"];

export const useRoomTypesQuery = (page = 0, size = 20) => {
  return useQuery<RoomTypeItem[]>({
    queryKey: [...ROOM_TYPES_QUERY_KEY, page, size],
    queryFn: async () => {
      const res: GetRoomTypesResponse = await getRoomTypes(page, size);
      const { roomTypes } = res.data;

      if (!roomTypes || roomTypes.length === 0) {
        return mockRoomTypes;
      }
      return roomTypes;
    },
    staleTime: 1000 * 60,
  });
};