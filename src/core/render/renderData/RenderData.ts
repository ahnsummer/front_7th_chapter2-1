/**
 * @description 렌더 데이터를 관리하는 클래스
 * Template literals의 strings와 expressions를 저장하고 관리
 */
export class RenderData {
  private strings?: TemplateStringsArray;
  private expressions?: unknown[];

  /**
   * @description 렌더 데이터 설정
   * @param {TemplateStringsArray} strings - Template literal의 문자열 배열
   * @param {unknown[]} expressions - Template literal의 표현식 배열
   * @returns {void}
   * @example
   * const data = new RenderData();
   * data.set(['<div>', '</div>'], ['Hello']);
   * // strings: ['<div>', '</div>']
   * // expressions: ['Hello']
   */
  set(strings: TemplateStringsArray, expressions: unknown[]): void {
    this.strings = strings;
    this.expressions = expressions;
  }

  /**
   * @description 저장된 렌더 데이터 가져오기
   * @returns {Object} 렌더 데이터 객체
   * @returns {TemplateStringsArray} returns.strings - Template literal의 문자열 배열
   * @returns {unknown[]} returns.expressions - Template literal의 표현식 배열
   * @throws {Error} render 함수가 먼저 호출되지 않았을 때
   * @example
   * const data = new RenderData();
   * data.set(['<div>', '</div>'], ['Hello']);
   * const result = data.get();
   * // result: { strings: ['<div>', '</div>'], expressions: ['Hello'] }
   */
  get(): { strings: TemplateStringsArray; expressions: unknown[] } {
    if (this.strings == null || this.expressions == null) {
      throw new Error("render 함수가 먼저 호출되어야 합니다!");
    }

    return { strings: this.strings, expressions: this.expressions };
  }
}
