import { useQuery } from "@tanstack/react-query";
import { getOutliers } from "@/apis/main/outliers";
import type { GetOutliersRequest } from "@/types/main/GetOutliersRequest";
import type { GetOutliersResponse } from "@/types/main/GetOutliersResponse";
import { alertMockData } from "@/mocks/main/alerts";

export const OUTLIERS_QUERY_KEY = ["outliers"];

interface UseOutliersQueryParams {
  page?: number;
  size?: number;
  searchRequest?: GetOutliersRequest; 
}

export const useOutliersQuery = ({
  page = 0,
  size = 20,
  searchRequest,
}: UseOutliersQueryParams = {}) => {
  // 항상 24시간 범위 계산
  const now = new Date();
  const defaultEndDate = now.toISOString();
  const defaultStartDate = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

  const finalSearchRequest: GetOutliersRequest = {
    ...searchRequest,
    startDate: searchRequest?.startDate ?? defaultStartDate,
    endDate: searchRequest?.endDate ?? defaultEndDate,
  };

  return useQuery({
    queryKey: [...OUTLIERS_QUERY_KEY, page, size, finalSearchRequest],
    queryFn: async () => {
      const res: GetOutliersResponse = await getOutliers(page, size, finalSearchRequest);
      const { outlierLogs } = res.data;

      if (!Array.isArray(outlierLogs) || outlierLogs.length === 0) {
        return {
          page: {
            size: 0,
            totalElements: 0,
            currentElements: 0,
            totalPages: 0,
            currentPage: 0,
            hasNextPage: false,
            hasPreviousPage: false,
            isLast: true,
          },
          outlierLogs: alertMockData,
        };
      }

      return res.data;
    },
    staleTime: 1000 * 60,
  });
};