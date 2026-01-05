"use client";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";
import { ShieldCheck, LogOut } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed w-full z-50 nav-blur px-6 md:px-16 py-6 flex justify-between items-center transition-all duration-500">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-[#C8A165] rounded-full flex items-center justify-center text-[#0F2C23] font-black text-xs shadow-lg shadow-black/20">DK</div>
        <h2 className="font-luxury italic text-xl md:text-2xl tracking-tighter text-white">Daur Kita<span className="text-[#C8A165]">.</span></h2>
      </div>
      
      <div className="hidden md:flex items-center gap-8">
        <Link href="/dashboard" className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/40 hover:text-[#C8A165] transition-all">
          Beranda
        </Link>
        <Link href="/dashboard/edukasi" className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/40 hover:text-[#C8A165] transition-all">
          Edukasi
        </Link>
        
        {/* Status Residence */}
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2 rounded-full">
          <ShieldCheck size={14} className="text-[#C8A165]" />
          <span className="text-[9px] font-black text-[#C8A165] uppercase tracking-widest">
            {user?.token || "GUEST"} RESIDENCE
          </span>
        </div>

        {/* Tombol Logout */}
        <button 
          onClick={logout} 
          className="text-white/40 hover:text-red-400 transition-colors"
          title="Keluar"
        >
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
}