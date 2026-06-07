
import type {Metadata} from 'next';
import './globals.css';
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase/client-provider';
import MobileNav from '@/components/layout/MobileNav';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: 'Cracklix | Punjab Exam Authority Hub',
  description: "Punjab's most trusted government exam preparation platform. PSSSB, PPSC, Punjab Police, and more.",
  authors: [{ name: 'Arsh Grewal', url: 'https://cracklix.com' }],
  other: {
    'founder': 'Arsh Grewal',
    'developer': 'Arsh Grewal',
    'platform': 'Cracklix'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
      </head>
      <body className={`${inter.variable} font-body antialiased bg-white text-[#0F172A] min-h-screen pb-20 md:pb-0`}>
        <FirebaseClientProvider>
          {children}
          <MobileNav />
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
