import { lazy, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ChatWidget from './components/ChatWidget';
import StickyCTA from './components/StickyCTA';
import ExitIntentPopup from './components/ExitIntentPopup';
import Home from './pages/Home';
import About from './pages/About';
import Team from './pages/Team';
import PotsReplacement from './pages/PotsReplacement';
import Pots90X1 from './pages/pots/Pots90X1';
import Pots90X2 from './pages/pots/Pots90X2';
import Pots90X5 from './pages/pots/Pots90X5';
import PotsAra from './pages/pots/PotsAra';
import AiConsulting from './pages/AiConsulting';
import InternetConnectivity from './pages/InternetConnectivity';
import MobilitySolutions from './pages/MobilitySolutions';
import VoiceSolutions from './pages/VoiceSolutions';
import AiWorkforce from './pages/AiWorkforce';
import Contact from './pages/Contact';
import Tools from './pages/Tools';
import CopperSunsetRisk from './pages/tools/CopperSunsetRisk';
import FailoverReadiness from './pages/tools/FailoverReadiness';
import AiReadinessAssessment from './pages/tools/AiReadinessAssessment';
import PartnerHub from './pages/PartnerHub';
import Crm from './pages/Crm';
import Partners from './pages/Partners';
import Ai from './pages/Ai';
import NotFound from './pages/NotFound';
import { preloaded } from './preloads';

// The blog content (61 markdown posts via blog.ts) is the one heavy chunk
// (~419 KB raw). Blog + BlogPost are the ONLY code-split routes; everything
// else stays statically imported in the main bundle. main.tsx resolves the
// blog chunk before render on /blog and /blog/:slug, so the lazy component
// never suspends to a visible fallback on first load (no CLS).
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));

const PageFallback = () => (
  <div className="flex min-h-[60vh] items-center justify-center" aria-busy="true">
    <span className="sr-only">Loading…</span>
  </div>
);

// The blog chunk is preloaded by main.tsx on /blog and /blog/:slug and stored
// in the preloads registry. Render the resolved component directly there so
// there is NO <Suspense> boundary in the hydration tree (see src/preloads.ts).
// Suspense + React.lazy is only used on client-side navigation to a blog route
// whose chunk hasn't been fetched yet.
function BlogRoute() {
  const Resolved = preloaded.Blog;
  if (Resolved) return <Resolved />;
  return (
    <Suspense fallback={<PageFallback />}>
      <Blog />
    </Suspense>
  );
}

function BlogPostRoute() {
  const Resolved = preloaded.BlogPost;
  if (Resolved) return <Resolved />;
  return (
    <Suspense fallback={<PageFallback />}>
      <BlogPost />
    </Suspense>
  );
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="min-h-screen bg-navy-50 text-navy-900 antialiased">
          <ScrollToTop />
          <Navbar />
          <main id="main-content" tabIndex={-1}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/about/team" element={<Team />} />
              <Route path="/pots-replacement" element={<PotsReplacement />} />
              <Route path="/pots-replacement/90x1" element={<Pots90X1 />} />
              <Route path="/pots-replacement/90x2" element={<Pots90X2 />} />
              <Route path="/pots-replacement/90x5" element={<Pots90X5 />} />
              <Route path="/pots-replacement/ara" element={<PotsAra />} />
              <Route path="/ai-consulting" element={<AiConsulting />} />
              <Route path="/fleet-management" element={<Navigate to="/ai-consulting" replace />} />
              <Route path="/internet-connectivity" element={<InternetConnectivity />} />
              <Route path="/ip-pbx" element={<Navigate to="/voice-solutions" replace />} />
              <Route path="/mobility-solutions" element={<MobilitySolutions />} />
              <Route path="/voice-solutions" element={<VoiceSolutions />} />
              <Route path="/ai-workforce" element={<AiWorkforce />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/platforms/partner-hub" element={<PartnerHub />} />
              <Route path="/platforms/crm" element={<Crm />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/ai" element={<Ai />} />
              <Route path="/blog" element={<BlogRoute />} />
              <Route path="/blog/:slug" element={<BlogPostRoute />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/tools/copper-sunset-risk" element={<CopperSunsetRisk />} />
              <Route path="/tools/failover-readiness" element={<FailoverReadiness />} />
              <Route path="/tools/ai-readiness" element={<AiReadinessAssessment />} />
              <Route path="*" element={<NotFound />} />
              </Routes>
          </main>
          <Footer />
          <ChatWidget />
          <StickyCTA />
          <ExitIntentPopup />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
