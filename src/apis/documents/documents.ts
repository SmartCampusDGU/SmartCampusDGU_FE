import { axiosInstance } from '../axios';
import type { GetOutlierReportRequest } from '@/types/documents/GetOutlierReportRequest';
import type { GetOutlierReportResponse } from '@/types/documents/GetOutlierReportResponse';

/**
 * 이상치 통계 보고서 다운로드
 */
export const getOutlierReport = async (
  params: GetOutlierReportRequest
): Promise<string> => {
  const response = await axiosInstance.get<GetOutlierReportResponse>(
    '/api/outliers/report',
    {
      params,
    }
  );

  return response.data;
};