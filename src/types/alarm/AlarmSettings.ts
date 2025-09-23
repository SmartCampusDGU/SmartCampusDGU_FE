// GET 응답용
export interface AlarmSettings {
  id: number;
  monitoringDurationMinutes?: number;


  duplicatePreventionMinutes: number; // 조치 후 재알림 주기
  dangerNotificationMinutes: number;  // 위험 단계 재알림 주기
  cautionNotificationMinutes: number; // 경고 단계 재알림 주기
}

// PUT 요청 바디
export interface UpdateAlarmSettingsRequest {
  duplicatePreventionMinutes: number;
  dangerNotificationMinutes: number;
  cautionNotificationMinutes: number;
}

// 공통 envelope
export interface ApiEnvelope<T> {
  code: number;
  message: string;
  data: T;
}
