import type { OutlierLog } from "@/types/main/OutlierLog";

/** UI에서 AlertsTable에 필요한 뷰 모델 */
export interface AlertRowView {
  id: number;
  severity: "emergency" | "warning" | "caution";
  action: "none" | "planned" | "in-progress" | "done";
  occurredAt: string;
  location: string;
  anomaly: string;
  duration: string;
  actor?: string;
}

/** OutlierLog -> AlertRowView 변환 */
export const toAlertRowView = (log: OutlierLog): AlertRowView | null => {
  if (log.level === "SAFE") return null; // SAFE는 제외
  // level ->  severity 매핑
  const severity =
    log.level === "EMERGENCY"
      ? "emergency"
      : log.level === "DANGER"
      ? "warning"
      : "caution";

  // actionStatus -> action 매핑
  const action =
    log.actionStatus === "NONE"
      ? "none"
      : log.actionStatus === "PLANNED"
      ? "planned"
      : log.actionStatus === "IN_PROGRESS"
      ? "in-progress"
      : "done";

  // 발생 시간 (createdAt -> 'MM/DD HH:mm')
  const occurredAt = new Date(log.createdAt).toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  // 위치
  const location = `${log.roomInfo.roomNumber}`;

  // 이상 항목 (데이터 타입 이름 + 값)
  const anomaly = `${log.dataTypeInfo.name} (${log.value}${log.dataTypeInfo.unit})`;

  // 지속 시간 (현재 - createdAt)
  const diffMs = Date.now() - new Date(log.createdAt).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const duration =
    diffMin < 60 ? `${diffMin}분 경과` : `${Math.floor(diffMin / 60)}시간 ${diffMin % 60}분`;

  return {
    id: log.id,
    severity,
    action,
    occurredAt,
    location,
    anomaly,
    duration,
    actor: log.member?.name,
  };
};