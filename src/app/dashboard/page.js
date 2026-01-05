'use client';

import { useSearchParams, useRouter } from 'next/navigation';
// 1. TAMBAHKAN IMPORT SUSPENSE DISINI
import { useState, useEffect, Suspense } from 'react'; 
import Link from 'next/link';

// --- FIREBASE IMPORTS ---
import { db } from "@/lib/firebase"; 
import { collection, query, where, onSnapshot, addDoc, getDocs, orderBy } from "firebase/firestore";
// Icons
import { FaClock, FaPaperPlane, FaCheckCircle, FaArrowRight, FaCalendarAlt, FaLeaf, FaRecycle, FaBiohazard, FaBurn, FaBolt, FaTimes, FaUserCircle, FaCalendar, FaHistory, FaSpinner, FaExclamationCircle } from 'react-icons/fa';

// --- DATA ARTIKEL EDUKASI ---
const articlesData = {
  "organik": {
    category: "GUIDE",
    title: "Seni Memilah Sampah Organik",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2000",
    content: `
      <p class="mb-4">Sampah organik adalah jenis sampah yang berasal dari bahan-bahan hayati yang dapat terurai oleh alam (biodegradable). Contoh yang paling sering kita temui adalah sisa makanan, kulit buah, sayuran yang layu, serta dedaunan kering.</p>
      <h3 class="text-xl font-serif text-[#CFB089] mt-6 mb-2">Mengapa Harus Dipilah?</h3>
      <p class="mb-4">Ketika sampah organik tercampur dengan plastik di TPA, proses pembusukannya menghasilkan gas Metana yang berbahaya. Namun, jika dipilah, "sampah" ini berubah menjadi Kompos yang menyuburkan.</p>
      <h3 class="text-xl font-serif text-[#CFB089] mt-6 mb-2">Langkah Pengelolaan:</h3>
      <ul class="list-disc pl-5 space-y-1 text-gray-300">
        <li>Pisahkan sisa makanan dari kemasan plastik.</li>
        <li>Tiriskan kuah/cairan sebelum dibuang.</li>
        <li>Gunakan wadah tertutup agar tidak mengundang lalat.</li>
      </ul>
    `
  },
  "plastik": {
    category: "RECYCLE",
    title: "Plastik: Ancaman & Peluang",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2000",
    content: `
      <p class="mb-4">Plastik butuh ratusan tahun untuk terurai. Namun, plastik memiliki nilai ekonomi tinggi jika didaur ulang.</p>
      <h3 class="text-xl font-serif text-[#CFB089] mt-6 mb-2">Jenis Bernilai Tinggi:</h3>
      <ul class="list-disc pl-5 space-y-1 text-gray-300">
        <li><strong>PET (1):</strong> Botol air mineral bening.</li>
        <li><strong>HDPE (2):</strong> Botol sampo, jerigen.</li>
      </ul>
      <p class="mt-4">Remukkan botol sebelum dibuang untuk menghemat ruang penyimpanan Anda.</p>
    `
  },
  "b3": {
    category: "HAZARD",
    title: "Bahaya Limbah B3",
    image: "https://images.pexels.com/photos/3777938/pexels-photo-3777938.jpeg",
    content: `
      <p class="mb-4">Jangan buang baterai bekas, lampu neon, atau kaleng aerosol ke tempat sampah biasa. Bahan kimianya dapat meracuni tanah dan air.</p>
      <h3 class="text-xl font-serif text-[#CFB089] mt-6 mb-2">Cara Aman:</h3>
      <p>Simpan dalam wadah terpisah (safety box) dan serahkan langsung ke petugas saat jadwal penjemputan khusus B3.</p>
    `
  },
  "jelantah": {
    category: "INNOVATION",
    title: "Energi dari Minyak Jelantah",
    image: "https://images.pexels.com/photos/3806781/pexels-photo-3806781.jpeg",
    content: `
      <p class="mb-4">Minyak bekas menggoreng (jelantah) adalah bahan baku utama Biodiesel. Jangan dibuang ke wastafel karena akan menyumbat pipa!</p>
      <h3 class="text-xl font-serif text-[#CFB089] mt-6 mb-2">Program Tukar Jelantah:</h3>
      <p>Dinginkan minyak, saring remah makanan, dan masukkan ke dalam jerigen. Kami akan menukarnya dengan saldo e-wallet.</p>
    `
  }
};

// 2. HAPUS "export default" DARI SINI. CUKUP "function" SAJA.
function UserDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const clusterInput = searchParams.get('cluster'); 
  const clusterName = clusterInput ? clusterInput.toUpperCase() : '';

  const [schedules, setSchedules] = useState([]);
  const [reports, setReports] = useState([]); 
  const [complexName, setComplexName] = useState('Loading...');
  const [loading, setLoading] = useState(true);
  
  const [laporanText, setLaporanText] = useState('');
  const [laporanStatus, setLaporanStatus] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);

  // --- 1. AMBIL DATA REALTIME ---
  useEffect(() => {
    if (!clusterName) { router.push('/'); return; }

    const fetchComplexName = async () => {
        const q = query(collection(db, "complexes"), where("token", "==", clusterName));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            setComplexName(snapshot.docs[0].data().name);
        } else {
            router.push('/'); 
        }
        setLoading(false);
    };
    fetchComplexName();

    const qSchedule = query(collection(db, "schedules"), where("complex_token", "==", clusterName));
    const unsubscribeSchedule = onSnapshot(qSchedule, (snapshot) => {
        const jadwalData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSchedules(jadwalData);
    });

    const qReports = query(collection(db, "reports"), where("complex_token", "==", clusterName));
    const unsubscribeReports = onSnapshot(qReports, (snapshot) => {
        let reportsData = snapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date()
        }));
        reportsData.sort((a, b) => b.createdAt - a.createdAt);
        setReports(reportsData);
    });

    return () => {
        unsubscribeSchedule();
        unsubscribeReports();
    };
  }, [clusterName, router]);

  // --- 2. KIRIM LAPORAN ---
  const handleKirimLaporan = async () => {
    if (!laporanText.trim()) return;
    setLaporanStatus('sending');
    try {
        await addDoc(collection(db, "reports"), {
            complex_token: clusterName,
            complex_name: complexName, 
            description: laporanText,
            status: 'Pending', 
            createdAt: new Date()
        });
        setLaporanStatus('success');
        setLaporanText('');
        setTimeout(() => setLaporanStatus(''), 3000);
    } catch (error) {
        setLaporanStatus('');
        alert('Gagal mengirim laporan');
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(date);
  };

  if (loading) return <div className="min-h-screen bg-[#0E2923] flex items-center justify-center text-[#CFB089]">Memuat Data...</div>;

  return (
    <main className="min-h-screen bg-[#0E2923] text-[#F4E9D8] font-sans selection:bg-[#CFB089] selection:text-[#0E2923]">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-6 bg-gradient-to-b from-[#0E2923]/90 to-transparent backdrop-blur-sm border-b border-white/5 transition-all">
        <div className="flex items-center gap-3">
            <div className="bg-[#CFB089] text-[#0E2923] font-bold rounded-lg w-10 h-10 flex items-center justify-center text-sm">DK</div>
            <span className="font-serif text-2xl font-bold tracking-wide text-[#F4E9D8]">Daur<span className="italic text-[#CFB089]">Kita.</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-xs font-bold tracking-[0.2em] uppercase text-gray-400">
            <a href="#beranda" className="hover:text-[#CFB089] transition-colors">Beranda</a>
            <a href="#edukasi" className="hover:text-[#CFB089] transition-colors">Edukasi</a>
            <a href="#jadwal" className="hover:text-[#CFB089] transition-colors">Jadwal</a>
            <div className="border border-[#CFB089]/50 text-[#CFB089] px-6 py-2 rounded-full flex items-center gap-2 cursor-default bg-[#CFB089]/5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                {clusterName}
            </div>
            <Link href="/" className="hover:text-red-400 transition-colors text-xl"><FaArrowRight className="rotate-180"/></Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="beranda" className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
             <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop" alt="Background Alam" className="w-full h-full object-cover opacity-60" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E2923] via-[#0E2923]/70 to-[#0E2923]/40 z-0"></div>

        <div className="relative z-10 max-w-5xl mx-auto mt-10 animate-in fade-in zoom-in duration-700">
            <p className="text-[#CFB089] text-xs font-bold tracking-[0.4em] uppercase mb-8 inline-block border border-[#CFB089]/30 px-4 py-2 rounded-full backdrop-blur-md bg-black/10">Selamat Datang, Warga {clusterName}</p>
            <h1 className="font-serif text-5xl md:text-7xl leading-tight mb-8 drop-shadow-2xl text-white">Kebersihan Adalah <br/><span className="italic text-[#CFB089]">Kemewahan Sejati</span></h1>
            <p className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light italic leading-relaxed opacity-90">"Menghadirkan harmoni antara hunian modern dan kelestarian alam di {complexName}."</p>
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                <a href="#edukasi" className="bg-[#CFB089] text-[#0E2923] px-10 py-4 rounded-full font-bold text-xs tracking-widest uppercase hover:scale-105 transition-transform duration-300 shadow-lg">Mulai Eksplorasi</a>
                <a href="#jadwal" className="border border-white/30 bg-white/5 backdrop-blur-sm text-white px-10 py-4 rounded-full font-bold text-xs tracking-widest uppercase hover:bg-white/10 transition-colors">Cek Jadwal</a>
            </div>
        </div>
      </section>

      {/* EDUKASI SECTION */}
      <section id="edukasi" className="py-24 px-6 md:px-12 bg-[#0B251C] relative z-10 border-t border-white/5">
        <div className="text-center mb-16">
            <p className="text-[#CFB089] text-[10px] font-bold tracking-[0.3em] uppercase mb-4">Knowledge Center</p>
            <h2 className="font-serif text-5xl md:text-6xl text-[#EAE0D5] mb-4">Ensiklopedia <span className="italic text-[#CFB089]">Lestari.</span></h2>
            <p className="text-gray-400 font-light text-sm md:text-base max-w-2xl mx-auto">"Wawasan mendalam tentang keberlanjutan, dikurasi khusus untuk warga."</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            <div onClick={() => setSelectedArticle(articlesData['organik'])} className="lg:col-span-2 relative h-[350px] md:h-[450px] rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-2xl transition-transform hover:scale-[1.01]">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('${articlesData['organik'].image}')` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B251C] via-[#0B251C]/30 to-transparent opacity-90"></div>
                <div className="absolute top-8 left-8 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-[#CFB089]"><FaLeaf size={20}/></div>
                <div className="absolute top-8 right-8 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-bold tracking-[0.2em] uppercase text-white/80">Guide</div>
                <div className="absolute bottom-0 left-0 p-8 md:p-10 w-full md:w-3/4">
                    <h3 className="font-serif text-3xl md:text-4xl text-white mb-4 leading-tight">Seni Memilah Sampah Organik</h3>
                    <div className="flex items-center gap-3 text-xs font-bold tracking-[0.2em] uppercase text-[#CFB089] group-hover:gap-5 transition-all">Baca Selengkapnya <FaArrowRight /></div>
                </div>
            </div>
            <div onClick={() => setSelectedArticle(articlesData['plastik'])} className="lg:col-span-1 relative h-[350px] md:h-[450px] rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-2xl transition-transform hover:scale-[1.01]">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('${articlesData['plastik'].image}')` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B251C] via-[#0B251C]/20 to-transparent opacity-90"></div>
                <div className="absolute top-8 left-8 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-[#CFB089]"><FaRecycle size={20}/></div>
                <div className="absolute top-8 right-8 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-bold tracking-[0.2em] uppercase text-white/80">Recycle</div>
                <div className="absolute bottom-0 left-0 p-8 w-full">
                    <h3 className="font-serif text-2xl md:text-3xl text-white mb-4 leading-tight">Plastik: Ancaman & Peluang</h3>
                    <div className="flex items-center gap-3 text-xs font-bold tracking-[0.2em] uppercase text-[#CFB089] group-hover:gap-5 transition-all">Baca Selengkapnya <FaArrowRight /></div>
                </div>
            </div>
            <div onClick={() => setSelectedArticle(articlesData['b3'])} className="lg:col-span-1 relative h-[350px] md:h-[450px] rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-2xl transition-transform hover:scale-[1.01]">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('${articlesData['b3'].image}')` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B251C] via-[#0B251C]/20 to-transparent opacity-90"></div>
                <div className="absolute top-8 left-8 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-[#CFB089]"><FaBiohazard size={20}/></div>
                <div className="absolute top-8 right-8 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-bold tracking-[0.2em] uppercase text-white/80">Hazard</div>
                <div className="absolute bottom-0 left-0 p-8 w-full">
                    <h3 className="font-serif text-2xl md:text-3xl text-white mb-4 leading-tight">Limbah B3</h3>
                    <div className="flex items-center gap-3 text-xs font-bold tracking-[0.2em] uppercase text-[#CFB089] group-hover:gap-5 transition-all">Baca Selengkapnya <FaArrowRight /></div>
                </div>
            </div>
            <div onClick={() => setSelectedArticle(articlesData['jelantah'])} className="lg:col-span-2 relative h-[350px] md:h-[450px] rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-2xl transition-transform hover:scale-[1.01]">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('${articlesData['jelantah'].image}')` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B251C] via-[#0B251C]/30 to-transparent opacity-90"></div>
                <div className="absolute top-8 left-8 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-[#CFB089]"><FaBolt size={20}/></div>
                <div className="absolute top-8 right-8 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-bold tracking-[0.2em] uppercase text-white/80">Innovation</div>
                <div className="absolute bottom-0 left-0 p-8 md:p-10 w-full md:w-3/4">
                    <h3 className="font-serif text-3xl md:text-4xl text-white mb-4 leading-tight">Energi Terbarukan: Jelantah</h3>
                    <div className="flex items-center gap-3 text-xs font-bold tracking-[0.2em] uppercase text-[#CFB089] group-hover:gap-5 transition-all">Baca Selengkapnya <FaArrowRight /></div>
                </div>
            </div>
        </div>
      </section>

      {/* JADWAL SECTION */}
      <section id="jadwal" className="py-24 px-6 md:px-12 bg-[#0E2923] border-t border-white/5">
        <div className="text-center mb-20">
            <span className="text-[#CFB089] text-xs font-bold tracking-[0.3em] uppercase block mb-4">Routine Logistics</span>
            <h2 className="font-serif text-5xl text-[#F4E9D8]">Jadwal <span className="italic text-[#CFB089]">Penjemputan</span></h2>
            <div className="w-16 h-[1px] bg-[#CFB089] mx-auto mt-8 opacity-50"></div>
            <p className="mt-4 text-gray-500 text-[10px] font-bold tracking-[0.2em] uppercase">Layanan Eksklusif Untuk Wilayah {clusterName}</p>
        </div>
        {schedules.length === 0 ? (
           <div className="text-center p-12 bg-[#14332C] rounded-[2.5rem] border border-white/5 max-w-2xl mx-auto"><FaCalendarAlt className="text-4xl text-[#CFB089] mx-auto mb-4"/><h3 className="text-white font-serif text-2xl mb-2">Jadwal Belum Tersedia</h3><p className="text-gray-400 text-sm">Admin belum menambahkan jadwal.</p></div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {schedules.map((card, index) => (
                  <div key={index} className="bg-[#14332C] p-12 rounded-[2.5rem] relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500 border border-white/5 shadow-xl">
                      <div className="absolute top-0 right-0 p-20 bg-[#CFB089] opacity-[0.02] rounded-full blur-2xl group-hover:opacity-[0.05] transition"></div>
                      <span className="bg-[#CFB089] text-[#0E2923] text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest inline-block mb-8">{card.category || 'Umum'}</span>
                      <h3 className="font-serif text-4xl mb-4 text-white">{card.day}</h3>
                      <div className="text-[#CFB089] text-sm mb-8 flex items-center gap-3 font-mono opacity-80"><FaClock/> {card.time}</div>
                      <div className="border-l-2 border-[#CFB089]/30 pl-6"><p className="text-gray-400 text-sm italic leading-relaxed">"{card.note}"</p></div>
                  </div>
              ))}
           </div>
        )}
      </section>

      {/* FORM ADUAN & RIWAYAT LAPORAN */}
      <section className="py-24 px-6 md:px-12 bg-[#0E2923] relative border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
            
            <div className="flex flex-col lg:flex-row gap-12">
                
                {/* KOLOM KIRI: TULIS LAPORAN */}
                <div className="lg:w-1/2 flex flex-col">
                    <div className="mb-10">
                         <span className="text-[#CFB089] text-xs font-bold tracking-[0.3em] uppercase mb-6 block">Concierge Layanan</span>
                         <h2 className="font-serif text-5xl md:text-6xl leading-tight mb-6 text-white">Layanan Kendala <br/> <span className="italic text-[#CFB089]">& Aspirasi</span></h2>
                         <div className="pl-8 border-l border-[#CFB089]/20"><p className="text-gray-500 italic font-serif text-lg leading-relaxed">"Sampaikan laporan atau kendala Anda di sini."</p></div>
                    </div>

                    <div className="bg-[#14332C] p-8 rounded-[3rem] shadow-2xl border border-white/5 relative overflow-hidden flex-1">
                        <div className="flex items-center gap-4 mb-8"><div className="w-10 h-10 rounded-xl bg-[#CFB089]/10 flex items-center justify-center text-[#CFB089]"><FaPaperPlane /></div><span className="text-[#CFB089] font-bold text-xs tracking-[0.2em] uppercase">Tulis Laporan Baru</span></div>
                        <div className="flex flex-col gap-6">
                            <textarea className="w-full h-40 bg-[#0E2923] border border-white/10 rounded-3xl p-6 text-gray-300 focus:outline-none focus:border-[#CFB089] transition-colors resize-none placeholder:text-gray-600 font-serif italic text-lg" placeholder="Jelaskan kendala..." value={laporanText} onChange={(e) => setLaporanText(e.target.value)}></textarea>
                            <div className="flex justify-end items-center gap-4">
                                {laporanStatus === 'success' && (<span className="text-green-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 animate-pulse"><FaCheckCircle/> Terkirim</span>)}
                                <button onClick={handleKirimLaporan} disabled={laporanStatus === 'sending' || !laporanText} className={`bg-[#CFB089] text-[#0E2923] px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-3 ${laporanStatus === 'sending' ? 'opacity-50' : 'hover:bg-[#bfa27a]'}`}>{laporanStatus === 'sending' ? 'Mengirim...' : 'Kirim Laporan'} <FaPaperPlane className="text-sm"/></button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KOLOM KANAN: PANTAU STATUS */}
                <div className="lg:w-1/2 flex flex-col">
                     <div className="mb-10 lg:mt-10">
                        <span className="text-[#CFB089] text-xs font-bold tracking-[0.3em] uppercase mb-4 block">Tracking System</span>
                        <h2 className="font-serif text-3xl text-white">Pantau Status <span className="italic text-[#CFB089]">Laporan</span></h2>
                    </div>

                    <div className="flex-1 flex flex-col gap-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                        {reports.length === 0 ? (
                            <div className="p-8 border border-white/10 border-dashed rounded-[2rem] text-center text-gray-500">
                                <FaHistory className="mx-auto text-3xl mb-3 opacity-50"/>
                                <p>Belum ada riwayat laporan di area ini.</p>
                            </div>
                        ) : (
                            reports.map((item) => (
                                <div key={item.id} className="bg-[#14332C] p-6 rounded-[2rem] border border-white/5 shadow-md flex gap-4 items-start hover:bg-[#1a4037] transition-colors">
                                    {/* Icon Status */}
                                    <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-xl 
                                        ${item.status === 'Selesai' ? 'bg-green-500/20 text-green-400' : 
                                          item.status === 'Proses' ? 'bg-yellow-500/20 text-yellow-400' : 
                                          'bg-red-500/20 text-red-400'}`}>
                                        {item.status === 'Selesai' ? <FaCheckCircle/> : 
                                         item.status === 'Proses' ? <FaSpinner className="animate-spin"/> : 
                                         item.status === 'Ditolak' ? <FaTimes/> : 
                                         <FaClock/>}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-md
                                                ${item.status === 'Selesai' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                                                  item.status === 'Proses' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 
                                                  'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                                {item.status || 'Pending'}
                                            </span>
                                            <span className="text-[10px] text-gray-500">{formatDate(item.createdAt)}</span>
                                        </div>
                                        <p className="text-gray-300 text-sm leading-relaxed font-serif italic line-clamp-2 mb-2">"{item.description}"</p>
                                        
                                        {item.adminResponse && (
                                            <div className="mt-3 bg-[#0E2923] p-3 rounded-xl border-l-2 border-[#CFB089]">
                                                <p className="text-[10px] text-[#CFB089] font-bold uppercase mb-1">Tanggapan Admin:</p>
                                                <p className="text-xs text-gray-400 italic">"{item.adminResponse}"</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
      </section>

      {/* --- MODAL POPUP --- */}
      {selectedArticle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedArticle(null)}></div>
            <div className="bg-[#0B251C] w-full max-w-4xl max-h-[90vh] rounded-[2rem] overflow-hidden relative z-10 flex flex-col md:flex-row shadow-2xl border border-white/10 animate-in fade-in zoom-in duration-300">
                <button onClick={() => setSelectedArticle(null)} className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"><FaTimes /></button>
                <div className="w-full md:w-1/2 h-[250px] md:h-auto relative">
                    <img src={selectedArticle.image} className="w-full h-full object-cover" alt="Article"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B251C] to-transparent md:bg-gradient-to-r"></div>
                    <div className="absolute bottom-6 left-6"><span className="bg-[#CFB089] text-[#0E2923] px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-2 inline-block">{selectedArticle.category}</span></div>
                </div>
                <div className="w-full md:w-1/2 p-8 md:p-10 overflow-y-auto custom-scrollbar">
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-4"><FaCalendar className="text-[#CFB089]"/> <span>Edisi Lingkungan</span></div>
                    <h2 className="font-serif text-3xl text-white mb-6 leading-tight">{selectedArticle.title}</h2>
                    <div className="prose prose-invert prose-sm text-gray-300 font-light leading-relaxed" dangerouslySetInnerHTML={{ __html: selectedArticle.content }}></div>
                    <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3 text-xs text-gray-500"><FaUserCircle className="text-xl text-[#CFB089]"/><span>Tim Edukasi DaurKita</span></div>
                </div>
            </div>
        </div>
      )}

      <footer className="py-10 text-center bg-[#091f17] border-t border-white/5"><p className="text-gray-600 text-[10px] tracking-[0.3em] uppercase">&copy; 2025 Daur Kita Premium.</p></footer>
    </main>
  );
}

// 3. INI BAGIAN UTAMANYA. EXPORT DEFAULT DISINI.
export default function UserDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0E2923] flex items-center justify-center text-[#CFB089]">Loading Dashboard...</div>}>
      <UserDashboardContent />
    </Suspense>
  );
}