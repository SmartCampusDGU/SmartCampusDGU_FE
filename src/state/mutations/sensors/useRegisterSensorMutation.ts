import { useMutation } from '@tanstack/react-query';
import { registerSensor } from '@/api/sensors';
import type { RegisterSensorRequest } from '@/types/sensors/RegisterSensorRequest';
import type { RegisterSensorResponse } from '@/types/sensors/RegisterSensorResponse';

export function useRegisterSensorMutation(options?: {
  onSuccess?: (data: RegisterSensorResponse) => void;
  onError?: (err: unknown) => void;
}) {
  return useMutation({
    mutationFn: (payload: RegisterSensorRequest) => registerSensor(payload),
    ...options,
  });
}
