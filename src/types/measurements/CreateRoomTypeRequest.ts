export interface CreateRoomTypeRequest {
  name: string;
  description: string;
  dataTypes: Array<{
    id: number; 
    cautionMin: number;
    cautionMax: number;
    dangerMin: number;
    dangerMax: number;
    emergencyMin: number;
    emergencyMax: number;
  }>;
}