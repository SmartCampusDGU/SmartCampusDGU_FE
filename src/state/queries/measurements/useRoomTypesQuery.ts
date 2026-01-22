import { useQuery } from "@tanstack/react-query";
import { getRoomTypes } from "@/apis/measurements/roomTypes";
import type { GetRoomTypesResponse } from "@/types/measurements/GetRoomTypesResponse";
import type { RoomTypeItem } from "@/types/measurements/RoomTypeItem";
import type { RoomTypeDataType } from "@/types/measurements/RoomTypeDataType";
import { useTranslation } from 'react-i18next';

type TranslatedRoomTypeDataType = RoomTypeDataType; 
type TranslatedRoomTypeItem = Omit<RoomTypeItem, 'dataTypes'> & { 
  dataTypes: TranslatedRoomTypeDataType[] 
};
type TranslatedRoomTypesData = Omit<GetRoomTypesResponse['data'], 'roomTypes'> & {
  roomTypes: TranslatedRoomTypeItem[]
};
type TranslatedGetRoomTypesResponse = Omit<GetRoomTypesResponse, 'data'> & { 
  data: TranslatedRoomTypesData 
};

export const ROOM_TYPES_QUERY_KEY = ["roomTypes"];

export const useRoomTypesQuery = (page = 0, size = 20) => {

  const { t } = useTranslation('sensorDataTypes'); 

  return useQuery<GetRoomTypesResponse, Error, TranslatedGetRoomTypesResponse>({
    queryKey: [...ROOM_TYPES_QUERY_KEY, page, size],
    
    queryFn: async () => {
      const res = await getRoomTypes(page, size);
      return res; 
    },
    
    staleTime: 1000 * 60,

    select: (res) => {
      const transformedRoomTypes = res.data.roomTypes.map((roomType) => ({
        ...roomType,
        dataTypes: roomType.dataTypes.map((dataType) => ({
          ...dataType,
          name: t(dataType.name), 
        })),
      }));
      
      return {
        ...res,
        data: {
          ...res.data,
          roomTypes: transformedRoomTypes as TranslatedRoomTypeItem[],
        },
      } as TranslatedGetRoomTypesResponse;
    },
  });
};