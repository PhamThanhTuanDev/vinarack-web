'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAdminJobs } from '@/services/api'; // Tạm dùng API admin lấy all jobs (hoặc dùng api public /jobs)

export default function RecruitmentPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, Kỹ Thuật, Kinh Doanh, Sản Xuất...

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Lấy danh sách việc làm (Public API /api/jobs chỉ trả về status='open')
                // Ở đây mình gọi API Admin để demo, thực tế nên gọi API public
                const data = await getAdminJobs(); 
                // Lọc chỉ lấy tin đang tuyển
                setJobs(data.filter((j: any) => j.status === 'open'));
            } catch (error) {
                console.error("Lỗi tải tin tuyển dụng:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Lọc theo phòng ban
    const filteredJobs = filter === 'all' 
        ? jobs 
        : jobs.filter(j => j.department === filter);

    // Lấy danh sách phòng ban duy nhất để tạo bộ lọc
    const departments = Array.from(new Set(jobs.map(j => j.department)));

    if (loading) return <div className="py-20 text-center text-gray-500"><i className="fas fa-spinner fa-spin mr-2"></i> Đang tải thông tin...</div>;

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            
            {/* Header Banner */}
            <div className="relative h-[400px] bg-[#0a2745] flex items-center justify-center text-center px-4">
                <div className="absolute inset-0 opacity-30">
                    <Image 
                        src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
                        alt="Recruitment Banner" 
                        fill 
                        className="object-cover"
                    />
                </div>
                <div className="relative z-10 max-w-3xl text-white">
                    <span className="text-[#f97316] font-bold tracking-widest uppercase mb-2 block">Cơ Hội Nghề Nghiệp</span>
                    <h1 className="text-4xl md:text-6xl font-black mb-6">GIA NHẬP ĐỘI NGŨ VINARACK</h1>
                    <p className="text-gray-300 text-lg">
                        Cùng chúng tôi kiến tạo những giải pháp lưu trữ thông minh và hiệu quả nhất.
                    </p>
                </div>
            </div>

            {/* Why Join Us */}
            <div className="container mx-auto px-4 -mt-16 relative z-20 mb-16">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-xl shadow-lg text-center border-b-4 border-[#0f3a68]">
                        <div className="w-16 h-16 bg-blue-50 text-[#0f3a68] rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                            <i className="fas fa-chart-line"></i>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Cơ Hội Thăng Tiến</h3>
                        <p className="text-gray-600 text-sm">Lộ trình phát triển rõ ràng, đánh giá năng lực định kỳ 6 tháng/lần.</p>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-lg text-center border-b-4 border-[#f97316]">
                        <div className="w-16 h-16 bg-orange-50 text-[#f97316] rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                            <i className="fas fa-graduation-cap"></i>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Đào Tạo Chuyên Sâu</h3>
                        <p className="text-gray-600 text-sm">Được đào tạo kỹ năng chuyên môn và cử đi học tập công nghệ mới tại nước ngoài.</p>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-lg text-center border-b-4 border-[#0f3a68]">
                        <div className="w-16 h-16 bg-blue-50 text-[#0f3a68] rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                            <i className="fas fa-heart"></i>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Phúc Lợi Toàn Diện</h3>
                        <p className="text-gray-600 text-sm">BHXH full lương, thưởng tháng 13, du lịch team building hàng năm.</p>
                    </div>
                </div>
            </div>

            {/* Job Board */}
            <div className="container mx-auto px-4" id="jobs">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-[#0f3a68] mb-4">Vị Trí Đang Tuyển Dụng</h2>
                    
                    {/* Filters */}
                    <div className="flex flex-wrap justify-center gap-2">
                        <button 
                            onClick={() => setFilter('all')}
                            className={`px-5 py-2 rounded-full text-sm font-bold transition ${filter === 'all' ? 'bg-[#0f3a68] text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`}
                        >
                            Tất cả
                        </button>
                        {departments.map(dept => (
                            <button 
                                key={dept}
                                onClick={() => setFilter(dept)}
                                className={`px-5 py-2 rounded-full text-sm font-bold transition ${filter === dept ? 'bg-[#0f3a68] text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`}
                            >
                                {dept}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid gap-4 max-w-4xl mx-auto">
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map((job) => (
                            <Link key={job.id} href={`/recruitment/${job.slug}`} className="group block bg-white p-6 rounded-xl border border-gray-200 hover:border-[#f97316] hover:shadow-md transition">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl text-gray-400 group-hover:bg-[#f97316] group-hover:text-white transition">
                                            <i className="fas fa-briefcase"></i>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-[#0f3a68] group-hover:text-[#f97316] transition mb-1">
                                                {job.title}
                                            </h3>
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                                <span className="flex items-center"><i className="fas fa-building mr-1"></i> {job.department}</span>
                                                <span className="flex items-center"><i className="fas fa-map-marker-alt mr-1"></i> {job.location}</span>
                                                <span className="flex items-center text-green-600 font-medium"><i className="fas fa-money-bill-wave mr-1"></i> {job.salary_range}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                        <div className="text-right hidden md:block">
                                            <p className="text-xs text-gray-400">Hạn nộp hồ sơ</p>
                                            <p className="text-sm font-bold text-gray-700">{new Date(job.deadline).toLocaleDateString('vi-VN')}</p>
                                        </div>
                                        <span className="px-6 py-2 border border-[#0f3a68] text-[#0f3a68] font-bold rounded-lg group-hover:bg-[#0f3a68] group-hover:text-white transition">
                                            Xem chi tiết
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                            Hiện chưa có vị trí nào đang mở trong bộ phận này.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}