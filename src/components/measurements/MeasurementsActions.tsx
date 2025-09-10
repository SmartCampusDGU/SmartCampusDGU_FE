import { useState } from "react";
import ActionButton from "@/components/common/ActionButton";
import CreateRoomTypeModal from "@/components/modals/CreateRoomTypeModal";
import { DeleteTypeModal } from "@/components/modals/DeleteTypeModal";
import type { TypeFormValue } from "@/components/modals/EditRoomTypeModal";
import { useCreateRoomTypeMutation } from "@/state/mutations/measurements/useCreateRoomTypeMutation";
import { useDeleteRoomTypeMutation } from "@/state/mutations/measurements/useDeleteRoomTypeMutation";

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

export default function MeasurementsActions({ selectedIds }: { selectedIds: number[] }) {
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const createRoomTypeMutation = useCreateRoomTypeMutation();
  const deleteRoomTypeMutation = useDeleteRoomTypeMutation();

    const handleCreateSave = (form: TypeFormValue) => {
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

    createRoomTypeMutation.mutate(request, {
      onSuccess: () => {
        setCreateOpen(false);
      },
      onError: (err) => {
        console.error("공간 유형 등록 실패:", err);
      },
    });
  };

    const handleDeleteConfirm = () => {
  if (selectedIds.length === 0) return;

  deleteRoomTypeMutation.mutate(selectedIds[0], {
    onSuccess: () => {
      setDeleteOpen(false);
    },
    onError: (err) => {
      console.error("삭제 실패:", err);
    }
  });
};

  return (
    <>
      <div className="flex gap-3">
        <ActionButton
          variant="register"
          label="등록하기"
          onClick={() => setCreateOpen(true)}
        />
        <ActionButton
          variant="delete"
          label="삭제하기"
          onClick={() => setDeleteOpen(true)}
        />
      </div>
      {/* 모달 */}
      <CreateRoomTypeModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={handleCreateSave}
      />
      <DeleteTypeModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}