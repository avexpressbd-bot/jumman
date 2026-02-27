import { useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { db } from "./lib/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Committee from "./pages/Committee";
import News from "./pages/News";
import MemberArea from "./pages/MemberArea";
import Donation from "./pages/Donation";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import AdhocCommittee from "./pages/AdhocCommittee";
import IftarRegistration from "./pages/IftarRegistration";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="committee" element={<Committee />} />
          <Route path="adhoc-committee" element={<AdhocCommittee />} />
          <Route path="iftar-registration" element={<IftarRegistration />} />
          <Route path="news" element={<News />} />
          <Route path="member-area" element={<MemberArea />} />
          <Route path="donation" element={<Donation />} />
          <Route path="contact" element={<Contact />} />
          <Route path="admin" element={<Admin />} />
          <Route path="admin-login" element={<AdminLogin />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
