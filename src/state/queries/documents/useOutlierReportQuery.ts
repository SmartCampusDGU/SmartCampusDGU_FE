import { useQuery } from "@tanstack/react-query";
import { getOutlierReport } from "@/apis/documents/documents";
import type { GetOutlierReportRequest } from "@/types/documents/GetOutlierReportRequest";
import type { GetOutlierReportResponse } from "@/types/documents/GetOutlierReportResponse";

export const OUTLIER_REPORT_QUERY_KEY = ["outlierReport"];

interface UseOutlierReportQueryParams {
  searchRequest: GetOutlierReportRequest;
  enabled?: boolean;
}

export const useOutlierReportQuery = ({
  searchRequest,
  enabled = true,
}: UseOutlierReportQueryParams) => {
  return useQuery<GetOutlierReportResponse>({
    queryKey: [...OUTLIER_REPORT_QUERY_KEY, searchRequest],
    queryFn: () => getOutlierReport(searchRequest),
    staleTime: 1000 * 60 * 5, // 5분 캐싱
    enabled: !!searchRequest && enabled, // 조건부 쿼리 실행
  });
};