import { useMutation } from '@tanstack/react-query';
import { deleteSensor } from '@/apis/sensors/sensors';
import type { DeleteSensorBody, DeleteSensorPath } from '@/types/sensors/DeleteSensorRequest';
import type { DeleteSensorResponse } from '@/types/sensors/DeleteSensorResponse';

export function useDeleteSensorMutation(options?: {
  onSuccess?: (data: DeleteSensorResponse) => void;
  onError?: (err: unknown) => void;
}) {
  return useMutation({
    mutationFn: (vars: { path: DeleteSensorPath; body: DeleteSensorBody }) =>
      deleteSensor(vars.path, vars.body),
    ...options,
  });
}
