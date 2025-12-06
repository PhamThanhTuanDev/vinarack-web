'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProducts } from '@/services/api';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';

// Danh mục cứng (hoặc có thể gọi API lấy danh mục nếu muốn động hoàn toàn)
const CATEGORIES = [
    { id: 1, name: 'Kệ Tải Trọng Nặng', slug: 'ke-tai-trong-nang' },
    { id: 2, name: 'Kệ Trung Tải', slug: 'ke-trung-tai' },
    { id: 3, name: 'Kệ Tải Trọng Nhẹ', slug: 'ke-tai-trong-nhe' },
    { id: 4, name: 'Kệ Sàn Mezzanine', slug: 'ke-san-mezzanine' },
    { id: 5, name: 'Kệ Tay Đỡ', slug: 'ke-tay-do' },
    { id: 6, name: 'Sản Phẩm Phụ Trợ', slug: 'san-pham-phu-tro' },
];

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Lọc sản phẩm theo danh mục
    const filteredProducts = activeCategory 
        ? products.filter(p => Number(p.category_id) === activeCategory)
        : products;

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            
            {/* Header Banner */}
            <div className="bg-[#0f3a68] py-12 text-center text-white mb-10">
                <h1 className="text-3xl md:text-4xl font-bold uppercase">Hệ Thống Sản Phẩm</h1>
                <p className="text-blue-200 mt-2">Giải pháp lưu trữ tối ưu cho mọi kho hàng</p>
            </div>

            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-8">
                    
                    {/* Sidebar Filter */}
                    <aside className="w-full md:w-1/4">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24">
                            <h3 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2">Danh Mục</h3>
                            <ul className="space-y-2">
                                <li>
                                    <button 
                                        onClick={() => setActiveCategory(null)}
                                        className={`w-full text-left px-3 py-2 rounded transition ${activeCategory === null ? 'bg-[#f97316] text-white font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        Tất cả sản phẩm
                                    </button>
                                </li>
                                {CATEGORIES.map(cat => (
                                    <li key={cat.id}>
                                        <button 
                                            onClick={() => setActiveCategory(cat.id)}
                                            className={`w-full text-left px-3 py-2 rounded transition ${activeCategory === cat.id ? 'bg-[#f97316] text-white font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            {cat.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <main className="w-full md:w-3/4">
                        {loading ? (
                            <div className="text-center py-20 text-gray-500">Đang tải dữ liệu...</div>
                        ) : (
                            <>
                                <div className="mb-4 text-sm text-gray-500">
                                    Hiển thị <strong>{filteredProducts.length}</strong> sản phẩm
                                </div>
                                
                                {filteredProducts.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filteredProducts.map(product => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white p-10 text-center rounded-lg border border-dashed border-gray-300 text-gray-500">
                                        Không tìm thấy sản phẩm nào trong danh mục này.
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}