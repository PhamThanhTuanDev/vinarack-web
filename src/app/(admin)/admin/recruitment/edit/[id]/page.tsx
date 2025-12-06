'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getJobById, updateJob } from '@/services/api';

export default function EditJob() {
    const router = useRouter();
    const params = useParams();
    const jobId = params?.id ? Number(params.id) : 0;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    
    const [formData, setFormData] = useState({
        title: '',
        department: '',
        location: '',
        salary_range: '',
        type: 'fulltime',
        deadline: '',
        description: '',
        requirements: '',
        benefits: '',
        status: 'open'
    });

    // Load dữ liệu cũ
    useEffect(() => {
        const loadData = async () => {
            if (!jobId) return;
            try {
                const data = await getJobById(jobId);
                
                // SỬA LỖI NGÀY THÁNG: Dùng toLocaleDateString('en-CA') để lấy YYYY-MM-DD theo giờ địa phương
                let formattedDeadline = '';
                if (data.deadline) {
                    const date = new Date(data.deadline);
                    // Cách 1: Dùng thư viện chuẩn (Hỗ trợ tốt hầu hết trình duyệt hiện đại)
                    // 'en-CA' là locale chuẩn định dạng YYYY-MM-DD
                    formattedDeadline = date.toLocaleDateString('en-CA');
                    
                    // Cách 2 (Dự phòng nếu cần thủ công):
                    // const year = date.getFullYear();
                    // const month = String(date.getMonth() + 1).padStart(2, '0');
                    // const day = String(date.getDate()).padStart(2, '0');
                    // formattedDeadline = `${year}-${month}-${day}`;
                }

                setFormData({
                    title: data.title || '',
                    department: data.department || '',
                    location: data.location || '',
                    salary_range: data.salary_range || '',
                    type: data.type || 'fulltime',
                    deadline: formattedDeadline,
                    description: data.description || '',
                    requirements: data.requirements || '',
                    benefits: data.benefits || '',
                    status: data.status || 'open'
                });
            } catch (error) {
                console.error("Lỗi khi tải tin tuyển dụng:", error);
                alert("Không tìm thấy tin tuyển dụng hoặc lỗi kết nối.");
                router.push('/admin/recruitment');
            } finally {
                setFetching(false);
            }
        };
        loadData();
    }, [jobId, router]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateJob(jobId, formData);
            alert('Cập nhật tin thành công!');
            router.push('/admin/recruitment');
        } catch (error) {
            console.error(error);
            alert('Lỗi khi cập nhật tin');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-10 text-center"><i className="fas fa-spinner fa-spin mr-2"></i> Đang tải dữ liệu...</div>;

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600 mr-2"><i className="fas fa-arrow-left"></i></button>
                    Sửa Tin Tuyển Dụng #{jobId}
                </h1>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${formData.status === 'open' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                    {formData.status === 'open' ? 'Đang tuyển' : 'Đã đóng'}
                </span>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Vị trí tuyển dụng *</label>
                        <input type="text" name="title" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={formData.title} onChange={handleChange} />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phòng ban</label>
                        <input type="text" name="department" className="w-full px-4 py-2 border rounded-lg outline-none" value={formData.department} onChange={handleChange} />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Địa điểm làm việc</label>
                        <input type="text" name="location" className="w-full px-4 py-2 border rounded-lg outline-none" value={formData.location} onChange={handleChange} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mức lương</label>
                        <input type="text" name="salary_range" className="w-full px-4 py-2 border rounded-lg outline-none" value={formData.salary_range} onChange={handleChange} />
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả công việc</label>
                        <textarea name="description" rows={5} className="w-full px-4 py-2 border rounded-lg outline-none" value={formData.description} onChange={handleChange}></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Yêu cầu ứng viên</label>
                        <textarea name="requirements" rows={5} className="w-full px-4 py-2 border rounded-lg outline-none" value={formData.requirements} onChange={handleChange}></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quyền lợi</label>
                        <textarea name="benefits" rows={5} className="w-full px-4 py-2 border rounded-lg outline-none" value={formData.benefits} onChange={handleChange}></textarea>
                    </div>
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