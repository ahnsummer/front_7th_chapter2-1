import type { Snapshot } from "../types";

/**
 * @description 렌더링 스냅샷 저장소
 * 이전 렌더링 결과를 저장하여 변경 감지(diffing)에 사용
 */
export const snapshot: Snapshot = {
  html: "",
  handlers: [],
  sideEffects: [],
};
