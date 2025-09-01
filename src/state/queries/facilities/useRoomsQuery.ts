import { useQuery } from '@tanstack/react-query';
import { getRooms } from '@/apis/facilities/rooms';
import type { RoomListItem } from '@/types/facilities/RoomListItem';
import { convertMockSpacesToRoomListItems } from '@/utils/facilities/mockConverter';

export const useRoomsQuery = () => {
  return useQuery<RoomListItem[]>({
    queryKey: ['rooms'],
    queryFn: async () => {
      const res = await getRooms(); 
      const rooms = res.data;
      if (!rooms || rooms.length === 0) {
        return convertMockSpacesToRoomListItems();
      }
      return rooms;
    },
    staleTime: 1000 * 60,
  });
};