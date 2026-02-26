import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { auth, db, storage } from "@/src/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { 
  doc, 
  getDoc, 
  collection, 
  getDocs, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  updateDoc,
  query,
  orderBy
} from "firebase/firestore";
import { 
  LayoutDashboard, 
  Users, 
  Newspaper, 
  Settings, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type Tab = "dashboard" | "news" | "committee" | "settings";

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const navigate = useNavigate();

  // Data states
  const [news, setNews] = useState<any[]>([]);
  const [committee, setCommittee] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>(null);

  // Form states
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (file: File, path: string) => {
    setUploading(true);
    try {
      const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      // Check for dedicated admin login first
      const isDedicatedAdmin = localStorage.getItem("isAdminAuthenticated") === "true";
      
      if (isDedicatedAdmin) {
        setIsAdmin(true);
        fetchData();
        setLoading(false);
        return;
      }

      // Fallback to Firebase Auth check
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          const docRef = doc(db, "members", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().role === "admin") {
            setIsAdmin(true);
            fetchData();
          } else {
            setIsAdmin(false);
            navigate("/admin-login");
          }
        } else {
          setIsAdmin(false);
          navigate("/admin-login");
        }
        setLoading(false);
      });
      return unsubscribe;
    };

    const unsubscribePromise = checkAuth();
    return () => {
      unsubscribePromise.then(unsub => unsub && typeof unsub === 'function' && unsub());
    };
  }, [navigate]);

  const fetchData = async () => {
    try {
      // Fetch News
      const newsSnap = await getDocs(query(collection(db, "news"), orderBy("date", "desc")));
      setNews(newsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Fetch Committee
      const committeeSnap = await getDocs(query(collection(db, "committee"), orderBy("orderIndex", "asc")));
      setCommittee(committeeSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Fetch Site Settings
      const settingsSnap = await getDoc(doc(db, "settings", "site"));
      if (settingsSnap.exists()) {
        setSiteSettings(settingsSnap.data());
      } else {
        // Default settings if none exist
        const defaultSettings = {
          heroTitle: "ঐক্যবদ্ধ বিষ্ণুপুর, সমৃদ্ধ ভবিষ্যৎ",
          heroSubtitle: "ঢাকায়স্থ বিষ্ণুপুর ইউনিয়ন সোসাইটি একটি অরাজনৈতিক ও সামাজিক সংগঠন। আমরা আমাদের ইউনিয়নের মানুষের কল্যাণে এবং ভ্রাতৃত্বের বন্ধন সুদৃঢ় করতে কাজ করে যাচ্ছি।",
          heroImage: "https://picsum.photos/seed/society-hero/1920/1080?blur=2",
          missionTitle: "আমাদের লক্ষ্য ও উদ্দেশ্য",
          missionDesc: "বিষ্ণুপুর ইউনিয়নের মানুষের আর্থ-সামাজিক উন্নয়ন এবং শিক্ষার প্রসারে কাজ করা আমাদের প্রধান লক্ষ্য।",
          statsMembers: "৫০০+",
          statsEvents: "২০+",
          statsProjects: "৫০+",
          statsYears: "১০+"
        };
        await setDoc(doc(db, "settings", "site"), defaultSettings);
        setSiteSettings(defaultSettings);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setDoc(doc(db, "settings", "site"), siteSettings);
      setMessage({ type: "success", text: "সাইট সেটিংস সফলভাবে আপডেট করা হয়েছে!" });
    } catch (err) {
      setMessage({ type: "error", text: "আপডেট করতে সমস্যা হয়েছে" });
    } finally {
      setLoading(false);
    }
  };

  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const imageFile = (form.elements.namedItem("imageFile") as HTMLInputElement).files?.[0];
    
    try {
      let imageUrl = formData.get("imageUrl") as string;
      if (imageFile) {
        imageUrl = await handleFileUpload(imageFile, "news");
      }

      const data = {
        title: formData.get("title"),
        content: formData.get("content"),
        imageUrl,
        date: new Date().toISOString()
      };

      await addDoc(collection(db, "news"), data);
      setMessage({ type: "success", text: "নিউজ সফলভাবে যুক্ত করা হয়েছে!" });
      setIsAdding(false);
      fetchData();
    } catch (err) {
      console.error("Error adding news:", err);
      setMessage({ type: "error", text: "যোগ করতে সমস্যা হয়েছে" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এটি ডিলিট করতে চান?")) return;
    try {
      await deleteDoc(doc(db, "news", id));
      setMessage({ type: "success", text: "নিউজ ডিলিট করা হয়েছে" });
      fetchData();
    } catch (err) {
      setMessage({ type: "error", text: "ডিলিট করতে সমস্যা হয়েছে" });
    }
  };

  const handleAddCommittee = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const imageFile = (form.elements.namedItem("imageFile") as HTMLInputElement).files?.[0];

    try {
      let imageUrl = formData.get("imageUrl") as string;
      if (imageFile) {
        imageUrl = await handleFileUpload(imageFile, "committee");
      }

      const data = {
        name: formData.get("name"),
        designation: formData.get("designation"),
        imageUrl,
        orderIndex: parseInt(formData.get("orderIndex") as string) || 0
      };

      await addDoc(collection(db, "committee"), data);
      setMessage({ type: "success", text: "সদস্য সফলভাবে যুক্ত করা হয়েছে!" });
      setIsAdding(false);
      fetchData();
    } catch (err) {
      console.error("Error adding committee member:", err);
      setMessage({ type: "error", text: "যোগ করতে সমস্যা হয়েছে" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCommittee = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এটি ডিলিট করতে চান?")) return;
    try {
      await deleteDoc(doc(db, "committee", id));
      setMessage({ type: "success", text: "সদস্য ডিলিট করা হয়েছে" });
      fetchData();
    } catch (err) {
      setMessage({ type: "error", text: "ডিলিট করতে সমস্যা হয়েছে" });
    }
  };

  const handleUpdateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const imageFile = (form.elements.namedItem("imageFile") as HTMLInputElement).files?.[0];
    
    try {
      let imageUrl = editingItem.imageUrl;
      if (imageFile) {
        imageUrl = await handleFileUpload(imageFile, "news");
      } else if (formData.get("imageUrl")) {
        imageUrl = formData.get("imageUrl") as string;
      }

      const data = {
        title: formData.get("title"),
        content: formData.get("content"),
        imageUrl,
        date: editingItem.date || new Date().toISOString()
      };

      await updateDoc(doc(db, "news", editingItem.id), data);
      setMessage({ type: "success", text: "নিউজ সফলভাবে আপডেট করা হয়েছে!" });
      setEditingItem(null);
      setIsEditing(false);
      fetchData();
    } catch (err) {
      console.error("Error updating news:", err);
      setMessage({ type: "error", text: "আপডেট করতে সমস্যা হয়েছে" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCommittee = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const imageFile = (form.elements.namedItem("imageFile") as HTMLInputElement).files?.[0];

    try {
      let imageUrl = editingItem.imageUrl;
      if (imageFile) {
        imageUrl = await handleFileUpload(imageFile, "committee");
      } else if (formData.get("imageUrl")) {
        imageUrl = formData.get("imageUrl") as string;
      }

      const data = {
        name: formData.get("name"),
        designation: formData.get("designation"),
        imageUrl,
        orderIndex: parseInt(formData.get("orderIndex") as string) || 0
      };

      await updateDoc(doc(db, "committee", editingItem.id), data);
      setMessage({ type: "success", text: "সদস্য সফলভাবে আপডেট করা হয়েছে!" });
      setEditingItem(null);
      setIsEditing(false);
      fetchData();
    } catch (err) {
      console.error("Error updating committee member:", err);
      setMessage({ type: "error", text: "আপডেট করতে সমস্যা হয়েছে" });
    } finally {
      setLoading(false);
    }
  };
  const handleAdminLogout = () => {
    localStorage.removeItem("isAdminAuthenticated");
    navigate("/admin-login");
  };

  if (loading && isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-12 h-12 text-emerald-900 animate-spin" />
      </div>
    );
  }

  if (isAdmin === false) return null;

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-emerald-950 text-white flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-emerald-900">
          <h1 className="text-xl font-bold text-amber-400">এডমিন প্যানেল</h1>
          <p className="text-xs text-emerald-400 mt-1 uppercase tracking-widest">বিষ্ণুপুর সোসাইটি</p>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${activeTab === "dashboard" ? "bg-emerald-800 text-amber-400" : "hover:bg-emerald-900/50 text-emerald-100"}`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            ড্যাশবোর্ড
          </button>
          <button 
            onClick={() => setActiveTab("news")}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${activeTab === "news" ? "bg-emerald-800 text-amber-400" : "hover:bg-emerald-900/50 text-emerald-100"}`}
          >
            <Newspaper className="w-5 h-5 mr-3" />
            নিউজ ম্যানেজমেন্ট
          </button>
          <button 
            onClick={() => setActiveTab("committee")}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${activeTab === "committee" ? "bg-emerald-800 text-amber-400" : "hover:bg-emerald-900/50 text-emerald-100"}`}
          >
            <Users className="w-5 h-5 mr-3" />
            কমিটি ম্যানেজমেন্ট
          </button>
          <button 
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${activeTab === "settings" ? "bg-emerald-800 text-amber-400" : "hover:bg-emerald-900/50 text-emerald-100"}`}
          >
            <Settings className="w-5 h-5 mr-3" />
            সাইট সেটিংস
          </button>
        </nav>
        <div className="p-4 border-t border-emerald-900">
          <div className="flex items-center p-3 bg-emerald-900/30 rounded-xl">
            <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-emerald-950 font-bold text-xs mr-3">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user?.displayName || "এডমিন"}</p>
              <p className="text-[10px] text-emerald-400 truncate">{user?.email || "Dedicated Session"}</p>
            </div>
          </div>
          <button 
            onClick={handleAdminLogout}
            className="w-full mt-4 py-2 bg-red-500/20 text-red-200 text-xs font-bold rounded-xl hover:bg-red-500 hover:text-white transition-all"
          >
            লগআউট
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-10 overflow-y-auto">
        <AnimatePresence mode="wait">
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-8 p-4 rounded-2xl flex items-center text-sm font-medium ${
                message.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
              }`}
            >
              {message.type === "success" ? <CheckCircle2 className="w-5 h-5 mr-3" /> : <AlertCircle className="w-5 h-5 mr-3" />}
              {message.text}
              <button onClick={() => setMessage(null)} className="ml-auto hover:opacity-50"><X className="w-4 h-4" /></button>
            </motion.div>
          )}
        </AnimatePresence>

        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-emerald-900">ড্যাশবোর্ড ওভারভিউ</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-emerald-100">
                <div className="text-emerald-400 mb-4"><Newspaper className="w-10 h-10" /></div>
                <div className="text-3xl font-bold text-emerald-900">{news.length}</div>
                <div className="text-sm text-emerald-600 uppercase tracking-widest font-bold mt-1">মোট নিউজ</div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-emerald-100">
                <div className="text-emerald-400 mb-4"><Users className="w-10 h-10" /></div>
                <div className="text-3xl font-bold text-emerald-900">{committee.length}</div>
                <div className="text-sm text-emerald-600 uppercase tracking-widest font-bold mt-1">কমিটি সদস্য</div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-emerald-100">
                <div className="text-emerald-400 mb-4"><Settings className="w-10 h-10" /></div>
                <div className="text-3xl font-bold text-emerald-900">সক্রিয়</div>
                <div className="text-sm text-emerald-600 uppercase tracking-widest font-bold mt-1">সাইট স্ট্যাটাস</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "news" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-emerald-900">নিউজ ম্যানেজমেন্ট</h2>
              <button 
                onClick={() => setIsAdding(true)}
                className="bg-emerald-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center hover:bg-emerald-800 transition-all"
              >
                <Plus className="w-5 h-5 mr-2" />
                নতুন নিউজ
              </button>
            </div>

            {(isAdding || isEditing) && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-emerald-100"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-emerald-900">
                    {isEditing ? "নিউজ এডিট করুন" : "নতুন নিউজ যোগ করুন"}
                  </h3>
                  <button onClick={() => { setIsAdding(false); setIsEditing(false); setEditingItem(null); }}>
                    <X className="w-6 h-6 text-emerald-400" />
                  </button>
                </div>
                <form onSubmit={isEditing ? handleUpdateNews : handleAddNews} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2">শিরোনাম</label>
                    <input 
                      name="title" 
                      required 
                      defaultValue={editingItem?.title || ""}
                      className="w-full px-6 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2">বিস্তারিত বর্ণনা</label>
                    <textarea 
                      name="content" 
                      required 
                      rows={4} 
                      defaultValue={editingItem?.content || ""}
                      className="w-full px-6 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2">ছবি আপলোড করুন</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="file" 
                        name="imageFile" 
                        accept="image/*"
                        className="flex-grow px-6 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-900 file:text-white hover:file:bg-emerald-800" 
                      />
                      <span className="text-xs text-emerald-400">অথবা</span>
                      <input 
                        name="imageUrl" 
                        defaultValue={editingItem?.imageUrl || ""}
                        className="flex-grow px-6 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500" 
                        placeholder="ছবির লিঙ্ক (URL)" 
                      />
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="w-full py-4 bg-emerald-900 text-white font-bold rounded-2xl hover:bg-emerald-800 transition-all">
                    {loading ? "অপেক্ষা করুন..." : (isEditing ? "আপডেট করুন" : "নিউজ পাবলিশ করুন")}
                  </button>
                </form>
              </motion.div>
            )}

            <div className="grid grid-cols-1 gap-4">
              {news.map(item => (
                <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-100 flex items-center gap-6">
                  <img src={item.imageUrl} className="w-24 h-24 rounded-2xl object-cover" />
                  <div className="flex-grow">
                    <h4 className="font-bold text-emerald-900 text-lg">{item.title}</h4>
                    <p className="text-sm text-emerald-600 line-clamp-1">{item.content}</p>
                    <p className="text-[10px] text-emerald-400 mt-2 uppercase font-bold">{new Date(item.date).toLocaleDateString("bn-BD")}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setEditingItem(item);
                        setIsEditing(true);
                        setIsAdding(false);
                      }}
                      className="p-3 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-900 hover:text-white transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteNews(item.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "committee" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-emerald-900">কমিটি ম্যানেজমেন্ট</h2>
              <button 
                onClick={() => setIsAdding(true)}
                className="bg-emerald-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center hover:bg-emerald-800 transition-all"
              >
                <Plus className="w-5 h-5 mr-2" />
                নতুন সদস্য
              </button>
            </div>

            {(isAdding || isEditing) && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-emerald-100"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-emerald-900">
                    {isEditing ? "সদস্য তথ্য এডিট করুন" : "নতুন সদস্য যোগ করুন"}
                  </h3>
                  <button onClick={() => { setIsAdding(false); setIsEditing(false); setEditingItem(null); }}>
                    <X className="w-6 h-6 text-emerald-400" />
                  </button>
                </div>
                <form onSubmit={isEditing ? handleUpdateCommittee : handleAddCommittee} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2">নাম</label>
                      <input 
                        name="name" 
                        required 
                        defaultValue={editingItem?.name || ""}
                        className="w-full px-6 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2">পদবী</label>
                      <input 
                        name="designation" 
                        required 
                        defaultValue={editingItem?.designation || ""}
                        className="w-full px-6 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2">ছবি আপলোড করুন</label>
                      <div className="flex items-center gap-4">
                        <input 
                          type="file" 
                          name="imageFile" 
                          accept="image/*"
                          className="flex-grow px-6 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-900 file:text-white hover:file:bg-emerald-800" 
                        />
                        <span className="text-xs text-emerald-400">অথবা</span>
                        <input 
                          name="imageUrl" 
                          defaultValue={editingItem?.imageUrl || ""}
                          className="flex-grow px-6 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500" 
                          placeholder="ছবির লিঙ্ক (URL)" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2">ক্রমিক নম্বর (Sorting)</label>
                      <input 
                        name="orderIndex" 
                        type="number" 
                        required 
                        defaultValue={editingItem?.orderIndex || ""}
                        className="w-full px-6 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500" 
                        placeholder="1, 2, 3..." 
                      />
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="w-full py-4 bg-emerald-900 text-white font-bold rounded-2xl hover:bg-emerald-800 transition-all">
                    {loading ? "অপেক্ষা করুন..." : (isEditing ? "আপডেট করুন" : "সদস্য যোগ করুন")}
                  </button>
                </form>
              </motion.div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {committee.map(member => (
                <div key={member.id} className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-100 flex flex-col items-center text-center">
                  <img src={member.imageUrl} className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-emerald-50" />
                  <h4 className="font-bold text-emerald-900 text-lg">{member.name}</h4>
                  <p className="text-sm text-amber-600 font-bold uppercase tracking-widest">{member.designation}</p>
                  <div className="flex gap-2 mt-6 w-full">
                    <button 
                      onClick={() => {
                        setEditingItem(member);
                        setIsEditing(true);
                        setIsAdding(false);
                      }}
                      className="flex-grow py-3 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-900 hover:text-white transition-all flex items-center justify-center"
                    >
                      <Edit2 className="w-4 h-4 mr-2" /> এডিট
                    </button>
                    <button onClick={() => handleDeleteCommittee(member.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "settings" && siteSettings && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-emerald-900">সাইট সেটিংস</h2>
            <form onSubmit={handleSaveSettings} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-emerald-100 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-emerald-900 border-b pb-2">সাধারণ সেটিংস</h3>
                  <div>
                    <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2">লোগো আপলোড</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await handleFileUpload(file, "settings");
                            setSiteSettings({...siteSettings, logoUrl: url});
                          }
                        }}
                        className="flex-grow px-6 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-900 file:text-white hover:file:bg-emerald-800" 
                      />
                      {siteSettings.logoUrl && <img src={siteSettings.logoUrl} className="w-12 h-12 object-contain" />}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-emerald-900 border-b pb-2">হিরো সেকশন</h3>
                  <div>
                    <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2">হিরো টাইটেল</label>
                    <input 
                      value={siteSettings.heroTitle} 
                      onChange={e => setSiteSettings({...siteSettings, heroTitle: e.target.value})}
                      className="w-full px-6 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2">হিরো সাবটাইটেল</label>
                    <textarea 
                      value={siteSettings.heroSubtitle} 
                      onChange={e => setSiteSettings({...siteSettings, heroSubtitle: e.target.value})}
                      rows={3}
                      className="w-full px-6 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2">হিরো ইমেজ আপলোড</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await handleFileUpload(file, "settings");
                            setSiteSettings({...siteSettings, heroImage: url});
                          }
                        }}
                        className="flex-grow px-6 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-900 file:text-white hover:file:bg-emerald-800" 
                      />
                      <input 
                        value={siteSettings.heroImage} 
                        onChange={e => setSiteSettings({...siteSettings, heroImage: e.target.value})}
                        className="flex-grow px-6 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500" 
                        placeholder="অথবা ইমেজ URL"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-emerald-900 border-b pb-2">লক্ষ্য ও উদ্দেশ্য</h3>
                  <div>
                    <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2">টাইটেল</label>
                    <input 
                      value={siteSettings.missionTitle} 
                      onChange={e => setSiteSettings({...siteSettings, missionTitle: e.target.value})}
                      className="w-full px-6 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2">বর্ণনা</label>
                    <textarea 
                      value={siteSettings.missionDesc} 
                      onChange={e => setSiteSettings({...siteSettings, missionDesc: e.target.value})}
                      rows={3}
                      className="w-full px-6 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-bold text-emerald-900 border-b pb-2">পরিসংখ্যান (Stats)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2">সদস্য সংখ্যা</label>
                    <input 
                      value={siteSettings.statsMembers} 
                      onChange={e => setSiteSettings({...siteSettings, statsMembers: e.target.value})}
                      className="w-full px-6 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2">ইভেন্ট সংখ্যা</label>
                    <input 
                      value={siteSettings.statsEvents} 
                      onChange={e => setSiteSettings({...siteSettings, statsEvents: e.target.value})}
                      className="w-full px-6 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2">প্রজেক্ট সংখ্যা</label>
                    <input 
                      value={siteSettings.statsProjects} 
                      onChange={e => setSiteSettings({...siteSettings, statsProjects: e.target.value})}
                      className="w-full px-6 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2">পথচলা (বছর)</label>
                    <input 
                      value={siteSettings.statsYears} 
                      onChange={e => setSiteSettings({...siteSettings, statsYears: e.target.value})}
                      className="w-full px-6 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500" 
                    />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full py-5 bg-emerald-900 text-white font-bold rounded-2xl hover:bg-emerald-800 transition-all flex items-center justify-center shadow-lg shadow-emerald-900/20">
                {loading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : <Save className="w-6 h-6 mr-2" />}
                সব পরিবর্তন সেভ করুন
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
