'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAdminJobs } from '@/services/api'; 

// Hàm helper để map icon theo phòng ban
const getDepartmentIcon = (dept: string) => {
    const lowerDept = dept?.toLowerCase() || '';
    if (lowerDept.includes('kỹ thuật') || lowerDept.includes('cơ khí') || lowerDept.includes('thiết kế')) return 'fa-drafting-compass';
    if (lowerDept.includes('kinh doanh') || lowerDept.includes('sales')) return 'fa-user-tie';
    if (lowerDept.includes('kế toán') || lowerDept.includes('tài chính')) return 'fa-calculator';
    if (lowerDept.includes('sản xuất') || lowerDept.includes('kho')) return 'fa-cogs';
    if (lowerDept.includes('it') || lowerDept.includes('phần mềm')) return 'fa-laptop-code';
    return 'fa-briefcase'; // Icon mặc định
};

export default function RecruitmentPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAdminJobs(); 
                setJobs(data.filter((j: any) => j.status === 'open'));
            } catch (error) {
                console.error("Lỗi tải tin tuyển dụng:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredJobs = filter === 'all' 
        ? jobs 
        : jobs.filter(j => j.department === filter);

    const departments = Array.from(new Set(jobs.map(j => j.department)));

    return (
        <div className="font-sans text-gray-700 bg-white">
            
            {/* HERO BANNER */}
            <div className="relative bg-[#0f3a68] h-[450px] flex items-center justify-center text-center overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <Image 
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
                        alt="Teamwork" 
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <span className="bg-[#f97316]/20 text-[#f97316] border border-[#f97316] px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-6 inline-block backdrop-blur-sm">
                        Gia Nhập Đội Ngũ Vinarack
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                        KIẾN TẠO TƯƠNG LAI <br /> NGÀNH KHO VẬN
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                        Chúng tôi tìm kiếm những cộng sự tài năng, nhiệt huyết để cùng nhau xây dựng các giải pháp lưu trữ thông minh hàng đầu Việt Nam.
                    </p>
                    <a href="#jobs" className="bg-[#f97316] text-white px-8 py-4 rounded-lg font-bold hover:bg-orange-600 transition shadow-lg transform hover:-translate-y-1 inline-block">
                        XEM CÁC VỊ TRÍ ĐANG MỞ
                    </a>
                </div>
            </div>

            {/* WHY JOIN US */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-[#0f3a68] mb-4">Tại Sao Chọn Vinarack?</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Môi trường làm việc chuyên nghiệp, cơ hội thăng tiến rõ ràng và chế độ đãi ngộ xứng đáng.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-8 bg-[#f8fafc] rounded-xl border border-gray-100 text-center hover:bg-white hover:shadow-xl transition duration-300">
                            <div className="w-16 h-16 bg-blue-100 text-[#0f3a68] rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                                <i className="fas fa-chart-line"></i>
                            </div>
                            <h3 className="text-xl font-bold text-[#0f3a68] mb-3">Lộ Trình Thăng Tiến</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Đánh giá năng lực định kỳ 6 tháng/lần. Cơ hội thăng tiến lên các vị trí quản lý dựa trên kết quả công việc thực tế.
                            </p>
                        </div>

                        <div className="p-8 bg-[#f8fafc] rounded-xl border border-gray-100 text-center hover:bg-white hover:shadow-xl transition duration-300">
                            <div className="w-16 h-16 bg-orange-100 text-[#f97316] rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                                <i className="fas fa-graduation-cap"></i>
                            </div>
                            <h3 className="text-xl font-bold text-[#0f3a68] mb-3">Đào Tạo Chuyên Sâu</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Tham gia các khóa đào tạo kỹ năng mềm và chuyên môn. Được cử đi học tập công nghệ mới tại nước ngoài (Nhật, Âu).
                            </p>
                        </div>

                        <div className="p-8 bg-[#f8fafc] rounded-xl border border-gray-100 text-center hover:bg-white hover:shadow-xl transition duration-300">
                            <div className="w-16 h-16 bg-blue-100 text-[#0f3a68] rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                                <i className="fas fa-heart"></i>
                            </div>
                            <h3 className="text-xl font-bold text-[#0f3a68] mb-3">Phúc Lợi Toàn Diện</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                BHXH, BHYT full lương. Thưởng tháng 13, thưởng dự án. Du lịch team building hàng năm, khám sức khỏe định kỳ.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* OPEN POSITIONS */}
            <section id="jobs" className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-[#0f3a68]">Vị Trí Đang Tuyển Dụng</h2>
                            <p className="text-gray-600 mt-2">Hãy tìm vị trí phù hợp với năng lực của bạn.</p>
                        </div>
                        
                        <div className="flex gap-2 mt-4 md:mt-0 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                            <button 
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-full text-sm font-bold shadow-md whitespace-nowrap transition ${filter === 'all' ? 'bg-[#0f3a68] text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`}
                            >
                                Tất cả
                            </button>
                            {departments.map(dept => (
                                <button 
                                    key={dept}
                                    onClick={() => setFilter(dept)}
                                    className={`px-4 py-2 rounded-full text-sm font-bold transition whitespace-nowrap ${filter === dept ? 'bg-[#0f3a68] text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-200'}`}
                                >
                                    {dept}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-6">
                        {loading ? (
                            <div className="text-center py-20">
                                <i className="fas fa-spinner fa-spin text-3xl text-[#0f3a68]"></i>
                                <p className="mt-4 text-gray-500">Đang tải danh sách công việc...</p>
                            </div>
                        ) : filteredJobs.length > 0 ? (
                            filteredJobs.map((job) => (
                                <div key={job.id} className="job-card bg-white p-6 rounded-xl border border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between transition duration-300 hover:shadow-lg hover:-translate-y-1">
                                    <div className="flex items-start gap-4 mb-4 md:mb-0">
                                        <div className="w-12 h-12 bg-blue-50 text-[#0f3a68] rounded-lg flex items-center justify-center font-bold text-xl flex-shrink-0">
                                            <i className={`fas ${getDepartmentIcon(job.department)}`}></i>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-[#0f3a68] hover:text-[#f97316] transition cursor-pointer">
                                                <Link href={`/recruitment/${job.slug}`}>{job.title}</Link>
                                            </h3>
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-1">
                                                <span className="flex items-center"><i className="fas fa-map-marker-alt mr-1"></i> {job.location || 'TP. Thủ Đức'}</span>
                                                <span className="flex items-center text-green-600 font-medium"><i className="fas fa-money-bill-wave mr-1"></i> {job.salary_range}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                        <span className="text-xs text-gray-400 hidden md:block">
                                            Hạn nộp: {new Date(job.deadline).toLocaleDateString('vi-VN')}
                                        </span>
                                        <Link href={`/recruitment/${job.slug}`} className="flex-1 md:flex-none px-6 py-2 border border-[#0f3a68] text-[#0f3a68] font-bold rounded hover:bg-[#0f3a68] hover:text-white transition text-center">
                                            Xem chi tiết
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                                <i className="fas fa-search text-4xl text-gray-300 mb-4"></i>
                                <p className="text-gray-500">Hiện chưa có vị trí nào đang mở trong bộ phận này.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* RECRUITMENT PROCESS */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-[#0f3a68] mb-12 text-center">Quy Trình Ứng Tuyển</h2>
                    
                    <div className="relative flex flex-col md:flex-row justify-between items-center max-w-5xl mx-auto">
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-0 transform -translate-y-1/2"></div>

                        <div className="bg-white p-6 w-full md:w-64 text-center group relative z-10">
                            <div className="w-16 h-16 bg-[#0f3a68] text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4 border-4 border-white shadow-lg group-hover:bg-[#f97316] transition">1</div>
                            <h4 className="font-bold text-lg mb-2">Gửi Hồ Sơ</h4>
                            <p className="text-sm text-gray-500">Gửi CV qua email hoặc nộp trực tiếp tại văn phòng.</p>
                        </div>

                        <div className="bg-white p-6 w-full md:w-64 text-center group relative z-10">
                            <div className="w-16 h-16 bg-white border-2 border-[#0f3a68] text-[#0f3a68] rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4 shadow-lg group-hover:border-[#f97316] group-hover:text-[#f97316] transition">2</div>
                            <h4 className="font-bold text-lg mb-2">Sàng Lọc & Phỏng Vấn</h4>
                            <p className="text-sm text-gray-500">Trao đổi trực tiếp với bộ phận nhân sự và chuyên môn.</p>
                        </div>

                        <div className="bg-white p-6 w-full md:w-64 text-center group relative z-10">
                            <div className="w-16 h-16 bg-white border-2 border-[#0f3a68] text-[#0f3a68] rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4 shadow-lg group-hover:border-[#f97316] group-hover:text-[#f97316] transition">3</div>
                            <h4 className="font-bold text-lg mb-2">Thông Báo Kết Quả</h4>
                            <p className="text-sm text-gray-500">Nhận Offer Letter và thỏa thuận lương thưởng.</p>
                        </div>

                        <div className="bg-white p-6 w-full md:w-64 text-center group relative z-10">
                            <div className="w-16 h-16 bg-white border-2 border-[#0f3a68] text-[#0f3a68] rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4 shadow-lg group-hover:border-[#f97316] group-hover:text-[#f97316] transition">4</div>
                            <h4 className="font-bold text-lg mb-2">Hội Nhập</h4>
                            <p className="text-sm text-gray-500">Bắt đầu công việc và tham gia đào tạo hội nhập.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER CTA (Phần này riêng của trang tuyển dụng nên giữ lại) */}
            <section className="py-16 bg-[#0f3865] text-center text-white">
                <div className="container mx-auto px-4">
                    <h3 className="text-2xl font-bold mb-4">Chưa tìm thấy vị trí phù hợp?</h3>
                    <p className="text-blue-200 mb-8 max-w-xl mx-auto">
                        Đừng lo lắng! Hãy gửi CV của bạn vào Ngân hàng Ứng viên của chúng tôi. Chúng tôi sẽ liên hệ ngay khi có vị trí phù hợp với năng lực của bạn.
                    </p>
                    <a href="mailto:hr@vinarack.vn" className="inline-flex items-center bg-[#f97316] text-white font-bold py-3 px-8 rounded hover:bg-orange-600 transition">
                        <i className="fas fa-paper-plane mr-2"></i> GỬI CV NGAY
                    </a>
                    <p className="mt-6 text-sm text-blue-200">Email: hr@vinarack.vn | Hotline: 028.3838.xxxx</p>
                </div>
            </section>

        </div>
    );
}