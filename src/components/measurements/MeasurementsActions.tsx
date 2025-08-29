import { useState } from "react";
import ActionButton from "@/components/common/ActionButton";
import CreateRoomTypeModal from "@/components/modals/CreateRoomTypeModal";
import { DeleteTypeModal } from "@/components/modals/DeleteTypeModal";
import type { TypeFormValue } from "@/components/modals/EditRoomTypeModal";

export default function MeasurementsActions() {
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleCreateSave = (form: TypeFormValue) => {
    console.log("등록된 공간 유형:", form);
    setCreateOpen(false);
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