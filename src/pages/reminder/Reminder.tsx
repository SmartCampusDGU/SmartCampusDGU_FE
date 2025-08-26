import React, { useEffect, useMemo, useState } from "react";

/**
 * 스마트 캠퍼스 – 재알림 설정 페이지
 * 환경: React + TypeScript + TailwindCSS (라우터는 앱에 맞춰 감싸서 사용)
 * 백엔드: Spring Boot REST 가정
 *   GET  /api/alerts/settings           현재값 조회
 *   PUT/PUT /api/alerts/settings      저장
 *   요청/응답 포맷 (예시)
 *   {
 *     dangerIntervalMin: number,   // 위험 단계 재알림 주기(분)
 *     warningIntervalMin: number,  // 경고 단계 재알림 주기(분)
 *     postActionIntervalMin: number // 조치 후 재알림(분)
 *   }
 */

// -------------------- 유틸 --------------------
function clamp(n: number, min: number, max: number) { return Math.min(Math.max(n, min), max); }

function toInt(v: string): number | undefined {
  if (v === "" || v == null) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : undefined;
}

function hhmmToMinutes(hh?: number, mm?: number) {
  const h = hh ?? 0; const m = mm ?? 0;
  return clamp(h, 0, 23) * 60 + clamp(m, 0, 59);
}

function minutesToHHMM(total?: number): { hh: string; mm: string } {
  if (!total && total !== 0) return { hh: "", mm: "" };
  const h = Math.floor(total / 60);
  const m = total % 60;
  return { hh: String(h), mm: String(m) };
}

// -------------------- 작은 입력 컴포넌트 --------------------
interface HHMMProps {
  label: string;
  valueMin?: number; // 분단위
  onChange: (min: number) => void;
}

function HHMMInput({ label, valueMin, onChange }: HHMMProps) {
  const { hh, mm } = useMemo(() => minutesToHHMM(valueMin), [valueMin]);
  const [localH, setLocalH] = useState(hh);
  const [localM, setLocalM] = useState(mm);

  // 외부값 변경 시 내부 입력 동기화
  useEffect(() => { setLocalH(hh); setLocalM(mm); }, [hh, mm]);

  function apply(hStr: string, mStr: string) {
    const h = clamp(toInt(hStr) ?? 0, 0, 23);
    const m = clamp(toInt(mStr) ?? 0, 0, 59);
    onChange(h * 60 + m);
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-800">{label}</p>
      <div className="flex items-center gap-2">
        <input
          aria-label="시간"
          inputMode="numeric"
          placeholder="시간"
          value={localH}
          onChange={(e) => setLocalH(e.target.value)}
          onBlur={() => apply(localH, localM)}
          className="w-36 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <span className="text-sm text-gray-600">시간</span>
        <input
          aria-label="분"
          inputMode="numeric"
          placeholder="분"
          value={localM}
          onChange={(e) => setLocalM(e.target.value)}
          onBlur={() => apply(localH, localM)}
          className="w-36 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <span className="text-sm text-gray-600">분</span>
      </div>
      <p className="text-xs text-gray-500">허용범위: 0~23시간 / 0~59분</p>
    </div>
  );
}

// -------------------- API 래퍼 --------------------
async function apiGetSettings(signal?: AbortSignal) {
  const res = await fetch("/api/alerts/settings", { credentials: "include", signal });
  if (!res.ok) throw new Error("설정 조회 실패");
  return (await res.json()) as {
    dangerIntervalMin: number;
    warningIntervalMin: number;
    postActionIntervalMin: number;
  };
}

async function apiSaveSettings(payload: {
  dangerIntervalMin: number;
  warningIntervalMin: number;
  postActionIntervalMin: number;
}) {
  const res = await fetch("/api/alerts/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("설정 저장 실패");
  return res.json();
}

// -------------------- 메인 페이지 --------------------
export default function Reminder() {
  // 분 단위로 보관
  const [dangerMin, setDangerMin] = useState<number | undefined>();
  const [warningMin, setWarningMin] = useState<number | undefined>();
  const [postActionMin, setPostActionMin] = useState<number | undefined>();

  const [loading, setLoading] = useState(true);
  const [savingLeft, setSavingLeft] = useState(false);
  const [savingRight, setSavingRight] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        const d = await apiGetSettings(ctrl.signal);
        setDangerMin(d.dangerIntervalMin);
        setWarningMin(d.warningIntervalMin);
        setPostActionMin(d.postActionIntervalMin);
      } catch (e: any) {
        setError(e?.message ?? "네트워크 오류");
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, []);

  async function saveLeft() {
    if (dangerMin == null || warningMin == null) return;
    setSavingLeft(true); setError(null); setOk(null);
    try {
      await apiSaveSettings({
        dangerIntervalMin: dangerMin,
        warningIntervalMin: warningMin,
        postActionIntervalMin: postActionMin ?? 0,
      });
      setOk("저장되었습니다.");
    } catch (e: any) {
      setError(e?.message ?? "저장 실패");
    } finally { setSavingLeft(false); }
  }

  async function saveRight() {
    if (postActionMin == null) return;
    setSavingRight(true); setError(null); setOk(null);
    try {
      await apiSaveSettings({
        dangerIntervalMin: dangerMin ?? 0,
        warningIntervalMin: warningMin ?? 0,
        postActionIntervalMin: postActionMin,
      });
      setOk("저장되었습니다.");
    } catch (e: any) {
      setError(e?.message ?? "저장 실패");
    } finally { setSavingRight(false); }
  }

  if (loading) {
    return <div className="p-8 text-gray-700">불러오는 중…</div>;
  }

  return (
    <div className="flex min-h-[calc(100vh-56px)] bg-[#F6F6F6]">
      {/* 좌측 사이드바 (간략 Mock) */}
      <aside className="w-64 border-r bg-white">
        <div className="px-5 py-4 text-sm font-semibold">신공학관</div>
        {[
          "조회",
          "시설 관리",
          "센서 관리",
          "센서 설정",
          "유형별 센서 설정",
          "알람 설정",
          "문서 작업",
          "관리자 계정 관리",
        ].map((label, i) => (
          <div key={i} className={`px-5 py-3 text-sm ${label === "센서 관리" ? "bg-amber-50 font-semibold text-amber-800" : "text-gray-700"}`}>
            {label}
          </div>
        ))}
      </aside>

      {/* 메인 */}
      <main className="mx-auto w-full max-w-[1100px] p-8">
        <h1 className="mb-6 text-xl font-bold text-gray-900">재알림 설정</h1>

        {/* 2 컬럼 카드 */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* 왼쪽 카드 */}
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-gray-900">위험 단계별 재알림 설정</h2>
            <div className="space-y-8">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-600" />
                  <span className="text-sm font-medium text-gray-800">위험 단계 재알림 주기</span>
                </div>
                <HHMMInput label="" valueMin={dangerMin} onChange={setDangerMin} />
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-600" />
                  <span className="text-sm font-medium text-gray-800">경고 단계 재알림 주기</span>
                </div>
                <HHMMInput label="" valueMin={warningMin} onChange={setWarningMin} />
              </div>

              <button
                onClick={saveLeft}
                disabled={savingLeft}
                className="mt-2 w-full rounded-lg bg-[#D06000] px-4 py-3 text-sm font-semibold text-white hover:bg-[#B95300] disabled:opacity-60"
              >
                {savingLeft ? "저장 중…" : "저장하기"}
              </button>
            </div>
          </section>

          {/* 오른쪽 카드 */}
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-base font-semibold text-gray-900">조치 후 재알림 설정</h2>
            <HHMMInput label="조치 후 재알림" valueMin={postActionMin} onChange={setPostActionMin} />
            <button
              onClick={saveRight}
              disabled={savingRight}
              className="mt-6 w-full rounded-lg bg-[#D06000] px-4 py-3 text-sm font-semibold text-white hover:bg-[#B95300] disabled:opacity-60"
            >
              {savingRight ? "저장 중…" : "저장하기"}
            </button>
          </section>
        </div>

        {/* 상태 메시지 */}
        {(error || ok) && (
          <div className="mt-6">
            {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
            {ok && <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{ok}</div>}
          </div>
        )}
      </main>
    </div>
  );
}
