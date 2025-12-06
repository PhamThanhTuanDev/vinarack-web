'use client';

import React, { useEffect, useState } from 'react';
import { getAdminContacts, updateContactStatus } from '@/services/api';

interface Contact {
    id: number;
    full_name: string;
    phone: string;
    email?: string;
    product_interest?: string;
    message: string;
    created_at: string;
    status: string;
}

export default function AdminContacts() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const data = await getAdminContacts();
            setContacts(data);
        } catch (error) {
            console.error("Lỗi tải liên hệ:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleStatusChange = async (id: number, newStatus: string) => {
        try {
            await updateContactStatus(id, newStatus);
            // Cập nhật UI ngay lập tức
            setContacts(prev => prev.map(contact => 
                contact.id === id ? { ...contact, status: newStatus } : contact
            ));
        } catch (error) {
            console.error(error);
            alert('Lỗi cập nhật trạng thái');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-red-100 text-red-800 border-red-200';
            case 'contacted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'closed': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <div className="p-8 text-center">Đang tải dữ liệu...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Yêu Cầu Liên Hệ & Báo Giá</h1>
                <div className="text-sm text-gray-500">Tổng số: <strong>{contacts.length}</strong> yêu cầu</div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 w-10">ID</th>
                                <th className="px-6 py-3">Khách Hàng</th>
                                <th className="px-6 py-3">Sản Phẩm Quan Tâm</th>
                                <th className="px-6 py-3 w-1/3">Nội Dung</th>
                                <th className="px-6 py-3">Ngày Gửi</th>
                                <th className="px-6 py-3 text-center">Trạng Thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.length > 0 ? (
                                contacts.map((contact) => (
                                    <tr key={contact.id} className="bg-white border-b hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 text-xs text-gray-400">#{contact.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{contact.full_name}</div>
                                            <div className="text-xs text-gray-500 mt-1 flex flex-col gap-1">
                                                <a href={`tel:${contact.phone}`} className="hover:text-vinarackOrange">
                                                    <i className="fas fa-phone mr-1"></i> {contact.phone}
                                                </a>
                                                {contact.email && (
                                                    <a href={`mailto:${contact.email}`} className="hover:text-vinarackOrange">
                                                        <i className="fas fa-envelope mr-1"></i> {contact.email}
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-blue-700 font-medium bg-blue-50 px-2 py-1 rounded text-xs">
                                                {contact.product_interest || 'Tư vấn chung'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-gray-600 italic line-clamp-3" title={contact.message}>
                                                &quot;{contact.message}&quot;
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Date(contact.created_at).toLocaleDateString('vi-VN')}
                                            <br/>
                                            <span className="text-xs text-gray-400">
                                                {new Date(contact.created_at).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <select 
                                                value={contact.status}
                                                onChange={(e) => handleStatusChange(contact.id, e.target.value)}
                                                className={`text-xs font-bold px-2 py-1 rounded border outline-none cursor-pointer ${getStatusColor(contact.status)}`}
                                            >
                                                <option value="new">Mới</option>
                                                <option value="contacted">Đang xử lý</option>
                                                <option value="closed">Hoàn tất</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        Chưa có yêu cầu nào.
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