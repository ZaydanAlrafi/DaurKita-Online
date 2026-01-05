"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Data user (complex_token)
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fungsi Login
  const login = async (tokenInput) => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "complexes"), 
        where("token", "==", tokenInput.toUpperCase())
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const userData = { 
            token: tokenInput.toUpperCase(), 
            role: "RESIDENT" // Nanti bisa ditambah logic untuk ADMIN
        };
        localStorage.setItem("complexToken", userData.token);
        setUser(userData);
        router.push("/dashboard");
        return { success: true };
      } else {
        return { success: false, message: "Token residence tidak ditemukan." };
      }
    } catch (error) {
      console.error("Login Error:", error);
      return { success: false, message: "Terjadi kesalahan sistem." };
    } finally {
      setLoading(false);
    }
  };

  // Fungsi Logout
  const logout = () => {
    localStorage.removeItem("complexToken");
    setUser(null);
    router.push("/");
  };

  // Cek sesi saat aplikasi pertama kali dibuka
  useEffect(() => {
    const checkSession = async () => {
      const storedToken = localStorage.getItem("complexToken");
      if (storedToken) {
        // Validasi ulang ke DB (Opsional: bisa di-skip agar lebih cepat, tapi ini lebih aman)
        const q = query(collection(db, "complexes"), where("token", "==", storedToken));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
            setUser({ token: storedToken, role: "RESIDENT" });
        } else {
            localStorage.removeItem("complexToken");
        }
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);