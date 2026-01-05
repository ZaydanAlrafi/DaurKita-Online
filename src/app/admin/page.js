"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Loader2, ShieldCheck, ArrowRight, Lock, Mail, Leaf } from "lucide-react";
import Link from "next/link";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin/dashboard");
    } catch (err) {
      setError("Kredensial tidak valid. Akses ditolak.");
      setLoading(false);
    }
  };

  return (
    // Background utama menggunakan warna #05110e yang sama persis dengan dashboard
    <div className="min-h-screen flex bg-[#05110e] font-sans text-white overflow-hidden relative">
      
      {/* Tambahan Tekstur Halus agar tidak flat */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none"></div>

      {/* --- BAGIAN KIRI: VISUAL TEMA ALAM MEWAH --- */}
      <div className="hidden lg:flex w-[55%] relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* GAMBAR BARU: Daun Monstera Gelap Dramatis (Sangat sesuai tema Luxury Nature) */}
          <img 
            src="https://images.unsplash.com/photo-1533038590840-1cde6e668a91?q=80&w=2787&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-50 scale-105 grayscale-[30%] sepia-[20%]"
            alt="Luxury Nature"
          />
          {/* Overlay Gradient: Hijau Gelap pekat di kiri, transparan beraksen emas di kanan */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#05110e] via-[#05110e]/80 to-[#C8A165]/20 mix-blend-multiply"></div>
        </div>

        <div className="relative z-10 p-20 max-w-2xl animate-fade-up">
          {/* Logo Icon diganti Leaf agar lebih tematik */}
          <div className="w-16 h-16 bg-gradient-to-br from-[#C8A165] to-[#8a6d3b] rounded-2xl flex items-center justify-center mb-10 shadow-2xl shadow-[#C8A165]/20">
            <Leaf size={32} className="text-[#0F2C23]" />
          </div>
          
          <h1 className="font-luxury italic text-6xl mb-8 leading-tight drop-shadow-lg">
            Sistem Kendali <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C8A165] via-[#e8c387] to-white">Ekosistem Premium.</span>
          </h1>
          
          <div className="space-y-6 border-l-2 border-[#C8A165]/50 pl-8">
             <p className="text-white/80 text-lg font-serif leading-relaxed">
              "Pintu gerbang eksklusif untuk mengelola harmoni antara hunian modern dan kelestarian alam."
            </p>
             <p className="text-[#C8A165] text-sm font-bold uppercase tracking-widest flex items-center gap-3">
               <ShieldCheck size={16}/> Authorized Personnel Only
            </p>
          </div>
        </div>
      </div>

      {/* --- BAGIAN KANAN: FORM LOGIN GLASS --- */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 relative bg-[#05110e]">
        {/* Dekorasi Cahaya Emas */}
        <div className="absolute top-[-20%] right-[-20%] w-[600px] h-[600px] bg-[#C8A165]/5 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#C8A165]/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-md relative z-10 p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-sm shadow-2xl">
          
          <div className="mb-12 text-center">
            <span className="text-[#C8A165] text-xs font-black uppercase tracking-[0.4em] mb-4 block">Administrator Gate</span>
            <h2 className="text-4xl font-luxury italic text-white mb-2">Selamat Datang</h2>
            <p className="text-white/50 text-sm font-serif">Masukkan kredensial institusi Anda.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            
            <div className="group">
              <label className="text-[10px] uppercase tracking-widest text-white/40 mb-3 block group-focus-within:text-[#C8A165] transition-colors ml-2">Email Institusi</label>
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#C8A165] transition-colors">
                  <Mail size={20} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-sm text-white placeholder-white/20 outline-none focus:border-[#C8A165]/50 focus:bg-black/40 transition-all"
                  placeholder="admin@daurkita.com"
                  required
                />
              </div>
            </div>

            <div className="group">
              <label className="text-[10px] uppercase tracking-widest text-white/40 mb-3 block group-focus-within:text-[#C8A165] transition-colors ml-2">Kode Keamanan</label>
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#C8A165] transition-colors">
                  <Lock size={20} />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-sm text-white placeholder-white/20 outline-none focus:border-[#C8A165]/50 focus:bg-black/40 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center justify-center gap-2 animate-pulse font-bold tracking-wide">
                <ShieldCheck size={16} className="text-red-400"/> {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-gradient-to-r from-[#C8A165] to-[#9d7b48] hover:to-[#C8A165] text-[#0F2C23] rounded-2xl text-sm font-black uppercase tracking-[0.25em] transition-all transform hover:scale-[1.02] shadow-xl shadow-[#C8A165]/20 flex items-center justify-center gap-4 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 blur-md"></div>
              <span className="relative z-10 flex items-center gap-3">
                {loading ? <><Loader2 size={18} className="animate-spin"/> Memverifikasi...</> : <>Buka Panel <ArrowRight size={18}/></>}
              </span>
            </button>
          </form>

          <div className="mt-12 text-center">
            <Link href="/" className="text-white/30 hover:text-[#C8A165] text-xs font-bold uppercase tracking-widest transition-colors inline-flex items-center gap-2 border-b border-transparent hover:border-[#C8A165] pb-1">
              &larr; Kembali ke Beranda
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}