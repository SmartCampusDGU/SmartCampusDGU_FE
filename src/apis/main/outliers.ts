import { axiosInstance } from '../axios';
import type { GetOutliersResponse } from '@/types/main/GetOutliersResponse';
import type { GetOutliersRequest } from "@/types/main/GetOutliersRequest";
import type { GetOutlierDetailResponse } from '@/types/main/GetOutlierDetailResponse';
import type { UpdateOutlierStatusRequest } from '@/types/main/UpdateOutlierStatusRequest';
import type { UpdateOutlierStatusResponse } from '@/types/main/UpdateOutlierStatusResponse';

/**
 * 이상치 목록 조회
 */
export const getOutliers = async (
  page = 0,
  size = 20,
  searchRequest?: GetOutliersRequest
): Promise<GetOutliersResponse> => {
  const params = { page, size, ...searchRequest };
  const response = await axiosInstance.get<GetOutliersResponse>("outliers", { params });
  return response.data;
};

/**
 * 이상치 상세 조회
 */
export const getOutlierDetail = async (
  outlierLogId: number
): Promise<GetOutlierDetailResponse> => {
  const response = await axiosInstance.get<GetOutlierDetailResponse>(`outliers/${outlierLogId}`);
  return response.data;
};

/**
 * 이상치 상태 업데이트
 */
export const updateOutlierStatus = async (
  outlierLogId: number,
  data: UpdateOutlierStatusRequest
): Promise<UpdateOutlierStatusResponse> => {
  const response = await axiosInstance.patch<UpdateOutlierStatusResponse>(
    `outliers/${outlierLogId}/status`,
    data
  );
  return response.data;
};