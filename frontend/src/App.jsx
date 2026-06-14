import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Learn from './pages/Learn';
import Advocacy from './pages/Advocacy';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Tools from './pages/Tools';
import PrivacyCheckup from './pages/tools/PrivacyCheckup';
import PolicyAnalyzer from './pages/tools/PolicyAnalyzer';
import BreachChecker from './pages/tools/BreachChecker';
import PrivacyTracker from './pages/tools/PrivacyTracker';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
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
      </main>
      <Footer />
    </div>
  );
}
