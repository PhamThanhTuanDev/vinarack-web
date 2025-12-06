'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getUserById, updateUser } from '@/services/api';

export default function EditUser() {
    const router = useRouter();
    const params = useParams();
    const userId = params?.id ? Number(params.id) : 0;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    
    const [formData, setFormData] = useState({
        username: '', // Read-only
        email: '',
        role: 'admin',
        password: '' // Optional
    });

    useEffect(() => {
        const loadData = async () => {
            if (!userId) return;
            try {
                const data = await getUserById(userId);
                setFormData({
                    username: data.username,
                    email: data.email,
                    role: data.role,
                    password: '' // Mặc định để trống, nếu nhập mới update
                });
            } catch (error) {
                console.error(error);
                alert('Không tìm thấy user');
                router.push('/admin/users');
            } finally {
                setFetching(false);
            }
        };
        loadData();
    }, [userId, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateUser(userId, formData);
            alert('Cập nhật thành công!');
            router.push('/admin/users');
        } catch (error) {
            console.error(error);
            alert('Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-10 text-center">Đang tải...</div>;

    return (
        <div className="max-w-xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Sửa Tài Khoản: {formData.username}</h1>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên đăng nhập</label>
                    <input 
                        type="text" 
                        value={formData.username} 
                        disabled 
                        className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input 
                        type="email" 
                        name="email" 
                        required 
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                        value={formData.email} 
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu mới (Để trống nếu không đổi)</label>
                    <input 
                        type="password" 
                        name="password" 
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                        placeholder="Nhập mật khẩu mới..."
                        value={formData.password} 
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vai trò</label>
                    <select 
                        name="role" 
                        className="w-full px-4 py-2 border rounded-lg outline-none"
                        value={formData.role} 
                        onChange={handleChange}
                    >
                        <option value="admin">Quản trị viên (Admin)</option>
                        <option value="editor">Biên tập viên (Editor)</option>
                    </select>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t">
                    <button type="button" onClick={() => router.back()} className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Hủy</button>
                    <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50">
                        {loading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                    </button>
                </div>
            </form>
        </div>
    );
}