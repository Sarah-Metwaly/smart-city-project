import { Outlet } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import CriticalAlertBanner from '../ui/molecules/CriticalAlertBanner';
import { useCriticalAlertBanner } from '../hooks/useCriticalAlertBanner';
import { useLiveIncidentStore } from '../../store/useLiveIncidentStore';

const MainLayout = () => {
  const activeIncidents = useLiveIncidentStore((state) => state.activeIncidents);
  const { bannerIncident, dismissBanner } = useCriticalAlertBanner(activeIncidents);

  return (
    <div className="min-h-screen w-full bg-[#020617] text-white flex flex-col font-sans relative">
      <div className="sticky top-0 w-full z-200">
        {bannerIncident && (
          <CriticalAlertBanner
            incident={bannerIncident}
            onDismiss={dismissBanner}
            autoDismissMs={8000}
          />
        )}
        <Navbar />
      </div>

      <main className="flex-1 w-full mx-auto transition-all duration-300">
        <div className="duration-700 animate-in fade-in slide-in-from-bottom-4">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;