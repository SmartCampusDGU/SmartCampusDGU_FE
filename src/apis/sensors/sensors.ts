import { axiosInstance } from '../axios';

import type { RegisterSensorRequest } from '@/types/sensors/RegisterSensorRequest';
import type { RegisterSensorResponse } from '@/types/sensors/RegisterSensorResponse';
import type { DeleteSensorBody, DeleteSensorPath } from '@/types/sensors/DeleteSensorRequest';
import type { DeleteSensorResponse } from '@/types/sensors/DeleteSensorResponse';
import type { GetSensorDataTypesResponse } from '@/types/sensors/GetSensorDataTypesResponse';

/**
 * 센서 등록 (POST /api/sensors)
 */
export const registerSensor = async (
  payload: RegisterSensorRequest
): Promise<RegisterSensorResponse> => {
  const res = await axiosInstance.post<RegisterSensorResponse>('/api/sensors', payload, {
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
  });
  return res.data;
};

/** 센서 삭제 (POST /api/sensors/delete)  ← 경로/시그니처 수정 */
export const deleteSensor = async (
  body: DeleteSensorRequestBody
): Promise<DeleteSensorResponse> => {
  const res = await axiosInstance.post<DeleteSensorResponse>(
    '/api/sensors/delete',
    body,
    { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }
  );
  return res.data;
};

/** 센서 데이터 타입 목록 (GET /api/sensors/data-types) */
export const getSensorDataTypes = async (): Promise<GetSensorDataTypesResponse> => {
  const res = await axiosInstance.get<GetSensorDataTypesResponse>('/api/sensors/data-types', {
    headers: { Accept: 'application/json;charset=UTF-8' },
  });
  return res.data;
};