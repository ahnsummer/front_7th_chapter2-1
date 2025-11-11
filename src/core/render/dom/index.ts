/**
 * @description 루트 DOM 요소를 가져오는 함수
 * @returns {HTMLElement} #root 요소
 * @throws {Error} #root 요소가 존재하지 않을 때
 * @example
 * const rootElement = root();
 * rootElement.innerHTML = '<div>Hello</div>';
 * // #root 요소에 내용이 렌더링됨
 */
export function root(): HTMLElement {
  const rootNode = document.querySelector("#root");

  if (rootNode == null) {
    throw new Error(
      "#root 요소가 존재하지 않습니다. #root 요소를 추가해주세요.",
    );
  }

  return rootNode as HTMLElement;
}

/**
 * @description HTML 문자열을 DOM 요소로 변환
 * @param {string} html - 변환할 HTML 문자열
 * @returns {Node | null} 생성된 DOM 노드 (첫 번째 자식)
 * @example
 * const element = htmlStringToElement('<div class="box">Content</div>');
 * document.body.appendChild(element);
 * // <div class="box">Content</div>가 body에 추가됨
 */
export function htmlStringToElement(html: string): Node | null {
  return new DOMParser().parseFromString(html, "text/html").body.firstChild;
}
