'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ServicesPage() {
    return (
        <div className="font-sans text-gray-700 bg-white">
            {/* Lưu ý: Font Roboto cần được load ở layout.tsx hoặc head */}
            
            {/* HERO SECTION */}
            <div className="relative bg-[#0a2745] h-[400px] flex items-center justify-center text-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image 
                        src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
                        alt="Customer Service" 
                        fill
                        className="object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a2745]/90"></div>
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <span className="text-[#f97316] font-bold tracking-widest uppercase mb-2 block">Đồng Hành Cùng Doanh Nghiệp</span>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6">DỊCH VỤ & HỖ TRỢ KỸ THUẬT</h1>
                    <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                        Vinarack không chỉ cung cấp sản phẩm, chúng tôi mang đến giải pháp toàn diện từ tư vấn, thiết kế đến lắp đặt và bảo trì trọn đời cho kho hàng của bạn.
                    </p>
                </div>
            </div>

            {/* MAIN SERVICES GRID */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-[#0f3a68]">Dịch Vụ Của Chúng Tôi</h2>
                        <div className="w-20 h-1 bg-[#f97316] mx-auto mt-4 rounded"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Service 1 */}
                        <div className="p-8 border border-gray-100 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 group hover:-translate-y-1">
                            <div className="w-20 h-20 bg-blue-50 text-[#0f3a68] rounded-full flex items-center justify-center text-3xl mb-6 mx-auto group-hover:bg-[#f97316] group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
                                <i className="fas fa-compass"></i>
                            </div>
                            <h3 className="text-xl font-bold text-center text-[#0f3a68] mb-4">Tư Vấn & Khảo Sát Miễn Phí</h3>
                            <p className="text-gray-600 text-center leading-relaxed">
                                Đội ngũ kỹ sư sẽ đến tận nơi đo đạc diện tích, phân tích luồng hàng hóa và nhu cầu lưu trữ để đưa ra phương án tối ưu nhất, hoàn toàn miễn phí trên toàn quốc.
                            </p>
                        </div>

                        {/* Service 2 */}
                        <div className="p-8 border border-gray-100 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 group hover:-translate-y-1">
                            <div className="w-20 h-20 bg-blue-50 text-[#0f3a68] rounded-full flex items-center justify-center text-3xl mb-6 mx-auto group-hover:bg-[#f97316] group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
                                <i className="fas fa-drafting-compass"></i>
                            </div>
                            <h3 className="text-xl font-bold text-center text-[#0f3a68] mb-4">Thiết Kế Bản Vẽ 2D/3D</h3>
                            <p className="text-gray-600 text-center leading-relaxed">
                                Cung cấp bản vẽ kỹ thuật chi tiết và mô phỏng 3D trực quan giúp khách hàng hình dung rõ ràng về hệ thống kệ trước khi tiến hành sản xuất.
                            </p>
                        </div>

                        {/* Service 3 */}
                        <div className="p-8 border border-gray-100 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 group hover:-translate-y-1">
                            <div className="w-20 h-20 bg-blue-50 text-[#0f3a68] rounded-full flex items-center justify-center text-3xl mb-6 mx-auto group-hover:bg-[#f97316] group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
                                <i className="fas fa-tools"></i>
                            </div>
                            <h3 className="text-xl font-bold text-center text-[#0f3a68] mb-4">Vận Chuyển & Lắp Đặt</h3>
                            <p className="text-gray-600 text-center leading-relaxed">
                                Đội ngũ thi công chuyên nghiệp, trang bị đầy đủ máy móc, đảm bảo lắp đặt nhanh chóng, chính xác và an toàn tuyệt đối theo tiêu chuẩn ISO.
                            </p>
                        </div>

                        {/* Service 4 */}
                        <div className="p-8 border border-gray-100 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 group hover:-translate-y-1">
                            <div className="w-20 h-20 bg-blue-50 text-[#0f3a68] rounded-full flex items-center justify-center text-3xl mb-6 mx-auto group-hover:bg-[#f97316] group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
                                <i className="fas fa-wrench"></i>
                            </div>
                            <h3 className="text-xl font-bold text-center text-[#0f3a68] mb-4">Bảo Trì & Bảo Dưỡng</h3>
                            <p className="text-gray-600 text-center leading-relaxed">
                                Kiểm tra định kỳ hệ thống kệ, phát hiện và khắc phục sớm các rủi ro. Dịch vụ sửa chữa, thay thế linh kiện chính hãng nhanh chóng.
                            </p>
                        </div>

                        {/* Service 5 */}
                        <div className="p-8 border border-gray-100 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 group hover:-translate-y-1">
                            <div className="w-20 h-20 bg-blue-50 text-[#0f3a68] rounded-full flex items-center justify-center text-3xl mb-6 mx-auto group-hover:bg-[#f97316] group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
                                <i className="fas fa-truck-moving"></i>
                            </div>
                            <h3 className="text-xl font-bold text-center text-[#0f3a68] mb-4">Di Dời & Cải Tạo Kho</h3>
                            <p className="text-gray-600 text-center leading-relaxed">
                                Hỗ trợ doanh nghiệp tháo dỡ, di chuyển và lắp đặt lại hệ thống kệ khi chuyển kho hoặc muốn thay đổi layout để tối ưu hóa không gian mới.
                            </p>
                        </div>

                        {/* Service 6 */}
                        <div className="p-8 border border-gray-100 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 group hover:-translate-y-1">
                            <div className="w-20 h-20 bg-blue-50 text-[#0f3a68] rounded-full flex items-center justify-center text-3xl mb-6 mx-auto group-hover:bg-[#f97316] group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
                                <i className="fas fa-industry"></i>
                            </div>
                            <h3 className="text-xl font-bold text-center text-[#0f3a68] mb-4">Sản Xuất Theo Yêu Cầu (OEM)</h3>
                            <p className="text-gray-600 text-center leading-relaxed">
                                Nhận gia công các sản phẩm cơ khí, pallet sắt, xe đẩy hàng theo bản vẽ kỹ thuật riêng biệt của từng khách hàng với độ chính xác cao.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* WORKFLOW PROCESS */}
            <section className="py-20 bg-[#f1f5f9]">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="md:w-1/3">
                            <h2 className="text-3xl font-bold text-[#0f3a68] mb-6">Quy Trình Làm Việc Chuyên Nghiệp</h2>
                            <p className="text-gray-600 mb-6 text-lg">
                                Tại Vinarack, mọi dự án đều tuân thủ quy trình 6 bước nghiêm ngặt để đảm bảo chất lượng và tiến độ cam kết với khách hàng.
                            </p>
                            <Link href="/contact" className="inline-block px-8 py-3 bg-[#f97316] text-white rounded font-bold hover:bg-orange-600 transition shadow-lg hover:text-white">
                                LIÊN HỆ TƯ VẤN NGAY
                            </Link>
                        </div>
                        
                        <div className="md:w-2/3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Step 1 */}
                                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-[#0f3a68] flex gap-4 transition duration-300 hover:-translate-y-1">
                                    <div className="text-4xl font-black text-gray-200">01</div>
                                    <div>
                                        <h4 className="font-bold text-lg text-[#0f3a68]">Tiếp nhận yêu cầu</h4>
                                        <p className="text-sm text-gray-500">Ghi nhận thông tin sơ bộ qua Hotline/Email.</p>
                                    </div>
                                </div>
                                {/* Step 2 */}
                                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-[#f97316] flex gap-4 transition duration-300 hover:-translate-y-1">
                                    <div className="text-4xl font-black text-gray-200">02</div>
                                    <div>
                                        <h4 className="font-bold text-lg text-[#0f3a68]">Khảo sát thực tế</h4>
                                        <p className="text-sm text-gray-500">Kỹ sư đến đo đạc mặt bằng và tư vấn giải pháp.</p>
                                    </div>
                                </div>
                                {/* Step 3 */}
                                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-[#0f3a68] flex gap-4 transition duration-300 hover:-translate-y-1">
                                    <div className="text-4xl font-black text-gray-200">03</div>
                                    <div>
                                        <h4 className="font-bold text-lg text-[#0f3a68]">Thiết kế & Báo giá</h4>
                                        <p className="text-sm text-gray-500">Lên bản vẽ 2D/3D và gửi bảng báo giá chi tiết.</p>
                                    </div>
                                </div>
                                {/* Step 4 */}
                                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-[#f97316] flex gap-4 transition duration-300 hover:-translate-y-1">
                                    <div className="text-4xl font-black text-gray-200">04</div>
                                    <div>
                                        <h4 className="font-bold text-lg text-[#0f3a68]">Sản xuất</h4>
                                        <p className="text-sm text-gray-500">Gia công tại nhà máy theo tiêu chuẩn ISO.</p>
                                    </div>
                                </div>
                                {/* Step 5 */}
                                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-[#0f3a68] flex gap-4 transition duration-300 hover:-translate-y-1">
                                    <div className="text-4xl font-black text-gray-200">05</div>
                                    <div>
                                        <h4 className="font-bold text-lg text-[#0f3a68]">Lắp đặt & Bàn giao</h4>
                                        <p className="text-sm text-gray-500">Vận chuyển, lắp đặt và nghiệm thu công trình.</p>
                                    </div>
                                </div>
                                {/* Step 6 */}
                                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-[#f97316] flex gap-4 transition duration-300 hover:-translate-y-1">
                                    <div className="text-4xl font-black text-gray-200">06</div>
                                    <div>
                                        <h4 className="font-bold text-lg text-[#0f3a68]">Bảo hành & Hậu mãi</h4>
                                        <p className="text-sm text-gray-500">Chăm sóc định kỳ và bảo hành lên đến 5 năm.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* WARRANTY & MAINTENANCE DETAIL */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="bg-[#0a2745] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
                        <div className="md:w-1/2 relative min-h-[300px]">
                            <Image 
                                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                                alt="Engineer Checking" 
                                fill
                                className="object-cover opacity-80"
                            />
                        </div>
                        <div className="md:w-1/2 p-10 text-white flex flex-col justify-center">
                            <h3 className="text-2xl font-bold mb-4 text-[#f97316]">Chính Sách Bảo Hành Vàng</h3>
                            <p className="mb-6 text-gray-300 leading-relaxed">
                                Chúng tôi tự tin vào chất lượng sản phẩm của mình. Mọi hệ thống kệ Vinarack đều được áp dụng chính sách bảo hành chính hãng dài hạn.
                            </p>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center"><i className="fas fa-check-circle text-[#f97316] mr-3"></i> Bảo hành 5 năm cho kết cấu thép.</li>
                                <li className="flex items-center"><i className="fas fa-check-circle text-[#f97316] mr-3"></i> Bảo trì định kỳ 6 tháng/lần miễn phí trong năm đầu.</li>
                                <li className="flex items-center"><i className="fas fa-check-circle text-[#f97316] mr-3"></i> Hỗ trợ kỹ thuật 24/7 khi có sự cố.</li>
                            </ul>
                            <Link href="/contact" className="inline-block w-fit px-8 py-3 border border-white rounded font-bold hover:bg-white hover:text-[#0f3a68] transition">
                                ĐĂNG KÝ BẢO TRÌ
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}