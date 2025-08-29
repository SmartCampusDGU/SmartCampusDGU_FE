import { DeleteModal } from "./DeleteModal";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

export function DeleteTypeModal({ open, onClose, onConfirm }: Props) {
  return (
    <DeleteModal open={open} onClose={onClose} onConfirm={onConfirm} title="센서를 삭제하시겠습니까?" confirmText="확인" cancelText="취소">
      <p className="mb-1">센서가 삭제되면 해당 센서의 모든 데이터가 영구적으로 제거됩니다.</p>
      <p className="mb-1">이 작업은 되돌릴 수 없으므로 신중히 진행해주세요.</p>
      <p>삭제를 원하시면 ‘확인’ 버튼을 눌러주세요.</p>
    </DeleteModal>
  );
}