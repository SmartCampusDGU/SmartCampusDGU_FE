import { axiosInstance } from '../axios';
import type { GetOutlierReportRequest } from '@/types/documents/GetOutlierReportRequest';
import type { GetOutlierReportResponse } from '@/types/documents/GetOutlierReportResponse';
import { getFilenameFromContentDisposition } from '@/utils/documents/getFilenameFromContentDisposition';

/**
 * 이상치 통계 보고서 다운로드
 */
export const getOutlierReport = async (
  params: GetOutlierReportRequest
): Promise<GetOutlierReportResponse> => {
  const response = await axiosInstance.get<Blob>('/api/outliers/report', {
    params,
    responseType: 'blob',
  });

  const disposition = response.headers['content-disposition'] ?? null;
  const filename = getFilenameFromContentDisposition(disposition) ?? 'outlier-report.docx';

  return {
    blob: response.data,
    filename,
  };
};