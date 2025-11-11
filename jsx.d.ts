import { h as _h, Fragment as _Fragment } from "./src/coreV2/jsx/factory";

// JSX 전역 함수 선언
declare global {
  const h: typeof _h;
  const Fragment: typeof _Fragment;

  namespace JSX {
    type Element = ReturnType<typeof _h>;

    // ========================================
    // 공통 속성 타입
    // ========================================

    /**
     * 모든 HTML 요소가 공통으로 가지는 속성
     */
    interface HTMLAttributes {
      key?: string | number;

      // 기본 속성
      id?: string;
      className?: string;
      style?: string | Partial<CSSStyleDeclaration>;
      title?: string;
      tabIndex?: number;
      hidden?: boolean;

      // ARIA 속성
      role?: string;
      ariaLabel?: string;
      ariaHidden?: boolean;
      ariaDisabled?: boolean;

      // Data 속성
      [key: `data${string}`]: any;
    }

    /**
     * 이벤트 핸들러 속성
     */
    interface EventHandlers {
      // 마우스 이벤트
      onClick?: (event: MouseEvent) => void;
      onDoubleClick?: (event: MouseEvent) => void;
      onContextMenu?: (event: MouseEvent) => void;
      onMouseDown?: (event: MouseEvent) => void;
      onMouseUp?: (event: MouseEvent) => void;
      onMouseEnter?: (event: MouseEvent) => void;
      onMouseLeave?: (event: MouseEvent) => void;
      onMouseMove?: (event: MouseEvent) => void;
      onMouseOver?: (event: MouseEvent) => void;
      onMouseOut?: (event: MouseEvent) => void;

      // 키보드 이벤트
      onKeyDown?: (event: KeyboardEvent) => void;
      onKeyUp?: (event: KeyboardEvent) => void;
      onKeyPress?: (event: KeyboardEvent) => void;

      // 포커스 이벤트
      onFocus?: (event: FocusEvent) => void;
      onBlur?: (event: FocusEvent) => void;

      // 폼 이벤트
      onChange?: (event: Event) => void;
      onInput?: (event: Event) => void;
      onSubmit?: (event: Event) => void;
      onReset?: (event: Event) => void;

      // 클립보드 이벤트
      onCopy?: (event: ClipboardEvent) => void;
      onCut?: (event: ClipboardEvent) => void;
      onPaste?: (event: ClipboardEvent) => void;

      // 기타 이벤트
      onScroll?: (event: Event) => void;
      onWheel?: (event: WheelEvent) => void;
      onDrag?: (event: DragEvent) => void;
      onDrop?: (event: DragEvent) => void;
    }

    /**
     * 모든 HTML 요소의 기본 속성
     */
    type CommonAttributes = HTMLAttributes & EventHandlers;

    // ========================================
    // 개별 요소 타입
    // ========================================

    /**
     * <input> 요소 속성
     */
    interface InputAttributes extends CommonAttributes {
      type?:
        | "text"
        | "password"
        | "email"
        | "number"
        | "tel"
        | "url"
        | "search"
        | "date"
        | "time"
        | "datetime-local"
        | "month"
        | "week"
        | "checkbox"
        | "radio"
        | "file"
        | "submit"
        | "reset"
        | "button"
        | "hidden";
      value?: string | number;
      defaultValue?: string | number;
      placeholder?: string;
      disabled?: boolean;
      readOnly?: boolean;
      required?: boolean;
      checked?: boolean;
      defaultChecked?: boolean;
      name?: string;
      min?: string | number;
      max?: string | number;
      step?: string | number;
      pattern?: string;
      maxLength?: number;
      minLength?: number;
      autoComplete?: string;
      autoFocus?: boolean;
      multiple?: boolean;
      accept?: string;
    }

    /**
     * <button> 요소 속성
     */
    interface ButtonAttributes extends CommonAttributes {
      type?: "button" | "submit" | "reset";
      disabled?: boolean;
      name?: string;
      value?: string;
      autoFocus?: boolean;
    }

    /**
     * <form> 요소 속성
     */
    interface FormAttributes extends CommonAttributes {
      action?: string;
      method?: "get" | "post";
      encType?: string;
      target?: "_blank" | "_self" | "_parent" | "_top";
      autoComplete?: "on" | "off";
      noValidate?: boolean;
    }

    /**
     * <select> 요소 속성
     */
    interface SelectAttributes extends CommonAttributes {
      value?: string | string[];
      defaultValue?: string | string[];
      disabled?: boolean;
      multiple?: boolean;
      name?: string;
      required?: boolean;
      autoFocus?: boolean;
    }

    /**
     * <textarea> 요소 속성
     */
    interface TextareaAttributes extends CommonAttributes {
      value?: string;
      defaultValue?: string;
      placeholder?: string;
      disabled?: boolean;
      readOnly?: boolean;
      required?: boolean;
      name?: string;
      rows?: number;
      cols?: number;
      maxLength?: number;
      minLength?: number;
      autoFocus?: boolean;
      wrap?: "soft" | "hard";
    }

    /**
     * <label> 요소 속성
     */
    interface LabelAttributes extends CommonAttributes {
      htmlFor?: string;
      for?: string; // htmlFor alias
    }

    /**
     * <a> 요소 속성
     */
    interface AnchorAttributes extends CommonAttributes {
      href?: string;
      target?: "_blank" | "_self" | "_parent" | "_top";
      rel?: string;
      download?: string | boolean;
      hrefLang?: string;
      type?: string;
    }

    /**
     * <img> 요소 속성
     */
    interface ImgAttributes extends CommonAttributes {
      src?: string;
      alt?: string;
      width?: string | number;
      height?: string | number;
      loading?: "lazy" | "eager";
      decoding?: "sync" | "async" | "auto";
      crossOrigin?: "anonymous" | "use-credentials";
    }

    /**
     * <video> 요소 속성
     */
    interface VideoAttributes extends CommonAttributes {
      src?: string;
      width?: string | number;
      height?: string | number;
      controls?: boolean;
      autoPlay?: boolean;
      loop?: boolean;
      muted?: boolean;
      poster?: string;
      preload?: "none" | "metadata" | "auto";
    }

    /**
     * <audio> 요소 속성
     */
    interface AudioAttributes extends CommonAttributes {
      src?: string;
      controls?: boolean;
      autoPlay?: boolean;
      loop?: boolean;
      muted?: boolean;
      preload?: "none" | "metadata" | "auto";
    }

    /**
     * <iframe> 요소 속성
     */
    interface IframeAttributes extends CommonAttributes {
      src?: string;
      width?: string | number;
      height?: string | number;
      name?: string;
      sandbox?: string;
      allow?: string;
      loading?: "lazy" | "eager";
    }

    /**
     * <canvas> 요소 속성
     */
    interface CanvasAttributes extends CommonAttributes {
      width?: string | number;
      height?: string | number;
    }

    /**
     * <svg> 요소 속성
     */
    interface SvgAttributes extends CommonAttributes {
      width?: string | number;
      height?: string | number;
      viewBox?: string;
      fill?: string;
      stroke?: string;
      xmlns?: string;
    }

    /**
     * <option> 요소 속성
     */
    interface OptionAttributes extends CommonAttributes {
      value?: string | number;
      disabled?: boolean;
      selected?: boolean;
      label?: string;
    }

    /**
     * <table> 관련 요소 속성
     */
    interface TableAttributes extends CommonAttributes {
      cellPadding?: string | number;
      cellSpacing?: string | number;
    }

    interface TdThAttributes extends CommonAttributes {
      colSpan?: number;
      rowSpan?: number;
      headers?: string;
      scope?: "row" | "col" | "rowgroup" | "colgroup";
    }

    /**
     * <meta> 요소 속성
     */
    interface MetaAttributes extends CommonAttributes {
      name?: string;
      content?: string;
      httpEquiv?: string;
      charset?: string;
    }

    /**
     * <link> 요소 속성
     */
    interface LinkAttributes extends CommonAttributes {
      href?: string;
      rel?: string;
      type?: string;
      media?: string;
      as?: string;
      crossOrigin?: "anonymous" | "use-credentials";
    }

    /**
     * <script> 요소 속성
     */
    interface ScriptAttributes extends CommonAttributes {
      src?: string;
      type?: string;
      async?: boolean;
      defer?: boolean;
      crossOrigin?: "anonymous" | "use-credentials";
      noModule?: boolean;
    }

    /**
     * <style> 요소 속성
     */
    interface StyleAttributes extends CommonAttributes {
      media?: string;
      type?: string;
    }

    // ========================================
    // IntrinsicElements - 각 HTML 태그 매핑
    // ========================================

    interface IntrinsicElements {
      // 텍스트 컨텐츠
      div: CommonAttributes;
      span: CommonAttributes;
      p: CommonAttributes;
      h1: CommonAttributes;
      h2: CommonAttributes;
      h3: CommonAttributes;
      h4: CommonAttributes;
      h5: CommonAttributes;
      h6: CommonAttributes;
      strong: CommonAttributes;
      em: CommonAttributes;
      b: CommonAttributes;
      i: CommonAttributes;
      u: CommonAttributes;
      small: CommonAttributes;
      mark: CommonAttributes;
      del: CommonAttributes;
      ins: CommonAttributes;
      sub: CommonAttributes;
      sup: CommonAttributes;
      code: CommonAttributes;
      pre: CommonAttributes;
      blockquote: CommonAttributes;
      q: CommonAttributes;
      cite: CommonAttributes;
      abbr: CommonAttributes;
      address: CommonAttributes;

      // 리스트
      ul: CommonAttributes;
      ol: CommonAttributes;
      li: CommonAttributes;
      dl: CommonAttributes;
      dt: CommonAttributes;
      dd: CommonAttributes;

      // 폼 요소
      form: FormAttributes;
      input: InputAttributes;
      button: ButtonAttributes;
      select: SelectAttributes;
      textarea: TextareaAttributes;
      label: LabelAttributes;
      option: OptionAttributes;
      optgroup: CommonAttributes;
      fieldset: CommonAttributes;
      legend: CommonAttributes;

      // 미디어
      img: ImgAttributes;
      video: VideoAttributes;
      audio: AudioAttributes;
      source: CommonAttributes;
      track: CommonAttributes;
      picture: CommonAttributes;
      canvas: CanvasAttributes;
      svg: SvgAttributes;

      // 테이블
      table: TableAttributes;
      thead: CommonAttributes;
      tbody: CommonAttributes;
      tfoot: CommonAttributes;
      tr: CommonAttributes;
      th: TdThAttributes;
      td: TdThAttributes;
      caption: CommonAttributes;
      col: CommonAttributes;
      colgroup: CommonAttributes;

      // 링크
      a: AnchorAttributes;
      link: LinkAttributes;

      // 구조
      header: CommonAttributes;
      footer: CommonAttributes;
      main: CommonAttributes;
      section: CommonAttributes;
      article: CommonAttributes;
      aside: CommonAttributes;
      nav: CommonAttributes;
      figure: CommonAttributes;
      figcaption: CommonAttributes;

      // 메타
      head: CommonAttributes;
      title: CommonAttributes;
      meta: MetaAttributes;
      base: CommonAttributes;
      style: StyleAttributes;
      script: ScriptAttributes;

      // 기타
      iframe: IframeAttributes;
      details: CommonAttributes;
      summary: CommonAttributes;
      dialog: CommonAttributes;
      hr: CommonAttributes;
      br: CommonAttributes;
      wbr: CommonAttributes;
      template: CommonAttributes;
      slot: CommonAttributes;
    }
  }
}
