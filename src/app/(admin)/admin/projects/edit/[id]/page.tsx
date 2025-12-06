'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getProjectById, updateProject, MediaFile } from '@/services/api';
import toast from 'react-hot-toast';
import { Editor } from '@tinymce/tinymce-react';
import MediaModal from '@/components/MediaModal';

const toSlug = (str: string) => str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').replace(/([^0-9a-z-\s])/g, '').replace(/(\s+)/g, '-').replace(/^-+|-+$/g, '');

export default function EditProject() {
    const router = useRouter();
    const params = useParams();
    const projectId = params?.id ? Number(params.id) : 0;

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
        images: [] as string[]
    });

    const [specs, setSpecs] = useState([{ key: 'Diện tích', value: '' }]);

    const [isMediaOpen, setIsMediaOpen] = useState(false);
    const [mediaMode, setMediaMode] = useState<'thumbnail' | 'gallery' | 'editor'>('thumbnail');

    useEffect(() => {
        const loadData = async () => {
            if (!projectId) return;
            try {
                const data = await getProjectById(projectId);
                setFormData({
                    title: data.title || '',
                    slug: data.slug || '',
                    customer_name: data.customer_name || '',
                    location: data.location || '',
                    scale: data.scale || '',
                    industry: data.industry || '',
                    content: data.content || '',
                    thumbnail_url: data.thumbnail_url || '',
                    is_featured: !!data.is_featured,
                    images: Array.isArray(data.images) ? data.images : []
                });

                if (data.technical_specs) {
                    let specObj = typeof data.technical_specs === 'string' ? JSON.parse(data.technical_specs) : data.technical_specs;
                    const specArray = Object.entries(specObj || {}).map(([key, value]) => ({ key, value: String(value) }));
                    setSpecs(specArray.length > 0 ? specArray : [{ key: 'Diện tích', value: '' }]);
                }
            } catch (error) {
                toast.error("Lỗi tải dữ liệu");
                router.push('/admin/projects');
            }
        };
        loadData();
    }, [projectId, router]);

    // ... (Giữ nguyên các hàm handler handleChange, openMedia, handleMediaSelect, removeGalleryImage, handleSubmit, handleSpecChange, addSpecRow, removeSpecRow như trang Create)
    // Để tiết kiệm không gian, tôi sẽ viết gọn các hàm handler, logic y hệt trang Create
    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };
    const handleSpecChange = (i: number, f: string, v: string) => { const ns:any = [...specs]; ns[i][f] = v; setSpecs(ns); };
    const addSpecRow = () => setSpecs([...specs, { key: '', value: '' }]);
    const removeSpecRow = (i: number) => setSpecs(specs.filter((_, idx) => idx !== i));
    const openMedia = (m: any) => { setMediaMode(m); setIsMediaOpen(true); };
    const handleMediaSelect = (files: MediaFile[]) => {
        const urls = files.map(f => f.url);
        if (urls.length === 0) return;
        if (mediaMode === 'thumbnail') setFormData(prev => ({ ...prev, thumbnail_url: urls[0] }));
        else if (mediaMode === 'gallery') setFormData(prev => ({ ...prev, images: [...prev.images, ...urls] }));
        else if (mediaMode === 'editor' && editorRef.current) files.forEach(f => editorRef.current.insertContent(`<img src="${f.url}" alt="${f.alt_text||''}" style="max-width:100%"/>`));
    };
    const removeGalleryImage = (idx: number) => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const technical_specs = specs.reduce((acc, curr) => { if (curr.key) acc[curr.key] = curr.value; return acc; }, {} as any);
        try {
            await updateProject(projectId, { ...formData, technical_specs });
            toast.success("Cập nhật thành công!");
            setTimeout(() => router.push('/admin/projects'), 1000);
        } catch (error) { toast.error("Lỗi cập nhật"); } finally { setLoading(false); }
    };

    return (
        <div className="pb-20">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Sửa Dự Án: {formData.title}</h1>
            </div>
            {/* Form Layout giống hệt trang Create, chỉ bind data vào */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
                 {/* COPY NỘI DUNG FORM TỪ TRANG CREATE SANG ĐÂY LÀ ĐƯỢC */}
                 {/* (Vì nội dung dài, bạn chỉ cần copy phần <div className="xl:col-span-3">...</div> và <div className="xl:col-span-1">...</div> từ trang Create sang là xong) */}
                 {/* Lưu ý: Thay đổi value={formData.title} các thứ cho khớp */}
                 
                 {/* ... Phần code giao diện Form y hệt trang Create ... */}
                 
                 {/* CỘT TRÁI */}
                <div className="xl:col-span-3 space-y-6">
                    <div className="bg-white p-4 rounded border border-gray-200 shadow-sm">
                        <input type="text" name="title" className="w-full text-xl font-bold border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-blue-500 text-gray-900" value={formData.title} onChange={handleChange} />
                        <div className="mt-2 text-xs text-gray-500">Link: <span className="text-blue-600">/du-an/{formData.slug}</span></div>
                    </div>
                    
                    <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
                        <div className="flex justify-between items-center bg-gray-50 border-b border-gray-200 px-3 py-2">
                             <span className="font-bold text-gray-700 text-sm">Nội dung</span>
                             <button type="button" onClick={() => openMedia('editor')} className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded text-xs font-bold text-gray-600 hover:bg-gray-100 hover:text-blue-600"><i className="fas fa-camera"></i> Thêm Media</button>
                        </div>
                        <Editor apiKey="0w361rknr4d40qdb3nwzx8fsbgwh99do4iqahn4igaiivbcp" onInit={(evt, editor) => editorRef.current = editor} value={formData.content} onEditorChange={(val) => setFormData(prev => ({ ...prev, content: val }))} init={{ height: 500, menubar: false, plugins: ['link', 'image', 'lists', 'table', 'code'], toolbar: 'undo redo | bold italic | align | bullist numlist | link image | code' }} />
                    </div>

                    <div className="bg-white rounded border border-gray-200 shadow-sm p-6">
                        <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">Thông tin dự án</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label className="block text-sm font-bold text-gray-600 mb-1">Khách hàng</label><input type="text" name="customer_name" className="w-full px-3 py-2 border rounded focus:border-blue-500 outline-none text-gray-900" value={formData.customer_name} onChange={handleChange} /></div>
                            <div><label className="block text-sm font-bold text-gray-600 mb-1">Địa điểm</label><input type="text" name="location" className="w-full px-3 py-2 border rounded focus:border-blue-500 outline-none text-gray-900" value={formData.location} onChange={handleChange} /></div>
                            <div><label className="block text-sm font-bold text-gray-600 mb-1">Quy mô</label><input type="text" name="scale" className="w-full px-3 py-2 border rounded focus:border-blue-500 outline-none text-gray-900" value={formData.scale} onChange={handleChange} /></div>
                            <div><label className="block text-sm font-bold text-gray-600 mb-1">Ngành nghề</label><input type="text" name="industry" className="w-full px-3 py-2 border rounded focus:border-blue-500 outline-none text-gray-900" value={formData.industry} onChange={handleChange} /></div>
                        </div>
                    </div>

                    <div className="bg-white rounded border border-gray-200 shadow-sm p-6">
                        <div className="flex justify-between items-center mb-4 border-b pb-2"><h3 className="font-bold text-gray-700">Thông số kỹ thuật chi tiết</h3><button type="button" onClick={addSpecRow} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 font-bold">+ Thêm dòng</button></div>
                        <div className="space-y-2">{specs.map((spec, idx) => (<div key={idx} className="flex gap-2"><input className="flex-1 px-3 py-2 border rounded text-sm text-gray-900" value={spec.key} onChange={(e) => handleSpecChange(idx, 'key', e.target.value)} /><input className="flex-1 px-3 py-2 border rounded text-sm text-gray-900" value={spec.value} onChange={(e) => handleSpecChange(idx, 'value', e.target.value)} /><button type="button" onClick={() => removeSpecRow(idx)} className="text-gray-400 hover:text-red-500 px-2">X</button></div>))}</div>
                    </div>
                </div>

                {/* CỘT PHẢI */}
                <div className="xl:col-span-1 space-y-6">
                    <div className="bg-white rounded border border-gray-200 shadow-sm p-4">
                        <div className="font-bold text-gray-700 mb-4 border-b pb-2">Cập nhật</div>
                        <label className="flex items-center gap-2 cursor-pointer mb-4"><input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} className="accent-blue-600 w-4 h-4" /><span className="text-sm font-bold text-gray-700">Nổi bật</span></label>
                        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 disabled:opacity-50">Lưu Thay Đổi</button>
                    </div>
                    <div className="bg-white rounded border border-gray-200 shadow-sm p-4">
                        <div className="font-bold text-gray-700 mb-2">Ảnh đại diện</div>
                        {formData.thumbnail_url ? (<div className="relative group"><img src={formData.thumbnail_url} className="w-full h-auto rounded border" /><button type="button" onClick={() => openMedia('thumbnail')} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition">Đổi ảnh</button></div>) : <button type="button" onClick={() => openMedia('thumbnail')} className="text-blue-600 text-sm underline">Chọn ảnh</button>}
                    </div>
                    <div className="bg-white rounded border border-gray-200 shadow-sm p-4">
                        <div className="font-bold text-gray-700 mb-2">Album ảnh</div>
                        <div className="grid grid-cols-3 gap-2 mb-2">{formData.images.map((img, idx) => (<div key={idx} className="relative aspect-square border rounded overflow-hidden group"><img src={img} className="w-full h-full object-cover" /><button type="button" onClick={() => removeGalleryImage(idx)} className="absolute top-0 right-0 bg-red-500 text-white w-4 h-4 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100">X</button></div>))}</div>
                        <button type="button" onClick={() => openMedia('gallery')} className="text-blue-600 text-sm underline">Thêm ảnh thư viện</button>
                    </div>
                </div>

            </form>
            <MediaModal isOpen={isMediaOpen} onClose={() => setIsMediaOpen(false)} onSelect={handleMediaSelect} mode={mediaMode === 'gallery' ? 'multiple' : 'single'} title={mediaMode === 'thumbnail' ? 'Đặt ảnh đại diện' : mediaMode === 'gallery' ? 'Thêm vào album' : 'Chèn vào bài viết'} />
        </div>
    );
}