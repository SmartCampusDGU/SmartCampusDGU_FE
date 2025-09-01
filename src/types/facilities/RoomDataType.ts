export interface RoomDataType {
  id: number;
  dataTypeId: number;
  name: string;
  unit: string;
  cautionMin: number;
  cautionMax: number;
  dangerMin: number;
  dangerMax: number;
  emergencyMin: number;
  emergencyMax: number;
  isModified: boolean;
}