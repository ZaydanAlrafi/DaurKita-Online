"use client";
import { TreePine, LogOut } from "lucide-react";

export default function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("complexToken");
    window.location.href = "/";
  };

  return (
    <nav className="fixed top-0 w-full z-50 p-4">
      <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-3 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-2">
          <TreePine className="text-emerald-400 w-6 h-6" />
          <span className="font-bold text-white tracking-tight">DAUR KITA</span>
        </div>
        <button onClick={handleLogout} className="text-white/70 hover:text-red-400 flex items-center gap-2 text-sm font-medium">
          Keluar <LogOut className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
}