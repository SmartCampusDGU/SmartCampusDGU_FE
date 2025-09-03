import { useMemo, useState } from 'react';
import Tag from '@/components/facilities/Tag'
import ActionButton from "@/components/common/ActionButton";
import EditSpaceModal from '../modals/EditSpaceModal';
import type { SpaceFormValue } from '../modals/CreateSpaceModal';
import { Td, Th } from '../common/Table';
import type { SpaceType } from '@/mocks/facilities/spaces';
import { useRoomsQuery } from '@/state/queries/facilities/useRoomsQuery';
import type { RoomListItem } from '@/types/facilities/RoomListItem';

export default function SpaceList() {
  const { data } = useRoomsQuery();
  const roomList = data?.rooms ?? [];
  const [active, setActive] = useState<SpaceType>('실험실'); // 기본 탭

  const rows = useMemo(() => {
  return roomList.filter((room) => room.roomType === active);
}, [roomList, active]);

  const [editOpen, setEditOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<RoomListItem | null>(null);

  const handleDetailClick = (row: RoomListItem) => {
    setCurrentRow(row);
    setEditOpen(true);
  };

   const handleSave = (form: SpaceFormValue) => {
    console.log("저장된 공간 정보:", form);
    setEditOpen(false);
  };

  return (
    <div className="w-full">
      {/* 헤더 타이틀 라인 */}
      <div className="flex items-center gap-[52px] mb-3">
        <h2 className="text-[20px] font-bold">공간 리스트</h2>
      {/* 탭 영역 */}
      <div className="flex gap-[52px]">
        <ActionButton
            variant={active === "강의실" ? "tab-active" : "tab-inactive"}
            label="강의실"
            onClick={() => setActive("강의실")}
          />
          <ActionButton
            variant={active === "실험실" ? "tab-active" : "tab-inactive"}
            label="실험실"
            onClick={() => setActive("실험실")}
          />
      </div>
       </div>

      {/* 테이블 */}
      <div className="w-full border-t border-[#ACACAC]">
        <table className="table-fixed w-full mx-auto border-collapse">
         <colgroup>
  <col className="w-[12%]" />  {/* 체크박스 (↑) */}
    <col className="w-[28%]" />  {/* 공간명   (↓) */}
    <col className="w-[46%]" />  {/* 커스텀 데이터 (↓) */}
    <col className="w-[14%]" />  {/* 상세페이지 (↑) */}
</colgroup>
          <thead>
            <tr>
              <Th />
              <Th>공간명</Th>
              <Th>커스텀 데이터</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-[#E5E5E5]">
                <Td className="text-center">
                  <input type="checkbox" className="w-4 h-4" />
                </Td>
                <Td className="text-center">{r.roomNumber}</Td>
                <Td className="text-center">
                  <div className="flex justify-center items-center gap-2 py-2">
                    {r.dataTypes.map((t, idx) => (
<Tag
        key={`${r.id}-${t.name}-${idx}`}
        label={t.name}
        variant={
          t.name === '온도'
            ? 'temperature'
            : t.name === '습도'
            ? 'humidity'
            : t.name === 'CO2'
            ? 'co2'
            : 'tvoc'
        }
      />
                    ))}
                  </div>
                </Td>
                <Td className="text-right">
                <ActionButton
                    variant="view"
                    label="상세페이지"
                    onClick={() => handleDetailClick(r)}
                  />
                </Td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <Td colSpan={4} className="text-center py-8 text-[#7C7C7C]">
                  해당 유형의 공간이 없습니다.
                </Td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
         {/* 상세 모달 */}
      {currentRow && (
        <EditSpaceModal
          open={editOpen}
          initial={{
            roomNo: currentRow.roomNumber,
            spaceType: currentRow.roomType,
            items: currentRow.dataTypes.map((dataType) => ({
               id: dataType.dataTypeId.toString(), 
        label: dataType.name,               
        unit: dataType.unit,
        thresholds: [
          {
            level: "주의",
            min: dataType.cautionMin.toString(),
            max: dataType.cautionMax.toString(),
          },
          {
            level: "위험",
            min: dataType.dangerMin.toString(),
            max: dataType.dangerMax.toString(),
          },
          {
            level: "응급",
            min: dataType.emergencyMin.toString(),
            max: dataType.emergencyMax.toString(),
          },
        ],
            })),
          }}
          onClose={() => setEditOpen(false)}
          onSave={handleSave}
        />
      )}
      </div>
  );
}