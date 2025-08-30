import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useSetPageTitle } from '@/hooks/common/useSetPageTitle';
import { useSetActiveNav } from "@/hooks/common/useSetActiveNav";
import MeasurementsActions from "../../components/measurements/MeasurementsActions";
import DataTypeTable from '@/components/measurements/DataTypeTable';

type LayoutOutletContext = {
  setExtraActions: (node: React.ReactNode) => void;
};

export default function Measurements() {
  useSetPageTitle("공간 유형별 측정 항목 설정");
  useSetActiveNav("sensor", "type-threshold");

   const { setExtraActions } = useOutletContext<LayoutOutletContext>();

  useEffect(() => {
    setExtraActions(<MeasurementsActions />);
     return () => setExtraActions(null);
  }, [setExtraActions]);

  return (
    <div className="mx-auto w-full max-w-[1600px] px-6 bg-[var(--white-02)]">
      
      {/* 공간 리스트 */}
      <div className="mt-6">
        <DataTypeTable />
      </div>
    </div>
  );
}