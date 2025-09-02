import { useEffect, useState } from 'react';
import { useOutletContext } from "react-router-dom";
import { useSetPageTitle } from '@/hooks/common/useSetPageTitle';
import { useSetActiveNav } from "@/hooks/common/useSetActiveNav";
import ActionButton from "@/components/common/ActionButton";
import SpaceList from '@/components/facilities/SpaceList'
import CreateRoomTypeModal from '@/components/modals/CreateSpaceModal';
import { useCreateRoomMutation } from '@/state/mutations/facilities/useCreateRoomMutation';
import type { CreateRoomRequest } from '@/types/facilities/CreateRoomRequest';
import type { TypeFormValue } from '@/components/modals/CreateRoomTypeModal';

type LayoutOutletContext = {
  setExtraActions: (node: React.ReactNode) => void;
};

export default function Facilities() {
  useSetPageTitle("공간 리스트");
  useSetActiveNav("facility", "room-list");

  const createRoomMutation = useCreateRoomMutation();
   const { setExtraActions } = useOutletContext<LayoutOutletContext>();
   const [modalOpen, setModalOpen] = useState(false);

  const handleSave = (form: TypeFormValue) => {
  
  const roomTypeId = form.spaceType === '강의실' ? 1 : 2; 

  const request: CreateRoomRequest = {
    roomNumber: form.spaceType,
    roomTypeId,
    dataTypes: form.items.map((item) => ({
      id: parseInt(item.id, 10) || 0, 
      cautionMin: Number(item.thresholds[0].min),
      cautionMax: Number(item.thresholds[0].max),
      dangerMin: Number(item.thresholds[1].min),
      dangerMax: Number(item.thresholds[1].max),
      emergencyMin: Number(item.thresholds[2].min),
      emergencyMax: Number(item.thresholds[2].max),
      isModified: true,
    })),
  };

  createRoomMutation.mutate(request, {
    onSuccess: () => {
      console.log('공간 등록 성공');
      setModalOpen(false);
    },
    onError: (e) => {
      console.error('공간 등록 실패', e);
    }
  });
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