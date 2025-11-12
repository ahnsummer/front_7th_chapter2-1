import { describe, it, expect } from "vitest";
import {
  h,
  Fragment,
  DomElementNode,
  CompnentElementNode,
  FragmentNode,
  ElementNode,
} from "./index";

describe("JSX Factory", () => {
  describe("h 함수", () => {
    describe("DomElementNode 생성", () => {
      it("문자열 태그로 DomElementNode를 생성해야 한다.", () => {
        // TODO: 구현
      });

      it("props를 올바르게 전달해야 한다.", () => {
        // TODO: 구현
      });

      it("여러 children을 올바르게 전달해야 한다.", () => {
        // TODO: 구현
      });

      it("props의 key를 노드의 key로 설정해야 한다.", () => {
        // TODO: 구현
      });

      it("key가 없으면 빈 문자열을 key로 설정해야 한다.", () => {
        // TODO: 구현
      });

      it("중첩된 요소 구조를 올바르게 생성해야 한다.", () => {
        // TODO: 구현
      });
    });

    describe("CompnentElementNode 생성", () => {
      it("함수형 컴포넌트로 CompnentElementNode를 생성해야 한다.", () => {
        // TODO: 구현
      });

      it("컴포넌트 함수를 tag로 저장해야 한다.", () => {
        // TODO: 구현
      });

      it("props를 올바르게 전달해야 한다.", () => {
        // TODO: 구현
      });

      it("props의 key가 있으면 컴포넌트 key로 사용해야 한다.", () => {
        // TODO: 구현
      });

      it("props의 key가 없으면 빈 문자열을 key로 사용해야 한다.", () => {
        // TODO: 구현
      });

      it("children을 올바르게 전달해야 한다.", () => {
        // TODO: 구현
      });
    });

    describe("Fragment 처리", () => {
      it("Fragment 함수를 인식하여 FragmentNode를 생성해야 한다.", () => {
        // TODO: 구현
      });

      it("Fragment의 children을 올바르게 전달해야 한다.", () => {
        // TODO: 구현
      });

      it("h 함수로 Fragment를 호출할 수 있어야 한다.", () => {
        // TODO: 구현
      });
    });
  });

  describe("ElementNode 클래스", () => {
    it("tag와 children을 저장해야 한다.", () => {
      // TODO: 구현
    });

    it("key를 선택적으로 저장할 수 있어야 한다.", () => {
      // TODO: 구현
    });

    it("기본 생성자로 인스턴스를 생성할 수 있어야 한다.", () => {
      // TODO: 구현
    });
  });

  describe("DomElementNode 클래스", () => {
    it("ElementNode를 상속해야 한다.", () => {
      // TODO: 구현
    });

    it("tag, props, children, key를 저장해야 한다.", () => {
      // TODO: 구현
    });

    it("HTML 태그 이름을 문자열로 저장해야 한다.", () => {
      // TODO: 구현
    });

    it("props가 객체 형태로 저장되어야 한다.", () => {
      // TODO: 구현
    });
  });

  describe("CompnentElementNode 클래스", () => {
    it("ElementNode를 상속해야 한다.", () => {
      // TODO: 구현
    });

    it("key, tag, props, children을 저장해야 한다.", () => {
      // TODO: 구현
    });

    it("tag가 함수 타입이어야 한다.", () => {
      // TODO: 구현
    });

    it("state 배열을 선택적으로 저장할 수 있어야 한다.", () => {
      // TODO: 구현
    });

    it("stateCursor를 선택적으로 저장할 수 있어야 한다.", () => {
      // TODO: 구현
    });

    it("parent를 선택적으로 저장할 수 있어야 한다.", () => {
      // TODO: 구현
    });

    it("nodes 배열을 선택적으로 저장할 수 있어야 한다.", () => {
      // TODO: 구현
    });

    it("nestedComponenets를 선택적으로 저장할 수 있어야 한다.", () => {
      // TODO: 구현
    });
  });

  describe("FragmentNode 클래스", () => {
    it("ElementNode를 상속해야 한다.", () => {
      // TODO: 구현
    });

    it("tag가 'Fragment' 문자열이어야 한다.", () => {
      // TODO: 구현
    });

    it("children을 올바르게 저장해야 한다.", () => {
      // TODO: 구현
    });

    it("key를 선택적으로 저장할 수 있어야 한다.", () => {
      // TODO: 구현
    });
  });

  describe("Fragment 함수", () => {
    it("FragmentNode를 반환해야 한다.", () => {
      // TODO: 구현
    });

    it("첫 번째 인자를 무시하고 children만 사용해야 한다.", () => {
      // TODO: 구현
    });

    it("여러 children을 받을 수 있어야 한다.", () => {
      // TODO: 구현
    });

    it("빈 children으로도 생성할 수 있어야 한다.", () => {
      // TODO: 구현
    });
  });

  describe("mapKeyToChildren 함수 (내부 동작)", () => {
    it("children에 key가 없으면 idx 기반 key를 할당해야 한다.", () => {
      // TODO: 구현
    });

    it("children에 이미 key가 있으면 유지해야 한다.", () => {
      // TODO: 구현
    });

    it("key가 빈 문자열이면 idx 기반 key를 할당해야 한다.", () => {
      // TODO: 구현
    });

    it("primitive 타입 children은 그대로 유지해야 한다.", () => {
      // TODO: 구현
    });

    it("null/undefined children은 그대로 유지해야 한다.", () => {
      // TODO: 구현
    });

    it("배열 내 모든 children에 순차적으로 idx를 할당해야 한다.", () => {
      // TODO: 구현
    });
  });

  describe("통합 시나리오", () => {
    it("복잡한 중첩 구조의 JSX를 올바르게 파싱해야 한다.", () => {
      // TODO: 구현
    });

    it("컴포넌트와 DOM 요소가 혼합된 구조를 처리해야 한다.", () => {
      // TODO: 구현
    });

    it("Fragment 내부에 여러 요소를 포함할 수 있어야 한다.", () => {
      // TODO: 구현
    });

    it("깊이 중첩된 컴포넌트 구조를 생성할 수 있어야 한다.", () => {
      // TODO: 구현
    });

    it("배열로 렌더링되는 요소들에 자동 key가 할당되어야 한다.", () => {
      // TODO: 구현
    });
  });
});
