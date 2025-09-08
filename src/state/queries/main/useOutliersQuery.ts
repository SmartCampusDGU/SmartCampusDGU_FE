import { useQuery } from "@tanstack/react-query";
import { getOutliers } from "@/apis/main/outliers";
import type { GetOutliersResponse } from "@/types/main/GetOutliersResponse";
import { alertMockData } from "@/mocks/main/alerts";

export const OUTLIERS_QUERY_KEY = ["outliers"];

interface UseOutliersQueryParams {
  page?: number;
  size?: number;
  searchRequest?: {
    level?: string;
    checkStatus?: string;
    roomId?: number;
    startDate?: string;
    endDate?: string;
  };
}

export const useOutliersQuery = ({
  page = 0,
  size = 20,
  searchRequest,
}: UseOutliersQueryParams) => {
  return useQuery({
    queryKey: [...OUTLIERS_QUERY_KEY, page, size, searchRequest],
    queryFn: async () => {
      const res: GetOutliersResponse = await getOutliers(page, size, searchRequest);
      const { page: outlierLogs } = res.data;

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