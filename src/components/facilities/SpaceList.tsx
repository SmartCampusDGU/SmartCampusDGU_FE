import { useEffect, useMemo, useState } from 'react';
import Tag from '@/components/facilities/Tag';
import ActionButton from "@/components/common/ActionButton";
import { EditSpaceModal } from '../modals/EditSpaceModal';
import type { SpaceFormValue } from '../modals/CreateSpaceModal';
import { Td, Th } from '../common/Table';
import { useRoomsQuery } from '@/state/queries/facilities/useRoomsQuery';
import type { RoomListItem } from '@/types/facilities/RoomListItem';
import { useRoomTypesQuery } from '@/state/queries/measurements/useRoomTypesQuery';
import { useUpdateRoomMutation } from '@/state/mutations/facilities/useUpdateRoomMutation';
import { useSensorDataTypesQuery } from '@/state/queries/sensors/useSensorDataTypesQuery';
import type { UpdateRoomRequest } from '@/types/facilities/UpdateRoomRequest';

export default function SpaceList() {
  // 방 타입 목록(탭)
  const { data: roomTypes = [] } = useRoomTypesQuery();

  // 활성 탭: roomType 사용 (선택값)
  const [activeRoomType, setActiveRoomType] = useState<number | null>(null);

  // 첫 로드 시 첫 번째 타입 자동 선택
  useEffect(() => {
    if (roomTypes.length > 0 && activeRoomType == null) {
      setActiveRoomType(roomTypes[0].id);
    }
  }, [roomTypes, activeRoomType]);

  // 쿼리 파라미터: roomType은 선택
  const roomsQueryParams =
    activeRoomType != null
      ? { roomType: activeRoomType, page: 0, size: 20 }
      : { page: 0, size: 20 };

  const { data } = useRoomsQuery(roomsQueryParams);
  const roomList = data?.rooms ?? [];

  const activeRoomTypeName = useMemo(() => {
    return roomTypes.find((rt) => rt.id === activeRoomType)?.name ?? '';
  }, [roomTypes, activeRoomType]);

  // 서버에서 roomType 필터링해서 내려오므로 그대로 사용
  const rows = roomList;

  const [editOpen, setEditOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<RoomListItem | null>(null);

  const updateRoomMutation = useUpdateRoomMutation(currentRow?.id ?? 0);
  const { data: sensorData } = useSensorDataTypesQuery();
  const sensorOptions = sensorData?.data ?? [];

  const handleDetailClick = (row: RoomListItem) => {
    setCurrentRow(row);
    setEditOpen(true);
  };

  const handleSave = (form: SpaceFormValue) => {
    if (!currentRow) return;

    const rt = roomTypes.find((r) => r.id === form.roomTypeId);

    const request: UpdateRoomRequest = {
    roomNumber: form.roomNo,
    roomTypeId: form.roomTypeId,
    dataTypes: form.items.map((item) => {
      const cautionMin = Number(item.thresholds[0].min);
      const cautionMax = Number(item.thresholds[0].max);
      const dangerMin = Number(item.thresholds[1].min);
      const dangerMax = Number(item.thresholds[1].max);
      const emergencyMin = Number(item.thresholds[2].min);
      const emergencyMax = Number(item.thresholds[2].max);

      // roomType 기본값에서 동일한 센서 찾기
      const base = rt?.dataTypes.find((d) => d.name === item.label);

      // 센서 아이디 매핑 (roomType 기본값 없으면 sensorDataTypes API에서 가져온 id 사용해야 함)
      const sensor = sensorOptions.find((s) => s.name === item.label);
      const id = base?.dataTypeId ?? sensor?.id ?? 0;

      // isModified 판정
      let isModified = true;
      if (base) {
        const sameValues =
          base.cautionMin === cautionMin &&
          base.cautionMax === cautionMax &&
          base.dangerMin === dangerMin &&
          base.dangerMax === dangerMax &&
          base.emergencyMin === emergencyMin &&
          base.emergencyMax === emergencyMax;

        isModified = !sameValues;
      }

      return {
        id,
        cautionMin,
        cautionMax,
        dangerMin,
        dangerMax,
        emergencyMin,
        emergencyMax,
        isModified,
      };
    }),
  };

    updateRoomMutation.mutate(request, {
  onSuccess: () => {
    console.log("공간 수정 성공");
    setEditOpen(false);

    setCurrentRow((prev) => {
  if (!prev) return null;

  const rt = roomTypes.find((r) => r.id === form.roomTypeId);

  return {
    ...prev,
    roomTypeId: form.roomTypeId,
    roomType: rt?.name ?? prev.roomType,
    dataTypes: form.items.map((item): RoomListItem["dataTypes"][number] => {
      const dataTypeId =
        rt?.dataTypes.find((d) => d.name === item.label)?.dataTypeId ??
        sensorOptions.find((s) => s.name === item.label)?.id ?? 0;

      return {
        id: dataTypeId,
        dataTypeId,
        name: item.label,
        unit: item.unit,
        cautionMin: Number(item.thresholds[0].min),
        cautionMax: Number(item.thresholds[0].max),
        dangerMin: Number(item.thresholds[1].min),
        dangerMax: Number(item.thresholds[1].max),
        emergencyMin: Number(item.thresholds[2].min),
        emergencyMax: Number(item.thresholds[2].max),
        isModified: item.usePreset !== true,
      };
    }),
  };
});
  },
  onError: (err) => {
    console.error("공간 수정 실패:", err);
  },
});
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
              variant={activeRoomType === rt.id ? "tab-active" : "tab-inactive"}
              label={rt.name}
              onClick={() => setActiveRoomType(rt.id)}
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
                    {r.dataTypes
      .filter((t) => t.isModified) // 수정된 데이터타입만 표시
      .map((t, idx) => (
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
              isModified: dataType.isModified,
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