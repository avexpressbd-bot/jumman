import { ArrowRight, Target, Users, Heart, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export default function Home() {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://picsum.photos/seed/society-hero/1920/1080?blur=2"
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
              ঐক্যবদ্ধ <span className="text-amber-400">বিষ্ণুপুর</span>, সমৃদ্ধ ভবিষ্যৎ
            </h1>
            <p className="text-lg md:text-xl text-emerald-100/90 mb-10 leading-relaxed">
              ঢাকায়স্থ বিষ্ণুপুর ইউনিয়ন সোসাইটি একটি অরাজনৈতিক ও সামাজিক সংগঠন। আমরা আমাদের ইউনিয়নের মানুষের কল্যাণে এবং ভ্রাতৃত্বের বন্ধন সুদৃঢ় করতে কাজ করে যাচ্ছি।
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

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-4">আমাদের লক্ষ্য ও উদ্দেশ্য</h2>
          <div className="w-24 h-1 bg-amber-400 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Target className="w-8 h-8 text-amber-500" />,
              title: "সুনির্দিষ্ট লক্ষ্য",
              desc: "বিষ্ণুপুর ইউনিয়নের মানুষের আর্থ-সামাজিক উন্নয়ন এবং শিক্ষার প্রসারে কাজ করা আমাদের প্রধান লক্ষ্য।",
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
              <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">৫০০+</div>
              <div className="text-emerald-200 text-sm uppercase tracking-widest">সক্রিয় সদস্য</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">২০+</div>
              <div className="text-emerald-200 text-sm uppercase tracking-widest">বার্ষিক ইভেন্ট</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">৫০+</div>
              <div className="text-emerald-200 text-sm uppercase tracking-widest">সফল প্রজেক্ট</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">১০+</div>
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
          <div className="group relative overflow-hidden rounded-3xl shadow-lg aspect-video">
            <img
              src="https://picsum.photos/seed/news-main/800/450"
              alt="News"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 to-transparent" />
            <div className="absolute bottom-0 p-8">
              <div className="flex items-center text-amber-400 text-sm mb-3">
                <Calendar className="w-4 h-4 mr-2" />
                ১০ মার্চ, ২০২৪
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">বার্ষিক সাধারণ সভা ২০২৪</h3>
              <p className="text-emerald-100/80 line-clamp-2">আগামী ১০ই মার্চ আমাদের বার্ষিক সাধারণ সভা অনুষ্ঠিত হবে। সকল সদস্যকে উপস্থিত থাকার জন্য অনুরোধ করা হলো।</p>
            </div>
          </div>

          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-white hover:shadow-sm transition-all group">
                <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden">
                  <img
                    src={`https://picsum.photos/seed/news-${i}/200/200`}
                    alt="News Thumbnail"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <div className="text-xs text-emerald-600 font-semibold mb-1 uppercase">নোটিশ</div>
                  <h4 className="font-bold text-emerald-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                    {i === 1 ? "শীতবস্ত্র বিতরণ কর্মসূচি" : i === 2 ? "নতুন সদস্য নিবন্ধন শুরু" : "ইফতার মাহফিল ২০২৪"}
                  </h4>
                  <p className="text-sm text-emerald-800/60 line-clamp-2 mt-1">
                    বিষ্ণুপুর ইউনিয়নের দুস্থ পরিবারের মাঝে শীতবস্ত্র বিতরণ করা হয়েছে।
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
