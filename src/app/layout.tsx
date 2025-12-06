import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header'; // Import Header
import Footer from '@/components/Footer'; // Import Footer

// Cấu hình font chữ
const roboto = Roboto({
  weight: ['300', '400', '500', '700', '900'],
  subsets: ['vietnamese'],
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: 'Vinarack - Giải Pháp Lưu Trữ Kho Hàng',
  description: 'Chuyên sản xuất và lắp đặt kệ chứa hàng công nghiệp, kệ tải nặng, kệ trung tải, sàn mezzanine.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        {/* Font Awesome CDN */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={`${roboto.className} font-sans text-gray-700 bg-white flex flex-col min-h-screen`}>
        
        {/* Header hiển thị ở mọi trang */}
        <Header />

        {/* Nội dung chính của từng trang sẽ nằm ở đây */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Footer hiển thị ở mọi trang */}
        <Footer />
        
      </body>
    </html>
  );
}