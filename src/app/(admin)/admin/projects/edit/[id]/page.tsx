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
        is_featured: false
    });

    const [isMediaOpen, setIsMediaOpen] = useState(false);
    const [mediaMode, setMediaMode] = useState<'thumbnail' | 'editor'>('thumbnail');

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
                    is_featured: !!data.is_featured
                });
            } catch (error) {
                toast.error("Lỗi tải dữ liệu");
                router.push('/admin/projects');
            }
        };
        loadData();
    }, [projectId, router]);

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const openMedia = (mode: 'thumbnail' | 'editor') => {
        setMediaMode(mode);
        setIsMediaOpen(true);
    };

    const handleMediaSelect = (files: MediaFile[]) => {
        if (files.length === 0) return;
        const file = files[0];
        if (mediaMode === 'thumbnail') {
            setFormData(prev => ({ ...prev, thumbnail_url: file.url }));
        } else if (mediaMode === 'editor') {
            if (editorRef.current) editorRef.current.insertContent(`<img src="${file.url}" alt="${file.alt_text || ''}" style="max-width: 100%; height: auto;" />`);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title) return toast.error("Nhập tên dự án!");
        setLoading(true);
        const toastId = toast.loading("Đang cập nhật...");
        try {
            await updateProject(projectId, formData);
            toast.success("Cập nhật thành công!", { id: toastId });
            setTimeout(() => router.push('/admin/projects'), 1000);
        } catch (error) {
            toast.error("Lỗi khi cập nhật", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pb-20">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Sửa Dự Án: {formData.title}</h1>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
                <div className="xl:col-span-3 space-y-6">
                    <div className="bg-white p-4 rounded border border-gray-200 shadow-sm">
                        <input type="text" name="title" placeholder="Tên dự án" className="w-full text-xl font-bold border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-blue-500 text-gray-900" value={formData.title} onChange={handleChange} />
                        <div className="mt-2 text-xs text-gray-500">Link: <span className="text-blue-600">/du-an/{formData.slug}</span></div>
                    </div>

                    <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
                        <div className="flex justify-between items-center bg-gray-50 border-b border-gray-200 px-3 py-2">
                            <span className="font-bold text-gray-700 text-sm">Nội dung chi tiết</span>
                            <button type="button" onClick={() => openMedia('editor')} className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded text-xs font-bold text-gray-600 hover:bg-gray-100 hover:text-blue-600"><i className="fas fa-camera"></i> Thêm Media</button>
                        </div>
                        <Editor apiKey="0w361rknr4d40qdb3nwzx8fsbgwh99do4iqahn4igaiivbcp" onInit={(evt, editor) => editorRef.current = editor} value={formData.content} onEditorChange={(val) => setFormData(prev => ({ ...prev, content: val }))} init={{ height: 500, menubar: false, plugins: ['link', 'image', 'lists', 'table', 'code'], toolbar: 'undo redo | bold italic | align | bullist numlist | link image | code' }} />
                    </div>

                    <div className="bg-white rounded border border-gray-200 shadow-sm p-6">
                        <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">Thông tin dự án</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Khách hàng</label>
                                <input type="text" name="customer_name" className="w-full px-3 py-2 border rounded focus:border-blue-500 outline-none text-gray-900" value={formData.customer_name} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Địa điểm</label>
                                <input type="text" name="location" className="w-full px-3 py-2 border rounded focus:border-blue-500 outline-none text-gray-900" value={formData.location} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Quy mô</label>
                                <input type="text" name="scale" className="w-full px-3 py-2 border rounded focus:border-blue-500 outline-none text-gray-900" value={formData.scale} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Ngành nghề</label>
                                <input type="text" name="industry" className="w-full px-3 py-2 border rounded focus:border-blue-500 outline-none text-gray-900" value={formData.industry} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="xl:col-span-1 space-y-6">
                    <div className="bg-white rounded border border-gray-200 shadow-sm p-4">
                        <div className="font-bold text-gray-700 mb-4 border-b pb-2">Cập nhật</div>
                        <label className="flex items-center gap-2 cursor-pointer mb-4">
                            <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} className="accent-blue-600 w-4 h-4" />
                            <span className="text-sm font-bold text-gray-700">Đánh dấu nổi bật</span>
                        </label>
                        <div className="flex justify-between gap-2">
                            <button type="button" className="text-red-600 text-sm hover:underline" onClick={() => router.back()}>Hủy bỏ</button>
                            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-blue-700 shadow-sm transition flex-1">Lưu Thay Đổi</button>
                        </div>
                    </div>

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
                </div>
            </form>
            <MediaModal isOpen={isMediaOpen} onClose={() => setIsMediaOpen(false)} onSelect={handleMediaSelect} mode="single" title={mediaMode === 'thumbnail' ? 'Đặt ảnh đại diện' : 'Thêm Media'} />
        </div>
    );
}