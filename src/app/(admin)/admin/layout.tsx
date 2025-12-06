'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast'; // <--- Import Toaster
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (pathname === '/admin/login') {
            setIsAuthorized(true);
            return;
        }

        const token = localStorage.getItem('adminToken');
        if (!token) {
            router.push('/admin/login');
        } else {
            setIsAuthorized(true);
        }
    }, [router, pathname]);

    if (pathname === '/admin/login') {
        // Vẫn cần Toaster ở trang login để báo lỗi đăng nhập
        return (
            <>
                <Toaster position="top-center" />
                {children}
            </>
        );
    }

    if (!isAuthorized) {
        return null; 
    }

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">
            <AdminSidebar />

            <div className="flex-1 flex flex-col h-screen overflow-hidden ml-64">
                
                <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 z-10 flex-shrink-0 border-b border-gray-200">
                    <h2 className="font-bold text-gray-700 text-lg">Hệ Thống Quản Lý</h2>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-sm font-bold text-gray-800">Admin</p>
                            <p className="text-xs text-gray-500">Quản trị viên</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500">
                            <i className="fas fa-user"></i>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-8 overflow-y-auto bg-[#f8f9fc]">
                    {/* Đặt Toaster ở đây để nhận lệnh từ mọi trang con */}
                    <Toaster position="top-right" reverseOrder={false} />
                    {children}
                </main>
            </div>
        </div>
    );
}