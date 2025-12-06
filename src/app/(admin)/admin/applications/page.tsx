'use client';

import React, { useEffect, useState } from 'react';
import { getApplications, updateApplicationStatus } from '@/services/api';

interface Application {
    id: number;
    full_name: string;
    introduction?: string;
    job_title?: string;
    phone: string;
    email: string;
    created_at: string;
    status: string;
    cv_url?: string;
}

export default function AdminApplications() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const data = await getApplications();
            setApplications(data);
        } catch (error) {
            console.error("Lỗi tải hồ sơ:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleStatusChange = async (id: number, newStatus: string) => {
        try {
            await updateApplicationStatus(id, newStatus);
            // Cập nhật lại UI ngay lập tức
            setApplications(prev => prev.map(app => 
                app.id === id ? { ...app, status: newStatus } : app
            ));
        } catch (error) {
            console.error(error);
            alert('Lỗi cập nhật trạng thái');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-blue-100 text-blue-800';
            case 'reviewed': return 'bg-yellow-100 text-yellow-800';
            case 'interviewed': return 'bg-purple-100 text-purple-800';
            case 'hired': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-gray-100 text-gray-600';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'new': return 'Mới nộp';
            case 'reviewed': return 'Đã xem';
            case 'interviewed': return 'Phỏng vấn';
            case 'hired': return 'Đã tuyển';
            case 'rejected': return 'Từ chối';
            default: return status;
        }
    };

    if (loading) return <div className="p-8 text-center">Đang tải dữ liệu...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản Lý Hồ Sơ Ứng Viên</h1>
                <div className="text-sm text-gray-500">Tổng số: <strong>{applications.length}</strong> hồ sơ</div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 w-10">ID</th>
                                <th className="px-6 py-3">Ứng Viên</th>
                                <th className="px-6 py-3">Vị Trí Ứng Tuyển</th>
                                <th className="px-6 py-3">Liên Hệ</th>
                                <th className="px-6 py-3">Ngày Nộp</th>
                                <th className="px-6 py-3 text-center">Trạng Thái</th>
                                <th className="px-6 py-3 text-center">CV</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.length > 0 ? (
                                applications.map((app) => (
                                    <tr key={app.id} className="bg-white border-b hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 text-xs text-gray-400">#{app.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{app.full_name}</div>
                                            {app.introduction && (
                                                <div className="text-xs text-gray-500 mt-1 truncate w-48" title={app.introduction}>
                                                    &quot;{app.introduction}&quot;
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-blue-700 font-medium">{app.job_title || 'N/A'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <a href={`tel:${app.phone}`} className="hover:text-vinarackOrange"><i className="fas fa-phone mr-1"></i> {app.phone}</a>
                                                <a href={`mailto:${app.email}`} className="hover:text-vinarackOrange"><i className="fas fa-envelope mr-1"></i> {app.email}</a>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Date(app.created_at).toLocaleDateString('vi-VN')}
                                            <br/>
                                            <span className="text-xs text-gray-400">{new Date(app.created_at).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <select 
                                                value={app.status}
                                                onChange={(e) => handleStatusChange(app.id, e.target.value)}
                                                className={`text-xs font-bold px-2 py-1 rounded border-none outline-none cursor-pointer ${getStatusColor(app.status)}`}
                                            >
                                                <option value="new">Mới nộp</option>
                                                <option value="reviewed">Đã xem</option>
                                                <option value="interviewed">Phỏng vấn</option>
                                                <option value="hired">Đã tuyển</option>
                                                <option value="rejected">Từ chối</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {app.cv_url ? (
                                                <a 
                                                    href={app.cv_url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-vinarackBlue hover:text-white transition"
                                                    title="Xem CV"
                                                >
                                                    <i className="fas fa-file-download"></i>
                                                </a>
                                            ) : (
                                                <span className="text-xs text-gray-400">Không có</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        Chưa có hồ sơ nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}