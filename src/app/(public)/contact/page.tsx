'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { sendContact, ContactPayload } from '@/services/api';
import toast, { Toaster } from 'react-hot-toast';

export default function ContactPage() {
    const [formData, setFormData] = useState<ContactPayload>({
        fullName: '',
        phone: '',
        email: '',
        productInterest: 'Kệ Selective', // Giá trị mặc định
        message: ''
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading('Đang gửi thông tin...');

        try {
            await sendContact(formData);
            toast.success('Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm nhất.', { id: toastId });
            // Reset form
            setFormData({
                fullName: '',
                phone: '',
                email: '',
                productInterest: 'Kệ Selective',
                message: ''
            });
        } catch (error) {
            console.error("Lỗi gửi liên hệ:", error);
            toast.error('Có lỗi xảy ra. Vui lòng thử lại sau hoặc gọi hotline.', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="font-sans text-gray-700 bg-white">
            <Toaster position="top-center" />

            {/* HERO SECTION */}
            <div className="relative bg-[#0a2745] h-[400px] flex items-center justify-center text-center">
                <div className="absolute inset-0 z-0">
                    <Image 
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
                        alt="Contact Banner" 
                        fill
                        className="object-cover opacity-20"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a2745]/90"></div>
                </div>
                <div className="container mx-auto px-4 relative z-10 animate-fade-in-up">
                    <span className="text-[#f97316] font-bold tracking-widest uppercase mb-2 block">Hỗ Trợ 24/7</span>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6">LIÊN HỆ VỚI VINARACK</h1>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        Chúng tôi luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của Quý khách về giải pháp lưu trữ kho hàng.
                    </p>
                </div>
            </div>

            {/* CONTACT INFO & FORM */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        
                        {/* LEFT: Contact Info */}
                        <div className="space-y-10">
                            <div>
                                <h2 className="text-3xl font-bold text-[#0f3a68] mb-6 border-l-4 border-[#f97316] pl-4">Thông Tin Liên Hệ</h2>
                                <p className="text-gray-600 mb-8 leading-relaxed">
                                    Vui lòng liên hệ trực tiếp với chúng tôi qua các kênh dưới đây hoặc điền vào biểu mẫu, bộ phận kinh doanh sẽ liên hệ lại ngay lập tức.
                                </p>

                                <div className="space-y-6">
                                    {/* Address */}
                                    <div className="flex items-start gap-4 p-6 rounded-xl bg-[#f8fafc] border border-gray-100 hover:shadow-md transition">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#f97316] shadow-sm flex-shrink-0">
                                            <i className="fas fa-map-marker-alt text-xl"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#0f3a68] text-lg mb-1">Văn Phòng & Nhà Máy</h4>
                                            <p className="text-gray-600 text-sm">Số 3, Đường 40, Khu phố 8, Phường Hiệp Bình Chánh, TP. Thủ Đức, TP.HCM</p>
                                        </div>
                                    </div>

                                    {/* Hotline */}
                                    <div className="flex items-start gap-4 p-6 rounded-xl bg-[#f8fafc] border border-gray-100 hover:shadow-md transition">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#f97316] shadow-sm flex-shrink-0">
                                            <i className="fas fa-phone-alt text-xl"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#0f3a68] text-lg mb-1">Hotline Tư Vấn</h4>
                                            <p className="text-gray-600 text-sm mb-1">0914.415.277 (Mr. Tuan)</p>
                                            <p className="text-gray-600 text-sm">028.3838.xxxx (Văn phòng)</p>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="flex items-start gap-4 p-6 rounded-xl bg-[#f8fafc] border border-gray-100 hover:shadow-md transition">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#f97316] shadow-sm flex-shrink-0">
                                            <i className="fas fa-envelope text-xl"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#0f3a68] text-lg mb-1">Email Hỗ Trợ</h4>
                                            <p className="text-gray-600 text-sm mb-1">contact@vinarack.vn</p>
                                            <p className="text-gray-600 text-sm">sales@vinarack.vn</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Contact Form */}
                        <div className="bg-[#f8fafc] p-8 md:p-10 rounded-2xl shadow-lg border border-gray-200">
                            <h3 className="text-2xl font-bold text-[#0f3a68] mb-6 text-center">Gửi Yêu Cầu Báo Giá</h3>
                            
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Họ và tên *</label>
                                    <input 
                                        type="text" 
                                        name="fullName"
                                        required
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] transition bg-white"
                                        placeholder="Nhập họ tên của bạn"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Số điện thoại *</label>
                                        <input 
                                            type="text" 
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] transition bg-white"
                                            placeholder="0912..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                                        <input 
                                            type="email" 
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] transition bg-white"
                                            placeholder="email@domain.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Sản phẩm quan tâm</label>
                                    <select 
                                        name="productInterest"
                                        value={formData.productInterest}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] transition bg-white cursor-pointer"
                                    >
                                        <option value="Kệ Selective">Kệ Selective (Tải nặng)</option>
                                        <option value="Kệ Drive-in">Kệ Drive-in</option>
                                        <option value="Kệ Trung Tải">Kệ Trung Tải (Long Span)</option>
                                        <option value="Kệ Sàn Mezzanine">Kệ Sàn Mezzanine</option>
                                        <option value="Pallet Sắt">Pallet Sắt</option>
                                        <option value="Bảo Trì">Dịch Vụ Bảo Trì</option>
                                        <option value="Khác">Khác</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Nội dung chi tiết</label>
                                    <textarea 
                                        name="message"
                                        rows={4}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] transition bg-white"
                                        placeholder="Mô tả nhu cầu của bạn (Kích thước, tải trọng, số lượng...)"
                                    ></textarea>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full bg-[#f97316] hover:bg-orange-600 text-white font-bold py-4 rounded-lg transition shadow-lg text-lg transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? <><i className="fas fa-spinner fa-spin mr-2"></i> Đang Gửi...</> : 'GỬI YÊU CẦU NGAY'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* MAP SECTION */}
            <section className="h-[450px] w-full bg-gray-200 relative">
                 {/* Placeholder cho Google Map - Bạn có thể thay bằng iframe thực tế */}
                <div className="absolute inset-0 flex items-center justify-center bg-gray-300 text-gray-500">
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.924843764836!2d106.7196023153344!3d10.817066961400263!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528822d544021%3A0x6a0c5c4e0d7c7c7a!2sVinarack!5e0!3m2!1svi!2s!4v1620000000000!5m2!1svi!2s" 
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        className="grayscale hover:grayscale-0 transition duration-500"
                    ></iframe>
                </div>
            </section>

        </div>
    );
}