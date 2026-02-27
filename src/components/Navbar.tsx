import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { cn } from "@/src/lib/utils";
import logoImage from "../../assets/logoo.png";

interface NavLink {
  name: string;
  path: string;
}

const navLinks: NavLink[] = [
  { name: "হোম", path: "/" },
  { name: "কমিটি", path: "/committee" },
  { name: "ইফতার রেজিস্ট্রেশন", path: "/iftar-registration" },
  { name: "নিউজ ও ইভেন্ট", path: "/news" },
  { name: "দান/তহবিল", path: "/donation" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const location = useLocation();

  const isActive = (path: string): boolean => location.pathname === path;
  const toggleMenu = (): void => setIsOpen(!isOpen);
  const closeMenu = (): void => setIsOpen(false);

  return (
    <>
      {/* Custom CSS for animations */}
      <style>{`
        @keyframes underline-grow {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }
        
        .underline-grow::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: #facc15;
          transition: width 0.3s ease;
        }
        
        .underline-grow:hover::after {
          animation: underline-grow 0.3s ease forwards;
        }
      `}</style>

      <nav 
        className="sticky top-0 z-50 border-b border-emerald-800/30"
        style={{
          fontFamily: "'Hind Siliguri', 'Kalpurush', 'SolaimanLipi', sans-serif",
          backgroundColor: "rgba(5, 85, 65, 0.95)",
          backdropFilter: "blur(12px)"
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            {/* Logo & Branding Section */}
            <Link 
              to="/" 
              className="flex items-center gap-3 hover:opacity-90 transition-opacity duration-300 shrink-0"
              aria-label="Home"
            >
              {/* Logo Image */}
              <img 
                src={logoImage} 
                alt="বিষ্ণুপুর ইউনিয়ন সোসাইটি Logo" 
                className="h-16 w-auto object-contain"
              />

              {/* Text Branding */}
              <h1 
                className="text-xl sm:text-2xl lg:text-2xl font-bold tracking-tight text-yellow-400 leading-tight"
                style={{
                  fontFamily: "'Hind Siliguri', 'Kalpurush', 'SolaimanLipi', sans-serif",
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)"
                }}
              >
                ঢাকাস্থ বিষ্ণুপুর ইউনিয়ন সোসাইটি
              </h1>
            </Link>

            {/* Desktop Navigation Links - Center Aligned */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link: NavLink) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-all duration-300",
                    "underline-grow",
                    isActive(link.path)
                      ? "text-yellow-400"
                      : "text-emerald-100 hover:text-yellow-400"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Desktop CTA Button */}
            <div className="hidden lg:flex items-center ml-4">
              <Link
                to="/member-area"
                className={cn(
                  "inline-flex items-center gap-2 px-6 py-2.5",
                  "border-2 border-yellow-400 rounded-full",
                  "text-sm font-semibold text-yellow-400",
                  "bg-yellow-400/10 backdrop-blur-sm",
                  "transition-all duration-300",
                  "hover:bg-yellow-400 hover:text-emerald-900",
                  "hover:shadow-lg hover:shadow-yellow-400/40"
                )}
              >
                <User className="w-5 h-5" />
                <span>মেম্বার হোন</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              <Link
                to="/member-area"
                className={cn(
                  "inline-flex items-center gap-1 px-3 py-2",
                  "border-2 border-yellow-400 rounded-full",
                  "text-xs font-semibold text-yellow-400",
                  "bg-yellow-400/10",
                  "transition-all duration-300",
                  "hover:bg-yellow-400 hover:text-emerald-900"
                )}
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">মেম্বার হোন</span>
              </Link>

              <button
                onClick={toggleMenu}
                className={cn(
                  "inline-flex items-center justify-center p-2.5 rounded-lg",
                  "text-emerald-100 hover:text-white hover:bg-emerald-800/50",
                  "focus:outline-none transition-colors duration-300"
                )}
                aria-expanded={isOpen}
                aria-label="Toggle navigation menu"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div 
            className="lg:hidden border-t border-emerald-800/30"
            style={{
              backgroundColor: "rgba(5, 85, 65, 0.98)",
              backdropFilter: "blur(12px)"
            }}
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-2">
              {navLinks.map((link: NavLink) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeMenu}
                  className={cn(
                    "block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300",
                    isActive(link.path)
                      ? "bg-emerald-800/50 text-yellow-400 font-semibold"
                      : "text-emerald-100 hover:bg-emerald-800/30 hover:text-yellow-400"
                  )}
                >
                  {link.name}
                </Link>
              ))}

              {/* Contact Link for Mobile */}
              <Link
                to="/contact"
                onClick={closeMenu}
                className={cn(
                  "block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300",
                  isActive("/contact")
                    ? "bg-emerald-800/50 text-yellow-400 font-semibold"
                    : "text-emerald-100 hover:bg-emerald-800/30 hover:text-yellow-400"
                )}
              >
                যোগাযোগ
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
