import { Check } from "lucide-react";
import { CallToAction, PageIntro, TextLink } from "../components/UI";
import { industries } from "../data/studio";
import { projects } from "../data/projects";
export function Industries() {
  return (
    <>
      <PageIntro
        label="Industries"
        title="Businesses we help"
        description="We build websites and software for restaurants, service providers, shops and other small businesses. Here are examples of what we can build for each."
      />
      <section
        className="industry-details container"
        aria-label="Industries and use cases"
      >
        {industries.map((industry) => {
          const project = projects.find((p) => p.slug === industry.project);
          return (
            <article
              className="industry-detail"
              id={"industry-" + industry.number}
              key={industry.number}
            >
              <h2>{industry.title}</h2>
              <p>{industry.description}</p>
              <ul>
                {industry.examples.map((example) => (
                  <li key={example}>
                    <Check size={16} aria-hidden="true" />
                    {example}
                  </li>
                ))}
              </ul>
              {project ? (
                <TextLink to={"/work/" + project.slug}>
                  View example project
                </TextLink>
              ) : (
                <TextLink to="/contact">Get a quote</TextLink>
              )}
            </article>
          );
        })}
      </section>
      <section className="industry-note container">
        <p>
          Each project is quoted individually. Software connections depend on
          your existing tools and are checked before we agree on the work.
        </p>
      </section>
      <CallToAction />
    </>
  );
}
