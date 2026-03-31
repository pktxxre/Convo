import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from '@/context/SessionContext';
import { ThemeProvider } from '@/context/ThemeContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Convo — Campus Social',
  description: 'Connect with students at your university.',
};

// Injected before hydration to avoid a flash of light mode on dark-mode users
const themeScript = `
  try {
    const t = localStorage.getItem('convo_theme');
    if (t === 'dark') document.documentElement.classList.add('dark');
  } catch {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans antialiased bg-[#FAFAFA] dark:bg-black text-[#1a1a1a] dark:text-[#F5F5F5]">
        <ThemeProvider>
          <SessionProvider>{children}</SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
