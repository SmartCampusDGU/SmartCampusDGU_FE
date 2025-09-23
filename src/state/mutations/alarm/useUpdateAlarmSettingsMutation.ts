import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAlarmSettings } from '@/apis/alarm/alarm';
import { ALARM_SETTINGS_QK } from '@/state/queries/alarm/useAlarmSettingsQuery';
import type { UpdateAlarmSettingsRequest } from '@/types/alarm/AlarmSettings';

export const useUpdateAlarmSettingsMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateAlarmSettingsRequest) => updateAlarmSettings(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ALARM_SETTINGS_QK });
    },
  });
};
