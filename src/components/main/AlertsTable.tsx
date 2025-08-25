import React from 'react';
import ActionStatusSelect from './ActionStatusSelect';

/** 데이터 타입 */
export type Severity = 'emergency' | 'warning' | 'caution'; // 응급/위험/주의
export type ActionStatus = 'none' | 'planned' | 'in-progress' | 'done';// 미조치/조치 예정/조치 중/조치 완료

export interface AlertRow {
  id: string;
  severity: Severity;
  action: ActionStatus;
  occurredAt: string;   // '07/08 13:51' 형식 등
  location: string;     // '3101호'
  anomaly: string;      // 'CO2 초과'
  duration: string;     // '30분 경과'
  actor?: string;      // 조치자명
}

/** 색상/텍스트 매핑 */
// const SEVERITY_TEXT: Record<Severity, string> = {
//   emergency: '응급',
//   warning: '위험',
//   caution: '주의',
// };
// const SEVERITY_DOT: Record<Severity, string> = {
//   emergency: 'bg-[#E53935]',
//   warning: 'bg-[#FB8C00]',
//   caution: 'bg-[#FBC02D]',
// };

/** 작은 구성요소들 */
function SeverityCell({ severity }: { severity: Severity }) {
  const fill =
    severity === 'emergency' ? '#E53935'
    : severity === 'warning' ? '#FB8C00'
    : '#FBC02D'; // caution

  const label =
    severity === 'emergency' ? '응급'
    : severity === 'warning' ? '위험'
    : '주의';

  return (
    <div className="flex items-center justify-center">
      <svg width="12" height="12" viewBox="0 0 12 12" className="shrink-0 block">
        <circle cx="6" cy="6" r="6" fill={fill} />
      </svg>
      <span className="ml-[10px] text-[13px]">{label}</span>
    </div>
  );
}

/** 메인 테이블 */
export function AlertsTable({
  rows,
  onChangeAction,
}: {
  rows: AlertRow[];
  onChangeAction?: (id: string, action: ActionStatus) => void;
}) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-[920px] w-full border-collapse border border-[#ACACAC] bg-white">
        <thead className="sticky top-0 bg-[#F6F6F6] text-[13px]">
          <tr>
            <Th>위험 등급</Th>
            <Th>조치 여부</Th>
            <Th>발생 시간</Th>
            <Th>발생 위치</Th>
            <Th>이상 항목</Th>
            <Th>지속 시간</Th>
            <Th>조치 시행자</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-[#E5E5E5]">
              <Td><SeverityCell severity={r.severity} /></Td>
              <Td className="p-0">
                <ActionStatusSelect
                  value={r.action}
                  onChange={(a) => onChangeAction?.(r.id, a)}
                />
              </Td>
              <Td>{r.occurredAt}</Td>
              <Td>{r.location}</Td>
              <Td className="truncate max-w-[180px]">{r.anomaly}</Td>
              <Td>{r.duration}</Td>
              <Td>{r.actor ?? ''}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** 공용 셀 */
function Th({
  className,
  children,
  ...rest
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={['h-[40px] px-3 text-center font-medium bg-[#F6F6F6] border border-[#ACACAC]', className]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </th>
  );
}

function Td({
  className,
  children,
  ...rest
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={['h-[44px] px-3 text-[13px] text-center align-middle border border-[#ACACAC]', className]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </td>
  );
}