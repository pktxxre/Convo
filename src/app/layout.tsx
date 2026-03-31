import type { Metadata } from 'next';
import './globals.css';
import { SessionProvider } from '@/context/SessionContext';

export const metadata: Metadata = {
  title: 'Convo — Campus Social',
  description: 'Connect with students at your university.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
