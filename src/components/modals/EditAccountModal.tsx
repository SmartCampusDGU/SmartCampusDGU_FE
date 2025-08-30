import React from "react";
import Button from "@/components/ui/Button";

export type AccountRow = {
  id: string;
  role: string;
  desc: string;
  password: string; // 현재 비밀번호
};

interface EditAccountModalProps {
  open: boolean;
  onClose: () => void;
  initial: AccountRow; // 선택된 행에서 전달 (password 포함)
  onSave?: (form: { id: string; password: string; role: string; desc: string }) => void;
  editableId?: boolean; // 필요 시 아이디 수정 허용
}

const EditAccountModal: React.FC<EditAccountModalProps> = ({
  open,
  onClose,
  initial,
  onSave,
  editableId = false,
}) => {
  const [id, setId] = React.useState(initial?.id ?? "");
  const [pw, setPw] = React.useState(initial?.password ?? "");
  const [role, setRole] = React.useState(initial?.role ?? "");
  const [desc, setDesc] = React.useState(initial?.desc ?? "");

  const isValid = id.trim().length > 0 && role.trim().length > 0;

  const handleSubmit = () => {
    if (!isValid) return;
    onSave?.({
      id: id.trim(),
      password: pw, // 항상 현재 입력값 저장
      role: role.trim(),
      desc: desc.trim(),
    });
  };

  React.useEffect(() => {
    if (!open) return;
    setId(initial?.id ?? "");
    setPw(initial?.password ?? "");
    setRole(initial?.role ?? "");
    setDesc(initial?.desc ?? "");
  }, [open, initial]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-[100]"
      onClick={onClose}
    >
      <div
        className="
          bg-white rounded-2xl shadow-xl
          w-[1010px] h-[680px]
          max-w-[calc(100vw-48px)] max-h-[calc(100vh-48px)]
          overflow-y-auto
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="relative px-8 pt-6 pb-4 border-b">
          <h2 className="text-[22px] font-extrabold">계정 수정</h2>
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
            onClick={onClose}
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {/* 본문 */}
        <div className="px-8 py-6">
          <div className="space-y-5">
            {/* 아이디 */}
            <div>
              <label className="block mb-2 font-semibold">아이디</label>
              <input
                value={id}
                onChange={(e) => setId(e.target.value)}
                type="text"
                placeholder="아이디"
                className="w-full border rounded-md px-3 py-3"
                disabled={!editableId}
              />
              {!editableId && (
                <p className="mt-1 text-sm text-gray-500">
                  ※ 운영 안전을 위해 기본적으로 아이디 변경은 막아두었어요.
                </p>
              )}
            </div>

            {/* 비밀번호 (항상 노출) */}
            <div>
              <label className="block mb-2 font-semibold">비밀번호</label>
              <input
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                type="text"                // ← 항상 노출
                placeholder="비밀번호"
                className="w-full border rounded-md px-3 py-3"
              />
            </div>

            {/* 계정명 */}
            <div>
              <label className="block mb-2 font-semibold">계정명</label>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                type="text"
                placeholder="예) 설비팀"
                className="w-full border rounded-md px-3 py-3"
              />
            </div>

            {/* 설명 */}
            <div>
              <label className="block mb-2 font-semibold">설명</label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="기타 참고사항"
                className="w-full border rounded-md px-3 py-3 min-h-[120px]"
              />
            </div>

            {!isValid && (
              <p className="text-sm text-gray-500">아이디/계정명을 입력해 주세요.</p>
            )}
          </div>
        </div>

        {/* 푸터 */}
        <div className="px-8 pb-8 flex justify-center">
          <Button variant="save" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default EditAccountModal;
