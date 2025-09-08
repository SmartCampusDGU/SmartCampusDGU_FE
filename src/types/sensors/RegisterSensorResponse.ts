/** 센서 등록 응답 */
export interface RegisterSensorResponse {
  code: number;
  message: string;
  data: {
    roomNumber: string;
    macAddress: string;
  };
}
