// src/state/mutations/sensors/useDeleteSensorMutation.ts
import { useMutation } from '@tanstack/react-query';
import { deleteSensor } from '@/apis/sensors/sensors';
import type { DeleteSensorRequestBody } from '@/types/sensors/DeleteSensorRequest';
import type { DeleteSensorResponse } from '@/types/sensors/DeleteSensorResponse';

export function useDeleteSensorMutation(options?: {
  onSuccess?: (data: DeleteSensorResponse) => void;
  onError?: (err: unknown) => void;
}) {
  return useMutation({
    mutationFn: (body: DeleteSensorRequestBody) => deleteSensor(body),
    ...options,
  });
}
