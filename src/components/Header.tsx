'use client'; // Bắt buộc vì có sử dụng state (useState)

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname(); // Lấy đường dẫn hiện tại

    // --> ĐOẠN MỚI THÊM: Ẩn Header nếu đang ở trang Admin <--
    if (pathname && pathname.startsWith('/admin')) {
        return null;
    }
    // -----------------------------------------------------

    // Hàm kiểm tra active menu
    const isActive = (path: string) => pathname === path ? 'text-vinarackOrange' : 'text-gray-600 hover:text-vinarackOrange';

    return (
        <header className="sticky top-0 z-50">
            {/* TOP BAR */}
            <div className="bg-[#0a2745] text-gray-300 py-2 text-sm hidden md:block border-b border-gray-700">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex space-x-6">
                        <span><i className="fas fa-envelope mr-2 text-[#f97316]"></i> contact@vinarack.vn</span>
                        <span><i className="fas fa-phone-alt mr-2 text-[#f97316]"></i> 0909.787.797</span>
                    </div>
                    <div className="flex space-x-4">
                        <span className="text-white font-bold cursor-pointer">VN</span>
                        <span className="text-gray-500">|</span>
                        <span className="hover:text-white cursor-pointer">EN</span>
                    </div>
                </div>
            </div>

            {/* NAVBAR */}
            <nav className="bg-white border-b border-gray-100 shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-[#0f3a68] text-white flex items-center justify-center font-bold text-xl rounded">V</div>
                                <span className="font-black text-2xl text-[#0f3a68] tracking-tighter">VINARACK</span>
                            </Link>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex space-x-8 items-center font-medium">
                            <Link href="/" className={`transition ${isActive('/')}`}>Trang chủ</Link>
                            <Link href="/products" className={`transition ${isActive('/products')}`}>Sản phẩm</Link>
                            <Link href="/services" className={`transition ${isActive('/services')}`}>Dịch vụ</Link>
                            <Link href="/projects" className={`transition ${isActive('/projects')}`}>Dự án</Link>
                            <Link href="/news" className={`transition ${isActive('/news')}`}>Tin tức</Link>
                            <Link href="/contact" className={`transition ${isActive('/contact')}`}>Liên hệ</Link>
                            <Link href="/contact" className="px-6 py-2 bg-[#f97316] text-white rounded font-bold hover:bg-orange-700 transition shadow-lg transform hover:-translate-y-0.5">
                                Báo Giá
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button 
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="text-gray-600 hover:text-[#0f3a68] focus:outline-none"
                            >
                                <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Panel */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-lg">
                        <Link href="/" className="block py-3 px-4 text-[#0f3a68] font-bold bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>Trang chủ</Link>
                        <Link href="/products" className="block py-3 px-4 text-gray-600 hover:bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>Sản phẩm</Link>
                        <Link href="/services" className="block py-3 px-4 text-gray-600 hover:bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>Dịch vụ</Link>
                        <Link href="/projects" className="block py-3 px-4 text-gray-600 hover:bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>Dự án</Link>
                        <Link href="/news" className="block py-3 px-4 text-gray-600 hover:bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>Tin tức</Link>
                        <Link href="/contact" className="block py-3 px-4 text-[#f97316] font-bold" onClick={() => setIsMobileMenuOpen(false)}>Nhận báo giá</Link>
                    </div>
                )}
            </nav>
        </header>
    );
}