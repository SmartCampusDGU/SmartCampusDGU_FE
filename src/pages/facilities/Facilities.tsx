import { useEffect, useState } from 'react';
import { useOutletContext } from "react-router-dom";
import { useSetPageTitle } from '@/hooks/common/useSetPageTitle';
import { useSetActiveNav } from "@/hooks/common/useSetActiveNav";
import ActionButton from "@/components/common/ActionButton";
import SpaceList from '@/components/facilities/SpaceList'
import CreateRoomTypeModal from '@/components/modals/CreateSpaceModal';
import type { TypeFormValue } from '@/components/modals/CreateRoomTypeModal';

type LayoutOutletContext = {
  setExtraActions: (node: React.ReactNode) => void;
};

export default function Facilities() {
  useSetPageTitle("공간 리스트");
  useSetActiveNav("facility", "room-list");

   const { setExtraActions } = useOutletContext<LayoutOutletContext>();
   const [modalOpen, setModalOpen] = useState(false);

  const handleSave = (form: TypeFormValue) => {
    console.log("새로 등록된 공간 유형:", form);
    setModalOpen(false); 
  };

    useEffect(() => {
    setExtraActions(
      <ActionButton
        variant="register"
        label="호실 추가하기"
        onClick={() => setModalOpen(true)}
      />
    );
    return () => setExtraActions(null);
  }, [setExtraActions]);

  return (
    <div className="mx-auto w-full max-w-[1600px] px-6 bg-[var(--white-02)]">
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