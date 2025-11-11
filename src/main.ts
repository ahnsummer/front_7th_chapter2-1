import { render } from "./core/render";
import { ProductListPage } from "./pages/product/list";
import { Footer } from "./shared/components/Footer";
import { TopBar } from "./shared/components/TopBar";

/**
 * MSW를 활성화하는 함수
 */
const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

/**
 * 메인 함수 - 애플리케이션 초기화 및 레이아웃 렌더링
 */
function main() {
  render`
     <div class="bg-gray-50 flex flex-col flex-grow h-screen">
      ${TopBar()}
      <div class="flex-1">
        ${ProductListPage()}
      </div>
      ${Footer()}
    </div>
  `;
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
