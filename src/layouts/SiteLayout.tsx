import { useLayoutEffect, useRef } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X, Instagram } from "lucide-react";
import site from "../config/site.json";
import routes from "../config/routes.json";
import { trapDialogFocus } from "../utils/accessibility";

const navigation = [
  { label: "Services", to: "/services" },
  { label: "Our work", to: "/work" },
  { label: "About", to: "/about" },
];
function updateMeta(selector: string, content: string) {
  document.querySelector(selector)?.setAttribute("content", content);
}
export function SiteLayout() {
  const { pathname: rawPathname, hash } = useLocation();
  const pathname = rawPathname.replace(/\/+$/, "").toLowerCase() || "/";
  const menu = useRef<HTMLDialogElement>(null);
  const previousPath = useRef(pathname);
  useLayoutEffect(() => {
    const route = routes.find((r) => r.path === pathname) ?? {
      title: "Page not found | Veyro",
      description: "Find your way back to Veyro Digital Studio.",
    };
    document.title = route.title;
    updateMeta('meta[name="description"]', route.description);
    updateMeta('meta[property="og:title"]', route.title);
    updateMeta('meta[property="og:description"]', route.description);
    updateMeta('meta[name="twitter:title"]', route.title);
    updateMeta('meta[name="twitter:description"]', route.description);
    const canonical = `${site.canonicalOrigin}${pathname}`;
    updateMeta('meta[property="og:url"]', canonical);
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute("href", canonical);
    menu.current?.close();
    if (hash) {
      requestAnimationFrame(() =>
        document.getElementById(hash.slice(1))?.scrollIntoView({
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        }),
      );
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
      if (previousPath.current !== pathname)
        document
          .querySelector<HTMLElement>("main h1")
          ?.focus({ preventScroll: true });
    }
    previousPath.current = pathname;
  }, [pathname, hash]);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner container">
          <Link to="/" className="brand-link" aria-label="Veyro home">
            <img
              src="/brand/logo-horizontal-transparent.png"
              alt="Veyro"
              width="150"
              height="46"
            />
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navigation.map((n) => (
              <NavLink to={n.to} key={n.to}>
                {n.label}
              </NavLink>
            ))}
          </nav>
          <Link className="header-cta" to="/contact">
            Get a quote <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
          <button
            className="menu-toggle icon-button"
            aria-label="Open navigation menu"
            aria-haspopup="dialog"
            onClick={() => menu.current?.showModal()}
          >
            <Menu />
          </button>
        </div>
      </header>
      <dialog
        onKeyDown={trapDialogFocus}
        className="mobile-dialog"
        ref={menu}
        aria-labelledby="mobile-menu-title"
      >
        <div className="mobile-menu-head">
          <span id="mobile-menu-title">Explore Veyro</span>
          <button
            autoFocus
            className="icon-button"
            aria-label="Close navigation menu"
            onClick={() => menu.current?.close()}
          >
            <X />
          </button>
        </div>
        <nav aria-label="Mobile navigation">
          {[...navigation, { label: "Get a quote", to: "/contact" }].map(
            (n) => (
              <NavLink
                key={n.to}
                to={n.to}
                onClick={() => menu.current?.close()}
              >
                {n.label}
                <ArrowUpRight aria-hidden="true" />
              </NavLink>
            ),
          )}
        </nav>
        <p>Websites, software and business automation.</p>
      </dialog>
      <main id="main" className="simple-site" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container">
          <div className="footer-top">
            <div>
              <Link to="/" className="footer-logo" aria-label="Veyro home">
                <img
                  src="/brand/logo-horizontal-transparent.png"
                  alt="Veyro"
                  width="160"
                  height="49"
                />
              </Link>
              <p>
                Websites, software and automation
                <br />
                for small businesses.
              </p>
            </div>
            <div className="footer-contact">
              <span className="eyebrow-text">Contact Veyro</span>
              <a href={`mailto:${site.email}`}>
                {site.email}
                <ArrowUpRight size={22} aria-hidden="true" />
              </a>
              <p>
                Based in Philadelphia.
                <br />
                Working across the US and remotely worldwide.
              </p>
            </div>
            <nav className="footer-nav" aria-label="Footer navigation">
              {[
                ...navigation,
                { label: "Industries", to: "/industries" },
                { label: "Contact", to: "/contact" },
              ].map((n) => (
                <Link to={n.to} key={n.to}>
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} {site.fullName}
            </span>
            <div className="social-links">
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={15} aria-hidden="true" /> Instagram
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <a href={site.facebook} target="_blank" rel="noopener noreferrer">
                Facebook
                <ArrowUpRight size={14} aria-hidden="true" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
            <Link to="/privacy">Privacy policy</Link>
          </div>
          {site.previewMode && (
            <p className="preview-footer">
              Local review preview · Inquiry delivery is not connected.
            </p>
          )}
        </div>
      </footer>
    </>
  );
}
