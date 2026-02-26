import React, { useState } from "react";
import { motion } from "motion/react";
import { Lock, User, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // These will be replaced with the credentials you provide
  const ADMIN_ID = "admin"; 
  const ADMIN_PASS = "123456";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simple check for dedicated admin credentials
    setTimeout(() => {
      if (id === ADMIN_ID && password === ADMIN_PASS) {
        localStorage.setItem("isAdminAuthenticated", "true");
        navigate("/admin");
      } else {
        setError("ভুল আইডি অথবা পাসওয়ার্ড! আবার চেষ্টা করুন।");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-emerald-950 flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-400 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-10 shadow-2xl">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-amber-400 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-12 shadow-lg shadow-amber-400/20">
              <Lock className="w-10 h-10 text-emerald-950 -rotate-12" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">এডমিন লগইন</h1>
            <p className="text-emerald-200/60 text-sm">শুধুমাত্র অনুমোদিত ব্যক্তিদের জন্য</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-2xl flex items-center text-red-200 text-sm"
            >
              <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2 ml-1">এডমিন আইডি</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                  placeholder="আপনার আইডি লিখুন"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2 ml-1">পাসওয়ার্ড</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-amber-400 text-emerald-950 font-bold rounded-2xl hover:bg-amber-300 transition-all flex items-center justify-center shadow-lg shadow-amber-400/20 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>
                  লগইন করুন
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => navigate("/")}
              className="text-emerald-400 text-sm hover:text-white transition-colors"
            >
              হোমপেজে ফিরে যান
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
