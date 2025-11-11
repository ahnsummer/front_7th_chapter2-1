import { handlers } from "../../on";
import { snapshot } from "../snapshot";

/**
 * @description 이전 렌더링에서 등록된 이벤트 핸들러를 제거
 * 스냅샷에 저장된 핸들러들을 DOM에서 제거하여 메모리 누수 방지
 * @returns {void}
 * @example
 * // 이전에 등록된 핸들러들이 있는 상태
 * cleanup();
 * // 모든 data-event-xxx 속성을 가진 요소의 이벤트 리스너가 제거됨
 */
export function cleanup(): void {
  snapshot.handlers.forEach(({ id, key, callback }) => {
    const node = document.querySelector(`[data-event-${id}]`);
    if (node == null) return;

    node.removeEventListener(key, callback);
  });
}

/**
 * @description 현재 handlers Map에 등록된 핸들러들을 DOM에 등록
 * 스냅샷을 업데이트하고 실제 DOM 요소에 이벤트 리스너를 추가
 * @returns {void}
 * @example
 * // render 함수로 HTML이 렌더링된 후
 * registerHandlers();
 * // 모든 data-event-xxx 속성을 가진 요소에 이벤트 리스너가 등록됨
 *
 * @example
 * // button에 click 핸들러가 있는 경우
 * // <button data-event-abc123>Click</button>
 * registerHandlers();
 * // 버튼 클릭 시 등록된 콜백이 실행됨
 */
export function registerHandlers(): void {
  const newHandlers = handlers
    .entries()
    .map(([id, { key, callback }]) => ({
      id,
      key,
      callback,
    }))
    .toArray();

  snapshot.handlers = newHandlers;

  snapshot.handlers.forEach(({ id, key, callback }) => {
    const node = document.querySelector(`[data-event-${id}]`);
    if (node == null) return;

    node.addEventListener(key, callback);
  });
}
