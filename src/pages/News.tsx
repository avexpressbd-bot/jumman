import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Calendar, ArrowRight, Bell } from "lucide-react";
import { Link } from "react-router-dom";

interface NewsItem {
  id: number;
  title: string;
  content: string;
  image_url: string;
  date: string;
}

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => {
        setNews(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="py-20 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-bold mb-6">
              <Bell className="w-4 h-4 mr-2" />
              নোটিশ বোর্ড
            </div>
            <h1 className="text-4xl font-bold text-emerald-900 mb-4">নিউজ ও ইভেন্ট</h1>
            <p className="text-emerald-800/60">
              সংগঠনের সাম্প্রতিক কর্মকাণ্ড, আগামী ইভেন্ট এবং গুরুত্বপূর্ণ নোটিশগুলো এখানে পাবেন।
            </p>
          </div>
          <div className="w-24 h-1 bg-amber-400 rounded-full" />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-900" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {news.map((item, idx) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-emerald-100 group flex flex-col h-full"
              >
                <div className="aspect-video overflow-hidden relative">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-emerald-900 flex items-center">
                    <Calendar className="w-3 h-3 mr-1.5" />
                    {new Date(item.date).toLocaleDateString("bn-BD")}
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-emerald-900 mb-4 group-hover:text-emerald-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-emerald-800/60 leading-relaxed mb-8 line-clamp-3">
                    {item.content}
                  </p>
                  <div className="mt-auto pt-6 border-t border-emerald-50">
                    <button className="text-emerald-700 font-bold flex items-center group/btn hover:text-amber-600 transition-colors">
                      বিস্তারিত পড়ুন
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
