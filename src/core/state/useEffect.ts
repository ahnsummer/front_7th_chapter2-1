import { customAlphabet } from "nanoid";
import { State } from "./useState";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 10);

/**
 * @description 등록된 사이드 이펙트를 저장하는 전역 Map
 * 각 effect는 고유 ID로 식별되며 dependencies와 callback을 포함
 */
export const sideEffects = new Map<
  string,
  {
    dependencies: unknown[];
    callback: (dependencies: unknown[]) => void | (() => void);
  }
>();

/**
 * @description 사이드 이펙트를 등록하는 Hook
 * React의 useEffect와 유사하게 dependencies가 변경될 때만 실행됨
 * cleanup 함수를 반환하면 다음 실행 전이나 언마운트 시 호출됨
 * @param {Function} callback - 실행할 사이드 이펙트 함수
 * @param {Array} callback.dependencies - State 객체는 실제 값으로 변환되어 전달됨
 * @param {Array<unknown>} dependencies - 의존성 배열 (State 또는 일반 값)
 * @returns {void}
 * @example
 * // 기본 사용 - count 변경 시 콘솔 출력
 * const $count = useState(0);
 *
 * useEffect((deps) => {
 *   console.log('Count changed:', deps[0]);
 * }, [$count]);
 *
 * render`<div>${$count}</div>`;
 * // 초기: 'Count changed: 0' 출력
 *
 * $count.set(1);
 * // 'Count changed: 1' 출력
 *
 * @example
 * // cleanup 함수 반환 - 타이머 설정/해제
 * const $isActive = useState(true);
 *
 * useEffect((deps) => {
 *   const [isActive] = deps;
 *
 *   if (isActive) {
 *     const timerId = setInterval(() => {
 *       console.log('Active!');
 *     }, 1000);
 *
 *     // cleanup 함수 반환
 *     return () => {
 *       clearInterval(timerId);
 *       console.log('Timer cleared');
 *     };
 *   }
 * }, [$isActive]);
 *
 * render`<div>${$isActive}</div>`;
 * // $isActive가 false로 변경되면 cleanup 함수가 호출되어 타이머 해제
 *
 * @example
 * // 여러 dependencies 추적
 * const $user = useState({ name: 'John', age: 25 });
 * const $theme = useState('light');
 *
 * useEffect((deps) => {
 *   const [user, theme] = deps;
 *   console.log(`User ${user.name} prefers ${theme} theme`);
 *
 *   // API 호출이나 DOM 조작 등
 *   document.body.className = theme;
 * }, [$user, $theme]);
 *
 * // $user나 $theme 중 하나라도 변경되면 effect 실행
 *
 * @example
 * // 빈 dependencies - 초기 한 번만 실행
 * useEffect((deps) => {
 *   console.log('Component mounted');
 *
 *   // 초기화 로직
 *   fetchInitialData();
 *
 *   return () => {
 *     console.log('Component will unmount');
 *   };
 * }, []);
 * // 초기 렌더링 시에만 실행되고, 리렌더링 시에는 실행되지 않음
 */
export function useEffect<Dependencies extends unknown[]>(
  callback: (dependencies: {
    [K in keyof Dependencies]: Dependencies[K] extends State<infer T>
      ? T
      : Dependencies[K];
  }) => void | (() => void),
  dependencies: Dependencies,
): void {
  const effectId = nanoid();
  sideEffects.set(effectId, {
    dependencies,
    callback: callback as (dependencies: unknown[]) => void | (() => void),
  });
}
