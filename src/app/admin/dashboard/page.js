"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc, addDoc } from "firebase/firestore";
import { Building2, LogOut, Plus, Trash2, Pencil, X, Sparkles, Search, Bell, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminSelectionPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [complexes, setComplexes] = useState([]);
  
  // Form States
  const [newComplex, setNewComplex] = useState({ token: "", name: "" });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ token: "", name: "" });

  useEffect(() => { setMounted(true); }, []);

  // Fetch Areas
  useEffect(() => {
    const q = query(collection(db, "complexes"));
    const unsub = onSnapshot(q, (snapshot) => {
      setComplexes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  // Actions
  const handleAddComplex = async () => {
    const cleanToken = newComplex.token.toUpperCase().replace(/\s/g, "");
    if (!cleanToken) return alert("Token wajib diisi");
    await addDoc(collection(db, "complexes"), { token: cleanToken, name: newComplex.name });
    setNewComplex({ token: "", name: "" });
  };

  const handleDeleteComplex = async (id) => {
    if (confirm("Hapus area ini secara permanen?")) await deleteDoc(doc(db, "complexes", id));
  };

  const startEditing = (c) => {
    setEditingId(c.id);
    setEditForm({ token: c.token, name: c.name });
  };

  const handleUpdateComplex = async () => {
    await updateDoc(doc(db, "complexes", editingId), {
      token: editForm.token.toUpperCase().replace(/\s/g, ""),
      name: editForm.name
    });
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-[#05110e] flex font-sans text-white overflow-hidden relative selection:bg-[#C8A165] selection:text-[#05110e]">
      
      {/* Background Cinematic */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute inset-0 transition-transform duration-[30s] ease-linear ${mounted ? 'scale-110' : 'scale-100'}`}>
           <img src="https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=2941&auto=format&fit=crop" className="w-full h-full object-cover opacity-20" alt="Background" />
        </div>
        <div className="absolute inset-0 bg-[#05110e]/80 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#05110e] via-[#05110e]/80 to-transparent"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}></div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto relative z-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
           <div>
              <h1 className="text-4xl font-luxury italic text-white flex items-center gap-3">
                <Sparkles className="text-[#C8A165]" /> 
                Master <span className="text-[#C8A165]">Data Area</span>
              </h1>
              <p className="text-white/40 text-sm mt-2">Pilih area untuk masuk ke Dashboard Spesifik.</p>
           </div>
           
           <div className="flex gap-4">
             <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5 relative">
                 <Bell size={18} />
                 <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
             </div>
             <Link href="/" className="px-6 py-2 rounded-full border border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <LogOut size={14}/> Sign Out
             </Link>
           </div>
        </header>

        {/* Input New Area */}
        <div className="flex flex-col md:flex-row gap-6 bg-black/40 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl items-end mb-10 animate-fade-up">
            <div className="flex-1 w-full space-y-2">
                <label className="text-[9px] uppercase tracking-widest text-white/40 ml-2">Token ID (ex: PBB)</label>
                <input type="text" placeholder="GRIYA01" className="w-full h-14 bg-[#05110e]/50 border border-white/10 rounded-2xl px-6 text-sm text-[#C8A165] font-bold uppercase outline-none focus:border-[#C8A165]" value={newComplex.token} onChange={e => setNewComplex({...newComplex, token: e.target.value})} />
            </div>
            <div className="flex-[2] w-full space-y-2">
                <label className="text-[9px] uppercase tracking-widest text-white/40 ml-2">Nama Lengkap Residence</label>
                <input type="text" placeholder="Green Valley Estate" className="w-full h-14 bg-[#05110e]/50 border border-white/10 rounded-2xl px-6 text-sm text-white outline-none focus:border-[#C8A165]" value={newComplex.name} onChange={e => setNewComplex({...newComplex, name: e.target.value})} />
            </div>
            <button onClick={handleAddComplex} className="h-14 px-10 bg-[#C8A165] hover:bg-white text-[#05110e] rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg">
                Register Area
            </button>
        </div>

        {/* Grid Area Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complexes.map((c) => (
                <div key={c.id} className="group relative p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-[#C8A165]/30 transition-all duration-500 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8A165]/5 rounded-full blur-[40px] group-hover:bg-[#C8A165]/10 transition-all"></div>
                    
                    {editingId === c.id ? (
                        <div className="space-y-4 relative z-10">
                            <div className="flex justify-between"><span className="text-[9px] text-[#C8A165] font-black uppercase">Edit Mode</span><button onClick={() => setEditingId(null)}><X size={16}/></button></div>
                            <input className="w-full bg-black/30 p-3 rounded-xl text-sm text-[#C8A165] font-bold border border-white/10" value={editForm.token} onChange={e => setEditForm({...editForm, token: e.target.value})} />
                            <input className="w-full bg-black/30 p-3 rounded-xl text-sm text-white border border-white/10" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                            <button onClick={handleUpdateComplex} className="w-full py-3 bg-[#C8A165] text-[#0F2C23] rounded-xl text-xs font-bold">SAVE CHANGES</button>
                        </div>
                    ) : (
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#C8A165] border border-white/5 shadow-inner">
                                    <Building2 size={24}/>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => startEditing(c)} className="p-2 rounded-full bg-black/20 hover:text-[#C8A165]"><Pencil size={14}/></button>
                                    <button onClick={() => handleDeleteComplex(c.id)} className="p-2 rounded-full bg-black/20 hover:text-red-500"><Trash2 size={14}/></button>
                                </div>
                            </div>
                            
                            <h3 className="text-4xl font-luxury text-white mb-1">{c.token}</h3>
                            <p className="text-white/40 text-sm font-serif italic mb-8">{c.name || "Nama Belum Diatur"}</p>
                            
                            <button 
                                onClick={() => router.push(`/admin/dashboard/${c.token}`)} 
                                className="mt-auto w-full py-4 rounded-xl border border-white/10 hover:bg-[#C8A165] hover:text-[#05110e] hover:border-[#C8A165] text-white transition-all text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 group/btn"
                            >
                                Masuk Dashboard <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform"/>
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>

      </main>
    </div>
  );
}