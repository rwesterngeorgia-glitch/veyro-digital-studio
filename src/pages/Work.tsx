import { useState } from "react";
import { CallToAction, PageIntro, ProjectCard } from "../components/UI";
import { projects } from "../data/projects";

export function Work() {
  const [filter, setFilter] = useState("all");
  const selected = projects.filter(
    (p) => filter === "all" || p.category.includes(filter),
  );
  return (
    <>
      <PageIntro
        label="Our work"
        title="See what we build"
        description="View a business website, a restaurant website with management tools, and an inventory application. Each project has screenshots and a working demo."
      />
      <section
        className="work-gallery container"
        aria-label="Portfolio projects"
      >
        <div className="filter-bar">
          <div role="group" aria-label="Filter portfolio">
            {[
              { label: "All projects", id: "all" },
              { label: "Websites", id: "websites" },
              { label: "Business software", id: "software" },
            ].map((f) => (
              <button
                type="button"
                key={f.id}
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
                <span>{f.id === "all" ? "03" : "02"}</span>
              </button>
            ))}
          </div>
          <span role="status" aria-live="polite">
            {selected.length} projects
          </span>
        </div>
        <div className="portfolio-grid">
          {selected.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
        <p className="concept-note">
          These are portfolio demonstrations for fictional businesses, not paid
          client projects. The demos use sample data.
        </p>
      </section>
      <CallToAction />
    </>
  );
}
