import DataTypeTable from '@/components/measurements/DataTypeTable';

export default function Facilities() {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-6 bg-[var(--white-02)]">
      
       {/* 상단 구분선 */}
      <div
        className="mx-auto"
        style={{
          width: '1010.008px',
          height: '1px',
          backgroundColor: '#7C7C7C',
        }}
      />
      {/* 공간 리스트 */}
      <div className="mt-6">
        <DataTypeTable />
      </div>
    </div>
  );
}