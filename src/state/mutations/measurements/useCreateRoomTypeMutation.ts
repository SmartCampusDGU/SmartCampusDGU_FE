import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRoomType } from "@/apis/measurements/roomTypes";
import type { CreateRoomTypeRequest } from "@/types/measurements/CreateRoomTypeRequest";
import { ROOM_TYPES_QUERY_KEY } from "@/state/queries/measurements/useRoomTypesQuery";

export const useCreateRoomTypeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoomTypeRequest) => createRoomType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROOM_TYPES_QUERY_KEY });
    },
  });
};