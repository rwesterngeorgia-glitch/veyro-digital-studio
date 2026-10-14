import { Link } from "react-router-dom";
import {
  ButtonLink,
  CallToAction,
  ProjectCard,
  ServiceIcon,
  TextLink,
} from "../components/UI";
import { projects } from "../data/projects";
import { processSteps } from "../data/studio";
import site from "../config/site.json";
import { ArrowUpRight } from "lucide-react";
import { LaunchOffer } from "../components/LaunchOffer";

const heroServices = [
  {
    title: "Business websites",
    to: "/services#web-design",
    description: "A new website or a better version of the one you have.",
  },
  {
    title: "Business software",
    to: "/services#business-software",
    description: "A tool for your team, built around the way you work.",
  },
  {
    title: "Automation",
    to: "/services#automation",
    description: "Connect your apps and cut down on repetitive tasks.",
  },
];

const offers = [
  {
    title: "Business websites",
    description:
      "A professional website that explains your services and helps customers contact you.",
    example: "Business pages, menus, service details and quote forms.",
    icon: "web",
    path: "web-design",
    price: site.pricing.find((plan) => plan.id === "business-website"),
  },
  {
    title: "Custom business software",
    description:
      "Tools built for the way your business works, with your information in one place.",
    example: "Inventory systems, staff tools and business dashboards.",
    icon: "software",
    path: "business-software",
    price: site.pricing.find((plan) => plan.id === "custom-software"),
  },
  {
    title: "Business automation",
    description:
      "Connect your existing tools and reduce repetitive tasks for your team.",
    example: "Inquiry follow-ups, notifications and data updates.",
    icon: "automation",
    path: "automation",
    price: site.pricing.find((plan) => plan.id === "automation"),
  },
];

export function Home() {
  const orderedProjects = [
    "liberty-shine",
    "ember-and-olive",
    "stockpilot",
  ].flatMap((slug) => projects.filter((project) => project.slug === slug));
  return (
    <>
      <section className="home-hero simple-home-hero">
        <div className="container simple-hero-content">
          <div className="simple-hero-copy">
            <h1 tabIndex={-1}>
              We build websites and software for small businesses.
            </h1>
            <p className="simple-hero-description">
              Tell us what you have in mind. We’ll help you work out what you
              need and build it, with time for you to review along the way.
            </p>
            <div className="button-group">
              <ButtonLink to="/contact">Get in touch</ButtonLink>
              <TextLink to="/work">See our work</TextLink>
            </div>
            <p className="simple-hero-location">
              Based in Philadelphia. Working with businesses across the US.
            </p>
          </div>
          <nav className="hero-services" aria-label="Explore our services">
            <h2>What do you need help with?</h2>
            <div className="hero-services-list">
              {heroServices.map((service) => (
                <Link
                  className="hero-service-link"
                  key={service.to}
                  to={service.to}
                >
                  <span className="hero-service-name">
                    {service.title}
                    <ArrowUpRight size={20} aria-hidden="true" />
                  </span>
                  <span className="hero-service-summary">
                    {service.description}
                  </span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </section>
      <LaunchOffer />
      <section
        className="home-offers container"
        aria-labelledby="home-services-title"
      >
        <div className="simple-section-heading">
          <h2 id="home-services-title">How we can help</h2>
          <p>Choose the service your business needs.</p>
        </div>
        <div className="offer-grid">
          {offers.map((offer) => (
            <article className="offer" key={offer.path}>
              <ServiceIcon name={offer.icon} />
              <h3>{offer.title}</h3>
              <p>{offer.description}</p>
              <p className="offer-examples">{offer.example}</p>
              <p className="offer-price">
                {site.launchOffer.active
                  ? offer.path === "web-design"
                    ? `${site.launchOffer.price} simple website · Launch offer`
                    : "Launch pricing · Custom quote"
                  : !offer.price || offer.price.type === "software"
                    ? "Custom quote"
                    : "Starting at " + offer.price.price}
              </p>
              <TextLink to={"/services#" + offer.path}>
                View service details
              </TextLink>
            </article>
          ))}
        </div>
        <div className="home-service-notes">
          <p>
            We also offer{" "}
            <Link to="/services#maintenance">
              website maintenance and support
            </Link>
            .
          </p>
          <p>
            {site.launchOffer.active
              ? `Launch pricing is available to our first ${site.launchOffer.clientLimit} clients. Your quote depends on the project.`
              : "Example starting prices. Your quote depends on the project."}
          </p>
        </div>
      </section>
      <section className="selected-work container" id="selected-work">
        <div className="simple-section-heading">
          <h2>Examples of our work</h2>
          <p>
            See a business website, a restaurant system and an inventory
            application.
          </p>
        </div>
        <div className="simple-project-grid">
          {orderedProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
        <p className="concept-note">
          These are portfolio demonstrations for fictional businesses, not paid
          client projects.
        </p>
      </section>
      <section className="process-section simple-process">
        <div className="container">
          <div className="simple-section-heading">
            <h2>How to get started</h2>
            <p>You don’t need a detailed plan to contact us.</p>
          </div>
          <div className="process-grid">
            {processSteps.map((step) => (
              <article key={step.number}>
                <span className="step-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CallToAction />
    </>
  );
}
