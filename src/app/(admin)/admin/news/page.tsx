'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAdminNews, deleteNews } from '@/services/api';
import { News } from '@/types'; // Đảm bảo interface News đã có trường category, status

export default function AdminNews() {
    const [newsList, setNewsList] = useState<any[]>([]); // Dùng any tạm nếu chưa update Type
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const data = await getAdminNews();
            setNewsList(data);
        } catch (error) {
            console.error("Lỗi tải tin tức:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: number) => {
        if (confirm('Bạn có chắc muốn xóa bài viết này?')) {
            try {
                await deleteNews(id);
                fetchData();
                alert('Đã xóa thành công!');
            } catch (error) {
                alert('Lỗi khi xóa bài viết');
            }
        }
    };

    if (loading) return <div className="p-8 text-center">Đang tải dữ liệu...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản Lý Tin Tức</h1>
                <Link href="/admin/news/create" className="bg-[#f97316] text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-600 transition flex items-center gap-2">
                    <i className="fas fa-plus"></i> Viết Bài Mới
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 w-16">ID</th>
                            <th className="px-6 py-3 w-24">Hình ảnh</th>
                            <th className="px-6 py-3">Tiêu đề</th>
                            <th className="px-6 py-3">Danh mục</th>
                            <th className="px-6 py-3 text-center">Trạng thái</th>
                            <th className="px-6 py-3 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {newsList.length > 0 ? (
                            newsList.map((item) => (
                                <tr key={item.id} className="bg-white border-b hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">{item.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="w-16 h-12 rounded overflow-hidden border border-gray-200">
                                            <img src={item.thumbnail_url || 'https://placehold.co/100?text=No+Img'} className="w-full h-full object-cover" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-800">
                                        {item.title}
                                        <p className="text-xs text-gray-400 font-normal mt-1 truncate w-64">{item.summary}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded capitalize">
                                            {item.category === 'knowledge' ? 'Kiến thức' : item.category === 'company' ? 'Tin công ty' : 'Sự kiện'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {item.status === 'published' ? (
                                            <span className="text-green-600 font-bold text-xs">Đã đăng</span>
                                        ) : (
                                            <span className="text-gray-500 font-bold text-xs">Nháp</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-3">
                                            <Link href={`/admin/news/edit/${item.id}`} className="text-blue-600 hover:text-blue-900"><i className="fas fa-edit"></i></Link>
                                            <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900"><i className="fas fa-trash-alt"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Chưa có bài viết nào.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}