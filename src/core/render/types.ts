/**
 * 스냅샷 핸들러 정보
 */
export type SnapshotHandler = {
  id: string;
  key: keyof DocumentEventMap;
  callback: (event: DocumentEventMap[keyof DocumentEventMap]) => void;
};

/**
 * 스냅샷 사이드 이펙트 정보
 */
export type SnapshotSideEffect = {
  id: string;
  dependencies: unknown[];
  callback: (dependencies: unknown[]) => void | (() => void);
  cleanup?: () => void;
};

/**
 * 렌더링 스냅샷 데이터
 */
export type Snapshot = {
  html: string;
  handlers: SnapshotHandler[];
  sideEffects: SnapshotSideEffect[];
};
