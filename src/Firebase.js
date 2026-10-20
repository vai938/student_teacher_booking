// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase, ref } from "firebase/database";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyApWdvtqxKkxfkj83_7miUusMagZi9WMLE",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "student-teacher-manageme-c26b7.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "student-teacher-manageme-c26b7",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "student-teacher-manageme-c26b7.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "935350544353",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:935350544353:web:395738857cf6e7ab68d4a0",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-3S7HQJXTT1",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let storage = null;
try {
  storage = getStorage(app);
} catch (e) {
  console.warn("Storage not initialized:", e);
}

const db = getFirestore(app);
const auth = getAuth(app);

let rb = null;
let dbref = null;
try {
  rb = getDatabase(app);
  dbref = ref(rb, "server/saving-data/fireblog");
} catch (e) {
  // Realtime Database optional if not provisioned
}

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;

    // Safely attempt to create user record in Firestore if not existing
    try {
      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      const docs = await getDocs(q);
      if (docs.docs.length === 0) {
        await addDoc(collection(db, "users"), {
          uid: user.uid,
          name: user.displayName || user.email?.split("@")[0] || "User",
          authProvider: "google",
          email: user.email,
          createdAt: new Date(),
        });
      }
    } catch (firestoreErr) {
      console.warn("User profile sync to Firestore skipped:", firestoreErr.message);
    }

    return user;
  } catch (err) {
    console.error("Google sign-in error:", err);
    if (err.code !== "auth/popup-closed-by-user" && err.code !== "auth/cancelled-popup-request") {
      alert(err.message || "Failed to sign in with Google");
    }
  }
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    try {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name,
        authProvider: "local",
        email,
        createdAt: new Date(),
      });
    } catch (e) {
      console.warn("Firestore user record skipped:", e);
    }
    return user;
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logInWithEmailAndPassword1 = async (email, password) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const registerWithEmailAndPassword1 = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    try {
      await addDoc(collection(db, "teacher"), {
        uid: user.uid,
        name,
        authProvider: "local",
        email,
        createdAt: new Date(),
      });
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name,
        authProvider: "local",
        email,
        role: "teacher",
        createdAt: new Date(),
      });
    } catch (e) {
      console.warn("Firestore teacher record skipped:", e);
    }
    return user;
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const sendPasswordReset1 = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logInWithEmailAndPassword2 = async (email, password) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const registerWithEmailAndPassword2 = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    try {
      await addDoc(collection(db, "student"), {
        uid: user.uid,
        name,
        authProvider: "local",
        email,
        createdAt: new Date(),
      });
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name,
        authProvider: "local",
        email,
        role: "student",
        createdAt: new Date(),
      });
    } catch (e) {
      console.warn("Firestore student record skipped:", e);
    }
    return user;
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const sendPasswordReset2 = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  signOut(auth);
};

export {
  auth,
  db,
  rb,
  storage,
  dbref,
  signInWithGoogle,
  logInWithEmailAndPassword,
  signInWithEmailAndPassword,
  registerWithEmailAndPassword,
  logInWithEmailAndPassword1,
  registerWithEmailAndPassword1,
  logInWithEmailAndPassword2,
  registerWithEmailAndPassword2,
  sendPasswordReset,
  sendPasswordReset1,
  sendPasswordReset2,
  sendPasswordResetEmail,
  logout,
};
