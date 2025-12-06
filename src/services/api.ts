import axios from 'axios';

// Tạo một instance của Axios
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- DEFINING TYPES (Định nghĩa kiểu dữ liệu) ---

// Interface cho Media File
export interface MediaFile {
    id: number;
    file_name: string;
    url: string;
    file_type: string;
    file_size: number;
    width: number;
    height: number;
    alt_text?: string;
    title?: string;
    caption?: string;
    created_at: string;
}

// Kiểu dữ liệu cho Sản phẩm (Khi Thêm/Sửa)
export interface ProductPayload {
    name: string;
    category_id: number;
    sku?: string;
    summary?: string;
    description?: string;
    technical_specs?: Record<string, string>;
    status?: string;
    thumbnail?: string;
    images?: string[];
}

// Kiểu dữ liệu cho Tin tức
export interface NewsPayload {
    title: string;
    category: string;
    summary?: string;
    content?: string;
    thumbnail_url?: string;
    status?: string;
}

// Kiểu dữ liệu cho Tuyển dụng
export interface JobPayload {
    title: string;
    department?: string;
    location?: string;
    salary_range?: string;
    type?: string;
    deadline?: string;
    description?: string;
    requirements?: string;
    benefits?: string;
    status?: string;
}

// Kiểu dữ liệu cho Liên hệ
export interface ContactPayload {
    fullName: string;
    phone: string;
    email?: string;
    productInterest?: string;
    message?: string;
}

// Kiểu dữ liệu Đăng nhập
export interface LoginPayload {
    username: string;
    password?: string;
}

// Kiểu dữ liệu Nộp hồ sơ
export interface ApplicationPayload {
    job_id: number;
    full_name: string;
    phone: string;
    email: string;
    introduction?: string;
    cv_url?: string;
}


// --- MEDIA API ---

export const getMediaLibrary = async () => {
    const response = await api.get('/media');
    return response.data;
};

export const updateMediaInfo = async (id: number, data: { alt_text?: string, title?: string, caption?: string }) => {
    const response = await api.put(`/media/${id}`, data);
    return response.data;
};

export const deleteMediaFile = async (id: number) => {
    const response = await api.delete(`/media/${id}`);
    return response.data;
};

// Hàm upload file (Tách riêng để tái sử dụng)
export const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Lưu ý: Cần import axios trực tiếp nếu api instance không hỗ trợ multipart tự động tốt
    // Hoặc dùng instance api hiện tại:
    const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

// --- AUTH API (ĐĂNG NHẬP) ---
export const login = async (credentials: LoginPayload) => {
    const response = await api.post('/login', credentials);
    return response.data;
};

// --- PUBLIC API (KHÁCH HÀNG) ---

export const getProducts = async () => {
    const response = await api.get('/products');
    return response.data;
};

export const getProductBySlug = async (slug: string) => {
    const response = await api.get(`/products/${slug}`);
    return response.data;
};

export const getNews = async () => {
    const response = await api.get('/news');
    return response.data;
};

// Sửa any -> ContactPayload
export const sendContact = async (data: ContactPayload) => {
    const response = await api.post('/contact', data);
    return response.data;
};

// Gửi hồ sơ ứng tuyển
export const submitApplication = async (data: ApplicationPayload) => {
    const response = await api.post('/apply', data);
    return response.data;
};

// --- ADMIN API (QUẢN TRỊ) ---

// 1. Sản Phẩm
export const getAdminProducts = async () => {
    const response = await api.get('/admin/products');
    return response.data;
};

export const deleteProduct = async (id: number) => {
    const response = await api.delete(`/admin/products/${id}`);
    return response.data;
};

// Sửa any -> ProductPayload
export const createProduct = async (data: ProductPayload) => {
    const response = await api.post('/admin/products', data);
    return response.data;
};

export const updateProduct = async (id: number, data: ProductPayload) => {
    const response = await api.put(`/admin/products/${id}`, data);
    return response.data;
};

export const getProductById = async (id: number) => {
    const response = await api.get(`/admin/products/${id}`);
    return response.data;
};

// 2. Tin Tức
export const getAdminNews = async () => {
    const response = await api.get('/admin/news');
    return response.data;
};

export const getNewsById = async (id: number) => {
    const response = await api.get(`/admin/news/${id}`);
    return response.data;
};

export const createNews = async (data: NewsPayload) => {
    const response = await api.post('/admin/news', data);
    return response.data;
};

export const updateNews = async (id: number, data: NewsPayload) => {
    const response = await api.put(`/admin/news/${id}`, data);
    return response.data;
};

export const deleteNews = async (id: number) => {
    const response = await api.delete(`/admin/news/${id}`);
    return response.data;
};

// 3. Tuyển Dụng
export const getAdminJobs = async () => {
    const response = await api.get('/admin/jobs');
    return response.data;
};

export const getJobById = async (id: number) => {
    const response = await api.get(`/admin/jobs/${id}`);
    return response.data;
};

export const createJob = async (data: JobPayload) => {
    const response = await api.post('/admin/jobs', data);
    return response.data;
};

export const updateJob = async (id: number, data: JobPayload) => {
    const response = await api.put(`/admin/jobs/${id}`, data);
    return response.data;
};

export const deleteJob = async (id: number) => {
    const response = await api.delete(`/admin/jobs/${id}`);
    return response.data;
};

// 4. Liên Hệ & Ứng Viên
export const getAdminContacts = async () => {
    const response = await api.get('/admin/contacts');
    return response.data;
};

export const updateContactStatus = async (id: number, status: string) => {
    const response = await api.put(`/admin/contacts/${id}`, { status });
    return response.data;
};

export const getApplications = async () => {
    const response = await api.get('/admin/applications');
    return response.data;
};

export const updateApplicationStatus = async (id: number, status: string) => {
    const response = await api.put(`/admin/applications/${id}`, { status });
    return response.data;
};

// 5. Users
export const getAdminUsers = async () => {
    const response = await api.get('/admin/users');
    return response.data;
};

export const getUserById = async (id: number) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
};

// Dùng tạm any cho user data vì cấu trúc có thể linh động (hoặc bạn có thể tạo UserPayload)
export const createUser = async (data: any) => {
    const response = await api.post('/admin/users', data);
    return response.data;
};

export const updateUser = async (id: number, data: any) => {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data;
};

export const deleteUser = async (id: number) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
};


// --- PROJECT API ---
export const getAdminProjects = async () => {
    const response = await api.get('/admin/projects');
    return response.data;
};

export const getProjectById = async (id: number) => {
    const response = await api.get(`/admin/projects/${id}`);
    return response.data;
};

export const createProject = async (data: any) => {
    const response = await api.post('/admin/projects', data);
    return response.data;
};

export const updateProject = async (id: number, data: any) => {
    const response = await api.put(`/admin/projects/${id}`, data);
    return response.data;
};

export const deleteProject = async (id: number) => {
    const response = await api.delete(`/admin/projects/${id}`);
    return response.data;
};

export default api;