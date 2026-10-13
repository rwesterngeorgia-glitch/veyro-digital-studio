import { CallToAction, PageIntro, TextLink } from "../components/UI";
export function About() {
  return (
    <>
      <PageIntro
        label="Veyro Digital Studio"
        title="About Veyro"
        description="We build websites, custom business software and automations for small businesses. Based in Philadelphia, we work with businesses across the US and remotely worldwide."
      />
      <section className="about-values container">
        <div className="simple-section-heading">
          <h2>What you can expect</h2>
          <p>
            A clear plan, practical solutions and regular opportunities to
            review the work.
          </p>
        </div>
        <div className="values-grid">
          {[
            [
              "A clear scope and price",
              "We discuss your needs and agree on what is included before development begins.",
            ],
            [
              "Easy-to-use websites and tools",
              "We focus on clear pages, readable information and the tasks your customers or team need to complete.",
            ],
            [
              "Clear communication",
              "We explain decisions in plain language and give you opportunities to review the project.",
            ],
            [
              "Support after the build",
              "We plan a practical handover and can agree on maintenance and technical support.",
            ],
          ].map(([title, description]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="about-proof container">
        <div>
          <h2>See what we build</h2>
        </div>
        <div>
          <p>
            Our portfolio includes a cleaning-company website, a restaurant
            website with management tools, and an inventory application.
          </p>
          <p>
            They are working demonstrations for fictional businesses. You can
            view the screenshots and try the demos.
          </p>
          <TextLink to="/work">See our projects</TextLink>
        </div>
      </section>
      <CallToAction />
    </>
  );
}
