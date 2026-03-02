import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { db } from "@/src/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { Radio, X } from "lucide-react";

export default function LiveNewsTicker() {
  const [news, setNews] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchLiveNews = async () => {
      try {
        const q = query(
          collection(db, "live_news")
        );
        const snap = await getDocs(q);
        const allNews = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
        const activeNews = allNews
          .filter((n: any) => n.isActive === true)
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setNews(activeNews);
      } catch (err) {
        console.error("Error fetching live news:", err);
      }
    };
    fetchLiveNews();
  }, []);

  useEffect(() => {
    if (news.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % news.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [news]);

  if (!isVisible || news.length === 0) return null;

  const currentNews = news[currentIndex];

  return (
    <div className={`relative w-full overflow-hidden transition-all duration-500 ${currentNews?.priority === 'high' ? 'bg-red-600' : 'bg-emerald-900'} text-white py-2 px-4 shadow-lg z-[60]`}>
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        <div className="flex items-center gap-2 shrink-0 bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
          <Radio className={`w-3 h-3 ${currentNews?.priority === 'high' ? 'animate-pulse' : ''}`} />
          লাইভ নিউজ
        </div>
        
        <div className="flex-grow relative h-6 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentNews.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="absolute inset-0 text-sm font-medium truncate md:whitespace-normal"
            >
              {currentNews.content}
            </motion.p>
          </AnimatePresence>
        </div>

        <button 
          onClick={() => setIsVisible(false)}
          className="shrink-0 p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
