'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAdminProducts, deleteProduct } from '@/services/api'; // Đổi sang getAdminProducts
import { Product } from '@/types';

// Mở rộng interface Product để có thêm trường status (nếu chưa có trong types/index.ts)
interface AdminProduct extends Product {
    status?: string;
}

export default function AdminProducts() {
    const [products, setProducts] = useState<AdminProduct[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            // Gọi API dành riêng cho Admin (Lấy tất cả)
            const data = await getAdminProducts();
            setProducts(data);
        } catch (error) {
            console.error("Lỗi tải sản phẩm:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: number) => {
        if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
            try {
                await deleteProduct(id);
                fetchData(); 
                alert('Đã xóa thành công!');
            } catch (error) {
                alert('Lỗi khi xóa sản phẩm');
            }
        }
    };

    if (loading) return <div className="p-8 text-center">Đang tải dữ liệu...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản Lý Sản Phẩm</h1>
                <Link href="/admin/products/create" className="bg-[#f97316] text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-600 transition flex items-center gap-2">
                    <i className="fas fa-plus"></i> Thêm Sản Phẩm
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 w-16">ID</th>
                            <th className="px-6 py-3 w-24">Hình ảnh</th>
                            <th className="px-6 py-3">Tên sản phẩm</th>
                            <th className="px-6 py-3">Danh mục</th>
                            <th className="px-6 py-3 text-center">Trạng thái</th> {/* Cột mới */}
                            <th className="px-6 py-3 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <tr key={product.id} className={`border-b hover:bg-gray-50 transition ${product.status === 'inactive' ? 'bg-gray-50' : 'bg-white'}`}>
                                    <td className="px-6 py-4">{product.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="w-16 h-16 rounded overflow-hidden border border-gray-200">
                                            <img 
                                                src={product.thumbnail || 'https://placehold.co/100?text=No+Img'} 
                                                alt={product.name} 
                                                className={`w-full h-full object-cover ${product.status === 'inactive' ? 'grayscale' : ''}`}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-800">
                                        {product.name}
                                        <p className="text-xs text-gray-400 font-normal mt-1 truncate w-64">{product.summary}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                            {product.category_name || 'Chưa phân loại'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {/* Hiển thị trạng thái */}
                                        {product.status === 'active' ? (
                                            <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-0.5 rounded border border-green-200">
                                                Hiển thị
                                            </span>
                                        ) : (
                                            <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-0.5 rounded border border-red-200">
                                                Đang ẩn
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-3">
                                            <Link href={`/admin/products/edit/${product.id}`} className="text-blue-600 hover:text-blue-900" title="Sửa">
                                                <i className="fas fa-edit"></i>
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(product.id)} 
                                                className="text-red-600 hover:text-red-900" 
                                                title="Xóa"
                                            >
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                    Chưa có sản phẩm nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}