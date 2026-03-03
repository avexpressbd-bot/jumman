import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Footer() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsSnap = await getDoc(doc(db, "settings", "site"));
        if (settingsSnap.exists()) {
          setSettings(settingsSnap.data());
        }
      } catch (err) {
        console.error("Error fetching footer settings:", err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-emerald-950 text-emerald-100 pt-16 pb-8 border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-base font-bold text-amber-400 mb-4">
              {settings?.footerTitle || settings?.siteName || "বিষ্ণুপুর ইউনিয়ন সোসাইটি"}
            </h3>
            <p className="text-sm text-emerald-200/70 leading-relaxed">
              {settings?.footerDescription || `ঢাকায়স্থ ${settings?.siteName || "বিষ্ণুপুর ইউনিয়ন সোসাইটি"} একটি অরাজনৈতিক ও সামাজিক সংগঠন। আমরা আমাদের ইউনিয়নের মানুষের কল্যাণে কাজ করে যাচ্ছি।`}
            </p>
            <div className="flex space-x-4 mt-6">
              <a href={settings?.facebook || "#"} target="_blank" rel="noreferrer" className="text-emerald-300 hover:text-amber-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href={settings?.twitter || "#"} target="_blank" rel="noreferrer" className="text-emerald-300 hover:text-amber-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href={settings?.youtube || "#"} target="_blank" rel="noreferrer" className="text-emerald-300 hover:text-amber-400 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">দ্রুত লিঙ্ক</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/" className="hover:text-amber-400 transition-colors">হোম</Link></li>
              <li><Link to="/committee" className="hover:text-amber-400 transition-colors">কার্যনির্বাহী কমিটি</Link></li>
              <li><Link to="/news" className="hover:text-amber-400 transition-colors">নিউজ ও ইভেন্ট</Link></li>
              <li><Link to="/donation" className="hover:text-amber-400 transition-colors">দান/তহবিল</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">সহায়তা</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/member-area" className="hover:text-amber-400 transition-colors">সদস্য নিবন্ধন</Link></li>
              <li><Link to="/contact" className="hover:text-amber-400 transition-colors">যোগাযোগ</Link></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">গোপনীয়তা নীতি</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">শর্তাবলী</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">যোগাযোগ করুন</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-amber-400 mr-3 shrink-0" />
                <span>{settings?.address || "বাড়ি নং-১২, রোড নং-৫, ধানমন্ডি, ঢাকা-১২০৫"}</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-amber-400 mr-3 shrink-0" />
                <span>{settings?.phone || "+৮৮০ ১৭০০-০০০০০০"}</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-amber-400 mr-3 shrink-0" />
                <span>{settings?.email || "info@bishnupursociety.org"}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-emerald-900 text-center text-xs text-emerald-400/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} ঢাকায়স্থ {settings?.siteName || "বিষ্ণুপুর ইউনিয়ন সোসাইটি"}। সর্বস্বত্ব সংরক্ষিত।</p>
          <Link to="/admin-login" className="hover:text-amber-400 transition-colors opacity-50 hover:opacity-100">এডমিন লগইন</Link>
        </div>
      </div>
    </footer>
  );
}
