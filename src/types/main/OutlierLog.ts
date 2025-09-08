export type OutlierLevel = "SAFE" | "CAUTION" | "DANGER" | "EMERGENCY";
export type ActionStatus = "NONE" | "PLANNED" | "IN_PROGRESS" | "COMPLETED";
export type CheckStatus = "CONFIRMED" | "UNCONFIRMED";
export type Role = "USER" | "ADMIN";

export interface OutlierLog {
  id: number;
  value: number;
  level: OutlierLevel;
  actionStatus: ActionStatus;
  checkStatus: CheckStatus;
  createdAt: string;

  /** 조치자 */
  member?: {
    id: number;
    name: string;
    role: Role;
  };

  /** 센서 요약 */
  sensorInfo: {
    id: number;
    macAddress: string;
  };

  /** 방 요약 */
  roomInfo: {
    id: number;
    roomNumber: string;
    roomTypeName: string;
  };

  /** 측정 데이터 타입 요약 */
  dataTypeInfo: {
    id: number;
    name: string;
    unit: string;
  };
}