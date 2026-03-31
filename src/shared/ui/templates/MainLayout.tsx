import { Outlet } from 'react-router-dom';
import Navbar from '../../../shared/layout/Navbar';

const MainLayout = () => {
  return (
    <div className=" py-0 min-h-screen w-full bg-[#020617] text-white flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 w-full py-0">
        <div>
          <Outlet />
        </div>
      </main>

      <footer className="py-6 text-sm text-center border-t text-slate-500 border-slate-900/50">
        © 2026 Aman City - Smart Management System
      </footer>
    </div>
  );
};

export default MainLayout;