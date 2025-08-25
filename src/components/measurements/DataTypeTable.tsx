import { useState } from 'react';

type DataRow = {
  id: string;
  type: string; // 공간 타입
  dataTypes: string[]; // 수집 데이터 유형
};

const MOCK: DataRow[] = [
  { id: '1', type: '강의실', dataTypes: ['온도', '습도'] },
  { id: '2', type: '연구실', dataTypes: ['온도', 'TVOC'] },
  { id: '3', type: '전산실', dataTypes: ['온도', '습도'] },
  { id: '4', type: '사무실', dataTypes: ['온도', '습도'] },
];

export default function DataTypeTable() {
  const [rows] = useState<DataRow[]>(MOCK);

  return (
    <div className="w-full border-t border-[#ACACAC]">
      <table className="table-fixed w-full border-collapse">
        <colgroup>
          <col className="w-[64px]" />   {/* 체크박스 */}
          <col className="w-[200px]" />  {/* 공간 타입 */}
          <col />                        {/* 수집 데이터 유형 */}
          <col className="w-[160px]" />  {/* 상세보기 버튼 */}
        </colgroup>
        <thead>
          <tr>
            <Th />
            <Th>공간 타입</Th>
            <Th>수집 데이터 유형</Th>
            <Th>임계값 설정</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-[#E5E5E5]">
              <Td className="text-center">
                <input type="checkbox" className="w-4 h-4" />
              </Td>
              <Td className="text-center">{r.type}</Td>
              <Td className="text-center">
                {r.dataTypes.map((d, idx) => (
                  <span
                    key={idx}
                    className={`${
                      d === 'TVOC' ? 'font-bold text-black' : 'font-normal'
                    }`}
                  >
                    {d}
                    {idx < r.dataTypes.length - 1 && ', '}
                  </span>
                ))}
              </Td>
              <Td className="text-center">
                <button className="w-[173.535px] h-[56px] rounded border border-[#7C7C7C] bg-[#FFE9AE] text-[16px] font-semibold">
                  상세보기
                </button>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({
  className,
  children,
  ...rest
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={[
        'h-[42px] text-center text-[14px] font-semibold text-black',
        'border-b border-[#ACACAC] bg-white px-3',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
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
      className={[
        'h-[52px] align-middle text-[14px] text-black px-3',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </td>
  );
}