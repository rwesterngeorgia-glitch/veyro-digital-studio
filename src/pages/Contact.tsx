import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowUpRight, ArrowRight, Mail, Instagram } from "lucide-react";
import { PageIntro } from "../components/UI";
import { Turnstile } from "../components/Turnstile";
import {
  budgetOptions,
  sendInquiry,
  projectOptions,
  validateInquiry,
  type Inquiry,
  type InquiryErrors,
} from "../utils/inquiry";
import site from "../config/site.json";

const labels: Record<keyof Inquiry, string> = {
  name: "Name",
  email: "Email",
  business: "Business name",
  project: "Type of project",
  budget: "Budget range",
  details: "Project details",
  preferred: "Preferred contact method",
  website: "Website",
};
export function Contact() {
  const [clientReady, setClientReady] = useState(false);
  useEffect(() => setClientReady(true), []);
  const [search] = useSearchParams();
  const initialProject = search.get("project") || "";
  const launchInquiry =
    site.launchOffer.active && search.get("offer") === "launch";
  const emptyForm: Inquiry = {
    name: "",
    email: "",
    business: "",
    project: projectOptions.some((o) => o.value === initialProject)
      ? initialProject
      : "",
    budget:
      launchInquiry && initialProject === "website"
        ? site.launchOffer.price + " launch offer"
        : "",
    details: "",
    preferred: "Email",
    website: "",
  };
  const [form, setForm] = useState<Inquiry>(emptyForm);
  const [copyStatus, setCopyStatus] = useState("");
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [deliveryError, setDeliveryError] = useState("");
  const [preparing, setPreparing] = useState(false);
  const [sent, setSent] = useState(false);
  const [securityToken, setSecurityToken] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const summary = useRef<HTMLDivElement>(null),
    result = useRef<HTMLDivElement>(null);
  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopyStatus("Copied. Paste it into your email app or webmail.");
    } catch {
      setCopyStatus(
        "Copy is unavailable. Select the email address and copy it manually.",
      );
    }
  }
  function update(field: keyof Inquiry, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setDeliveryError("");
  }
  function control(field: keyof Inquiry) {
    return {
      id: "inquiry-" + field,
      name: field,
      value: form[field],
      "aria-invalid": Boolean(errors[field]),
      "aria-describedby":
        (
          (field === "details" ? "details-help " : "") +
          (errors[field] ? "error-" + field : "")
        ).trim() || undefined,
      onChange: (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
      ) => update(field, e.target.value),
    };
  }
  function error(field: keyof Inquiry) {
    return errors[field] ? (
      <span className="field-error" id={"error-" + field}>
        {errors[field]}
      </span>
    ) : null;
  }
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (preparing) return;
    const nextErrors = validateInquiry(form);
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      requestAnimationFrame(() => summary.current?.focus());
      return;
    }
    if (!securityToken) {
      setDeliveryError(
        "Please complete the security check, or email us directly.",
      );
      return;
    }
    setPreparing(true);
    setDeliveryError("");
    try {
      await sendInquiry(form, securityToken);
      setSent(true);
      requestAnimationFrame(() => result.current?.focus());
    } catch (err) {
      setDeliveryError(
        err instanceof Error
          ? err.message
          : "We couldn’t confirm your inquiry was sent. Please try again or email us.",
      );
      setSecurityToken("");
      setResetKey((key) => key + 1);
    } finally {
      setPreparing(false);
    }
  }
  return (
    <>
      <PageIntro
        label="Contact"
        title="Let’s talk about your project"
        description="Tell us what your business needs. Send a message below or email us directly."
      />
      <section className="contact-layout container">
        <aside className="contact-aside">
          <h2>Contact Veyro</h2>
          {launchInquiry && (
            <p className="contact-launch-note">
              {initialProject === "website"
                ? `${site.launchOffer.price} simple website launch offer — for our first ${site.launchOffer.clientLimit} clients.`
                : `Launch pricing for our first ${site.launchOffer.clientLimit} clients. We’ll provide a custom quote for your project.`}
            </p>
          )}
          <p>
            Email us a few details about your business and what you need. You
            can use any email app or webmail.
          </p>
          <a className="contact-email" href={`mailto:${site.email}`}>
            <Mail size={18} aria-hidden="true" />
            {site.email}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <button
            type="button"
            className="button button-secondary"
            onClick={() => copy(site.email)}
          >
            Copy email address
          </button>
          {copyStatus && (
            <p role="status" className="copy-status">
              {copyStatus}
            </p>
          )}
          <p className="small-note">
            No email app? Copy this address into the recipient field in your
            webmail.
          </p>
          <p className="contact-location">
            Philadelphia, Pennsylvania
            <br />
            US & remote international projects
          </p>
          <div className="contact-social">
            <a href={site.instagram} target="_blank" rel="noopener noreferrer">
              <Instagram size={17} aria-hidden="true" />
              Instagram
              <ArrowUpRight size={15} aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a href={site.facebook} target="_blank" rel="noopener noreferrer">
              Facebook
              <ArrowUpRight size={15} aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </aside>
        <div className="contact-form-panel inquiry-panel">
          {!clientReady ? (
            <p>
              You can email us directly. The contact form needs JavaScript to
              load its security check.
            </p>
          ) : sent ? (
            <div className="inquiry-success" ref={result} tabIndex={-1}>
              <h2>Your inquiry has been sent.</h2>
              <p role="status">
                Thanks for getting in touch. We’ll reply to the email address
                you provided.
              </p>
              <button
                className="button button-secondary"
                type="button"
                onClick={() => {
                  setForm(emptyForm);
                  setSent(false);
                  setSecurityToken("");
                  setResetKey((key) => key + 1);
                }}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form
              noValidate
              onSubmit={submit}
              method="post"
              action="/api/inquiry"
            >
              {Object.values(errors).some(Boolean) && (
                <div
                  className="error-summary"
                  ref={summary}
                  tabIndex={-1}
                  role="alert"
                >
                  <h2>Please check these details</h2>
                  <ul>
                    {Object.entries(errors)
                      .filter(([, value]) => value)
                      .map(([field, message]) => (
                        <li key={field}>
                          <a
                            href={`#inquiry-${field}`}
                            onClick={(e) => {
                              e.preventDefault();
                              document
                                .getElementById(`inquiry-${field}`)
                                ?.focus();
                            }}
                          >
                            {labels[field as keyof Inquiry]}: {message}
                          </a>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
              <p className="form-required-note">
                Fields marked * are required.
              </p>
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="inquiry-name">Name *</label>
                  <input
                    {...control("name")}
                    autoComplete="name"
                    required
                    maxLength={100}
                    placeholder="Your name"
                  />
                  {error("name")}
                </div>
                <div className="form-field">
                  <label htmlFor="inquiry-email">Email *</label>
                  <input
                    {...control("email")}
                    autoComplete="email"
                    type="email"
                    required
                    maxLength={254}
                    placeholder="you@business.com"
                  />
                  {error("email")}
                </div>
                <div className="form-field form-wide">
                  <label htmlFor="inquiry-business">
                    Business name <span>(optional)</span>
                  </label>
                  <input
                    {...control("business")}
                    autoComplete="organization"
                    maxLength={120}
                    placeholder="Your business"
                  />
                  {error("business")}
                </div>
                <div className="form-field">
                  <label htmlFor="inquiry-project">Type of project *</label>
                  <select {...control("project")} required>
                    <option value="">Select a project type</option>
                    {projectOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  {error("project")}
                </div>
                <div className="form-field">
                  <label htmlFor="inquiry-budget">
                    Budget range <span>(optional)</span>
                  </label>
                  <select {...control("budget")}>
                    <option value="">Select a range</option>
                    {budgetOptions.map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                  {error("budget")}
                </div>
                <div className="form-field form-wide">
                  <label htmlFor="inquiry-details">Project details *</label>
                  <textarea
                    {...control("details")}
                    required
                    rows={6}
                    minLength={20}
                    maxLength={5000}
                    placeholder="Tell us about your business and what you would like to build or improve."
                  />
                  <span className="field-help" id="details-help">
                    A few sentences are plenty. Please avoid sensitive
                    information.
                  </span>
                  {error("details")}
                </div>
              </div>
              <div hidden aria-hidden="true">
                <label htmlFor="inquiry-website">Leave this field empty</label>
                <input
                  {...control("website")}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              {deliveryError && (
                <p role="alert" className="field-error">
                  {deliveryError}
                </p>
              )}
              <Turnstile onToken={setSecurityToken} resetKey={resetKey} />
              <div className="form-end">
                <p>
                  Your details are sent to Veyro so we can reply. Read our{" "}
                  <Link to="/privacy">privacy policy</Link>.
                </p>
                <button
                  className="button button-primary"
                  type="submit"
                  disabled={preparing || !securityToken}
                >
                  {preparing ? "Sending…" : "Send inquiry"}
                  <ArrowRight size={17} aria-hidden="true" />
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
