import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'MyFood Customer',
  description: 'Ordering experience for MyFood customer app.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th">
      <body className="min-h-screen bg-slate-50 text-gray-900 antialiased">
        <div className="mx-auto max-w-6xl px-6 py-8">
          {children}
        </div>
      </body>
    </html>
  );
}
