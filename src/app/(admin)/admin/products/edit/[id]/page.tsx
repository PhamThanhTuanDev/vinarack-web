'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getProductById, updateProduct, getMediaLibrary, uploadFile, updateMediaInfo, deleteMediaFile, MediaFile } from '@/services/api';
import toast from 'react-hot-toast';

// Import TinyMCE
import { Editor } from '@tinymce/tinymce-react';

// Import Media Modal Component
import MediaModal from '@/components/MediaModal';

const CATEGORIES = [
    { id: 1, name: 'Kệ Tải Trọng Nặng' },
    { id: 2, name: 'Kệ Trung Tải' },
    { id: 3, name: 'Kệ Tải Trọng Nhẹ' },
    { id: 4, name: 'Kệ Sàn Mezzanine' },
    { id: 5, name: 'Kệ Tay Đỡ' },
    { id: 6, name: 'Sản Phẩm Phụ Trợ' },
];

// Hàm tạo slug tiếng Việt không dấu
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

export default function EditProductWPStyle() {
    const router = useRouter();
    const params = useParams();
    const productId = params?.id ? Number(params.id) : 0;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    
    // Ref để điều khiển TinyMCE
    const editorRef = useRef<any>(null);

    // Form Data
    const [formData, setFormData] = useState({
        name: '',
        category_id: 1,
        sku: '',
        summary: '',
        description: '', // HTML content
        status: 'active',
        thumbnail: '',
        images: [] as string[]
    });

    const [specs, setSpecs] = useState([{ key: 'Tải trọng', value: '' }]);

    // --- MEDIA MODAL STATE ---
    const [isMediaOpen, setIsMediaOpen] = useState(false);
    const [mediaMode, setMediaMode] = useState<'thumbnail' | 'gallery' | 'editor'>('thumbnail'); 

    // --- LOAD DỮ LIỆU CŨ ---
    useEffect(() => {
        const loadData = async () => {
            if (!productId) return;
            try {
                const data = await getProductById(productId);
                
                setFormData({
                    name: data.name || '',
                    category_id: data.category_id || 1,
                    sku: data.sku || '',
                    summary: data.summary || '',
                    description: data.description || '',
                    status: data.status || 'active',
                    thumbnail: data.thumbnail || '',
                    images: Array.isArray(data.images) ? data.images : []
                });

                // Load thông số kỹ thuật
                if (data.technical_specs) {
                    let specObj = data.technical_specs;
                    if (typeof specObj === 'string') {
                        try { specObj = JSON.parse(specObj); } catch(e) {}
                    }

                    const specArray = Object.entries(specObj).map(([key, value]) => ({
                        key,
                        value: String(value)
                    }));
                    
                    if (specArray.length > 0) setSpecs(specArray);
                    else setSpecs([{ key: 'Tải trọng', value: '' }]);
                } else {
                    setSpecs([{ key: 'Tải trọng', value: '' }]);
                }

            } catch (error) {
                console.error("Lỗi khi tải sản phẩm:", error);
                toast.error("Không tìm thấy sản phẩm hoặc lỗi kết nối.");
                router.push('/admin/products');
            } finally {
                setFetching(false);
            }
        };

        loadData();
    }, [productId, router]);

    // --- LOGIC FORM ---
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
        const newSpecs = [...specs];
        newSpecs[index][field] = value;
        setSpecs(newSpecs);
    };

    const addSpecRow = () => setSpecs([...specs, { key: '', value: '' }]);
    const removeSpecRow = (index: number) => {
        const newSpecs = specs.filter((_, i) => i !== index);
        setSpecs(newSpecs);
    };

    // --- LOGIC MEDIA ---
    const openMedia = (mode: 'thumbnail' | 'gallery' | 'editor') => {
        setMediaMode(mode);
        setIsMediaOpen(true);
    };

    // Xử lý khi chọn ảnh xong từ Modal
    const handleMediaSelect = (files: MediaFile[]) => {
        const urls = files.map(f => f.url);
        if (urls.length === 0) return;

        if (mediaMode === 'thumbnail') {
            setFormData(prev => ({ ...prev, thumbnail: urls[0] }));
        } else if (mediaMode === 'gallery') {
            setFormData(prev => ({ ...prev, images: [...prev.images, ...urls] }));
        } else if (mediaMode === 'editor') {
            // Chèn ảnh vào TinyMCE
            if (editorRef.current) {
                files.forEach(file => {
                    const altText = file.alt_text || file.title || 'Product Image';
                    editorRef.current.insertContent(`<img src="${file.url}" alt="${altText}" style="max-width: 100%; height: auto;" />`);
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

    // --- SUBMIT ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) return toast.error("Nhập tên sản phẩm!");

        setLoading(true);
        const toastId = toast.loading("Đang cập nhật sản phẩm...");

        const technical_specs = specs.reduce((acc, curr) => {
            if (curr.key && curr.value) acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, string>);

        try {
            await updateProduct(productId, {
                ...formData,
                category_id: Number(formData.category_id),
                technical_specs
            });
            toast.success("Cập nhật thành công!", { id: toastId });
            setTimeout(() => router.push('/admin/products'), 1000);
        } catch (error) {
            toast.error("Lỗi khi cập nhật", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-10 text-center"><i className="fas fa-spinner fa-spin mr-2"></i> Đang tải dữ liệu...</div>;

    return (
        <div className="pb-20">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600 mr-2"><i className="fas fa-arrow-left"></i></button>
                    Sửa Sản Phẩm: {formData.name}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
                
                {/* --- CỘT TRÁI --- */}
                <div className="xl:col-span-3 space-y-6">
                    
                    {/* Title */}
                    <div className="bg-white p-4 rounded border border-gray-200 shadow-sm">
                        <input 
                            type="text" 
                            name="name"
                            placeholder="Tên sản phẩm"
                            className="w-full text-xl font-bold border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition placeholder-gray-400 text-gray-900"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <div className="mt-2 text-xs text-gray-500 flex gap-2">
                            <span>Đường dẫn tĩnh:</span>
                            <span className="text-blue-600 font-medium cursor-pointer hover:underline">
                                {formData.name ? `/san-pham/${toSlug(formData.name)}` : '...'}
                            </span>
                        </div>
                    </div>

                    {/* TINYMCE EDITOR */}
                    <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                        <div className="flex justify-between items-center bg-gray-50 border-b border-gray-200 px-3 py-2">
                            <span className="font-bold text-gray-700 text-sm">Mô tả sản phẩm</span>
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
                                value={formData.description}
                                onEditorChange={(newValue) => setFormData(prev => ({ ...prev, description: newValue }))}
                                init={{
                                    height: 500,
                                    menubar: false,
                                    plugins: [
                                        'code', 'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                                        'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'advtemplate', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown','importword', 'exportword', 'exportpdf'
                                    ],
                                    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat | code',
                                    tinycomments_mode: 'embedded',
                                    tinycomments_author: 'Admin',
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                }}
                            />
                        </div>
                    </div>

                    {/* Dữ liệu sản phẩm */}
                    <div className="bg-white rounded border border-gray-200 shadow-sm">
                        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 font-bold text-gray-700">
                            Dữ liệu sản phẩm
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Mã sản phẩm (SKU)</label>
                                <input type="text" name="sku" className="w-full px-3 py-2 border rounded focus:border-blue-500 outline-none text-gray-900" value={formData.sku} onChange={handleChange} />
                            </div>
                            
                            <div className="col-span-2">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-bold text-gray-600">Thông số kỹ thuật</label>
                                    <button type="button" onClick={() => setSpecs([...specs, { key: '', value: '' }])} className="text-xs text-blue-600 hover:underline">+ Thêm dòng</button>
                                </div>
                                <div className="space-y-2 bg-gray-50 p-4 rounded border border-gray-200">
                                    {specs.map((spec, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <input type="text" className="flex-1 px-2 py-1.5 border rounded text-sm text-gray-900" placeholder="Tên (VD: Tải trọng)" value={spec.key} onChange={(e) => handleSpecChange(idx, 'key', e.target.value)} />
                                            <input type="text" className="flex-1 px-2 py-1.5 border rounded text-sm text-gray-900" placeholder="Giá trị (VD: 500kg)" value={spec.value} onChange={(e) => handleSpecChange(idx, 'value', e.target.value)} />
                                            <button type="button" onClick={() => setSpecs(specs.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700 px-1"><i className="fas fa-times"></i></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mô tả ngắn */}
                    <div className="bg-white rounded border border-gray-200 shadow-sm">
                        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 font-bold text-gray-700">
                            Mô tả ngắn
                        </div>
                        <div className="p-4">
                            <textarea name="summary" rows={4} className="w-full px-3 py-2 border rounded focus:border-blue-500 outline-none text-gray-900" value={formData.summary} onChange={handleChange}></textarea>
                        </div>
                    </div>
                </div>

                {/* --- CỘT PHẢI --- */}
                <div className="xl:col-span-1 space-y-6">
                    
                    {/* Panel Đăng */}
                    <div className="bg-white rounded border border-gray-200 shadow-sm">
                        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 font-bold text-gray-700">Đăng</div>
                        <div className="p-4 space-y-4">
                            <div className="flex items-center justify-between text-sm text-gray-600">
                                <span><i className="fas fa-map-marker-alt mr-1"></i> Trạng thái:</span>
                                <select name="status" className="border-none bg-transparent font-bold text-gray-900 outline-none cursor-pointer" value={formData.status} onChange={handleChange}>
                                    <option value="active">Đã xuất bản</option>
                                    <option value="inactive">Bản nháp</option>
                                </select>
                            </div>
                        </div>
                        <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex justify-between items-center">
                            <button type="button" className="text-red-600 text-sm hover:underline" onClick={() => router.back()}>Hủy bỏ</button>
                            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-blue-700 shadow-sm transition">
                                {loading ? 'Đang lưu...' : 'Cập nhật'}
                            </button>
                        </div>
                    </div>

                    {/* Panel Danh mục */}
                    <div className="bg-white rounded border border-gray-200 shadow-sm">
                        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 font-bold text-gray-700">Danh mục sản phẩm</div>
                        <div className="p-4 max-h-60 overflow-y-auto custom-scrollbar">
                            <div className="space-y-2">
                                {CATEGORIES.map(cat => (
                                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                                        <input type="radio" name="category_id" value={cat.id} checked={Number(formData.category_id) === cat.id} onChange={handleChange} className="accent-blue-600" />
                                        <span className="text-sm text-gray-900">{cat.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Panel Thumbnail */}
                    <div className="bg-white rounded border border-gray-200 shadow-sm">
                        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 font-bold text-gray-700">Ảnh sản phẩm</div>
                        <div className="p-4">
                            {formData.thumbnail ? (
                                <div className="relative group">
                                    <img src={formData.thumbnail} alt="Thumbnail" className="w-full h-auto rounded border border-gray-200" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                                        <button type="button" onClick={() => openMedia('thumbnail')} className="bg-blue-600 text-white p-2 rounded" title="Đổi ảnh"><i className="fas fa-pencil-alt"></i></button>
                                        <button type="button" onClick={() => setFormData(prev => ({...prev, thumbnail: ''}))} className="bg-red-600 text-white p-2 rounded" title="Xóa ảnh"><i className="fas fa-times"></i></button>
                                    </div>
                                </div>
                            ) : (
                                <button type="button" onClick={() => openMedia('thumbnail')} className="text-blue-600 text-sm underline hover:text-blue-800">Đặt ảnh sản phẩm</button>
                            )}
                        </div>
                    </div>

                    {/* Panel Gallery */}
                    <div className="bg-white rounded border border-gray-200 shadow-sm">
                        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 font-bold text-gray-700">Album hình ảnh</div>
                        <div className="p-4">
                            <div className="grid grid-cols-3 gap-2 mb-3">
                                {formData.images.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square border rounded overflow-hidden group">
                                        <img src={img} className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => removeGalleryImage(idx)} className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"><i className="fas fa-times"></i></button>
                                    </div>
                                ))}
                            </div>
                            <button type="button" onClick={() => openMedia('gallery')} className="text-blue-600 text-sm underline hover:text-blue-800">Thêm ảnh thư viện</button>
                        </div>
                    </div>
                </div>
            </form>

            {/* MEDIA MODAL COMPONENT */}
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