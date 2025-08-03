import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If user is authenticated, get the stored admin type
        const adminType = localStorage.getItem('adminType');
        setUser({ ...user, adminType });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (userId, adminType) => {
    // Store the admin type in localStorage
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('adminType', adminType);
    setUser({ ...auth.currentUser, adminType });
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // Clear any user-related data from localStorage
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('adminType');
      setUser(null);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}