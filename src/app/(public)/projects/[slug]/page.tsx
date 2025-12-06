'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getProjectBySlug, getAdminProjects } from '@/services/api';
import Link from 'next/link';
import Image from 'next/image';

// Lightbox
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";

export default function ProjectDetail() {
    const params = useParams();
    const slug = params?.slug as string;

    const [project, setProject] = useState<any>(null);
    const [relatedProjects, setRelatedProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Lightbox State
    const [openLightbox, setOpenLightbox] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            if (!slug) return;
            try {
                const data = await getProjectBySlug(slug);
                setProject(data);

                const allProjects = await getAdminProjects();
                const related = allProjects
                    .filter((p: any) => p.id !== data.id)
                    .slice(0, 3);
                setRelatedProjects(related);

            } catch (error) {
                console.error("Lỗi tải dự án:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    if (loading) return <div className="py-20 text-center"><i className="fas fa-spinner fa-spin mr-2"></i> Đang tải thông tin...</div>;
    if (!project) return <div className="py-20 text-center">Không tìm thấy dự án!</div>;

    // Parse Specs
    let specs: Record<string, string> = {};
    if (typeof project.technical_specs === 'string') {
        try { specs = JSON.parse(project.technical_specs); } catch (e) {}
    } else {
        specs = project.technical_specs || {};
    }

    // Slides cho Lightbox (Lấy từ project.images)
    const slides = (project.images || []).map((img: string) => ({ src: img }));

    return (
        <div className="bg-white font-sans text-gray-700">
            
            {/* --- PROJECT HERO --- */}
            <div className="relative h-[500px] flex items-end pb-12 bg-gray-900">
                <Image 
                    src={project.thumbnail_url || 'https://placehold.co/1920x800?text=Project+Banner'} 
                    alt={project.title}
                    fill
                    className="object-cover opacity-60"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a2745] via-transparent to-transparent"></div>
                
                <div className="container mx-auto px-4 relative z-10 text-white">
                    <div className="flex items-center gap-2 text-sm text-blue-200 mb-4">
                        <Link href="/projects" className="hover:text-white transition"><i className="fas fa-arrow-left mr-1"></i> Dự án</Link>
                        <span>/</span>
                        <span className="font-bold text-[#f97316] uppercase">{project.industry}</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight shadow-sm">
                        {project.title}
                    </h1>
                    <p className="text-xl text-blue-100 max-w-2xl font-light">
                        Giải pháp lưu trữ tối ưu cho {project.customer_name} tại {project.location}
                    </p>
                </div>
            </div>

            {/* --- QUICK INFO BAR --- */}
            <div className="bg-[#f1f5f9] border-b border-gray-200 py-6">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <span className="block text-gray-500 text-xs font-bold uppercase mb-1 tracking-wider">Khách hàng</span>
                            <span className="block text-lg font-bold text-[#0f3a68] truncate" title={project.customer_name}>{project.customer_name}</span>
                        </div>
                        <div>
                            <span className="block text-gray-500 text-xs font-bold uppercase mb-1 tracking-wider">Địa điểm</span>
                            <span className="block text-lg font-bold text-[#0f3a68] truncate" title={project.location}>{project.location}</span>
                        </div>
                        <div>
                            <span className="block text-gray-500 text-xs font-bold uppercase mb-1 tracking-wider">Quy mô</span>
                            <span className="block text-lg font-bold text-[#0f3a68] truncate" title={project.scale}>{project.scale}</span>
                        </div>
                        <div>
                            <span className="block text-gray-500 text-xs font-bold uppercase mb-1 tracking-wider">Hoàn thành</span>
                            <span className="block text-lg font-bold text-[#0f3a68]">
                                {new Date(project.created_at).getFullYear()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- CONTENT & SIDEBAR --- */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-16">
                        
                        {/* Main Content */}
                        <div className="lg:w-2/3">
                            <article 
                                className="prose prose-lg max-w-none text-gray-600 prose-headings:text-[#0f3a68] prose-a:text-blue-600 prose-img:rounded-xl prose-img:shadow-lg"
                                dangerouslySetInnerHTML={{ __html: project.content }}
                            ></article>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:w-1/3">
                            <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 sticky top-24">
                                <h3 className="font-bold text-xl text-[#0f3a68] mb-6 pb-4 border-b border-gray-100">Thông số kỹ thuật</h3>
                                <div className="space-y-4 mb-8">
                                    {Object.entries(specs).map(([key, value], idx) => (
                                        <div key={idx} className="flex justify-between border-b border-gray-50 pb-2">
                                            <span className="text-sm text-gray-500">{key}</span>
                                            <span className="font-bold text-gray-800 text-right">{String(value)}</span>
                                        </div>
                                    ))}
                                </div>
                                <Link href="/contact" className="block w-full bg-[#f97316] text-white text-center font-bold py-4 rounded-lg hover:bg-orange-600 transition shadow-md uppercase tracking-wide transform hover:-translate-y-1">
                                    YÊU CẦU TƯ VẤN
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PROJECT GALLERY --- */}
            {slides.length > 0 && (
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-bold text-[#0f3a68] mb-8 text-center uppercase tracking-wide">Hình ảnh thực tế</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {slides.map((slide: any, idx: number) => (
                                <div 
                                    key={idx}
                                    className="aspect-w-4 aspect-h-3 overflow-hidden rounded-lg cursor-zoom-in group relative h-64 bg-gray-200"
                                    onClick={() => {
                                        setPhotoIndex(idx);
                                        setOpenLightbox(true);
                                    }}
                                >
                                    <Image 
                                        src={slide.src} 
                                        alt={`Gallery ${idx}`}
                                        fill
                                        className="object-cover transition duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                        <i className="fas fa-search-plus text-white text-3xl"></i>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* --- RELATED PROJECTS --- */}
            <section className="py-16 bg-white border-t border-gray-200">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-[#0f3a68] mb-8 uppercase tracking-wide">Dự án khác</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {relatedProjects.map((p: any) => (
                            <Link key={p.id} href={`/projects/${p.slug}`} className="group block border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                                <div className="h-56 overflow-hidden relative bg-gray-100">
                                    <Image 
                                        src={p.thumbnail || 'https://placehold.co/600x400'} 
                                        alt={p.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition duration-500"
                                    />
                                </div>
                                <div className="p-6">
                                    <div className="text-xs font-bold text-[#f97316] uppercase mb-2">{p.industry}</div>
                                    <h4 className="font-bold text-[#0f3a68] text-lg mb-2 group-hover:text-[#f97316] transition line-clamp-2">{p.title}</h4>
                                    <p className="text-sm text-gray-500"><i className="fas fa-map-marker-alt mr-1"></i> {p.location}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <Lightbox
                open={openLightbox}
                close={() => setOpenLightbox(false)}
                index={photoIndex}
                slides={slides}
                plugins={[Zoom, Thumbnails]}
                zoom={{ maxZoomPixelRatio: 3 }}
                on={{ view: ({ index }) => setPhotoIndex(index) }}
            />
        </div>
    );
}