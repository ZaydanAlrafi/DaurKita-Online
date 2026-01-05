"use client";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { Leaf, Recycle, Zap, Droplets, ArrowUpRight, X, BookOpen } from "lucide-react";

export default function EducationPage() {
  const [activeArticle, setActiveArticle] = useState(null);

  const articles = [
    {
      id: 1,
      category: "Guide",
      title: "Seni Memilah Sampah Organik",
      desc: "Panduan estetika mengelola sisa makanan menjadi kompos premium.",
      // IMAGE: Daun Gelap Berembun (Sangat tajam, hijau tua, sesuai background)
      image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=2832&auto=format&fit=crop",
      content: `Mengelola sampah organik bukan sekadar kewajiban, tapi sebuah seni untuk mengembalikan nutrisi ke bumi. Sisa makanan seperti kulit buah, potongan sayur, dan ampas kopi adalah 'emas hitam' bagi tanaman Anda.
      
      Langkah pertama adalah memisahkan sampah basah (organik) dari sampah kering sejak dari dapur. Gunakan wadah tertutup namun berventilasi.`,
      icon: <Leaf size={24} />,
      color: "bg-green-500",
      colSpan: "md:col-span-2",
    },
    {
      id: 2,
      category: "Recycle",
      title: "Plastik: Ancaman & Peluang",
      desc: "Mengubah limbah botol menjadi nilai ekonomi baru.",
      // IMAGE: Botol Plastik Bening dengan Cahaya Dramatis (Elegan, tidak kotor)
      image: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?q=80&w=2836&auto=format&fit=crop",
      content: `Plastik membutuhkan waktu hingga 1000 tahun untuk terurai. Namun, di tangan yang tepat, plastik adalah sumber daya. Botol PET (bening) memiliki nilai daur ulang tertinggi.
      
      Pastikan Anda meremukkan botol plastik sebelum membuangnya untuk menghemat ruang penyimpanan.`,
      icon: <Recycle size={24} />,
      color: "bg-blue-500",
      colSpan: "md:col-span-1",
    },
    {
      id: 3,
      category: "Hazard",
      title: "Bahaya Limbah B3",
      desc: "Jangan buang baterai dan elektronik sembarangan.",
      // IMAGE: Komponen Emas/Hitam (Detail teknologi yang terlihat mewah)
      image: "https://images.unsplash.com/photo-1591123720164-de1348028a82?q=80&w=2832&auto=format&fit=crop",
      content: `Limbah B3 (Bahan Berbahaya dan Beracun) seperti baterai bekas, lampu neon, kaleng aerosol, dan limbah elektronik (e-waste) mengandung logam berat yang bisa mencemari air tanah jika dibuang sembarangan.`,
      icon: <Zap size={24} />,
      color: "bg-yellow-500",
      colSpan: "md:col-span-1",
    },
    {
      id: 4,
      category: "Innovation",
      title: "Minyak Jelantah Jadi Emas",
      desc: "Program penukaran minyak bekas menjadi saldo e-wallet.",
      // IMAGE: Cairan Emas/Madu Gelap (Tidak terlalu terang/neon seperti sebelumnya)
      image: "https://images.unsplash.com/photo-1516054575922-f0b8eeadec1a?q=80&w=2874&auto=format&fit=crop",
      content: `Membuang minyak jelantah ke saluran air adalah kesalahan fatal yang bisa menyumbat pipa dan mencemari sungai. Satu liter minyak bisa mencemari jutaan liter air bersih.`,
      icon: <Droplets size={24} />,
      color: "bg-[#C8A165]",
      colSpan: "md:col-span-2",
    },
  ];

  return (
    <main className="min-h-screen bg-[#0F2C23] text-white selection:bg-[#C8A165] selection:text-[#0F2C23]">
      <Navbar />

      <div className="luxury-container pt-32 pb-20 px-6 md:px-12">
        <div className="text-center mb-20 animate-fade-up">
          <span className="luxury-subheading">Knowledge Center</span>
          <h1 className="font-luxury italic text-5xl md:text-7xl mb-6">
            Ensiklopedia <span className="text-[#C8A165]">Lestari.</span>
          </h1>
          <p className="text-white/40 max-w-2xl mx-auto text-lg leading-relaxed font-serif">
            "Wawasan mendalam tentang keberlanjutan, dikurasi khusus untuk warga yang peduli pada masa depan bumi."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((item, idx) => (
            <div 
              key={item.id} 
              className={`group relative rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl cursor-pointer min-h-[450px] flex flex-col justify-end border border-white/10 ${item.colSpan}`}
              style={{ animationDelay: `${idx * 100}ms` }}
              onClick={() => setActiveArticle(item)}
            >
              {/* --- GAMBAR LATAR BELAKANG --- */}
              {/* RAHASIA: brightness-75 (sedikit redup), grayscale-30 (warna tidak norak), sepia-20 (hangat) */}
              <img 
                src={item.image} 
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 brightness-75 grayscale-[0.3] sepia-[0.2] group-hover:brightness-90 group-hover:grayscale-0"
              />

              {/* --- GRADIENT OVERLAY --- */}
              {/* Hitam pekat di bawah untuk teks, transparan di tengah untuk gambar */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#020A08] via-[#0F2C23]/60 to-transparent opacity-90 transition-opacity"></div>

              {/* --- KONTEN --- */}
              <div className="relative z-10 p-10 h-full flex flex-col justify-between">
                
                <div className="flex justify-between items-start">
                  <div className={`w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-lg group-hover:bg-[#C8A165] group-hover:text-[#0F2C23] transition-all duration-500`}>
                    {item.icon}
                  </div>
                  <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-white/90 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full">
                    {item.category}
                  </span>
                </div>

                <div>
                  <h3 className="font-luxury text-3xl md:text-5xl mb-6 text-white leading-tight drop-shadow-2xl group-hover:text-[#C8A165] transition-colors">
                    {item.title}
                  </h3>
                  
                  {/* Background teks lebih gelap agar selalu terbaca */}
                  <div className="mb-6 p-4 rounded-xl bg-black/30 backdrop-blur-sm border border-white/5 transition-all group-hover:bg-black/50">
                     <p className="text-white/90 text-sm leading-relaxed font-serif line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/70 group-hover:text-white transition-colors">
                    Baca Selengkapnya <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"/>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-24 text-center border-t border-white/5 pt-10">
          <p className="text-white/20 text-xs italic">Konten diperbarui secara berkala oleh tim ahli lingkungan.</p>
        </div>
      </div>

      {/* --- MODAL --- */}
      {activeArticle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity" onClick={() => setActiveArticle(null)}></div>
          <div className="relative w-full max-w-2xl bg-[#0F2C23] border border-[#C8A165]/50 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-full animate-fade-up">
            <div className="flex items-center justify-between p-8 border-b border-white/10 bg-[#081A15]">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full ${activeArticle.color} flex items-center justify-center text-white shadow-lg`}>{activeArticle.icon}</div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-white/50">{activeArticle.category}</span>
              </div>
              <button onClick={() => setActiveArticle(null)} className="w-10 h-10 rounded-full bg-white/5 hover:bg-red-500 hover:text-white text-white/50 flex items-center justify-center transition-all"><X size={20} /></button>
            </div>
            <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar">
              <h2 className="font-luxury italic text-4xl md:text-5xl mb-8 text-white leading-tight">{activeArticle.title}</h2>
              <div className="space-y-6 text-lg text-white/80 font-serif leading-relaxed">
                {activeArticle.content.split('\n\n').map((paragraph, i) => (<p key={i}>{paragraph}</p>))}
              </div>
              <div className="mt-10 p-6 bg-[#C8A165]/10 border-l-4 border-[#C8A165] rounded-r-xl">
                 <p className="text-[#C8A165] italic text-sm font-bold flex items-center gap-2"><BookOpen size={16}/> "Langkah kecil Anda hari ini adalah warisan besar untuk masa depan."</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}