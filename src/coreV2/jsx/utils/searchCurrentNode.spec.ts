import { describe, it, expect } from "vitest";
import { searchCurrentNode } from "./searchCurrentNode";
import {
  CompnentElementNode,
  DomElementNode,
  FragmentNode,
  ElementNode,
} from "../factory";

describe("searchCurrentNode", () => {
  describe("기본 검색", () => {
    it("key가 일치하는 CompnentElementNode를 찾아야 한다.", () => {
      // TODO: 구현
    });

    it("key가 일치하지 않으면 null을 반환해야 한다.", () => {
      // TODO: 구현
    });

    it("targetNode 자신이 일치하는 컴포넌트면 자신을 반환해야 한다.", () => {
      // TODO: 구현
    });

    it("빈 문자열 key도 검색할 수 있어야 한다.", () => {
      // TODO: 구현
    });
  });

  describe("재귀 검색", () => {
    it("children 중에서 컴포넌트를 찾아야 한다.", () => {
      // TODO: 구현
    });

    it("깊이 중첩된 구조에서 컴포넌트를 찾아야 한다.", () => {
      // TODO: 구현
    });

    it("여러 레벨을 순회하며 찾아야 한다.", () => {
      // TODO: 구현
    });

    it("DomElementNode의 children을 순회해야 한다.", () => {
      // TODO: 구현
    });

    it("FragmentNode의 children을 순회해야 한다.", () => {
      // TODO: 구현
    });
  });

  describe("nestedComponents 검색", () => {
    it("CompnentElementNode의 nestedComponents에서 검색해야 한다.", () => {
      // TODO: 구현
    });

    it("nestedComponents가 없으면 에러 없이 넘어가야 한다.", () => {
      // TODO: 구현
    });

    it("nestedComponents가 빈 배열이면 에러 없이 넘어가야 한다.", () => {
      // TODO: 구현
    });

    it("nestedComponents 내부를 재귀적으로 검색해야 한다.", () => {
      // TODO: 구현
    });
  });

  describe("검색 우선순위", () => {
    it("같은 key를 가진 컴포넌트가 여러 개면 첫 번째를 반환해야 한다.", () => {
      // TODO: 구현
    });

    it("현재 레벨에서 먼저 찾고, 없으면 children을 검색해야 한다.", () => {
      // TODO: 구현
    });

    it("children 검색 후 nestedComponents를 검색해야 한다.", () => {
      // TODO: 구현
    });
  });

  describe("엣지 케이스", () => {
    it("targetNode가 null이면 에러를 던져야 한다.", () => {
      // TODO: 구현
    });

    it("children이 빈 배열이면 null을 반환해야 한다.", () => {
      // TODO: 구현
    });

    it("primitive 타입 children은 무시하고 검색해야 한다.", () => {
      // TODO: 구현
    });

    it("null/undefined children이 있어도 에러 없이 검색해야 한다.", () => {
      // TODO: 구현
    });

    it("매우 깊은 트리에서도 검색할 수 있어야 한다.", () => {
      // TODO: 구현
    });
  });

  describe("실제 사용 시나리오", () => {
    it("리렌더링 시 이전 컴포넌트 인스턴스를 찾을 수 있어야 한다.", () => {
      // TODO: 구현
    });

    it("여러 컴포넌트가 있는 앱에서 특정 컴포넌트를 찾을 수 있어야 한다.", () => {
      // TODO: 구현
    });

    it("조건부 렌더링으로 컴포넌트가 제거되면 null을 반환해야 한다.", () => {
      // TODO: 구현
    });

    it("동적으로 추가된 컴포넌트도 찾을 수 있어야 한다.", () => {
      // TODO: 구현
    });

    it("배열로 렌더링된 컴포넌트들을 key로 찾을 수 있어야 한다.", () => {
      // TODO: 구현
    });
  });
});
