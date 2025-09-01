// src/pages/Administrator.tsx
import { useMemo, useState } from "react";
import clsx from "clsx";
import { useSetPageTitle } from "@/hooks/common/useSetPageTitle";
import { useSetActiveNav } from "@/hooks/common/useSetActiveNav";
import RegisterAccountModal from "@/components/modals/RegisterAccountModal";
import EditAccountModal from "@/components/modals/EditAccountModal";
import { DeleteModal } from "@/components/modals/DeleteModal"; 

type Account = { id: string; password: string; role: string; desc: string };

/* ── 스타일 ─────────────────────────────── */
const CARD = "bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-200";
const TITLE = "text-[22px] font-extrabold";
const HEAD_BASE = "text-[17px] font-bold text-gray-900 py-3";
const HEAD_L = clsx(HEAD_BASE, "text-center px-6");
const HEAD_C = clsx(HEAD_BASE, "text-center px-8");
const ROW = "h-[68px] border-b border-gray-200";
const CELL_L = "px-6 text-[16px] text-gray-900 text-center";
const CELL_C = "px-8 text-[16px] text-gray-900 text-center";
const BTN = "h-10 px-5 rounded-lg font-semibold shadow-sm border disabled:opacity-50";
const BTN_SKY = clsx(BTN, "bg-[#CFE8FF] border-[#9AC9F3] hover:brightness-95");
const BTN_RED = clsx(BTN, "bg-[#FFD1D1] border-[#F2A2A2] hover:brightness-95");
const BTN_YEL = clsx(BTN, "bg-[#FFE9A9] border-[#F2CD6F] hover:brightness-95");

export default function AdministratorPage() {
  useSetPageTitle("관리자 계정 관리");
  useSetActiveNav("administrator", undefined);

  const [openRegister, setOpenRegister] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false); //  삭제 모달

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

  const editRow = useMemo(() => {
    if (selected.size !== 1) return null;
    const id = [...selected][0];
    return rows.find(r => r.id === id) ?? null;
  }, [selected, rows]);

  const onEdit = () => {
    if (!canEdit) return;
    setOpenEdit(true);
  };
  const onDelete = () => {
    if (!canDelete) return;
    setOpenDelete(true); 
  };

  const selectionLabel = useMemo(
    () => (selected.size ? `선택됨: ${selected.size}개` : "선택된 항목 없음"),
    [selected.size]
  );

  //  모달용 도우미
  const selectedIds = useMemo(() => [...selected], [selected]);
  const sampleIds = useMemo(() => selectedIds.slice(0, 5), [selectedIds]);
  const deleteMessage = useMemo(() => {
    const n = selectedIds.length;
    if (n === 0) return "";
    if (n === 1) return `정말 '${selectedIds[0]}' 계정을 삭제하시겠습니까?`;
    return `정말 '${selectedIds[0]}' 외 ${n - 1}개 계정을 삭제하시겠습니까?`;
  }, [selectedIds]);

  return (
    <>
      <div className="w-full">
        <section className={clsx(CARD, "p-6 mt-6")}>
          {/* 상단: 제목 + 버튼 */}
          <div className="flex items-center justify-between">
            <h2 className={TITLE}>계정 목록</h2>
            <div className="flex items-center gap-3">
              <button type="button" className={BTN_SKY} onClick={() => setOpenRegister(true)}>
                계정 등록
              </button>
              <button type="button" className={BTN_RED} onClick={onDelete} disabled={!canDelete}>
                계정 삭제
              </button>
              <button type="button" className={BTN_YEL} onClick={onEdit} disabled={!canEdit}>
                계정 수정
              </button>
            </div>
          </div>

          {/* 표 */}
          <div className="mt-4 w-full overflow-x-auto">
            <table className="w-full table-fixed border-collapse">
              <colgroup>
                <col style={{ width: 260 }} />
                <col style={{ width: 260 }} />
                <col style={{ width: 260 }} />
                <col style={{ width: 450 }} />
                <col />
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
                    <td className={clsx(CELL_L, "font-semibold")}>{row.id}</td>
                    <td className={CELL_C}>{"•".repeat(Math.max(6, row.password.length))}</td>
                    <td className={CELL_C}>{row.role}</td>
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

          <div className="mt-3 text-sm text-gray-500">{selectionLabel}</div>
        </section>
      </div>

      {/*  계정 등록 모달 */}
      {openRegister && (
        <RegisterAccountModal
          open={openRegister}
          onClose={() => setOpenRegister(false)}
          onSuccess={(newAccount) => {
            setRows(prev => [...prev, newAccount]);
            setOpenRegister(false);
          }}
        />
      )}

      {/*  계정 수정 모달 */}
      {openEdit && editRow && (
        <EditAccountModal
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          initial={{
            id: editRow.id,
            role: editRow.role,
            desc: editRow.desc,
            password: editRow.password,
          }}
          onSave={(form) => {
            setRows(prev =>
              prev.map(r =>
                r.id === editRow.id
                  ? { id: r.id, role: form.role, desc: form.desc, password: form.password }
                  : r
              )
            );
            setOpenEdit(false);
          }}
          // editableId // 필요 시 true로 바꾸면 아이디도 수정 가능
        />
      )}

      {/* 계정 삭제 모달 (기본 DeleteModal 재사용) */}
      {openDelete && (
        <DeleteModal
          open={openDelete}
          title="계정 삭제"
          confirmText="삭제하기"
          cancelText="취소"
          onClose={() => setOpenDelete(false)}
          onConfirm={() => {
            setRows(prev => prev.filter(r => !selected.has(r.id)));
            setSelected(new Set());
            setOpenDelete(false);
          }}
        >
          <div className="space-y-2 text-center">
            <p className="text-base">{deleteMessage}</p>

            {/* 선택 개수 요약 */}
            <p className="text-sm text-gray-600">
              삭제 대상: 총 <b>{selectedIds.length}</b>개
            </p>

            {/* 아이디 미리보기 */}
            {sampleIds.length > 0 && (
              <div className="text-sm">
                <div className="mb-1 text-gray-600">삭제 예정 아이디</div>
                <ul className="list-none  space-y-0.5">
                  {sampleIds.map((id) => (
                    <li key={id}>
                      <code className="px-1 py-0.5 bg-gray-100 rounded">{id}</code>
                    </li>
                  ))}
                </ul>
                {selectedIds.length > sampleIds.length && (
                  <div className="mt-1 text-gray-600">
                    … 외 {selectedIds.length - sampleIds.length}개
                  </div>
                )}
              </div>
            )}

            {/* 경고 문구 */}
            <p className="pt-1 text-[#B42318] text-sm">
              삭제 후에는 되돌릴 수 없습니다.
            </p>
          </div>
        </DeleteModal>
      )}
    </>
  );
}
