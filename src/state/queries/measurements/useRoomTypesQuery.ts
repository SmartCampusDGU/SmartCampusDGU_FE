import { useQuery } from "@tanstack/react-query";
import { getRoomTypes } from "@/apis/measurements/roomTypes";
import type { GetRoomTypesResponse } from "@/types/measurements/GetRoomTypesResponse";

export const ROOM_TYPES_QUERY_KEY = ["roomTypes"];

export const useRoomTypesQuery = () => {
  return useQuery({
    queryKey: [...ROOM_TYPES_QUERY_KEY],
    queryFn: async () => {
      const res: GetRoomTypesResponse = await getRoomTypes();
      return res.data;
    },
    staleTime: 1000 * 60,
  });
};