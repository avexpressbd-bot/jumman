import { ArrowRight, Target, Users, Heart, Calendar, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { db } from "@/src/lib/firebase";
import { doc, getDoc, collection, getDocs, query, orderBy, limit } from "firebase/firestore";

export default function Home() {
  const [settings, setSettings] = useState<any>(null);
  const [recentNews, setRecentNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const settingsSnap = await getDoc(doc(db, "settings", "site"));
        if (settingsSnap.exists()) setSettings(settingsSnap.data());

        const newsSnap = await getDocs(query(collection(db, "news"), orderBy("date", "desc"), limit(4)));
        setRecentNews(newsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-12 h-12 text-emerald-900 animate-spin" />
      </div>
    );
  }

  const mainNews = recentNews[0];
  const otherNews = recentNews.slice(1);
  const iftarNews = recentNews.find(n => n.title.includes("ইফতার"));

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={settings?.heroImage || "https://picsum.photos/seed/society-hero/1920/1080?blur=2"}
            alt="Hero Background"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-emerald-950/70 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
              {settings?.heroTitle || "ঐক্যবদ্ধ বিষ্ণুপুর, সমৃদ্ধ ভবিষ্যৎ"}
            </h1>
            <p className="text-lg md:text-xl text-emerald-100/90 mb-10 leading-relaxed">
              {settings?.heroSubtitle || `ঢাকায়স্থ ${settings?.siteName || "বিষ্ণুপুর ইউনিয়ন সোসাইটি"} একটি অরাজনৈতিক ও সামাজিক সংগঠন।`}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
              <Link
                to="/member-area"
                className="inline-flex items-center justify-center px-8 py-4 bg-amber-400 text-emerald-950 font-bold rounded-full hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/20"
              >
                সদস্য হোন
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 font-bold rounded-full hover:bg-white/20 transition-all"
              >
                যোগাযোগ করুন
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Iftar Highlight Section */}
      {iftarNews && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-[2.5rem] p-1 shadow-2xl shadow-amber-500/20"
          >
            <div className="bg-white rounded-[2.3rem] p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/3 aspect-video md:aspect-square rounded-3xl overflow-hidden shadow-lg">
                <img 
                  src={iftarNews.imageUrl} 
                  alt={iftarNews.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-grow text-center md:text-left">
                <div className="inline-flex items-center px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                  বিশেষ ঘোষণা
                </div>
                <h2 className="text-3xl font-bold text-emerald-900 mb-4">{iftarNews.title}</h2>
                <p className="text-emerald-800/70 mb-8 line-clamp-3 md:line-clamp-none">
                  {iftarNews.content}
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
