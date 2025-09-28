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

/**
 * 이상치 통계 보고서 미리보기 Blob 요청
 */
export const fetchOutlierReportPreview = async (params: {
  startDate: string;
  endDate: string;
}): Promise<{ objectUrl: string; filename: string }> => {
  const response = await axiosInstance.get<Blob>(
    "/api/outliers/report",
    {
      params,
      responseType: "blob",
    }
  );

  // Content-Disposition 헤더에서 파일명 추출
  const disposition = response.headers["content-disposition"];
  const match = disposition?.match(/filename="?(.+?)"?$/);
  const filename = match?.[1] ?? "report.docx";

  const objectUrl = URL.createObjectURL(response.data);

  return { objectUrl, filename };
};