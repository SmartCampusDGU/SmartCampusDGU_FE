import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useSetActiveNav } from "@/hooks/common/useSetActiveNav";
import { useSetPageTitle } from "@/hooks/common/useSetPageTitle";
import ActionButton from "@/components/common/ActionButton";
import { SuccessModal } from "@/components/modals/SuccessModal";
import { DeleteTypeModal } from "@/components/modals/DeleteTypeModal";
import { useRegisterSensorMutation } from "@/state/mutations/sensors/useRegisterSensorMutation";
import { useDeleteSensorMutation } from "@/state/mutations/sensors/useDeleteSensorMutation";
import { useRoomsQuery } from "@/state/queries/facilities/useRoomsQuery";

/* ─────────────────────────────── 유틸 ─────────────────────────────── */
// 한글/영문/숫자/공백/-/_ 허용
const ROOM_NUMBER_REGEX = /^[\p{L}\p{N}\s\-_]+$/u;
const isValidRoomNumber = (v: string) =>
  v.trim().length > 0 && ROOM_NUMBER_REGEX.test(v);

// MAC 주소 검증
const MAC_REGEX = /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/;
const isValidMac = (v: string) => MAC_REGEX.test(v.trim());

/* ─────────────────────────────── 레이아웃 ─────────────────────────────── */
type LayoutOutletContext = { setExtraActions: (node: React.ReactNode) => void };
type Mode = "register" | "delete";

export default function SensorsPage() {
  useSetPageTitle("센서 설정");
  useSetActiveNav("sensor", "sensor-setting");

  const { setExtraActions } = useOutletContext<LayoutOutletContext>();
  const [mode, setMode] = useState<Mode>("register");
  const title = useMemo(
    () => (mode === "register" ? "센서 등록" : "센서 삭제"),
    [mode]
  );

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
          <h2 className="text-[20px] font-extrabold text-[#1F2937]">
            {title}
          </h2>
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

/* ─────────────────────────────── 폼: 등록 ─────────────────────────────── */
function SensorRegisterForm({
  onOpenSuccess,
}: {
  onOpenSuccess: (msg?: string) => void;
}) {
  const [roomNo, setRoomNo] = useState("");
  const [macAddress, setMacAddress] = useState("");
  const [apiError, setApiError] = useState("");

  const { data: roomsData } = useRoomsQuery();
  const { mutateAsync, isPending } = useRegisterSensorMutation({
    onError: (e: any) => {  
      const msg = e?.response?.data?.message || e?.message;

      if (msg?.includes("존재하지 않는 공간")) {
        setApiError("등록되지 않은 공간입니다. 공간을 먼저 등록해주세요.");
      } else if (msg?.includes("중복")) {
        setApiError("이미 등록된 센서입니다.");
      } else if (msg?.includes("MAC")) {
        setApiError("MAC 주소 형식이 올바르지 않습니다.");
      } else {
        setApiError("센서 등록 중 오류가 발생했습니다.");
      }
    },
  });

  const errors = {
    roomNo: !isValidRoomNumber(roomNo)
      ? "공간 이름을 확인해주세요. (문자/숫자/공백/-/_ 허용)"
      : "",
    macAddress: !isValidMac(macAddress)
      ? "MAC 주소 형식이 올바르지 않습니다. (예: 0C:7B:C8:FF:56:F1)"
      : "",
  };
  const isValid = !errors.roomNo && !errors.macAddress;

  const resolveRoomId = () => {
    const list = roomsData?.data?.rooms ?? [];
    const found = list.find((r: any) => r.roomNumber === roomNo.trim());
    return found?.id as number | undefined;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    if (!isValid) return;

    const roomId = resolveRoomId();
    if (!roomId) {
      setApiError("해당 강의실 번호를 찾을 수 없습니다.");
      return;
    }

    await mutateAsync({ roomId, macAddress: macAddress.trim() });
    onOpenSuccess("센서 등록이 완료되었습니다!");
    setRoomNo("");
    setMacAddress("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <Field
        label="№ 공간 이름"
        placeholder="예) 세미나실-1 / E-204 / 본관 B1-회의실"
        value={roomNo}
        onChange={setRoomNo}
        error={errors.roomNo}
      />
      <Field
        label="№ 센서 MAC 주소"
        placeholder="예) 0C:7B:C8:FF:56:F1"
        value={macAddress}
        onChange={setMacAddress}
        error={errors.macAddress}
      />
      {apiError && <p className="text-sm text-red-600">{apiError}</p>}
      <Submit
        label={isPending ? "등록 중..." : "등록하기"}
        disabled={!isValid || isPending}
      />
    </form>
  );
}

/* ─────────────────────────────── 폼: 삭제 ─────────────────────────────── */
function SensorDeleteForm({
  onOpenSuccess,
}: {
  onOpenSuccess: (msg?: string) => void;
}) {
  const [roomNo, setRoomNo] = useState("");
  const [macAddress, setMacAddress] = useState("");
  const [reason, setReason] = useState("");
  const [apiError, setApiError] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);

  const { mutateAsync, isPending } = useDeleteSensorMutation({
    onError: (e: any) => {
      const msg = e?.response?.data?.message || e?.message;

      if (msg?.includes("불일치")) {
        setApiError("강의실 번호와 MAC 주소가 일치하지 않습니다.");
      } else if (msg?.includes("존재하지 않음")) {
        setApiError("해당 센서를 찾을 수 없습니다.");
      } else if (msg?.includes("MAC")) {
        setApiError("MAC 주소 형식이 올바르지 않습니다.");
      } else {
        setApiError("센서 삭제 중 오류가 발생했습니다.");
      }
    },
  });

  const errors = {
    roomNo: !isValidRoomNumber(roomNo)
      ? "강의실 번호를 확인해주세요. (문자/숫자/공백/-/_ 허용)"
      : "",
    macAddress: !isValidMac(macAddress)
      ? "MAC 주소 형식이 올바르지 않습니다. (예: 0C:7B:C8:FF:56:F1)"
      : "",
  };
  const isValid = !errors.roomNo && !errors.macAddress;

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    if (!isValid) return;
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setConfirmOpen(false);
    setApiError("");

    try {
      + await mutateAsync({
        roomNumber: roomNo.trim(),
        macAddress: macAddress.trim(),
        deleteReason: reason.trim() || "미입력",
   });
 
      onOpenSuccess("센서 삭제가 완료되었습니다!");
      setRoomNo("");
      setMacAddress("");
      setReason("");
    } catch (error) {
      // onError에서 처리됨
    }
  };

  return (
    <>
      <form onSubmit={handleOpenConfirm} className="space-y-6" noValidate>
        <Field
          label="№ 공간 이름"
          placeholder="예) 세미나실-1 / E-204 / 본관 B1-회의실"
          value={roomNo}
          onChange={setRoomNo}
          error={errors.roomNo}
        />
        <Field
          label="№ 센서 MAC 주소"
          placeholder="예) 0C:7B:C8:FF:56:F1"
          value={macAddress}
          onChange={setMacAddress}
          error={errors.macAddress}
        />
        <Field
          label="📋 삭제 사유"
          placeholder="예) 공간 용도 변경 (강의실 → 창고)"
          value={reason}
          onChange={setReason}
        />
        {apiError && <p className="text-sm text-red-600">{apiError}</p>}
        <Submit
          label={isPending ? "삭제 중..." : "삭제하기"}
          disabled={!isValid || isPending}
        />
      </form>

      <DeleteTypeModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

/* ─────────────────────────────── 공통 UI ─────────────────────────────── */
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
      <label className="block text-[16px] font-semibold text-[#111827] mb-2">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full h-[56px] px-4 rounded-lg border bg-[#F7F7F7] outline-none text-[16px]
          ${
            invalid
              ? "border-red-400 focus:ring-2 focus:ring-red-300"
              : "border-gray-300 focus:ring-2 focus:ring-black/10"
          }`}
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
