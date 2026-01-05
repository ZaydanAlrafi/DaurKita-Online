// src/lib/db.js

// Kunci penyimpanan di browser
const DB_KEY = 'daurkita_database';
const REPORT_KEY = 'daurkita_laporan';

// Data bawaan (Hanya muncul jika Admin belum hapus/edit)
const DEFAULT_DB = {
  'PBB': {
    greeting: "Selamat Datang, Admin PBB",
    title: "Sistem Pajak Terpadu",
    subtitle: "Jadwal Pelayanan Kantor",
    scheduleTitle: "Jadwal Operasional",
    cards: [
      { title: "Senin - Jumat", time: "08:00 - 15:00 WIB", desc: "Pelayanan loket pembayaran.", tag: "HARI KERJA", icon: "clock" },
      { title: "Sabtu & Minggu", time: "Tutup / Libur", desc: "Gunakan layanan online.", tag: "AKHIR PEKAN", icon: "calendar" },
      { title: "Layanan Online", time: "24 Jam", desc: "Via ATM/Mobile Banking.", tag: "DIGITAL", icon: "clock" }
    ],
    aduanTitle: "Pusat Bantuan PBB",
    aduanPlaceholder: "Kendala pembayaran..."
  },
  'GRIAYA01': {
    greeting: "Selamat Datang, Warga GRIYA01",
    title: "Kebersihan Adalah Kemewahan",
    subtitle: "Pengelolaan Limbah Terpadu",
    scheduleTitle: "Jadwal Penjemputan",
    cards: [
      { title: "Senin & Kamis", time: "08:00 - 10:00 WIB", desc: "Sampah domestik di pagar.", tag: "UMUM", icon: "clock" },
      { title: "Selasa", time: "08:00 WIB", desc: "Limbah dapur (Organik).", tag: "ORGANIK", icon: "calendar" },
      { title: "Jumat", time: "08:30 WIB", desc: "Limbah B3 & Elektronik.", tag: "B3 & LAINNYA", icon: "clock" }
    ],
    aduanTitle: "Layanan Aduan Griya01",
    aduanPlaceholder: "Keluhan sampah di blok Anda..."
  }
};

// --- FUNGSI UNTUK USER ---

// 1. Ambil Data Cluster (Untuk Dashboard)
export const getClusterData = (code) => {
  if (typeof window === 'undefined') return null;
  
  const savedData = localStorage.getItem(DB_KEY);
  let db = savedData ? JSON.parse(savedData) : DEFAULT_DB;
  
  // Normalisasi kode (Huruf Besar)
  const key = code.toUpperCase();
  
  // Jika data ada, kembalikan datanya. Jika tidak, kembalikan null (Ditolak)
  return db[key] || null;
};

// 2. Simpan Laporan User (Untuk Masalah No. 1)
export const saveReport = (cluster, message) => {
  if (typeof window === 'undefined') return;

  const savedReports = localStorage.getItem(REPORT_KEY);
  const reports = savedReports ? JSON.parse(savedReports) : [];

  const newReport = {
    id: Date.now(),
    cluster: cluster,
    message: message,
    date: new Date().toLocaleString(),
    status: 'Baru'
  };

  reports.unshift(newReport); // Masukan ke paling atas
  localStorage.setItem(REPORT_KEY, JSON.stringify(reports));
  return true;
};

// 3. Cek Apakah Kode Valid (Untuk Masalah No. 2)
export const checkCodeValidity = (code) => {
    const data = getClusterData(code);
    return !!data; // Mengembalikan true jika data ada, false jika tidak
};