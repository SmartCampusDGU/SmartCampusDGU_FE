import { axiosInstance } from '../axios';
import type {
  ApiEnvelope,
  AlarmSettings,
  UpdateAlarmSettingsRequest,
} from '@/types/alarm/AlarmSettings';

// 조회
export const getAlarmSettings = async (): Promise<AlarmSettings> => {
  const res = await axiosInstance.get<ApiEnvelope<AlarmSettings>>(
    'outliers/settings'
  );
  return res.data.data;
};

// 업데이트
export const updateAlarmSettings = async (
  payload: UpdateAlarmSettingsRequest
): Promise<AlarmSettings> => {
  const res = await axiosInstance.put<ApiEnvelope<AlarmSettings>>(
    'outliers/settings',
    payload
  );
  return res.data.data;
};
