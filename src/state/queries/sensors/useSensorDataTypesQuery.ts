import { useQuery } from '@tanstack/react-query';
import type { SensorDataType } from '@/types/sensors/SensorDataType';
import { getSensorDataTypes } from '@/apis/sensors/sensors';
import type { GetSensorDataTypesResponse } from '@/types/sensors/GetSensorDataTypesResponse';
import { useTranslation } from 'react-i18next';

export const SENSOR_DATA_TYPES_QUERY_KEY = ['sensorDataTypes'];

type TranslatedSensorDataType = SensorDataType; 
type TranslatedResponse = Omit<GetSensorDataTypesResponse, 'data'> & { data: TranslatedSensorDataType[] };

export const useSensorDataTypesQuery = () => {
  const { t } = useTranslation();
  return useQuery<GetSensorDataTypesResponse>({
    queryKey: SENSOR_DATA_TYPES_QUERY_KEY,
    queryFn: async () => {
      const res = await getSensorDataTypes();
      return res;
    },
    staleTime: 1000 * 60, 
    select: (data) => {
      const transformedData = data.data.map((item) => ({
        ...item,
        name: t(item.name), 
      }));
      return {
        ...data,
        data: transformedData,
      } as TranslatedResponse;
    },
  });
};