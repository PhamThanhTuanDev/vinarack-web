'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createProject, MediaFile } from '@/services/api';
import toast from 'react-hot-toast';
import { Editor } from '@tinymce/tinymce-react';
import MediaModal from '@/components/MediaModal';

const toSlug = (str: string) => {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').replace(/([^0-9a-z-\s])/g, '').replace(/(\s+)/g, '-').replace(/^-+|-+$/g, '');
};

export default function CreateProject() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const editorRef = useRef<any>(null);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        customer_name: '',
        location: '',
        scale: '',
        industry: '',
        content: '',
        thumbnail_url: '',
        is_featured: false,
        images: [] as string[] // Album ảnh dự án
    });

    const [specs, setSpecs] = useState([{ key: 'Diện tích', value: '' }]);

    // --- MEDIA STATE ---
    const [isMediaOpen, setIsMediaOpen] = useState(false);
    const [mediaMode, setMediaMode] = useState<'thumbnail' | 'gallery' | 'editor'>('thumbnail');

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, title: e.target.value, slug: toSlug(e.target.value) }));
    };

    // --- SPECS HANDLERS ---
    const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
        const newSpecs = [...specs];
        newSpecs[index][field] = value;
        setSpecs(newSpecs);
    };
    const addSpecRow = () => setSpecs([...specs, { key: '', value: '' }]);
    const removeSpecRow = (index: number) => setSpecs(specs.filter((_, i) => i !== index));

    // --- MEDIA HANDLERS ---
    const openMedia = (mode: 'thumbnail' | 'gallery' | 'editor') => {
        setMediaMode(mode);
        setIsMediaOpen(true);
    };

    const handleMediaSelect = (files: MediaFile[]) => {
        const urls = files.map(f => f.url);
        if (urls.length === 0) return;

        if (mediaMode === 'thumbnail') {
            setFormData(prev => ({ ...prev, thumbnail_url: urls[0] }));
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
        setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title) return toast.error("Nhập tên dự án!");
        setLoading(true);
        const toastId = toast.loading("Đang lưu...");

        const technical_specs = specs.reduce((acc, curr) => {
            if (curr.key && curr.value) acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, string>);

        try {
            await createProject({ ...formData, technical_specs });
            toast.success("Thêm dự án thành công!", { id: toastId });
            setTimeout(() => router.push('/admin/projects'), 1000);
        } catch (error) {
            toast.error("Lỗi khi lưu", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pb-20">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Thêm Dự Án Mới</h1>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
                {/* CỘT TRÁI */}
                <div className="xl:col-span-3 space-y-6">
                    <div className="bg-white p-4 rounded border border-gray-200 shadow-sm">
                        <input type="text" name="title" placeholder="Tên dự án (Ví dụ: Kho Lạnh Minh Phú)" className="w-full text-xl font-bold border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-blue-500 text-gray-900" value={formData.title} onChange={handleTitleChange} />
                        <div className="mt-2 text-xs text-gray-500">Link: <span className="text-blue-600">/du-an/{formData.slug}</span></div>
                    </div>

                    {/* TinyMCE */}
                    <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
                        <div className="flex justify-between items-center bg-gray-50 border-b border-gray-200 px-3 py-2">
                            <span className="font-bold text-gray-700 text-sm">Nội dung chi tiết (Case Study)</span>
                            <button type="button" onClick={() => openMedia('editor')} className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded text-xs font-bold text-gray-600 hover:bg-gray-100 hover:text-blue-600"><i className="fas fa-camera"></i> Thêm Media</button>
                        </div>
                        <Editor apiKey="0w361rknr4d40qdb3nwzx8fsbgwh99do4iqahn4igaiivbcp" onInit={(evt, editor) => editorRef.current = editor} value={formData.content} onEditorChange={(val) => setFormData(prev => ({ ...prev, content: val }))} init={{ height: 500, menubar: false, plugins: ['link', 'image', 'lists', 'table', 'code'], toolbar: 'undo redo | bold italic | align | bullist numlist | link image | code' }} />
                    </div>

                    {/* Thông tin cơ bản */}
                    <div className="bg-white rounded border border-gray-200 shadow-sm p-6">
                        <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">Thông tin dự án</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Khách hàng</label>
                                <input type="text" name="customer_name" className="w-full px-3 py-2 border rounded focus:border-blue-500 outline-none text-gray-900" placeholder="VD: DHL Supply Chain" value={formData.customer_name} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Địa điểm</label>
                                <input type="text" name="location" className="w-full px-3 py-2 border rounded focus:border-blue-500 outline-none text-gray-900" placeholder="VD: VSIP 2, Bình Dương" value={formData.location} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Quy mô</label>
                                <input type="text" name="scale" className="w-full px-3 py-2 border rounded focus:border-blue-500 outline-none text-gray-900" placeholder="VD: 20.000m2" value={formData.scale} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Ngành nghề</label>
                                <input type="text" name="industry" className="w-full px-3 py-2 border rounded focus:border-blue-500 outline-none text-gray-900" placeholder="VD: Logistics" value={formData.industry} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    {/* Thông số kỹ thuật (Dynamic) */}
                    <div className="bg-white rounded border border-gray-200 shadow-sm p-6">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h3 className="font-bold text-gray-700">Thông số kỹ thuật chi tiết</h3>
                            <button type="button" onClick={addSpecRow} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 font-bold">+ Thêm dòng</button>
                        </div>
                        <div className="space-y-2">
                            {specs.map((spec, index) => (
                                <div key={index} className="flex gap-2">
                                    <input type="text" className="flex-1 px-3 py-2 border rounded text-sm text-gray-900" placeholder="Tên (VD: Thời gian)" value={spec.key} onChange={(e) => handleSpecChange(index, 'key', e.target.value)} />
                                    <input type="text" className="flex-1 px-3 py-2 border rounded text-sm text-gray-900" placeholder="Giá trị (VD: 45 ngày)" value={spec.value} onChange={(e) => handleSpecChange(index, 'value', e.target.value)} />
                                    <button type="button" onClick={() => removeSpecRow(index)} className="text-gray-400 hover:text-red-500 px-2"><i className="fas fa-times"></i></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI */}
                <div className="xl:col-span-1 space-y-6">
                    <div className="bg-white rounded border border-gray-200 shadow-sm p-4">
                        <div className="font-bold text-gray-700 mb-4 border-b pb-2">Đăng</div>
                        <label className="flex items-center gap-2 cursor-pointer mb-4">
                            <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} className="accent-blue-600 w-4 h-4" />
                            <span className="text-sm font-bold text-gray-700">Đánh dấu nổi bật</span>
                        </label>
                        <div className="flex justify-between gap-2">
                            <button type="button" className="text-red-600 text-sm hover:underline" onClick={() => router.back()}>Hủy bỏ</button>
                            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-blue-700 shadow-sm transition flex-1">Lưu Dự Án</button>
                        </div>
                    </div>

                    {/* Thumbnail */}
                    <div className="bg-white rounded border border-gray-200 shadow-sm p-4">
                        <div className="font-bold text-gray-700 mb-2">Ảnh đại diện</div>
                        {formData.thumbnail_url ? (
                            <div className="relative group">
                                <img src={formData.thumbnail_url} className="w-full h-auto rounded border" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition">
                                    <button type="button" onClick={() => openMedia('thumbnail')} className="text-white"><i className="fas fa-pencil-alt"></i></button>
                                    <button type="button" onClick={() => setFormData(prev => ({...prev, thumbnail_url: ''}))} className="text-white"><i className="fas fa-times"></i></button>
                                </div>
                            </div>
                        ) : (
                            <button type="button" onClick={() => openMedia('thumbnail')} className="text-blue-600 text-sm underline">Đặt ảnh đại diện</button>
                        )}
                    </div>

                    {/* Gallery */}
                    <div className="bg-white rounded border border-gray-200 shadow-sm p-4">
                        <div className="font-bold text-gray-700 mb-2">Album ảnh dự án</div>
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

            <MediaModal isOpen={isMediaOpen} onClose={() => setIsMediaOpen(false)} onSelect={handleMediaSelect} mode={mediaMode === 'gallery' ? 'multiple' : 'single'} title={mediaMode === 'thumbnail' ? 'Đặt ảnh đại diện' : mediaMode === 'gallery' ? 'Thêm vào album' : 'Chèn vào bài viết'} />
        </div>
    );
}