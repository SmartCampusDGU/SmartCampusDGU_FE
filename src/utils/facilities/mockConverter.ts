import { mockSpaces } from '@/mocks/facilities/spaces';
import type { RoomListItem } from '@/types/facilities/RoomListItem';
import type { RoomDataType } from '@/types/facilities/RoomDataType';

const ROOM_TYPE_ID_MAP: Record<string, number> = {
  강의실: 1,
  실험실: 2,
};

const TAG_TO_ROOM_DATA_TYPE: Record<
  'temperature' | 'humidity' | 'co2' | 'tvoc',
  Omit<RoomDataType, 'id' | 'dataTypeId' | 'isModified'>
> = {
  temperature: {
    name: '온도',
    unit: '℃',
    cautionMin: 0,
    cautionMax: 36,
    dangerMin: 36,
    dangerMax: 38,
    emergencyMin: 38,
    emergencyMax: 50,
  },
  humidity: {
    name: '습도',
    unit: '%',
    cautionMin: 0,
    cautionMax: 60,
    dangerMin: 60,
    dangerMax: 80,
    emergencyMin: 80,
    emergencyMax: 100,
  },
  co2: {
    name: 'CO₂',
    unit: 'ppm',
    cautionMin: 800,
    cautionMax: 1200,
    dangerMin: 1200,
    dangerMax: 2000,
    emergencyMin: 2000,
    emergencyMax: 5000,
  },
  tvoc: {
    name: 'TVOC',
    unit: 'ppb',
    cautionMin: 100,
    cautionMax: 200,
    dangerMin: 200,
    dangerMax: 300,
    emergencyMin: 300,
    emergencyMax: 500,
  },
};

export const convertMockSpacesToRoomListItems = (): RoomListItem[] => {
  return mockSpaces.map((mock): RoomListItem => ({
    id: parseInt(mock.id, 10),
    roomNumber: mock.roomNo,
    roomType: mock.type,
    roomTypeId: ROOM_TYPE_ID_MAP[mock.type] ?? 0,
    dataTypes: mock.tags.map((tag, idx) => ({
      id: idx + 1,
      dataTypeId: idx + 1,
      isModified: true,
      ...(TAG_TO_ROOM_DATA_TYPE[tag] ?? {
        name: '기타',
        unit: '',
        cautionMin: 0,
        cautionMax: 0,
        dangerMin: 0,
        dangerMax: 0,
        emergencyMin: 0,
        emergencyMax: 0,
      }),
    })),
  }));
};