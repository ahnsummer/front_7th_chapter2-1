import { DomNode } from "@core/jsx/factory";
import { Topbar } from "./Topbar";
import { Footer } from "./Footer";
import { ToastContainer } from "./Toast";
import { OverlayContainer } from "./Overlay";

export function Layout({ children }: { children?: DomNode }) {
  return (
    <div>
      <Topbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
