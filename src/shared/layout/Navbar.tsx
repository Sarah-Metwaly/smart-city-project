import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { TbUserShield } from 'react-icons/tb';
import logo from '../../assets/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const [isScrolled, setisScrolled] = useState(false);

  useEffect(() => {
    const handlescrole = () => {
      setisScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handlescrole);
    return () => window.removeEventListener('scroll', handlescrole);
  }, []);

  const links = [
    { name: 'HOME', path: '/' },
    { name: 'WEATHER', path: '/weather' },
    { name: 'ENERGY', path: '/energy' },
    { name: 'POLICE', path: '/police' },
    { name: 'FIRE', path: '/fire' },
    { name: 'ABOUT', path: '/about' },
  ];

  return (
    //UI//
    <nav
      className={`fixed  w-full bg-transfer border-b z-50 
    ${isScrolled ? 'bg-linear-to-b from-aman-dark via-aman-black to-aman-dark shadow-lg' : 'bg-transparent '}`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        {/******* LOGO: Brightens on hover ********/}
        <Link
          to="/"
          className="block transition-all duration-300 hover:brightness-125 hover:scale-105 active:scale-95" //BRIGH HOVER
        >
          <img src={logo} alt="logo" className="w-45 object-contain" />
        </Link>

        {/* NAVIGATION LINKS */}
        <div className="hidden md:flex space-x-6">
          {links.map((link) => {
            const isPageActive = pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                className="relative py-2 text-sm font-semibold font-inter text-aman-white hover:text-aman-light transition-colors group"
              >
                {link.name}

                {/* 1. THE HOVER LINE with group  */}
                {!isPageActive && (
                  <span className="absolute bottom-0 left-0 w-full  h-px = 0.5px bg-aman-light scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                )}

                {/* 2. THE ACTIVE LINE  */}
                {isPageActive && (
                  <span className="absolute bottom-0 left-0 w-full h-px = 0.5px bg-aman-white" />
                )}
              </Link>
            );
          })}
        </div>

        {/* SIGN IN
        <div className="hidden md:block">
          <Link
            to="/signin"
            className="bg-aman-white text-aman-light px-6 py-2 rounded-lg font-semibold font-inter hover:bg-aman-teal hover:text-aman-white transition-all"
          >
            Sign In
          </Link>
        </div> */}

        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/login"
            className="bg-aman-white text-aman-light px-6 py-2 rounded-lg font-semibold font-inter hover:bg-aman-teal hover:text-aman-white transition-all"
          >
            Sign In
          </Link>

          <Link
            to="/admin"
            className="text-aman-white hover:text-aman-light transition-colors"
            title="Admin Dashboard"
          >
            <div className="w-9 h-9 rounded-full bg-blue-500/20 flex items-center justify-center text-white-400">
              <TbUserShield size={20} />
            </div>
          </Link>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="md:hidden p-2 text-gray-600 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <HiX size={28} /> : <HiMenuAlt3 size={28} />}{' '}
          {/*when it is open true = apear x else humburgur icon */}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`
    absolute top-20 left-0 w-full bg-aman-white shadow-xl border-b border-aman-light md:hidden flex flex-col p-6 space-y-4 font-bold
    transition-all duration-300 ease-in-out transform
    ${
      isOpen
        ? 'opacity-100 translate-y-0 pointer-events-auto' /*events auto : when i click its apear */
        : 'opacity-0 -translate-y-4 pointer-events-none' /* none : dont apear anyway */
    }
  `}
      >
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            onClick={() => setIsOpen(false)}
            className={
              pathname === link.path
                ? 'text-aman-blue font-bold font-inter'
                : 'text-aman-dark font-semibold'
            }
          >
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
