// src/pages/Reminder.tsx
import { useContext, useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import clsx from "clsx";
import { ActiveNavContext } from "@/contexts/ActiveNavContext";
import { useSetPageTitle } from "@/hooks/common/useSetPageTitle";
import { useSetActiveNav } from "@/hooks/common/useSetActiveNav";

type HM = { hour: string; minute: string };

/* ── 스타일 토큰 ───────────────────────────────────────────── */
const CARD = "bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-200";
const FIELD = "h-11 px-3 rounded-lg border border-[#2F73DA] outline-none focus:ring-2 focus:ring-[#DA5B00]";
const H2 = "text-[20px] font-extrabold";
const SUB = "text-sm text-gray-500";
const SAVE_BTN = "h-11 rounded-lg bg-[#DA5B00] text-white font-semibold disabled:opacity-50";
const GHOST_BTN = "h-11 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50";

/* ── 유틸 ─────────────────────────────────────────────────── */
function onlyDigits(v: string) { return v.replace(/\D/g, ""); }
function clamp(n: number, min: number, max: number) { return Math.max(min, Math.min(max, n)); }
function normalizeHM(hm: HM): HM {
  const h = hm.hour === "" ? "" : String(clamp(Number(hm.hour), 0, 23));
  const m = hm.minute === "" ? "" : String(clamp(Number(hm.minute), 0, 59));
  return { hour: h, minute: m };
}
function isHMValid(hm: HM) {
  if (hm.hour === "" || hm.minute === "") return false;
  const h = Number(hm.hour), m = Number(hm.minute);
  return !Number.isNaN(h) && !Number.isNaN(m) && h >= 0 && h <= 23 && m >= 0 && m <= 59;
}
const fmt = (hm: HM) => `${hm.hour}시간 ${hm.minute}분`;

/* ── 페이지 ──────────────────────────────────────────────── */
export default function ReminderPage() {
  useSetPageTitle("위험 단계 재알림 설정");
  useSetActiveNav("sensor", "reminder");
  // 사이드바 활성 (센서 관리 > 재알람 설정)
  const activeNav = useContext(ActiveNavContext);
  useEffect(() => {
    activeNav?.setActiveNav({ group: "sensor", item: "reminder" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 폼 상태
  const [dangerHM, setDangerHM]   = useState<HM>({ hour: "", minute: "" }); // 위험
  const [warnHM, setWarnHM]       = useState<HM>({ hour: "", minute: "" }); // 경고
  const [afterActHM, setAfterAct] = useState<HM>({ hour: "", minute: "" }); // 조치 후

  const isLeftValid  = isHMValid(dangerHM) && isHMValid(warnHM);
  const isRightValid = isHMValid(afterActHM);

  // 초기값 로드 (데모용 — API 연동 시 교체)
  useEffect(() => {
    setDangerHM({ hour: "1", minute: "0" });
    setWarnHM({ hour: "0", minute: "30" });
    setAfterAct({ hour: "1", minute: "0" });
  }, []);

  // 공통 입력 핸들러
  const onHMChange =
    (setter: Dispatch<SetStateAction<HM>>, key: keyof HM) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = onlyDigits(e.target.value);
      setter(prev => normalizeHM({ ...prev, [key]: raw } as HM));
    };

  // 액션
  const resetLeft = () => { setDangerHM({ hour: "", minute: "" }); setWarnHM({ hour: "", minute: "" }); };
  const resetRight = () => setAfterAct({ hour: "", minute: "" });

  const handleSaveLevels = async () => {
    if (!isLeftValid) return;
    // TODO: await api.save({ danger: dangerHM, warn: warnHM });
    alert(`[저장] 위험 ${fmt(dangerHM)} / 경고 ${fmt(warnHM)}`);
  };
  const handleSaveAfterAct = async () => {
    if (!isRightValid) return;
    // TODO: await api.save({ afterAction: afterActHM });
    alert(`[저장] 조치 후 ${fmt(afterActHM)}`);
  };

  return (
    <div className="w-full">
      {/* 상단 회색 바/구분선은 사용하지 않음 */}

      {/* 좌/우 카드: 간격 넓힘 */}
      <div className="mt-4 grid grid-cols-1 gap-25 xl:grid-cols-[minmax(0,1fr)_420px]">
        {/* 왼쪽: 단계별 */}
        <section className={clsx(CARD, "p-6")}>
          <header className="mb-2">
            <p className={SUB}>
              센서 이상치 경고 알람을 확인하지 않은 경우, 일정 주기마다 관리자에게 재알림이 발송됩니다. <br />
              이상치 위험 등급 별로 재알림 주기를 다르게 설정할 수 있습니다.
            </p>
          </header>

          {/* 위험 */}
          <div className="mt-6 space-y-4">
            <div className="flex flex-col gap-1">
            <span className="text-[16px] font-semibold">• 위험 단계 재알림 주기</span>
            <p  className="text-gray-500 text-sm">
                위험 단계는 보다 짧은 주기를 설정할 것을 권장합니다.
            </p>  
            </div>
            <div className="flex items-center gap-4 mt-3">
              <input
                className={FIELD + " w-full"}
                placeholder="시간"
                value={dangerHM.hour}
                onChange={onHMChange(setDangerHM, "hour")}
                inputMode="numeric"
                maxLength={2}
              />
              <input
                className={FIELD + " w-full"}
                placeholder="분"
                value={dangerHM.minute}
                onChange={onHMChange(setDangerHM, "minute")}
                inputMode="numeric"
                maxLength={2}
              />
            </div>
            {!isHMValid(dangerHM) && (
              <p className="text-xs text-red-500">시간/분을 0–23 / 0–59 범위로 입력하세요.</p>
            )}
          </div>

          {/* 경고 */}
          <div className="mt-8 space-y-4">
            <span className="text-[16px] font-semibold">• 경고 단계 재알림 주기</span>
            <div className="flex items-center gap-4 mt-3">
              <input
                className={FIELD + " w-full"}
                placeholder="시간"
                value={warnHM.hour}
                onChange={onHMChange(setWarnHM, "hour")}
                inputMode="numeric"
                maxLength={2}
              />
              <input
                className={FIELD + " w-full"}
                placeholder="분"
                value={warnHM.minute}
                onChange={onHMChange(setWarnHM, "minute")}
                inputMode="numeric"
                maxLength={2}
              />
            </div>
            {!isHMValid(warnHM) && (
              <p className="text-xs text-red-500">시간/분을 0–23 / 0–59 범위로 입력하세요.</p>
            )}
          </div>

          {/* 액션 */}
          <div className="mt-8 flex gap-2">
            <button type="button" className={clsx(SAVE_BTN, "flex-1")} onClick={handleSaveLevels} disabled={!isLeftValid}>
              저장하기
            </button>
            <button type="button" className={clsx(GHOST_BTN, "px-4")} onClick={resetLeft}>
              초기화
            </button>
          </div>
        </section>

        {/* 오른쪽: 조치 후 */}
        <section className={clsx(CARD, "p-6")}>
          <header className="mb-2">
            <h2 className={H2}>조치 후 재알림 설정</h2>
            <p className={SUB}>현장 조치 완료 후, 다음 알림까지의 대기 시간을 정합니다.</p>
          </header>

          <div className="mt-6 space-y-2">
            <span className="text-[16px] font-semibold">• 조치 후 재알림 주기</span>
            <div className="flex items-center gap-3 mt-3">
              <input
                className={FIELD + " w-full"}
                placeholder="시간"
                value={afterActHM.hour}
                onChange={onHMChange(setAfterAct, "hour")}
                inputMode="numeric"
                maxLength={2}
              />
              <input
                className={FIELD + " w-full"}
                placeholder="분"
                value={afterActHM.minute}
                onChange={onHMChange(setAfterAct, "minute")}
                inputMode="numeric"
                maxLength={2}
              />
            </div>
            {!isRightValid && (
              <p className="text-xs text-red-500">시간/분을 0–23 / 0–59 범위로 입력하세요.</p>
            )}
          </div>

          <div className="mt-8 flex gap-2">
            <button type="button" className={clsx(SAVE_BTN, "flex-1")} onClick={handleSaveAfterAct} disabled={!isRightValid}>
              저장하기
            </button>
            <button type="button" className={clsx(GHOST_BTN, "px-4")} onClick={resetRight}>
              초기화
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

