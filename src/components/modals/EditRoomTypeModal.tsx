// 공간 유형 리스트에서 상세보기 버튼 누르면 뜨는 모달
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Button from "@/components/ui/Button";

/* ── 타입 & 유틸 ────────────────────────────────── */
type LevelKey = "주의" | "위험" | "응급";
type Threshold = { level: LevelKey; min: string; max: string };
type MeasureItem = { id: string; label: string; unit: string; thresholds: Threshold[] };
export type TypeFormValue = { spaceType: string; items: MeasureItem[] };

const EMPTY_LEVELS: Threshold[] = [
  { level: "주의", min: "", max: "" },
  { level: "위험", min: "", max: "" },
  { level: "응급", min: "", max: "" },
];
const uid = () => Math.random().toString(36).slice(2, 9);

/* ── Modal Base ────────────────────────────────── */
function usePortalRoot(id = "modal-root") {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("div");
      el.setAttribute("id", id);
      document.body.appendChild(el);
    }
    ref.current = el as HTMLElement;
  }, [id]);
  return ref.current;
}
function ModalBase({
  open, onClose, children, ariaLabel,
}: { open: boolean; onClose: () => void; children: React.ReactNode; ariaLabel?: string; }) {
  const root = usePortalRoot();
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);
  if (!open || !root) return null;
  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center" aria-modal="true" role="dialog" aria-label={ariaLabel ?? "modal"}>
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-[1001] w-[920px] h-[80vh]" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>, root
  );
}

/* ── EditRoomTypeModal  ──────────────── */
export default function EditRoomTypeModal({
  open, initial, onClose, onSave,
}: { open: boolean; initial: TypeFormValue; onClose: () => void; onSave: (v: TypeFormValue) => void; }) {
  const [spaceType, setSpaceType] = useState(initial.spaceType);
  const [items, setItems] = useState<MeasureItem[]>(initial.items);

  useEffect(() => {
    if (!open) return;
    // 모달 열릴 때마다 최신 initial 반영
    setSpaceType(initial.spaceType);
    setItems(initial.items);
  }, [open, initial]);

  const canSave = useMemo(() => spaceType.trim().length > 0, [spaceType]);

  const addItem       = () => setItems((p) => [...p, { id: uid(), label: "", unit: "", thresholds: JSON.parse(JSON.stringify(EMPTY_LEVELS)) }]);
  const removeItem    = (id: string) => setItems((p) => p.filter((it) => it.id !== id));
  const changeLabel   = (id: string, v: string) => setItems((p) => p.map((it) => it.id === id ? { ...it, label: v } : it));
  const changeUnit    = (id: string, v: string) => setItems((p) => p.map((it) => it.id === id ? { ...it, unit: v } : it));
  const changeThresh  = (id: string, lv: LevelKey, which: "min"|"max", v: string) =>
    setItems((p) => p.map((it) => it.id !== id ? it : ({ ...it, thresholds: it.thresholds.map((t) => t.level===lv? { ...t, [which]: v } : t) })));

  const handleCancel = () => {
    // 값 되돌리기
    setSpaceType(initial.spaceType);
    setItems(initial.items);
    onClose();
  };
  const handleSave = () => {
    if (!canSave) return;
    onSave({ spaceType: spaceType.trim(), items });
    onClose();
  };

  return (
    <ModalBase open={open} onClose={onClose} ariaLabel="공간유형 수정">
      <div className="h-full w-full rounded-2xl shadow-xl overflow-hidden bg-amber-50">
        <div className="h-full overflow-y-auto px-6 pt-6 pb-8">
          {/* 헤더 */}
          <div className="flex items-start justify-between">
            <div className="text-lg font-semibold">공간 유형</div>
            <button onClick={onClose} className="text-xl leading-none px-2 -mt-1" aria-label="닫기" title="닫기">✕</button>
          </div>

          {/* 즉시 수정 input */}
          <input
            className="mt-3 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-amber-400"
            value={spaceType}
            onChange={(e) => setSpaceType(e.target.value)}
            placeholder="공간 유형"
          />

          <div className="grid grid-cols-12 gap-4 mt-6 mb-3 text-gray-700">
            <div className="col-span-5 font-semibold">측정 데이터 항목</div>
            <div className="col-span-7 font-semibold">임계값</div>
          </div>

          <div className="space-y-4">
            {items.map((it) => (
              <div key={it.id} className="grid grid-cols-12 gap-4 items-start">
                <div className="col-span-5">
                  <div className="flex items-center gap-2">
                    <button onClick={() => removeItem(it.id)} aria-label="항목 삭제" title="항목 삭제" className="shrink-0 text-gray-500 hover:text-red-600">
                      <img src="/icons/tabler_trash.png" alt="삭제 아이콘" className="w-5 h-5" />
                    </button>
                    <input
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-amber-400"
                      value={it.label}
                      onChange={(e) => changeLabel(it.id, e.target.value)}
                      placeholder="측정 항목"
                    />
                  </div>
                </div>

                <div className="col-span-7 space-y-3">
                  {(["주의","위험","응급"] as LevelKey[]).map((lv) => {
                    const t = it.thresholds.find((x) => x.level === lv)!;
                    return (
                      <div key={lv} className="flex items-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3">
                        <div className="shrink-0 w-10 text-gray-700">{lv}</div>
                        <div className="flex items-center gap-2 w-full">
                          <span className="text-gray-500">[</span>
                          <input className="w-24 rounded border border-gray-300 px-2 py-1 text-center outline-none focus:ring-2 focus:ring-amber-400"
                                 value={t.min} onChange={(e) => changeThresh(it.id, lv, "min", e.target.value)} />
                          <span className="text-gray-500">~</span>
                          <input className="w-24 rounded border border-gray-300 px-2 py-1 text-center outline-none focus:ring-2 focus:ring-amber-400"
                                 value={t.max} onChange={(e) => changeThresh(it.id, lv, "max", e.target.value)} />
                          <span className="text-gray-500">]</span>
                          <input className="ml-3 w-20 rounded border border-gray-300 px-2 py-1 text-center outline-none focus:ring-2 focus:ring-amber-400"
                                 value={it.unit} onChange={(e) => changeUnit(it.id, e.target.value)} placeholder="단위" title="단위(예: ℃, %, ppm)" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <button onClick={addItem} className="w-[420px] rounded-xl border border-amber-300 bg-white px-6 py-3 text-amber-700 hover:bg-amber-100">
              항목 추가하기
            </button>
          </div>

          <div className="mt-8 flex justify-center gap-3">
            <div className={`${canSave ? "" : "opacity-50 pointer-events-none"}`}>
                <Button variant="save" onClick={handleSave} />
            </div>
          </div>
        </div>
      </div>
    </ModalBase>
  );
}
