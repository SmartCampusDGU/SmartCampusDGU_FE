import { useState } from 'react';
import { useSetPageTitle } from '@/hooks/common/useSetPageTitle';
import { useSetActiveNav } from "@/hooks/common/useSetActiveNav";
import SpaceList from '@/components/facilities/SpaceList'
import CreateRoomTypeModal from '@/components/modals/CreateSpaceModal';
import type { TypeFormValue } from '@/components/modals/CreateRoomTypeModal';

export default function Facilities() {
  useSetPageTitle("공간 리스트");
  useSetActiveNav("facility", "room-list");

   const [modalOpen, setModalOpen] = useState(false);

  const handleSave = (form: TypeFormValue) => {
    console.log("새로 등록된 공간 유형:", form);
    setModalOpen(false); 
  };

  return (
    <div className="mx-auto w-full max-w-[1600px] px-6 bg-[var(--white-02)]">
      {/* "호실 추가하기" 버튼 */}
      <div className="mt-6 flex justify-end">
        <button
          className="w-[182px] h-[56px] shrink-0 border border-[#7C7C7C] bg-[#FFE9AE] flex items-center justify-center"
          onClick={() => setModalOpen(true)}  
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
      {/* 모달 */}
      <CreateRoomTypeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}