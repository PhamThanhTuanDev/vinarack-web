'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getNews } from '@/services/api';

export default function NewsPage() {
    const [newsList, setNewsList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, knowledge, company, event

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getNews();
                setNewsList(data);
            } catch (error) {
                console.error("Lỗi tải tin tức:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Lọc bài viết
    const filteredNews = filter === 'all' 
        ? newsList 
        : newsList.filter(item => item.category === filter);

    // Bài nổi bật (Lấy bài mới nhất)
    const featuredPost = newsList[0];

    if (loading) return <div className="py-20 text-center text-gray-500">Đang tải tin tức...</div>;

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            
            {/* Header Banner */}
            <div className="bg-white py-12 border-b border-gray-200">
                <div className="container mx-auto px-4 text-center">
                    <span className="text-[#f97316] font-bold uppercase tracking-widest text-sm mb-2 block">Blog & Sự Kiện</span>
                    <h1 className="text-3xl md:text-5xl font-black text-[#0f3a68] mb-4">Kiến Thức Kho Vận</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Cập nhật xu hướng công nghệ lưu trữ mới nhất và các hoạt động nổi bật của Vinarack.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-10">
                
                {/* Filter Tabs */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    <button 
                        onClick={() => setFilter('all')}
                        className={`px-6 py-2 rounded-full font-bold text-sm transition ${filter === 'all' ? 'bg-[#0f3a68] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    >
                        Tất cả
                    </button>
                    <button 
                        onClick={() => setFilter('knowledge')}
                        className={`px-6 py-2 rounded-full font-bold text-sm transition ${filter === 'knowledge' ? 'bg-[#0f3a68] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    >
                        Kiến thức
                    </button>
                    <button 
                        onClick={() => setFilter('company')}
                        className={`px-6 py-2 rounded-full font-bold text-sm transition ${filter === 'company' ? 'bg-[#0f3a68] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    >
                        Tin công ty
                    </button>
                </div>

                {/* Featured Post (Chỉ hiện khi xem Tất cả) */}
                {filter === 'all' && featuredPost && (
                    <div className="mb-16">
                        <Link href={`/news/${featuredPost.slug}`} className="group block relative rounded-2xl overflow-hidden shadow-xl aspect-w-16 aspect-h-9 md:aspect-h-6 lg:aspect-h-5 bg-gray-900">
                            <Image 
                                src={featuredPost.thumbnail_url || 'https://placehold.co/1200x600?text=No+Image'} 
                                alt={featuredPost.title}
                                fill
                                className="object-cover opacity-80 group-hover:opacity-60 transition duration-500 group-hover:scale-105"
                            />
                            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-2/3 text-white">
                                <span className="bg-[#f97316] text-xs font-bold px-3 py-1 rounded uppercase mb-4 inline-block">Mới nhất</span>
                                <h2 className="text-2xl md:text-4xl font-bold mb-4 leading-tight group-hover:underline">
                                    {featuredPost.title}
                                </h2>
                                <p className="text-gray-200 line-clamp-2 md:line-clamp-3 text-lg mb-6">
                                    {featuredPost.summary}
                                </p>
                                <span className="text-sm font-bold flex items-center gap-2">
                                    Đọc tiếp <i className="fas fa-arrow-right"></i>
                                </span>
                            </div>
                        </Link>
                    </div>
                )}

                {/* News Grid */}
                {filteredNews.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredNews.map((item) => (
                            <Link key={item.id} href={`/news/${item.slug}`} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition border border-gray-100 flex flex-col h-full">
                                <div className="relative h-56 overflow-hidden">
                                    <Image 
                                        src={item.thumbnail_url || 'https://placehold.co/600x400?text=No+Image'} 
                                        alt={item.title}
                                        fill
                                        className="object-cover transition duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-xs font-bold px-3 py-1 rounded text-[#0f3a68] uppercase">
                                        {item.category === 'knowledge' ? 'Kiến thức' : item.category === 'company' ? 'Tin tức' : 'Sự kiện'}
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="text-xs text-gray-400 mb-3 flex items-center gap-2">
                                        <i className="far fa-calendar-alt"></i>
                                        {new Date(item.published_at).toLocaleDateString('vi-VN')}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-[#f97316] transition">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                                        {item.summary}
                                    </p>
                                    <span className="text-[#0f3a68] font-bold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                                        Xem chi tiết <i className="fas fa-arrow-right"></i>
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-400">
                        <i className="far fa-newspaper text-4xl mb-4 block"></i>
                        Chưa có bài viết nào trong mục này.
                    </div>
                )}

            </div>
        </div>
    );
}