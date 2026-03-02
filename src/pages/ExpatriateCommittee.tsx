import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { User, Mail, Phone, Loader2, Globe } from "lucide-react";
import { db } from "@/src/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

interface CommitteeMember {
  id: string;
  name: string;
  designation: string;
  imageUrl: string;
  country?: string;
}

export default function ExpatriateCommittee() {
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(query(collection(db, "expatriate_committee"), orderBy("orderIndex", "asc")));
        setMembers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CommitteeMember)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="py-20 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 relative">
          <h1 className="text-4xl font-bold text-emerald-900 mb-4">প্রবাসী কমিটি</h1>
          <p className="text-emerald-800/60 max-w-2xl mx-auto">
            বিষ্ণুপুর ইউনিয়নের প্রবাসী ভাই-বোনদের নিয়ে গঠিত কমিটি যারা বিদেশ থেকেও ইউনিয়নের উন্নয়নে অবদান রাখছেন।
          </p>
          <div className="w-24 h-1 bg-amber-400 mx-auto rounded-full mt-6" />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-emerald-900 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {members.length > 0 ? members.map((member, idx) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-emerald-100 group"
              >
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {member.country && (
                    <div className="absolute top-4 right-4 bg-amber-400 text-emerald-950 px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-lg">
                      <Globe className="w-3 h-3 mr-1" />
                      {member.country}
                    </div>
                  )}
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
            )) : (
              <div className="col-span-full text-center py-20 bg-white rounded-[3rem] border border-dashed border-emerald-200">
                <p className="text-emerald-800/40 italic">বর্তমানে কোনো সদস্য তালিকাভুক্ত নেই।</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
