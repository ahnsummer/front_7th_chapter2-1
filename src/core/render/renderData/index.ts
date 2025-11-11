import { normalizeTemplateLiterals } from "../template";
import { RenderData } from "./RenderData";

/**
 * @description RenderData 싱글톤 인스턴스
 * 전역적으로 사용되는 렌더 데이터 저장소
 */
export const renderData = new RenderData();

/**
 * @description Template literal을 파싱하여 particles 배열로 변환
 * @returns {unknown[]} 정규화된 template particles 배열
 * @throws {Error} renderData가 초기화되지 않았을 때
 * @example
 * // render`<div>${name}</div>` 호출 후
 * const particles = getParticles();
 * // particles: ['<div>', 'John', '</div>']
 */
export function getParticles(): unknown[] {
  const { strings, expressions } = renderData.get();
  const particles = normalizeTemplateLiterals(strings, expressions);
  return particles;
}

export { RenderData };
