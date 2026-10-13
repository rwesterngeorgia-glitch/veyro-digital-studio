import { ButtonLink, PageIntro } from "../components/UI";
export function NotFound() {
  return (
    <PageIntro
      label="404"
      title="Page not found"
      description="The page you requested is unavailable. Go back to the homepage or view our projects."
    >
      <div className="button-group">
        <ButtonLink to="/">Back to home</ButtonLink>
        <ButtonLink to="/work" secondary>
          Our work
        </ButtonLink>
      </div>
    </PageIntro>
  );
}
