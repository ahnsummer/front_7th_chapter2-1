# Render 모듈

Virtual DOM 기반 렌더링 시스템으로, 효율적인 DOM 업데이트와 상태 관리를 제공합니다.

## 📁 디렉토리 구조

```
render/
├── index.ts              # 메인 render/rerender 함수
├── types.ts              # 타입 정의
├── template/             # Template literal 처리
│   └── index.ts         
├── renderData/           # Render 데이터 관리
│   ├── index.ts         
│   └── RenderData.ts    
├── snapshot/             # 렌더링 스냅샷 관리
│   └── index.ts         
├── dom/                  # DOM 유틸리티
│   └── index.ts         
├── handlers/             # 이벤트 핸들러 관리
│   └── index.ts         
├── sideEffects/          # 사이드 이펙트 관리
│   └── index.ts         
└── README.md             # 문서
```

## 🎯 관심사별 분리

### 1. **Template Processing** (`template/`)
Template literal을 처리하고 노드를 문자열로 변환합니다.

**주요 함수:**
- `processNode()` - 다양한 타입의 노드를 문자열로 변환
- `normalizeTemplateLiterals()` - template strings와 expressions를 정규화

**처리 가능한 노드 타입:**
- `HtmlTemplateNode` - HTML 템플릿 노드
- `State` - 상태 객체 (배열 State도 지원)
- `EventHandler` - 이벤트 핸들러
- `Array` - 배열 (각 요소를 재귀적으로 처리)
- Primitive values - 문자열, 숫자 등

### 2. **Render Data Management** (`renderData/`)
렌더링에 필요한 template literal 데이터를 저장하고 관리합니다.

**주요 컴포넌트:**
- `RenderData` 클래스 - template strings와 expressions 저장
- `renderData` 싱글톤 - 전역 렌더 데이터 저장소
- `getParticles()` - 정규화된 particles 배열 반환

### 3. **Snapshot Management** (`snapshot/`)
이전 렌더링 결과를 저장하여 변경 감지(diffing)에 사용합니다.

**저장 데이터:**
- `html` - 렌더링된 HTML 문자열
- `handlers` - 등록된 이벤트 핸들러 목록
- `sideEffects` - 실행된 사이드 이펙트와 dependencies 스냅샷

### 4. **DOM Utilities** (`dom/`)
DOM 조작과 관련된 유틸리티 함수들입니다.

**주요 함수:**
- `root()` - #root 요소 가져오기
- `sanitizeHTML()` - data-event 속성 정제
- `htmlStringToElement()` - HTML 문자열을 DOM 요소로 변환

### 5. **Event Handler Management** (`handlers/`)
이벤트 핸들러의 등록과 제거를 관리합니다.

**주요 함수:**
- `registerHandlers()` - DOM에 이벤트 리스너 등록
- `cleanup()` - 이전 핸들러들 제거 (메모리 누수 방지)

**동작 방식:**
1. `on()` 함수로 생성된 핸들러들을 수집
2. `data-event-{id}` 속성으로 DOM 요소와 매칭
3. 실제 이벤트 리스너 등록/해제

### 6. **Side Effects Management** (`sideEffects/`)
`useEffect` 훅으로 등록된 사이드 이펙트를 관리하고 실행합니다.

**주요 함수:**
- `runInitialSideEffects()` - 초기 렌더링 시 모든 effect 실행
- `runChangedSideEffects()` - dependencies가 변경된 effect만 실행
- `updateSideEffectsSnapshot()` - 스냅샷의 dependencies 업데이트

**최적화 기법:**
- Dependencies 변경 감지 (deepEqual 사용)
- 변경된 effect만 선택적 재실행
- State 객체를 실제 값으로 변환하여 비교

## 🚀 사용 예시

### 기본 렌더링

```typescript
import { render } from './core/render';

// 정적 HTML 렌더링
render`
  <div>
    <h1>Hello World</h1>
  </div>
`;
```

### State와 함께 사용

```typescript
import { render } from './core/render';
import { useState } from './core/state/useState';
import { on } from './core/on';

const $count = useState(0);

render`
  <div>
    <p>Count: ${$count}</p>
    <button ${on('click', () => $count.set(prev => prev + 1))}>
      Increment
    </button>
  </div>
`;

// $count.set()이 호출되면 자동으로 rerender() 실행
// morphdom을 사용하여 변경된 부분만 효율적으로 업데이트됨
```

### 배열 렌더링

```typescript
import { render } from './core/render';
import { useState } from './core/state/useState';
import { html } from './core/component';

const $items = useState([
  { id: 1, text: 'Item 1' },
  { id: 2, text: 'Item 2' },
  { id: 3, text: 'Item 3' }
]);

render`
  <div>
    <h1>Todo List</h1>
    <ul>
      ${$items.ref(items => items.map(item => html`
        <li data-key="${item.id}">${item.text}</li>
      `))}
    </ul>
  </div>
`;

// $items가 변경되면 리스트가 자동으로 업데이트됨
```

### useEffect와 함께 사용

```typescript
import { render } from './core/render';
import { useState } from './core/state/useState';
import { useEffect } from './core/state/useEffect';

const $count = useState(0);

// count가 변경될 때마다 실행
useEffect((deps) => {
  console.log('Count changed to:', deps[0]);
  document.title = `Count: ${deps[0]}`;
}, [$count]);

render`
  <div>
    <p>Count: ${$count}</p>
    <button ${on('click', () => $count.set(prev => prev + 1))}>
      Increment
    </button>
  </div>
`;

// $count.set()이 호출되면:
// 1. rerender() 실행
// 2. runChangedSideEffects() 호출
// 3. dependencies가 변경된 effect만 재실행
```

### 컴포넌트와 함께 사용

```typescript
import { render } from './core/render';
import { component, html } from './core/component';
import { useState } from './core/state/useState';
import { useEffect } from './core/state/useEffect';
import { on } from './core/on';

const Counter = component((props: { initial: number }) => {
  const $count = useState(props.initial);

  useEffect((deps) => {
    console.log('Counter mounted with:', deps[0]);
  }, [$count]);

  return html`
    <div>
      <p>Count: ${$count}</p>
      <button ${on('click', () => $count.set(prev => prev + 1))}>
        +1
      </button>
    </div>
  `;
});

render`
  <div>
    <h1>Counter App</h1>
    ${Counter({ initial: 0 })}
  </div>
`;
```

## 🔄 렌더링 흐름

### 초기 렌더링 (render)

1. **Template 파싱** - `renderData.set()` 으로 template 저장
2. **Particles 생성** - `getParticles()` 로 정규화
3. **HTML 생성** - `processNode()` 로 노드들을 문자열로 변환
4. **DOM 업데이트** - `root().innerHTML` 로 렌더링
5. **스냅샷 저장** - HTML을 snapshot에 저장
6. **핸들러 등록** - `registerHandlers()` 로 이벤트 리스너 등록
7. **Side Effects 실행** - `runInitialSideEffects()` 로 모든 effect 실행

### 리렌더링 (rerender)

1. **Particles 재생성** - 저장된 renderData로 particles 생성
2. **HTML 생성** - 새로운 HTML 문자열 생성
3. **변경 없으면 종료** - 같으면 early return
4. **Morphdom 적용** - morphdom으로 효율적인 DOM 업데이트
5. **스냅샷 갱신** - 새로운 HTML로 snapshot 업데이트
6. **핸들러 정리** - `cleanup()` 으로 이전 핸들러 제거
7. **Side Effects 실행** - `runChangedSideEffects()` 로 변경된 effect만 실행
8. **스냅샷 업데이트** - `updateSideEffectsSnapshot()` 로 dependencies 갱신
9. **핸들러 재등록** - `registerHandlers()` 로 새 핸들러 등록

## 📝 JSDoc 규칙

모든 함수는 다음 정보를 포함한 JSDoc을 가지고 있습니다:

- `@description` - 함수 설명
- `@param` - 파라미터 설명 (객체는 `obj.member` 형태로 풀어서 작성)
- `@returns` - 반환값 타입과 설명
- `@throws` - 발생 가능한 에러 (있는 경우)
- `@example` - 실제 사용 예시 (입력/출력 포함)

## 🎨 설계 원칙

### 1. 단일 책임 원칙 (SRP)
각 모듈은 하나의 명확한 책임만 가집니다.

### 2. 관심사의 분리 (SoC)
렌더링 로직을 기능별로 분리하여 유지보수성 향상

### 3. 의존성 역전 원칙 (DIP)
상위 모듈(index.ts)이 하위 모듈(template, dom, handlers, sideEffects)을 조합

### 4. 개방-폐쇄 원칙 (OCP)
새로운 노드 타입 추가 시 processNode에만 수정

## 🔧 확장성

### 새로운 노드 타입 추가

`template/index.ts`의 `processNode()`에 타입 체크 추가:

```typescript
export function processNode(node: unknown): string {
  // 기존 타입들...
  
  if (node instanceof MyNewNodeType) {
    return node.toString();
  }
  
  return String(node);
}
```

### 커스텀 Side Effect 로직 추가

`sideEffects/index.ts`에 새로운 함수 추가:

```typescript
export function runCustomSideEffects() {
  // 커스텀 로직 구현
}
```

## 🚀 성능 최적화

### 1. Morphdom 사용
xml2js 기반 수동 diffing 대신 morphdom 라이브러리를 사용하여 효율적인 DOM 업데이트

### 2. Selective Side Effects
dependencies가 변경된 effect만 재실행하여 불필요한 연산 최소화

### 3. Array 렌더링 지원
State가 배열을 포함하는 경우 자동으로 각 요소를 처리

### 4. data-key 기반 요소 추적
리스트 렌더링 시 key를 통해 요소 식별 및 효율적 업데이트

## 🧪 테스트

빌드 테스트:
```bash
npm run build
```

개발 서버:
```bash
npm run dev
```

## 📚 참고

- [Morphdom](https://github.com/patrick-steele-idem/morphdom) - 효율적인 DOM diffing 라이브러리
- [Virtual DOM 개념](https://ko.legacy.reactjs.org/docs/faq-internals.html)
- [Template Literals](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Template_literals)
- [React useEffect](https://react.dev/reference/react/useEffect) - Side Effects 참고

