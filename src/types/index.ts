export interface Product {
    id: number;
    name: string;
    slug: string;
    summary: string;
    thumbnail: string; // URL ảnh đại diện
    category_name?: string;
    price?: string; // Nếu có
}

export interface News {
    id: number;
    title: string;
    slug: string;
    summary: string;
    thumbnail_url: string;
    published_at: string;
}