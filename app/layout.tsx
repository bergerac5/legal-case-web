import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { AuthProvider } from "@/context/AuthContex";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Legol Case",
  description: "Legal Case Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <html lang="en">
     <body className={`${inter.className} $ antialiased`}>
       <AuthProvider>
         <Providers>{children}</Providers> {/* React Query Provider */}
       </AuthProvider>
       <footer className="mt-12 pt-6 text-center text-sm text-gray-500 mb-0">
  © {new Date().getFullYear()} Rwanda Energy Group (REG) – All rights reserved.  
</footer>
     </body>
   </html>
  );
}
