"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/lib/contexts/AuthContext";
import { Clock, CheckCircle2, AlertCircle, Activity } from "lucide-react";

export default function ReportList() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.token) return;
    try {
      const q = query(collection(db, "reports"), where("complex_token", "==", user.token));
      const unsub = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setReports(data);
        setLoading(false);
      });
      return () => unsub();
    } catch (err) { setLoading(false); }
  }, [user]);

  if (loading) return null;

  return (
    <div className="mt-12 px-2">
      <h3 className="text-white/40 font-bold uppercase tracking-widest text-[10px] mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
        <Activity size={14}/> Riwayat Laporan Terkini
      </h3>
      
      <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
        {reports.length === 0 ? (
          <p className="text-white/20 italic text-sm text-center py-8">Belum ada riwayat laporan.</p>
        ) : (
          reports.map((item) => (
            <div key={item.id} className="group bg-white/[0.03] border border-white/5 p-5 rounded-2xl hover:border-[#C8A165]/30 hover:bg-white/[0.05] transition-all flex items-start gap-4">
              
              {/* Badge Status - Sama persis dengan Admin */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  item.status === 'Selesai' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 
                  item.status === 'Proses' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' : 
                  'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                {item.status === 'Selesai' ? <CheckCircle2 size={18}/> : <AlertCircle size={18}/>}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-[9px] font-black uppercase tracking-widest ${
                     item.status === 'Selesai' ? 'text-green-400' : item.status === 'Proses' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {item.status || "Pending"}
                  </span>
                  <span className="text-white/20 text-[10px] font-mono">
                    {item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' }) : "Baru saja"}
                  </span>
                </div>
                <p className="text-white/80 text-sm font-serif leading-relaxed group-hover:text-white transition-colors">"{item.description}"</p>
              </div>
            </div>
          ))
        )}
      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}