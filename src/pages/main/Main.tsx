import { useState } from 'react';
import { useSetPageTitle } from '@/hooks/common/useSetPageTitle';
import { useSetActiveNav } from "@/hooks/common/useSetActiveNav";
import { AlertsTable } from '@/components/main/AlertsTable';
import type { AlertRow } from '@/components/main/AlertsTable';
import { alertMockData } from '@/mocks/main/alerts';

export default function MainPage() {
  useSetPageTitle("이상치 조회");
  useSetActiveNav("search", "abnormal");

  const [rows, setRows] = useState<AlertRow[]>(alertMockData);

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