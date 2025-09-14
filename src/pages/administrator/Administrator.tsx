// src/pages/Administrator.tsx
import { useMemo, useState } from "react";
import clsx from "clsx";
import { useSetPageTitle } from "@/hooks/common/useSetPageTitle";
import { useSetActiveNav } from "@/hooks/common/useSetActiveNav";
import RegisterAccountModal from "@/components/modals/RegisterAccountModal";
import EditAccountModal from "@/components/modals/EditAccountModal";
import { DeleteModal } from "@/components/modals/DeleteModal";
import { useAdminAccountsQuery } from "@/state/queries/admin/useAdminAccountsQuery";
import { useCreateAdminAccountMutation } from "@/state/mutations/admin/useCreateAdminAccountMutation";
import { useUpdateAdminAccountMutation } from "@/state/mutations/admin/useUpdateAdminAccountMutation";
import { useDeleteAdminAccountsMutation } from "@/state/mutations/admin/useDeleteAdminAccountsMutation";

/* ── 스타일 ─────────────────────────────── */
const CARD = "bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-200";
const TITLE = "text-[22px] font-extrabold";
const HEAD_BASE = "text-[17px] font-bold text-gray-900 py-3";
const HEAD_L = clsx(HEAD_BASE, "text-left px-6");
const HEAD_C = clsx(HEAD_BASE, "text-center px-8");
const ROW = "h-[68px] border-b border-gray-200";
const CELL_L = "px-6 text-[16px] text-gray-900 text-left";
const CELL_C = "px-8 text-[16px] text-gray-900 text-center";
const BTN = "h-10 px-5 rounded-lg font-semibold shadow-sm border disabled:opacity-50";
const BTN_SKY = clsx(BTN, "bg-[#CFE8FF] border-[#9AC9F3] hover:brightness-95");
const BTN_RED = clsx(BTN, "bg-[#FFD1D1] border-[#F2A2A2] hover:brightness-95");
const BTN_YEL = clsx(BTN, "bg-[#FFE9A9] border-[#F2CD6F] hover:brightness-95");

export default function AdministratorPage() {
  useSetPageTitle("관리자 계정 관리");
  useSetActiveNav("administrator", undefined);

  const { data: accounts = [], isLoading, isError } = useAdminAccountsQuery();
  const createMut = useCreateAdminAccountMutation();
  // const updateMut = useUpdateAdminAccountMutation();
  // const deleteMut = useDeleteAdminAccountsMutation();

  const [openRegister, setOpenRegister] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);


  const [selected, setSelected] = useState<Set<number>>(new Set());

  const rows = accounts; // 서버 데이터 (id 포함 가정)
  const allChecked = rows.length > 0 && selected.size === rows.length;

  const toggleOne = (id: number) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAll = () =>
    setSelected((prev) =>
      prev.size === rows.length ? new Set() : new Set(rows.map((r) => r.id))
    );

  const canEdit = selected.size === 1;
  const canDelete = selected.size >= 1;

  /** 선택된 단일 행 찾기 (id 기준) */
  const editRow = useMemo(() => {
    if (selected.size !== 1) return null;
    const id = [...selected][0];
    return rows.find((r) => r.id === id) ?? null;
  }, [selected, rows]);

  const selectionLabel = useMemo(
    () => (selected.size ? `선택됨: ${selected.size}개` : "선택된 항목 없음"),
    [selected.size]
  );

  const selectedIds = useMemo(() => [...selected], [selected]);
  const sampleIds = useMemo(() => selectedIds.slice(0, 5), [selectedIds]);

  const updateMut = useUpdateAdminAccountMutation();
  const deleteMut = useDeleteAdminAccountsMutation(); 

  /** 삭제 메시지는 username 보여주되, 내부는 id로 처리 */
  const deleteMessage = useMemo(() => {
    const n = selectedIds.length;
    if (n === 0) return "";
    const first = rows.find((r) => r.id === selectedIds[0]);
    if (n === 1) return `정말 '${first?.username}' 계정을 삭  제하시겠습니까?`;
    return `정말 '${first?.username}' 외 ${n - 1}개 계정을 삭제하시겠습니까?`;
  }, [selectedIds, rows]);

  if (isLoading) return <div className="p-6">불러오는 중...</div>;
  if (isError) return <div className="p-6 text-red-600">불러오기에 실패했습니다.</div>;

  return (
    <>
      <div className="w-full">
        <section className={clsx(CARD, "p-6 mt-6")}>
          <div className="flex items-center justify-between">
            <h2 className={TITLE}>계정 목록</h2>
            <div className="flex items-center gap-3">
              <button type="button" className={BTN_SKY} onClick={() => setOpenRegister(true)}>
                계정 등록
              </button>
              <button
                type="button"
                className={BTN_RED}
                onClick={() => setOpenDelete(true)}
                disabled={!canDelete}
              >
                계정 삭제
              </button>
              <button
                type="button"
                className={BTN_YEL}
                onClick={() => setOpenEdit(true)}
                disabled={!canEdit}
              >
                계정 수정
              </button>
            </div>
          </div>

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
                {rows.map((row) => (
                  <tr key={row.id} className={ROW}>
                    <td className="pl-6 pr-20">
                      <input
                        aria-label={`${row.username} 선택`}
                        type="checkbox"
                        className="h-4 w-4 align-middle"
                        checked={selected.has(row.id)}
                        onChange={() => toggleOne(row.id)}
                      />
                    </td>
                    <td className={clsx(CELL_L, "font-semibold")}>{row.username}</td>
                    <td className={CELL_C}>{"•".repeat(6)}</td>
                    <td className={CELL_C}>{row.name}</td>
                    <td className={CELL_C}>{row.description ?? "-"}</td>
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

      {/* 등록 모달 → POST /api/members */}
      {openRegister && (
        <RegisterAccountModal
          open={openRegister}
          onClose={() => setOpenRegister(false)}
          onSuccess={async (form) => {
            await createMut.mutateAsync({
              username: form.id,
              password: form.password,
              name: form.role,
              description: form.desc,
            });
            setOpenRegister(false);
          }}
        />
      )}

      {/* 수정 모달 → PATCH /api/members/:id */}
      {openEdit && editRow && (
        <EditAccountModal
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          initial={{
            id: editRow.id,                                  
            username: editRow.username,
            name: editRow.name,
            description: editRow.description ?? "",
          }}         
            onSave={async ({ id, body }) => {
            try {
            await updateMut.mutateAsync({ id, payload: body });
            setOpenEdit(false);
             } catch (err: any) {
            console.error("PATCH failed:", err?.response?.status, err?.response?.data ?? err);
            }
          }}
        />
      )}

      {/* 삭제 모달 */}
      {openDelete && (
        <DeleteModal
          open={openDelete}
          title="계정 삭제"
          confirmText="삭제하기"
          cancelText="취소"
          onClose={() => setOpenDelete(false)}
          onConfirm={async () => {
          if (selectedIds.length === 0) return;
          await deleteMut.mutateAsync(selectedIds);
          setSelected(new Set());
          setOpenDelete(false);
  }}
        >
          <div className="space-y-2 text-center">
            <p className="text-base">{deleteMessage}</p>
            <p className="text-sm text-gray-600">
              삭제 대상: 총 <b>{selectedIds.length}</b>개
            </p>
            {sampleIds.length > 0 && (
              <div className="text-sm">
                <div className="mb-1 text-gray-600">삭제 예정 아이디</div>
                <ul className="list-none space-y-0.5">
                  {sampleIds.map((id) => {
                    const r = rows.find((x) => x.id === id);
                    return (
                      <li key={id}>
                        <code className="px-1 py-0.5 bg-gray-100 rounded">
                          {r?.username ?? id}
                        </code>
                      </li>
                    );
                  })}
                </ul>
                {selectedIds.length > sampleIds.length && (
                  <div className="mt-1 text-gray-600">
                    … 외 {selectedIds.length - sampleIds.length}개
                  </div>
                )}
              </div>
            )}
            <p className="pt-1 text-[#B42318] text-sm">삭제 후에는 되돌릴 수 없습니다.</p>
          </div>
        </DeleteModal>
      )}
    </>
  );
}
