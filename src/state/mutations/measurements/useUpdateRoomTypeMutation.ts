import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRoomType } from "@/apis/measurements/roomTypes";
import type { CreateRoomTypeRequest } from "@/types/measurements/CreateRoomTypeRequest";
import { ROOM_TYPES_QUERY_KEY } from "@/state/queries/measurements/useRoomTypesQuery";

export const useUpdateRoomTypeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roomTypeId, data }: { roomTypeId: number; data: CreateRoomTypeRequest }) =>
      updateRoomType(roomTypeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROOM_TYPES_QUERY_KEY });
    },
  });
};