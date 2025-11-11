import { nextTick } from "../../shared/utils/nextTick";
import { processNode } from "./template";
import { renderData, getParticles } from "./renderData";
import { snapshot } from "./snapshot";
import { htmlStringToElement, root } from "./dom";
import { cleanup, registerHandlers } from "./handlers";
import { runInitialSideEffects, runChangedSideEffects } from "./sideEffects";
import morphdom from "morphdom";

/**
 * @description 초기 렌더링 함수
 * Template literal을 받아 Virtual DOM을 생성하고 실제 DOM에 렌더링
 * @param {TemplateStringsArray} strings - Template literal의 문자열 배열
 * @param {...unknown[]} expressions - Template literal의 표현식 배열
 * @returns {Promise<void>} 렌더링 완료 Promise
 * @example
 * // 기본 사용
 * render`<div>Hello World</div>`;
 * // #root에 <div>Hello World</div>가 렌더링됨
 *
 * @example
 * // 동적 값 사용
 * const name = 'John';
 * const age = 25;
 * render`
 *   <div>
 *     <h1>${name}</h1>
 *     <p>Age: ${age}</p>
 *   </div>
 * `;
 * // #root에 name과 age가 포함된 HTML이 렌더링됨
 */
export async function render(
  strings: TemplateStringsArray,
  ...expressions: unknown[]
): Promise<void> {
  renderData.set(strings, expressions);

  const particles = getParticles();

  await nextTick();

  const html = particles.map(processNode).join("");
  snapshot.html = html;
  root().innerHTML = html;

  await nextTick();

  registerHandlers();

  // 초기 렌더링 시 모든 사이드 이펙트 실행
  runInitialSideEffects();
}

/**
 * @description 리렌더링 함수
 * 상태 변경 시 호출되어 변경된 부분만 효율적으로 업데이트
 * Virtual DOM diffing을 통해 최소한의 DOM 조작만 수행
 * 내부적으로 호출되는 함수이므로, 외부에서 직접적으로 호출하지 말아주세요.
 *
 * @returns {Promise<void>} 리렌더링 완료 Promise
 */
export async function _rerender(): Promise<void> {
  console.log("rerender");
  const particles = getParticles();

  await nextTick();

  const newHTML = particles.map(processNode).join("");
  if (newHTML === snapshot.html) return;
  const domNode = htmlStringToElement(`<div id="root">${newHTML}</div>`);
  if (domNode == null) return;

  morphdom(root(), domNode);

  snapshot.html = newHTML;

  cleanup();

  await nextTick();

  // 변경된 사이드 이펙트만 실행
  runChangedSideEffects();

  registerHandlers();
}
