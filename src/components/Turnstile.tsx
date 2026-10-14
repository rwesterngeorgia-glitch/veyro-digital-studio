import { useEffect, useRef, useState } from "react";
import site from "../config/site.json";
interface TurnstileApi {
  render(element: HTMLElement, options: Record<string, unknown>): string;
  remove(id: string): void;
}
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}
let loading: Promise<void> | undefined;
function load() {
  if (window.turnstile) return Promise.resolve();
  if (!loading)
    loading = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        loading = undefined;
        script.remove();
        reject(new Error("Security check unavailable"));
      };
      document.head.appendChild(script);
    });
  return loading;
}
export function Turnstile({
  onToken,
  resetKey,
}: {
  onToken: (token: string) => void;
  resetKey: number;
}) {
  const element = useRef<HTMLDivElement>(null);
  const callback = useRef(onToken);
  callback.current = onToken;
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let disposed = false,
      widget: string | undefined;
    callback.current("");
    load()
      .then(() => {
        if (disposed || !element.current || !window.turnstile) return;
        widget = window.turnstile.render(element.current, {
          sitekey: site.turnstileSiteKey,
          action: "inquiry",
          theme: "light",
          size: "compact",
          callback: (token: string) => {
            setFailed(false);
            callback.current(token);
          },
          "expired-callback": () => callback.current(""),
          "error-callback": () => {
            setFailed(true);
            callback.current("");
          },
        });
      })
      .catch(() => {
        if (!disposed) setFailed(true);
      });
    return () => {
      disposed = true;
      if (widget && window.turnstile) window.turnstile.remove(widget);
    };
  }, [resetKey]);
  return (
    <div className="form-security">
      <div ref={element} role="group" aria-label="Security check" />
      {failed && (
        <p role="alert">
          The security check couldn’t load. Please reload or email {site.email}.
        </p>
      )}
    </div>
  );
}
