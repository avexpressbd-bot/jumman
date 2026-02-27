import React, { useState } from "react";
import { motion } from "motion/react";
import { User, Phone, Briefcase, Calendar, CreditCard, Hash, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { db } from "@/src/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function IftarRegistration() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    profession: "",
    age: "",
    paymentMethod: "bkash",
    amount: "",
    transactionId: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await addDoc(collection(db, "iftar_registrations"), {
        ...formData,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      setSubmitted(true);
    } catch (err: any) {
      console.error("Registration error:", err);
      setError("রেজিস্ট্রেশন করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-10 rounded-[3rem] shadow-xl border border-emerald-100 text-center"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-emerald-900 mb-4">রেজিস্ট্রেশন সফল!</h2>
          <p className="text-emerald-700 mb-8">
            আপনার ইফতার পার্টির রেজিস্ট্রেশন সফলভাবে জমা হয়েছে। এডমিন যাচাই করার পর আপনাকে নিশ্চিত করা হবে।
          </p>
          <button 
            onClick={() => window.location.href = "/"}
            className="w-full py-4 bg-emerald-900 text-white font-bold rounded-2xl hover:bg-emerald-800 transition-all"
          >
            হোমপেজে ফিরে যান
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 bg-stone-50 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-emerald-900 mb-4">ইফতার পার্টি রেজিস্ট্রেশন</h1>
          <p className="text-emerald-700">
            বিষ্ণুপুর ইউনিয়ন সোসাইটির ইফতার ও দোয়া মাহফিলে অংশগ্রহণের জন্য নিচের ফর্মটি পূরণ করুন।
          </p>
          <div className="w-24 h-1 bg-amber-400 mx-auto rounded-full mt-6" />
        </div>

        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-emerald-100">
          {error && (
            <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-2xl flex items-center text-sm font-medium">
              <AlertCircle className="w-5 h-5 mr-3" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2 ml-1">পূর্ণ নাম</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    placeholder="আপনার নাম"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2 ml-1">মোবাইল নম্বর</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                  <input
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    placeholder="০১৭১১-০০০০০০"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2 ml-1">পেশা</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                  <input
                    required
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    placeholder="আপনার পেশা"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2 ml-1">বয়স</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                  <input
                    required
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    placeholder="আপনার বয়স"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-emerald-50">
              <h3 className="text-lg font-bold text-emerald-900 mb-6">পেমেন্ট তথ্য</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2 ml-1">পেমেন্ট মাধ্যম</label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none"
                    >
                      <option value="bkash">বিকাশ (Bkash)</option>
                      <option value="nagad">নগদ (Nagad)</option>
                      <option value="cash">ক্যাশ (Cash)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2 ml-1">টাকার পরিমাণ</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-emerald-400">৳</span>
                    <input
                      required
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                      placeholder="৫০০"
                    />
                  </div>
                </div>

                {formData.paymentMethod !== "cash" && (
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2 ml-1">ট্রাঞ্জেকশন আইডি (TrxID)</label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                      <input
                        required
                        value={formData.transactionId}
                        onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        placeholder="ABC123XYZ"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full py-5 bg-emerald-900 text-white font-bold rounded-[2rem] hover:bg-emerald-800 transition-all flex items-center justify-center shadow-lg shadow-emerald-900/20 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
              ) : (
                <Send className="w-6 h-6 mr-2" />
              )}
              রেজিস্ট্রেশন সাবমিট করুন
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
