import { DeleteModal } from "./DeleteModal";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

export function DeleteTypeModal({ open, onClose, onConfirm }: Props) {
  return (
    <DeleteModal open={open} onClose={onClose} onConfirm={onConfirm} title="유형을 삭제하시겠습니까?" confirmText="확인" cancelText="취소">
      <p className="mb-1">해당 유형에 속한 호실이 하나라도 존재할 경우 삭제할 수 없습니다.</p>
      <p className="mb-1">이 작업은 되돌릴 수 없으므로 신중히 진행해주세요.</p>
      <p>삭제를 원하시면 ‘확인’ 버튼을 눌러주세요.</p>
    </DeleteModal>
  );
}
