'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function CapacityPage() {
    return (
        <div className="font-sans text-gray-700 bg-white">
            
            {/* HERO SECTION */}
            <div className="relative bg-[#0a2745] h-[500px] flex items-center justify-center text-center">
                <div className="absolute inset-0 z-0">
                    <Image 
                        src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
                        alt="Factory Overview" 
                        fill
                        className="object-cover opacity-30"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a2745]/90"></div>
                </div>
                <div className="container mx-auto px-4 relative z-10 animate-fade-in-up">
                    <span className="bg-[#f97316] text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide uppercase mb-4 inline-block">Made In Vietnam</span>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">CÔNG NGHỆ SẢN XUẤT <br/>TIÊU CHUẨN CHÂU ÂU</h1>
                    <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto mb-8">
                        Hệ thống nhà máy 10.000m² tại Bình Dương với dây chuyền tự động hóa khép kín, sẵn sàng đáp ứng những đơn hàng quy mô lớn nhất.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link href="#machinery" className="bg-white text-[#0f3a68] px-8 py-3 rounded font-bold hover:bg-gray-100 transition">
                            Khám Phá Nhà Máy
                        </Link>
                        <Link href="#cert" className="border border-white text-white px-8 py-3 rounded font-bold hover:bg-white hover:text-[#0f3a68] transition">
                            Chứng Chỉ Chất Lượng
                        </Link>
                    </div>
                </div>
            </div>

            {/* SCALE & NUMBERS (Con số biết nói) */}
            <section className="py-16 bg-white relative -mt-16 z-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white rounded-xl shadow-xl p-8 border border-gray-100">
                        <div className="text-center border-r border-gray-100 last:border-0">
                            <div className="text-4xl font-black text-[#f97316] mb-2">10.000</div>
                            <div className="text-sm font-bold text-gray-500 uppercase">Mét vuông diện tích</div>
                        </div>
                        <div className="text-center border-r border-gray-100 last:border-0 md:border-r">
                            <div className="text-4xl font-black text-[#0f3a68] mb-2">15.000</div>
                            <div className="text-sm font-bold text-gray-500 uppercase">Tấn thép / Năm</div>
                        </div>
                        <div className="text-center border-r border-gray-100 last:border-0">
                            <div className="text-4xl font-black text-[#f97316] mb-2">150+</div>
                            <div className="text-sm font-bold text-gray-500 uppercase">Kỹ sư & Công nhân</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-black text-[#0f3a68] mb-2">ISO</div>
                            <div className="text-sm font-bold text-gray-500 uppercase">9001:2015</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TECHNOLOGY & MACHINERY (Công nghệ lõi) */}
            <section id="machinery" className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#0f3a68] mb-4">Dây Chuyền Công Nghệ Hiện Đại</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Vinarack không ngừng đầu tư vào máy móc tự động hóa để đảm bảo độ chính xác tuyệt đối và tính đồng nhất cho từng sản phẩm.</p>
                    </div>

                    {/* Robot Hàn */}
                    <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                        <div className="relative rounded-xl overflow-hidden shadow-2xl group tech-card h-[400px]">
                            <Image 
                                src="https://images.unsplash.com/photo-1565034946487-077786996e27?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                                alt="Robot Hàn" 
                                fill
                                className="object-cover transition duration-700 transform group-hover:scale-110"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                                <div className="flex items-center gap-4 text-white">
                                    <i className="fas fa-robot text-4xl text-[#f97316]"></i>
                                    <div>
                                        <h3 className="text-2xl font-bold">Hệ Thống Robot Hàn Tự Động</h3>
                                        <p className="text-sm opacity-90">Panasonic & OTC Daihen (Nhật Bản)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-[#0f3a68] mb-4">Độ chính xác & Thẩm mỹ cao</h3>
                            <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                Việc ứng dụng Robot hàn tự động giúp Vinarack tạo ra các mối hàn đồng nhất, ngấu sâu và cực kỳ bền chắc.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start"><i className="fas fa-check-circle text-[#f97316] mt-1 mr-3"></i> Mối hàn vảy cá đều đẹp, không cần mài dũa lại.</li>
                                <li className="flex items-start"><i className="fas fa-check-circle text-[#f97316] mt-1 mr-3"></i> Tốc độ hàn nhanh gấp 3 lần thợ hàn thủ công.</li>
                                <li className="flex items-start"><i className="fas fa-check-circle text-[#f97316] mt-1 mr-3"></i> Đảm bảo kết cấu chịu lực ổn định cho các hệ thống kệ cao tầng.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Sơn Tĩnh Điện */}
                    <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                        <div className="order-2 md:order-1">
                            <h3 className="text-2xl font-bold text-[#0f3a68] mb-4">Dây Chuyền Sơn Tĩnh Điện Khép Kín</h3>
                            <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                Hệ thống sơn tĩnh điện tự động với quy trình xử lý bề mặt 7 bước nghiêm ngặt, đảm bảo lớp sơn bám dính cực tốt và chống ăn mòn hiệu quả.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start"><i className="fas fa-check-circle text-[#f97316] mt-1 mr-3"></i> Sử dụng bột sơn AkzoNobel / Jotun cao cấp.</li>
                                <li className="flex items-start"><i className="fas fa-check-circle text-[#f97316] mt-1 mr-3"></i> Buồng phun sơn tự động thu hồi bột (Thân thiện môi trường).</li>
                                <li className="flex items-start"><i className="fas fa-check-circle text-[#f97316] mt-1 mr-3"></i> Độ bền màu trên 10 năm trong điều kiện kho thường.</li>
                            </ul>
                        </div>
                        <div className="order-1 md:order-2 relative rounded-xl overflow-hidden shadow-2xl group tech-card h-[400px]">
                            <Image 
                                src="https://images.unsplash.com/photo-1616401784845-180882ba9ba8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                                alt="Sơn Tĩnh Điện"
                                fill
                                className="object-cover transition duration-700 transform group-hover:scale-110"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                                <div className="flex items-center gap-4 text-white">
                                    <i className="fas fa-spray-can text-4xl text-[#f97316]"></i>
                                    <div>
                                        <h3 className="text-2xl font-bold">Công Nghệ Sơn Powder Coating</h3>
                                        <p className="text-sm opacity-90">Tiêu chuẩn ASTM (Mỹ)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Máy Cán Tôn */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative rounded-xl overflow-hidden shadow-2xl group tech-card h-[400px]">
                            <Image 
                                src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                                alt="Máy Cán Tôn"
                                fill
                                className="object-cover transition duration-700 transform group-hover:scale-110"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                                <div className="flex items-center gap-4 text-white">
                                    <i className="fas fa-cogs text-4xl text-[#f97316]"></i>
                                    <div>
                                        <h3 className="text-2xl font-bold">Máy Cán Tôn Profile Omega</h3>
                                        <p className="text-sm opacity-90">Công suất lớn, độ sai số &lt; 0.5mm</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-[#0f3a68] mb-4">Hệ Thống Máy Cán Tạo Hình</h3>
                            <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                Các dây chuyền cán tôn liên tục tạo ra các thanh trụ Omega và thanh Beam với độ dài bất kỳ, không nối, đảm bảo khả năng chịu lực tối ưu.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start"><i className="fas fa-check-circle text-[#f97316] mt-1 mr-3"></i> Tự động đột lỗ đồng bộ trên dây chuyền.</li>
                                <li className="flex items-start"><i className="fas fa-check-circle text-[#f97316] mt-1 mr-3"></i> Cán được thép dày lên đến 4.0mm.</li>
                                <li className="flex items-start"><i className="fas fa-check-circle text-[#f97316] mt-1 mr-3"></i> Đảm bảo kích thước chính xác tuyệt đối để lắp ráp dễ dàng.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* PRODUCTION PROCESS (Quy trình) */}
            <section className="py-20 bg-[#f1f5f9]">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-[#0f3a68] mb-16">Quy Trình Sản Xuất Khép Kín</h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-8 relative">
                        {/* Step 1 */}
                        <div className="relative text-center after:content-[''] after:absolute after:hidden md:after:block after:top-1/2 after:-right-5 after:w-10 after:h-0.5 after:bg-[#e2e8f0] after:z-10 last:after:hidden">
                            <div className="w-16 h-16 bg-white border-2 border-[#0f3a68] text-[#0f3a68] rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4 z-10 relative shadow-md">
                                <i className="fas fa-cubes"></i>
                            </div>
                            <h4 className="font-bold text-gray-800">Nguyên Liệu</h4>
                            <p className="text-xs text-gray-500 mt-1">Thép cuộn JIS/ASTM</p>
                        </div>
                        
                         {/* Step 2 */}
                         <div className="relative text-center after:content-[''] after:absolute after:hidden md:after:block after:top-1/2 after:-right-5 after:w-10 after:h-0.5 after:bg-[#e2e8f0] after:z-10 last:after:hidden">
                            <div className="w-16 h-16 bg-white border-2 border-[#0f3a68] text-[#0f3a68] rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4 z-10 relative shadow-md">
                                <i className="fas fa-cut"></i>
                            </div>
                            <h4 className="font-bold text-gray-800">Cắt & Đột</h4>
                            <p className="text-xs text-gray-500 mt-1">Xử lý CNC chính xác</p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative text-center after:content-[''] after:absolute after:hidden md:after:block after:top-1/2 after:-right-5 after:w-10 after:h-0.5 after:bg-[#e2e8f0] after:z-10 last:after:hidden">
                            <div className="w-16 h-16 bg-white border-2 border-[#0f3a68] text-[#0f3a68] rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4 z-10 relative shadow-md">
                                <i className="fas fa-layer-group"></i>
                            </div>
                            <h4 className="font-bold text-gray-800">Cán Tạo Hình</h4>
                            <p className="text-xs text-gray-500 mt-1">Profile Omega/Z</p>
                        </div>

                        {/* Step 4 */}
                        <div className="relative text-center after:content-[''] after:absolute after:hidden md:after:block after:top-1/2 after:-right-5 after:w-10 after:h-0.5 after:bg-[#e2e8f0] after:z-10 last:after:hidden">
                            <div className="w-16 h-16 bg-white border-2 border-[#0f3a68] text-[#0f3a68] rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4 z-10 relative shadow-md">
                                <i className="fas fa-fire"></i>
                            </div>
                            <h4 className="font-bold text-gray-800">Hàn Robot</h4>
                            <p className="text-xs text-gray-500 mt-1">Kết cấu chân/Beam</p>
                        </div>

                        {/* Step 5 */}
                        <div className="relative text-center after:content-[''] after:absolute after:hidden md:after:block after:top-1/2 after:-right-5 after:w-10 after:h-0.5 after:bg-[#e2e8f0] after:z-10 last:after:hidden">
                            <div className="w-16 h-16 bg-white border-2 border-[#0f3a68] text-[#0f3a68] rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4 z-10 relative shadow-md">
                                <i className="fas fa-paint-roller"></i>
                            </div>
                            <h4 className="font-bold text-gray-800">Sơn Tĩnh Điện</h4>
                            <p className="text-xs text-gray-500 mt-1">Bảo vệ bề mặt</p>
                        </div>

                        {/* Step 6 */}
                        <div className="relative text-center after:content-[''] after:absolute after:hidden md:after:block after:top-1/2 after:-right-5 after:w-10 after:h-0.5 after:bg-[#e2e8f0] after:z-10 last:after:hidden">
                            <div className="w-16 h-16 bg-white border-2 border-[#f97316] text-[#f97316] rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4 z-10 relative shadow-md">
                                <i className="fas fa-clipboard-check"></i>
                            </div>
                            <h4 className="font-bold text-gray-800">Kiểm Tra QC</h4>
                            <p className="text-xs text-gray-500 mt-1">Đóng gói & Xuất xưởng</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* QUALITY CONTROL & CERTIFICATES */}
            <section id="cert" className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-12">
                        <div className="md:w-1/2">
                            <h2 className="text-3xl font-bold text-[#0f3a68] mb-6">Cam Kết Chất Lượng</h2>
                            <p className="text-gray-600 text-lg mb-6 text-justify">
                                Tại Vinarack, chất lượng không chỉ là khẩu hiệu, đó là quy trình. Mỗi lô hàng trước khi xuất xưởng đều phải trải qua quy trình kiểm tra nghiêm ngặt (Test tải trọng, test độ bám dính sơn, kiểm tra kích thước...).
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-4 border border-gray-100 rounded-lg bg-gray-50">
                                    <i className="fas fa-certificate text-3xl text-[#f97316]"></i>
                                    <div>
                                        <div className="font-bold text-[#0f3a68]">ISO 9001:2015</div>
                                        <div className="text-xs text-gray-500">Quản lý chất lượng</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 border border-gray-100 rounded-lg bg-gray-50">
                                    <i className="fas fa-globe text-3xl text-[#f97316]"></i>
                                    <div>
                                        <div className="font-bold text-[#0f3a68]">Tiêu chuẩn JIS</div>
                                        <div className="text-xs text-gray-500">Thép Nhật Bản G3101</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="md:w-1/2 bg-[#f1f5f9] p-8 rounded-xl border border-gray-200">
                            <h3 className="font-bold text-xl text-[#0f3a68] mb-4">Đối Tác Nguyên Liệu Uy Tín</h3>
                            <p className="text-gray-600 mb-6">Chúng tôi chỉ sử dụng thép từ các nhà cung cấp hàng đầu để đảm bảo tính ổn định của sản phẩm.</p>
                            <div className="grid grid-cols-3 gap-6 opacity-70">
                                <div className="bg-white h-16 flex items-center justify-center font-black text-gray-400 border border-gray-200 rounded">HOA SEN</div>
                                <div className="bg-white h-16 flex items-center justify-center font-black text-gray-400 border border-gray-200 rounded">POSCO</div>
                                <div className="bg-white h-16 flex items-center justify-center font-black text-gray-400 border border-gray-200 rounded">NIPPON</div>
                                <div className="bg-white h-16 flex items-center justify-center font-black text-gray-400 border border-gray-200 rounded">AKZONOBEL</div>
                                <div className="bg-white h-16 flex items-center justify-center font-black text-gray-400 border border-gray-200 rounded">JOTUN</div>
                                <div className="bg-white h-16 flex items-center justify-center font-black text-gray-400 border border-gray-200 rounded">HOA PHAT</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CALL TO ACTION (Factory Visit) */}
            <section className="py-20 bg-[#0a2745] text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <Image 
                        src="https://www.transparenttextures.com/patterns/carbon-fibre.png" 
                        alt="Pattern"
                        fill
                        className="object-cover"
                        unoptimized
                    />
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <h2 className="text-4xl font-bold mb-6">Mời Bạn Đến Tham Quan Nhà Máy</h2>
                    <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
                        "Trăm nghe không bằng một thấy". Vinarack hân hạnh đón tiếp quý khách hàng đến tham quan trực tiếp dây chuyền sản xuất tại Bình Dương.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link href="/contact" className="px-8 py-4 bg-[#f97316] text-white rounded font-bold hover:bg-orange-600 transition shadow-lg text-lg">
                            ĐẶT LỊCH THAM QUAN
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}