import { motion } from "motion/react";
import { MapPin, Phone, Mail, Clock, Send, Facebook, Twitter, Youtube } from "lucide-react";

export default function Contact() {
  return (
    <div className="py-20 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-emerald-900 mb-4">যোগাযোগ করুন</h1>
          <p className="text-emerald-800/60 max-w-2xl mx-auto">
            আমাদের সাথে যোগাযোগ করতে নিচের তথ্যগুলো ব্যবহার করুন অথবা সরাসরি আমাদের অফিসে চলে আসুন।
          </p>
          <div className="w-24 h-1 bg-amber-400 mx-auto rounded-full mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-emerald-100">
              <h2 className="text-2xl font-bold text-emerald-900 mb-8">অফিস ঠিকানা</h2>
              <ul className="space-y-8">
                <li className="flex items-start">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0 mr-4">
                    <MapPin className="w-6 h-6 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-900 mb-1">ঠিকানা</h4>
                    <p className="text-sm text-emerald-800/60 leading-relaxed">বাড়ি নং-১২, রোড নং-৫, ধানমন্ডি, ঢাকা-১২০৫</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0 mr-4">
                    <Phone className="w-6 h-6 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-900 mb-1">ফোন</h4>
                    <p className="text-sm text-emerald-800/60 leading-relaxed">+৮৮০ ১৭০০-০০০০০০</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0 mr-4">
                    <Mail className="w-6 h-6 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-900 mb-1">ইমেইল</h4>
                    <p className="text-sm text-emerald-800/60 leading-relaxed">info@bishnupursociety.org</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0 mr-4">
                    <Clock className="w-6 h-6 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-900 mb-1">অফিস সময়</h4>
                    <p className="text-sm text-emerald-800/60 leading-relaxed">শনিবার - বৃহস্পতিবার: সকাল ১০টা - রাত ৮টা</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-emerald-900 p-8 rounded-[2.5rem] text-white">
              <h3 className="text-xl font-bold mb-6">সোশ্যাল মিডিয়া</h3>
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-amber-400 hover:text-emerald-950 transition-all">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-amber-400 hover:text-emerald-950 transition-all">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-amber-400 hover:text-emerald-950 transition-all">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-emerald-100">
              <h2 className="text-2xl font-bold text-emerald-900 mb-8">বার্তা পাঠান</h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2 ml-1">আপনার নাম</label>
                  <input
                    className="w-full px-6 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                    placeholder="নাম লিখুন"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2 ml-1">ইমেইল</label>
                  <input
                    className="w-full px-6 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                    placeholder="example@mail.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2 ml-1">বিষয়</label>
                  <input
                    className="w-full px-6 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                    placeholder="বার্তার বিষয়"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2 ml-1">বার্তা</label>
                  <textarea
                    rows={5}
                    className="w-full px-6 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none resize-none"
                    placeholder="আপনার বার্তা লিখুন..."
                  />
                </div>
                <div className="md:col-span-2">
                  <button className="w-full py-5 bg-emerald-900 text-white font-bold rounded-2xl hover:bg-emerald-800 transition-all flex items-center justify-center shadow-lg shadow-emerald-900/20">
                    বার্তা পাঠান
                    <Send className="ml-2 w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Google Maps Placeholder */}
            <div className="bg-white p-4 rounded-[2.5rem] shadow-sm border border-emerald-100 h-[400px] overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.212821024272!2d90.37256241536262!3d23.73977349509204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755bf3608778619%3A0x286307301072462!2sDhanmondi%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1645524312345!5m2!1sen!2sbd"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: "1.5rem" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
