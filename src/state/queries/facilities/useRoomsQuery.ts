import { useQuery } from '@tanstack/react-query';
import { getRooms } from '@/apis/facilities/rooms';
import type { GetRoomsRequest } from '@/types/facilities/GetRoomsRequest';
import type { GetRoomsResponse } from '@/types/facilities/GetRoomResponse';
import { convertMockSpacesToRoomListItems } from '@/utils/facilities/mockConverter';

export const ROOMS_QUERY_KEY = ["rooms"];

export const useRoomsQuery = ({ roomTypeId, page = 0, size = 20, }: GetRoomsRequest = {}) => {
  return useQuery<GetRoomsResponse>({
   queryKey: [...ROOMS_QUERY_KEY, roomTypeId ?? "all", page, size],
    queryFn: async () => {
      const res = await getRooms(); 
      const rooms = res.data;

      if (!Array.isArray(rooms) || rooms.length === 0) {
        return {
          page: {
            size: 0,
            totalElements: 0,
            currentElements: 0,
            totalPages: 0,
            currentPage: 0,
            hasNextPage: false,
            hasPreviousPage: false,
            isLast: true,
          },
          rooms: convertMockSpacesToRoomListItems(),
        };
      }

      return res.data;
    },
    staleTime: 1000 * 60,
  });
};