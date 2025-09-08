/** 센서 삭제 요청 (path + body) */
export interface DeleteSensorPath {
  sensorId: number; // URL 경로 파라미터
}

export interface DeleteSensorBody {
  deleteReason: string; // 삭제 사유
}
