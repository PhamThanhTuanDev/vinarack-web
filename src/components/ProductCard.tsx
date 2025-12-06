import Link from 'next/link';
import { Product } from '@/types';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-md group border border-gray-100 hover:shadow-xl transition duration-300">
            {/* Hình ảnh */}
            <div className="h-64 overflow-hidden relative">
                <img 
                    src={product.thumbnail || 'https://placehold.co/600x400?text=No+Image'} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <Link href={`/products/${product.slug}`} className="px-4 py-2 bg-[#f97316] text-white rounded font-bold">
                        Xem chi tiết
                    </Link>
                </div>
            </div>

            {/* Nội dung */}
            <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">
                    {product.category_name || 'Sản phẩm Vinarack'}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#0f3a68] transition line-clamp-2">
                    <Link href={`/products/${product.slug}`}>
                        {product.name}
                    </Link>
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2" dangerouslySetInnerHTML={{ __html: product.summary || '' }}></p>
                
                <Link href={`/products/${product.slug}`} className="text-[#0f3a68] font-medium text-sm border-b border-[#0f3a68] pb-0.5 hover:text-[#f97316] hover:border-[#f97316] transition">
                    Tìm hiểu thêm
                </Link>
            </div>
        </div>
    );
}