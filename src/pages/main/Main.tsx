import { useState } from 'react';
import { useSetPageTitle } from '@/hooks/common/useSetPageTitle';
import { useSetActiveNav } from "@/hooks/common/useSetActiveNav";
import { AlertsTable } from '@/components/main/AlertsTable';
import type { AlertRowView } from '@/utils/main/outlierMapper';
import { toAlertRowView } from '@/utils/main/outlierMapper';
import { alertMockData } from '@/mocks/main/alerts';

export default function MainPage() {
  useSetPageTitle("이상치 조회");
  useSetActiveNav("search", "abnormal");

  const initialRows: AlertRowView[] = alertMockData
    .map(toAlertRowView)
    .filter((v): v is AlertRowView => v !== null);

  const [rows, setRows] = useState<AlertRowView[]>(initialRows);

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