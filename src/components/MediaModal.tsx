'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { getMediaLibrary, uploadFile, updateMediaInfo, deleteMediaFile, MediaFile } from '@/services/api';
import toast from 'react-hot-toast';

interface MediaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (files: MediaFile[]) => void; // Trả về danh sách ảnh đã chọn
    mode?: 'single' | 'multiple'; // Chế độ chọn 1 hay nhiều
    title?: string;
}

export default function MediaModal({ isOpen, onClose, onSelect, mode = 'single', title = 'Chọn hình ảnh' }: MediaModalProps) {
    const [activeTab, setActiveTab] = useState<'upload' | 'library'>('library');
    const [mediaList, setMediaList] = useState<MediaFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    // State chọn ảnh
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    
    // State sidebar chi tiết
    const [activeMedia, setActiveMedia] = useState<MediaFile | null>(null);

    // Load dữ liệu khi mở modal
    useEffect(() => {
        if (isOpen) {
            fetchMedia();
            setSelectedIds([]); // Reset chọn
            setActiveMedia(null); // Reset sidebar
        }
    }, [isOpen]);

    const fetchMedia = async () => {
        setLoading(true);
        try {
            const data = await getMediaLibrary();
            setMediaList(data);
        } catch (error) {
            console.error(error);
            toast.error("Lỗi tải thư viện ảnh");
        } finally {
            setLoading(false);
        }
    };

    // --- LOGIC UPLOAD ---
    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploading(true);
        try {
            const files = Array.from(e.target.files);
            const uploadPromises = files.map(file => uploadFile(file));
            await Promise.all(uploadPromises);
            toast.success("Tải lên thành công!");
            await fetchMedia(); // Reload list
            setActiveTab('library'); // Chuyển sang tab thư viện
        } catch (error) {
            toast.error("Lỗi tải lên");
        } finally {
            setUploading(false);
        }
    };

    // --- LOGIC CHỌN ẢNH ---
    const handleMediaClick = (img: MediaFile) => {
        setActiveMedia(img); // Luôn hiện sidebar của ảnh vừa click

        if (mode === 'single') {
            setSelectedIds([img.id]);
        } else {
            // Toggle chọn nhiều
            setSelectedIds(prev => 
                prev.includes(img.id) ? prev.filter(i => i !== img.id) : [...prev, img.id]
            );
        }
    };

    // --- LOGIC SỬA THÔNG TIN (SIDEBAR) ---
    const handleUpdateInfo = async (field: string, value: string) => {
        if (!activeMedia) return;
        
        const updated = { ...activeMedia, [field]: value };
        setActiveMedia(updated);
        setMediaList(prev => prev.map(m => m.id === activeMedia.id ? updated : m));

        try {
            // Gửi full data để tránh ghi đè null
            await updateMediaInfo(activeMedia.id, {
                alt_text: updated.alt_text,
                title: updated.title,
                caption: updated.caption
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async () => {
        if (!activeMedia) return;
        if (!confirm("Xóa vĩnh viễn ảnh này?")) return;

        try {
            await deleteMediaFile(activeMedia.id);
            setMediaList(prev => prev.filter(m => m.id !== activeMedia.id));
            setActiveMedia(null);
            setSelectedIds(prev => prev.filter(id => id !== activeMedia.id));
            toast.success("Đã xóa ảnh");
        } catch (error) {
            toast.error("Lỗi xóa ảnh");
        }
    };

    // --- SUBMIT ---
    const handleConfirm = () => {
        const selectedFiles = mediaList.filter(m => selectedIds.includes(m.id));
        onSelect(selectedFiles);
        onClose();
    };

    // Format Helper
    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const filteredMedia = useMemo(() => {
        return mediaList.filter(m => m.file_name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [mediaList, searchQuery]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 md:p-10 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-7xl h-full max-h-[90vh] flex flex-col shadow-2xl rounded-sm overflow-hidden">
                
                {/* Header */}
                <div className="h-14 border-b border-gray-200 flex justify-between items-center px-4 bg-white flex-shrink-0">
                    <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl px-2">&times;</button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 bg-gray-50 px-4 gap-6 text-sm font-bold text-gray-600 flex-shrink-0">
                    <button 
                        onClick={() => setActiveTab('upload')}
                        className={`py-3 border-b-2 transition ${activeTab === 'upload' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-blue-600'}`}
                    >
                        Tải tập tin lên
                    </button>
                    <button 
                        onClick={() => setActiveTab('library')}
                        className={`py-3 border-b-2 transition ${activeTab === 'library' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-blue-600'}`}
                    >
                        Thư viện Media
                    </button>
                </div>

                {/* Content Body */}
                <div className="flex-1 overflow-hidden flex flex-col relative">
                    
                    {/* TAB UPLOAD */}
                    {activeTab === 'upload' && (
                        <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center p-10">
                            <label className="flex flex-col items-center justify-center w-full max-w-lg h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-blue-50 transition">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <i className={`fas ${uploading ? 'fa-spinner fa-spin' : 'fa-cloud-upload-alt'} text-4xl text-gray-400 mb-3`}></i>
                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Bấm để tải lên</span> hoặc kéo thả vào đây</p>
                                    <p className="text-xs text-gray-500">Hỗ trợ JPG, PNG, WEBP (Max 5MB)</p>
                                </div>
                                <input type="file" className="hidden" multiple accept="image/*" onChange={handleUpload} disabled={uploading} />
                            </label>
                        </div>
                    )}

                    {/* TAB LIBRARY */}
                    {activeTab === 'library' && (
                        <div className="flex flex-1 overflow-hidden flex-col">
                            {/* Toolbar */}
                            <div className="p-3 border-b border-gray-200 flex flex-wrap gap-3 items-center bg-white flex-shrink-0">
                                <div className="relative w-64">
                                    <input 
                                        type="text" 
                                        placeholder="Tìm kiếm..." 
                                        className="w-full border border-gray-300 rounded pl-2 pr-8 py-1 text-sm outline-none focus:border-blue-500" 
                                        value={searchQuery} 
                                        onChange={(e) => setSearchQuery(e.target.value)} 
                                    />
                                    <i className="fas fa-search absolute right-2 top-2 text-gray-400 text-xs"></i>
                                </div>
                            </div>

                            <div className="flex-1 flex overflow-hidden">
                                {/* Grid Ảnh */}
                                <div className="flex-1 overflow-y-auto p-4 bg-white">
                                    {loading ? <div className="text-center py-20 text-gray-500">Đang tải...</div> : (
                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                                            {filteredMedia.map(item => (
                                                <div 
                                                    key={item.id} 
                                                    onClick={() => handleMediaClick(item)} 
                                                    className={`relative aspect-square border-2 cursor-pointer rounded overflow-hidden group 
                                                        ${selectedIds.includes(item.id) ? 'border-blue-600 ring-2 ring-blue-100' : 'border-transparent hover:border-blue-400'}
                                                        ${activeMedia?.id === item.id ? 'ring-2 ring-blue-300' : ''}
                                                    `}
                                                >
                                                    <img src={item.url} className="w-full h-full object-cover" />
                                                    {selectedIds.includes(item.id) && (
                                                        <div className="absolute top-1 right-1 w-6 h-6 bg-blue-600 text-white flex items-center justify-center rounded-sm shadow-sm border border-white z-10">
                                                            <i className="fas fa-check text-xs"></i>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Sidebar Chi Tiết Ảnh */}
                                {activeMedia && (
                                    <div className="w-[300px] bg-gray-50 border-l border-gray-200 overflow-y-auto p-4 flex-shrink-0 flex flex-col">
                                        <div className="uppercase font-bold text-gray-500 text-xs mb-3">Chi tiết tệp đính kèm</div>
                                        
                                        <div className="flex gap-3 mb-4 border-b border-gray-200 pb-4">
                                            <div className="w-16 h-16 bg-white border border-gray-300 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                                <img src={activeMedia.url} className="max-w-full max-h-full" />
                                            </div>
                                            <div className="text-[10px] text-gray-500 space-y-1 overflow-hidden">
                                                <div className="font-bold text-gray-700 truncate text-xs" title={activeMedia.file_name}>{activeMedia.file_name}</div>
                                                <div>{new Date(activeMedia.created_at).toLocaleDateString('vi-VN')}</div>
                                                <div>{formatBytes(activeMedia.file_size)}</div>
                                                <div>{activeMedia.width} x {activeMedia.height} px</div>
                                                <button onClick={handleDelete} className="text-red-600 hover:underline">Xóa vĩnh viễn</button>
                                            </div>
                                        </div>

                                        <div className="space-y-3 flex-1">
                                            <div className="space-y-1">
                                                <label className="block text-xs font-bold text-gray-500">Văn bản thay thế</label>
                                                <input 
                                                    type="text" 
                                                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:border-blue-500 outline-none"
                                                    value={activeMedia.alt_text || ''}
                                                    onChange={(e) => handleUpdateInfo('alt_text', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="block text-xs font-bold text-gray-500">Tiêu đề</label>
                                                <input 
                                                    type="text" 
                                                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:border-blue-500 outline-none"
                                                    value={activeMedia.title || ''}
                                                    onChange={(e) => handleUpdateInfo('title', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="block text-xs font-bold text-gray-500">Chú thích</label>
                                                <textarea 
                                                    rows={3}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:border-blue-500 outline-none resize-none"
                                                    value={activeMedia.caption || ''}
                                                    onChange={(e) => handleUpdateInfo('caption', e.target.value)}
                                                ></textarea>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="block text-xs font-bold text-gray-500">Liên kết</label>
                                                <input type="text" readOnly className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-gray-100 text-gray-500" value={activeMedia.url} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="h-16 border-t border-gray-200 bg-white flex justify-between items-center px-6 flex-shrink-0 z-10">
                    <div className="text-sm text-gray-500">
                        {selectedIds.length > 0 ? `Đã chọn ${selectedIds.length} mục` : ''}
                    </div>
                    <button 
                        onClick={handleConfirm}
                        disabled={selectedIds.length === 0}
                        className="bg-blue-600 text-white px-5 py-2 rounded text-sm font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        {mode === 'single' ? 'Đặt ảnh' : 'Chèn vào bài viết'}
                    </button>
                </div>
            </div>
        </div>
    );
}