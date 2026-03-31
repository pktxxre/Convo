import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from '@/context/SessionContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Convo — Campus Social',
  description: 'Connect with students at your university.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-[#FAFAFA] text-[#1a1a1a]">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
