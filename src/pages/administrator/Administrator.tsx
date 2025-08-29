// src/pages/Administrator.tsx
import { useMemo, useState } from "react";
import clsx from "clsx";
import { useSetPageTitle } from "@/hooks/common/useSetPageTitle";
import { useSetActiveNav } from "@/hooks/common/useSetActiveNav";

type Account = { id: string; password: string; role: string; desc: string };

/* ── 스타일 ─────────────────────────────── */
const CARD = "bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-200";
const TITLE = "text-[22px] font-extrabold";
const HEAD_BASE = "text-[17px] font-bold text-gray-900 py-3";
const HEAD_L = clsx(HEAD_BASE, "text-left px-6");
const HEAD_C = clsx(HEAD_BASE, "text-center px-8"); // 중앙 정렬 헤더
const ROW = "h-[68px] border-b border-gray-200";
const CELL_L = "px-6 text-[16px] text-gray-900 text-left";   // 좌측 정렬 셀
const CELL_C = "px-8 text-[16px] text-gray-900 text-center"; // 중앙 정렬 셀
const BTN = "h-10 px-5 rounded-lg font-semibold shadow-sm border disabled:opacity-50";
const BTN_SKY = clsx(BTN, "bg-[#CFE8FF] border-[#9AC9F3] hover:brightness-95");
const BTN_RED = clsx(BTN, "bg-[#FFD1D1] border-[#F2A2A2] hover:brightness-95");
const BTN_YEL = clsx(BTN, "bg-[#FFE9A9] border-[#F2CD6F] hover:brightness-95");

export default function AdministratorPage() {
  useSetPageTitle("관리자 계정 관리");
  useSetActiveNav("administrator", undefined);

  const [rows, setRows] = useState<Account[]>([
    { id: "admin", password: "aabb11", role: "시설관리팀", desc: "시설관리팀 계정" },
    { id: "hodi",  password: "ffdd22", role: "설비팀",    desc: "설비팀 계정" },
  ]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const allChecked = selected.size > 0 && selected.size === rows.length;
  const toggleOne = (id: string) =>
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  const toggleAll = () =>
    setSelected(prev => (prev.size === rows.length ? new Set() : new Set(rows.map(r => r.id))));

  const canEdit = selected.size === 1;
  const canDelete = selected.size >= 1;

  const onCreate = () => alert("[계정 등록] 모달 오픈");
  const onEdit = () => {
    if (!canEdit) return;
    const targetId = [...selected][0];
    alert(`[계정 수정] ${targetId} 수정 모달 오픈`);
  };
  const onDelete = () => {
    if (!canDelete) return;
    const ids = [...selected];
    if (confirm(`${ids.length}개의 계정을 삭제할까요?`)) {
      setRows(prev => prev.filter(r => !selected.has(r.id)));
      setSelected(new Set());
    }
  };

  const selectionLabel = useMemo(
    () => (selected.size ? `선택됨: ${selected.size}개` : "선택된 항목 없음"),
    [selected.size]
  );

  return (
    <div className="w-full">
      <section className={clsx(CARD, "p-6 mt-6")}>
        {/* 상단: 제목 + 버튼 */}
        <div className="flex items-center justify-between">
          <h2 className={TITLE}>계정 목록</h2>
          <div className="flex items-center gap-3">
            <button type="button" className={BTN_SKY} onClick={onCreate}>계정 등록</button>
            <button type="button" className={BTN_RED} onClick={onDelete} disabled={!canDelete}>계정 삭제</button>
            <button type="button" className={BTN_YEL} onClick={onEdit} disabled={!canEdit}>계정 수정</button>
          </div>
        </div>

        {/* 표: 좌측 정렬 유지 + 컬럼 간격 넓힘 + 중앙 정렬 컬럼 */}
        <div className="mt-4 w-full overflow-x-auto">
          <table className="w-full table-fixed border-collapse">
            {/* 좌측 시작, 컬럼 간격(폭/패딩) 조절 */}
            <colgroup>
              <col style={{ width: 260 }} />   {/* 체크박스 */}
              <col style={{ width: 260 }} />  {/* 아이디 */}
              <col style={{ width: 260 }} />  {/* 비밀번호 */}
              <col style={{ width: 450 }} />  {/* 계정명 */}
              <col />                          {/* 설명(가변) */}
            </colgroup>

            <thead className="bg-white">
              <tr className="border-b-2 border-gray-300">
                <th className={HEAD_L}>
                  <input
                    aria-label="전체 선택"
                    type="checkbox"
                    className="h-4 w-4 align-middle"
                    checked={allChecked}
                    onChange={toggleAll}
                  />
                </th>
                <th className={HEAD_L}>아이디</th>
                <th className={HEAD_C}>비밀번호</th>
                <th className={HEAD_C}>계정명</th>
                <th className={HEAD_C}>설명</th>
              </tr>
            </thead>

            <tbody>
              {rows.map(row => (
                <tr key={row.id} className={ROW}>
                  <td className="pl-6 pr-20">
                    <input
                      aria-label={`${row.id} 선택`}
                      type="checkbox"
                      className="h-4 w-4 align-middle"
                      checked={selected.has(row.id)}
                      onChange={() => toggleOne(row.id)}
                    />
                  </td>

                  {/* 좌측 정렬이 보기 좋은 컬럼 */}
                  <td className={clsx(CELL_L, "font-semibold")}>{row.id}</td>

                  {/* 중앙 정렬이 보기 좋은 컬럼 */}
                  <td className={CELL_C}>{"•".repeat(Math.max(6, row.password.length))}</td>
                  <td className={CELL_C}>{row.role}</td>

                  {/* 설명은 좌측 정렬 */}
                  <td className={CELL_C}>{row.desc}</td>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr className="h-[72px]">
                  <td colSpan={5} className="px-6 text-center text-sm text-gray-500">
                    등록된 계정이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 선택 상태 */}
        <div className="mt-3 text-sm text-gray-500">{selectionLabel}</div>
      </section>
    </div>
  );
}
