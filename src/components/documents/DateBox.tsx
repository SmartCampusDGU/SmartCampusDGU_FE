// src/components/documents/DateBoxOnlyIcon.tsx
import { forwardRef } from "react";
import { CalendarIcon } from "@/assets/icons/CalendarIcon";

type Props = {
  value?: string;
  onIconClick?: () => void;
};

export const DateBoxOnlyIcon = forwardRef<HTMLDivElement, Props>(
  ({ value, onIconClick }, ref) => {
    return (
      <div
        ref={ref}
        className="
          inline-flex h-[40px] px-[16px] pl-[30px]
          justify-end items-center gap-[23px]
          rounded-[10px] border border-[#A6C6FA] bg-white
          select-none
        "
        // 박스 자체 클릭은 무시 (아이콘만 동작)
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-[#87898C] font-inter text-[16px] font-normal leading-[24px]">
          {value}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onIconClick?.();
          }}
          className="
            inline-flex items-center justify-center
            appearance-none bg-transparent p-0 m-0 border-0
            outline-none focus:outline-none focus:ring-0
            hover:bg-transparent active:bg-transparent
            cursor-pointer
          "
          style={{ WebkitAppearance: "none" }}
          aria-label="달력 열기"
        >
          <CalendarIcon />
        </button>
      </div>
    );
  }
);
DateBoxOnlyIcon.displayName = "DateBoxOnlyIcon";

export default DateBoxOnlyIcon;