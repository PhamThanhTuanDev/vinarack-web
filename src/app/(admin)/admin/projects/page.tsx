'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAdminProjects, deleteProject } from '@/services/api';
import toast from 'react-hot-toast';

export default function AdminProjects() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const data = await getAdminProjects();
            setProjects(data);
        } catch (error) {
            toast.error("Lỗi tải danh sách dự án");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: number) => {
        if (confirm('Bạn có chắc muốn xóa dự án này?')) {
            try {
                await deleteProject(id);
                setProjects(prev => prev.filter(p => p.id !== id));
                toast.success('Đã xóa thành công!');
            } catch (error) {
                toast.error('Lỗi khi xóa dự án');
            }
        }
    };

    if (loading) return <div className="p-8 text-center">Đang tải dữ liệu...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản Lý Dự Án</h1>
                <Link href="/admin/projects/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition flex items-center gap-2">
                    <i className="fas fa-plus"></i> Thêm Dự Án
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 w-16">ID</th>
                            <th className="px-6 py-3 w-24">Hình ảnh</th>
                            <th className="px-6 py-3">Tên dự án</th>
                            <th className="px-6 py-3">Khách hàng</th>
                            <th className="px-6 py-3">Ngành nghề</th>
                            <th className="px-6 py-3 text-center">Nổi bật</th>
                            <th className="px-6 py-3 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.length > 0 ? (
                            projects.map((project) => (
                                <tr key={project.id} className="bg-white border-b hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">{project.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="w-16 h-12 rounded overflow-hidden border border-gray-200">
                                            <img src={project.thumbnail_url || 'https://placehold.co/100?text=No+Img'} className="w-full h-full object-cover" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-800">
                                        {project.title}
                                        <p className="text-xs text-gray-400 font-normal mt-1"><i className="fas fa-map-marker-alt mr-1"></i> {project.location}</p>
                                    </td>
                                    <td className="px-6 py-4">{project.customer_name}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                            {project.industry}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {project.is_featured ? (
                                            <i className="fas fa-star text-yellow-400 text-lg"></i>
                                        ) : (
                                            <i className="far fa-star text-gray-300"></i>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-3">
                                            <Link href={`/admin/projects/edit/${project.id}`} className="text-blue-600 hover:text-blue-900"><i className="fas fa-edit"></i></Link>
                                            <button onClick={() => handleDelete(project.id)} className="text-red-600 hover:text-red-900"><i className="fas fa-trash-alt"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">Chưa có dự án nào.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}