import clsx from "clsx"; 

type Variant = "view" | "register" | "delete"| "tab-active" | "tab-inactive";

interface ActionButtonProps {
  label: string;
  variant: Variant;
  onClick?: () => void;
  disabled?: boolean;
  className?: string; // 추가 커스터마이징용
}

const variantClasses: Record<Variant, string> = {
  view: "bg-[#FFE9AE]",
  register: "bg-[#EEFFDB]",
  delete: "bg-[rgba(255, 190, 144, 0.36)]",
  "tab-active": "bg-[#FFE9AE] text-[27px] font-extrabold",   // 탭 선택됨
  "tab-inactive": "bg-[#D9D9D9] text-[27px] font-extrabold", // 탭 비활성
};

export default function ActionButton({
  label,
  variant,
  onClick,
  disabled = false,
  className,
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "h-[56px] px-6 rounded border border-[#7C7C7C] text-[16px] font-semibold text-black",
        variantClasses[variant],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {label}
    </button>
  );
}