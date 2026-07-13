interface NavLink {
  name: string;
  id: string;
  path: string; 
}

interface NavbarProps {
  links: NavLink[]; 
  activeView: string;
  onViewChange: (id: string) => void; 
}

const PoliceNavbar = ({ links, activeView, onViewChange }: NavbarProps) => { 
  return (
    <nav className="flex justify-start w-full"> 
      <div className="flex gap-1 bg-aman-teal/20 border border-aman-teal rounded-xl p-0.5 md:p-1.5 backdrop-blur-md">
        {links.map((link) => (
          <button
            key={link.id}
            type="button"
            onClick={() => onViewChange(link.id)} // دي اللي بتغير الـ State
            className={`px-5 md:py-1 font-['DM_Mono'] text-[9px] md:text-[10px] font-thin tracking-[1.3px] uppercase antialiased transition-all duration-300 ease-in-out rounded-lg ${
              activeView === link.id 
                ? 'bg-[#7A9AAA] text-black' 
                : 'text-white hover:bg-[#7A9AAA] hover:text-black'
            }`}
          >
            {link.name}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default PoliceNavbar;