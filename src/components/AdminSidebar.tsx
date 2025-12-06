'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [userRole, setUserRole] = useState<string>('');

    useEffect(() => {
        // Defer localStorage access and setState to avoid synchronous update
        setTimeout(() => {
            const userStr = localStorage.getItem('adminUser');
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    setUserRole(user.role);
                } catch (e) {
                    console.error("Lỗi đọc thông tin user", e);
                }
            }
        }, 0);
    }, []);

    // Hàm kiểm tra active menu (để đổi màu cam)
    const isActive = (path: string) => {
        if (path === '/admin' && pathname === '/admin') return 'bg-[#f97316] text-white shadow-lg shadow-orange-500/30';
        if (path !== '/admin' && pathname.startsWith(path)) return 'bg-[#f97316] text-white shadow-lg shadow-orange-500/30';
        return 'text-gray-400 hover:bg-gray-800 hover:text-white';
    };

    const handleLogout = () => {
        if (confirm('Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?')) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            router.push('/admin/login');
        }
    };

    return (
        <aside className="w-64 bg-[#0f172a] min-h-screen text-white flex flex-col fixed left-0 top-0 bottom-0 z-50 border-r border-gray-800">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-gray-800 flex-shrink-0 bg-[#0f172a]">
                <a href="/admin">
                    <span className="text-xl font-black text-white tracking-tight">VINARACK <span className="text-[#f97316] text-xs font-bold px-1 rounded bg-orange-900/30 ml-1">ADMIN</span></span>
                </a>    
           </div>

            {/* Menu Scrollable Area */}
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
                
                <Link href="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive('/admin')}`}>
                    <i className="fas fa-chart-pie w-5 text-center group-hover:scale-110 transition-transform"></i>
                    <span className="font-medium text-sm">Tổng Quan</span>
                </Link>

                <div className="px-4 text-[10px] font-bold text-gray-500 uppercase mt-6 mb-2 tracking-wider">Quản Lý Nội Dung</div>
                <Link href="/admin/media" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive('/admin/media')}`}>
                    <i className="fas fa-images w-5 text-center group-hover:scale-110 transition-transform"></i>
                    <span className="font-medium text-sm">Thư Viện Media</span>
                </Link>
                
                <Link href="/admin/products" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive('/admin/products')}`}>
                    <i className="fas fa-boxes w-5 text-center group-hover:scale-110 transition-transform"></i>
                    <span className="font-medium text-sm">Sản Phẩm</span>
                </Link>

                <Link href="/admin/news" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive('/admin/news')}`}>
                    <i className="far fa-newspaper w-5 text-center group-hover:scale-110 transition-transform"></i>
                    <span className="font-medium text-sm">Tin Tức</span>
                </Link>

                <Link href="/admin/projects" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive('/admin/projects')}`}>
    <i className="fas fa-project-diagram w-5 text-center group-hover:scale-110 transition-transform"></i>
    <span className="font-medium text-sm">Dự Án</span>
</Link>

                <Link href="/admin/recruitment" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive('/admin/recruitment')}`}>
                    <i className="fas fa-briefcase w-5 text-center group-hover:scale-110 transition-transform"></i>
                    <span className="font-medium text-sm">Tuyển Dụng</span>
                </Link>

                <div className="px-4 text-[10px] font-bold text-gray-500 uppercase mt-6 mb-2 tracking-wider">Khách Hàng</div>

                <Link href="/admin/contacts" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive('/admin/contacts')}`}>
                    <i className="far fa-envelope w-5 text-center group-hover:scale-110 transition-transform"></i>
                    <span className="font-medium text-sm">Liên Hệ & Báo Giá</span>
                </Link>
                
                <Link href="/admin/applications" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive('/admin/applications')}`}>
                    <i className="fas fa-user-friends w-5 text-center group-hover:scale-110 transition-transform"></i>
                    <span className="font-medium text-sm">Hồ Sơ Ứng Viên</span>
                </Link>

                {userRole === 'admin' && (
                    <>
                        <div className="px-4 text-[10px] font-bold text-gray-500 uppercase mt-6 mb-2 tracking-wider">Hệ Thống</div>
                        <Link href="/admin/users" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive('/admin/users')}`}>
                            <i className="fas fa-user-cog w-5 text-center group-hover:scale-110 transition-transform"></i>
                            <span className="font-medium text-sm">Tài Khoản</span>
                        </Link>
                    </>
                )}
            </nav>

            {/* Logout Section */}
            <div className="p-4 border-t border-gray-800 bg-[#0f172a]">
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-all duration-200 group"
                >
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
                        <i className="fas fa-sign-out-alt text-sm"></i>
                    </div>
                    <span className="font-medium text-sm">Đăng Xuất</span>
                </button>
            </div>
        </aside>
    );
}