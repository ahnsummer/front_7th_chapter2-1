import { customAlphabet } from "nanoid/non-secure";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 10);

/**
 * @description 등록된 이벤트 핸들러를 저장하는 전역 Map
 * 각 핸들러는 고유 ID로 식별되며 이벤트 타입과 콜백을 포함
 */
export const handlers = new Map<
  string,
  {
    key: keyof DocumentEventMap;
    callback: (event: DocumentEventMap[keyof DocumentEventMap]) => void;
  }
>();

/**
 * @description 이벤트 핸들러를 나타내는 클래스
 * data-event-{id} 속성으로 DOM 요소에 연결됨
 */
export class EventHandler {
  constructor(private eventId: string) {}

  /**
   * @description 이벤트 핸들러의 고유 ID 반환
   * @returns {string} 핸들러 ID
   * @example
   * const handler = on('click', () => {});
   * const id = handler.getEventId();
   * console.log(id);
   * // 출력: 'abc123xyz' (10자리 랜덤 ID)
   */
  getEventId(): string {
    return this.eventId;
  }
}

/**
 * @description DOM 이벤트 핸들러를 등록하는 함수
 * Template literal에서 사용되며 data-event-{id} 속성으로 변환됨
 * @param {keyof DocumentEventMap} event - DOM 이벤트 타입 (예: 'click', 'input', 'submit')
 * @param {Function} callback - 이벤트 발생 시 실행될 콜백 함수
 * @param {DocumentEventMap[EventKey]} callback.event - 이벤트 객체
 * @returns {EventHandler} EventHandler 인스턴스
 * @example
 * // 버튼 클릭 이벤트
 * const $count = useState(0);
 *
 * render`
 *   <button ${on('click', () => {
 *     $count.set(prev => prev + 1);
 *   })}>
 *     Count: ${$count}
 *   </button>
 * `;
 * // 버튼 클릭 시 count가 증가
 *
 * @example
 * // input 이벤트로 입력값 추적
 * const $name = useState('');
 *
 * render`
 *   <div>
 *     <input
 *       type="text"
 *       value="${$name}"
 *       ${on('input', (e) => {
 *         $name.set((e.target as HTMLInputElement).value);
 *       })}
 *     />
 *     <p>Hello, ${$name}!</p>
 *   </div>
 * `;
 * // 입력할 때마다 $name이 업데이트되고 화면에 반영됨
 *
 * @example
 * // form submit 이벤트
 * const $email = useState('');
 *
 * render`
 *   <form ${on('submit', (e) => {
 *     e.preventDefault();
 *     console.log('Email submitted:', $email.get());
 *   })}>
 *     <input
 *       type="email"
 *       ${on('input', (e) => {
 *         $email.set((e.target as HTMLInputElement).value);
 *       })}
 *     />
 *     <button type="submit">Submit</button>
 *   </form>
 * `;
 * // form 제출 시 기본 동작을 막고 커스텀 로직 실행
 *
 * @example
 * // 마우스 이벤트
 * const $isHovered = useState(false);
 *
 * render`
 *   <div
 *     ${on('mouseenter', () => $isHovered.set(true))}
 *     ${on('mouseleave', () => $isHovered.set(false))}
 *     class="${$isHovered.ref(h => h ? 'hovered' : '')}"
 *   >
 *     Hover me!
 *   </div>
 * `;
 * // 마우스 호버 시 상태가 변경되고 클래스가 토글됨
 */
export function on<EventKey extends keyof DocumentEventMap>(
  event: EventKey,
  callback: (event: DocumentEventMap[EventKey]) => void,
): EventHandler {
  const eventId = nanoid();

  handlers.set(eventId, {
    key: event,
    callback: callback as (event: Event) => void,
  });

  return new EventHandler(eventId);
}
