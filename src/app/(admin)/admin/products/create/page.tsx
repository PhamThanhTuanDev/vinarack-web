'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct, MediaFile } from '@/services/api';
import toast from 'react-hot-toast';
import { Editor } from '@tinymce/tinymce-react';
import MediaModal from '@/components/MediaModal'; // <--- Import Component Mới

const CATEGORIES = [
    { id: 1, name: 'Kệ Tải Trọng Nặng' },
    { id: 2, name: 'Kệ Trung Tải' },
    { id: 3, name: 'Kệ Tải Trọng Nhẹ' },
    { id: 4, name: 'Kệ Sàn Mezzanine' },
    { id: 5, name: 'Kệ Tay Đỡ' },
    { id: 6, name: 'Sản Phẩm Phụ Trợ' },
];

export default function CreateProductWPStyle() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const editorRef = useRef<any>(null);

    // Form Data
    const [formData, setFormData] = useState({
        name: '',
        category_id: 1,
        sku: '',
        summary: '',
        description: '',
        status: 'active',
        thumbnail: '',
        images: [] as string[]
    });

    const [specs, setSpecs] = useState([{ key: 'Tải trọng', value: '' }]);

    // Media Modal State
    const [isMediaOpen, setIsMediaOpen] = useState(false);
    const [mediaMode, setMediaMode] = useState<'thumbnail' | 'gallery' | 'editor'>('thumbnail');

    // --- HANDLERS ---
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
        const newSpecs = [...specs];
        newSpecs[index][field] = value;
        setSpecs(newSpecs);
    };

    const openMedia = (mode: 'thumbnail' | 'gallery' | 'editor') => {
        setMediaMode(mode);
        setIsMediaOpen(true);
    };

    // Xử lý khi chọn ảnh từ Modal xong
    const handleMediaSelect = (files: MediaFile[]) => {
        const urls = files.map(f => f.url);
        if (urls.length === 0) return;

        if (mediaMode === 'thumbnail') {
            setFormData(prev => ({ ...prev, thumbnail: urls[0] }));
        } else if (mediaMode === 'gallery') {
            setFormData(prev => ({ ...prev, images: [...prev.images, ...urls] }));
        } else if (mediaMode === 'editor') {
            if (editorRef.current) {
                files.forEach(file => {
                    editorRef.current.insertContent(`<img src="${file.url}" alt="${file.alt_text || ''}" style="max-width: 100%; height: auto;" />`);
                });
            }
        }
    };

    const removeGalleryImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) return toast.error("Nhập tên sản phẩm!");
        setLoading(true);
        const toastId = toast.loading("Đang lưu sản phẩm...");

        const technical_specs = specs.reduce((acc, curr) => {
            if (curr.key && curr.value) acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, string>);

        try {
            await createProduct({
                ...formData,
                category_id: Number(formData.category_id),
                technical_specs
            });
            toast.success("Đăng sản phẩm thành công!", { id: toastId });
            setTimeout(() => router.push('/admin/products'), 1000);
        } catch (error) {
            toast.error("Lỗi khi lưu", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pb-20">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Thêm sản phẩm mới</h1>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
                {/* CỘT TRÁI */}
                <div className="xl:col-span-3 space-y-6">
                    <div className="bg-white p-4 rounded border border-gray-200 shadow-sm">
                        <input type="text" name="name" placeholder="Tên sản phẩm" className="w-full text-xl font-bold border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-blue-500" value={formData.name} onChange={handleChange} />
                    </div>

                    <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
                        <div className="flex justify-between items-center bg-gray-50 border-b border-gray-200 px-3 py-2">
                            <span className="font-bold text-gray-700 text-sm">Mô tả sản phẩm</span>
                            <button type="button" onClick={() => openMedia('editor')} className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded text-xs font-bold text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition">
                                <i className="fas fa-camera"></i> Thêm Media
                            </button>
                        </div>
                        <Editor
                            apiKey="0w361rknr4d40qdb3nwzx8fsbgwh99do4iqahn4igaiivbcp"
                            onInit={(evt, editor) => editorRef.current = editor}
                            value={formData.description}
                            onEditorChange={(val) => setFormData(prev => ({ ...prev, description: val }))}
                            init={{ height: 500, menubar: false, plugins: ['link', 'image', 'lists', 'table', 'code'], toolbar: 'undo redo | bold italic | align | bullist numlist | link image | code' }}
                        />
                    </div>

                    {/* Thông số kỹ thuật (Giữ nguyên logic) */}
                    <div className="bg-white rounded border border-gray-200 shadow-sm p-4">
                        <div className="flex justify-between mb-4">
                            <label className="font-bold text-gray-700">Thông số kỹ thuật</label>
                            <button type="button" onClick={() => setSpecs([...specs, { key: '', value: '' }])} className="text-xs text-blue-600 hover:underline">+ Thêm dòng</button>
                        </div>
                        <div className="space-y-2">
                            {specs.map((spec, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input type="text" className="flex-1 px-2 py-1.5 border rounded" placeholder="Tên" value={spec.key} onChange={(e) => handleSpecChange(idx, 'key', e.target.value)} />
                                    <input type="text" className="flex-1 px-2 py-1.5 border rounded" placeholder="Giá trị" value={spec.value} onChange={(e) => handleSpecChange(idx, 'value', e.target.value)} />
                                    <button type="button" onClick={() => setSpecs(specs.filter((_, i) => i !== idx))} className="text-red-500 px-2"><i className="fas fa-times"></i></button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded border border-gray-200 shadow-sm">
                        <label className="block font-bold text-gray-700 mb-2">Mô tả ngắn</label>
                        <textarea name="summary" rows={3} className="w-full px-3 py-2 border rounded outline-none" value={formData.summary} onChange={handleChange}></textarea>
                    </div>
                </div>

                {/* CỘT PHẢI */}
                <div className="xl:col-span-1 space-y-6">
                    <div className="bg-white rounded border border-gray-200 shadow-sm p-4">
                        <div className="font-bold text-gray-700 mb-4 border-b pb-2">Đăng</div>
                        <div className="mb-4">
                            <label className="block text-sm text-gray-600 mb-1">Trạng thái:</label>
                            <select name="status" className="w-full border rounded p-1" value={formData.status} onChange={handleChange}>
                                <option value="active">Đã xuất bản</option>
                                <option value="inactive">Bản nháp</option>
                            </select>
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 disabled:opacity-50">
                            {loading ? 'Đang lưu...' : 'Đăng bài'}
                        </button>
                    </div>

                    <div className="bg-white rounded border border-gray-200 shadow-sm p-4">
                        <div className="font-bold text-gray-700 mb-4 border-b pb-2">Danh mục</div>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {CATEGORIES.map(cat => (
                                <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="category_id" value={cat.id} checked={Number(formData.category_id) === cat.id} onChange={handleChange} />
                                    <span className="text-sm">{cat.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Ảnh đại diện */}
                    <div className="bg-white rounded border border-gray-200 shadow-sm p-4">
                        <div className="font-bold text-gray-700 mb-2">Ảnh đại diện</div>
                        {formData.thumbnail ? (
                            <div className="relative group">
                                <img src={formData.thumbnail} className="w-full h-auto rounded border" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition">
                                    <button type="button" onClick={() => openMedia('thumbnail')} className="text-white"><i className="fas fa-pencil-alt"></i></button>
                                    <button type="button" onClick={() => setFormData(prev => ({...prev, thumbnail: ''}))} className="text-white"><i className="fas fa-times"></i></button>
                                </div>
                            </div>
                        ) : (
                            <button type="button" onClick={() => openMedia('thumbnail')} className="text-blue-600 text-sm underline">Đặt ảnh đại diện</button>
                        )}
                    </div>

                    {/* Album */}
                    <div className="bg-white rounded border border-gray-200 shadow-sm p-4">
                        <div className="font-bold text-gray-700 mb-2">Album ảnh</div>
                        <div className="grid grid-cols-3 gap-2 mb-2">
                            {formData.images.map((img, idx) => (
                                <div key={idx} className="relative aspect-square border rounded overflow-hidden group">
                                    <img src={img} className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => removeGalleryImage(idx)} className="absolute top-0 right-0 bg-red-500 text-white w-4 h-4 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100"><i className="fas fa-times"></i></button>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={() => openMedia('gallery')} className="text-blue-600 text-sm underline">Thêm ảnh thư viện</button>
                    </div>
                </div>
            </form>

            {/* COMPONENT MEDIA MODAL */}
            <MediaModal 
                isOpen={isMediaOpen} 
                onClose={() => setIsMediaOpen(false)} 
                onSelect={handleMediaSelect}
                mode={mediaMode === 'thumbnail' || mediaMode === 'editor' ? 'single' : 'multiple'}
                title={mediaMode === 'thumbnail' ? 'Đặt ảnh đại diện' : mediaMode === 'gallery' ? 'Thêm vào album' : 'Chèn vào bài viết'}
            />
        </div>
    );
}