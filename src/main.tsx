import React, { Component, Suspense, lazy, type ReactNode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./styles/fonts.css";
import "./styles/global.css";
import "./styles/simple.css";
import { SiteLayout } from "./layouts/SiteLayout";
import { Home } from "./pages/Home";

const Services = lazy(() =>
  import("./pages/Services").then((m) => ({ default: m.Services })),
);
const Work = lazy(() =>
  import("./pages/Work").then((m) => ({ default: m.Work })),
);
const CaseStudy = lazy(() =>
  import("./pages/CaseStudy").then((m) => ({ default: m.CaseStudy })),
);
const Industries = lazy(() =>
  import("./pages/Industries").then((m) => ({ default: m.Industries })),
);
const About = lazy(() =>
  import("./pages/About").then((m) => ({ default: m.About })),
);
const Contact = lazy(() =>
  import("./pages/Contact").then((m) => ({ default: m.Contact })),
);
const Privacy = lazy(() =>
  import("./pages/Privacy").then((m) => ({ default: m.Privacy })),
);
const NotFound = lazy(() =>
  import("./pages/NotFound").then((m) => ({ default: m.NotFound })),
);
class ErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="container error-page">
        <h1>Something interrupted this preview.</h1>
        <p>Please reload to try again.</p>
        <button
          className="button button-primary"
          onClick={() => window.location.reload()}
        >
          Reload preview
        </button>
        <a href="mailto:veyro350@gmail.com">Contact Veyro</a>
      </div>
    ) : (
      this.props.children
    );
  }
}
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="page-loading" role="status">
              Loading Veyro…
            </div>
          }
        >
          <Routes>
            <Route element={<SiteLayout />}>
              <Route index element={<Home />} />
              <Route path="services" element={<Services />} />
              <Route path="work" element={<Work />} />
              <Route path="work/:slug" element={<CaseStudy />} />
              <Route path="industries" element={<Industries />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);
