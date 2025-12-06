'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAdminProjects } from '@/services/api';

const INDUSTRIES = [
    { id: 'all', name: 'Tất cả' },
    { id: 'Logistics', name: 'Logistics' },
    { id: 'Kho Lạnh', name: 'Kho Lạnh' },
    { id: 'Sản Xuất', name: 'Sản Xuất' },
    { id: 'FMCG', name: 'Thực Phẩm & Tiêu Dùng' },
    { id: 'May Mặc', name: 'Dệt May' },
];

export default function ProjectsPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAdminProjects();
                setProjects(data);
            } catch (error) {
                console.error("Lỗi tải dự án:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredProjects = filter === 'all' 
        ? projects 
        : projects.filter(p => p.industry === filter);

    if (loading) return <div className="py-20 text-center text-gray-500"><i className="fas fa-spinner fa-spin mr-2"></i> Đang tải dự án...</div>;

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            
            {/* Header Banner */}
            <div className="relative h-[400px] bg-[#0a2745] flex items-center justify-center text-center px-4">
                <div className="absolute inset-0 opacity-20">
                    <Image 
                        src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
                        alt="Projects Banner" 
                        fill 
                        className="object-cover"
                    />
                </div>
                <div className="relative z-10 max-w-3xl">
                    <span className="text-[#f97316] font-bold tracking-widest uppercase mb-2 block">Năng Lực Thực Tế</span>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6">DỰ ÁN TIÊU BIỂU</h1>
                    <p className="text-gray-300 text-lg">
                        Hơn 2000+ doanh nghiệp đã tin tưởng lựa chọn giải pháp lưu trữ của Vinarack.
                    </p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm py-4">
                <div className="container mx-auto px-4 overflow-x-auto">
                    <div className="flex justify-start md:justify-center gap-2 min-w-max">
                        {INDUSTRIES.map(ind => (
                            <button
                                key={ind.id}
                                onClick={() => setFilter(ind.id)}
                                className={`px-5 py-2 rounded-full text-sm font-bold transition whitespace-nowrap ${
                                    filter === ind.id 
                                    ? 'bg-[#0f3a68] text-white' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {ind.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="container mx-auto px-4 py-12">
                {filteredProjects.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProjects.map((project) => (
                            <Link key={project.id} href={`/projects/${project.slug}`} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition duration-300 flex flex-col h-full border border-gray-100">
                                <div className="relative h-64 overflow-hidden bg-gray-100">
                                    <Image 
                                        src={project.thumbnail || 'https://placehold.co/800x600?text=No+Image'} 
                                        alt={project.title}
                                        fill
                                        className="object-cover transition duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded text-xs font-bold text-[#0f3a68] shadow-sm uppercase">
                                        {project.industry}
                                    </div>
                                    {project.is_featured === 1 && (
                                        <div className="absolute top-4 left-4 bg-[#f97316] text-white px-3 py-1 rounded text-xs font-bold shadow-sm uppercase">
                                            <i className="fas fa-star mr-1"></i> Nổi bật
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-[#0f3a68] mb-2 group-hover:text-[#f97316] transition line-clamp-2">
                                        {project.title}
                                    </h3>
                                    <div className="text-sm text-gray-500 mb-4 space-y-1">
                                        <p><i className="fas fa-user-tie w-5 text-center mr-2"></i> {project.customer_name}</p>
                                        <p><i className="fas fa-map-marker-alt w-5 text-center mr-2"></i> {project.location}</p>
                                        <p><i className="fas fa-ruler-combined w-5 text-center mr-2"></i> {project.scale}</p>
                                    </div>
                                    <span className="mt-auto text-[#0f3a68] font-bold text-sm inline-flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                                        Xem chi tiết <i className="fas fa-arrow-right"></i>
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-400">
                        <i className="fas fa-project-diagram text-4xl mb-4 block"></i>
                        Chưa có dự án nào trong mục này.
                    </div>
                )}
            </div>
            
            {/* CTA */}
            <div className="container mx-auto px-4 mb-10 text-center">
                <div className="bg-[#0f3a68] rounded-2xl p-10 md:p-16 text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold mb-4">Bạn Đang Tìm Giải Pháp Tương Tự?</h2>
                        <p className="text-blue-200 mb-8 text-lg">Đội ngũ kỹ sư Vinarack sẵn sàng tư vấn và thiết kế miễn phí cho kho hàng của bạn.</p>
                        <Link href="/contact" className="inline-block px-8 py-4 bg-[#f97316] text-white rounded-lg font-bold text-lg hover:bg-orange-600 transition shadow-lg transform hover:-translate-y-1">
                            LIÊN HỆ NGAY
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    );
}