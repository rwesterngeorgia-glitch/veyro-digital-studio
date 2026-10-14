import site from "../config/site.json";
import { ButtonLink, Eyebrow } from "./UI";

export const launchOfferContact = "/contact?project=website&offer=launch";

export function LaunchOffer() {
  if (!site.launchOffer.active) return null;

  return (
    <section
      className="launch-offer"
      id="launch-offer"
      aria-labelledby="launch-offer-title"
    >
      <div className="container launch-offer-grid">
        <div>
          <Eyebrow light>
            Launch offer · First {site.launchOffer.clientLimit} clients
          </Eyebrow>
          <h2 id="launch-offer-title">Simple websites</h2>
          <p className="launch-offer-price">{site.launchOffer.price}</p>
        </div>
        <div className="launch-offer-copy">
          <p>A clean, mobile-friendly website for your small business.</p>
          <p>
            Our first {site.launchOffer.clientLimit} clients also get launch
            pricing on larger websites, custom business software, automation and
            website maintenance. Ask us for a custom quote.
          </p>
          <ButtonLink to={launchOfferContact}>
            Ask about the launch offer
          </ButtonLink>
          <p className="launch-offer-note">
            We’ll agree on the scope and any third-party costs before work
            starts.
          </p>
        </div>
      </div>
    </section>
  );
}
