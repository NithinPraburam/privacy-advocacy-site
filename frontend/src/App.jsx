import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';

const Learn = lazy(() => import('./pages/Learn'));
const Advocacy = lazy(() => import('./pages/Advocacy'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Tools = lazy(() => import('./pages/Tools'));
const PrivacyCheckup = lazy(() => import('./pages/tools/PrivacyCheckup'));
const PolicyAnalyzer = lazy(() => import('./pages/tools/PolicyAnalyzer'));
const BreachChecker = lazy(() => import('./pages/tools/BreachChecker'));
const PrivacyTracker = lazy(() => import('./pages/tools/PrivacyTracker'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageFallback() {
  return <div className="flex min-h-[50vh] items-center justify-center text-ink-500">Loading...</div>;
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/advocacy" element={<Advocacy />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/tools/checkup" element={<PrivacyCheckup />} />
            <Route path="/tools/policy-analyzer" element={<PolicyAnalyzer />} />
            <Route path="/tools/breach-checker" element={<BreachChecker />} />
            <Route
              path="/tools/tracker"
              element={
                <ProtectedRoute>
                  <PrivacyTracker />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
