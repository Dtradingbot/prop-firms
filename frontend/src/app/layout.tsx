import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: 'PropFirmHub - #1 Prop Trading Firm Directory', template: '%s | PropFirmHub' },
  description: 'Compare the best prop trading firms. Find top funded trader programs, profit splits, and exclusive discount codes.',
  keywords: ['prop firm', 'funded trader', 'prop trading', 'FTMO', 'funded account', 'trading firm'],
  openGraph: {
    type: 'website',
    siteName: 'PropFirmHub',
    title: 'PropFirmHub - #1 Prop Trading Firm Directory',
    description: 'Compare the best prop trading firms and find the perfect funded account.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            {children}
            <Toaster position="top-right" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
