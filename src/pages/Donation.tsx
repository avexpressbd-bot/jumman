import { motion } from "motion/react";
import { Heart, CreditCard, Landmark, Wallet, ArrowRight } from "lucide-react";

export default function Donation() {
  return (
    <div className="py-20 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-full mb-6">
            <Heart className="w-10 h-10 text-amber-600 fill-amber-600" />
          </div>
          <h1 className="text-4xl font-bold text-emerald-900 mb-4">দান ও তহবিল</h1>
          <p className="text-emerald-800/60 max-w-2xl mx-auto">
            আপনার সামান্য অনুদান আমাদের ইউনিয়নের দুস্থ মানুষের মুখে হাসি ফোটাতে পারে। সংগঠনের তহবিলে চাঁদা বা অনুদান দিয়ে আমাদের পাশে থাকুন।
          </p>
          <div className="w-24 h-1 bg-amber-400 mx-auto rounded-full mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Donation Methods */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-emerald-900 mb-6">পেমেন্ট মেথড</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: <Wallet className="w-6 h-6" />, name: "বিকাশ", color: "bg-[#d12053]" },
                { icon: <Wallet className="w-6 h-6" />, name: "নগদ", color: "bg-[#f7941d]" },
                { icon: <Landmark className="w-6 h-6" />, name: "ব্যাংক ট্রান্সফার", color: "bg-emerald-700" },
                { icon: <CreditCard className="w-6 h-6" />, name: "কার্ড পেমেন্ট", color: "bg-blue-600" },
              ].map((method, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-100 flex items-center gap-4 cursor-pointer group"
                >
                  <div className={`${method.color} text-white p-3 rounded-2xl`}>
                    {method.icon}
                  </div>
                  <span className="font-bold text-emerald-900 group-hover:text-emerald-700 transition-colors">{method.name}</span>
                </motion.div>
              ))}
            </div>

            <div className="bg-emerald-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-4">সরাসরি অনুদান</h3>
                <p className="text-emerald-100/70 mb-8 text-sm leading-relaxed">
                  আপনি যদি সরাসরি আমাদের অফিসে এসে অনুদান দিতে চান, তবে নিচের ঠিকানায় যোগাযোগ করুন।
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                      <Landmark className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-xs text-emerald-300 uppercase font-bold tracking-widest">ব্যাংক একাউন্ট</div>
                      <div className="font-bold">বিষ্ণুপুর ইউনিয়ন সোসাইটি, এ/সি: ১২৩৪৫৬৭৮৯</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-[-20px] right-[-20px] opacity-10">
                <Heart className="w-40 h-40 fill-white" />
              </div>
            </div>
          </div>

          {/* Donation Form */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-emerald-900/5 border border-emerald-100">
            <h2 className="text-2xl font-bold text-emerald-900 mb-8">অনুদান ফরম</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <button type="button" className="py-4 border-2 border-emerald-100 rounded-2xl font-bold text-emerald-900 hover:border-emerald-500 transition-all">৳ ৫০০</button>
                <button type="button" className="py-4 border-2 border-emerald-500 bg-emerald-50 rounded-2xl font-bold text-emerald-900">৳ ১০০০</button>
                <button type="button" className="py-4 border-2 border-emerald-100 rounded-2xl font-bold text-emerald-900 hover:border-emerald-500 transition-all">৳ ৫০০০</button>
                <button type="button" className="py-4 border-2 border-emerald-100 rounded-2xl font-bold text-emerald-900 hover:border-emerald-500 transition-all">অন্যান্য</button>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2 ml-1">টাকার পরিমাণ (৳)</label>
                <input
                  type="number"
                  className="w-full px-6 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                  placeholder="১০০০"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2 ml-1">আপনার নাম</label>
                <input
                  className="w-full px-6 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                  placeholder="নাম লিখুন"
                />
              </div>

              <button className="w-full py-5 bg-amber-400 text-emerald-950 font-bold rounded-2xl hover:bg-amber-300 transition-all flex items-center justify-center shadow-lg shadow-amber-400/20">
                অনুদান দিন
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              
              <p className="text-center text-xs text-emerald-800/50 mt-4">
                আপনার তথ্য আমাদের কাছে সুরক্ষিত থাকবে।
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
