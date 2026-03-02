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
  phone?: string;
  ward?: string;
}

const STATIC_MEMBERS: CommitteeMember[] = [
  {
    id: "exp-1",
    name: "সাবের হোসেন চৌধুরী (বাবু)",
    designation: "আহ্বায়ক",
    country: "আমেরিকা",
    ward: "৩ নং",
    phone: "+1(917) 4421069",
    imageUrl: "https://picsum.photos/seed/exp1/400/400"
  },
  {
    id: "exp-2",
    name: "সাওার হোসেন",
    designation: "সিনিয়র যুগ্ন আহ্বায়ক",
    country: "দুবাই",
    ward: "৮ নং",
    imageUrl: "https://picsum.photos/seed/exp2/400/400"
  },
  {
    id: "exp-3",
    name: "সাইফুল ইসলাম মাল",
    designation: "যুগ্ন আহ্বায়ক",
    country: "ইতালি",
    ward: "১নং",
    imageUrl: "https://picsum.photos/seed/exp3/400/400"
  },
  {
    id: "exp-4",
    name: "মো: সুমন পাটোয়ারী",
    designation: "যুগ্ন আহ্বায়ক",
    country: "সৌদিআরব",
    ward: "৪ নং",
    imageUrl: "https://picsum.photos/seed/exp4/400/400"
  },
  {
    id: "exp-5",
    name: "রাকিব ভুইয়া",
    designation: "যুগ্ন আহ্বায়ক",
    country: "কাতার",
    ward: "৯নং",
    imageUrl: "https://picsum.photos/seed/exp5/400/400"
  },
  {
    id: "exp-6",
    name: "মো: মাসুদ গাজী",
    designation: "সদস্য সচিব",
    country: "সৌদিআরব",
    ward: "৪নং",
    imageUrl: "https://picsum.photos/seed/exp6/400/400"
  },
  {
    id: "exp-7",
    name: "রিয়াদ হোসেন আপন",
    designation: "সিনিয়র সদস্য সচিব",
    country: "সৌদিআরব",
    ward: "৩ নং",
    imageUrl: "https://picsum.photos/seed/exp7/400/400"
  },
  {
    id: "exp-8",
    name: "জিএম সোহাগ",
    designation: "সদস্য",
    ward: "৯ নং",
    imageUrl: "https://picsum.photos/seed/exp8/400/400"
  },
  {
    id: "exp-9",
    name: "সাইফুল ইসলাম",
    designation: "সদস্য",
    country: "সৌদিআরব",
    ward: "১ নং",
    imageUrl: "https://picsum.photos/seed/exp9/400/400"
  },
  {
    id: "exp-10",
    name: "মো:মামুন বেপারী",
    designation: "সদস্য",
    country: "কুয়েত",
    ward: "১ নং",
    imageUrl: "https://picsum.photos/seed/exp10/400/400"
  },
  {
    id: "exp-11",
    name: "নেয়ামত উল্লাহ",
    designation: "সদস্য",
    country: "সৌদিআরব",
    ward: "৬ নং",
    imageUrl: "https://picsum.photos/seed/exp11/400/400"
  }
];

export default function ExpatriateCommittee() {
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(query(collection(db, "expatriate_committee"), orderBy("orderIndex", "asc")));
        const dbMembers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CommitteeMember));
        
        // Combine DB members with static members, avoiding duplicates if any (by name)
        const combined = [...dbMembers];
        STATIC_MEMBERS.forEach(staticMember => {
          if (!dbMembers.some(m => m.name === staticMember.name)) {
            combined.push(staticMember);
          }
        });
        
        setMembers(combined);
      } catch (err) {
        console.error(err);
        // If DB fails, at least show static members
        setMembers(STATIC_MEMBERS);
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
          
          {localStorage.getItem("isAdminAuthenticated") === "true" && (
            <div className="mt-8 flex justify-center">
              <a 
                href="#/admin" 
                className="flex items-center gap-2 px-6 py-3 bg-emerald-900 text-white font-bold rounded-2xl hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/20"
              >
                <Globe className="w-5 h-5" />
                কমিটি এডিট করুন
              </a>
            </div>
          )}
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
                  <p className="text-amber-600 font-semibold text-sm uppercase tracking-wider mb-1">
                    {member.designation}
                  </p>
                  {member.ward && (
                    <p className="text-emerald-700/60 text-xs mb-4">ওয়ার্ড: {member.ward}</p>
                  )}
                  <div className="flex justify-center space-x-3 pt-4 border-t border-emerald-50">
                    {member.phone ? (
                      <a 
                        href={`tel:${member.phone}`}
                        className="p-2 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-900 hover:text-white transition-all"
                        title={member.phone}
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    ) : (
                      <button className="p-2 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-900 hover:text-white transition-all">
                        <Phone className="w-4 h-4" />
                      </button>
                    )}
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
