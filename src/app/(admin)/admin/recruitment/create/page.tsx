'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createJob } from '@/services/api';

export default function CreateJob() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        department: '',
        location: 'TP. Thủ Đức',
        salary_range: '',
        type: 'fulltime',
        deadline: '',
        description: '',
        requirements: '',
        benefits: '',
        status: 'open'
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createJob(formData);
            alert('Đăng tin thành công!');
            router.push('/admin/recruitment');
        } catch (error) {
            console.error(error);
            alert('Lỗi khi đăng tin');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Đăng Tin Tuyển Dụng Mới</h1>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Vị trí tuyển dụng *</label>
                        <input type="text" name="title" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={formData.title} onChange={handleChange} />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phòng ban</label>
                        <input type="text" name="department" className="w-full px-4 py-2 border rounded-lg outline-none" placeholder="VD: Kỹ Thuật, Kinh Doanh..." value={formData.department} onChange={handleChange} />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Địa điểm làm việc</label>
                        <input type="text" name="location" className="w-full px-4 py-2 border rounded-lg outline-none" value={formData.location} onChange={handleChange} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mức lương</label>
                        <input type="text" name="salary_range" className="w-full px-4 py-2 border rounded-lg outline-none" placeholder="VD: 15 - 20 Triệu" value={formData.salary_range} onChange={handleChange} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hạn nộp hồ sơ</label>
                        <input type="date" name="deadline" className="w-full px-4 py-2 border rounded-lg outline-none" value={formData.deadline} onChange={handleChange} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hình thức</label>
                        <select name="type" className="w-full px-4 py-2 border rounded-lg outline-none" value={formData.type} onChange={handleChange}>
                            <option value="fulltime">Toàn thời gian</option>
                            <option value="parttime">Bán thời gian</option>
                            <option value="intern">Thực tập</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                        <select name="status" className="w-full px-4 py-2 border rounded-lg outline-none" value={formData.status} onChange={handleChange}>
                            <option value="open">Đang tuyển</option>
                            <option value="closed">Đã đóng</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả công việc (Mỗi dòng một ý)</label>
                        <textarea name="description" rows={5} className="w-full px-4 py-2 border rounded-lg outline-none" placeholder="- Thiết kế bản vẽ..." value={formData.description} onChange={handleChange}></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Yêu cầu ứng viên (Mỗi dòng một ý)</label>
                        <textarea name="requirements" rows={5} className="w-full px-4 py-2 border rounded-lg outline-none" placeholder="- Tốt nghiệp Đại học..." value={formData.requirements} onChange={handleChange}></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quyền lợi (Mỗi dòng một ý)</label>
                        <textarea name="benefits" rows={5} className="w-full px-4 py-2 border rounded-lg outline-none" placeholder="- BHXH đầy đủ..." value={formData.benefits} onChange={handleChange}></textarea>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t">
                    <button type="button" onClick={() => router.back()} className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Hủy</button>
                    <button type="submit" disabled={loading} className="px-6 py-2 bg-[#f97316] text-white rounded-lg font-bold hover:bg-orange-600 disabled:opacity-50">
                        {loading ? 'Đang lưu...' : 'Đăng Tin'}
                    </button>
                </div>
            </form>
        </div>
    );
}