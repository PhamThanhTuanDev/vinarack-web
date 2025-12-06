'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAdminJobs, deleteJob } from '@/services/api';

export default function AdminRecruitment() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const data = await getAdminJobs();
            setJobs(data);
        } catch (error) {
            console.error("Lỗi tải tin tuyển dụng:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: number) => {
        if (confirm('Bạn có chắc muốn xóa tin tuyển dụng này?')) {
            try {
                await deleteJob(id);
                fetchData();
                alert('Đã xóa thành công!');
            } catch (error) {
                alert('Lỗi khi xóa tin tuyển dụng');
            }
        }
    };

    if (loading) return <div className="p-8 text-center">Đang tải dữ liệu...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản Lý Tuyển Dụng</h1>
                <Link href="/admin/recruitment/create" className="bg-[#f97316] text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-600 transition flex items-center gap-2">
                    <i className="fas fa-plus"></i> Đăng Tin Mới
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 w-16">ID</th>
                            <th className="px-6 py-3">Vị trí</th>
                            <th className="px-6 py-3">Phòng ban</th>
                            <th className="px-6 py-3">Mức lương</th>
                            <th className="px-6 py-3">Hạn nộp</th>
                            <th className="px-6 py-3 text-center">Trạng thái</th>
                            <th className="px-6 py-3 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.length > 0 ? (
                            jobs.map((job) => (
                                <tr key={job.id} className="bg-white border-b hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">{job.id}</td>
                                    <td className="px-6 py-4 font-bold text-gray-800">
                                        {job.title}
                                        <p className="text-xs text-gray-400 font-normal mt-1"><i className="fas fa-map-marker-alt mr-1"></i> {job.location}</p>
                                    </td>
                                    <td className="px-6 py-4">{job.department}</td>
                                    <td className="px-6 py-4 font-medium text-green-600">{job.salary_range}</td>
                                    <td className="px-6 py-4">{new Date(job.deadline).toLocaleDateString('vi-VN')}</td>
                                    <td className="px-6 py-4 text-center">
                                        {job.status === 'open' ? (
                                            <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-0.5 rounded">Đang tuyển</span>
                                        ) : (
                                            <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-0.5 rounded">Đã đóng</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-3">
                                            <Link href={`/admin/recruitment/edit/${job.id}`} className="text-blue-600 hover:text-blue-900"><i className="fas fa-edit"></i></Link>
                                            <button onClick={() => handleDelete(job.id)} className="text-red-600 hover:text-red-900"><i className="fas fa-trash-alt"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">Chưa có tin tuyển dụng nào.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}