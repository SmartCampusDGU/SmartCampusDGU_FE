import { useState } from 'react';
import EditRoomTypeModal from '../modals/EditRoomTypeModal';
import type { TypeFormValue } from '../modals/CreateRoomTypeModal';
import ActionButton from '../common/ActionButton';
import { Td, Th } from '../common/Table';
import { useRoomTypesQuery } from '@/state/queries/measurements/useRoomTypesQuery';
import type { RoomTypeItem } from '@/types/measurements/RoomTypeItem';

export default function DataTypeTable() {
   const { data: roomTypes = [] } = useRoomTypesQuery();

  const [modalOpen, setModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<RoomTypeItem | null>(null);

  const handleDetailClick = (row: RoomTypeItem) => {
    setCurrentRow(row);
    setModalOpen(true);
  };

  const handleSave = (form: TypeFormValue) => {
    console.log("저장된 데이터:", form);
  };

  return (
    <div className="w-full border-t border-[#ACACAC]">
      <table className="table-fixed w-full border-collapse">
        <colgroup>
          <col className="w-[64px]" />   {/* 체크박스 */}
          <col className="w-[200px]" />  {/* 공간 타입 */}
          <col />                        {/* 수집 데이터 유형 */}
          <col className="w-[160px]" />  {/* 상세보기 버튼 */}
        </colgroup>
        <thead>
          <tr>
            <Th />
            <Th>공간 타입</Th>
            <Th>수집 데이터 유형</Th>
            <Th>임계값 설정</Th>
          </tr>
        </thead>
        <tbody>
          {roomTypes.map((r) => (
            <tr key={r.id} className="border-b border-[#E5E5E5]">
              <Td className="text-center">
                <input type="checkbox" className="w-4 h-4" />
              </Td>
              <Td className="text-center">{r.name}</Td>
              <Td className="text-center">
                {r.dataTypes.map((d, idx) => (
                  <span
                      key={d.id}
                      className={`${d.name === 'TVOC' ? 'font-bold text-black' : 'font-normal'}`}
                    >
                    {d.name}
                      {idx < r.dataTypes.length - 1 && ', '}
                  </span>
                ))}
              </Td>
              <Td className="text-center">
                <ActionButton
  variant="view"
  label="상세보기"
  onClick={() => handleDetailClick(r)} 
/>

              </Td>
            </tr>
          ))}
        </tbody>
      </table>
       {/* 모달 추가 */}
      {currentRow && (
        <EditRoomTypeModal
          open={modalOpen}
          initial={{
            spaceType: currentRow.name,
            items: currentRow.dataTypes.map((dt) => ({
              id: dt.id.toString(),
              label: dt.name,
              unit: dt.unit,
              thresholds: [
                { level: '주의', min: dt.cautionMin.toString(), max: dt.cautionMax.toString() },
                { level: '위험', min: dt.dangerMin.toString(), max: dt.dangerMax.toString() },
                { level: '응급', min: dt.emergencyMin.toString(), max: dt.emergencyMax.toString() },
              ],
            })),
          }}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}