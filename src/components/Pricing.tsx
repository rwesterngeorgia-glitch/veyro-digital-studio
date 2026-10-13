import site from "../config/site.json";
import { ButtonLink, Eyebrow } from "./UI";

export function Pricing() {
  return (
    <section className="pricing-section container" id="pricing">
      <div className="section-heading">
        <div>
          <Eyebrow>Pricing</Eyebrow>
          <h2>Starting prices</h2>
        </div>
        <p>
          Use these as a guide. We confirm the price after discussing the
          features and support you need.
        </p>
      </div>
      <div className="pricing-list">
        {site.pricing.map((plan, i) => (
          <article className="price-row" key={plan.name}>
            <span className="row-number">0{i + 1}</span>
            <div>
              <h3>{plan.name}</h3>
              <p>{plan.details}</p>
            </div>
            <div className="price">
              {plan.prefix && <span>{plan.prefix}</span>}
              <strong>{plan.price}</strong>
            </div>
            <ButtonLink to={`/contact?project=${plan.type}`} secondary>
              Request a quote
            </ButtonLink>
          </article>
        ))}
      </div>
      <p className="pricing-note">
        Your final quote depends on the
        project. Any third-party costs are discussed before you agree to the
        work.
      </p>
    </section>
  );
}
