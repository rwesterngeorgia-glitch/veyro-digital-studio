import { useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  X,
  Expand,
  Globe2,
  PanelsTopLeft,
  Workflow,
  LifeBuoy,
} from "lucide-react";
import images from "../data/images.json";
import type { Project } from "../data/projects";
import { trapDialogFocus } from "../utils/accessibility";

export function ButtonLink({
  to,
  children,
  secondary = false,
  external = false,
  className = "",
}: {
  to: string;
  children: ReactNode;
  secondary?: boolean;
  external?: boolean;
  className?: string;
}) {
  const classes = `button ${secondary ? "button-secondary" : "button-primary"} ${className}`;
  return external ? (
    <a className={classes} href={to} target="_blank" rel="noopener noreferrer">
      {children}
      <ArrowUpRight size={18} aria-hidden="true" />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  ) : (
    <Link className={classes} to={to}>
      {children}
      <ArrowUpRight size={18} aria-hidden="true" />
    </Link>
  );
}
export function TextLink({
  to,
  children,
  className = "",
}: {
  to: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link className={`text-link ${className}`} to={to}>
      {children}
      <ArrowUpRight size={19} aria-hidden="true" />
    </Link>
  );
}
export function Eyebrow({
  children,
  light = false,
}: {
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <p className={`eyebrow ${light ? "eyebrow-light" : ""}`}>
      <span aria-hidden="true" />
      {children}
    </p>
  );
}
export function PageIntro({
  label,
  title,
  description,
  children,
}: {
  label: string;
  title: ReactNode;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="page-intro container">
      <Eyebrow>{label}</Eyebrow>
      <div className="intro-grid">
        <h1 tabIndex={-1}>{title}</h1>
        <div className="intro-copy">
          <p>{description}</p>
          {children}
        </div>
      </div>
    </section>
  );
}
export function ServiceIcon({
  name,
  size = 28,
}: {
  name: string;
  size?: number;
}) {
  const Icon =
    name === "web"
      ? Globe2
      : name === "software"
        ? PanelsTopLeft
        : name === "automation"
          ? Workflow
          : LifeBuoy;
  return <Icon size={size} strokeWidth={1.4} aria-hidden="true" />;
}
export function ProjectScreenshot({
  slug,
  imageKey,
  alt,
  eager = false,
  className = "",
  sizes = "(max-width: 700px) 94vw, (max-width: 1100px) 90vw, 1200px",
}: {
  slug: string;
  imageKey: string;
  alt: string;
  eager?: boolean;
  className?: string;
  sizes?: string;
}) {
  const asset = (
    images as Record<
      string,
      Record<
        string,
        { src: string; srcSet: string; width: number; height: number }
      >
    >
  )[slug]?.[imageKey];
  if (!asset) return <p className="image-unavailable" role="status">This preview is unavailable. Open the project’s live demo to explore it.</p>;
  return (
    <img
      className={className}
      src={asset.src}
      srcSet={asset.srcSet || undefined}
      sizes={sizes}
      width={asset.width}
      height={asset.height}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
export function BrowserFrame({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <div className="browser-frame">
      <div className="browser-bar" aria-hidden="true">
        <span className="browser-dots">
          <i />
          <i />
          <i />
        </span>
        <span>{label}</span>
        <ArrowUpRight size={11} />
      </div>
      {children}
    </div>
  );
}
export function ProjectCard({
  project,
  featured = false,
}: {
  project: Project;
  featured?: boolean;
}) {
  return (
    <article
      className={`project-card project-${project.theme} ${featured ? "featured" : ""}`}
    >
      <Link
        to={`/work/${project.slug}`}
        className="project-image-link"
        aria-label={`View ${project.name} case study`}
      >
        <div className="project-image-wrap">
          <BrowserFrame label={project.name}>
            <ProjectScreenshot
              slug={project.slug}
              imageKey="home"
              alt={project.coverAlt}
              sizes="(max-width: 600px) 90vw, (max-width: 850px) 43vw, 380px"
            />
          </BrowserFrame>
          <span className="project-image-action" aria-hidden="true">
            <ArrowUpRight size={27} />
          </span>
        </div>
      </Link>
      <div className="project-info">
        <div>
          <p className="project-kicker">
            {project.industry}
            <span>Portfolio concept</span>
          </p>
          <h3>{project.name}</h3>
          <p className="project-summary">{project.summary}</p>
          <TextLink to={`/work/${project.slug}`}>View project</TextLink>
        </div>
      </div>
    </article>
  );
}
export function ImageViewer({
  slug,
  imageKey,
  alt,
  title,
  caption,
  mobile = false,
}: {
  slug: string;
  imageKey: string;
  alt: string;
  title: string;
  caption: string;
  mobile?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <figure className={`gallery-figure ${mobile ? "gallery-mobile" : ""}`}>
      <button
        type="button"
        className="gallery-open"
        onClick={() => dialog.current?.showModal()}
        aria-label={`Enlarge ${title}`}
      >
        <ProjectScreenshot slug={slug} imageKey={imageKey} alt={alt} />
        <span className="gallery-expand" aria-hidden="true">
          <Expand size={17} /> Enlarge preview
        </span>
      </button>
      <figcaption>
        <h3>{title}</h3>
        <p>{caption}</p>
      </figcaption>
      <dialog
        onKeyDown={trapDialogFocus}
        ref={dialog}
        className="image-dialog"
        aria-labelledby={`${slug}-${imageKey}-title`}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <div className="image-dialog-inner">
          <div className="image-dialog-header">
            <h2 id={`${slug}-${imageKey}-title`}>{title}</h2>
            <button
              autoFocus
              type="button"
              className="icon-button"
              aria-label="Close image preview"
              onClick={() => dialog.current?.close()}
            >
              <X />
            </button>
          </div>
          <ProjectScreenshot slug={slug} imageKey={imageKey} alt={alt} eager />
          <p>{caption}</p>
        </div>
      </dialog>
    </figure>
  );
}
export function CallToAction() {
  return (
    <section className="cta">
      <div className="container">
        <div className="cta-grid">
          <div>
            <h2>Tell us what you need</h2>
            <p>
              A new website, business software or help with a repetitive task.
              We’ll help you work out the next step.
            </p>
          </div>
          <div>
            <ButtonLink to="/contact">Get a quote</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
export function DirectionArrow() {
  return <ArrowRight aria-hidden="true" size={18} />;
}
