import { Link } from "react-router-dom";

interface FooterProps {
  className?: string;
}

const Footer = ({ className = "" }: FooterProps) => {
  return (
    <footer className={`w-full border-t border-slate-200/15 bg-white py-12 px-6 md:px-12 ${className}`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-xs tracking-wide text-slate-400 font-label">
          &copy; {new Date().getFullYear()} NavigAid. Empowering communities through accessible aid.
        </div>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          <Link to="/" className="text-xs font-label text-slate-400 hover:text-blue-800 transition-colors">
            Privacy Policy
          </Link>
          <Link to="/" className="text-xs font-label text-slate-400 hover:text-blue-800 transition-colors">
            Terms of Service
          </Link>
          <Link to="/" className="text-xs font-label text-slate-400 hover:text-blue-800 transition-colors">
            Accessibility
          </Link>
          <Link to="/" className="text-xs font-label text-slate-400 hover:text-blue-800 transition-colors">
            Contact Support
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
