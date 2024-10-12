import './globals.css';
import type { Metadata } from 'next';
import { Noto_Serif_Sinhala } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster"

const noto_sinhala = Noto_Serif_Sinhala({
  subsets: ['sinhala'],
  weight: '400'
});

export const metadata: Metadata = {
  title: 'Small Business Expense Manager',
  description: 'Manage your daily expenses efficiently',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={noto_sinhala.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}