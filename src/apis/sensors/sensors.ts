import { axiosInstance } from '../axios';

import type { RegisterSensorRequest } from '@/types/sensors/RegisterSensorRequest';
import type { RegisterSensorResponse } from '@/types/sensors/RegisterSensorResponse';
import type { DeleteSensorBody, DeleteSensorPath } from '@/types/sensors/DeleteSensorRequest';
import type { DeleteSensorResponse } from '@/types/sensors/DeleteSensorResponse';

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

/**
 * 센서 삭제 (POST /api/sensors/delete/{sensorId})
 */
export const deleteSensor = async (
  path: DeleteSensorPath,
  body: DeleteSensorBody
): Promise<DeleteSensorResponse> => {
  const { sensorId } = path;
  const res = await axiosInstance.post<DeleteSensorResponse>(
    `/api/sensors/delete/${sensorId}`,
    body,
    { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }
  );
  return res.data;
};
