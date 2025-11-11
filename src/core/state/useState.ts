import { nextTick } from "../../shared/utils/nextTick";
import { rerender } from "../render";

/**
 * @description 반응형 상태를 관리하는 클래스
 * 값이 변경되면 자동으로 리렌더링을 트리거하고 구독자들에게 알림
 */
export class State<T> {
  private subscribers: Array<{
    state: State<any>;
    callback: (value: T) => any;
  }> = [];
  constructor(private value: T) {}

  /**
   * @description 현재 상태를 기반으로 파생 상태를 생성
   * 원본 상태가 변경되면 콜백을 통해 파생 상태도 자동으로 업데이트됨
   * @param {Function} callback - 현재 값을 변환하는 콜백 함수
   * @param {T} callback.value - 현재 상태 값
   * @returns {State<R>} 파생된 새로운 State 객체
   * @example
   * // 배열 State에서 길이를 추적하는 파생 상태
   * const $items = useState([1, 2, 3]);
   * const $itemCount = $items.ref(items => items.length);
   *
   * render`<div>Items: ${$itemCount}</div>`;
   * // 렌더링: <div>Items: 3</div>
   *
   * $items.set([1, 2, 3, 4]);
   * // $itemCount도 자동으로 4로 업데이트되고 리렌더링
   *
   * @example
   * // 객체 State에서 특정 속성만 추적
   * const $user = useState({ name: 'John', age: 25 });
   * const $userName = $user.ref(user => user.name);
   *
   * render`<div>Hello, ${$userName}</div>`;
   * // 렌더링: <div>Hello, John</div>
   *
   * $user.set({ name: 'Jane', age: 25 });
   * // $userName이 'Jane'으로 업데이트되고 리렌더링
   */
  ref<R>(callback: (value: T) => R): State<R> {
    const subscriber = new State(callback(this.value));
    this.subscribers.push({ state: subscriber, callback });
    return subscriber;
  }

  /**
   * @description 현재 상태 값을 반환
   * @returns {T} 현재 상태 값
   * @example
   * const $count = useState(5);
   * console.log($count.get());
   * // 출력: 5
   *
   * @example
   * const $user = useState({ name: 'John', age: 25 });
   * const user = $user.get();
   * console.log(user.name);
   * // 출력: 'John'
   */
  get(): T {
    return this.value;
  }

  /**
   * @description 상태 값을 업데이트하고 리렌더링 트리거
   * 함수를 전달하면 이전 값을 기반으로 새 값을 계산할 수 있음
   * @param {T | Function} value - 새로운 값 또는 업데이트 함수
   * @param {Function} value.prevValue - 이전 상태 값 (함수인 경우)
   * @param {Object} [options] - 옵션 객체
   * @param {boolean} [options.skipRerender] - true면 리렌더링을 건너뜀
   * @returns {Promise<void>} 업데이트 완료 Promise
   * @example
   * // 직접 값 설정
   * const $count = useState(0);
   * await $count.set(5);
   * console.log($count.get());
   * // 출력: 5
   *
   * @example
   * // 이전 값 기반 업데이트
   * const $count = useState(0);
   * await $count.set(prev => prev + 1);
   * console.log($count.get());
   * // 출력: 1
   *
   * @example
   * // 리렌더링 건너뛰기 (내부 로직용)
   * const $count = useState(0);
   * await $count.set(5, { skipRerender: true });
   * // 값은 업데이트되지만 화면은 리렌더링되지 않음
   *
   * @example
   * // 객체 업데이트
   * const $user = useState({ name: 'John', age: 25 });
   * await $user.set(prev => ({ ...prev, age: 26 }));
   * // { name: 'John', age: 26 }으로 업데이트되고 리렌더링
   */
  async set(
    value: T | ((value: T) => T),
    options?: { skipRerender?: boolean },
  ): Promise<void> {
    this.value =
      typeof value === "function"
        ? (value as (value: T) => T)(this.value)
        : value;

    this.subscribers.forEach(async ({ state, callback }) => {
      await state.set(callback(this.value), { skipRerender: true });
    });

    if (!options?.skipRerender) {
      await nextTick();
      await rerender();
    }
  }
}

/**
 * @description 반응형 상태를 생성하는 Hook
 * React의 useState와 유사하지만 리렌더링을 자동으로 처리
 * @param {T} initialValue - 초기 상태 값
 * @returns {State<T>} State 객체
 * @example
 * // 숫자 상태
 * const $count = useState(0);
 *
 * render`
 *   <div>
 *     <p>Count: ${$count}</p>
 *     <button ${on('click', () => $count.set(prev => prev + 1))}>
 *       Increment
 *     </button>
 *   </div>
 * `;
 * // 버튼 클릭 시 count가 증가하고 자동으로 리렌더링됨
 *
 * @example
 * // 배열 상태
 * const $items = useState(['Apple', 'Banana']);
 *
 * render`
 *   <div>
 *     <ul>
 *       ${$items.ref(items => items.map(item => html`<li>${item}</li>`))}
 *     </ul>
 *     <button ${on('click', () => {
 *       $items.set(prev => [...prev, 'Orange']);
 *     })}>
 *       Add Item
 *     </button>
 *   </div>
 * `;
 * // 버튼 클릭 시 리스트에 항목이 추가되고 리렌더링됨
 *
 * @example
 * // 객체 상태
 * const $user = useState({ name: 'John', age: 25 });
 *
 * render`
 *   <div>
 *     <p>Name: ${$user.ref(u => u.name)}</p>
 *     <p>Age: ${$user.ref(u => u.age)}</p>
 *     <button ${on('click', () => {
 *       $user.set(prev => ({ ...prev, age: prev.age + 1 }));
 *     })}>
 *       Increase Age
 *     </button>
 *   </div>
 * `;
 * // 버튼 클릭 시 나이만 증가하고 리렌더링됨
 */
export function useState<T>(initialValue: T): State<T> {
  const state = new State<T>(initialValue);

  return state;
}
