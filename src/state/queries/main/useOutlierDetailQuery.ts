import { useQuery } from "@tanstack/react-query";
import { getOutlierDetail } from "@/apis/main/outliers";
import type { GetOutlierDetailResponse } from "@/types/main/GetOutlierDetailResponse";

export const OUTLIER_DETAIL_QUERY_KEY = ["outlierDetail"];

export const useOutlierDetailQuery = (outlierLogId: number) => {
  return useQuery({
    queryKey: [...OUTLIER_DETAIL_QUERY_KEY, outlierLogId],
    queryFn: async () => {
      const res: GetOutlierDetailResponse = await getOutlierDetail(outlierLogId);
      return res.data;
    },
    enabled: !!outlierLogId, // ID 없을 때는 호출하지 않음
    staleTime: 1000 * 60,
  });
};