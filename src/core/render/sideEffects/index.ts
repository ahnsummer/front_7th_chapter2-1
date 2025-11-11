import { deepEqual } from "../../../shared/utils/deepEqual";
import { State } from "../../state/useState";
import { sideEffects } from "../../state/useEffect";
import { snapshot } from "../snapshot";
import { SnapshotSideEffect } from "../types";

/**
 * @description 초기 렌더링 시 모든 사이드 이펙트 실행
 * 모든 등록된 useEffect 콜백을 실행하고 스냅샷에 저장
 * @returns {void}
 * @example
 * // render 함수 내부에서 호출
 * render`<div>...</div>`;
 * // 내부적으로 runInitialSideEffects() 호출
 * // 모든 useEffect 콜백이 실행되고 dependencies가 스냅샷에 저장됨
 *
 * @example
 * // useEffect가 등록된 경우
 * const $count = useState(0);
 * useEffect((deps) => {
 *   console.log('Effect ran with count:', deps[0]);
 * }, [$count]);
 *
 * render`<div>${$count}</div>`;
 * // runInitialSideEffects() 호출됨
 * // 콘솔: 'Effect ran with count: 0'
 */
export function runInitialSideEffects(): void {
  sideEffects.entries().forEach(([id, { dependencies, callback }]) => {
    const deps = dependencies.map((dep) => (dep instanceof State ? dep.get() : dep));
    // 콜백 실행
    const cleanup = callback(deps);
    console.log("cleanup", cleanup);

    // 스냅샷에 저장 (State 객체는 실제 값으로 변환)
    snapshot.sideEffects.push({
      id,
      dependencies: deps,
      callback,
      cleanup: cleanup == null ? undefined : cleanup,
    });
  });
}

/**
 * @description 리렌더링 시 변경된 사이드 이펙트만 실행
 * dependencies가 변경된 useEffect만 선택적으로 재실행
 * @returns {void}
 * @example
 * // 리렌더링 시 dependencies 변경 체크
 * const $count = useState(0);
 * useEffect((deps) => {
 *   console.log('Count changed:', deps[0]);
 * }, [$count]);
 *
 * render`<div>${$count}</div>`;
 * $count.set(1); // 리렌더링 트리거
 * // runChangedSideEffects() 호출됨
 * // 이전 값: [0], 새로운 값: [1]
 * // dependencies가 변경되었으므로 콜백 실행
 * // 콘솔: 'Count changed: 1'
 *
 * @example
 * // dependencies가 변경되지 않은 경우
 * const $name = useState('John');
 * const $age = useState(25);
 *
 * useEffect((deps) => {
 *   console.log('Name effect:', deps[0]);
 * }, [$name]);
 *
 * render`<div>${$name} - ${$age}</div>`;
 * $age.set(26); // age만 변경
 * // runChangedSideEffects() 호출됨
 * // $name의 dependencies는 변경되지 않았으므로 실행 안 됨
 */
export function runChangedSideEffects(): void {
  // dependencies가 변경된 effect만 필터링
  sideEffects
    .entries()
    .filter(([id, { dependencies }]) => {
      // dependencies가 없으면 실행 안 함
      if (dependencies.length === 0) {
        return false;
      }

      // 현재 dependencies 값 추출
      const currentDeps = dependencies.map((dep) => (dep instanceof State ? dep.get() : dep));

      // 이전 스냅샷의 dependencies와 비교
      const previousDeps = snapshot.sideEffects.find((sideEffect) => sideEffect.id === id)?.dependencies;

      // 이전 값과 다르면 실행
      return !deepEqual(currentDeps, previousDeps);
    })
    .forEach(([id, { dependencies, callback }]) => {
      const deps = dependencies.map((dep) => (dep instanceof State ? dep.get() : dep));

      snapshot.sideEffects.find((sideEffect) => sideEffect.id === id)?.cleanup?.();

      const cleanup = callback(deps);

      snapshot.sideEffects = snapshot.sideEffects.map((sideEffect) => {
        if (sideEffect.id === id) {
          return {
            ...sideEffect,
            dependencies: deps,
            cleanup,
          } as SnapshotSideEffect;
        }

        return sideEffect;
      });
    });
}
