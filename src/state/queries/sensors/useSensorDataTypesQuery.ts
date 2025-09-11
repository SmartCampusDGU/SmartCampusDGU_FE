import { useQuery } from '@tanstack/react-query';
import { getSensorDataTypes } from '@/apis/sensors/sensors';
import type { GetSensorDataTypesResponse } from '@/types/sensors/GetSensorDataTypesResponse';

export const SENSOR_DATA_TYPES_QUERY_KEY = ['sensorDataTypes'];

export const useSensorDataTypesQuery = () => {
  return useQuery<GetSensorDataTypesResponse>({
    queryKey: SENSOR_DATA_TYPES_QUERY_KEY,
    queryFn: async () => {
      const res = await getSensorDataTypes();
      return res;
    },
    staleTime: 1000 * 60, 
  });
};