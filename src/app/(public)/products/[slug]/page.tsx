'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getProductBySlug } from '@/services/api';
import Link from 'next/link';
import Image from 'next/image';

// Import Lightbox và các Plugin cần thiết
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";

export default function ProductDetail() {
    const params = useParams();
    const slug = params?.slug as string;

    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState('');
    
    // State cho Lightbox
    const [openLightbox, setOpenLightbox] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);

    // State lưu danh sách ảnh để hiển thị (đã cắt ảnh đầu)
    const [galleryImages, setGalleryImages] = useState<string[]>([]);
    // State lưu toàn bộ ảnh (để logic hiển thị ảnh chính hoạt động đúng)
    const [allImages, setAllImages] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!slug) return;
            try {
                const data = await getProductBySlug(slug);
                setProduct(data);
                
                const images = data.images || [];
                setAllImages(images);

                if (images.length > 0) {
                    // Ảnh chính mặc định là ảnh đầu tiên (index 0)
                    setActiveImage(images[1]);
                    
                    // Danh sách ảnh nhỏ (Thumbnails) & Lightbox: Lấy từ vị trí thứ 1 trở đi
                    // Để tránh trùng lặp với ảnh chính đang hiện
                    setGalleryImages(images.slice(1));
                } else if (data.thumbnail) {
                    setActiveImage(data.thumbnail);
                    setGalleryImages([]);
                } else {
                    setActiveImage('https://placehold.co/600x400?text=No+Image');
                    setGalleryImages([]);
                }

            } catch (error) {
                console.error("Lỗi tải sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    if (loading) return <div className="py-20 text-center"><i className="fas fa-spinner fa-spin mr-2"></i> Đang tải thông tin...</div>;
    if (!product) return <div className="py-20 text-center">Không tìm thấy sản phẩm!</div>;

    let specs: Record<string, string> = {};
    if (product.technical_specs) {
        if (typeof product.technical_specs === 'string') {
            try { specs = JSON.parse(product.technical_specs); } catch (e) {}
        } else {
            specs = product.technical_specs;
        }
    }

    // Tạo danh sách slide cho Lightbox từ danh sách ĐÃ CẮT (từ index 1 trở đi)
    // Nếu bạn muốn Lightbox xem được cả ảnh đầu tiên thì dùng allImages, 
    // nhưng theo yêu cầu của bạn là "bỏ ảnh thumb đi" trong danh sách nên mình dùng galleryImages
    const lightboxSlides = galleryImages.map((img: string) => ({ src: img }));

    return (
        <div className="bg-white pb-20">
            <div className="bg-gray-100 py-3 border-b border-gray-200">
                <div className="container mx-auto px-4 text-sm text-gray-500">
                    <Link href="/" className="hover:text-[#f97316]">Trang chủ</Link> / 
                    <Link href="/products" className="hover:text-[#f97316] mx-1">Sản phẩm</Link> / 
                    <span className="text-[#0f3a68] font-bold mx-1 truncate">{product.name}</span>
                </div>
            </div>

            <div className="container mx-auto px-4 py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    
                    {/* --- CỘT TRÁI: ẢNH SẢN PHẨM --- */}
                    <div>
                        {/* Ảnh Chính */}
                        <div 
                            className="border border-gray-200 rounded-lg overflow-hidden mb-4 h-[400px] bg-gray-50 relative group cursor-zoom-in"
                            onClick={() => {
                                if (lightboxSlides.length > 0) setOpenLightbox(true);
                            }}
                        >
                            <Image 
                                src={activeImage} 
                                alt={product.name}
                                fill
                                className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />
                            {lightboxSlides.length > 0 && (
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <span className="bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                                        <i className="fas fa-search-plus mr-2"></i> Xem thêm {galleryImages.length} ảnh
                                    </span>
                                </div>
                            )}
                        </div>
                        
                        {/* Thumbnails List (Chỉ hiện từ ảnh thứ 2 trở đi) */}
                        {galleryImages.length > 0 && (
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                {galleryImages.map((img, idx) => (
                                    <div 
                                        key={idx}
                                        className={`w-20 h-20 border-2 rounded cursor-pointer overflow-hidden flex-shrink-0 relative ${activeImage === img ? 'border-[#f97316]' : 'border-gray-200 hover:border-blue-300'}`}
                                        onClick={() => {
                                            setActiveImage(img);
                                            setPhotoIndex(idx);
                                        }}
                                    >
                                        <Image 
                                            src={img} 
                                            alt={`Thumbnail ${idx}`}
                                            fill
                                            className="object-cover"
                                            sizes="80px"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* --- CỘT PHẢI: THÔNG TIN --- */}
                    <div>
                        <h1 className="text-3xl font-bold text-[#0f3a68] mb-4 leading-tight">{product.name}</h1>
                        <div className="text-sm text-gray-500 mb-6 flex flex-wrap gap-4 items-center">
                            <span className="bg-gray-100 px-2 py-1 rounded">Mã SP: <strong className="text-gray-800">{product.sku || 'Đang cập nhật'}</strong></span>
                            <span className="hidden md:inline">|</span>
                            <span>Danh mục: <strong className="text-[#f97316]">{product.category_name}</strong></span>
                        </div>

                        <div className="bg-blue-50 p-5 rounded-lg border-l-4 border-[#0f3a68] mb-8 text-gray-700 text-base leading-relaxed italic">
                            {product.summary || 'Hãy liên hệ ngay với chúng tôi để được tư vấn chi tiết về giải pháp lưu trữ này.'}
                        </div>

                        {Object.keys(specs).length > 0 && (
                            <div className="mb-8">
                                <h3 className="font-bold text-lg mb-3 border-b pb-2 text-gray-800">Thông số kỹ thuật</h3>
                                <div className="overflow-hidden rounded-lg border border-gray-200">
                                    <table className="w-full text-sm">
                                        <tbody>
                                            {Object.entries(specs).map(([key, value], idx) => (
                                                <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                                    <td className="py-3 px-4 font-semibold text-gray-600 w-1/3 border-b border-gray-100 last:border-0">{key}</td>
                                                    <td className="py-3 px-4 text-gray-800 border-b border-gray-100 last:border-0">{String(value)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 mt-8">
                            <Link href="/contact" className="flex-1 bg-[#f97316] text-white text-center py-4 rounded-lg font-bold hover:bg-orange-600 transition shadow-lg flex items-center justify-center group">
                                <i className="fas fa-envelope mr-2 group-hover:animate-bounce"></i> NHẬN BÁO GIÁ
                            </Link>
                            <a href="tel:0909787797" className="flex-1 border-2 border-[#0f3a68] text-[#0f3a68] text-center py-4 rounded-lg font-bold hover:bg-[#0f3a68] hover:text-white transition flex items-center justify-center">
                                <i className="fas fa-phone-alt mr-2"></i> 0909.787.797
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-16">
                    <div className="border-b border-gray-200 mb-8">
                        <h2 className="inline-block py-3 px-6 bg-[#0f3a68] text-white font-bold rounded-t-lg text-lg">
                            Mô Tả Chi Tiết
                        </h2>
                    </div>
                    <div 
                        className="prose prose-lg max-w-none text-gray-700 leading-loose"
                        dangerouslySetInnerHTML={{ __html: product.description }}
                    ></div>
                </div>
            </div>

            {/* LIGHTBOX - Hiển thị danh sách đã lọc (từ vị trí 1 trở đi) */}
            <Lightbox
                open={openLightbox}
                close={() => setOpenLightbox(false)}
                index={photoIndex}
                slides={lightboxSlides}
                plugins={[Zoom, Thumbnails]}
                zoom={{ maxZoomPixelRatio: 3 }}
                on={{
                    view: ({ index }) => setPhotoIndex(index)
                }}
            />
        </div>
    );
}