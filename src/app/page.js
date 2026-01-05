'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaLeaf, FaArrowRight, FaLock, FaExclamationCircle } from 'react-icons/fa'; 
// --- FIREBASE IMPORTS ---
import { db } from "@/lib/firebase"; 
import { collection, query, where, getDocs } from "firebase/firestore";

export default function TokenAccessPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState(''); 
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); 
    
    if (!code) return;
    const cleanCode = code.trim().toUpperCase();
    setLoading(true);

    try {
        // --- CEK KE FIREBASE ---
        // Mencari apakah ada dokumen di koleksi 'complexes' yang field 'token'-nya sama dengan inputan
        const q = query(collection(db, "complexes"), where("token", "==", cleanCode));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // JIKA KODE DITEMUKAN DI DATABASE
            router.push(`/dashboard?cluster=${cleanCode}`);
        } else {
            // JIKA KODE TIDAK ADA
            setError(`Kode "${cleanCode}" tidak terdaftar. Hubungi Admin.`);
            setLoading(false);
        }
    } catch (err) {
        console.error("Firebase Error:", err);
        setError("Terjadi gangguan koneksi. Coba lagi.");
        setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden font-sans text-[#F4E9D8]">
      
      <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 bg-gradient-to-t from-[#0E2923] via-[#0E2923]/70 to-[#0E2923]/50 z-10"></div>
         <img src="https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=2000&auto=format&fit=crop" alt="Background" className="w-full h-full object-cover opacity-90 animate-pulse-slow"/>
      </div>

      <div className="relative z-20 w-full max-w-md px-6">
        <div className="group relative bg-[#0E2923]/50 backdrop-blur-[20px] border border-[#CFB089]/20 rounded-[3rem] p-10 text-center shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
            
            <div className="relative mx-auto w-24 h-24 bg-gradient-to-br from-[#CFB089] to-[#8c7335] rounded-3xl flex items-center justify-center mb-10 shadow-2xl shadow-[#CFB089]/20">
                <div className="w-[96%] h-[96%] bg-[#0E2923] rounded-[22px] flex items-center justify-center">
                    <FaLeaf className="text-4xl text-[#CFB089]" />
                </div>
            </div>

            <span className="text-[11px] font-bold tracking-[0.4em] text-[#CFB089] uppercase mb-4 block opacity-80">Residence Portal</span>
            <h1 className="font-serif text-5xl md:text-6xl mb-6 text-white tracking-tight">Daur<span className="italic text-[#CFB089]">Kita.</span></h1>

            <form onSubmit={handleLogin} className="space-y-6">
                <div className="relative group/input">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#CFB089]/50 text-xl"><FaLock /></span>
                    <input 
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)} 
                        placeholder="KODE AKSES" 
                        className="w-full bg-[#05130e]/60 border border-[#CFB089]/20 rounded-full py-5 pl-16 pr-6 text-center text-white tracking-[0.2em] font-bold placeholder:text-gray-500/50 focus:outline-none focus:border-[#CFB089] transition-all uppercase"
                    />
                </div>

                {error && (
                    <div className="text-red-400 text-xs font-bold tracking-widest bg-red-900/20 p-3 rounded-xl border border-red-500/30 flex items-center justify-center gap-2">
                        <FaExclamationCircle /> {error}
                    </div>
                )}

                <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-[#CFB089] to-[#bfa27a] text-[#0E2923] font-bold py-5 rounded-full flex items-center justify-center gap-4 hover:scale-[1.02] transition-transform shadow-[0_10px_30px_rgba(207,176,137,0.3)] disabled:opacity-70">
                    <span className="relative text-xs tracking-[0.3em] uppercase">{loading ? "Memuat..." : "Masuk Dashboard"}</span>
                    <FaArrowRight />
                </button>
            </form>
        </div>
      </div>
      <style jsx>{` @keyframes pulse-slow { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } } .animate-pulse-slow { animation: pulse-slow 25s infinite ease-in-out; } `}</style>
    </main>
  );
}