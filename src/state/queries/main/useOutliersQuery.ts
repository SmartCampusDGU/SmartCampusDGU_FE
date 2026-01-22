import { useQuery } from "@tanstack/react-query";
import { getOutliers } from "@/apis/main/outliers";
import type { OutlierLog } from "@/types/main/OutlierLog";
import type { GetOutliersRequest } from "@/types/main/GetOutliersRequest";
import type { GetOutliersResponse } from "@/types/main/GetOutliersResponse";
import type { PageResponse } from "@/types/common/PageResponse";
import { useTranslation } from 'react-i18next';

export const OUTLIERS_QUERY_KEY = ["outliers"];

interface UseOutliersQueryParams {
  searchRequest?: GetOutliersRequest;
}

// 위험 정도, 조치 여부 우선순위 설정
const levelPriority: Record<OutlierLog["level"], number> = {
  EMERGENCY: 0,
  DANGER: 1,
  CAUTION: 2,
  SAFE: 3,
};

const checkStatusPriority: Record<OutlierLog["checkStatus"], number> = {
  UNCONFIRMED: 0,
  CONFIRMED: 1,
};

type TranslatedOutlierLog = OutlierLog;
interface OutliersQueryData {
  page: PageResponse | null;
  outlierLogs: OutlierLog[];
}
type TranslatedOutliersQueryData = Omit<OutliersQueryData, 'outlierLogs'> & {
  outlierLogs: TranslatedOutlierLog[];
};

export const useOutliersQuery = ({ searchRequest }: UseOutliersQueryParams = {}) => {
  const { t } = useTranslation();
  return useQuery({
    queryKey: [...OUTLIERS_QUERY_KEY, searchRequest],
    queryFn: async () => {
      const size = 100; // 한번에 가져올 수 있는 최대 크기로 설정
      let page = 0;
      let isLast = false;
      let allLogs: OutlierLog[] = [];
      let finalPageInfo = null;

      while (!isLast) {
        const res: GetOutliersResponse = await getOutliers(page, size, searchRequest);
        const { outlierLogs, page: pageInfo } = res.data;

        if (Array.isArray(outlierLogs)) {
          allLogs = allLogs.concat(outlierLogs);
        }

        isLast = pageInfo.isLast;
        finalPageInfo = pageInfo;
        page++;
      }

      // 클라이언트 정렬: level > checkStatus > createdAt
      const sortedLogs = [...allLogs].sort((a, b) => {
        const levelDiff = levelPriority[a.level] - levelPriority[b.level];
        if (levelDiff !== 0) return levelDiff;

        const checkDiff = checkStatusPriority[a.checkStatus] - checkStatusPriority[b.checkStatus];
        if (checkDiff !== 0) return checkDiff;

        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(); // 오래된 순
      });

      return {
        page: finalPageInfo,
        outlierLogs: sortedLogs,
      };
    },
    staleTime: 1000 * 60,

    select: (data) => {
      const transformedLogs = data.outlierLogs.map((log) => ({
        ...log,
        dataTypeInfo: {
          ...log.dataTypeInfo,
          name: t(log.dataTypeInfo.name),
        },
      }));

      return {
        ...data,
        outlierLogs: transformedLogs,
      } as TranslatedOutliersQueryData;
    },
  });
};