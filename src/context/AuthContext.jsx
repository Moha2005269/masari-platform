import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAx3aoaz6c9JM2GNwTrWCwwYW07Mx24dyg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "masari-954c9.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "masari-954c9",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "masari-954c9.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "160015883227",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:160015883227:web:cf275474754a3f4023a5fe",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-C1W7ME4ZJ2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize or fetch user profile from Firestore
  const initProfile = async (firebaseUser, additionalData = {}) => {
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'masari-academic-decoder';
    const profileRef = doc(db, 'artifacts', appId, 'users', firebaseUser.uid);
    const snap = await getDoc(profileRef);

    if (!snap.exists()) {
      const newProfile = {
        id: firebaseUser.uid,
        name: additionalData.name || firebaseUser.displayName || firebaseUser.email.split('@')[0],
        avatarId: additionalData.avatarId || 'avatar_blobby',
        slogan: additionalData.slogan || 'Decoding academic milestones & professional trajectories',
        points: 50, // Initial signup points
        subscriptionTier: 'free',
        isLoggedIn: true,
        hasTakenTest: false
      };
      await setDoc(profileRef, newProfile);
      setUserProfile(newProfile);
    } else {
      setUserProfile({ ...snap.data(), id: firebaseUser.uid, isLoggedIn: true });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          await initProfile(currentUser);
        } catch (e) {
          console.error("Error fetching profile:", e);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUpWithEmail = async (email, password, displayName, avatarId, slogan) => {
    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await initProfile(userCred.user, { name: displayName, avatarId, slogan });
      return userCred;
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email, password) => {
    setLoading(true);
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      await initProfile(userCred.user);
      return userCred;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCred = await signInWithPopup(auth, provider);
      await initProfile(userCred.user);
      return userCred;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (updatedProfile) => {
    if (!user) return;
    try {
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'masari-academic-decoder';
      const profileRef = doc(db, 'artifacts', appId, 'users', user.uid);
      await setDoc(profileRef, updatedProfile, { merge: true });
      setUserProfile(updatedProfile);
    } catch (e) {
      console.error("Error saving profile to firestore: ", e);
      throw e;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      signUpWithEmail,
      loginWithEmail,
      loginWithGoogle,
      logout,
      saveProfile,
      db, // Export db for App.jsx to use for saved reports
      auth
    }}>
      {children}
    </AuthContext.Provider>
  );
};
