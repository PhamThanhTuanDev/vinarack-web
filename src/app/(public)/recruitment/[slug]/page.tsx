'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getAdminJobs, submitApplication } from '@/services/api';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

// Helper để format tiền tệ hoặc text hiển thị
const formatSalary = (salary: string) => {
    if (!salary) return 'Thỏa thuận';
    return salary;
};

export default function JobDetail() {
    const params = useParams();
    const slug = params?.slug as string;

    const [job, setJob] = useState<any>(null);
    const [relatedJobs, setRelatedJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [applyForm, setApplyForm] = useState({
        full_name: '',
        phone: '',
        email: '',
        introduction: '',
        cv_url: '' 
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!slug) return;
            try {
                // Lấy danh sách jobs (Giả lập API get detail bằng cách filter từ list)
                // Thực tế nên dùng API getJobBySlug từ backend nếu có
                const allJobs = await getAdminJobs();
                const foundJob = allJobs.find((j: any) => j.slug === slug);
                
                if (foundJob) {
                    setJob(foundJob);
                    // Lọc các công việc liên quan (cùng phòng ban, khác job hiện tại)
                    const related = allJobs
                        .filter((j: any) => j.department === foundJob.department && j.id !== foundJob.id && j.status === 'open')
                        .slice(0, 3); // Lấy tối đa 3 job
                    setRelatedJobs(related);
                }
            } catch (error) {
                console.error("Lỗi tải tin tuyển dụng:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const toastId = toast.loading("Đang gửi hồ sơ...");

        try {
            await submitApplication({
                job_id: job.id,
                full_name: applyForm.full_name,
                phone: applyForm.phone,
                email: applyForm.email,
                introduction: applyForm.introduction,
                cv_url: applyForm.cv_url
            });
            toast.success("Nộp hồ sơ thành công! Bộ phận nhân sự sẽ liên hệ với bạn sớm.", { id: toastId, duration: 5000 });
            setApplyForm({ full_name: '', phone: '', email: '', introduction: '', cv_url: '' });
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi gửi hồ sơ. Vui lòng thử lại.", { id: toastId });
        } finally {
            setSubmitting(false);
        }
    };

    // Hàm render nội dung có xuống dòng (cho description, requirement...)
    const renderHTMLContent = (content: string) => {
        if (!content) return null;
        // Tách chuỗi thành các dòng và hiển thị thành list item nếu có dấu gạch đầu dòng, hoặc p tag
        return (
            <div className="text-gray-600 space-y-3 leading-relaxed">
                {content.split('\n').map((line, index) => {
                    const trimmed = line.trim();
                    if (!trimmed) return null;
                    // Giả lập list style nếu dòng bắt đầu bằng dấu gạch ngang hoặc dấu sao
                    if (trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•')) {
                        return (
                            <div key={index} className="flex items-start gap-3 relative pl-2">
                                <i className="fas fa-check text-[#f97316] mt-1.5 text-xs absolute left-0"></i>
                                <span className="pl-5">{trimmed.substring(1).trim()}</span>
                            </div>
                        );
                    }
                    return <p key={index}>{trimmed}</p>;
                })}
            </div>
        );
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-[#0f3a68] flex flex-col items-center">
                <i className="fas fa-spinner fa-spin text-4xl mb-4"></i>
                <span className="font-medium">Đang tải thông tin...</span>
            </div>
        </div>
    );
    
    if (!job) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy tin tuyển dụng</h1>
                <Link href="/recruitment" className="text-[#f97316] hover:underline">Quay lại danh sách</Link>
            </div>
        </div>
    );

    return (
        <div className="font-sans text-gray-700 bg-gray-50">
            <Toaster position="top-center" />

            {/* JOB HEADER */}
            <div className="bg-white border-b border-gray-200 py-8 md:py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                        <div>
                            <Link href="/recruitment" className="text-gray-500 hover:text-[#0f3a68] text-sm mb-4 inline-block font-medium transition">
                                <i className="fas fa-arrow-left mr-2"></i> Quay lại danh sách
                            </Link>
                            <h1 className="text-2xl md:text-4xl font-bold text-[#0f3a68] mb-4">{job.title}</h1>
                            
                            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#0f3a68]">
                                        <i className="fas fa-map-marker-alt"></i>
                                    </div>
                                    <span>{job.location || 'TP. Thủ Đức, TP.HCM'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                        <i className="fas fa-money-bill-wave"></i>
                                    </div>
                                    <span className="font-bold text-green-600">{formatSalary(job.salary_range)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-[#f97316]">
                                        <i className="fas fa-clock"></i>
                                    </div>
                                    <span>Hạn nộp: {new Date(job.deadline).toLocaleDateString('vi-VN')}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="hidden md:block">
                            <a href="#apply-form" className="bg-[#f97316] hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-bold transition shadow-lg inline-flex items-center transform hover:-translate-y-0.5">
                                <i className="fas fa-paper-plane mr-2"></i> ỨNG TUYỂN NGAY
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* LEFT CONTENT (Job Details) */}
                    <div className="lg:col-span-2 space-y-10">
                        
                        {/* Section 1: Job Description */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-[#0f3a68] mb-6 border-l-4 border-[#f97316] pl-3">Mô Tả Công Việc</h2>
                            {renderHTMLContent(job.description)}
                        </div>

                        {/* Section 2: Requirements */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-[#0f3a68] mb-6 border-l-4 border-[#f97316] pl-3">Yêu Cầu Ứng Viên</h2>
                            {renderHTMLContent(job.requirements)}
                        </div>

                        {/* Section 3: Benefits */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-[#0f3a68] mb-6 border-l-4 border-[#f97316] pl-3">Quyền Lợi Được Hưởng</h2>
                            {renderHTMLContent(job.benefits)}
                        </div>

                        {/* Section 4: Location */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-[#0f3a68] mb-6 border-l-4 border-[#f97316] pl-3">Địa Điểm Làm Việc</h2>
                            <p className="text-gray-600 mb-4">
                                <i className="fas fa-map-marker-alt text-[#f97316] mr-2"></i> 
                                <strong>Văn phòng chính:</strong> Số 3, Đường 40, Khu phố 8, Phường Hiệp Bình Chánh, TP. Thủ Đức, TP.HCM.
                            </p>
                            <p className="text-gray-600 mb-4">
                                <i className="fas fa-clock text-[#f97316] mr-2"></i> 
                                <strong>Thời gian làm việc:</strong> 8h00 - 17h00 (Thứ 2 đến Thứ 6) & 8h00 - 12h00 (Thứ 7).
                            </p>
                            {/* Google Map Placeholder */}
                            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 border border-gray-200">
                                <div className="text-center">
                                    <i className="fas fa-map-marked-alt text-4xl mb-2"></i>
                                    <p>Bản đồ địa điểm làm việc</p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT SIDEBAR (Sticky Info) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            
                            {/* Summary Card */}
                            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                                <h3 className="font-bold text-lg text-[#0f3a68] mb-4 pb-2 border-b border-gray-100">Thông Tin Chung</h3>
                                <ul className="space-y-4 text-sm">
                                    <li className="flex justify-between items-center">
                                        <span className="text-gray-500">Phòng ban:</span>
                                        <span className="font-bold text-gray-800 text-right">{job.department}</span>
                                    </li>
                                    <li className="flex justify-between items-center">
                                        <span className="text-gray-500">Hình thức:</span>
                                        <span className="font-bold text-gray-800 text-right">{job.type || 'Toàn thời gian'}</span>
                                    </li>
                                    {/* Các trường giả định nếu DB chưa có */}
                                    <li className="flex justify-between items-center">
                                        <span className="text-gray-500">Kinh nghiệm:</span>
                                        <span className="font-bold text-gray-800 text-right">Theo yêu cầu</span>
                                    </li>
                                    <li className="flex justify-between items-center">
                                        <span className="text-gray-500">Giới tính:</span>
                                        <span className="font-bold text-gray-800 text-right">Nam/Nữ</span>
                                    </li>
                                </ul>
                                
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <a href="#apply-form" className="block w-full bg-[#f97316] hover:bg-orange-600 text-white font-bold py-3 px-4 rounded text-center transition mb-3 shadow-md">
                                        ỨNG TUYỂN NGAY
                                    </a>
                                    <p className="text-xs text-center text-gray-400">Hạn nộp hồ sơ: {new Date(job.deadline).toLocaleDateString('vi-VN')}</p>
                                </div>
                            </div>

                            {/* Contact HR */}
                            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-[#0f3a68] text-white flex items-center justify-center text-lg font-bold">HR</div>
                                    <div>
                                        <h4 className="font-bold text-[#0f3a68]">Phòng Tuyển Dụng</h4>
                                        <p className="text-xs text-gray-500">Vinarack HR Dept.</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-2"><i className="fas fa-phone-alt text-[#f97316] w-6"></i> 028.3838.xxxx</p>
                                <p className="text-sm text-gray-600"><i className="fas fa-envelope text-[#f97316] w-6"></i> hr@vinarack.vn</p>
                            </div>

                            {/* Share Job */}
                            <div className="text-center">
                                <p className="text-sm text-gray-500 mb-3 font-medium">Chia sẻ công việc này</p>
                                <div className="flex justify-center gap-3">
                                    <button className="w-10 h-10 rounded-full bg-white border border-gray-200 text-blue-600 flex items-center justify-center hover:bg-blue-50 transition"><i className="fab fa-facebook-f"></i></button>
                                    <button className="w-10 h-10 rounded-full bg-white border border-gray-200 text-blue-500 flex items-center justify-center hover:bg-blue-50 transition"><i className="fab fa-linkedin-in"></i></button>
                                    <button className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-50 transition"><i className="fas fa-link"></i></button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* APPLICATION FORM */}
            <section id="apply-form" className="py-16 bg-white border-t border-gray-200">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-[#0f3a68] mb-2">Gửi Hồ Sơ Ứng Tuyển</h2>
                        <p className="text-gray-600">Hãy để lại thông tin, bộ phận nhân sự sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
                    </div>

                    <form onSubmit={handleApply} className="space-y-6 bg-[#f8fafc] p-8 rounded-xl border border-gray-200 shadow-sm">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Họ và tên *</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] transition bg-white" 
                                    placeholder="Nguyễn Văn A"
                                    required
                                    value={applyForm.full_name}
                                    onChange={e => setApplyForm({...applyForm, full_name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Số điện thoại *</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] transition bg-white" 
                                    placeholder="09xxxxxxx"
                                    required
                                    value={applyForm.phone}
                                    onChange={e => setApplyForm({...applyForm, phone: e.target.value})}
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                            <input 
                                type="email" 
                                className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] transition bg-white" 
                                placeholder="email@domain.com"
                                required
                                value={applyForm.email}
                                onChange={e => setApplyForm({...applyForm, email: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Giới thiệu bản thân (Ngắn gọn)</label>
                            <textarea 
                                rows={4} 
                                className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] transition bg-white" 
                                placeholder="Tóm tắt kinh nghiệm và mong muốn của bạn..."
                                value={applyForm.introduction}
                                onChange={e => setApplyForm({...applyForm, introduction: e.target.value})}
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Link CV (Google Drive/PDF) *</label>
                            {/* Tạm dùng input text cho link CV vì backend hiện tại lưu cv_url */}
                            <input 
                                type="text" 
                                className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] transition bg-white" 
                                placeholder="https://drive.google.com/file/d/..."
                                required
                                value={applyForm.cv_url}
                                onChange={e => setApplyForm({...applyForm, cv_url: e.target.value})}
                            />
                            <p className="text-xs text-gray-400 mt-1">Vui lòng mở quyền truy cập link (Share everyone with link).</p>
                        </div>

                        <button 
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-[#0f3a68] hover:bg-blue-900 text-white font-bold py-4 rounded-lg transition shadow-lg text-lg disabled:opacity-70"
                        >
                            {submitting ? 'ĐANG GỬI...' : 'GỬI HỒ SƠ'}
                        </button>
                    </form>
                </div>
            </section>

            {/* OTHER JOBS */}
            {relatedJobs.length > 0 && (
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <h3 className="text-2xl font-bold text-[#0f3a68] mb-8 border-l-4 border-[#f97316] pl-3">Việc Làm Tương Tự</h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            {relatedJobs.map((rJob) => (
                                <Link key={rJob.id} href={`/recruitment/${rJob.slug}`} className="block bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-[#f97316] transition group">
                                    <h4 className="font-bold text-lg text-gray-800 group-hover:text-[#f97316] mb-2 line-clamp-2 h-14">{rJob.title}</h4>
                                    <p className="text-sm text-gray-500 mb-4"><i className="fas fa-map-marker-alt mr-1"></i> {rJob.location || 'TP.HCM'} • <span className="text-green-600 font-medium">{formatSalary(rJob.salary_range)}</span></p>
                                    <span className="text-xs font-bold text-[#0f3a68] bg-blue-50 px-2 py-1 rounded">{rJob.department}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}