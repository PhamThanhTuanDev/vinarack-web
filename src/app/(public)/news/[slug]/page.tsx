'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getNewsBySlug } from '@/services/api';
import Link from 'next/link';
import Image from 'next/image';

export default function NewsDetail() {
    const params = useParams();
    const slug = params?.slug as string;

    const [news, setNews] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!slug) return;
            try {
                const data = await getNewsBySlug(slug);
                setNews(data);
            } catch (error) {
                console.error("Lỗi tải bài viết:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    if (loading) return <div className="py-20 text-center"><i className="fas fa-spinner fa-spin mr-2"></i> Đang tải bài viết...</div>;
    if (!news) return <div className="py-20 text-center">Không tìm thấy bài viết!</div>;

    return (
        <div className="bg-white pb-20">
            
            {/* Header Image */}
            <div className="relative h-[400px] bg-gray-900">
                <Image 
                    src={news.thumbnail_url || 'https://placehold.co/1200x600?text=Header'} 
                    alt={news.title}
                    fill
                    className="object-cover opacity-40"
                    priority
                />
                <div className="absolute inset-0 flex flex-col justify-center container mx-auto px-4">
                    <div className="max-w-4xl">
                        <Link href="/news" className="inline-block bg-[#f97316] text-white text-xs font-bold px-3 py-1 rounded uppercase mb-4 hover:bg-orange-600 transition">
                            {news.category === 'knowledge' ? 'Kiến thức' : 'Tin tức'}
                        </Link>
                        <h1 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                            {news.title}
                        </h1>
                        <div className="flex items-center gap-6 text-gray-300 text-sm">
                            <span><i className="far fa-calendar-alt mr-2"></i> {new Date(news.published_at).toLocaleDateString('vi-VN')}</span>
                            <span><i className="far fa-user mr-2"></i> {news.author || 'Admin'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    
                    {/* Main Content */}
                    <div className="lg:w-3/4">
                        {/* Summary */}
                        <div className="text-xl font-medium text-gray-600 mb-8 leading-relaxed border-l-4 border-[#0f3a68] pl-6 italic">
                            {news.summary}
                        </div>

                        {/* HTML Content (Render nội dung từ TinyMCE) */}
                        <article 
                            className="prose prose-lg max-w-none text-gray-700 prose-headings:text-[#0f3a68] prose-a:text-blue-600 prose-img:rounded-xl"
                            dangerouslySetInnerHTML={{ __html: news.content }}
                        ></article>
                        
                        {/* Share */}
                        <div className="border-t border-gray-200 mt-12 pt-8 flex items-center justify-between">
                            <span className="font-bold text-gray-700">Chia sẻ bài viết:</span>
                            <div className="flex gap-2">
                                <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:opacity-90"><i className="fab fa-facebook-f"></i></button>
                                <button className="w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center hover:opacity-90"><i className="fab fa-twitter"></i></button>
                                <button className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center hover:opacity-90"><i className="fab fa-linkedin-in"></i></button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar (Optional) */}
                    <aside className="lg:w-1/4 space-y-8">
                        {/* Box Tư vấn */}
                        <div className="bg-[#0f3a68] text-white p-8 rounded-xl text-center">
                            <h3 className="text-xl font-bold mb-4">Cần Tư Vấn Giải Pháp?</h3>
                            <p className="text-blue-200 mb-6 text-sm">Liên hệ ngay để được khảo sát kho miễn phí và nhận báo giá tốt nhất.</p>
                            <Link href="/contact" className="inline-block w-full py-3 bg-[#f97316] rounded font-bold hover:bg-orange-600 transition">
                                LIÊN HỆ NGAY
                            </Link>
                        </div>
                        
                        {/* Tag Cloud (Demo) */}
                        <div>
                            <h4 className="font-bold text-gray-800 mb-4 border-l-4 border-[#f97316] pl-3">Chủ Đề</h4>
                            <div className="flex flex-wrap gap-2">
                                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-xs hover:bg-gray-200 cursor-pointer">Kệ kho hàng</span>
                                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-xs hover:bg-gray-200 cursor-pointer">Logistics</span>
                                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-xs hover:bg-gray-200 cursor-pointer">Kho lạnh</span>
                                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-xs hover:bg-gray-200 cursor-pointer">Vận hành kho</span>
                            </div>
                        </div>
                    </aside>

                </div>
            </div>
        </div>
    );
}