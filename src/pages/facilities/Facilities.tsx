import { useEffect, useState } from 'react';
import { useOutletContext } from "react-router-dom";
import { useSetPageTitle } from '@/hooks/common/useSetPageTitle';
import { useSetActiveNav } from "@/hooks/common/useSetActiveNav";
import ActionButton from "@/components/common/ActionButton";
import SpaceList from '@/components/facilities/SpaceList'
import CreateSpaceModal from '@/components/modals/CreateSpaceModal';
import { useCreateRoomMutation } from '@/state/mutations/facilities/useCreateRoomMutation';
import type { CreateRoomRequest } from '@/types/facilities/CreateRoomRequest';
import type { SpaceFormValue } from '@/components/modals/CreateSpaceModal';
import { useRoomTypesQuery } from '@/state/queries/measurements/useRoomTypesQuery';
import type { RoomTypeItem } from '@/types/measurements/RoomTypeItem';
import { useSensorDataTypesQuery } from '@/state/queries/sensors/useSensorDataTypesQuery';

type LayoutOutletContext = {
  setExtraActions: (node: React.ReactNode) => void;
};

export default function Facilities() {
  useSetPageTitle("공간 리스트");
  useSetActiveNav("facility", "room-list");

  const createRoomMutation = useCreateRoomMutation();
  const { data: roomTypes = [] } = useRoomTypesQuery();

  const { data: sensorData } = useSensorDataTypesQuery();
 const sensorOptions = sensorData?.data ?? [];

  const { setExtraActions } = useOutletContext<LayoutOutletContext>();
  const [modalOpen, setModalOpen] = useState(false);

  const handleSave = (form: SpaceFormValue) => {
    // 선택된 roomType
    const rt: RoomTypeItem | undefined = roomTypes.find(r => r.id === form.roomTypeId);

    // label -> dataTypeId 매핑
    const request: CreateRoomRequest = {
      roomNumber: form.roomNo,          // roomNo로 저장
      roomTypeId: form.roomTypeId,      // 모달에서 받은 id 사용
       dataTypes: form.items.map((item) => {

      const cautionMin = Number(item.thresholds[0].min);
      const cautionMax = Number(item.thresholds[0].max);
      const dangerMin = Number(item.thresholds[1].min);
      const dangerMax = Number(item.thresholds[1].max);
      const emergencyMin = Number(item.thresholds[2].min);
      const emergencyMax = Number(item.thresholds[2].max);

       // roomType에서 기존 정의된 데이터타입 찾기
      const dt = rt?.dataTypes.find((d) => d.name === item.label);

      // 전체 센서 목록에서 매칭 (새로운 센서일 경우에도 id 매핑 가능)
      const sensor = sensorOptions.find((s) => s.name === item.label);

      let isModified = true; // 기본 true
      if (dt) {
        const sameValues =
          dt.cautionMin === cautionMin &&
          dt.cautionMax === cautionMax &&
          dt.dangerMin === dangerMin &&
          dt.dangerMax === dangerMax &&
          dt.emergencyMin === emergencyMin &&
          dt.emergencyMax === emergencyMax;

        isModified = !sameValues;
      }

      return {
        id: dt?.dataTypeId ?? sensor?.id ?? 0,
        cautionMin,
        cautionMax,
        dangerMin,
        dangerMax,
        emergencyMin,
        emergencyMax,
        isModified,
      };
    }),
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
      <CreateSpaceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        roomTypes={roomTypes} 
      />
    </div>
  );
}