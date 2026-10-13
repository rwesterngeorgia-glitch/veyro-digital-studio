import { PageIntro } from "../components/UI";
import site from "../config/site.json";
export function Privacy() {
  return (
    <>
      <PageIntro
        label="Your information"
        title="Privacy policy"
        description="How Veyro handles email inquiries and the optional draft helper."
      />
      <article className="privacy-content container">
        <p className="policy-date">Last updated: October 12, 2026</p>
        <section>
          <h2>Your inquiry</h2>
          <p>
            The optional draft helper uses your name, email, business details and project
            information to create a local review. It does not send, log or save
            that information. Leaving the page or reloading clears the form.
            Your browser may offer its own autofill features.
          </p>
          <p>Please avoid sensitive personal or business information.</p>
        </section>
        <section>
          <h2>Email and social links</h2>
          <p>
            “Open an email draft” passes the details you entered to your
            configured email app. You choose whether to send the email. Messages
            you send to {site.email} arrive in Veyro’s Gmail inbox and are used
            to respond to your project inquiry.
          </p>
          <p>
            Copy buttons write to your device clipboard only when selected. Email services, Instagram and Facebook have their own privacy
            policies. The website does not send the form to those platforms.
          </p>
        </section>
        <section>
          <h2>Tracking and storage</h2>
          <p>
            Veyro does not add analytics, advertising pixels, tracking cookies
            or third-party form services. This website does not store your
            inquiry in localStorage or sessionStorage. Fonts and images are
            served with the website.
          </p>
        </section>
        <section>
          <h2>External project demos</h2>
          <p>
            The portfolio demos are separate hosted websites. Opening them sends
            ordinary web requests to their hosts. Some demos save fictional
            records in your browser; their own notices explain this. Please use
            sample information when trying them.
          </p>
        </section>
        <section>
          <h2>Website hosting</h2>
          <p>
            The public website is hosted on Cloudflare Pages. Cloudflare
            processes technical request information, such as your IP address,
            browser details and the page requested, to deliver and protect the
            website. See{" "}
            <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">
              Cloudflare’s privacy policy<span className="sr-only"> (opens in a new tab)</span>
            </a> for its handling of that information.
          </p>
        </section>
        <section>
          <h2>Email records</h2>
          <p>
            If you email Veyro, your message is handled through Gmail. Project
            correspondence may be retained while we discuss or support your
            project, and where needed for business records. The website does
            not provide an automatic email-retention or deletion service.
            You can contact us to ask about a message, correct information or
            request deletion.
          </p>
        </section>
        <section>
          <h2>Questions or requests</h2>
          <p>
            Contact <a href={"mailto:" + site.email}>{site.email}</a> to ask
            about this policy, correct information you have emailed, or request
            deletion of an emailed inquiry.
          </p>
        </section>
      </article>
    </>
  );
}
