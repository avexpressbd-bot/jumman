import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { db } from "@/src/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const navLinks = [
  { name: "হোম", path: "/" },
  { name: "কার্যনির্বাহী কমিটি", path: "/committee" },
  { name: "নিউজ ও ইভেন্ট", path: "/news" },
  { name: "দান/তহবিল", path: "/donation" },
  { name: "যোগাযোগ", path: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const settingsSnap = await getDoc(doc(db, "settings", "site"));
        if (settingsSnap.exists()) {
          setLogoUrl(settingsSnap.data().logoUrl);
        }
      } catch (err) {
        console.error("Error fetching logo:", err);
      }
    };
    fetchLogo();
  }, []);

  return (
    <nav className="bg-emerald-900 text-white sticky top-0 z-50 shadow-lg border-b border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-12 h-12 object-contain" />
              ) : (
                <div className="w-10 h-10 bg-amber-400 rounded-lg flex items-center justify-center font-bold text-emerald-900">
                  B
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-amber-400 leading-tight">
                  বিষ্ণুপুর ইউনিয়ন সোসাইটি
                </span>
                <span className="text-xs font-medium text-emerald-100/80">
                  ঢাকায়স্থ সামাজিক সংগঠন
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname === link.path
                      ? "bg-emerald-800 text-amber-400"
                      : "hover:bg-emerald-800 hover:text-amber-200"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/member-area"
                className="ml-4 inline-flex items-center px-4 py-2 border border-amber-400 text-sm font-medium rounded-full text-amber-400 hover:bg-amber-400 hover:text-emerald-900 transition-all"
              >
                <User className="w-4 h-4 mr-2" />
                সদস্য এলাকা
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-emerald-100 hover:text-white hover:bg-emerald-800 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-emerald-950 border-t border-emerald-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  location.pathname === link.path
                    ? "bg-emerald-800 text-amber-400"
                    : "text-emerald-100 hover:bg-emerald-800 hover:text-white"
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/member-area"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-amber-400 border border-amber-400/30 mt-4"
            >
              সদস্য এলাকা
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
