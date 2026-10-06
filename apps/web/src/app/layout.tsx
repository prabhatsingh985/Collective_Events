import './globals.css';
import type { Metadata } from 'next';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { WmsProvider } from '../context/WmsContext';

export const metadata: Metadata = {
  title: 'KhelWMS | Toy Warehouse Management System & BIS Compliance Hub',
  description: 'Production-grade WMS engineered for Indian toy distribution centers, featuring BIS certification tracking, S-curve wave picking, GST compliance & multi-courier dispatch.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
        <WmsProvider>
          <Navbar />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              {children}
            </main>
          </div>
        </WmsProvider>
      </body>
    </html>
  );
}
