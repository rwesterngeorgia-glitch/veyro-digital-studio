import { renderToString } from 'react-dom/server';
import { StaticRouter, Route, Routes } from 'react-router-dom';
import { SiteLayout } from './layouts/SiteLayout';
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { Work } from './pages/Work';
import { CaseStudy } from './pages/CaseStudy';
import { Industries } from './pages/Industries';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Privacy } from './pages/Privacy';
import { NotFound } from './pages/NotFound';

// Build-only rendering: the deployed site remains static and needs no Node server.
export function render(location: string) {
  return renderToString(<StaticRouter location={location}><Routes><Route element={<SiteLayout />}>
    <Route index element={<Home />} /><Route path="services" element={<Services />} />
    <Route path="work" element={<Work />} /><Route path="work/:slug" element={<CaseStudy />} />
    <Route path="industries" element={<Industries />} /><Route path="about" element={<About />} />
    <Route path="contact" element={<Contact />} /><Route path="privacy" element={<Privacy />} />
    <Route path="*" element={<NotFound />} />
  </Route></Routes></StaticRouter>);
}
