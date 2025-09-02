import { useState } from "react";
import ActionButton from "@/components/common/ActionButton";
import CreateRoomTypeModal from "@/components/modals/CreateRoomTypeModal";
import { DeleteTypeModal } from "@/components/modals/DeleteTypeModal";
import type { TypeFormValue } from "@/components/modals/EditRoomTypeModal";
import { useCreateRoomTypeMutation } from "@/state/mutations/measurements/useCreateRoomTypeMutation";

export default function MeasurementsActions() {
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const createRoomTypeMutation = useCreateRoomTypeMutation();

    const handleCreateSave = (form: TypeFormValue) => {
    const request = {
      name: form.spaceType,
      description: "",
      dataTypes: form.items.map((item) => ({
        id: 0,
        cautionMin: Number(item.thresholds[0].min || 0),
        cautionMax: Number(item.thresholds[0].max || 0),
        dangerMin: Number(item.thresholds[1].min || 0),
        dangerMax: Number(item.thresholds[1].max || 0),
        emergencyMin: Number(item.thresholds[2].min || 0),
        emergencyMax: Number(item.thresholds[2].max || 0),
      })),
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
    console.log("삭제 확인됨");
    setDeleteOpen(false);
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