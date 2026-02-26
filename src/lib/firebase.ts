import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDTFr1j_djURPrRTd5ne0mJDhIC4rgByis",
  authDomain: "bishnupur-union-society.firebaseapp.com",
  projectId: "bishnupur-union-society",
  storageBucket: "bishnupur-union-society.firebasestorage.app",
  messagingSenderId: "15489598101",
  appId: "1:15489598101:web:46c32211daa253352c519c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
