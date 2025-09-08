export interface OutlierLog {
  id: number;
  value: number;
  level: 'SAFE' | 'CAUTION' | 'DANGER' | 'EMERGENCY';
  actionStatus: 'NONE' | 'IN_PROGRESS' | 'DONE';
  checkStatus: 'PENDING' | 'CONFIRMED';
  createdAt: string;
  sensorInfo: {
    id: number;
    macAddress: string;
  };
  roomInfo: {
    id: number;
    roomNumber: string;
    roomTypeName: string;
  };
  dataTypeInfo: {
    id: number;
    name: string;
    unit: string;
  };
}