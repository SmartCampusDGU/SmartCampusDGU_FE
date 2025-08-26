type PreviewModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
};

export function PreviewModal({ open, onClose, children, title = "미리보기" }: PreviewModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className="
          relative z-10
          w-[602px] h-[836px] shrink-0
          rounded-[30px] overflow-hidden shadow-xl
          bg-[#D3D3D3]   /* lightgray */
        "
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="[font-family:Inter] text-[16px] font-bold text-black leading-normal">{title}</div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded border border-[#E5E5E5] text-sm bg-white/80 backdrop-blur"
          >
            닫기
          </button>
        </div>
        <div className="absolute inset-x-0 bottom-0 top-[48px] overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}