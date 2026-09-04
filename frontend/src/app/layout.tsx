import type { Metadata } from 'next';
import { Space_Grotesk, Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'KANBAN // RETRO - High-Impact Task Management',
  description: 'A portfolio-quality neobrutalist kanban board powered by Next.js and NestJS.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${plusJakartaSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F5F1E8] text-[#18181B] selection:bg-[#15803D] selection:text-white">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#FFFFFF',
              color: '#18181B',
              border: '2px solid #18181B',
              boxShadow: '4px 4px 0px 0px #000000',
              borderRadius: '0px',
              fontWeight: 600,
            },
          }}
        />
      </body>
    </html>
  );
}
