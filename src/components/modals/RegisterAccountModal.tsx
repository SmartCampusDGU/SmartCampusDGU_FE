// src/components/modals/RegisterAccountModal.tsx
import React from "react";
import Button from "@/components/ui/Button";

interface RegisterAccountModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (acc: { id: string; password: string; role: string; desc: string }) => void;
}

const RegisterAccountModal: React.FC<RegisterAccountModalProps> = ({ open, onClose, onSuccess }) => {
  const [id, setId]   = React.useState("");
  const [pw, setPw]   = React.useState("");
  const [role, setRole] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const isValid = id.length >= 3 && pw.length >= 4 && role.length > 0;

  const handleSubmit = () => {
    if (!isValid) return;
    onSuccess?.({ id, password: pw, role, desc });
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-[100]"
      onClick={onClose}
    >
      {/* 모달 박스 */}
      <div
        className="
          bg-white rounded-2xl shadow-xl
          w-[1010px] h-[680px]
          max-w-[calc(100vw-48px)] max-h-[calc(100vh-48px)]
          overflow-hidden
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* 레이아웃: 헤더/본문/푸터 */}
        <div className="h-full flex flex-col">
          {/* 헤더 */}
          <div className="relative px-8 pt-6 pb-4 border-b">
            <h2 className="text-[22px] font-extrabold">계정 등록</h2>
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
              onClick={onClose}
              aria-label="닫기"
            >
              ✕
            </button>
          </div>

          {/* 본문 */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <div className="space-y-5">
              <div>
                <label className="block mb-2 font-semibold">아이디</label>
                <input
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  type="text"
                  placeholder="아이디 입력 (6~20자)"
                  className="w-full border rounded-md px-3 py-3"
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold">비밀번호</label>
                <input
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  type="password"
                  placeholder="비밀번호 입력 (영어, 숫자, 특수기호 포함 8~20자)"
                  className="w-full border rounded-md px-3 py-3"
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold">계정명</label>
                <input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  type="text"
                  placeholder="계정 이름을 입력해주세요"
                  className="w-full border rounded-md px-3 py-3"
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold">설명</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="기타 참고사항이나 특이사항이 있다면 적어주세요"
                  className="w-full border rounded-md px-3 py-3 min-h-[120px]"
                />
              </div>
            </div>
          </div>

          {/* 푸터 */}
          <div className="px-8 pb-8 flex justify-center">  
            {/* 취소 버튼 삭제, 등록만 전체폭 */}
            <Button variant="register" onClick={handleSubmit} disabled={!isValid} className="w-[420px] h-12" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterAccountModal;
