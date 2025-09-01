export type SpaceType = '강의실' | '실험실';

export type SpaceRow = {
  id: string;
  type: SpaceType;
  roomNo: string;
  tags: Array<'temperature' | 'humidity' | 'co2' | 'tvoc'>;
};

export const mockSpaces: SpaceRow[] = [
  { id: '1',  type: '강의실', roomNo: '1001', tags: ['temperature', 'humidity'] },
  { id: '2',  type: '실험실', roomNo: '1002', tags: ['tvoc'] },
  { id: '3',  type: '강의실', roomNo: '1003', tags: [] },
  { id: '4',  type: '실험실', roomNo: '1004', tags: [] },
  { id: '5',  type: '강의실', roomNo: '1005', tags: ['temperature', 'co2'] },
  { id: '6',  type: '실험실', roomNo: '1006', tags: ['temperature', 'tvoc'] },
  { id: '7',  type: '강의실', roomNo: '1007', tags: [] },
  { id: '8',  type: '실험실', roomNo: '1008', tags: ['humidity'] },
   { id: '9',  type: '강의실', roomNo: '1009', tags: ['co2', 'tvoc'] },
  { id: '10', type: '실험실', roomNo: '1010', tags: ['temperature'] },
  { id: '11', type: '강의실', roomNo: '1011', tags: ['humidity'] },
  { id: '12', type: '실험실', roomNo: '1012', tags: [] },
  { id: '13', type: '강의실', roomNo: '1013', tags: ['temperature', 'humidity', 'co2'] },
  { id: '14', type: '실험실', roomNo: '1014', tags: ['tvoc', 'co2'] },
  { id: '15', type: '강의실', roomNo: '1015', tags: [] },
  { id: '16', type: '실험실', roomNo: '1016', tags: ['temperature', 'humidity'] },
  { id: '17', type: '강의실', roomNo: '1017', tags: ['tvoc'] },
  { id: '18', type: '실험실', roomNo: '1018', tags: ['co2'] },
  { id: '19', type: '강의실', roomNo: '1019', tags: ['humidity', 'tvoc'] },
  { id: '20', type: '실험실', roomNo: '1020', tags: [] },
];