import { PageIntro } from "../components/UI";
import site from "../config/site.json";
export function Privacy() {
  return (
    <>
      <PageIntro
        label="Your information"
        title="Privacy policy"
        description="How Veyro handles contact forms, email inquiries and website hosting."
      />
      <article className="privacy-content container">
        <p className="policy-date">Last updated: October 14, 2026</p>
        <section>
          <h2>Your inquiry</h2>
          <p>
            When you send the contact form, Veyro uses your name, email,
            business details, project type, optional budget and message to
            respond to your inquiry. Cloudflare processes the form and delivers
            the message to our Gmail inbox. We do not add your inquiry to a
            website database or save it in browser storage.
          </p>
          <p>
            Please avoid sensitive personal or business information. Your
            browser may offer its own autofill features.
          </p>
        </section>
        <section>
          <h2>Spam protection</h2>
          <p>
            The form uses Cloudflare Turnstile and submission limits to prevent
            automated abuse. Cloudflare processes technical information such as
            your IP address, browser signals and a verification token for this
            purpose. The verification check is loaded on the contact page.
          </p>
          <p>
            See{" "}
            <a
              href="https://www.cloudflare.com/privacypolicy/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cloudflare’s privacy policy
              <span className="sr-only"> (opens in a new tab)</span>
            </a>{" "}
            for its handling of that information.
          </p>
        </section>
        <section>
          <h2>Email and social links</h2>
          <p>
            Email sent to {site.email} is forwarded by Cloudflare to Veyro’s
            Gmail inbox. Direct email and form inquiries are used to discuss
            your project and reply to you. Copy buttons write to your device
            clipboard when selected. Gmail, Instagram and Facebook have their
            own privacy policies.
          </p>
        </section>
        <section>
          <h2>Tracking and browser storage</h2>
          <p>
            Veyro does not add advertising pixels or analytics cookies. The
            website does not store your inquiry in localStorage or
            sessionStorage. Fonts and images are served with the website;
            Cloudflare provides the contact form’s security check.
          </p>
        </section>
        <section>
          <h2>Website hosting</h2>
          <p>
            The website is hosted on Cloudflare Pages. Cloudflare processes
            technical request information, including IP addresses, browser
            details and requested pages, to deliver and protect the website. Our
            form does not intentionally log the message content.
          </p>
        </section>
        <section>
          <h2>Email records</h2>
          <p>
            Project correspondence may be retained in Gmail while we discuss or
            support your project, and where needed for business records. The
            website does not provide automatic email retention or deletion. You
            can contact us to correct information or request deletion of an
            inquiry.
          </p>
        </section>
        <section>
          <h2>External project demos</h2>
          <p>
            The portfolio demonstrations are separate websites. Some save
            fictional records in your browser; their own notices explain this.
            Please use sample information when trying them.
          </p>
        </section>
        <section>
          <h2>Questions or requests</h2>
          <p>
            Email <a href={"mailto:" + site.email}>{site.email}</a> about this
            policy or your inquiry.
          </p>
        </section>
      </article>
    </>
  );
}
