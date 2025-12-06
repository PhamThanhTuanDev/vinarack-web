'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { getMediaLibrary, updateMediaInfo, deleteMediaFile, uploadFile, MediaFile } from '@/services/api';
import toast from 'react-hot-toast';

export default function AdminMedia() {
    const [mediaList, setMediaList] = useState<MediaFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    
    // UI States
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 24; // Số lượng ảnh mỗi trang (6x4)

    // Bulk Action State
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isBulkMode, setIsBulkMode] = useState(false); // Chế độ chọn nhiều

    // Detail Modal State
    const [selectedImage, setSelectedImage] = useState<MediaFile | null>(null);
    const [editForm, setEditForm] = useState({ alt_text: '', title: '', caption: '' });

    // Load dữ liệu
    const fetchMedia = async () => {
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

    useEffect(() => {
        fetchMedia();
    }, []);

    // Filter Logic
    const filteredMedia = useMemo(() => {
        return mediaList.filter(item => {
            const matchesSearch = item.file_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesType = filterType === 'all' || item.file_type.includes(filterType);
            return matchesSearch && matchesType;
        });
    }, [mediaList, searchQuery, filterType]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredMedia.length / itemsPerPage);
    const paginatedMedia = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredMedia.slice(start, start + itemsPerPage);
    }, [filteredMedia, currentPage, itemsPerPage]);

    // Reset trang khi filter thay đổi
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filterType]);

    // --- BULK ACTIONS ---
    
    const toggleSelect = (id: number) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            // Chọn tất cả ảnh đang hiển thị (filtered)
            setSelectedIds(filteredMedia.map(m => m.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (!confirm(`Bạn có chắc muốn xóa vĩnh viễn ${selectedIds.length} tệp tin đã chọn?`)) return;

        const toastId = toast.loading("Đang xóa...");
        try {
            // Xóa song song
            await Promise.all(selectedIds.map(id => deleteMediaFile(id)));
            
            setMediaList(prev => prev.filter(item => !selectedIds.includes(item.id)));
            setSelectedIds([]);
            toast.success("Đã xóa các tệp tin", { id: toastId });
        } catch (error) {
            toast.error("Có lỗi khi xóa", { id: toastId });
        }
    };

    // --- UPLOAD ---
    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploading(true);
        const files = Array.from(e.target.files);
        const uploadPromises = files.map(file => uploadFile(file));

        try {
            await Promise.all(uploadPromises);
            toast.success(`Đã tải lên ${files.length} tệp!`);
            fetchMedia();
        } catch (error) {
            toast.error("Có lỗi khi upload ảnh");
        } finally {
            setUploading(false);
            e.target.value = ''; 
        }
    };

    // --- MODAL DETAILS ---
    const openImageDetail = (img: MediaFile) => {
        if (isBulkMode) {
            toggleSelect(img.id);
        } else {
            setSelectedImage(img);
            setEditForm({
                alt_text: img.alt_text || '',
                title: img.title || '',
                caption: img.caption || ''
            });
        }
    };

    const handleSaveInfo = async () => {
        if (!selectedImage) return;
        try {
            await updateMediaInfo(selectedImage.id, editForm);
            toast.success("Đã lưu thông tin!");
            setMediaList(prev => prev.map(item => 
                item.id === selectedImage.id ? { ...item, ...editForm } : item
            ));
        } catch (error) {
            toast.error("Lỗi khi lưu");
        }
    };

    const handleDeleteSingle = async () => {
        if (!selectedImage) return;
        if (!confirm("Bạn có chắc muốn xóa vĩnh viễn tệp này?")) return;
        try {
            await deleteMediaFile(selectedImage.id);
            toast.success("Đã xóa tệp tin.");
            setMediaList(prev => prev.filter(item => item.id !== selectedImage.id));
            setSelectedImage(null);
        } catch (error) {
            toast.error("Lỗi khi xóa");
        }
    };

    const copyLink = () => {
        if (selectedImage) {
            navigator.clipboard.writeText(selectedImage.url);
            toast.success("Đã sao chép liên kết!");
        }
    };

    // Helpers
    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="flex flex-col h-[calc(100vh-100px)]">
            
            {/* TOOLBAR */}
            <div className="flex flex-col xl:flex-row justify-between items-center mb-4 gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4 w-full xl:w-auto">
                    <h1 className="text-xl font-bold text-gray-800">Thư Viện Media</h1>
                    
                    {/* Upload Button */}
                    <label className={`cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition flex items-center gap-2 shadow-sm ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                        <i className={`fas ${uploading ? 'fa-spinner fa-spin' : 'fa-cloud-upload-alt'}`}></i>
                        {uploading ? 'Đang tải...' : 'Tải lên'}
                        <input type="file" className="hidden" accept="image/*" multiple onChange={handleUpload} />
                    </label>

                    {/* Bulk Selection Toggle */}
                    <button 
                        onClick={() => {
                            setIsBulkMode(!isBulkMode);
                            setSelectedIds([]); // Reset khi đổi chế độ
                        }}
                        className={`px-4 py-2 rounded-lg border text-sm font-bold transition ${isBulkMode ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                    >
                        {isBulkMode ? 'Hủy chọn nhiều' : 'Chọn nhiều'}
                    </button>
                </div>

                {/* Bulk Actions Bar (Hiện khi chọn nhiều) */}
                {isBulkMode && selectedIds.length > 0 && (
                    <div className="flex items-center gap-4 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 animate-fade-in">
                        <span className="text-sm font-bold text-blue-800">Đã chọn {selectedIds.length} mục</span>
                        <button 
                            onClick={handleBulkDelete}
                            className="text-red-600 hover:text-red-800 text-sm font-bold flex items-center gap-1 bg-white px-3 py-1 rounded border border-red-200 hover:border-red-300 transition"
                        >
                            <i className="fas fa-trash-alt"></i> Xóa vĩnh viễn
                        </button>
                    </div>
                )}

                <div className="flex items-center gap-2 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0">
                    {/* View Switcher */}
                    <div className="flex border border-gray-300 rounded overflow-hidden flex-shrink-0">
                        <button onClick={() => setViewMode('grid')} className={`px-3 py-1.5 ${viewMode === 'grid' ? 'bg-gray-100 text-blue-600' : 'bg-white text-gray-500'}`}><i className="fas fa-th-large"></i></button>
                        <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 ${viewMode === 'list' ? 'bg-gray-100 text-blue-600' : 'bg-white text-gray-500'} border-l border-gray-300`}><i className="fas fa-list"></i></button>
                    </div>

                    <select className="border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-blue-500" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                        <option value="all">Tất cả media</option>
                        <option value="image">Hình ảnh</option>
                    </select>

                    <div className="relative">
                        <input type="text" placeholder="Tìm kiếm..." className="border border-gray-300 rounded pl-3 pr-8 py-1.5 text-sm outline-none focus:border-blue-500 w-40 sm:w-48" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        <i className="fas fa-search absolute right-2.5 top-2 text-gray-400 text-xs"></i>
                    </div>
                </div>
            </div>

            {/* CONTENT AREA */}
            <div className="flex-1 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-inner relative flex flex-col">
                {loading ? (
                    <div className="flex-1 flex items-center justify-center text-gray-500"><i className="fas fa-circle-notch fa-spin mr-2"></i> Đang tải dữ liệu...</div>
                ) : filteredMedia.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <i className="far fa-folder-open text-4xl mb-2"></i>
                        <p>Không tìm thấy tệp tin nào.</p>
                    </div>
                ) : (
                    <div className="flex-1 p-4 overflow-y-auto">
                        {/* GRID VIEW */}
                        {viewMode === 'grid' && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                                {paginatedMedia.map((item) => (
                                    <div 
                                        key={item.id} 
                                        onClick={() => openImageDetail(item)}
                                        className={`group relative aspect-square bg-gray-100 border-2 cursor-pointer transition-all duration-200 rounded-lg overflow-hidden ${selectedIds.includes(item.id) ? 'border-blue-500 shadow-md ring-2 ring-blue-200' : 'border-transparent hover:border-blue-300'}`}
                                    >
                                        <img src={item.url} alt={item.alt_text} className="w-full h-full object-cover" loading="lazy" />
                                        
                                        {/* Checkbox Overlay */}
                                        {(isBulkMode || selectedIds.includes(item.id)) && (
                                            <div className={`absolute top-2 right-2 w-6 h-6 rounded border border-gray-300 flex items-center justify-center transition-colors z-10 ${selectedIds.includes(item.id) ? 'bg-blue-500 border-blue-500' : 'bg-white hover:bg-gray-100'}`}
                                                onClick={(e) => { e.stopPropagation(); toggleSelect(item.id); }}
                                            >
                                                {selectedIds.includes(item.id) && <i className="fas fa-check text-white text-xs"></i>}
                                            </div>
                                        )}

                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-white text-xs truncate">{item.file_name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* LIST VIEW */}
                        {viewMode === 'list' && (
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 z-10 border-b">
                                    <tr>
                                        <th className="px-4 py-3 w-10 text-center">
                                            {isBulkMode && <input type="checkbox" onChange={handleSelectAll} checked={selectedIds.length === filteredMedia.length && filteredMedia.length > 0} />}
                                        </th>
                                        <th className="px-4 py-3 w-16 text-center"><i className="far fa-image"></i></th>
                                        <th className="px-4 py-3">Tệp tin</th>
                                        <th className="px-4 py-3">Tác giả</th>
                                        <th className="px-4 py-3">Đã tải lên vào</th>
                                        <th className="px-4 py-3">Dung lượng</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {paginatedMedia.map((item) => (
                                        <tr key={item.id} onClick={() => openImageDetail(item)} className={`bg-white hover:bg-blue-50 cursor-pointer transition ${selectedIds.includes(item.id) ? 'bg-blue-50' : ''}`}>
                                            <td className="px-4 py-2 text-center" onClick={(e) => e.stopPropagation()}>
                                                {isBulkMode && (
                                                    <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleSelect(item.id)} />
                                                )}
                                            </td>
                                            <td className="px-4 py-2">
                                                <div className="w-12 h-12 bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                                                    <img src={item.url} className="max-w-full max-h-full object-contain" />
                                                </div>
                                            </td>
                                            <td className="px-4 py-2">
                                                <p className="font-bold text-blue-600 mb-1 truncate max-w-xs">{item.file_name}</p>
                                                <p className="text-xs text-gray-400">{item.title || '(Chưa có tiêu đề)'}</p>
                                            </td>
                                            <td className="px-4 py-2 text-xs">Admin</td>
                                            <td className="px-4 py-2 text-xs">{new Date(item.created_at).toLocaleDateString('vi-VN')}</td>
                                            <td className="px-4 py-2 text-xs">{formatBytes(item.file_size)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* PAGINATION BAR */}
                {totalPages > 1 && (
                    <div className="bg-gray-50 border-t border-gray-200 p-3 flex justify-between items-center">
                        <div className="text-xs text-gray-500">
                            Hiển thị {paginatedMedia.length} / {filteredMedia.length} mục
                        </div>
                        <div className="flex gap-1">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 text-sm"
                            >
                                <i className="fas fa-chevron-left"></i>
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-1 border rounded text-sm ${currentPage === page ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-300 hover:bg-gray-100'}`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 text-sm"
                            >
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL CHI TIẾT ẢNH (Giữ nguyên như cũ) */}
            {selectedImage && !isBulkMode && (
                <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 md:p-8 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-7xl h-full max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden animate-fade-in-up rounded-sm">
                        
                        {/* Header */}
                        <div className="h-12 border-b border-gray-200 flex justify-between items-center px-4 bg-gray-50 flex-shrink-0">
                            <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">Chi tiết tệp đính kèm</h3>
                            <div className="flex items-center gap-2">
                                <div className="flex border border-gray-300 rounded overflow-hidden mr-4">
                                    <button 
                                        onClick={() => {
                                            const idx = filteredMedia.findIndex(i => i.id === selectedImage.id);
                                            if (idx > 0) openImageDetail(filteredMedia[idx - 1]);
                                        }} 
                                        disabled={filteredMedia.findIndex(i => i.id === selectedImage.id) === 0}
                                        className="px-3 py-1 bg-white hover:bg-gray-100 border-r border-gray-300 text-gray-600 transition disabled:opacity-50"
                                    >
                                        <i className="fas fa-chevron-left"></i>
                                    </button>
                                    <button 
                                        onClick={() => {
                                            const idx = filteredMedia.findIndex(i => i.id === selectedImage.id);
                                            if (idx < filteredMedia.length - 1) openImageDetail(filteredMedia[idx + 1]);
                                        }}
                                        disabled={filteredMedia.findIndex(i => i.id === selectedImage.id) === filteredMedia.length - 1}
                                        className="px-3 py-1 bg-white hover:bg-gray-100 text-gray-600 transition disabled:opacity-50"
                                    >
                                        <i className="fas fa-chevron-right"></i>
                                    </button>
                                </div>
                                <button onClick={() => setSelectedImage(null)} className="text-gray-400 hover:text-red-500 transition text-xl px-2"><i className="fas fa-times"></i></button>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                            <div className="md:w-2/3 bg-[#f0f0f1] flex items-center justify-center p-8 relative overflow-hidden border-r border-gray-200">
                                <div className="relative shadow-lg border border-gray-300 bg-[url('https://media.istockphoto.com/id/1136551139/vector/checker-seamless-pattern-checkered-background-vector-illustration.jpg?s=612x612&w=0&k=20&c=X7ZqVpQj_F-QJv-L7J8_qV_QJv-L7J8_qV_QJv-L7J8_qV_QJv-L7J8_qV')] bg-contain">
                                    <img src={selectedImage.url} className="max-w-full max-h-[70vh] object-contain block" alt="Preview" />
                                </div>
                            </div>
                            <div className="md:w-1/3 bg-white overflow-y-auto flex flex-col">
                                <div className="p-5 border-b border-gray-100 text-xs text-gray-600 space-y-2">
                                    <div className="font-bold text-gray-800 text-sm mb-1 break-all">{selectedImage.file_name}</div>
                                    <p><strong>Ngày tải lên:</strong> {new Date(selectedImage.created_at).toLocaleString('vi-VN')}</p>
                                    <p><strong>Loại tệp:</strong> {selectedImage.file_type}</p>
                                    <p><strong>Dung lượng tệp:</strong> {formatBytes(selectedImage.file_size)}</p>
                                    <p><strong>Kích thước:</strong> {selectedImage.width} x {selectedImage.height} pixel</p>
                                </div>
                                <div className="p-5 space-y-4 flex-1">
                                    <div className="space-y-1">
                                        <label className="block text-xs font-bold text-gray-500 uppercase">Văn bản thay thế</label>
                                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-blue-500 outline-none transition" value={editForm.alt_text} onChange={(e) => setEditForm({...editForm, alt_text: e.target.value})} placeholder="Mô tả mục đích của hình ảnh..." />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-xs font-bold text-gray-500 uppercase">Tiêu đề</label>
                                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-blue-500 outline-none transition" value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-xs font-bold text-gray-500 uppercase">Chú thích</label>
                                        <textarea rows={3} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-blue-500 outline-none transition resize-none" value={editForm.caption} onChange={(e) => setEditForm({...editForm, caption: e.target.value})}></textarea>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-xs font-bold text-gray-500 uppercase">Liên kết</label>
                                        <div className="flex">
                                            <input type="text" readOnly className="flex-1 px-3 py-2 border border-r-0 border-gray-300 rounded-l text-xs text-gray-500 bg-gray-50 outline-none" value={selectedImage.url} />
                                            <button onClick={copyLink} className="px-3 py-2 border border-gray-300 rounded-r bg-white text-blue-600 text-xs font-bold hover:bg-blue-50 transition">Copy</button>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
                                        <button onClick={handleSaveInfo} className="text-blue-600 font-bold hover:underline">Lưu thay đổi</button>
                                        <button onClick={handleDeleteSingle} className="text-red-500 hover:text-red-700 hover:underline text-xs">Xóa vĩnh viễn</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}