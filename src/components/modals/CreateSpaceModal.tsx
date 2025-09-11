import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Button from "@/components/ui/Button";
import type { RoomTypeItem } from "@/types/measurements/RoomTypeItem";
import { useSensorDataTypesQuery } from "@/state/queries/sensors/useSensorDataTypesQuery";

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
  roomTypeId: number;
  spaceTypeName: string; // 표시용 (선택된 방 타입 이름)
  items: MeasureItem[];
};

/* ── 상수 & 유틸 ──────────────────────────────────── */
const EMPTY_LEVELS: Threshold[] = [
  { level: "주의", min: "", max: "" },
  { level: "위험", min: "", max: "" },
  { level: "응급", min: "", max: "" },
];

const uid = () => Math.random().toString(36).slice(2, 9);
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));
const cloneEmptyLevels = () => clone(EMPTY_LEVELS);

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
  roomTypeId, setRoomTypeId,
  items, setItems,
  onClose, onSave,
  roomTypes,
}: {
  roomNo: string; setRoomNo: (v: string) => void;
  roomTypeId: number | null; setRoomTypeId: (v: number) => void;
  items: MeasureItem[]; setItems: React.Dispatch<React.SetStateAction<MeasureItem[]>>;
  onClose: () => void; onSave: () => void;
  roomTypes: RoomTypeItem[];
}) {
  const { data: sensorData, isLoading } = useSensorDataTypesQuery();
  const sensorOptions = sensorData?.data ?? [];

  const canSave = useMemo(() => roomNo.trim().length > 0 && !!roomTypeId, [roomNo, roomTypeId]);

  // 선택된 roomType 객체/이름
  const selectedRoomType = useMemo(
    () => roomTypes.find(rt => rt.id === roomTypeId) ?? null,
    [roomTypes, roomTypeId]
  );

  // 프리셋 조회 함수 (roomType의 dataTypes에서 label(name)매칭)
  const findPreset = (roomType: RoomTypeItem | null, label: string) => {
    if (!roomType) return undefined;
    const dt = roomType.dataTypes.find(d => d.name === label);
    if (!dt) return undefined;
    return {
      unit: dt.unit,
      thresholds: [
        { level: "주의",  min: String(dt.cautionMin),  max: String(dt.cautionMax) },
        { level: "위험",  min: String(dt.dangerMin),   max: String(dt.dangerMax) },
        { level: "응급",  min: String(dt.emergencyMin),max: String(dt.emergencyMax) },
      ] as Threshold[],
    };
  };

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
      if (checked && selectedRoomType) {
        const preset = findPreset(selectedRoomType, it.label);
        if (preset) {
          return { ...it, unit: preset.unit, thresholds: clone(preset.thresholds), usePreset: true };
        }
        return { ...it, usePreset: false };
      }
      return { ...it, usePreset: false };
    }));
  };

  // roomType 변경 시, 프리셋 자동 반영
  useEffect(() => {
    if (!selectedRoomType) return;
    setItems((prev) => prev.map((it) => {
      const preset = findPreset(selectedRoomType, it.label);
      return preset ? { ...it, unit: preset.unit, thresholds: clone(preset.thresholds), usePreset: true } : it;
    }));
  }, [selectedRoomType, setItems]);

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
            {roomTypes.map((rt) => {
              const selected = roomTypeId === rt.id;
              return (
                <button
                  key={rt.id}
                  type="button"
                  onClick={() => setRoomTypeId(rt.id)}
                  className={[
                    "px-6 py-3 rounded-xl border text-lg font-medium",
                    selected ? "bg-amber-600 border-amber-700 text-white" : "bg-white border-gray-300 text-gray-700",
                  ].join(" ")}
                  title={rt.description}
                >
                  {rt.name}
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
                    <select
  className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-amber-400"
  value={it.label}
  onChange={(e) => {
  const selected = sensorOptions.find((s) => s.name === e.target.value);
  if (selected) {
    changeLabel(it.id, selected.name);
    changeUnit(it.id, selected.unit);
  }
}}
disabled={isLoading}
>
  <option value="">항목 선택</option>
  {sensorOptions.map((opt) => (
    <option key={opt.id} value={opt.name}>
      {opt.name} ({opt.unit})
    </option>
  ))}
</select>

                    <label className="flex items-center gap-1 text-sm text-gray-700 ml-1">
                      <input
                        type="checkbox"
                        checked={!!it.usePreset}
                        onChange={(e) => toggleUsePreset(it.id, e.target.checked)}
                      />
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

/* ── CreateSpaceModal ─────────────────────────────── */
export default function CreateSpaceModal({
  open, onClose, onSave, roomTypes,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (v: SpaceFormValue) => void;
  roomTypes: RoomTypeItem[];
}) {
  const [roomNo, setRoomNo] = useState("");
  const [roomTypeId, setRoomTypeId] = useState<number | null>(null);
  const [items, setItems] = useState<MeasureItem[]>([
    { id: uid(), label: "온도", unit: "", thresholds: cloneEmptyLevels(), usePreset: false },
  ]);

  // 1) 모달 열릴 때 초기화 (첫 번째 roomType 선택)
useEffect(() => {
  if (!open) return;
  setRoomNo("");

  if (roomTypes.length > 0) {
    setRoomTypeId(roomTypes[0].id); // 첫 번째 유형 선택
  } else {
    setRoomTypeId(null);
    setItems([]);
  }
}, [open, roomTypes]);

// 2) roomTypeId가 바뀔 때 items 세팅
useEffect(() => {
  if (!roomTypeId) return;
  const rt = roomTypes.find(r => r.id === roomTypeId);
  if (!rt) return;

  const newItems: MeasureItem[] = rt.dataTypes.map((dt) => ({
    id: uid(),
    label: dt.name,
    unit: dt.unit,
    thresholds: cloneEmptyLevels(),
    usePreset: false,
  }));
  setItems(newItems);
}, [roomTypeId, roomTypes]);

  const handleSave = () => {
    const rt = roomTypes.find(r => r.id === roomTypeId) ?? null;
    onSave({
      roomNo: roomNo.trim(),
      roomTypeId: roomTypeId ?? 0,
      spaceTypeName: rt?.name ?? "",
      items,
    });
    onClose();
  };

  return (
    <ModalBase open={open} onClose={onClose} ariaLabel="공간 등록">
      <SpaceFormBody
        roomNo={roomNo} setRoomNo={setRoomNo}
        roomTypeId={roomTypeId} setRoomTypeId={setRoomTypeId}
        items={items} setItems={setItems}
        onClose={onClose}
        onSave={handleSave}
        roomTypes={roomTypes}
      />
    </ModalBase>
  );
}