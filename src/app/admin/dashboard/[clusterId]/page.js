"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc, addDoc, where } from "firebase/firestore";
import { Activity, Calendar, Clock, Plus, Trash2, X, Sparkles, Search, Bell, ArrowLeft, Pencil, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function ClusterDashboard() {
  const params = useParams();
  const router = useRouter();
  
  // Pastikan clusterId didecode agar spasi/karakter khusus terbaca benar
  const clusterId = decodeURIComponent(params.clusterId); 

  const [activeTab, setActiveTab] = useState("reports");
  const [mounted, setMounted] = useState(false);
  
  // State Data
  const [reports, setReports] = useState([]);
  const [schedules, setSchedules] = useState([]);
  
  // State Forms
  const [newSchedule, setNewSchedule] = useState({
    day: "", time: "", category: "Organik", note: "", complex_token: clusterId
  });

  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [editScheduleForm, setEditScheduleForm] = useState({
    day: "", time: "", category: "", note: "", complex_token: clusterId
  });

  useEffect(() => { setMounted(true); }, []);

  // --- 1. FETCH DATA LAPORAN (PERBAIKAN LOGIKA) ---
  useEffect(() => {
    // Hapus 'orderBy' dari query Firebase untuk menghindari error Index
    const q = query(
      collection(db, "reports"), 
      where("complex_token", "==", clusterId)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      let data = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        // Konversi Timestamp ke Date Object agar bisa disort
        createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date()
      })); 

      // SORTING DILAKUKAN DI SINI (JAVASCRIPT)
      // Dari yang terbaru ke terlama
      data.sort((a, b) => b.createdAt - a.createdAt);

      setReports(data);
    });
    return () => unsub();
  }, [clusterId]);

  // --- 2. FETCH JADWAL ---
  useEffect(() => {
    const q = query(collection(db, "schedules"), where("complex_token", "==", clusterId));
    const unsub = onSnapshot(q, (snapshot) => {
      setSchedules(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [clusterId]);

  // --- ACTIONS ---
  const handleUpdateStatus = async (id, currentStatus) => {
    // Logika Status: Pending (Merah) -> Proses (Kuning) -> Selesai (Hijau)
    let newStatus = "Proses";
    if (currentStatus === "Proses") newStatus = "Selesai";
    
    await updateDoc(doc(db, "reports", id), { status: newStatus });
  };

  const handleDeleteReport = async (id) => {
    if (confirm("Hapus laporan ini permanen?")) await deleteDoc(doc(db, "reports", id));
  };

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "schedules"), { ...newSchedule, complex_token: clusterId });
    setNewSchedule(prev => ({ ...prev, day: "", time: "", note: "" }));
  };

  const handleDeleteSchedule = async (id) => {
    if (confirm("Hapus jadwal ini?")) await deleteDoc(doc(db, "schedules", id));
  };

  const startEditingSchedule = (schedule) => {
    setEditingScheduleId(schedule.id);
    setEditScheduleForm(schedule);
  };

  const handleUpdateSchedule = async () => {
    try {
      await updateDoc(doc(db, "schedules", editingScheduleId), editScheduleForm);
      setEditingScheduleId(null);
    } catch (error) { console.error(error); }
  };

  return (
    <div className="min-h-screen bg-[#05110e] flex font-sans text-white overflow-hidden relative selection:bg-[#C8A165] selection:text-[#05110e]">
      
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute inset-0 transition-transform duration-[30s] ease-linear ${mounted ? 'scale-110' : 'scale-100'}`}>
           <img src="https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=2941&auto=format&fit=crop" className="w-full h-full object-cover opacity-20" alt="Admin Background" />
        </div>
        <div className="absolute inset-0 bg-[#05110e]/80 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#05110e] via-[#05110e]/80 to-transparent"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}></div>
      </div>

      {/* Sidebar */}
      <aside className="hidden md:flex w-80 p-6 flex-col relative z-20 h-screen">
        <div className="flex-1 bg-black/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 flex flex-col shadow-2xl relative overflow-hidden group">
          <div className="mb-8 flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-gradient-to-br from-[#C8A165] to-[#8a6d3b] rounded-2xl flex items-center justify-center text-[#0F2C23] shadow-[0_0_20px_rgba(200,161,101,0.3)]">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="font-luxury italic text-2xl tracking-wide text-white">Daur Kita</h1>
              <p className="text-[9px] text-[#C8A165] font-black uppercase tracking-[0.3em]">Area: {clusterId}</p>
            </div>
          </div>

          <nav className="flex-1 space-y-4 relative z-10">
            {[
              { id: "reports", label: "Live Monitoring", icon: <Activity size={20} />, desc: "Aduan Warga" },
              { id: "schedules", label: "Logistic Hub", icon: <Calendar size={20} />, desc: "Jadwal Area Ini" },
            ].map((menu) => (
              <button key={menu.id} onClick={() => setActiveTab(menu.id)} className={`w-full text-left p-4 rounded-2xl transition-all duration-500 group/btn relative border ${activeTab === menu.id ? 'bg-[#C8A165]/10 border-[#C8A165]/50' : 'bg-transparent border-transparent hover:bg-white/5'}`}>
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl transition-colors ${activeTab === menu.id ? 'text-[#C8A165]' : 'text-white/40 group-hover/btn:text-white'}`}>{menu.icon}</div>
                  <div>
                    <span className={`block text-xs font-black uppercase tracking-widest ${activeTab === menu.id ? 'text-white' : 'text-white/60'}`}>{menu.label}</span>
                    <span className="text-[10px] text-white/30 font-serif italic">{menu.desc}</span>
                  </div>
                </div>
                {activeTab === menu.id && <div className="absolute inset-0 bg-gradient-to-r from-[#C8A165]/10 to-transparent rounded-2xl blur-sm"></div>}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-8 border-t border-white/5 relative z-10">
            <button onClick={() => router.push('/admin/dashboard')} className="flex items-center gap-4 group/back w-full text-left">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 group-hover/back:bg-[#C8A165]/20 group-hover/back:text-[#C8A165] transition-colors">
                <ArrowLeft size={16} />
              </div>
              <div>
                <span className="block text-xs font-bold text-white">Ganti Area</span>
                <span className="text-[9px] text-white/40 uppercase tracking-wider group-hover/back:text-[#C8A165] transition-colors">Kembali ke Master</span>
              </div>
            </button>
          </div>
          
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#C8A165]/5 rounded-full blur-[50px]"></div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto relative z-10">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-10 bg-black/20 backdrop-blur-md p-6 rounded-[2rem] border border-white/5 sticky top-0 z-50">
           <div>
              <h2 className="text-3xl font-luxury italic text-white">
                Dashboard <span className="text-[#C8A165]">{clusterId}</span>
              </h2>
              <p className="text-white/40 text-xs mt-1">Mengelola data spesifik untuk area ini.</p>
           </div>
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5 text-white/60 relative">
                 <Bell size={18} />
                 <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </div>
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/5">
                 <Search size={14} className="text-white/40"/>
                 <input type="text" placeholder="Cari laporan..." className="bg-transparent border-none outline-none text-xs text-white placeholder-white/20 w-32"/>
              </div>
           </div>
        </header>

        {/* --- TAB: REPORTS --- */}
        {activeTab === "reports" && (
          <div className="animate-fade-up space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-[#C8A165] text-[#05110e] p-8 rounded-[2.5rem] flex items-center justify-between relative overflow-hidden group">
                   <div className="relative z-10">
                      <h3 className="font-black uppercase tracking-[0.3em] text-sm mb-2 opacity-70">Laporan Masuk</h3>
                      <div className="text-7xl font-luxury italic">{reports.length}</div>
                   </div>
                   <Activity size={100} className="absolute -right-5 -bottom-5 opacity-10 rotate-12 group-hover:scale-110 transition-transform"/>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
               {reports.length === 0 ? (
                  <div className="text-center p-10 text-white/30 italic border border-dashed border-white/10 rounded-[2rem]">
                    Belum ada laporan untuk area {clusterId}
                  </div>
               ) : (
                 reports.map((item) => (
                  <div key={item.id} className="group bg-black/40 border border-white/5 hover:border-[#C8A165]/30 p-6 rounded-[2rem] backdrop-blur-md transition-all duration-500 hover:transform hover:translate-x-2 flex flex-col md:flex-row gap-6 items-center">
                     
                     {/* WARNA INDICATOR DIPERBAIKI DISINI */}
                     <div className={`w-3 h-full rounded-full self-stretch ${
                        item.status === 'Selesai' ? 'bg-green-500 shadow-[0_0_15px_#22c55e]' : 
                        item.status === 'Proses' ? 'bg-yellow-500 shadow-[0_0_15px_#eab308]' : 
                        'bg-red-500 shadow-[0_0_15px_#ef4444]' // Default Merah (Pending)
                     }`}></div>

                     <div className="flex-1 w-full">
                        <div className="flex justify-between items-start mb-2">
                           <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${
                              item.status === 'Selesai' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                              item.status === 'Proses' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                              'bg-red-500/10 text-red-400 border-red-500/20'
                           }`}>
                              {item.status || "Pending"}
                           </span>
                           <span className="text-[10px] text-white/30 font-mono">
                              {item.createdAt?.toLocaleTimeString ? item.createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "Baru saja"}
                           </span>
                        </div>
                        <p className="text-white/80 font-serif text-lg leading-relaxed">"{item.description}"</p>
                     </div>

                     <div className="flex gap-2">
                        {/* Tombol Update Status */}
                        {item.status !== "Selesai" && (
                           <button onClick={() => handleUpdateStatus(item.id, item.status)} className="px-6 py-3 bg-[#C8A165]/10 hover:bg-[#C8A165] text-[#C8A165] hover:text-[#05110e] border border-[#C8A165]/30 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                              {item.status === "Proses" ? "Tandai Selesai" : "Proses Laporan"}
                           </button>
                        )}
                        {/* Tombol Hapus */}
                        <button onClick={() => handleDeleteReport(item.id)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-all">
                           <Trash2 size={16} />
                        </button>
                     </div>
                  </div>
                 ))
               )}
              </div>
          </div>
        )}

        {/* --- TAB: SCHEDULES --- */}
        {activeTab === "schedules" && (
          <div className="animate-fade-up space-y-8">
            <div className="bg-black/40 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8A165]/5 rounded-full blur-[80px]"></div>
               <h3 className="text-[#C8A165] font-black uppercase tracking-[0.3em] text-xs mb-8 flex items-center gap-3"><Plus size={16} /> Tambah Jadwal {clusterId}</h3>
               <form onSubmit={handleAddSchedule} className="grid grid-cols-1 md:grid-cols-12 gap-4 relative z-10">
                  <div className="md:col-span-4 space-y-2">
                     <label className="text-[9px] uppercase tracking-widest text-white/40">Hari</label>
                     <input type="text" className="w-full h-14 bg-[#05110e]/50 border border-white/10 rounded-2xl px-4 text-xs text-white focus:border-[#C8A165] outline-none" placeholder="Senin" value={newSchedule.day} onChange={e => setNewSchedule({...newSchedule, day: e.target.value})} required />
                  </div>
                  <div className="md:col-span-4 space-y-2">
                     <label className="text-[9px] uppercase tracking-widest text-white/40">Jam</label>
                     <input type="text" className="w-full h-14 bg-[#05110e]/50 border border-white/10 rounded-2xl px-4 text-xs text-white focus:border-[#C8A165] outline-none" placeholder="08:00" value={newSchedule.time} onChange={e => setNewSchedule({...newSchedule, time: e.target.value})} required />
                  </div>
                  <div className="md:col-span-4 flex items-end">
                     <button type="submit" className="w-full h-14 bg-[#C8A165] hover:bg-white text-[#05110e] rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(200,161,101,0.2)]">Add Schedule</button>
                  </div>
                  <div className="md:col-span-12 space-y-2">
                     <label className="text-[9px] uppercase tracking-widest text-white/40">Catatan Khusus</label>
                     <input type="text" className="w-full h-14 bg-[#05110e]/50 border border-white/10 rounded-2xl px-4 text-xs text-white focus:border-[#C8A165] outline-none" placeholder="Instruksi tambahan..." value={newSchedule.note} onChange={e => setNewSchedule({...newSchedule, note: e.target.value})} />
                  </div>
               </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
               {schedules.map((s) => (
                  <div key={s.id} className="group relative bg-[#05110e]/60 border border-white/5 hover:border-[#C8A165]/50 p-8 rounded-[2.5rem] transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-br from-[#C8A165]/0 to-[#C8A165]/0 group-hover:to-[#C8A165]/5 transition-all duration-500"></div>
                     {editingScheduleId === s.id ? (
                        <div className="space-y-4 relative z-10">
                           <div className="flex justify-between"><span className="text-[9px] text-[#C8A165] font-black uppercase">Editing Mode</span><button onClick={() => setEditingScheduleId(null)}><X size={16}/></button></div>
                           <input className="w-full bg-black/40 p-3 rounded-xl text-xs text-white border border-white/10" value={editScheduleForm.day} onChange={e => setEditScheduleForm({...editScheduleForm, day: e.target.value})} />
                           <input className="w-full bg-black/40 p-3 rounded-xl text-xs text-white border border-white/10" value={editScheduleForm.time} onChange={e => setEditScheduleForm({...editScheduleForm, time: e.target.value})} />
                           <button onClick={handleUpdateSchedule} className="w-full py-3 bg-[#C8A165] text-[#05110e] rounded-xl text-xs font-bold">SAVE CHANGES</button>
                        </div>
                     ) : (
                        <div className="relative z-10">
                           <div className="flex justify-between items-start mb-6">
                              <span className="bg-white/5 border border-white/5 text-white/60 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{s.category || 'Umum'}</span>
                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button onClick={() => startEditingSchedule(s)} className="p-2 rounded-full bg-white/10 hover:text-[#C8A165]"><Pencil size={12}/></button>
                                 <button onClick={() => handleDeleteSchedule(s.id)} className="p-2 rounded-full bg-white/10 hover:text-red-400"><Trash2 size={12}/></button>
                              </div>
                           </div>
                           <h4 className="text-3xl font-luxury italic text-white mb-2 group-hover:text-[#C8A165] transition-colors">{s.day}</h4>
                           <div className="flex items-center gap-2 text-white/40 text-xs font-mono mb-4 border-b border-white/5 pb-4"><Clock size={12} className="text-[#C8A165]"/> {s.time}</div>
                           <p className="text-white/40 text-xs italic line-clamp-2">"{s.note || 'No notes available'}"</p>
                        </div>
                     )}
                  </div>
               ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}