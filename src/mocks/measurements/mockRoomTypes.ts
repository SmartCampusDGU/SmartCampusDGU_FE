import type { RoomTypeItem } from "@/types/measurements/RoomTypeItem";

export const mockRoomTypes: RoomTypeItem[] = [
  {
    id: 1,
    name: "강의실",
    description: "강의 공간",
    dataTypes: [
      {
        id: 101,
        dataTypeId: 1,
        name: "온도",
        unit: "℃",
        cautionMin: 18,
        cautionMax: 26,
        dangerMin: 15,
        dangerMax: 30,
        emergencyMin: 10,
        emergencyMax: 35,
      },
      {
        id: 102,
        dataTypeId: 2,
        name: "습도",
        unit: "%",
        cautionMin: 30,
        cautionMax: 60,
        dangerMin: 20,
        dangerMax: 70,
        emergencyMin: 10,
        emergencyMax: 80,
      },
    ],
  },
  {
    id: 2,
    name: "연구실",
    description: "실험/연구 공간",
    dataTypes: [
      {
        id: 201,
        dataTypeId: 3,
        name: "TVOC",
        unit: "ppb",
        cautionMin: 0,
        cautionMax: 300,
        dangerMin: 301,
        dangerMax: 600,
        emergencyMin: 601,
        emergencyMax: 1000,
      },
    ],
  },
];