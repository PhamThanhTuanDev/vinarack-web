'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createNews, MediaFile } from '@/services/api';
import toast from 'react-hot-toast';
import { Editor } from '@tinymce/tinymce-react';
import MediaModal from '@/components/MediaModal';

// Hàm tạo slug
const toSlug = (str: string) => {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/([^0-9a-z-\s])/g, '')
        .replace(/(\s+)/g, '-')
        .replace(/^-+|-+$/g, '');
};

export default function CreateNewsWPStyle() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const editorRef = useRef<any>(null);

    // Form Data
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        category: 'knowledge',
        summary: '',
        content: '',
        thumbnail_url: '',
        status: 'published'
    });

    // State quản lý việc sửa Slug
    const [isSlugEditable, setIsSlugEditable] = useState(false);
    const [tempSlug, setTempSlug] = useState('');

    // --- MEDIA MODAL STATE ---
    const [isMediaOpen, setIsMediaOpen] = useState(false);
    const [mediaMode, setMediaMode] = useState<'thumbnail' | 'editor'>('thumbnail'); 

    // --- HANDLERS ---
    
    // Xử lý thay đổi tiêu đề -> Tự động tạo slug (nếu đang không sửa thủ công)
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setFormData(prev => ({
            ...prev,
            title: title,
            slug: toSlug(title) // Tự động tạo slug
        }));
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Xử lý sửa slug
    const startEditSlug = () => {
        setTempSlug(formData.slug);
        setIsSlugEditable(true);
    };

    const saveSlug = () => {
        setFormData(prev => ({ ...prev, slug: toSlug(tempSlug) }));
        setIsSlugEditable(false);
    };

    const cancelEditSlug = () => {
        setIsSlugEditable(false);
    };

    // --- MEDIA HANDLERS ---
    const openMedia = (mode: 'thumbnail' | 'editor') => {
        setMediaMode(mode);
        setIsMediaOpen(true);
    };

    const handleMediaSelect = (files: MediaFile[]) => {
        if (files.length === 0) return;
        const file = files[0]; // Chọn 1 ảnh

        if (mediaMode === 'thumbnail') {
            setFormData(prev => ({ ...prev, thumbnail_url: file.url }));
        } else if (mediaMode === 'editor') {
            if (editorRef.current) {
                const alt = file.alt_text || file.title || formData.title;
                editorRef.current.insertContent(`<img src="${file.url}" alt="${alt}" style="max-width: 100%; height: auto;" />`);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title) return toast.error("Nhập tiêu đề bài viết!");

        setLoading(true);
        const toastId = toast.loading("Đang đăng bài...");

        try {
            // Gửi kèm slug lên server (Server cần update API để nhận field 'slug' này)
            await createNews(formData);
            toast.success("Đăng bài thành công!", { id: toastId });
            setTimeout(() => router.push('/admin/news'), 1000);
        } catch (error) {
            toast.error("Lỗi khi đăng bài", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pb-20">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Thêm bài viết mới</h1>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
                
                {/* --- CỘT TRÁI --- */}
                <div className="xl:col-span-3 space-y-6">
                    
                    {/* Title & Slug */}
                    <div className="bg-white p-4 rounded border border-gray-200 shadow-sm">
                        <input 
                            type="text" 
                            name="title"
                            placeholder="Thêm tiêu đề bài viết"
                            className="w-full text-xl font-bold border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition placeholder-gray-400 text-gray-900"
                            value={formData.title}
                            onChange={handleTitleChange}
                        />
                        
                        {/* Permalink Editor */}
                        <div className="mt-3 text-sm flex items-center flex-wrap gap-2">
                            <span className="text-gray-500">Đường dẫn tĩnh:</span>
                            {!isSlugEditable ? (
                                <>
                                    <span className="text-blue-600 font-medium">
                                        {`https://vinarack.vn/tin-tuc/${formData.slug || '...'}`}
                                    </span>
                                    <button 
                                        type="button" 
                                        onClick={startEditSlug}
                                        className="px-2 py-0.5 bg-white border border-gray-300 rounded text-xs font-bold text-gray-600 hover:text-blue-600 transition"
                                    >
                                        Chỉnh sửa
                                    </button>
                                </>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400">https://vinarack.vn/tin-tuc/</span>
                                    <input 
                                        type="text" 
                                        value={tempSlug} 
                                        onChange={(e) => setTempSlug(e.target.value)}
                                        className="border border-gray-300 rounded px-2 py-0.5 text-gray-800 focus:outline-none focus:border-blue-500 h-7"
                                    />
                                    <button type="button" onClick={saveSlug} className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs font-bold text-gray-700 hover:bg-gray-200">OK</button>
                                    <button type="button" onClick={cancelEditSlug} className="text-xs text-blue-600 underline hover:text-blue-800">Hủy</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* TinyMCE Editor */}
                    <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                        <div className="flex justify-between items-center bg-gray-50 border-b border-gray-200 px-3 py-2">
                            <span className="font-bold text-gray-700 text-sm">Nội dung bài viết</span>
                            <button 
                                type="button" 
                                onClick={() => openMedia('editor')} 
                                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded text-xs font-bold text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition"
                            >
                                <i className="fas fa-camera"></i> Thêm Media
                            </button>
                        </div>
                        <div className="bg-white">
                            <Editor
                                apiKey="0w361rknr4d40qdb3nwzx8fsbgwh99do4iqahn4igaiivbcp" // API Key
                                onInit={(evt, editor) => editorRef.current = editor}
                                value={formData.content}
                                onEditorChange={(newValue) => setFormData(prev => ({ ...prev, content: newValue }))}
                                init={{
                                    height: 600,
                                    menubar: false,
                                    plugins: [
                                        'code', 'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                                        'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'advtemplate', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown','importword', 'exportword', 'exportpdf'
                                    ],
                                    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat | code',
                                    tinycomments_mode: 'embedded',
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px; line-height: 1.6 } img { max-width: 100%; height: auto; }'
                                }}
                            />
                        </div>
                    </div>

                    {/* Mô tả ngắn */}
                    <div className="bg-white rounded border border-gray-200 shadow-sm">
                        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 font-bold text-gray-700">
                            Mô tả ngắn (Excerpt)
                        </div>
                        <div className="p-4">
                            <textarea 
                                name="summary" 
                                rows={4} 
                                className="w-full px-3 py-2 border rounded focus:border-blue-500 outline-none text-gray-900" 
                                value={formData.summary} 
                                onChange={handleChange}
                            ></textarea>
                            <p className="text-xs text-gray-400 mt-1">Tóm tắt nội dung bài viết, hiển thị trên danh sách tin tức và kết quả tìm kiếm.</p>
                        </div>
                    </div>
                </div>

                {/* --- CỘT PHẢI (SIDEBAR) --- */}
                <div className="xl:col-span-1 space-y-6">
                    
                    {/* Đăng */}
                    <div className="bg-white rounded border border-gray-200 shadow-sm">
                        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 font-bold text-gray-700">Đăng</div>
                        <div className="p-4 space-y-4">
                            <div className="flex items-center justify-between text-sm text-gray-600">
                                <span><i className="fas fa-map-marker-alt mr-1"></i> Trạng thái:</span>
                                <select name="status" className="border-none bg-transparent font-bold text-gray-800 outline-none cursor-pointer" value={formData.status} onChange={handleChange}>
                                    <option value="published">Đã xuất bản</option>
                                    <option value="draft">Bản nháp</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600">
                                <span><i className="fas fa-eye mr-1"></i> Hiển thị:</span>
                                <span className="font-bold text-gray-800">Công khai</span>
                            </div>
                        </div>
                        <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex justify-between items-center">
                            <button type="button" className="text-red-600 text-sm hover:underline" onClick={() => router.back()}>Hủy bỏ</button>
                            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-blue-700 shadow-sm transition">
                                {loading ? 'Đang lưu...' : 'Đăng bài viết'}
                            </button>
                        </div>
                    </div>

                    {/* Chuyên mục */}
                    <div className="bg-white rounded border border-gray-200 shadow-sm">
                        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 font-bold text-gray-700">Chuyên mục</div>
                        <div className="p-4">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                                    <input type="radio" name="category" value="knowledge" checked={formData.category === 'knowledge'} onChange={handleChange} className="accent-blue-600" />
                                    <span className="text-sm text-gray-700">Kiến thức kho vận</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                                    <input type="radio" name="category" value="company" checked={formData.category === 'company'} onChange={handleChange} className="accent-blue-600" />
                                    <span className="text-sm text-gray-700">Tin tức công ty</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                                    <input type="radio" name="category" value="event" checked={formData.category === 'event'} onChange={handleChange} className="accent-blue-600" />
                                    <span className="text-sm text-gray-700">Sự kiện & Tuyển dụng</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Ảnh đại diện */}
                    <div className="bg-white rounded border border-gray-200 shadow-sm">
                        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 font-bold text-gray-700">Ảnh đại diện</div>
                        <div className="p-4">
                            {formData.thumbnail_url ? (
                                <div className="relative group">
                                    <img src={formData.thumbnail_url} alt="Thumbnail" className="w-full h-auto rounded border border-gray-200" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                                        <button type="button" onClick={() => openMedia('thumbnail')} className="bg-blue-600 text-white p-2 rounded" title="Đổi ảnh"><i className="fas fa-pencil-alt"></i></button>
                                        <button type="button" onClick={() => setFormData(prev => ({...prev, thumbnail_url: ''}))} className="bg-red-600 text-white p-2 rounded" title="Xóa ảnh"><i className="fas fa-times"></i></button>
                                    </div>
                                </div>
                            ) : (
                                <button type="button" onClick={() => openMedia('thumbnail')} className="text-blue-600 text-sm underline hover:text-blue-800">Đặt ảnh đại diện</button>
                            )}
                        </div>
                    </div>
                </div>
            </form>

            {/* MEDIA MODAL */}
            <MediaModal 
                isOpen={isMediaOpen} 
                onClose={() => setIsMediaOpen(false)} 
                onSelect={handleMediaSelect}
                mode="single" // Bài viết thường chỉ chọn 1 ảnh mỗi lần
                title={mediaMode === 'thumbnail' ? 'Đặt ảnh đại diện' : 'Thêm Media vào bài viết'}
            />
        </div>
    );
}
