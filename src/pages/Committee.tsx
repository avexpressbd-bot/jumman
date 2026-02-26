import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { User, Mail, Phone } from "lucide-react";

interface CommitteeMember {
  id: number;
  name: string;
  designation: string;
  image_url: string;
}

export default function Committee() {
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/committee")
      .then((res) => res.json())
      .then((data) => {
        setMembers(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="py-20 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-emerald-900 mb-4">কার্যনির্বাহী কমিটি</h1>
          <p className="text-emerald-800/60 max-w-2xl mx-auto">
            আমাদের সংগঠনের সুযোগ্য নেতৃবৃন্দ যারা নিরলসভাবে সংগঠনের উন্নয়নে কাজ করে যাচ্ছেন।
          </p>
          <div className="w-24 h-1 bg-amber-400 mx-auto rounded-full mt-6" />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-900" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {members.map((member, idx) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-emerald-100 group"
              >
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={member.image_url}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-emerald-900 mb-1">{member.name}</h3>
                  <p className="text-amber-600 font-semibold text-sm uppercase tracking-wider mb-4">
                    {member.designation}
                  </p>
                  <div className="flex justify-center space-x-3 pt-4 border-t border-emerald-50">
                    <button className="p-2 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-900 hover:text-white transition-all">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-900 hover:text-white transition-all">
                      <Mail className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-900 hover:text-white transition-all">
                      <User className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
