import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOutlierStatus } from "@/apis/main/outliers";
import type { UpdateOutlierStatusRequest } from "@/types/main/UpdateOutlierStatusRequest";
import { OUTLIERS_QUERY_KEY } from "@/state/queries/main/useOutliersQuery";
import { OUTLIER_DETAIL_QUERY_KEY } from "@/state/queries/main/useOutlierDetailQuery";

export const useUpdateOutlierStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ outlierLogId, data }: { outlierLogId: number; data: UpdateOutlierStatusRequest }) =>
      updateOutlierStatus(outlierLogId, data),
    onSuccess: (_, variables) => {
      // 목록과 상세 캐시 둘 다 갱신
      queryClient.invalidateQueries({ queryKey: OUTLIERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...OUTLIER_DETAIL_QUERY_KEY, variables.outlierLogId] });
    },
  });
};