import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'MyFood | Order from your table',
  description: 'Fast ordering experience for guests at MyFood restaurants.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
      </body>
    </html>
  );
}
