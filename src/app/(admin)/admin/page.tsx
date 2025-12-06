'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAdminProducts, getAdminNews, getAdminJobs, getAdminContacts } from '@/services/api';

// Define interfaces for the data types
interface Product {
    id: number;
    status: string;
    category_name?: string;
    // add other fields as needed
}

interface News {
    id: number;
    status: string;
    // add other fields as needed
}

interface Job {
    id: number;
    status: string;
    // add other fields as needed
}

interface Contact {
    id: number;
    full_name: string;
    phone: string;
    product_interest?: string;
    created_at: string;
    status: string;
    // add other fields as needed
}

export default function AdminDashboard() {
    // State lưu trữ dữ liệu thống kê chi tiết
    const [stats, setStats] = useState({
        products: { total: 0, active: 0, inactive: 0 },
        news: { total: 0, published: 0, draft: 0 },
        jobs: { total: 0, open: 0, closed: 0 },
        contacts: { total: 0, new: 0, processing: 0, done: 0 }
    });
    
    // State cho biểu đồ phân bố sản phẩm
    const [categoryData, setCategoryData] = useState<{name: string, count: number, percent: number}[]>([]);
    
    const [recentContacts, setRecentContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Gọi song song các API
                const [productsData, newsData, jobsData, contactsData]: [Product[], News[], Job[], Contact[]] = await Promise.all([
                    getAdminProducts(),
                    getAdminNews(),
                    getAdminJobs(),
                    getAdminContacts()
                ]);

                // 1. Thống kê Sản phẩm
                const productsActive = productsData.filter((p: Product) => p.status === 'active').length;
                
                // Tính toán phân bố theo danh mục cho biểu đồ
                const catCounts: Record<string, number> = {};
                productsData.forEach((p: Product) => {
                    const catName = p.category_name || 'Chưa phân loại';
                    catCounts[catName] = (catCounts[catName] || 0) + 1;
                });
                
                const totalProd = productsData.length || 1; // Tránh chia cho 0
                const chartData = Object.entries(catCounts)
                    .map(([name, count]) => ({
                        name,
                        count,
                        percent: Math.round((count / totalProd) * 100)
                    }))
                    .sort((a, b) => b.count - a.count); // Sắp xếp từ cao xuống thấp

                // 2. Thống kê Tin tức
                const newsPublished = newsData.filter((n: News) => n.status === 'published').length;

                // 3. Thống kê Tuyển dụng
                const jobsOpen = jobsData.filter((j: Job) => j.status === 'open').length;

                // 4. Thống kê Liên hệ
                const contactsNew = contactsData.filter((c: Contact) => c.status === 'new').length;
                const contactsProcessing = contactsData.filter((c: Contact) => c.status === 'contacted').length;

                setStats({
                    products: { total: productsData.length, active: productsActive, inactive: productsData.length - productsActive },
                    news: { total: newsData.length, published: newsPublished, draft: newsData.length - newsPublished },
                    jobs: { total: jobsData.length, open: jobsOpen, closed: jobsData.length - jobsOpen },
                    contacts: { 
                        total: contactsData.length, 
                        new: contactsNew, 
                        processing: contactsProcessing, 
                        done: contactsData.length - contactsNew - contactsProcessing 
                    }
                });

                setCategoryData(chartData);
                setRecentContacts(contactsData.slice(0, 6)); // Lấy 6 liên hệ mới nhất

            } catch (error) {
                console.error("Lỗi tải dữ liệu Dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return (
        <div className="flex h-screen items-center justify-center">
            <div className="text-center">
                <i className="fas fa-circle-notch fa-spin text-4xl text-vinarackBlue mb-4"></i>
                <p className="text-gray-500">Đang khởi tạo Dashboard...</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Tổng Quan Hệ Thống</h1>
                    <p className="text-sm text-gray-500">Cập nhật lúc: {new Date().toLocaleString('vi-VN')}</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/" target="_blank" className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm font-medium transition">
                        <i className="fas fa-external-link-alt mr-2"></i> Xem Website
                    </Link>
                </div>
            </div>
            
            {/* 1. Main Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Contacts Card (Priority) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 h-full w-1 bg-green-500"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Yêu Cầu Mới</p>
                            <h3 className="text-3xl font-black text-gray-800 mt-1">{stats.contacts.new}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <i className="fas fa-envelope"></i>
                        </div>
                    </div>
                    <div className="flex items-center text-xs">
                        <span className="font-bold text-gray-700 mr-1">{stats.contacts.total}</span> tổng số yêu cầu
                        <span className="mx-2 text-gray-300">|</span>
                        <span className="text-yellow-600 font-medium">{stats.contacts.processing} đang xử lý</span>
                    </div>
                </div>

                {/* Products Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 h-full w-1 bg-blue-500"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Sản Phẩm</p>
                            <h3 className="text-3xl font-black text-gray-800 mt-1">{stats.products.total}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <i className="fas fa-boxes"></i>
                        </div>
                    </div>
                    <div className="flex items-center text-xs">
                        <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded mr-2">{stats.products.active} Hiển thị</span>
                        <span className="text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded">{stats.products.inactive} Đang ẩn</span>
                    </div>
                </div>

                {/* News Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 h-full w-1 bg-orange-500"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Bài Viết</p>
                            <h3 className="text-3xl font-black text-gray-800 mt-1">{stats.news.total}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                            <i className="fas fa-newspaper"></i>
                        </div>
                    </div>
                    <div className="text-xs text-gray-500">
                        Đã xuất bản <span className="font-bold text-gray-800">{stats.news.published}</span> bài viết
                    </div>
                </div>

                {/* Recruitment Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 h-full w-1 bg-purple-500"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Tuyển Dụng</p>
                            <h3 className="text-3xl font-black text-gray-800 mt-1">{stats.jobs.open}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                            <i className="fas fa-briefcase"></i>
                        </div>
                    </div>
                    <div className="text-xs text-gray-500">
                        Vị trí đang mở tuyển
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* 2. Recent Contacts & Actions (Chiếm 2 cột) */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Quick Actions Bar */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center">
                        <span className="text-sm font-bold text-gray-500 uppercase mr-2 ml-2">Thao tác nhanh:</span>
                        <Link href="/admin/products/create" className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm font-medium">
                            <i className="fas fa-plus"></i> Sản phẩm mới
                        </Link>
                        <Link href="/admin/news/create" className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition text-sm font-medium">
                            <i className="fas fa-pen-nib"></i> Viết bài mới
                        </Link>
                        <Link href="/admin/recruitment/create" className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition text-sm font-medium">
                            <i className="fas fa-user-plus"></i> Đăng tuyển dụng
                        </Link>
                    </div>

                    {/* Recent Contacts Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-gray-800 text-lg">Khách Hàng Liên Hệ Gần Đây</h3>
                            <Link href="/admin/contacts" className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline">
                                Xem tất cả &rarr;
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3">Khách Hàng</th>
                                        <th className="px-6 py-3">Nhu cầu</th>
                                        <th className="px-6 py-3">Thời gian</th>
                                        <th className="px-6 py-3 text-center">Trạng Thái</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {recentContacts.length > 0 ? (
                                        recentContacts.map((contact) => (
                                            <tr key={contact.id} className="bg-white hover:bg-blue-50/50 transition">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                                            {contact.full_name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-900">{contact.full_name}</div>
                                                            <div className="text-xs text-gray-400">{contact.phone}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-gray-700 font-medium">{contact.product_interest || 'Tư vấn chung'}</span>
                                                </td>
                                                <td className="px-6 py-4 text-xs">
                                                    {new Date(contact.created_at).toLocaleDateString('vi-VN')}
                                                    <div className="text-gray-400">{new Date(contact.created_at).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}</div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {contact.status === 'new' ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                            <span className="w-1.5 h-1.5 mr-1.5 bg-red-600 rounded-full animate-pulse"></span> Mới
                                                        </span>
                                                    ) : contact.status === 'contacted' ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                            Đang xử lý
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            Hoàn tất
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                                <i className="far fa-folder-open text-3xl mb-2 block"></i>
                                                Chưa có yêu cầu nào gần đây.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* 3. Analytics Chart (Chiếm 1 cột) */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="font-bold text-gray-800 text-lg">Phân Bố Sản Phẩm</h3>
                            <p className="text-xs text-gray-500 mt-1">Theo danh mục hàng hóa</p>
                        </div>
                        <div className="p-6 space-y-6">
                            {categoryData.length > 0 ? (
                                categoryData.map((cat, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-gray-700">{cat.name}</span>
                                            <span className="text-gray-500">{cat.count} SP ({cat.percent}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                                            <div 
                                                className={`h-2.5 rounded-full ${index % 2 === 0 ? 'bg-vinarackBlue' : 'bg-vinarackOrange'}`} 
                                                style={{ width: `${cat.percent}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-400 text-sm py-4">Chưa có dữ liệu sản phẩm.</p>
                            )}
                            
                            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                                <p className="text-xs text-gray-400 mb-2">Trạng thái hệ thống</p>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-200">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    Database Connected
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}