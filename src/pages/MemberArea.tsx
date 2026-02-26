import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Mail, Lock, Phone, ArrowRight, CheckCircle2, AlertCircle, LogOut, Settings, ShieldCheck } from "lucide-react";
import { auth, db } from "@/src/lib/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const loginSchema = z.object({
  email: z.string().email("সঠিক ইমেইল দিন"),
  password: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"),
});

const registerSchema = z.object({
  name: z.string().min(3, "নাম কমপক্ষে ৩ অক্ষরের হতে হবে"),
  email: z.string().email("সঠিক ইমেইল দিন"),
  phone: z.string().min(11, "সঠিক মোবাইল নম্বর দিন"),
  password: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"),
});

export default function MemberArea() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, "members", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } else {
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });

  const onLogin = async (data: z.infer<typeof loginSchema>) => {
    setLoading(true);
    setMessage(null);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      setMessage({ type: "success", text: "লগইন সফল হয়েছে!" });
    } catch (err: any) {
      let errorMsg = "লগইন ব্যর্থ হয়েছে";
      if (err.code === "auth/user-not-found") errorMsg = "এই ইমেইলে কোনো একাউন্ট নেই";
      if (err.code === "auth/wrong-password") errorMsg = "ভুল পাসওয়ার্ড";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (data: z.infer<typeof registerSchema>) => {
    setLoading(true);
    setMessage(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const newUser = userCredential.user;
      
      await updateProfile(newUser, { displayName: data.name });
      
      // Save extra data to Firestore
      await setDoc(doc(db, "members", newUser.uid), {
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: "member",
        createdAt: new Date().toISOString()
      });

      setMessage({ type: "success", text: "নিবন্ধন সফল হয়েছে!" });
    } catch (err: any) {
      let errorMsg = "নিবন্ধন ব্যর্থ হয়েছে";
      if (err.code === "auth/email-already-in-use") errorMsg = "এই ইমেইলটি ইতিমধ্যে ব্যবহৃত হচ্ছে";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setMessage({ type: "success", text: "লগআউট সফল হয়েছে" });
  };

  if (user) {
    return (
      <div className="min-h-screen py-20 bg-stone-50 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1 space-y-6">
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-emerald-100 text-center">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-700">
                  <User className="w-12 h-12" />
                </div>
                <h2 className="text-xl font-bold text-emerald-900">{user.displayName || "সদস্য"}</h2>
                <p className="text-sm text-emerald-600 font-medium mb-6 uppercase tracking-wider">
                  {userData?.role === "admin" ? "এডমিন" : "সাধারণ সদস্য"}
                </p>
                <button 
                  onClick={handleLogout}
                  className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-all flex items-center justify-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  লগআউট
                </button>
              </div>

              <div className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-emerald-100 overflow-hidden">
                <nav className="space-y-1">
                  <button className="w-full flex items-center px-4 py-3 text-sm font-medium text-emerald-900 bg-emerald-50 rounded-2xl">
                    <User className="w-4 h-4 mr-3 text-emerald-600" />
                    প্রোফাইল
                  </button>
                  <button className="w-full flex items-center px-4 py-3 text-sm font-medium text-emerald-800 hover:bg-stone-50 rounded-2xl transition-colors">
                    <ShieldCheck className="w-4 h-4 mr-3 text-emerald-400" />
                    নিরাপত্তা
                  </button>
                  <button className="w-full flex items-center px-4 py-3 text-sm font-medium text-emerald-800 hover:bg-stone-50 rounded-2xl transition-colors">
                    <Settings className="w-4 h-4 mr-3 text-emerald-400" />
                    সেটিংস
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-emerald-100">
                <h3 className="text-2xl font-bold text-emerald-900 mb-8">ব্যক্তিগত তথ্য</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">পূর্ণ নাম</label>
                    <p className="text-lg font-medium text-emerald-900">{userData?.name || user.displayName}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">ইমেইল</label>
                    <p className="text-lg font-medium text-emerald-900">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">মোবাইল নম্বর</label>
                    <p className="text-lg font-medium text-emerald-900">{userData?.phone || "সংযুক্ত নেই"}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">সদস্যপদ আইডি</label>
                    <p className="text-lg font-medium text-emerald-900">#BUS-{user.uid.slice(0, 6).toUpperCase()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-4">সংগঠনের নোটিশ</h3>
                  <p className="text-emerald-100/70 text-sm leading-relaxed mb-6">
                    আপনার সদস্যপদ সক্রিয় আছে। সংগঠনের পরবর্তী সাধারণ সভায় আপনার উপস্থিতি কাম্য।
                  </p>
                  <div className="flex items-center text-amber-400 font-bold text-sm cursor-pointer hover:text-amber-300 transition-colors">
                    বিস্তারিত দেখুন <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
                <div className="absolute top-[-20px] right-[-20px] opacity-10">
                  <ShieldCheck className="w-40 h-40" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 bg-stone-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-emerald-900/5 border border-emerald-100 overflow-hidden">
          <div className="bg-emerald-900 p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[size:20px_20px]" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 relative z-10">
              {isLogin ? "স্বাগতম" : "সদস্য নিবন্ধন"}
            </h2>
            <p className="text-emerald-100/70 text-sm relative z-10">
              {isLogin ? "আপনার একাউন্টে লগইন করুন" : "নতুন সদস্য হিসেবে যুক্ত হোন"}
            </p>
          </div>

          <div className="p-10">
            <AnimatePresence mode="wait">
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`mb-6 p-4 rounded-2xl flex items-center text-sm font-medium ${
                    message.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                  }`}
                >
                  {message.type === "success" ? (
                    <CheckCircle2 className="w-5 h-5 mr-3 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
                  )}
                  {message.text}
                </motion.div>
              )}
            </AnimatePresence>

            {isLogin ? (
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2 ml-1">ইমেইল</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                    <input
                      {...loginForm.register("email")}
                      className="w-full pl-12 pr-4 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                      placeholder="example@mail.com"
                    />
                  </div>
                  {loginForm.formState.errors.email && (
                    <p className="text-red-500 text-xs mt-2 ml-1">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2 ml-1">পাসওয়ার্ড</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                    <input
                      {...loginForm.register("password")}
                      type="password"
                      className="w-full pl-12 pr-4 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-red-500 text-xs mt-2 ml-1">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>

                <button
                  disabled={loading}
                  className="w-full py-4 bg-emerald-900 text-white font-bold rounded-2xl hover:bg-emerald-800 transition-all flex items-center justify-center disabled:opacity-50"
                >
                  {loading ? "অপেক্ষা করুন..." : "লগইন করুন"}
                  {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
                </button>
              </form>
            ) : (
              <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2 ml-1">পূর্ণ নাম</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                    <input
                      {...registerForm.register("name")}
                      className="w-full pl-12 pr-4 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                      placeholder="আপনার নাম"
                    />
                  </div>
                  {registerForm.formState.errors.name && (
                    <p className="text-red-500 text-xs mt-2 ml-1">{registerForm.formState.errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2 ml-1">ইমেইল</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                    <input
                      {...registerForm.register("email")}
                      className="w-full pl-12 pr-4 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                      placeholder="example@mail.com"
                    />
                  </div>
                  {registerForm.formState.errors.email && (
                    <p className="text-red-500 text-xs mt-2 ml-1">{registerForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2 ml-1">মোবাইল নম্বর</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                    <input
                      {...registerForm.register("phone")}
                      className="w-full pl-12 pr-4 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                      placeholder="০১৭১১-০০০০০০"
                    />
                  </div>
                  {registerForm.formState.errors.phone && (
                    <p className="text-red-500 text-xs mt-2 ml-1">{registerForm.formState.errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2 ml-1">পাসওয়ার্ড</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                    <input
                      {...registerForm.register("password")}
                      type="password"
                      className="w-full pl-12 pr-4 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                  {registerForm.formState.errors.password && (
                    <p className="text-red-500 text-xs mt-2 ml-1">{registerForm.formState.errors.password.message}</p>
                  )}
                </div>

                <button
                  disabled={loading}
                  className="w-full py-4 bg-emerald-900 text-white font-bold rounded-2xl hover:bg-emerald-800 transition-all flex items-center justify-center disabled:opacity-50"
                >
                  {loading ? "অপেক্ষা করুন..." : "নিবন্ধন করুন"}
                  {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
                </button>
              </form>
            )}

            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setMessage(null);
                }}
                className="text-emerald-700 font-bold hover:text-amber-600 transition-colors"
              >
                {isLogin ? "নতুন একাউন্ট তৈরি করুন" : "আগের একাউন্টে লগইন করুন"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
