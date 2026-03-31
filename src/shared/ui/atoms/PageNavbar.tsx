interface NavLink {
  name: string;
  id: string;
}

// Define that this component MUST receive 'links'
interface NavbarProps {
  links: NavLink[]; 
}

const PoliceNavbar = ({ links }: NavbarProps) => {
  return (
    <nav className="flex justify-start w-full"> 
      <div className="flex  gap-1 bg-[#1E3A46]/20 border border-[#1E3A46] rounded-xl p-1.5 backdrop-blur-md">
        {links.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
           className="px-5 py-1 font-['DM_Mono'] text-[10px] font-thin tracking-[1.3px] uppercase antialiased transition-all duration-300 ease-in-out rounded-[8px] text-white hover:bg-[#7A9AAA] hover:text-black"
          >
            {link.name}
          </a>
        ))}
      </div>
    </nav>
  );
};

export default PoliceNavbar;