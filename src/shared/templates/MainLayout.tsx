import { Outlet } from 'react-router-dom';
import Navbar from '../layout/Navbar';

import Footer from '../layout/Footer';


const MainLayout = () => {
  return (
    <div className="min-h-screen w-full bg-[#020617] text-white flex flex-col font-sans">
      <Navbar />

      
      <main className="flex-1 w-full  mx-auto transition-all duration-300 ">
        <div className="duration-700 animate-in fade-in slide-in-from-bottom-4">
          <Outlet />
        </div>
      </main>

     <Footer/>
    </div>
  );
};

export default MainLayout;