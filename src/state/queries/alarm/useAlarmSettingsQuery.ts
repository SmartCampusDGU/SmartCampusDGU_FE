import { useQuery } from '@tanstack/react-query';
import { getAlarmSettings } from '@/apis/alarm/alarm';

export const ALARM_SETTINGS_QK = ['alarm-settings'] as const;

export const useAlarmSettingsQuery = () => {
  return useQuery({
    queryKey: ALARM_SETTINGS_QK,
    queryFn: getAlarmSettings,
    staleTime: 60_000,
  });
};
