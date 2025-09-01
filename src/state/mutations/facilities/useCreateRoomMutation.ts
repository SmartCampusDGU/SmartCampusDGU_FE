import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRoom } from '@/apis/facilities/rooms';
import type { CreateRoomRequest } from '@/types/facilities/CreateRoomRequest';

export const useCreateRoomMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoomRequest) => createRoom(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] }); 
    },
  });
};