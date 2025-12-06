'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getJobBySlug, submitApplication } from '@/services/api';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

export default function JobDetail() {
    const params = useParams();
    const slug = params?.slug as string;

    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Form State
    const [applyForm, setApplyForm] = useState({
        full_name: '',
        phone: '',
        email: '',
        introduction: '',
        cv_url: '' // Tạm thời nhập link CV, sau này có thể nâng cấp upload file
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!slug) return;
            try {
                const data = await getJobBySlug(slug);
                setJob(data);
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
                ...applyForm
            });
            toast.success("Nộp hồ sơ thành công! Bộ phận nhân sự sẽ liên hệ với bạn sớm.", { id: toastId, duration: 5000 });
            setApplyForm({ full_name: '', phone: '', email: '', introduction: '', cv_url: '' }); // Reset form
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi gửi hồ sơ. Vui lòng thử lại.", { id: toastId });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="py-20 text-center text-gray-500">Đang tải thông tin...</div>;
    if (!job) return <div className="py-20 text-center text-gray-500">Không tìm thấy tin tuyển dụng!</div>;

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <Toaster position="top-center" />
            
            {/* Header */}
            <div className="bg-[#0f3a68] text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-blue-200 mb-4">
                        <Link href="/recruitment" className="hover:text-white transition"><i className="fas fa-arrow-left mr-1"></i> Tuyển dụng</Link>
                        <span>/</span>
                        <span className="font-bold text-[#f97316]">{job.department}</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black mb-6">{job.title}</h1>
                    <div className="flex flex-wrap gap-6 text-sm">
                        <span className="flex items-center bg-white/10 px-3 py-1 rounded"><i className="fas fa-map-marker-alt mr-2 text-[#f97316]"></i> {job.location}</span>
                        <span className="flex items-center bg-white/10 px-3 py-1 rounded"><i className="fas fa-money-bill-wave mr-2 text-[#f97316]"></i> {job.salary_range}</span>
                        <span className="flex items-center bg-white/10 px-3 py-1 rounded"><i className="fas fa-clock mr-2 text-[#f97316]"></i> Hạn nộp: {new Date(job.deadline).toLocaleDateString('vi-VN')}</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* LEFT: JOB DESCRIPTION */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="text-xl font-bold text-[#0f3a68] mb-4 border-l-4 border-[#f97316] pl-3">Mô tả công việc</h3>
                            <div className="prose text-gray-600 whitespace-pre-line">{job.description}</div>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="text-xl font-bold text-[#0f3a68] mb-4 border-l-4 border-[#f97316] pl-3">Yêu cầu ứng viên</h3>
                            <div className="prose text-gray-600 whitespace-pre-line">{job.requirements}</div>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="text-xl font-bold text-[#0f3a68] mb-4 border-l-4 border-[#f97316] pl-3">Quyền lợi</h3>
                            <div className="prose text-gray-600 whitespace-pre-line">{job.benefits}</div>
                        </div>
                    </div>

                    {/* RIGHT: APPLY FORM */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 sticky top-24">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Ứng Tuyển Ngay</h3>
                            
                            <form onSubmit={handleApply} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">Họ và tên *</label>
                                    <input 
                                        type="text" required 
                                        className="w-full px-4 py-2 border rounded-lg focus:border-[#f97316] outline-none transition bg-gray-50"
                                        placeholder="Nguyễn Văn A"
                                        value={applyForm.full_name}
                                        onChange={e => setApplyForm({...applyForm, full_name: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">Số điện thoại *</label>
                                    <input 
                                        type="text" required 
                                        className="w-full px-4 py-2 border rounded-lg focus:border-[#f97316] outline-none transition bg-gray-50"
                                        placeholder="09xxxxxxx"
                                        value={applyForm.phone}
                                        onChange={e => setApplyForm({...applyForm, phone: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">Email *</label>
                                    <input 
                                        type="email" required 
                                        className="w-full px-4 py-2 border rounded-lg focus:border-[#f97316] outline-none transition bg-gray-50"
                                        placeholder="email@example.com"
                                        value={applyForm.email}
                                        onChange={e => setApplyForm({...applyForm, email: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">Link CV (Google Drive/PDF) *</label>
                                    <input 
                                        type="text" required 
                                        className="w-full px-4 py-2 border rounded-lg focus:border-[#f97316] outline-none transition bg-gray-50"
                                        placeholder="https://drive.google.com/..."
                                        value={applyForm.cv_url}
                                        onChange={e => setApplyForm({...applyForm, cv_url: e.target.value})}
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Vui lòng mở quyền truy cập link.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-1">Giới thiệu ngắn</label>
                                    <textarea 
                                        rows={3}
                                        className="w-full px-4 py-2 border rounded-lg focus:border-[#f97316] outline-none transition bg-gray-50"
                                        placeholder="Tóm tắt kinh nghiệm của bạn..."
                                        value={applyForm.introduction}
                                        onChange={e => setApplyForm({...applyForm, introduction: e.target.value})}
                                    ></textarea>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="w-full bg-[#f97316] text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition shadow-md disabled:opacity-70"
                                >
                                    {submitting ? 'Đang gửi...' : 'NỘP HỒ SƠ'}
                                </button>
                            </form>

                            <div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
                                <p>Hoặc gửi CV qua email:</p>
                                <a href="mailto:hr@vinarack.vn" className="font-bold text-[#0f3a68] hover:underline">hr@vinarack.vn</a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}