import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useSetActiveNav } from "@/hooks/common/useSetActiveNav";
import { useSetPageTitle } from "@/hooks/common/useSetPageTitle";
import ActionButton from "@/components/common/ActionButton";
import { SuccessModal } from "@/components/modals/SuccessModal";
import { DeleteTypeModal } from "@/components/modals/DeleteTypeModal";
import { useRegisterSensorMutation } from "@/state/mutations/sensors/useRegisterSensorMutation";
import { useDeleteSensorMutation } from "@/state/mutations/sensors/useDeleteSensorMutation";

type LayoutOutletContext = { setExtraActions: (node: React.ReactNode) => void };
type Mode = "register" | "delete";

export default function SensorsPage() {
  useSetPageTitle("센서 설정");
  useSetActiveNav("sensor", "sensor-setting");

  const { setExtraActions } = useOutletContext<LayoutOutletContext>();
  const [mode, setMode] = useState<Mode>("register");
  const title = useMemo(() => (mode === "register" ? "센서 등록" : "센서 삭제"), [mode]);

  // 공용 성공 모달
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("센서 등록이 완료되었습니다!");

  useEffect(() => {
    setExtraActions(
      <div className="flex items-center">
        <ActionButton
          variant={mode === "register" ? "tab-active" : "tab-inactive"}
          label="센서 등록"
          onClick={() => setMode("register")}
          className="mr-[30px]"
        />
        <ActionButton
          variant={mode === "delete" ? "tab-active" : "tab-inactive"}
          label="센서 삭제"
          onClick={() => setMode("delete")}
        />
      </div>
    );
    return () => setExtraActions(null);
  }, [mode, setExtraActions]);

  return (
    <>
      <section className="mt-6 bg-white rounded-lg border border-gray-200 w-full max-w-[1000px] h-[610px] mx-auto flex flex-col">
        {/* 헤더 */}
        <div className="px-6 pt-5 pb-3 border-b">
          <h2 className="text-[20px] font-extrabold text-[#1F2937]">{title}</h2>
        </div>

        {/* 본문 */}
        <div className="flex-1 flex justify-start items-start p-8">
          <div className="w-full">
            {mode === "register" ? (
              <SensorRegisterForm
                onOpenSuccess={(msg) => {
                  setSuccessMsg(msg ?? "센서 등록이 완료되었습니다!");
                  setSuccessOpen(true);
                }}
              />
            ) : (
              <SensorDeleteForm
                onOpenSuccess={(msg) => {
                  setSuccessMsg(msg ?? "센서 삭제가 완료되었습니다!");
                  setSuccessOpen(true);
                }}
              />
            )}
          </div>
        </div>
      </section>

      {/* 성공 모달 */}
      <SuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        message={successMsg}
        autoCloseMs={1500}
      />
    </>
  );
}

/* ───────────────── 폼: 등록 ───────────────── */
function SensorRegisterForm({
  onOpenSuccess,
}: {
  onOpenSuccess: (msg?: string) => void;
}) {
  const [roomNo, setRoomNo] = useState("");
  const [serial, setSerial] = useState("");
  const [apiError, setApiError] = useState("");

  const { mutateAsync, isPending } = useRegisterSensorMutation({
    onError: (e: any) => {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "센서 등록 중 오류가 발생했습니다.";
      setApiError(msg);
    },
  });

  const errors = {
    roomNo: !roomNo.trim() ? "강의실 번호를 입력해주세요." : "",
    serial: !serial.trim() ? "센서 MAC 주소를 입력해주세요." : "",
  };
  const isValid = !errors.roomNo && !errors.serial;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    if (!isValid) return;

    // !! 문제 부분
    const roomId = Number(roomNo);
    if (Number.isNaN(roomId)) {
      setApiError("강의실 번호는 숫자여야 합니다.");
      return;
    }

    await mutateAsync({ roomId, macAddress: serial });
    onOpenSuccess("센서 등록이 완료되었습니다!");
    setRoomNo("");
    setSerial("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <Field
        label="№ 강의실 번호"
        placeholder="센서를 설치할 강의실 번호 숫자를 입력해주세요"
        value={roomNo}
        onChange={setRoomNo}
        error={errors.roomNo}
      />
      <Field
        label="№ 센서 MAC 주소"
        placeholder="(예) 0C:7B:C8:FF:56:F1"
        value={serial}
        onChange={setSerial}
        error={errors.serial}
      />
      {apiError && <p className="text-sm text-red-600">{apiError}</p>}
      <Submit label={isPending ? "등록 중..." : "등록하기"} disabled={!isValid || isPending} />
    </form>
  );
}

/* ───────────────── 폼: 삭제 ───────────────── */
function SensorDeleteForm({
  onOpenSuccess,
}: {
  onOpenSuccess: (msg?: string) => void;
}) {
  const [roomNo, setRoomNo] = useState("");
  const [serial, setSerial] = useState("");
  const [reason, setReason] = useState("");
  const [apiError, setApiError] = useState("");

  // 삭제 확인 모달
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { mutateAsync, isPending } = useDeleteSensorMutation({
    onError: (e: any) => {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "센서 삭제 중 오류가 발생했습니다.";
      setApiError(msg);
    },
  });

  const errors = {
    roomNo: !roomNo.trim() ? "강의실 번호를 입력해주세요." : "",
    serial: !serial.trim() ? "센서 MAC 주소를 입력해주세요." : "",
  };
  const isValid = !errors.roomNo && !errors.serial;

  // 삭제 버튼 클릭 시: 먼저 검증 → 확인 모달 열기
  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    if (!isValid) return;
    setConfirmOpen(true);
  };

  // 확인 모달에서 실제 API 호출
  const handleConfirmDelete = async () => {
    setConfirmOpen(false);
    setApiError("");

    // !! 문제부분
    const sensorId = Number(serial);
    if (Number.isNaN(sensorId)) {
      setApiError("개발수정사항");
      return;
    }

    await mutateAsync({
      path: { sensorId },
      body: { deleteReason: reason || "미입력" },
    });

    onOpenSuccess("센서 삭제가 완료되었습니다!");
    setRoomNo("");
    setSerial("");
    setReason("");
  };

  return (
    <>
      <form onSubmit={handleOpenConfirm} className="space-y-6" noValidate>
        <Field
          label="№ 강의실 번호"
          placeholder="센서를 삭제할 강의실 번호 숫자를 입력해주세요"
          value={roomNo}
          onChange={setRoomNo}
          error={errors.roomNo}
        />
        <Field
          label="№ 센서 MAC 주소"
          placeholder="(예) 0C:7B:C8:FF:56:F1"
          value={serial}
          onChange={setSerial}
          error={errors.serial}
        />
        <Field
          label="📋 삭제 사유"
          placeholder="공간 용도 변경 (강의실 → 창고)"
          value={reason}
          onChange={setReason}
        />
        {apiError && <p className="text-sm text-red-600">{apiError}</p>}
        <Submit label={isPending ? "삭제 중..." : "삭제하기"} disabled={!isValid || isPending} />
      </form>

      {/* 삭제 확인 모달 */}
      <DeleteTypeModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

/* ───────────────── 공통 UI ───────────────── */
function Field({
  label,
  value,
  onChange,
  placeholder,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
}) {
  const invalid = Boolean(error);
  return (
    <div>
      <label className="block text-[16px] font-semibold text-[#111827] mb-2">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full h-[56px] px-4 rounded-lg border bg-[#F7F7F7] outline-none text-[16px]
          ${invalid ? "border-red-400 focus:ring-2 focus:ring-red-300" : "border-gray-300 focus:ring-2 focus:ring-black/10"}`}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${label}-error` : undefined}
      />
      {invalid && (
        <p id={`${label}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function Submit({ label, disabled }: { label: string; disabled?: boolean }) {
  return (
    <div className="pt-5">
      <button
        type="submit"
        disabled={disabled}
        className="w-full h-[56px] rounded-lg bg-[#DA5B00] text-white font-bold text-[18px] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {label}
      </button>
    </div>
  );
}
