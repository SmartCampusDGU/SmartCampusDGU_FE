export interface DeleteSensorBody {
  roomNumber: string;   
  macAddress: string;   
  deleteReason?: string;
}


export type DeleteSensorPath = Record<string, never>;