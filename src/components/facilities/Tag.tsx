export type TagVariant = 
  | "temperature"   // 온도
  | "humidity"      // 습도
  | "tvoc"          // TVOC
  | "noise"         // 주변 소음
  | "airQuality"    // IAQ Index, AQM Scores
  | "power"         // Battery, USB Powered
  | "network"       // RSSI, Missed Connections
  | "interaction"   // Button Pressed
  | "default";

interface TagProps {
  label: string;
  variant: TagVariant;
}

// 각 Variant별 스타일 정의
const VARIANT_STYLE: Record<TagVariant, string> = {
  // 1. 온도 (분홍)
  temperature: "border-[2px] border-[#E14D88] bg-[#FFD9E8]",
  
  // 2. 습도 (주황)
  humidity: "border border-[#EA8F35] bg-[#FFF6EC]",
  
  // 3. TVOC (연두/초록)
  tvoc: "border border-[#6ACA4D] bg-[#F8FFF5]",
  
  // 4. 소음 (보라)
  noise: "border border-[#8B5CF6] bg-[#F3E8FF]",

  // 5. 공기질 점수 관련 (IAQ, AQM) - (하늘/파랑)
  airQuality: "border border-[#0EA5E9] bg-[#E0F2FE]",

  // 6. 전원/배터리 (노랑/골드)
  power: "border border-[#EAB308] bg-[#FEF9C3]",

  // 7. 네트워크/연결 (회색/슬레이트)
  network: "border border-[#64748B] bg-[#F1F5F9]",

  // 8. 버튼/상호작용 (인디고)
  interaction: "border border-[#6366F1] bg-[#EEF2FF]",

  // 기본값
  default: "border border-[#BBBBBB] bg-[#F5F5F5]",
};

export default function Tag({ label, variant }: TagProps) {
  return (
    <span
      className={`
        inline-flex px-3 py-1 justify-center items-center gap-[10px]
        rounded-[13px] text-[14px] font-medium text-black whitespace-nowrap
        ${VARIANT_STYLE[variant] || VARIANT_STYLE.default}
      `}
    >
      {label}
    </span>
  );
}