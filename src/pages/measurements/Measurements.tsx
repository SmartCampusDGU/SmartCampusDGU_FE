import { useSetPageTitle } from '@/hooks/common/useSetPageTitle';
import DataTypeTable from '@/components/measurements/DataTypeTable';

export default function Facilities() {
  useSetPageTitle("공간 유형별 측정 항목 설정");
  return (
    <div className="mx-auto w-full max-w-[1600px] px-6 bg-[var(--white-02)]">
      
      {/* 공간 리스트 */}
      <div className="mt-6">
        <DataTypeTable />
      </div>
    </div>
  );
}