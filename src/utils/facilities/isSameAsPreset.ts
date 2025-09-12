import type { RoomTypeItem } from "@/types/measurements/RoomTypeItem";

type LevelKey = "주의" | "위험" | "응급";
type Threshold = { level: LevelKey; min: string; max: string };
type MeasureItem = {
  id: string;
  label: string;
  unit: string;
  thresholds: Threshold[];
  usePreset?: boolean;
};

export function isSameAsPreset(roomType: RoomTypeItem | null, item: MeasureItem): boolean {
  if (!roomType) return false;
  const dt = roomType.dataTypes.find((d) => d.name === item.label);
  if (!dt) return false;
  return (
    dt.unit === item.unit &&
    dt.cautionMin === Number(item.thresholds[0].min) &&
    dt.cautionMax === Number(item.thresholds[0].max) &&
    dt.dangerMin === Number(item.thresholds[1].min) &&
    dt.dangerMax === Number(item.thresholds[1].max) &&
    dt.emergencyMin === Number(item.thresholds[2].min) &&
    dt.emergencyMax === Number(item.thresholds[2].max)
  );
}
