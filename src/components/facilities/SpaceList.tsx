import { useMemo, useState } from 'react';
import Tag from '@/components/facilities/Tag'

type SpaceType = '강의실' | '실험실';

type SpaceRow = {
  id: string;
  type: SpaceType;
  roomNo: string;
  tags: Array<'temperature' | 'humidity' | 'co2' | 'tvoc'>;
};

const MOCK: SpaceRow[] = [
  { id: '1',  type: '강의실', roomNo: '1001', tags: ['temperature', 'humidity'] },
  { id: '2',  type: '실험실', roomNo: '1002', tags: ['tvoc'] },
  { id: '3',  type: '강의실', roomNo: '1003', tags: [] },
  { id: '4',  type: '실험실', roomNo: '1004', tags: [] },
  { id: '5',  type: '강의실', roomNo: '1005', tags: ['temperature', 'co2'] },
  { id: '6',  type: '실험실', roomNo: '1006', tags: ['temperature', 'tvoc'] },
  { id: '7',  type: '강의실', roomNo: '1007', tags: [] },
  { id: '8',  type: '실험실', roomNo: '1008', tags: ['humidity'] },
];

export default function SpaceList() {
  const [active, setActive] = useState<SpaceType>('실험실'); // 기본 탭

  const rows = useMemo(
    () => MOCK.filter((r) => r.type === active),
    [active]
  );

  return (
    <div className="w-full">
      {/* 헤더 타이틀 라인 */}
      <div className="flex items-center gap-[52px] mb-3">
        <h2 className="text-[20px] font-bold">공간 리스트</h2>
      {/* 탭 영역 */}
      <div className="flex gap-[52px]">
        <TabButton
          active={active === '강의실'}
          onClick={() => setActive('강의실')}
        >
          강의실
        </TabButton>
        <TabButton
          active={active === '실험실'}
          onClick={() => setActive('실험실')}
        >
          실험실
        </TabButton>
      </div>
       </div>

      {/* 테이블 */}
      <div className="w-full border-t border-[#ACACAC]">
        <table className="table-fixed w-full mx-auto border-collapse">
         <colgroup>
  <col className="w-[12%]" />  {/* 체크박스 (↑) */}
    <col className="w-[28%]" />  {/* 공간명   (↓) */}
    <col className="w-[46%]" />  {/* 커스텀 데이터 (↓) */}
    <col className="w-[14%]" />  {/* 상세페이지 (↑) */}
</colgroup>
          <thead>
            <tr>
              <Th />
              <Th>공간명</Th>
              <Th>커스텀 데이터</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-[#E5E5E5]">
                <Td className="text-center">
                  <input type="checkbox" className="w-4 h-4" />
                </Td>
                <Td className="text-center">{r.roomNo}</Td>
                <Td className="text-center">
                  <div className="flex justify-center items-center gap-2 py-2">
                    {r.tags.map((t, idx) => (
                      <Tag
                        key={`${r.id}-${t}-${idx}`}
                        label={
                          t === 'temperature'
                            ? '온도'
                            : t === 'humidity'
                            ? '습도'
                            : t === 'co2'
                            ? 'CO2'
                            : 'TVOC'
                        }
                        variant={
                          t === 'temperature'
                            ? 'temperature'
                            : t === 'humidity'
                            ? 'humidity'
                            : t === 'co2'
                            ? 'co2'
                            : 'tvoc'
                        }
                      />
                    ))}
                  </div>
                </Td>
                <Td className="text-right">
                  <button className="px-3 py-1 rounded border border-[#ACACAC] bg-white hover:bg-[#F6F6F6]">
                    상세페이지
                  </button>
                </Td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <Td colSpan={4} className="text-center py-8 text-[#7C7C7C]">
                  해당 유형의 공간이 없습니다.
                </Td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
  );
}

/* 탭 버튼 - 이미지와 유사한 느낌(활성: 노랑 배경, 비활성: 회색 박스) */
function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={
        active
          ? 'w-[182px] h-[56px] shrink-0 border border-[#7C7C7C] bg-[#FFE9AE] text-black font-semibold'
          : 'w-[182px] h-[56px] shrink-0 border border-[#7C7C7C] bg-[#D9D9D9] text-black'
      }
    >
      <span
        className="text-center font-inter text-[27px] font-extrabold leading-normal text-[#1A1A1A]"
        style={{
          WebkitTextStrokeWidth: '1px',
          WebkitTextStrokeColor: '#7C7C7C',
        }}
      >
        {children}
      </span>
    </button>
  );
}

function Th({
  className,
  children,
  ...rest
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={
        [
          'h-[42px] text-center text-[14px] font-semibold text-black',
          'border-b border-[#ACACAC] bg-white',
          'px-3',
          className,
        ].filter(Boolean).join(' ')
      }
      {...rest}
    >
      {children}
    </th>
  );
}

function Td({
  className,
  children,
  ...rest
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={
        [
          'h-[52px] align-middle text-[14px] text-black px-3',
          className,
        ].filter(Boolean).join(' ')
      }
      {...rest}
    >
      {children}
    </td>
  );
}