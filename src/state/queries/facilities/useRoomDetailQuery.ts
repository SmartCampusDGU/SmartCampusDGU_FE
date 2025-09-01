import { useQuery } from '@tanstack/react-query';
import { getRoomDetail } from '@/apis/facilities/rooms';
import type { RoomDetail } from '@/types/facilities/RoomDetail';
import type { RoomApiResponse } from '@/types/facilities/RoomApiResponse';

export const useRoomDetailQuery = (roomId: number) => {
  return useQuery<RoomApiResponse<RoomDetail>>({
    queryKey: ['roomDetail', roomId],
    queryFn: () => getRoomDetail(roomId),
    enabled: !!roomId, 
    staleTime: 1000 * 60, 
  });
};