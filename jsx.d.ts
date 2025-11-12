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
     * 이벤트 핸들러 속성 (제네릭)
     */
    interface EventHandlers<T = HTMLElement> {
      // 마우스 이벤트
      onClick?: (
        event: MouseEvent & { currentTarget: T; target: Element },
      ) => void;
      onDoubleClick?: (
        event: MouseEvent & { currentTarget: T; target: Element },
      ) => void;
      onContextMenu?: (
        event: MouseEvent & { currentTarget: T; target: Element },
      ) => void;
      onMouseDown?: (
        event: MouseEvent & { currentTarget: T; target: Element },
      ) => void;
      onMouseUp?: (
        event: MouseEvent & { currentTarget: T; target: Element },
      ) => void;
      onMouseEnter?: (
        event: MouseEvent & { currentTarget: T; target: Element },
      ) => void;
      onMouseLeave?: (
        event: MouseEvent & { currentTarget: T; target: Element },
      ) => void;
      onMouseMove?: (
        event: MouseEvent & { currentTarget: T; target: Element },
      ) => void;
      onMouseOver?: (
        event: MouseEvent & { currentTarget: T; target: Element },
      ) => void;
      onMouseOut?: (
        event: MouseEvent & { currentTarget: T; target: Element },
      ) => void;

      // 키보드 이벤트
      onKeyDown?: (
        event: KeyboardEvent & { currentTarget: T; target: Element },
      ) => void;
      onKeyUp?: (
        event: KeyboardEvent & { currentTarget: T; target: Element },
      ) => void;
      onKeyPress?: (
        event: KeyboardEvent & { currentTarget: T; target: Element },
      ) => void;

      // 포커스 이벤트
      onFocus?: (
        event: FocusEvent & { currentTarget: T; target: Element },
      ) => void;
      onBlur?: (
        event: FocusEvent & { currentTarget: T; target: Element },
      ) => void;

      // 폼 이벤트
      onChange?: (event: Event & { currentTarget: T; target: Element }) => void;
      onInput?: (event: Event & { currentTarget: T; target: Element }) => void;
      onSubmit?: (event: Event & { currentTarget: T; target: Element }) => void;
      onReset?: (event: Event & { currentTarget: T; target: Element }) => void;

      // 클립보드 이벤트
      onCopy?: (
        event: ClipboardEvent & { currentTarget: T; target: Element },
      ) => void;
      onCut?: (
        event: ClipboardEvent & { currentTarget: T; target: Element },
      ) => void;
      onPaste?: (
        event: ClipboardEvent & { currentTarget: T; target: Element },
      ) => void;

      // 기타 이벤트
      onScroll?: (event: Event & { currentTarget: T; target: Element }) => void;
      onWheel?: (
        event: WheelEvent & { currentTarget: T; target: Element },
      ) => void;
      onDrag?: (
        event: DragEvent & { currentTarget: T; target: Element },
      ) => void;
      onDrop?: (
        event: DragEvent & { currentTarget: T; target: Element },
      ) => void;
    }

    /**
     * 모든 HTML 요소의 기본 속성
     */
    type CommonAttributes<T = HTMLElement> = HTMLAttributes & EventHandlers<T>;

    // ========================================
    // 개별 요소 타입
    // ========================================

    /**
     * <input> 요소 속성
     */
    interface InputAttributes extends CommonAttributes<HTMLInputElement> {
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
    interface ButtonAttributes extends CommonAttributes<HTMLButtonElement> {
      type?: "button" | "submit" | "reset";
      disabled?: boolean;
      name?: string;
      value?: string;
      autoFocus?: boolean;
    }

    /**
     * <form> 요소 속성
     */
    interface FormAttributes extends CommonAttributes<HTMLFormElement> {
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
    interface SelectAttributes extends CommonAttributes<HTMLSelectElement> {
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
    interface TextareaAttributes extends CommonAttributes<HTMLTextAreaElement> {
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
    interface LabelAttributes extends CommonAttributes<HTMLLabelElement> {
      htmlFor?: string;
      for?: string; // htmlFor alias
    }

    /**
     * <a> 요소 속성
     */
    interface AnchorAttributes extends CommonAttributes<HTMLAnchorElement> {
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
    interface ImgAttributes extends CommonAttributes<HTMLImageElement> {
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
    interface VideoAttributes extends CommonAttributes<HTMLVideoElement> {
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
    interface AudioAttributes extends CommonAttributes<HTMLAudioElement> {
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
    interface IframeAttributes extends CommonAttributes<HTMLIFrameElement> {
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
    interface CanvasAttributes extends CommonAttributes<HTMLCanvasElement> {
      width?: string | number;
      height?: string | number;
    }

    /**
     * <svg> 요소 속성
     */
    interface SvgAttributes extends CommonAttributes<SVGSVGElement> {
      width?: string | number;
      height?: string | number;
      viewBox?: string;
      fill?: string;
      stroke?: string;
      xmlns?: string;
      preserveAspectRatio?: string;
    }

    /**
     * <defs> 요소 속성
     */
    interface DefsAttributes extends CommonAttributes<SVGDefsElement> {}

    /**
     * <linearGradient> 요소 속성
     */
    interface LinearGradientAttributes
      extends CommonAttributes<SVGLinearGradientElement> {
      id?: string;
      x1?: string;
      y1?: string;
      x2?: string;
      y2?: string;
      gradientUnits?: "userSpaceOnUse" | "objectBoundingBox";
      gradientTransform?: string;
    }

    /**
     * <stop> 요소 속성
     */
    interface StopAttributes extends CommonAttributes<SVGStopElement> {
      offset?: string | number;
      stopColor?: string;
      stopOpacity?: string | number;
    }

    /**
     * <filter> 요소 속성
     */
    interface FilterAttributes extends CommonAttributes<SVGFilterElement> {
      id?: string;
      x?: string;
      y?: string;
      width?: string;
      height?: string;
      filterUnits?: "userSpaceOnUse" | "objectBoundingBox";
    }

    /**
     * <feDropShadow> 요소 속성
     */
    interface FeDropShadowAttributes
      extends CommonAttributes<SVGFEDropShadowElement> {
      dx?: string | number;
      dy?: string | number;
      stdDeviation?: string | number;
      floodColor?: string;
      floodOpacity?: string | number;
    }

    /**
     * <path> 요소 속성
     */
    interface PathAttributes extends CommonAttributes<SVGPathElement> {
      d?: string;
      fill?: string;
      stroke?: string;
      strokeWidth?: string | number;
      strokeLinecap?: "butt" | "round" | "square";
      strokeLinejoin?: "miter" | "round" | "bevel";
      strokeDasharray?: string;
      strokeDashoffset?: string | number;
    }

    /**
     * <circle> 요소 속성
     */
    interface CircleAttributes extends CommonAttributes<SVGCircleElement> {
      cx?: string | number;
      cy?: string | number;
      r?: string | number;
      fill?: string;
      stroke?: string;
      strokeWidth?: string | number;
      opacity?: string | number;
    }

    /**
     * <rect> 요소 속성
     */
    interface RectAttributes extends CommonAttributes<SVGRectElement> {
      x?: string | number;
      y?: string | number;
      width?: string | number;
      height?: string | number;
      rx?: string | number;
      ry?: string | number;
      fill?: string;
      stroke?: string;
      strokeWidth?: string | number;
      opacity?: string | number;
    }

    /**
     * <text> 요소 속성
     */
    interface TextAttributes extends CommonAttributes<SVGTextElement> {
      x?: string | number;
      y?: string | number;
      dx?: string | number;
      dy?: string | number;
      textAnchor?: "start" | "middle" | "end";
      fontFamily?: string;
      fontSize?: string | number;
      fontWeight?: string | number;
      fill?: string;
      stroke?: string;
    }

    /**
     * <g> 요소 속성
     */
    interface GAttributes extends CommonAttributes<SVGGElement> {
      transform?: string;
      fill?: string;
      stroke?: string;
      strokeWidth?: string | number;
      opacity?: string | number;
    }

    /**
     * <line> 요소 속성
     */
    interface LineAttributes extends CommonAttributes<SVGLineElement> {
      x1?: string | number;
      y1?: string | number;
      x2?: string | number;
      y2?: string | number;
      stroke?: string;
      strokeWidth?: string | number;
    }

    /**
     * <polyline> 요소 속성
     */
    interface PolylineAttributes extends CommonAttributes<SVGPolylineElement> {
      points?: string;
      fill?: string;
      stroke?: string;
      strokeWidth?: string | number;
    }

    /**
     * <polygon> 요소 속성
     */
    interface PolygonAttributes extends CommonAttributes<SVGPolygonElement> {
      points?: string;
      fill?: string;
      stroke?: string;
      strokeWidth?: string | number;
    }

    /**
     * <option> 요소 속성
     */
    interface OptionAttributes extends CommonAttributes<HTMLOptionElement> {
      value?: string | number;
      disabled?: boolean;
      selected?: boolean;
      label?: string;
    }

    /**
     * <table> 관련 요소 속성
     */
    interface TableAttributes extends CommonAttributes<HTMLTableElement> {
      cellPadding?: string | number;
      cellSpacing?: string | number;
    }

    interface TdThAttributes extends CommonAttributes<HTMLTableCellElement> {
      colSpan?: number;
      rowSpan?: number;
      headers?: string;
      scope?: "row" | "col" | "rowgroup" | "colgroup";
    }

    /**
     * <meta> 요소 속성
     */
    interface MetaAttributes extends CommonAttributes<HTMLMetaElement> {
      name?: string;
      content?: string;
      httpEquiv?: string;
      charset?: string;
    }

    /**
     * <link> 요소 속성
     */
    interface LinkAttributes extends CommonAttributes<HTMLLinkElement> {
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
    interface ScriptAttributes extends CommonAttributes<HTMLScriptElement> {
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
    interface StyleAttributes extends CommonAttributes<HTMLStyleElement> {
      media?: string;
      type?: string;
    }

    // ========================================
    // IntrinsicElements - 각 HTML 태그 매핑
    // ========================================

    interface IntrinsicElements {
      // 텍스트 컨텐츠
      div: CommonAttributes<HTMLDivElement>;
      span: CommonAttributes<HTMLSpanElement>;
      p: CommonAttributes<HTMLParagraphElement>;
      h1: CommonAttributes<HTMLHeadingElement>;
      h2: CommonAttributes<HTMLHeadingElement>;
      h3: CommonAttributes<HTMLHeadingElement>;
      h4: CommonAttributes<HTMLHeadingElement>;
      h5: CommonAttributes<HTMLHeadingElement>;
      h6: CommonAttributes<HTMLHeadingElement>;
      strong: CommonAttributes<HTMLElement>;
      em: CommonAttributes<HTMLElement>;
      b: CommonAttributes<HTMLElement>;
      i: CommonAttributes<HTMLElement>;
      u: CommonAttributes<HTMLElement>;
      small: CommonAttributes<HTMLElement>;
      mark: CommonAttributes<HTMLElement>;
      del: CommonAttributes<HTMLModElement>;
      ins: CommonAttributes<HTMLModElement>;
      sub: CommonAttributes<HTMLElement>;
      sup: CommonAttributes<HTMLElement>;
      code: CommonAttributes<HTMLElement>;
      pre: CommonAttributes<HTMLPreElement>;
      blockquote: CommonAttributes<HTMLQuoteElement>;
      q: CommonAttributes<HTMLQuoteElement>;
      cite: CommonAttributes<HTMLElement>;
      abbr: CommonAttributes<HTMLElement>;
      address: CommonAttributes<HTMLElement>;

      // 리스트
      ul: CommonAttributes<HTMLUListElement>;
      ol: CommonAttributes<HTMLOListElement>;
      li: CommonAttributes<HTMLLIElement>;
      dl: CommonAttributes<HTMLDListElement>;
      dt: CommonAttributes<HTMLElement>;
      dd: CommonAttributes<HTMLElement>;

      // 폼 요소
      form: FormAttributes;
      input: InputAttributes;
      button: ButtonAttributes;
      select: SelectAttributes;
      textarea: TextareaAttributes;
      label: LabelAttributes;
      option: OptionAttributes;
      optgroup: CommonAttributes<HTMLOptGroupElement>;
      fieldset: CommonAttributes<HTMLFieldSetElement>;
      legend: CommonAttributes<HTMLLegendElement>;

      // 미디어
      img: ImgAttributes;
      video: VideoAttributes;
      audio: AudioAttributes;
      source: CommonAttributes<HTMLSourceElement>;
      track: CommonAttributes<HTMLTrackElement>;
      picture: CommonAttributes<HTMLPictureElement>;
      canvas: CanvasAttributes;

      // SVG 요소
      svg: SvgAttributes;
      defs: DefsAttributes;
      linearGradient: LinearGradientAttributes;
      stop: StopAttributes;
      filter: FilterAttributes;
      feDropShadow: FeDropShadowAttributes;
      path: PathAttributes;
      circle: CircleAttributes;
      rect: RectAttributes;
      text: TextAttributes;
      g: GAttributes;
      line: LineAttributes;
      polyline: PolylineAttributes;
      polygon: PolygonAttributes;
      ellipse: EllipseAttributes;

      // 테이블
      table: TableAttributes;
      thead: CommonAttributes<HTMLTableSectionElement>;
      tbody: CommonAttributes<HTMLTableSectionElement>;
      tfoot: CommonAttributes<HTMLTableSectionElement>;
      tr: CommonAttributes<HTMLTableRowElement>;
      th: TdThAttributes;
      td: TdThAttributes;
      caption: CommonAttributes<HTMLTableCaptionElement>;
      col: CommonAttributes<HTMLTableColElement>;
      colgroup: CommonAttributes<HTMLTableColElement>;

      // 링크
      a: AnchorAttributes;
      link: LinkAttributes;

      // 구조
      header: CommonAttributes<HTMLElement>;
      footer: CommonAttributes<HTMLElement>;
      main: CommonAttributes<HTMLElement>;
      section: CommonAttributes<HTMLElement>;
      article: CommonAttributes<HTMLElement>;
      aside: CommonAttributes<HTMLElement>;
      nav: CommonAttributes<HTMLElement>;
      figure: CommonAttributes<HTMLElement>;
      figcaption: CommonAttributes<HTMLElement>;

      // 메타
      head: CommonAttributes<HTMLHeadElement>;
      title: CommonAttributes<HTMLTitleElement>;
      meta: MetaAttributes;
      base: CommonAttributes<HTMLBaseElement>;
      style: StyleAttributes;
      script: ScriptAttributes;

      // 기타
      iframe: IframeAttributes;
      details: CommonAttributes<HTMLDetailsElement>;
      summary: CommonAttributes<HTMLElement>;
      dialog: CommonAttributes<HTMLDialogElement>;
      hr: CommonAttributes<HTMLHRElement>;
      br: CommonAttributes<HTMLBRElement>;
      wbr: CommonAttributes<HTMLElement>;
      template: CommonAttributes<HTMLTemplateElement>;
      slot: CommonAttributes<HTMLSlotElement>;
    }
  }
}
