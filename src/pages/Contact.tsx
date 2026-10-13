import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowUpRight, ArrowRight, Info, Mail, Instagram } from "lucide-react";
import { Eyebrow, PageIntro } from "../components/UI";
import {
  budgetOptions,
  inquiryText,
  prepareInquiry,
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
  const [clientReady,setClientReady]=useState(false);
  useEffect(()=>setClientReady(true),[]);
  const [search] = useSearchParams();
  const initialProject = search.get("project") ?? "";
  const [draftOpen,setDraftOpen]=useState(false);
  const [form, setForm] = useState<Inquiry>({
    name: "",
    email: "",
    business: "",
    project: projectOptions.some((o) => o.value === initialProject)
      ? initialProject
      : "",
    budget: "",
    details: "",
    preferred: "Email",
    website: "",
  });
  const [copyStatus,setCopyStatus]=useState("");
  async function copy(value:string){try{await navigator.clipboard.writeText(value);setCopyStatus("Copied. Paste it into your email app or webmail.");}catch{setCopyStatus("Copy is unavailable. Select the email address or draft below and copy it manually.");}}
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [review, setReview] = useState<Inquiry | null>(null);
  const [deliveryError, setDeliveryError] = useState("");
  const [preparing, setPreparing] = useState(false);
  const summary = useRef<HTMLDivElement>(null);
  const result = useRef<HTMLDivElement>(null);
  function update(field: keyof Inquiry, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setDeliveryError("");
  }
  function control(field: keyof Inquiry) {
    return {
      id: `inquiry-${field}`,
      name: field,
      value: form[field],
      "aria-invalid": Boolean(errors[field]),
      "aria-describedby":
        `${field === "details" ? "details-help " : ""}${errors[field] ? `error-${field}` : ""}`.trim() ||
        undefined,
      onChange: (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
      ) => update(field, e.target.value),
    };
  }
  function error(field: keyof Inquiry) {
    return errors[field] ? (
      <span className="field-error" id={`error-${field}`}>
        {errors[field]}
      </span>
    ) : null;
  }
  async function submit(e: FormEvent) {
    e.preventDefault();
    const nextErrors = validateInquiry(form);
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      requestAnimationFrame(() => summary.current?.focus());
      return;
    }
    setPreparing(true);
    try {
      const response = await prepareInquiry(form);
      setReview(response.inquiry);
      requestAnimationFrame(() => result.current?.focus());
    } catch (err) {
      setDeliveryError(
        err instanceof Error
          ? err.message
          : "The draft could not be prepared. Please try again.",
      );
    } finally {
      setPreparing(false);
    }
  }
  return (
    <>
      <PageIntro
        label="Contact"
        title="Get a quote"
        description="Tell us what your business needs. You can ask about a website, software, automation or ongoing support."
      />
      <section className="contact-layout container">
        <aside className="contact-aside">
          <h2>Contact Veyro</h2>
          <p>
            Email us a few details about your business and what you need. You can use any email app or webmail.
          </p>
          <a className="contact-email" href={`mailto:${site.email}`}>
            <Mail size={18} aria-hidden="true" />
            {site.email}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <button type="button" className="button button-secondary" onClick={()=>copy(site.email)}>Copy email address</button>{copyStatus && <p role="status" className="copy-status">{copyStatus}</p>}<p className="small-note">No email app? Copy this address into the recipient field in your webmail.</p>
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
        <details className="contact-form-panel optional-inquiry" open={draftOpen} onToggle={event=>setDraftOpen(event.currentTarget.open)}><summary>Help me write an inquiry (optional)</summary><div className="optional-inquiry-body">
          <div className="preview-notice">
            <Info size={19} aria-hidden="true" />
            <div>
              <strong>This is an email draft helper</strong>
              <p>
                The helper does not send or save messages. Copy the finished inquiry into your email app or webmail.
              </p>
            </div>
          </div>
          {!clientReady ? <p>The optional draft helper needs JavaScript. You can email the address above directly.</p> : review ? (
            <div className="inquiry-review" ref={result} tabIndex={-1}>
              <Eyebrow>Email draft</Eyebrow>
              <h2>Your inquiry is ready to review.</h2>
              <p className="review-disclosure" role="status">
                Your inquiry has{" "}
                <strong>not been sent</strong> or saved.
              </p>
              <dl>
                {(
                  [
                    "name",
                    "email",
                    "business",
                    "project",
                    "budget",
                  ] as const
                ).map((field) => (
                  <div key={field}>
                    <dt>{labels[field]}</dt>
                    <dd>
                      {field === "project"
                        ? projectOptions.find((o) => o.value === review[field])
                            ?.label
                        : review[field] || "Not provided"}
                    </dd>
                  </div>
                ))}
              </dl>
              <h3>Project details</h3>
              <p className="review-details">{review.details}</p>
              <div className="button-group"><button type="button" className="button button-primary" onClick={()=>copy(inquiryText(review))}>Copy inquiry</button>
                <a
                  className="button button-secondary"
                  href={`mailto:${site.email}?subject=${encodeURIComponent(`Project inquiry — ${review.business || review.name}`)}&body=${encodeURIComponent(inquiryText(review))}`}
                >
                  Open an email draft
                  <ArrowUpRight size={17} aria-hidden="true" />
                </a>
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={() => {
                    setReview(null);
                    requestAnimationFrame(() =>
                      document.getElementById("inquiry-name")?.focus(),
                    );
                  }}
                >
                  Edit inquiry
                </button>
              </div>
              <p className="small-note">
                The draft opens in your email app. You decide whether to send
                it. If your device has no email app configured, write directly
                to {site.email}.
              </p>
            </div>
          ) : (
            <form noValidate onSubmit={submit}>
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
              <div className="form-end">
                <p>
                  Preview fields stay in this page until you leave or reload.
                  Read our <Link to="/privacy">privacy policy</Link>.
                </p>
                <button
                  className="button button-primary"
                  type="submit"
                  disabled={preparing}
                >
                  {preparing
                    ? "Preparing preview…"
                    : "Review inquiry"}
                  <ArrowRight size={17} aria-hidden="true" />
                </button>
              </div>
            </form>
          )}
        </div></details>
      </section>
    </>
  );
}
