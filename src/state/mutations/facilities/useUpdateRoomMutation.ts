import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRoom } from '@/apis/facilities/rooms';
import type { UpdateRoomRequest } from '@/types/facilities/UpdateRoomRequest';

export const useUpdateRoomMutation = (roomId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateRoomRequest) => updateRoom(roomId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['roomDetail', roomId] });
    },
  });
};