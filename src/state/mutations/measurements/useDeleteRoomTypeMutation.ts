import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRoomType } from "@/apis/measurements/roomTypes";
import { ROOM_TYPES_QUERY_KEY } from "@/state/queries/measurements/useRoomTypesQuery";

export const useDeleteRoomTypeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roomTypeId: number) => deleteRoomType(roomTypeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROOM_TYPES_QUERY_KEY });
    },
  });
};