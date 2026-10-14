import site from "../config/site.json";
import { ButtonLink, Eyebrow } from "./UI";
import { launchOfferContact } from "./LaunchOffer";

export function Pricing() {
  return (
    <section className="pricing-section container" id="pricing">
      <div className="section-heading">
        <div>
          <Eyebrow>Pricing</Eyebrow>
          <h2>
            {site.launchOffer.active ? "Launch pricing" : "Starting prices"}
          </h2>
        </div>
        <p>
          {site.launchOffer.active
            ? `For our first ${site.launchOffer.clientLimit} clients. Simple websites are ${site.launchOffer.price}; larger projects receive a custom launch quote.`
            : "Use these as a guide. We confirm the price after discussing the features and support you need."}
        </p>
      </div>
      <div className="pricing-list">
        {site.pricing.map((plan, i) => (
          <article className="price-row" key={plan.name}>
            <span className="row-number">0{i + 1}</span>
            <div>
              <h3>
                {site.launchOffer.active && plan.id === "business-website"
                  ? "Simple Website"
                  : plan.name}
              </h3>
              <p>
                {site.launchOffer.active && plan.id === "business-website"
                  ? "A clean, mobile-friendly website for your small business. We agree on the scope before work starts."
                  : plan.details}
              </p>
            </div>
            <div className="price">
              {site.launchOffer.active ? (
                <span>Launch offer</span>
              ) : (
                plan.prefix && <span>{plan.prefix}</span>
              )}
              <strong>
                {site.launchOffer.active
                  ? plan.id === "business-website"
                    ? site.launchOffer.price
                    : "Custom quote"
                  : plan.price}
              </strong>
            </div>
            <ButtonLink
              to={
                site.launchOffer.active
                  ? plan.id === "business-website"
                    ? launchOfferContact
                    : `/contact?project=${plan.type}&offer=launch`
                  : `/contact?project=${plan.type}`
              }
              secondary
            >
              Request a quote
            </ButtonLink>
          </article>
        ))}
      </div>
      <p className="pricing-note">
        Your final quote depends on the project. Any third-party costs are
        discussed before you agree to the work.
      </p>
    </section>
  );
}
