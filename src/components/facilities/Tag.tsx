type TagVariant = "temperature" | "humidity" | "co2" | "tvoc";

interface TagProps {
  label: string;
  variant: TagVariant;
}

const VARIANT_STYLE: Record<TagVariant, string> = {
  temperature: "border-[2px] border-[#E14D88] bg-[#FFD9E8]", // 온도
  humidity: "border border-[#EA8F35] bg-[#FFF6EC]",          // 습도
  co2: "border border-[#565DBB] bg-[#F0F1FF]",               // CO2
  tvoc: "border border-[#6ACA4D] bg-[#F8FFF5]",              // TVOC
};

export default function Tag({ label, variant }: TagProps) {
  return (
    <span
      className={`
        inline-flex px-3 py-1 justify-center items-center gap-[10px]
        rounded-[13px] text-[14px] font-medium text-black
        ${VARIANT_STYLE[variant]}
      `}
    >
      {label}
    </span>
  );
}