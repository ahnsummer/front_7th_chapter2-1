import { zip } from "../../../shared/utils/zip";
import { HtmlTemplateNode } from "../../component";
import { EventHandler } from "../../on";
import { State } from "../../state/useState";

/**
 * @description 노드를 문자열로 처리하는 함수
 * HtmlTemplateNode, State, EventHandler, Array 등 다양한 타입의 노드를 적절한 문자열로 변환
 * @param {unknown} node - 처리할 노드
 * @returns {string} 변환된 문자열
 * @example
 * // HtmlTemplateNode 처리
 * const htmlNode = html`<div>test</div>`;
 * processNode(htmlNode);
 * // returns: '<div>test</div>'
 *
 * @example
 * // State 처리
 * const Comp = component(() => {
 *   const $count = useState(1);
 *   return html`<div>${$count}</div>`;
 * });
 *
 * processNode(Comp);
 * // returns: '<div>1</div>'
 *
 * @example
 * // EventHandler 처리
 * const Comp = component(() => {
 *   return html`<div ${on('click', () => {
 *     console.log('click');
 *   })}>test</div>`;
 * });
 * processNode(Comp);
 * // returns: '<div data-event-abc123>test</div>' // data-event-* 속성을 통해 이벤트 핸들러가 등록됨
 *
 * @example
 * // Array 처리 (배열의 각 요소를 재귀적으로 처리)
 * const items = [
 *   html`<li>Item 1</li>`,
 *   html`<li>Item 2</li>`,
 *   html`<li>Item 3</li>`
 * ];
 * processNode(items);
 * // returns: '<li>Item 1</li><li>Item 2</li><li>Item 3</li>'
 */
export function processNode(node: unknown): string {
  if (node instanceof HtmlTemplateNode) {
    const { strings, expressions } = node.getHTML();
    return normalizeTemplateLiterals(strings, expressions).map(processNode).join("");
  }

  if (node instanceof State) {
    const value = node.get();

    return processNode(value);
  }

  if (node instanceof EventHandler) {
    return `data-event-${node.getEventId()}`;
  }

  // 배열 처리: 각 요소를 재귀적으로 processNode로 처리
  if (Array.isArray(node)) {
    return node.map(processNode).join("");
  }

  return String(node);
}

/**
 * @description Template literal의 strings와 expressions를 하나의 배열로 정규화
 * @param {TemplateStringsArray} strings - Template literal의 문자열 배열
 * @param {unknown[]} expressions - Template literal의 표현식 배열
 * @returns {unknown[]} 정규화된 배열 (strings와 expressions가 교차로 배치됨)
 * @example
 * const strings = ['<div>', ' world', '</div>'];
 * const expressions = ['Hello', '!'];
 * const result = normalizeTemplateLiterals(strings, expressions);
 * // result: ['<div>', 'Hello', ' world', '!', '</div>']
 */
export function normalizeTemplateLiterals(strings: TemplateStringsArray, expressions: unknown[]): unknown[] {
  return zip([...strings], expressions.concat("")).flat();
}
