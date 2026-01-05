"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/lib/contexts/AuthContext";
import { Loader2, CheckCircle2, Send, MessageSquarePlus } from "lucide-react";
import { toast } from "sonner";

export default function ReportForm() {
  const { user } = useAuth();
  const [report, setReport] = useState("");
  const [status, setStatus] = useState("idle"); 

  const handleSendReport = async (e) => {
    e.preventDefault();
    if (!report || !user?.token) return;
    setStatus("sending");
    try {
      await addDoc(collection(db, "reports"), {
        complex_token: user.token,
        description: report,
        createdAt: serverTimestamp(),
        status: "Pending",
        type: "General Issue"
      });
      setReport("");
      setStatus("success");
      toast.success("Laporan Terkirim", { description: "Tim kami akan segera meninjau.", style: { background: '#0F2C23', color: 'white', border: '1px solid #C8A165' } });
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      setStatus("idle");
      toast.error("Gagal mengirim laporan");
    }
  };

  return (
    <div className="bg-[#0F2C23]/50 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-md relative overflow-hidden group">
      {/* Dekorasi */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-[#C8A165]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#C8A165]/10 transition-all"></div>

      <h3 className="text-white/60 font-bold uppercase tracking-widest text-xs mb-6 flex items-center gap-3 relative z-10">
        <div className="w-8 h-8 rounded-full bg-[#C8A165] text-[#0F2C23] flex items-center justify-center shadow-lg shadow-[#C8A165]/20"><MessageSquarePlus size={16}/></div> 
        Tulis Aduan Baru
      </h3>

      <form onSubmit={handleSendReport} className="relative z-10">
        <textarea 
          className="w-full h-40 bg-black/20 border border-white/10 rounded-2xl p-6 text-white text-lg font-serif placeholder-white/20 outline-none focus:border-[#C8A165] transition-all resize-none mb-6"
          placeholder="Jelaskan kendala di lapangan secara detail..." 
          value={report}
          onChange={(e) => setReport(e.target.value)}
          required
          disabled={status === "sending"}
        />
        
        <div className="flex justify-end">
          <button 
            disabled={status !== "idle"} 
            className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-lg ${
              status === "success" 
              ? "bg-green-500 text-white shadow-green-500/20" 
              : "bg-[#C8A165] text-[#0F2C23] hover:bg-white hover:shadow-white/20 hover:-translate-y-1"
            }`}
          >
            {status === "sending" ? <><Loader2 size={16} className="animate-spin" /> Mengirim...</> : status === "success" ? <><CheckCircle2 size={16} /> Terkirim</> : <>Kirim Laporan <Send size={14} /></>}
          </button>
        </div>
      </form>
    </div>
  );
}