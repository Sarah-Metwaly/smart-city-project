import React from "react"; // ضروري جداً لأنك تستخدمين React.ReactNode
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import logo from "../../assets/logo.png";

const Footer = () => {
  return (
    <footer
      className="relative font-inter border-t border-aman-teal/30 overflow-hidden 
  bg-gradient-to-b from-aman-black via-aman-dark to-aman-black text-aman-white"
    >
      {/* Glow effect */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-aman-blue/5 blur-[120px] pointer-events-none" /> 

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="container mx-auto grid grid-cols-1 place-items-center md:place-items-baseline md:grid-cols-2 lg:grid-cols-4 gap-16">
          
          {/* Column 1: Branding */}
          <div className="space-y-6 mt-10">
            <Link
              to="/"
              className="inline-block transition-transform hover:scale-105"
            >
              <img
                src={logo}
                alt="Smart City Logo"
                className="w-40 brightness-110" 
              />
            </Link>
            <p className="text-aman-light text-sm max-w-xs leading-relaxed">
              Building a sustainable and intelligent future by integrating
              cutting-edge technology to enhance urban living and public
              services.
            </p>
            <div className="flex space-x-4">
              <SocialIcon icon={<FaFacebookF size={18} />} />
              <SocialIcon icon={<FaTwitter size={18} />} />
              <SocialIcon icon={<FaLinkedinIn size={18} />} />
              <SocialIcon icon={<FaInstagram size={18} />} />
            </div>
          </div>

          {/* Column 2: Urban Services */}
          <div className="lg:pt-10">
            <h4 className="font-montserrat font-bold text-lg mb-6 text-aman-white tracking-wider">
              SMART SERVICES
            </h4>
            <ul className="space-y-4 text-sm">
              <FooterLink to="/weather" text="Climate Systems" />
              <FooterLink to="/energy" text="Energy Management" />
              <FooterLink to="/police" text="Smart Security" />
              <FooterLink to="/fire" text="Emergency Response" />
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="lg:pt-10">
            <h4 className="font-montserrat font-bold text-lg mb-6 text-aman-white tracking-wide">
              QUICK LINKS
            </h4>
            <ul className="space-y-4 text-sm">
              <FooterLink to="/about" text="About Project" />
              <FooterLink to="/contact" text="Get In Touch" />
              <FooterLink to="/privacy" text="Privacy Policy" />
              <FooterLink to="/faq" text="General FAQ" />
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-6 lg:pt-10">
            <h4 className="font-montserrat font-bold text-lg mb-2 text-aman-white tracking-wide">
              STAY CONNECTED
            </h4>
            <p className="text-aman-light text-xs">
              Subscribe to receive the latest smart city updates and alerts.
            </p>
            <div className="relative group">
              <input
                type="email"
                placeholder="Enter email address"
                className="w-full bg-aman-teal/10 border border-aman-teal/30 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-aman-blue transition-all"
              />
              <button className="absolute right-2 top-2 bottom-2 bg-aman-blue hover:bg-white hover:text-aman-black px-4 rounded-lg text-xs font-bold transition-all cursor-pointer">
                JOIN
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-aman-teal/10 flex flex-col md:flex-row justify-center items-center text-[10px] uppercase tracking-[2px] text-aman-blue font-bold">
          <p>© 2026 Aman Smart City. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// Types for Sub-components
interface FooterLinkProps {
  to: string;
  text: string;
}

const FooterLink: React.FC<FooterLinkProps> = ({ to, text }) => (
  <li>
    <Link
      to={to}
      className="text-aman-light hover:text-aman-white hover:translate-x-2 transition-all duration-300 inline-block"
    > 
      {text}
    </Link>
  </li>
);

const SocialIcon = ({ icon }: { icon: React.ReactNode }) => (
  <a
    href="#"
    className="w-10 h-10 rounded-full bg-aman-teal/20 flex items-center justify-center hover:bg-aman-blue transition-all duration-300 text-aman-light hover:text-white cursor-pointer"
  >
    {icon}
  </a>
);

export default Footer;