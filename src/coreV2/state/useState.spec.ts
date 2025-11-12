import { describe, it, expect } from "vitest";
import { useState } from "./useState";

describe("useState", () => {
  describe("초기화", () => {
    it("초기값으로 상태를 생성해야 한다.", () => {
      // TODO: 구현
    });

    it("초기값이 state 배열에 저장되어야 한다.", () => {
      // TODO: 구현
    });

    it("여러 useState를 호출하면 각각 다른 인덱스에 저장되어야 한다.", () => {
      // TODO: 구현
    });

    it("각 useState 호출 시 stateCursor가 증가하여 정상적으로 해당하는 useState를 가리킬 수 있어야 한다.", () => {
      // TODO: 구현
    });

    it("같은 컴포넌트에서 여러 상태를 관리할 수 있어야 한다.", () => {
      // TODO: 구현
    });
  });

  describe("반환값", () => {
    it("배열 형태로 [value, setValue]를 반환해야 한다.", () => {
      // TODO: 구현
    });

    it("첫 번째 요소는 현재 상태 값이어야 한다.", () => {
      // TODO: 구현
    });

    it("두 번째 요소는 setter 함수여야 한다.", () => {
      // TODO: 구현
    });
  });

  describe("setValue 함수", () => {
    describe("직접 값 설정", () => {
      it("새로운 값을 직접 설정할 수 있어야 한다.", () => {
        // TODO: 구현
      });

      it("숫자 값을 설정할 수 있어야 한다.", () => {
        // TODO: 구현
      });

      it("문자열 값을 설정할 수 있어야 한다.", () => {
        // TODO: 구현
      });

      it("객체 값을 설정할 수 있어야 한다.", () => {
        // TODO: 구현
      });

      it("배열 값을 설정할 수 있어야 한다.", () => {
        // TODO: 구현
      });

      it("null/undefined를 설정할 수 있어야 한다.", () => {
        // TODO: 구현
      });
    });

    describe("dispatcher 함수 사용", () => {
      it("이전 값을 받아 새 값을 계산할 수 있어야 한다.", () => {
        // TODO: 구현
      });

      it("불변성을 유지하며 배열을 업데이트해야 한다.", () => {
        // TODO: 구현
      });
    });

    describe("리렌더링 트리거", () => {
      it("setValue 호출 시 render 함수를 호출해야 한다.", () => {
        // TODO: 구현
      });

      it("searchCurrentNode로 현재 컴포넌트를 찾아야 한다.", () => {
        // TODO: 구현
      });

      it("올바른 key로 컴포넌트를 검색해야 한다.", () => {
        // TODO: 구현
      });

      it("render 함수에 올바른 인자를 전달해야 한다.", () => {
        // TODO: 구현
      });
    });
  });

  describe("에러 처리", () => {
    it("currentRenderingNode가 없으면 에러를 던져야 한다.", () => {
      // TODO: 구현
    });

    it("currentRenderingNode가 CompnentElementNode가 아니면 에러를 던져야 한다.", () => {
      // TODO: 구현
    });

    it("state가 없으면 에러를 던져야 한다.", () => {
      // TODO: 구현
    });

    it("stateCursor가 없으면 에러를 던져야 한다.", () => {
      // TODO: 구현
    });

    it("parentNode를 찾지 못하면 에러를 던져야 한다.", () => {
      // TODO: 구현
    });
  });

  describe("상태 유지", () => {
    it("리렌더링 후에도 이전 상태 값을 유지해야 한다.", () => {
      // TODO: 구현
    });

    it("같은 인덱스의 state를 재사용해야 한다.", () => {
      // TODO: 구현
    });

    it("여러 리렌더링을 거쳐도 상태가 유지되어야 한다.", () => {
      // TODO: 구현
    });
  });

  describe("타입 안정성", () => {
    it("제네릭 타입이 올바르게 추론되어야 한다.", () => {
      // TODO: 구현
    });

    it("숫자 타입 상태의 타입이 유지되어야 한다.", () => {
      // TODO: 구현
    });

    it("문자열 타입 상태의 타입이 유지되어야 한다.", () => {
      // TODO: 구현
    });

    it("객체 타입 상태의 타입이 유지되어야 한다.", () => {
      // TODO: 구현
    });

    it("배열 타입 상태의 타입이 유지되어야 한다.", () => {
      // TODO: 구현
    });

    it("유니온 타입도 지원해야 한다.", () => {
      // TODO: 구현
    });
  });
});
