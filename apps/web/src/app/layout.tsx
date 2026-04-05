import './global.css';
import { Sidebar } from '../components/Sidebar';
import { SyncManager } from '../components/SyncManager';

export const metadata = {
  title: 'Silo Journal',
  description: 'Your private, self-hosted, local-first journal.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className="flex min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground"
        suppressHydrationWarning
      >
        <Sidebar />
        <main className="ml-20 flex-1 md:ml-64">
          <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8 md:py-12">
            {children}
          </div>
        </main>
        <SyncManager />
      </body>
    </html>
  );
}
