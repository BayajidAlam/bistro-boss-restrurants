import { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { app } from "../firebase/firebase.config";
import { GoogleAuthProvider } from "firebase/auth";
import axios from "axios";

// creating auth
export const AuthContext = createContext(null);
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  // providers
  const googleProvider = new GoogleAuthProvider();

  // states
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // functions
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOutUser = () => {
    setLoading(true);
    return signOut(auth);
  };

  const updateUserProfile = (name, photo) => {
    setLoading(true);
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };

  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        axios
          .post("http://localhost:5000/jwt", {
            email: currentUser?.email,
          })
          .then((data) => {
            console.log(currentUser,'currentUser');
            localStorage.setItem("access-token", data.data.token);
          })
          .catch((error) => {
            console.error("Axios request failed:", error);
          });
      } else {
        localStorage.removeItem("access-token");
      }

      setLoading(false);
    });

    return () => {
      return unsubscribe();
    };
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    logInUser,
    logOutUser,
    updateUserProfile,
    signInWithGoogle,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
