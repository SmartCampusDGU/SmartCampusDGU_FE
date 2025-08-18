import { useEffect, useState } from 'react'
import clsx from 'clsx'

/** ===== 타입 ===== */
type NavItem = { key: string; label: string; href?: string }
type NavGroup = { key: string; label: string; items?: NavItem[] }

type SidebarProps = {
  /** 현재 페이지가 속한 대분류 key (예: 'facility', 'sensor', 'doc' ...) */
  activeGroupKey?: string
  /** 현재 상세 버튼 key (예: 'room-list', 'alert' ...) */
  activeItemKey?: string
  /** 라우팅 없을 때도 동작하도록 콜백 제공 */
  onNavigate?: (href?: string, g?: string, i?: string) => void
}

/** ===== 색상/보더 ===== */
const BORDER = 'border border-[#7C7C7C]'
const ACTIVE_GROUP_BG = 'bg-[rgba(218,91,0,0.36)]'
const ACTIVE_ITEM_BG = 'bg-[rgba(218,91,0,0.07)]'

/** ===== 전역 메뉴 데이터 ===== */
export const NAV_GROUPS: NavGroup[] = [
  { key: 'search', label: '조회', items: [{ key: 'abnormal', label: '이상치 조회' }] },
  {
    key: 'facility',
    label: '시설 관리',
    items: [{ key: 'room-list', label: '공간 리스트' }],
  },
  {
    key: 'sensor',
    label: '센서 관리',
    items: [
      { key: 'sensor-setting', label: '센서 설정' },
      { key: 'type-threshold', label: '유형별 센서 설정' },
      { key: 'alert', label: '알림 설정' },
    ],
  },
  { key: 'doc', label: '문서 작업' },                    // ← items 없음 (대메뉴 단독)
  { key: 'admin', label: '관리자 계정 관리' },           // ← items 없음 (대메뉴 단독)
]

export default function Sidebar({
  activeGroupKey,
  activeItemKey,
  onNavigate,
}: SidebarProps) {
  const [open, setOpen] = useState<Record<string, boolean>>({})

  // 현재 활성 그룹은 자동으로 펼치기
  useEffect(() => {
    if (activeGroupKey) {
      setOpen((prev) => ({ ...prev, [activeGroupKey]: true }))
    }
  }, [activeGroupKey])

  return (
    <aside className="w-[220px] shrink-0 bg-[#F7FCFF] border-r border-gray-200">
      <div className="p-3">
        <nav className="flex flex-col gap-2">
          {NAV_GROUPS.map((g) => {
            const isActiveGroup = g.key === activeGroupKey
            const hasItems = !!g.items?.length
            const isOpen = open[g.key]

            const handleGroupClick = () => {
              if (hasItems) {
                setOpen((prev) => ({ ...prev, [g.key]: !prev[g.key] }))
              } else {
                // 하위 메뉴가 없으면 곧바로 그룹 내비게이션
                onNavigate?.(undefined, g.key, undefined)
              }
            }

            return (
              <div key={g.key}>
                {/* 그룹 버튼 */}
                <button
                  className={clsx(
                    'w-full h-10 px-3 text-left text-[14px] rounded-[6px] flex items-center justify-between',
                    BORDER,
                    isActiveGroup ? ACTIVE_GROUP_BG : 'bg-white hover:bg-gray-50'
                  )}
                  onClick={handleGroupClick}
                >
                  <span className="truncate">{g.label}</span>
                  {/* 하위가 있을 때만 토글 화살표 표시 */}
                  {hasItems && (
                    <span className="text-gray-500">{isOpen ? '▾' : '▸'}</span>
                  )}
                </button>

                {/* 상세 버튼들 (있을 때만) */}
                {hasItems && isOpen && (
                  <ul className="mt-2 ml-3 flex flex-col gap-2">
                    {g.items!.map((it) => {
                      const isActiveItem = it.key === activeItemKey
                      return (
                        <li key={it.key}>
                          <button
                            className={clsx(
                              'w-full h-9 px-3 text-left text-[13px] rounded-[6px]',
                              BORDER,
                              // 선택된 상세만 연한 주황, 나머지는 흰색
                              isActiveItem ? ACTIVE_ITEM_BG : 'bg-white hover:bg-gray-50'
                            )}
                            onClick={() => onNavigate?.(it.href, g.key, it.key)}
                          >
                            {it.label}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

