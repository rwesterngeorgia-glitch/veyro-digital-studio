import { Check, ArrowDown } from "lucide-react";
import {
  ButtonLink,
  CallToAction,
  PageIntro,
  ServiceIcon,
  TextLink,
} from "../components/UI";
import { Pricing } from "../components/Pricing";
import { services } from "../data/studio";
export function Services() {
  return (
    <>
      <PageIntro
        label="Services"
        title="What we can build for you"
        description="Choose a website, custom business software, automation or ongoing website support. We’ll help you work out what your business needs."
      >
        <a className="text-link" href="#pricing">
          View starting prices <ArrowDown size={17} aria-hidden="true" />
        </a>
      </PageIntro>
      <div className="service-jump container">
        {services.map((service) => (
          <a key={service.id} href={"#" + service.id}>
            <span>{service.title}</span>
          </a>
        ))}
      </div>
      <section
        className="service-details container"
        aria-label="Service details"
      >
        {services.map((service) => (
          <article className="service-detail" key={service.id} id={service.id}>
            <div className="service-detail-title">
              <ServiceIcon name={service.icon} size={34} />
              <h2>{service.title}</h2>
              <p>{service.short}</p>
            </div>
            <div className="service-detail-body">
              <p>{service.description}</p>
              <ul>
                {service.features.map((feature) => (
                  <li key={feature}>
                    <Check size={16} aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
              {service.id === "automation" && (
                <p className="small-note">
                  We check that your tools can connect and test the workflow
                  before it is used.
                </p>
              )}
              <ButtonLink
                secondary
                to={
                  "/contact?project=" +
                  (service.id === "web-design"
                    ? "website"
                    : service.id === "business-software"
                      ? "software"
                      : service.id === "automation"
                        ? "automation"
                        : "support")
                }
              >
                Get a quote
              </ButtonLink>
            </div>
          </article>
        ))}
      </section>
      <Pricing />
      <section className="service-faq container">
        <h2>Common questions</h2>
        {[
          [
            "Can you improve my existing website?",
            "Yes. We can review your current website and recommend updates or a rebuild, depending on what it needs.",
          ],
          [
            "Can we start with a small project?",
            "Yes. We can start with a website, one business tool or a single automation.",
          ],
          [
            "Do you work outside Philadelphia?",
            "Yes. We work across the United States and with remote international clients.",
          ],
          [
            "Do you offer ongoing support?",
            "Yes. We can agree on a separate plan for website updates, maintenance and technical help.",
          ],
        ].map(([question, answer]) => (
          <details key={question}>
            <summary>
              {question}
              <span aria-hidden="true">+</span>
            </summary>
            <p>{answer}</p>
          </details>
        ))}
        <TextLink to="/industries">See the businesses we help</TextLink>
      </section>
      <CallToAction />
    </>
  );
}
