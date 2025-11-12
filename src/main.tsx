import { render } from "@core/render";
import { Router } from "./pages/routes";
import { Topbar } from "./shared/components/Topbar";
import { Footer } from "./shared/components/Footer";
import { NotFound } from "./pages/404";

function main() {
  render(
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Topbar />
      <div className="flex-1">
        <Router
          fallback={{
            notFound: NotFound,
            error: (error) => (
              <div>
                Error: {error instanceof Error ? error.message : String(error)}
              </div>
            ),
          }}
        />
      </div>
      <Footer />
    </div>,
  );
}

const enableMocking = () =>
  import("./mocks/browser").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
