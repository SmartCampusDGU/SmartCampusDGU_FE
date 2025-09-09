import { useEffect, useMemo, useState } from 'react';
import Tag from '@/components/facilities/Tag';
import ActionButton from "@/components/common/ActionButton";
import { EditSpaceModal } from '../modals/EditSpaceModal';
import type { SpaceFormValue } from '../modals/CreateSpaceModal';
import { Td, Th } from '../common/Table';
import { useRoomsQuery } from '@/state/queries/facilities/useRoomsQuery';
import type { RoomListItem } from '@/types/facilities/RoomListItem';
import { useRoomTypesQuery } from '@/state/queries/measurements/useRoomTypesQuery';

export default function SpaceList() {
  // 방 타입 목록(탭)
  const { data: roomTypes = [] } = useRoomTypesQuery();

  // 활성 탭: roomTypeId 사용 (선택값)
  const [activeRoomTypeId, setActiveRoomTypeId] = useState<number | null>(null);

  // 첫 로드 시 첫 번째 타입 자동 선택
  useEffect(() => {
    if (roomTypes.length > 0 && activeRoomTypeId == null) {
      setActiveRoomTypeId(roomTypes[0].id);
    }
  }, [roomTypes, activeRoomTypeId]);

  // 쿼리 파라미터: roomTypeId는 선택
  const roomsQueryParams =
    activeRoomTypeId != null
      ? { page: 0, size: 20, roomTypeId: activeRoomTypeId }
      : { page: 0, size: 20 };

  const { data } = useRoomsQuery(roomsQueryParams);
  const roomList = data?.rooms ?? [];

  const activeRoomTypeName = useMemo(() => {
    return roomTypes.find((rt) => rt.id === activeRoomTypeId)?.name ?? '';
  }, [roomTypes, activeRoomTypeId]);

  // 서버에서 roomTypeId로 필터링해서 내려오므로 그대로 사용
  const rows = roomList;

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

  // 라벨 -> 태그 variant 매핑
  const getTagVariant = (name: string): React.ComponentProps<typeof Tag>['variant'] => {
    const n = name.toLowerCase();
    if (["온도", "temperature", "temp"].some((k) => n.includes(k))) return "temperature";
    if (["습도", "humidity", "humid"].some((k) => n.includes(k))) return "humidity";
    if (["co2", "이산화탄소", "co₂"].some((k) => n.includes(k))) return "co2";
    if (["tvoc", "voc"].some((k) => n.includes(k))) return "tvoc";
    return "tvoc";
  };

  return (
    <div className="w-full">
      {/* 헤더 타이틀 라인 */}
      <div className="flex items-center gap-[52px] mb-3">
        <h2 className="text-[20px] font-bold">공간 리스트</h2>
        {/* 탭 영역 (동적) */}
        <div className="flex gap-[12px]">
          {roomTypes.map((rt) => (
            <ActionButton
              key={rt.id}
              variant={activeRoomTypeId === rt.id ? "tab-active" : "tab-inactive"}
              label={rt.name}
              onClick={() => setActiveRoomTypeId(rt.id)}
            />
          ))}
        </div>
      </div>

      {/* 테이블 */}
      <div className="w-full border-t border-[#ACACAC]">
        <table className="table-fixed w-full mx-auto border-collapse">
          <colgroup>
            <col className="w-[12%]" />
            <col className="w-[28%]" /> {/* 공간명 */}
            <col className="w-[46%]" /> {/* 커스텀 데이터 */}
            <col className="w-[14%]" /> {/* 상세페이지 */}
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
                        variant={getTagVariant(t.name)}
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
                  {activeRoomTypeName
                    ? `${activeRoomTypeName} 유형의 공간이 없습니다.`
                    : `공간 유형을 선택하세요.`}
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
            // 이름 -> id 매핑 (없으면 첫 번째 타입/0으로 대체)
            roomTypeId:
              roomTypes.find((t) => t.name === currentRow.roomType)?.id ??
              (roomTypes[0]?.id ?? 0),
            spaceTypeName:
              roomTypes.find((t) => t.name === currentRow.roomType)?.name ??
              currentRow.roomType,
            items: currentRow.dataTypes.map((dataType) => ({
              id: String(dataType.dataTypeId ?? `${dataType.name}-${dataType.unit}`),
              label: dataType.name,
              unit: dataType.unit,
              thresholds: [
                { level: "주의", min: String(dataType.cautionMin), max: String(dataType.cautionMax) },
                { level: "위험", min: String(dataType.dangerMin),  max: String(dataType.dangerMax) },
                { level: "응급", min: String(dataType.emergencyMin), max: String(dataType.emergencyMax) },
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