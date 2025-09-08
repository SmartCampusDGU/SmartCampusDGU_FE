/** 센서 등록 요청 */
export interface RegisterSensorRequest {
  roomId: number;      // 방 PK
  macAddress: string;  // 센서 MAC
}
