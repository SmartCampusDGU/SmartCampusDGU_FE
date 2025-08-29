import { useState } from 'react';
import { useSetPageTitle } from '@/hooks/common/useSetPageTitle';
import { useSetActiveNav } from "@/hooks/common/useSetActiveNav";
import { AlertsTable } from '@/components/main/AlertsTable';
import type { AlertRow } from '@/components/main/AlertsTable';

export default function MainPage() {
  useSetPageTitle("이상치 조회");
  useSetActiveNav("search", "abnormal");
  const [rows, setRows] = useState<AlertRow[]>([
    {
      id: '1',
      severity: 'emergency',
      action: 'none',
      occurredAt: '07/08 13:51',
      location: '3101호',
      anomaly: 'CO2 초과',
      duration: '30분 경과',
      actor: '김대리',
    },
    {
      id: '2',
      severity: 'emergency',
      action: 'in-progress',
      occurredAt: '07/08 12:35',
      location: '3103호',
      anomaly: '온도 상승',
      duration: '1시간 2분',
      actor: '서대리',
    },
    {
      id: '3',
      severity: 'caution',
      action: 'done',
      occurredAt: '07/08 11:50',
      location: '3103호',
      anomaly: '연기 감지',
      duration: '1시간 45분',
      actor: '서대리',
    },
    {
      id: '4',
      severity: 'warning',
      action: 'planned',
      occurredAt: '07/08 14:10',
      location: '2202호',
      anomaly: '습도 급상승',
      duration: '20분 경과',
      actor: '이대리',
    },
    {
      id: '5',
      severity: 'emergency',
      action: 'none',
      occurredAt: '07/08 09:15',
      location: '1305호',
      anomaly: 'CO 농도 초과',
      duration: '4시간 경과',
      actor: '박과장',
    },
    {
      id: '6',
      severity: 'caution',
      action: 'planned',
      occurredAt: '07/07 23:50',
      location: '4101호',
      anomaly: '배터리 전압 저하',
      duration: '12시간 경과',
      actor: '정사원',
    },
    {
      id: '7',
      severity: 'warning',
      action: 'in-progress',
      occurredAt: '07/08 08:20',
      location: '5204호',
      anomaly: '수위 초과',
      duration: '5시간 경과',
      actor: '김차장',
    },
    {
      id: '8',
      severity: 'caution',
      action: 'none',
      occurredAt: '07/08 10:00',
      location: '3102호',
      anomaly: '온도 변동',
      duration: '2시간 경과',
      actor: '홍대리',
    },
    {
      id: '9',
      severity: 'emergency',
      action: 'done',
      occurredAt: '07/08 07:30',
      location: '1101호',
      anomaly: '연기 감지',
      duration: '6시간 경과',
      actor: '최과장',
    },
    {
      id: '10',
      severity: 'warning',
      action: 'none',
      occurredAt: '07/08 15:05',
      location: '3305호',
      anomaly: 'CO2 센서 오류',
      duration: '10분 경과',
      actor: '무명',
    },
  ]);

  return (
    <div className="min-h-screen bg-[var(--white-02)] p-6">
      <AlertsTable
        rows={rows}
        onChangeAction={(id, action) => {
          setRows((prev) =>
            prev.map((r) => (r.id === id ? { ...r, action } : r)),
          );
        }}
      />
    </div>
  );
}

