import React from "react";
import Button from "@/components/ui/Button";

export type AccountRow = {
  username: string;                 // 로그인 아이디 (문자열)
  name: string;                     
  description: string | null;       
};

interface EditAccountModalProps {
  open: boolean;
  onClose: () => void;
  initial: AccountRow;

  onSave?: (args: {
    username: string;
    body: { name: string; description: string | null } & Partial<{ password: string }>;
  }) => void;
  editableUsername?: boolean; // 아이디 수정 가능 여부 (기본 false)
}

const MIN_NEW_PW_LEN = 6;

const EditAccountModal: React.FC<EditAccountModalProps> = ({
  open,
  onClose,
  initial,
  onSave,
  editableUsername = false,
}) => {
  const [username, setUsername] = React.useState<string>(initial?.username ?? "");
  const [name, setName] = React.useState<string>(initial?.name ?? "");
  const [description, setDescription] = React.useState<string>(initial?.description ?? "");
  const [newPw, setNewPw] = React.useState<string>("");

  React.useEffect(() => {
    if (!open) return;
    setUsername(initial?.username ?? "");
    setName(initial?.name ?? "");
    setDescription(initial?.description ?? "");
    setNewPw("");
  }, [open, initial]);

  if (!open) return null;

  const baseValid = name.trim().length > 0;
  const pwTooShort = newPw.length > 0 && newPw.length < MIN_NEW_PW_LEN;
  const isValid = baseValid && !pwTooShort;

  const handleSubmit = () => {
    if (!isValid) return;

    const body: { name: string; description: string | null } & Partial<{ password: string }> = {
      name: name.trim(),
      description: (description ?? "").trim(),
      ...(newPw.trim() ? { password: newPw.trim() } : {}),
    };

    onSave?.({ username, body });
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-[100]"
      onClick={onClose}
    >
      <div
        className="
          bg-white rounded-2xl shadow-xl
          w-[1010px] max-w-[calc(100vw-48px)]
          max-h-[calc(100vh-48px)] overflow-y-auto
        "
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-account-title"
      >
        {/* 헤더 */}
        <div className="relative px-8 pt-6 pb-4 border-b">
          <h2 id="edit-account-title" className="text-[22px] font-extrabold">계정 수정</h2>
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
            onClick={onClose}
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {/* 본문 */}
        <div className="px-8 py-6 space-y-5">
          {/* 로그인 아이디(username) */}
          <div>
            <label className="block mb-2 font-semibold">아이디</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              className="w-full border rounded-md px-3 py-3"
              disabled={!editableUsername}
            />
            {!editableUsername && (
              <p className="mt-1 text-sm text-gray-500">
                ※ 아이디(username)는 기본적으로 수정할 수 없습니다.
              </p>
            )}
          </div>

          {/* 새 비밀번호 */}
          <div>
            <label className="block mb-2 font-semibold">새 비밀번호 (선택)</label>
            <input
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              type="password"
              autoComplete="new-password"
              placeholder={`입력하지 않으면 기존 비밀번호가 유지됩니다 / 최소 ${MIN_NEW_PW_LEN}자`}
              className="w-full border rounded-md px-3 py-3"
            />
            {pwTooShort && (
              <p className="mt-1 text-sm text-red-600">
                새 비밀번호는 최소 {MIN_NEW_PW_LEN}자 이상이어야 합니다.
              </p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              보안을 위해 기존 비밀번호는 표시되지 않습니다.
            </p>
          </div>

          {/* 계정명 */}
          <div>
            <label className="block mb-2 font-semibold">계정명</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="예) 설비팀"
              className="w-full border rounded-md px-3 py-3"
            />
          </div>

          {/* 설명 */}
          <div>
            <label className="block mb-2 font-semibold">설명</label>
            <textarea
              value={description ?? ""}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="기타 참고사항"
              className="w-full border rounded-md px-3 py-3 min-h-[120px]"
            />
          </div>
        </div>

        {/* 푸터 */}
        <div className="px-8 pb-8 flex justify-center">
          <Button variant="save" onClick={handleSubmit} disabled={!isValid} />
        </div>
      </div>
    </div>
  );
};

export default EditAccountModal;
