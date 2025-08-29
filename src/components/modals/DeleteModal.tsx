// 삭제하기 모달의 기본 모달입니다.

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// ---------- Modal Root (for portals) ----------
function usePortalRoot(id = "modal-root") {
  const rootRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("div");
      el.setAttribute("id", id);
      document.body.appendChild(el);
    }
    rootRef.current = el;
  }, [id]);
  return rootRef.current;
}

// ---------- Modal Component ----------
export interface ModalProps {
  open: boolean;
  title?: string;
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onClose: () => void;
  onConfirm?: () => void;
  showCloseIcon?: boolean;
}

export function DeleteModal({
  open,
  title,
  children,
  confirmText = "확인",
  cancelText = "취소",
  onClose,
  onConfirm,
  showCloseIcon = true,
}: ModalProps) {
  const portalRoot = usePortalRoot();
  const firstBtnRef = useRef<HTMLButtonElement | null>(null);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Focus first button when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => firstBtnRef.current?.focus(), 0);
    }
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !portalRoot) return null;

  return createPortal(
    <div aria-hidden={!open} className="fixed inset-0 z-[1000]">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />

      {/* Centered Card */}
      <div role="dialog" aria-modal="true" aria-labelledby="modal-title" className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-full max-w-[720px] rounded-2xl bg-[#FAD4D4] shadow-2xl">
          {/* Close Icon */}
          {showCloseIcon && (
            <button onClick={onClose} aria-label="닫기" className="absolute right-4 top-4 h-14 w-14 text-black hover:opacity-70 text-3xl">
              ×
            </button>
          )}

          {/* Content */}
          <div className="px-8 pt-10 pb-6 text-center">
            {/* Alert Icon */}
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F35656] text-3xl text-white">!</div>

            {title && (
              <h2 id="modal-title" className="mb-4 text-xl font-semibold text-gray-800">
                {title}
              </h2>
            )}

            <div className="mx-auto mb-6 w-full max-w-[560px] rounded-xl bg-white p-5 text-sm font-bold leading-6 text-gray-800">
              {children}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-20 pb-2">
              <button
                ref={firstBtnRef}
                onClick={onClose}
                className="h-11 min-w-[120px] rounded-xl bg-gray-300 px-6 font-semibold text-gray-700 shadow hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-black/20"
              >
                {cancelText}
              </button>
              <button
                onClick={() => (onConfirm ? onConfirm() : onClose())}
                className="h-11 min-w-[120px] rounded-xl bg-[#F35656] px-6 font-semibold text-white shadow hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#F35656]/40"
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
