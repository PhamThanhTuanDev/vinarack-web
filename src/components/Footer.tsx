'use client'; // Thêm dòng này để dùng được usePathname

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
    const pathname = usePathname();

    // --> ĐOẠN MỚI THÊM: Ẩn Footer nếu đang ở trang Admin <--
    if (pathname && pathname.startsWith('/admin')) {
        return null;
    }
    // -----------------------------------------------------

    return (
        <footer className="bg-gray-900 text-gray-300 pt-20 pb-10">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    {/* Col 1: About */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-[#f97316] text-white flex items-center justify-center font-bold rounded">V</div>
                            <span className="font-black text-xl text-white">VINARACK</span>
                        </div>
                        <p className="text-sm leading-relaxed mb-6">
                            Công ty Cổ phần Bảo Chánh - Vinarack chuyên cung cấp các giải pháp lưu trữ kho hàng công nghiệp hàng đầu tại Việt Nam.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center hover:bg-[#f97316] hover:text-white transition"><i className="fab fa-facebook-f"></i></a>
                            <a href="#" className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center hover:bg-[#f97316] hover:text-white transition"><i className="fab fa-youtube"></i></a>
                            <a href="#" className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center hover:bg-[#f97316] hover:text-white transition"><i className="fab fa-linkedin-in"></i></a>
                        </div>
                    </div>

                    {/* Col 2: Products */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg">Sản Phẩm Chính</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/products#heavy-duty" className="hover:text-[#f97316] transition">Kệ Selective Pallet</Link></li>
                            <li><Link href="/products#heavy-duty" className="hover:text-[#f97316] transition">Kệ Drive-in / Drive-thru</Link></li>
                            <li><Link href="/products#floor" className="hover:text-[#f97316] transition">Kệ Sàn Mezzanine</Link></li>
                            <li><Link href="/products#medium-duty" className="hover:text-[#f97316] transition">Kệ Trung Tải</Link></li>
                            <li><Link href="/products#auxiliary" className="hover:text-[#f97316] transition">Pallet Thép</Link></li>
                        </ul>
                    </div>

                    {/* Col 3: Support */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg">Hỗ Trợ Khách Hàng</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/services" className="hover:text-[#f97316] transition">Quy trình làm việc</Link></li>
                            <li><Link href="/contact" className="hover:text-[#f97316] transition">Chính sách bảo hành</Link></li>
                            <li><Link href="/capacity" className="hover:text-[#f97316] transition">Năng lực sản xuất</Link></li>
                            <li><Link href="/news" className="hover:text-[#f97316] transition">Tin tức & Sự kiện</Link></li>
                            <li><Link href="/recruitment" className="hover:text-[#f97316] transition">Tuyển dụng</Link></li>
                        </ul>
                    </div>

                    {/* Col 4: Contact */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg">Liên Hệ</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start">
                                <i className="fas fa-map-marker-alt mt-1 mr-3 text-[#f97316]"></i>
                                <span>Số 3, Đường 40, Kp.8, P.Hiệp Bình Chánh, TP.Thủ Đức, TP.HCM</span>
                            </li>
                            <li className="flex items-center">
                                <i className="fas fa-phone-alt mr-3 text-[#f97316]"></i>
                                <span>0909.787.797</span>
                            </li>
                            <li className="flex items-center">
                                <i className="fas fa-envelope mr-3 text-[#f97316]"></i>
                                <span>contact@vinarack.vn</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Vinarack. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}