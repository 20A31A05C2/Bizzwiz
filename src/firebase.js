import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDO6-EMn6PqZf4G3BGwhgroUx_XLFD12Ls",
  authDomain: "bizzwiz-6272b.firebaseapp.com",
  projectId: "bizzwiz-6272b",
  storageBucket: "bizzwiz-6272b.firebasestorage.app",
  messagingSenderId: "490512488548",
  appId: "1:490512488548:web:8828cca5ca595c3ab2a771"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup };
