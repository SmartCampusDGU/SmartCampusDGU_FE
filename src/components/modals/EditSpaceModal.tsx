import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Button from "@/components/ui/Button";

/* ── 타입 ─────────────────────────────────────────── */
type LevelKey = "주의" | "위험" | "응급";
type Threshold = { level: LevelKey; min: string; max: string };
type MeasureItem = {
  id: string;
  label: string;
  unit: string;
  thresholds: Threshold[];
  usePreset?: boolean;
};
export type SpaceFormValue = {
  roomNo: string;
  spaceType: string;
  items: MeasureItem[];
};

/* ── 상수 & 유틸 ──────────────────────────────────── */
const EMPTY_LEVELS: Threshold[] = [
  { level: "주의", min: "", max: "" },
  { level: "위험", min: "", max: "" },
  { level: "응급", min: "", max: "" },
];
const uid = () => Math.random().toString(36).slice(2, 9);
const SPACE_TYPES = ["강의실", "실험실", "연구실", "전산실", "사무실"] as const;

const PRESET_BY_TYPE: Record<string, Array<{ label: string; unit: string; thresholds: Threshold[] }>> = {
  강의실: [
    { label: "온도", unit: "℃", thresholds: [
      { level: "주의", min: "0", max: "36" },
      { level: "위험", min: "36", max: "38" },
      { level: "응급", min: "38", max: "50" },
    ]},
    { label: "CO₂", unit: "ppm", thresholds: [
      { level: "주의", min: "800",  max: "1200" },
      { level: "위험", min: "1200", max: "2000" },
      { level: "응급", min: "2000", max: "5000" },
    ]},
  ],
  실험실: [
    { label: "온도", unit: "℃", thresholds: [
      { level: "주의", min: "0",  max: "35" },
      { level: "위험", min: "35", max: "37" },
      { level: "응급", min: "37", max: "50" },
    ]},
  ],
  연구실: [],
  전산실: [],
  사무실: [],
};

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));
const cloneEmptyLevels = () => clone(EMPTY_LEVELS);
const findPreset = (spaceType: string, label: string) =>
  (PRESET_BY_TYPE[spaceType] || []).find((x) => x.label === label);

/* ── Modal Base ───────────────────────────────────── */
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
}: { open: boolean; onClose: () => void; children: React.ReactNode; ariaLabel?: string }) {
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
    </div>,
    root
  );
}

/* ── 공통 바디 ────────────────────────────────────── */
function SpaceFormBody({
  roomNo, setRoomNo,
  spaceType, setSpaceType,
  items, setItems,
  onClose, onSave,
}: {
  roomNo: string; setRoomNo: (v: string) => void;
  spaceType: string; setSpaceType: (v: string) => void;
  items: MeasureItem[]; setItems: React.Dispatch<React.SetStateAction<MeasureItem[]>>;
  onClose: () => void; onSave: () => void;
}) {
  const canSave = useMemo(() => roomNo.trim().length > 0 && spaceType.trim().length > 0, [roomNo, spaceType]);

  const addItem = () => {
    setItems((p) => [...p, { id: uid(), label: "", unit: "", thresholds: cloneEmptyLevels(), usePreset: false }]);
  };
  const removeItem = (id: string) => setItems((p) => p.filter((it) => it.id !== id));
  const changeLabel = (id: string, v: string) => setItems((p) => p.map((it) => it.id === id ? { ...it, label: v } : it));
  const changeUnit  = (id: string, v: string) => setItems((p) => p.map((it) => it.id === id ? { ...it, unit: v } : it));
  const changeThresh = (id: string, lv: LevelKey, which: "min"|"max", v: string) =>
    setItems((p) => p.map((it) => it.id !== id ? it : ({ ...it, thresholds: it.thresholds.map((t) => t.level === lv ? { ...t, [which]: v } : t) })));

  const toggleUsePreset = (id: string, checked: boolean) => {
    setItems((prev) => prev.map((it) => {
      if (it.id !== id) return it;
      if (checked && spaceType) {
        const preset = findPreset(spaceType, it.label);
        if (preset) {
          return { ...it, unit: preset.unit, thresholds: clone(preset.thresholds), usePreset: true };
        }
        return { ...it, usePreset: false };
      }
      return { ...it, usePreset: false };
    }));
  };

  useEffect(() => {
    if (!spaceType) return;
    setItems((prev) => prev.map((it) => {
      const preset = findPreset(spaceType, it.label);
      return preset ? { ...it, unit: preset.unit, thresholds: clone(preset.thresholds), usePreset: true } : it;
    }));
  }, [spaceType, setItems]);

  return (
    <div className="h-full w-full rounded-2xl shadow-xl overflow-hidden bg-amber-50">
      <div className="absolute right-3 top-3 z-[1]">
        <button onClick={onClose} className="text-xl leading-none px-2" aria-label="닫기" title="닫기">✕</button>
      </div>

      <div className="h-full overflow-y-auto px-6 pt-6 pb-8">
        <div className="text-lg font-semibold">Nº 강의실 번호</div>
        <input
          className="mt-3 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-amber-400"
          value={roomNo}
          onChange={(e) => setRoomNo(e.target.value)}
          placeholder="강의실 번호를 입력하세요"
        />

        <div className="mt-6">
          <div className="text-lg font-semibold">공간 유형</div>
          <div className="mt-3 flex flex-wrap gap-5">
            {SPACE_TYPES.map((t) => {
              const selected = spaceType === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSpaceType(t)}
                  className={[
                    "px-6 py-3 rounded-xl border text-lg font-medium",
                    selected ? "bg-amber-600 border-amber-700 text-white" : "bg-white border-gray-300 text-gray-700",
                  ].join(" ")}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 mt-6 mb-3 text-gray-700">
          <div className="col-span-5 font-semibold">측정 항목</div>
          <div className="col-span-7 font-semibold">임계값</div>
        </div>

        <div className="space-y-4">
          {items.map((it) => {
            const isPreset = !!it.usePreset;
            return (
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
                      placeholder="예: 온도, CO₂, 습도"
                    />
                    <label className="flex items-center gap-1 text-sm text-gray-700 ml-1">
                      <input type="checkbox" checked={!!it.usePreset} onChange={(e) => toggleUsePreset(it.id, e.target.checked)} />
                      <span>기본값</span>
                    </label>
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
                          <input
                            className={`w-24 rounded border border-gray-300 px-2 py-1 text-center outline-none focus:ring-2 focus:ring-amber-400 ${isPreset ? "bg-gray-100 pointer-events-none opacity-70" : ""}`}
                            value={t.min}
                            onChange={(e) => changeThresh(it.id, lv, "min", e.target.value)}
                            readOnly={isPreset}
                          />
                          <span className="text-gray-500">~</span>
                          <input
                            className={`w-24 rounded border border-gray-300 px-2 py-1 text-center outline-none focus:ring-2 focus:ring-amber-400 ${isPreset ? "bg-gray-100 pointer-events-none opacity-70" : ""}`}
                            value={t.max}
                            onChange={(e) => changeThresh(it.id, lv, "max", e.target.value)}
                            readOnly={isPreset}
                          />
                          <span className="text-gray-500">]</span>
                          <input
                            className={`ml-3 w-20 rounded border border-gray-300 px-2 py-1 text-center outline-none focus:ring-2 focus:ring-amber-400 ${isPreset ? "bg-gray-100 pointer-events-none opacity-70" : ""}`}
                            value={it.unit}
                            onChange={(e) => changeUnit(it.id, e.target.value)}
                            placeholder="단위"
                            title="단위(예: ℃, %, ppm)"
                            readOnly={isPreset}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-center">
          <button onClick={addItem} className="w-[420px] rounded-xl border border-amber-300 bg-white px-6 py-3 text-amber-700 hover:bg-amber-100">
            항목 추가하기
          </button>
        </div>

        <div className={`mt-8 flex justify-center ${canSave ? "" : "opacity-50 pointer-events-none"}`}>
          <Button variant="save" onClick={onSave} />
        </div>
      </div>
    </div>
  );
}

/* ── EditSpaceModal ──────────────────────────────── */
export default function EditSpaceModal({
  open, initial, onClose, onSave,
}: {
  open: boolean;
  initial: SpaceFormValue;
  onClose: () => void;
  onSave: (v: SpaceFormValue) => void;
}) {
  const [roomNo, setRoomNo] = useState(initial.roomNo);
  const [spaceType, setSpaceType] = useState(initial.spaceType);
  const [items, setItems] = useState<MeasureItem[]>(clone(initial.items));

  // 열릴 때마다 최신 initial로 재주입
  useEffect(() => {
    if (!open) return;
    setRoomNo(initial.roomNo);
    setSpaceType(initial.spaceType);
    setItems(clone(initial.items));
  }, [open, initial]);

  const handleSave = () => {
    onSave({ roomNo: roomNo.trim(), spaceType: spaceType.trim(), items });
    onClose();
  };

  return (
    <ModalBase open={open} onClose={onClose} ariaLabel="공간 수정">
      <SpaceFormBody
        roomNo={roomNo} setRoomNo={setRoomNo}
        spaceType={spaceType} setSpaceType={setSpaceType}
        items={items} setItems={setItems}
        onClose={onClose}
        onSave={handleSave}
      />
    </ModalBase>
  );
}
