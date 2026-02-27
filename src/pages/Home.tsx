import { ArrowRight, Target, Users, Heart, Calendar, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { db } from "@/src/lib/firebase";
import { doc, getDoc, collection, getDocs, query, orderBy, limit } from "firebase/firestore";

interface NavLink {
  name: string;
  path: string;
}

const navLinks: NavLink[] = [
  { name: "হোম", path: "/" },
  { name: "সদস্য এরিয়া", path: "/member-area" },
  { name: "যোগাযোগ", path: "/contact" },
];

export default function Home() {
  const [settings, setSettings] = useState<any>(null);
  const [recentNews, setRecentNews] = useState<any[]>([]);
  const [iftarHighlight, setIftarHighlight] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const settingsSnap = await getDoc(doc(db, "settings", "site"));
        if (settingsSnap.exists()) setSettings(settingsSnap.data());

        const newsSnap = await getDocs(query(collection(db, "news"), orderBy("date", "desc"), limit(10)));
        const allNews = newsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRecentNews(allNews.slice(0, 4));
        
        // Find iftar news in the last 10 items for highlighting
        const foundIftar = allNews.find(n => n.title.includes("ইফতার"));
        setIftarHighlight(foundIftar);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const isActive = (path: string): boolean => location.pathname === path;
  const toggleMenu = (): void => setIsOpen(!isOpen);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-12 h-12 text-emerald-900 animate-spin" />
      </div>
    );
  }

  const mainNews = recentNews[0];
  const otherNews = recentNews.slice(1);

  return (
    <div className="space-y-20 pb-20">
      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease forwards;
        }
        
        .animate-fade-in-up-delay-1 {
          animation: fadeInUp 0.8s ease 0.2s forwards;
          opacity: 0;
        }
        
        .animate-fade-in-up-delay-2 {
          animation: fadeInUp 0.8s ease 0.4s forwards;
          opacity: 0;
        }
        
        .animate-fade-in-up-delay-3 {
          animation: fadeInUp 0.8s ease 0.6s forwards;
          opacity: 0;
        }
      `}</style>

      {/* Premium Hero Section */}
      <section className="relative min-h-screen md:min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={settings?.heroImage || "https://picsum.photos/seed/society-hero/1920/1080?blur=2"}
            alt="Hero Background"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Deep gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-r from-emerald-950/80 via-emerald-950/70 to-emerald-950/80" />
          <div className="absolute inset-0 bg-linear-to-t from-emerald-950/90 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Main Headline */}
            <h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight animate-fade-in-up"
              style={{
                fontFamily: "'Hind Siliguri', 'Kalpurush', 'SolaimanLipi', sans-serif",
                textShadow: "0 4px 12px rgba(0, 0, 0, 0.5)"
              }}
            >
              ঐক্যবদ্ধ বিষ্ণুপুর, সমৃদ্ধ ভবিষ্যৎ
            </h1>

            {/* Sub-headline Description */}
            <p 
              className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto animate-fade-in-up-delay-1"
              style={{
                fontFamily: "'Hind Siliguri', 'Kalpurush', 'SolaimanLipi', sans-serif"
              }}
            >
              ঢাকাস্থ বিষ্ণুপুর ইউনিয়ন সোসাইটি একটি অরাজনৈতিক ও সামাজিক সংগঠন। আমরা আমাদের ইউনিয়নের মানুষের কল্যাণে এবং ভ্রাতৃত্বের বন্ধন সুদৃঢ় করতে কাজ করে যাচ্ছি।
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-fade-in-up-delay-2">
              {/* Primary Button */}
              <Link
                to="/member-area"
                className="inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-4 bg-yellow-400 text-emerald-950 font-bold rounded-full hover:scale-105 transition-all duration-300 shadow-lg shadow-yellow-400/40 group"
              >
                <span>সদস্য হোন</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Secondary Ghost Button */}
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 sm:px-10 py-4 bg-white/10 backdrop-blur-md text-white border-2 border-white/40 font-bold rounded-full hover:bg-white/20 hover:border-white/60 transition-all duration-300"
                style={{
                  fontFamily: "'Hind Siliguri', 'Kalpurush', 'SolaimanLipi', sans-serif"
                }}
              >
                যোগাযোগ করুন
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white/50 text-center"
          >
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </div>
      </section>

      {/* Iftar Highlight Section */}
      {iftarHighlight && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-[2.5rem] p-1 shadow-2xl shadow-amber-500/20"
          >
            <div className="bg-white rounded-[2.3rem] p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/3 aspect-video md:aspect-square rounded-3xl overflow-hidden shadow-lg">
                <img 
                  src={iftarHighlight.imageUrl} 
                  alt={iftarHighlight.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-grow text-center md:text-left">
                <div className="inline-flex items-center px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                  বিশেষ ঘোষণা
                </div>
                <h2 className="text-3xl font-bold text-emerald-900 mb-4">{iftarHighlight.title}</h2>
                <p className="text-emerald-800/70 mb-8 line-clamp-3 md:line-clamp-none">
                  {iftarHighlight.content}
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <Link 
                    to="/iftar-registration" 
                    className="px-8 py-4 bg-emerald-900 text-white font-bold rounded-2xl hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/20"
                  >
                    রেজিস্ট্রেশন করুন
                  </Link>
                  <Link 
                    to="/news" 
                    className="px-8 py-4 bg-emerald-50 text-emerald-900 font-bold rounded-2xl hover:bg-emerald-100 transition-all"
                  >
                    বিস্তারিত জানুন
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-4">{settings?.missionTitle || "আমাদের লক্ষ্য ও উদ্দেশ্য"}</h2>
          <div className="w-24 h-1 bg-amber-400 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Target className="w-8 h-8 text-amber-500" />,
              title: "সুনির্দিষ্ট লক্ষ্য",
              desc: settings?.missionDesc || "বিষ্ণুপুর ইউনিয়নের মানুষের আর্থ-সামাজিক উন্নয়ন এবং শিক্ষার প্রসারে কাজ করা আমাদের প্রধান লক্ষ্য।",
            },
            {
              icon: <Users className="w-8 h-8 text-amber-500" />,
              title: "ভ্রাতৃত্বের বন্ধন",
              desc: "ঢাকায় বসবাসরত বিষ্ণুপুর ইউনিয়নের সকল মানুষের মধ্যে ভ্রাতৃত্ব ও সৌহার্দ্যপূর্ণ সম্পর্ক বজায় রাখা।",
            },
            {
              icon: <Heart className="w-8 h-8 text-amber-500" />,
              title: "সামাজিক সেবা",
              desc: "বিপদগ্রস্ত মানুষের পাশে দাঁড়ানো, চিকিৎসা সহায়তা এবং দুস্থদের কল্যাণে বিভিন্ন কর্মসূচি গ্রহণ করা।",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-100 text-center"
            >
              <div className="bg-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-emerald-900 mb-4">{item.title}</h3>
              <p className="text-emerald-800/70 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-emerald-900 py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">{settings?.statsMembers || "৫০০+"}</div>
              <div className="text-emerald-200 text-sm uppercase tracking-widest">সক্রিয় সদস্য</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">{settings?.statsEvents || "২০+"}</div>
              <div className="text-emerald-200 text-sm uppercase tracking-widest">বার্ষিক ইভেন্ট</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">{settings?.statsProjects || "৫০+"}</div>
              <div className="text-emerald-200 text-sm uppercase tracking-widest">সফল প্রজেক্ট</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">{settings?.statsYears || "১০+"}</div>
              <div className="text-emerald-200 text-sm uppercase tracking-widest">বছর পথচলা</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent News Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-emerald-900 mb-2">সাম্প্রতিক কর্মকাণ্ড</h2>
            <p className="text-emerald-800/60">সংগঠনের সর্বশেষ সংবাদ ও নোটিশ বোর্ড</p>
          </div>
          <Link to="/news" className="text-emerald-700 font-bold flex items-center hover:text-amber-600 transition-colors">
            সবগুলো দেখুন <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mainNews ? (
            <div className="group relative overflow-hidden rounded-3xl shadow-lg aspect-video">
              <img
                src={mainNews.imageUrl}
                alt={mainNews.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 to-transparent" />
              <div className="absolute bottom-0 p-8">
                <div className="flex items-center text-amber-400 text-sm mb-3">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(mainNews.date).toLocaleDateString("bn-BD")}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{mainNews.title}</h3>
                <p className="text-emerald-100/80 line-clamp-2">{mainNews.content}</p>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50 rounded-3xl aspect-video flex items-center justify-center text-emerald-300">
              কোনো নিউজ পাওয়া যায়নি
            </div>
          )}

          <div className="space-y-6">
            {otherNews.length > 0 ? otherNews.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 rounded-2xl hover:bg-white hover:shadow-sm transition-all group">
                <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <div className="text-xs text-emerald-600 font-semibold mb-1 uppercase">নোটিশ</div>
                  <h4 className="font-bold text-emerald-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-sm text-emerald-800/60 line-clamp-2 mt-1">
                    {item.content}
                  </p>
                </div>
              </div>
            )) : (
              <div className="text-emerald-300 italic">অতিরিক্ত কোনো নিউজ নেই</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
