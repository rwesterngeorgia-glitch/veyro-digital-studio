import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  BrowserFrame,
  ButtonLink,
  CallToAction,
  Eyebrow,
  ImageViewer,
  ProjectScreenshot,
  TextLink,
} from "../components/UI";
import { projects } from "../data/projects";
import { NotFound } from "./NotFound";
export function CaseStudy() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);
  if (!project) return <NotFound />;
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return (
    <>
      <section className="case-intro container">
        <Link to="/work" className="back-link">
          <ArrowLeft size={16} aria-hidden="true" /> All projects
        </Link>
        <Eyebrow>{project.industry} · Portfolio demo</Eyebrow>
        <h1 tabIndex={-1}>{project.name}</h1>
        <p className="case-headline">{project.headline}</p>
        <p className="case-plain-summary">{project.summary}</p>
        <div className="button-group">
          {project.links.map((link, i) => (
            <ButtonLink
              key={link.href}
              external
              secondary={i > 0}
              to={link.href}
            >
              {link.label}
            </ButtonLink>
          ))}
        </div>
        <p className="case-intro-disclosure">
          A demonstration for a fictional business, not a paid client project.
        </p>
      </section>
      <section
        className={"case-cover case-" + project.theme}
        aria-label={project.name + " homepage preview"}
      >
        <div className="container">
          <BrowserFrame label={project.name}>
            <ProjectScreenshot
              slug={project.slug}
              imageKey="home"
              eager
              alt={project.coverAlt}
            />
          </BrowserFrame>
        </div>
      </section>
      <section className="project-overview container">
        <h2>What this project includes</h2>
        <p className="project-overview-intro">{project.scenario}</p>
        <div className="feature-grid">
          {project.features.map((feature) => (
            <article key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
        <details className="project-details">
          <summary>How the project was planned</summary>
          <div>
            <h3>The goal</h3>
            <p>{project.objective}</p>
            <h3>The approach</h3>
            <p>{project.approach}</p>
          </div>
        </details>
      </section>
      <section className="case-gallery container">
        <div className="simple-section-heading">
          <h2>Project screenshots</h2>
          <p>Select a screenshot to view it at a larger size.</p>
        </div>
        <div className="gallery-grid">
          {project.gallery.map((image) => (
            <ImageViewer
              key={image.key}
              slug={project.slug}
              imageKey={image.key}
              title={image.title}
              caption={image.caption}
              alt={image.alt}
              mobile={image.mobile}
            />
          ))}
        </div>
      </section>
      <section className="project-extra container">
        <details className="project-details">
          <summary>Technical details and demo limits</summary>
          <div>
            <div className="tags">
              {project.tech.map((technology) => (
                <span key={technology}>{technology}</span>
              ))}
            </div>
            <p>{project.technical}</p>
            <p>{project.disclosure}</p>
          </div>
        </details>
        <div className="next-project-simple">
          <span>Next project</span>
          <TextLink to={"/work/" + next.slug}>{next.name}</TextLink>
        </div>
      </section>
      <CallToAction />
    </>
  );
}
