// SuccessModal.tsx
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

/** ---- Portal Root ---- */
function usePortalRoot(id = "modal-root") {
  if (typeof document === "undefined") return null;
  return document.getElementById(id);
}

export interface SuccessModalProps {
  open: boolean;
  /** 기본 문구: "센서 등록이 완료되었습니다!" */
  message?: string;
  confirmText?: string; // 기본: "확인"
  onClose: () => void;
  showCloseIcon?: boolean; // 기본: true
  /** 지정 시 자동으로 닫힘(ms) */
  autoCloseMs?: number;
}

export function SuccessModal({
  open,
  message = "센서 등록이 완료되었습니다!",
  confirmText = "확인",
  onClose,
  showCloseIcon = true,
  autoCloseMs,
}: SuccessModalProps) {
  const portalRoot = usePortalRoot();
  const firstBtnRef = useRef<HTMLButtonElement | null>(null);

  // Body scroll lock
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Focus first button
  useEffect(() => {
    if (open) setTimeout(() => firstBtnRef.current?.focus(), 0);
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Auto close
  useEffect(() => {
    if (!open || !autoCloseMs) return;
    const t = setTimeout(onClose, autoCloseMs);
    return () => clearTimeout(t);
  }, [open, autoCloseMs, onClose]);

  if (!open || !portalRoot) return null;

  return createPortal(
    <div aria-hidden={!open} className="fixed inset-0 z-[1000]">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />

      {/* Card */}
      <div role="dialog" aria-modal="true" aria-labelledby="success-modal-title" className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-full max-w-[640px] rounded-2xl bg-[#FFF6CD] shadow-2xl">
          {/* Close Icon */}
          {showCloseIcon && (
            <button
              onClick={onClose}
              aria-label="닫기"
              className="absolute right-4 top-4 h-10 w-10 rounded-full text-black/70 hover:bg-black/5"
            >
              ×
            </button>
          )}

          <div className="px-8 pt-10 pb-7 text-center">
            {/* Check Icon */}
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F6C544] text-white">
              {/* 체크 모양 (두꺼운 테두리) */}
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <h2 id="success-modal-title" className="mb-3 text-xl font-semibold text-gray-900">
              등록이 완료되었습니다
            </h2>

            <div className="mx-auto mb-6 w-full max-w-[520px] rounded-xl bg-white p-5 text-sm font-bold leading-6 text-gray-800">
              {message}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center pb-2">
              <button
                ref={firstBtnRef}
                onClick={onClose}
                className="h-11 min-w-[140px] rounded-xl bg-[#F6C544] px-6 font-semibold text-gray-900 shadow hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[#F6C544]/40"
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    portalRoot
  );
}
