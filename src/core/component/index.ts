type ComponentConstructor<
  Props extends Record<string, unknown>,
  Children extends string | undefined = undefined,
> = Children extends string
  ? (props: Props) => {
      html: (children: TemplateStringsArray) => HtmlTemplateNode;
    }
  : (props: Props) => HtmlTemplateNode;

/**
 * @description HTML 템플릿 노드를 나타내는 클래스
 * Template literal의 strings와 expressions를 캡슐화
 */
export class HtmlTemplateNode {
  constructor(
    private readonly html: {
      strings: TemplateStringsArray;
      expressions: unknown[];
    },
  ) {}

  /**
   * @description 저장된 HTML 템플릿 데이터 반환
   * @returns {Object} 템플릿 데이터 객체
   * @returns {TemplateStringsArray} returns.strings - Template literal의 문자열 배열
   * @returns {unknown[]} returns.expressions - Template literal의 표현식 배열
   * @example
   * const node = html`<div>${'Hello'}</div>`;
   * const { strings, expressions } = node.getHTML();
   * console.log(strings);
   * // 출력: ['<div>', '</div>']
   * console.log(expressions);
   * // 출력: ['Hello']
   */
  getHTML(): { strings: TemplateStringsArray; expressions: unknown[] } {
    return this.html;
  }
}

/**
 * @description 재사용 가능한 컴포넌트를 생성하는 함수
 * Props와 Children을 받아 HtmlTemplateNode를 반환하는 컴포넌트 생성
 * @param {Function} renderer - Props를 받아 HtmlTemplateNode를 반환하는 렌더 함수
 * @param {Props} renderer.props - 컴포넌트에 전달될 속성 객체
 * @param {Children} [renderer.children] - 자식 템플릿 (children을 받는 컴포넌트인 경우)
 * @returns {Function} 컴포넌트 생성자 함수
 * @example
 * // Props만 받는 기본 컴포넌트
 * const Button = component((props: { text: string; onClick: () => void }) => {
 *   return html`
 *     <button ${on('click', props.onClick)}>
 *       ${props.text}
 *     </button>
 *   `;
 * });
 *
 * render`
 *   <div>
 *     ${Button({ text: 'Click me', onClick: () => console.log('Clicked!') })}
 *   </div>
 * `;
 *
 * @example
 * // State를 사용하는 컴포넌트
 * const Counter = component((props: { initial: number }) => {
 *   const $count = useState(props.initial);
 *
 *   return html`
 *     <div>
 *       <p>Count: ${$count}</p>
 *       <button ${on('click', () => $count.set(prev => prev + 1))}>
 *         Increment
 *       </button>
 *     </div>
 *   `;
 * });
 *
 * render`${Counter({ initial: 0 })}`;
 *
 * @example
 * // Children을 받는 컴포넌트
 * const Card = component((props: { title: string }, children: string) => {
 *   return html`
 *     <div class="card">
 *       <h2>${props.title}</h2>
 *       <div class="card-body">
 *         ${children}
 *       </div>
 *     </div>
 *   `;
 * });
 *
 * render`
 *   ${Card({ title: 'My Card' }).html`
 *     <p>Card content here</p>
 *   `}
 * `;
 *
 * @example
 * // useEffect와 함께 사용
 * const Timer = component((props: { interval: number }) => {
 *   const $seconds = useState(0);
 *
 *   useEffect((deps) => {
 *     const [interval] = deps;
 *     const timerId = setInterval(() => {
 *       $seconds.set(prev => prev + 1);
 *     }, interval);
 *
 *     return () => clearInterval(timerId);
 *   }, [props.interval]);
 *
 *   return html`<div>Seconds: ${$seconds}</div>`;
 * });
 *
 * render`${Timer({ interval: 1000 })}`;
 * // 1초마다 seconds가 증가하며 자동으로 화면 업데이트
 */
export function component(
  renderer: () => HtmlTemplateNode,
): () => HtmlTemplateNode;
export function component<const Props extends Record<string, unknown>>(
  renderer: (props: Props) => HtmlTemplateNode,
): (props: Props) => HtmlTemplateNode;
export function component<
  const Props extends Record<string, unknown>,
  const Children extends string,
>(
  renderer: (props: Props, children: Children) => HtmlTemplateNode,
): (props: Props) => {
  html: (children: TemplateStringsArray) => HtmlTemplateNode;
};
export function component<
  const Props extends Record<string, unknown>,
  const Children extends string | undefined = undefined,
>(renderer: (props?: Props, children?: Children) => HtmlTemplateNode) {
  return ((props: Props) => {
    if (renderer.length <= 1) {
      return renderer(props);
    }

    return {
      html: (children: Children) => renderer(props, children),
    };
  }) as ComponentConstructor<Props, Children>;
}

/**
 * @description Template literal을 HtmlTemplateNode로 변환하는 태그 함수
 * render 함수나 component 내부에서 HTML 템플릿을 작성할 때 사용
 * @param {TemplateStringsArray} strings - Template literal의 문자열 배열
 * @param {...unknown[]} expressions - Template literal의 표현식 배열
 * @returns {HtmlTemplateNode} HTML 템플릿 노드
 * @example
 * // 기본 사용
 * const node = html`<div>Hello World</div>`;
 *
 * @example
 * // 동적 값 포함
 * const name = 'John';
 * const node = html`<div>Hello, ${name}!</div>`;
 *
 * @example
 * // State 포함
 * const $count = useState(0);
 * const node = html`<div>Count: ${$count}</div>`;
 *
 * @example
 * // 컴포넌트 내부에서 사용
 * const MyComponent = component((props: { title: string }) => {
 *   return html`
 *     <div>
 *       <h1>${props.title}</h1>
 *       <p>Content</p>
 *     </div>
 *   `;
 * });
 *
 * @example
 * // 배열 렌더링
 * const items = ['Apple', 'Banana', 'Orange'];
 * const node = html`
 *   <ul>
 *     ${items.map(item => html`<li>${item}</li>`)}
 *   </ul>
 * `;
 * // <ul><li>Apple</li><li>Banana</li><li>Orange</li></ul>
 */
export function html(
  strings: TemplateStringsArray,
  ...expressions: unknown[]
): HtmlTemplateNode {
  return new HtmlTemplateNode({ strings, expressions });
}
