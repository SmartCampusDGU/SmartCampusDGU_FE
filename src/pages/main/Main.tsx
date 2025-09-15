import { useEffect, useState } from 'react';
import { useSetPageTitle } from '@/hooks/common/useSetPageTitle';
import { useSetActiveNav } from "@/hooks/common/useSetActiveNav";
import { AlertsTable } from '@/components/main/AlertsTable';
import type { AlertRowView } from '@/utils/main/outlierMapper';
import { toAlertRowView } from '@/utils/main/outlierMapper';
import { useOutliersQuery } from '@/state/queries/main/useOutliersQuery';

export default function MainPage() {
  useSetPageTitle("이상치 조회");
  useSetActiveNav("search", "abnormal");

  const { data } = useOutliersQuery();

  const [rows, setRows] = useState<AlertRowView[]>([]);

  useEffect(() => {
    if (data) {
      const mapped = data.outlierLogs
        .map(toAlertRowView)
        .filter((v): v is AlertRowView => v !== null);
      setRows(mapped);
    }
  }, [data]);

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