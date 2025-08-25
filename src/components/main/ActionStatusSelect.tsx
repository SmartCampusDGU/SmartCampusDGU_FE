import { useEffect, useRef, useState } from 'react';

export type ActionStatus = 'none' | 'planned' | 'in-progress' | 'done';

const ACTION_TEXT: Record<ActionStatus, string> = {
  none: '미조치',
  planned: '조치 예정',
  'in-progress': '조치 중',
  done: '조치 완료',
};

type Props = {
  value: ActionStatus;
  onChange: (v: ActionStatus) => void;
};

export default function ActionStatusSelect({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const options: ActionStatus[] = ['none', 'planned', 'in-progress', 'done'];

  return (
    // Td 가 h-[44px] px-3 이므로 좌우 패딩 상쇄
    <div className="relative h-[44px] w-full" ref={ref}>
      {/* 트리거: 기본은 투명/검정, 열렸을 때 #DA5B00 36% + 흰색 */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full h-full flex items-center justify-center outline-none border-0
          ${open ? 'bg-[rgba(218,91,0,0.36)] text-white' : 'bg-transparent text-black'}
        `}
      >
        <span className="text-[13px]">{ACTION_TEXT[value]}</span>
        <span className="ml-1">{open ? '▲' : '▼'}</span>
      </button>

      {/* 드롭다운: 전체 배경을 #FFCBA6 36%로 */}
      {open && (
        <div className="absolute left-0 top-full z-20 w-full bg-[rgba(255,203,166,0.36)]">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="w-full h-[44px] flex items-center justify-center text-[13px] text-black"
            >
              {ACTION_TEXT[opt]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}