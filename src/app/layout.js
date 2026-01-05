import "./globals.css";
import { Montserrat, Playfair_Display } from "next/font/google";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { Toaster } from "sonner"; // <--- IMPORT INI

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });

export const metadata = {
  title: "Daur Kita | Premium Waste Management",
  description: "Sistem manajemen limbah hunian eksklusif.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${montserrat.variable} ${playfair.variable} scroll-smooth`}>
      <body className="antialiased font-sans bg-[#0F2C23] text-white">
        <AuthProvider>
          {children}
          {/* Tambahkan komponen Toaster di sini */}
          <Toaster position="bottom-right" theme="dark" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}