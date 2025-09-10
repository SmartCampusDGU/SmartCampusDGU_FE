import { useState } from 'react';
import EditRoomTypeModal from '../modals/EditRoomTypeModal';
import type { TypeFormValue } from '../modals/CreateRoomTypeModal';
import ActionButton from '../common/ActionButton';
import { Td, Th } from '../common/Table';
import { useRoomTypesQuery } from '@/state/queries/measurements/useRoomTypesQuery';
import type { RoomTypeItem } from '@/types/measurements/RoomTypeItem';
import { useUpdateRoomTypeMutation } from '@/state/mutations/measurements/useUpdateRoomTypeMutation';

const SENSOR_OPTIONS = [
  { name: "rssi", unit: "unknown", id: 1 },
  { name: "aqmScores", unit: "unknown", id: 2 },
  { name: "usbPowered", unit: "boolean", id: 3 },
  { name: "temperature", unit: "℃", id: 4 },
  { name: "humidity", unit: "%", id: 5 },
  { name: "tvoc", unit: "ug/m³", id: 6 },
  { name: "ambientNoise", unit: "dBA", id: 7 },
  { name: "iaqIndex", unit: "index", id: 8 },
  { name: "batteryPercentage", unit: "%", id: 9 },
  { name: "missedConnections", unit: "unknown", id: 10 },
  { name: "buttonPressed", unit: "boolean", id: 11 },
];

interface DataTypeTableProps {
  selectedIds: number[];
  onSelectChange: (ids: number[]) => void;
}

export default function DataTypeTable({
  selectedIds,
  onSelectChange,
}: DataTypeTableProps) {
  const { data: roomTypes = [] } = useRoomTypesQuery();
  const updateRoomTypeMutation = useUpdateRoomTypeMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<RoomTypeItem | null>(null);

  const handleDetailClick = (row: RoomTypeItem) => {
    setCurrentRow(row);
    setModalOpen(true);
  };

   const handleSave = (form: TypeFormValue) => {
    if (!currentRow) return;

    const request = {
      name: form.spaceType,
      description: "",
      dataTypes: form.items.map((item) => {
  const sensor = SENSOR_OPTIONS.find((s) => s.name === item.label);
  if (!sensor) throw new Error("Invalid sensor name");

  return {
    id: sensor.id,
    cautionMin: Number(item.thresholds[0].min || 0),
    cautionMax: Number(item.thresholds[0].max || 0),
    dangerMin: Number(item.thresholds[1].min || 0),
    dangerMax: Number(item.thresholds[1].max || 0),
    emergencyMin: Number(item.thresholds[2].min || 0),
    emergencyMax: Number(item.thresholds[2].max || 0),
  };
}),
    };

    updateRoomTypeMutation.mutate(
      { roomTypeId: currentRow.id, data: request },
      {
        onSuccess: () => {
          setModalOpen(false);
        },
        onError: (err) => {
          console.error("공간 유형 수정 실패:", err);
        },
      }
    );
  };

  const toggleSelect = (id: number) => {
  if (selectedIds.includes(id)) {
    onSelectChange([]);
  } else {
    onSelectChange([id]); 
  }
};

  return (
    <div className="w-full border-t border-[#ACACAC]">
      <table className="table-fixed w-full border-collapse">
        <colgroup>
          <col className="w-[64px]" /> {/* 체크박스 */}
          <col className="w-[200px]" /> {/* 공간 타입 */}
          <col /> {/* 수집 데이터 유형 */}
          <col className="w-[160px]" /> {/* 상세보기 버튼 */}
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
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={selectedIds.includes(r.id)}
                  onChange={() => toggleSelect(r.id)}
                />
              </Td>
              <Td className="text-center">{r.name}</Td>
              <Td className="text-center">
                {r.dataTypes.map((d, idx) => (
                  <span
                    key={d.id}
                    className={`${
                      d.name === "TVOC" ? "font-bold text-black" : "font-normal"
                    }`}
                  >
                    {d.name}
                    {idx < r.dataTypes.length - 1 && ", "}
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

      {/* 상세보기 모달 */}
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
                {
                  level: "주의",
                  min: dt.cautionMin.toString(),
                  max: dt.cautionMax.toString(),
                },
                {
                  level: "위험",
                  min: dt.dangerMin.toString(),
                  max: dt.dangerMax.toString(),
                },
                {
                  level: "응급",
                  min: dt.emergencyMin.toString(),
                  max: dt.emergencyMax.toString(),
                },
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