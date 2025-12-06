'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/services/api';

export default function AdminLogin() {
    const router = useRouter();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await login(formData);
            if (data.success) {
                // Lưu token giả lập vào LocalStorage để đánh dấu đã đăng nhập
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('adminUser', JSON.stringify(data.user));
                
                // Chuyển hướng vào trang Admin
                router.push('/admin');
            } else {
                setError('Đăng nhập thất bại.');
            }
        } catch (err: unknown) {
            type ErrorResponse = {
                response?: {
                    data?: {
                        message?: string;
                    };
                };
            };
            const errorObj = err as ErrorResponse;
            if (
                errorObj &&
                typeof errorObj === 'object' &&
                errorObj.response &&
                typeof errorObj.response === 'object' &&
                errorObj.response.data &&
                typeof errorObj.response.data === 'object' &&
                'message' in errorObj.response.data
            ) {
                setError(errorObj.response.data?.message || 'Sai tài khoản hoặc mật khẩu!');
            } else {
                setError('Sai tài khoản hoặc mật khẩu!');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a2745] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-[#f97316] text-white rounded-lg flex items-center justify-center text-3xl font-black mx-auto mb-4">V</div>
                        <h2 className="text-2xl font-bold text-gray-800">Đăng Nhập Quản Trị</h2>
                        <p className="text-gray-500 text-sm">Hệ thống quản lý Vinarack</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-6 flex items-center">
                            <i className="fas fa-exclamation-circle mr-2"></i> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tài khoản</label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                placeholder="Nhập username (admin)"
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                            <input 
                                type="password" 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                placeholder="Nhập mật khẩu"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                required
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-[#0f3a68] hover:bg-blue-900 text-white font-bold py-3 rounded-lg transition shadow-lg disabled:opacity-70 flex justify-center items-center"
                        >
                            {loading ? <i className="fas fa-spinner fa-spin mr-2"></i> : 'ĐĂNG NHẬP'}
                        </button>
                    </form>
                </div>
                <div className="bg-gray-50 px-8 py-4 text-center text-xs text-gray-500 border-t border-gray-100">
                    &copy; 2024 Vinarack Security Team.
                </div>
            </div>
        </div>
    );
}