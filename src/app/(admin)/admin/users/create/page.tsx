'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUser } from '@/services/api';

export default function CreateUser() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        role: 'admin'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await createUser(formData);
            alert('Tạo tài khoản thành công!');
            router.push('/admin/users');
        } catch (err: unknown) {
            console.error(err);
            type ErrorWithResponse = {
                response?: {
                    data?: {
                        message?: string;
                    };
                };
            };
            if (typeof err === 'object' && err !== null && 'response' in err && typeof (err as ErrorWithResponse).response === 'object') {
                setError((err as ErrorWithResponse).response?.data?.message || 'Lỗi khi tạo tài khoản');
            } else {
                setError('Lỗi khi tạo tài khoản');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Thêm Tài Khoản Mới</h1>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm border border-red-200">
                    <i className="fas fa-exclamation-circle mr-2"></i> {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên đăng nhập *</label>
                    <input 
                        type="text" 
                        name="username" 
                        required 
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                        value={formData.username} 
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu *</label>
                    <input 
                        type="password" 
                        name="password" 
                        required 
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
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
                        {loading ? 'Đang lưu...' : 'Tạo Tài Khoản'}
                    </button>
                </div>
            </form>
        </div>
    );
}