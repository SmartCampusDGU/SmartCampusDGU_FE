import { useQuery } from '@tanstack/react-query';
import { getRooms } from '@/apis/facilities/rooms';
import type { RoomApiResponse } from '@/types/facilities/RoomApiResponse';
import type { RoomDataType } from '@/types/facilities/RoomDataType';
import type { RoomListItem } from '@/types/facilities/RoomListItem';
import type { GetRoomsRequest } from '@/types/facilities/GetRoomsRequest';
import type { GetRoomsResponse } from '@/types/facilities/GetRoomResponse';
import { useTranslation } from 'react-i18next';

type TranslatedRoomDataType = RoomDataType;
type TranslatedRoomListItem = Omit<RoomListItem, 'dataTypes'> & { dataTypes: TranslatedRoomDataType[] };
export type TranslatedGetRoomsResponse = Omit<GetRoomsResponse, 'rooms'> & { rooms: TranslatedRoomListItem[] };
type TranslatedRoomApiResponse = RoomApiResponse<TranslatedGetRoomsResponse>;

export const ROOMS_QUERY_KEY = ["rooms"];

export const useRoomsQuery = ({ roomType, page = 0, size = 20 }: GetRoomsRequest = {}) => {

  const { t } = useTranslation('sensorDataTypes'); 
  
  return useQuery<RoomApiResponse<GetRoomsResponse>, Error, TranslatedRoomApiResponse>({
    queryKey: [...ROOMS_QUERY_KEY, roomType ?? "all", page, size],
    
    queryFn: async () => {
      const res = await getRooms({ roomType, page, size }); 
      return res; 
    },
    
    staleTime: 1000 * 60,

    select: (apiResponse) => {
      const rooms = apiResponse.data?.rooms || [];
      const transformedRooms = rooms.map((room) => {
        const transformedDataTypes = room.dataTypes.map((dataType) => ({
          ...dataType,
          name: t(dataType.name),
        }));

        return {
          ...room,
          dataTypes: transformedDataTypes as TranslatedRoomDataType[],
        };
      });

      return {
        ...apiResponse,
        data: {
          ...apiResponse.data,
          rooms: transformedRooms,
        },
      } as TranslatedRoomApiResponse;
    },
  });
};