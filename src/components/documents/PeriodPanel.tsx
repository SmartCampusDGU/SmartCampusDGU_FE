import { useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { RightArrowIcon } from "@/assets/icons/RightArrowIcon";
import { DownloadIcon } from "@/assets/icons/DownloadIcon";
import DateBoxOnlyIcon from "./DateBox";
import styles from "./DatePicker.module.css";

type PeriodPanelProps = {
  onPreview?: (url: string) => void;
};

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function addMonths(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

function formatYM(d: Date | null) {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function buildPreviewUrl(s: Date | null, e: Date | null) {
  const qs = new URLSearchParams({
    start: formatYM(s),
    end: formatYM(e),
  }).toString();
  return `/api/reports/preview?${qs}`;
}

export default function PeriodPanel({ onPreview }: PeriodPanelProps) {
  const [start, setStart] = useState<Date | null>(startOfMonth(new Date()));
  const [end, setEnd] = useState<Date | null>(addMonths(startOfMonth(new Date()), 1));
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  const pickerCommon = useMemo(
    () => ({
      dateFormat: "yyyy-MM",
      showMonthYearPicker: true,
      renderMonthContent: (month: number) => <span>{month + 1}</span>,
      startDate: start ?? undefined,
      endDate: end ?? undefined,
    }),
    [start, end]
  );

  // 종료일은 항상 시작일보다 늦게: minEnd = start + 1개월
  const minEnd = start ? addMonths(start, 1) : undefined;
  // 시작일은 (있다면) end - 1개월까지
  const maxStart = end ? addMonths(end, -1) : undefined;

  return (
    <div className="relative bg-[var(--white)] w-[1010px] h-[725px] mx-auto">
      {/* 타이틀 */}
      <div className="px-6 pt-5 pb-3">
        <div className="text-[18px] font-bold">기간 설정</div>
        <div className="mt-3 h-px w-full bg-[#E5E5E5]" />
      </div>

      {/* 중앙 화살표 + 시작/종료 라인 */}
      <div className="relative mt-10 h-[80px]">
        {/* 중앙 화살표 */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
          <RightArrowIcon />
        </div>

        {/* 시작일 */}
        <div className="absolute left-1/2 -translate-x-[calc(100%+100px)] flex items-center">
          <div className="shrink-0 inline-block align-middle">
            <DatePicker
              selected={start ?? undefined}
              onChange={(d) => {
                if (!d) return;
                const ns = startOfMonth(d);
                setStart(ns);
                // 현재 end가 ns보다 이르거나 같으면 end를 자동으로 ns+1개월로 보정
                setEnd((prev) => {
                  if (!prev || prev <= ns) return addMonths(ns, 1);
                  return startOfMonth(prev);
                });
                setOpenStart(false);
              }}
              {...pickerCommon}
              maxDate={maxStart}
              open={openStart}
              onCalendarClose={() => setOpenStart(false)}
              calendarClassName={styles.dp}
              popperClassName={styles.popper}
              customInput={
                <DateBoxOnlyIcon
                  onIconClick={() => setOpenStart(true)}
                  value={formatYM(start)}
                />
              }
              selectsStart
            />
          </div>

          {/* 종료일 쪽 버튼 공간 통일용 */}
          <div style={{ width: 30, flex: "0 0 30px" }} aria-hidden />
          <div className="w-[96px] h-[36px] shrink-0" aria-hidden />
        </div>

        {/* 종료일 */}
        <div className="absolute left-1/2 translate-x-[100px] flex items-center">
          <div className="shrink-0 inline-block align-middle">
            <DatePicker
              selected={end ?? undefined}
              onChange={(d) => {
                if (!d) return;
                const ne = startOfMonth(d);
                // 시작일보다 빠르거나 같게 고르려 하면 강제로 start+1개월로 보정
                if (start && ne <= start) {
                  setEnd(addMonths(start, 1));
                } else {
                  setEnd(ne);
                }
                setOpenEnd(false);
              }}
              {...pickerCommon}
              minDate={minEnd}
              open={openEnd}
              onCalendarClose={() => setOpenEnd(false)}
              calendarClassName={styles.dp}
              popperClassName={styles.popper}
              customInput={
                <DateBoxOnlyIcon
                  onIconClick={() => setOpenEnd(true)}
                  value={formatYM(end)}
                />
              }
              selectsEnd
            />
          </div>

          {/* 버튼 간격 */}
          <div style={{ width: 30, flex: "0 0 30px" }} aria-hidden />

          <button
            type="button"
            onClick={() => onPreview?.(buildPreviewUrl(start, end))}
            className="
              w-[159px] h-[52px]
              border border-[#7C7C7C] rounded-[8px] bg-[#FFF2D9]
              text-[16px] font-bold text-black leading-normal text-center
              inline-flex items-center justify-center
              shrink-0
              [font-family:Inter]
            "
          >
            미리보기
          </button>
        </div>
      </div>

      {/* 하단 중앙 다운로드 버튼 */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-5">
        <button
          type="button"
          className="
            mt-[300px] w-[232px] h-[52px]
            rounded-[8px] border border-[#E5E5E5] bg-[#FFE9AE]
            text-[16px] font-bold text-black leading-normal text-center
            inline-flex items-center justify-center gap-3 whitespace-nowrap
            [font-family:Inter]
          "
        >
          <span>다운로드하기</span>
          <DownloadIcon />
        </button>
      </div>
    </div>
  );
}