import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { CutProvider } from './context/CutContext';
import PageLayout from './components/Layout/PageLayout';
import SplashPage from './pages/Splash/SplashPage';
import OnboardingPage from './pages/Onboarding/OnboardingPage';
import MainPage from './pages/Main/MainPage';
import RecordPage from './pages/Record/RecordPage';
import TipsPage from './pages/Tips/TipsPage';
import SalonPage from './pages/Salon/SalonPage';
import PartnerPage from './pages/Salon/PartnerPage';
import SettingsPage from './pages/Settings/SettingsPage';
import AdminPage from './pages/Admin/AdminPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/main" element={<PageLayout><MainPage /></PageLayout>} />
      <Route path="/record" element={<PageLayout><RecordPage /></PageLayout>} />
      <Route path="/tips" element={<PageLayout><TipsPage /></PageLayout>} />
      <Route path="/salon" element={<PageLayout><SalonPage /></PageLayout>} />
      <Route path="/salon/partner" element={<PartnerPage />} />
      <Route path="/settings" element={<PageLayout><SettingsPage /></PageLayout>} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <CutProvider>
          <AppRoutes />
        </CutProvider>
      </UserProvider>
    </BrowserRouter>
  );
}
