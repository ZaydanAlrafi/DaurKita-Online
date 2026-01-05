"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/lib/contexts/AuthContext";
import { Clock, Calendar, MapPin } from "lucide-react";

export default function ScheduleList() {
  const { user } = useAuth();
  const [jadwal, setJadwal] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.token) {
      const q = query(collection(db, "schedules"), where("complex_token", "==", user.token));
      const unsub = onSnapshot(q, (snapshot) => {
        setJadwal(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      });
      return () => unsub();
    }
  }, [user]);

  if (loading) return <div className="text-center text-white/30 animate-pulse py-10 font-luxury italic text-xl">Sinkronisasi Jadwal...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jadwal.length > 0 ? (
        jadwal.map((s) => (
          <div key={s.id} className="group relative p-8 rounded-[2.5rem] bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50 hover:border-[#C8A165]/30">
            
            {/* Dekorasi Blur */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#C8A165]/5 rounded-full blur-2xl group-hover:bg-[#C8A165]/10 transition-all"></div>

            {/* Header: Kategori */}
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="bg-[#C8A165] text-[#0F2C23] text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg shadow-[#C8A165]/20 uppercase tracking-widest">
                {s.category || "Umum"}
              </div>
              <div className="text-white/20 group-hover:text-[#C8A165] transition-colors">
                <Calendar size={20} />
              </div>
            </div>

            {/* Isi: Hari & Jam */}
            <div className="relative z-10">
               <h4 className="font-luxury italic text-4xl mb-3 text-white leading-tight group-hover:text-[#C8A165] transition-colors">{s.day}</h4>
               
               <div className="flex items-center gap-3 text-white/60 font-mono text-xs mb-6 pb-6 border-b border-white/5">
                 <Clock size={14} className="text-[#C8A165]" /> 
                 <span>{s.time}</span>
               </div>
               
               {/* Footer: Catatan */}
               <div className="flex gap-3 items-start">
                  <div className="mt-1 w-1 h-8 bg-[#C8A165]/30 rounded-full"></div>
                  <p className="text-white/50 text-xs italic leading-relaxed">
                    "{s.note || "Mohon letakkan sampah pada titik penjemputan yang telah ditentukan."}"
                  </p>
               </div>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full py-20 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-[2rem]">
          <p className="text-white/30 font-luxury italic text-xl">Belum ada jadwal aktif untuk area ini.</p>
        </div>
      )}
    </div>
  );
}