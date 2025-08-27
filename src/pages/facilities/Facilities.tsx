import { useSetPageTitle } from '@/hooks/common/useSetPageTitle';
import SpaceList from '@/components/facilities/SpaceList'

export default function Facilities() {
  useSetPageTitle("공간 유형별 호실 목록");
  return (
    <div className="mx-auto w-full max-w-[1600px] px-6 bg-[var(--white-02)]">
      {/* "호실 추가하기" 버튼 */}
      <div className="mt-6 flex justify-end">
        <button
          className="w-[182px] h-[56px] shrink-0 border border-[#7C7C7C] bg-[#FFE9AE] flex items-center justify-center"
        >
          <span className="text-center font-inter text-[27px] font-extrabold leading-normal text-black">
            호실 추가하기
          </span>
        </button>
      </div>
      
      {/* 공간 리스트 */}
      <div className="mt-6">
        <SpaceList />
      </div>
    </div>
  );
}