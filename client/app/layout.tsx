import type { Metadata } from 'next';
import { Lacquer, Caveat } from 'next/font/google';
import { lacquer, caveat } from '@/lib/fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'Feeding Brennan',
  description: 'Track restaurants, visits, and spending.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={caveat.className}>
      <body className="min-h-screen bg-brand-50 text-xl">
        <header className="border-b border-brand-600 bg-brand-500 shadow-sm">
          <div className="mx-auto max-w-5xl px-6 py-5">
            <h1 className={`${lacquer.className} text-3xl text-white`}>Feeding Brennan</h1>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
      </body>
    </html>
  );
}