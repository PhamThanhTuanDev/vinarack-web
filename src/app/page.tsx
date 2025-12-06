import Link from 'next/link';
import { getProducts } from '@/services/api'; // Import hàm gọi API
import ProductCard from '@/components/ProductCard'; // Import thẻ sản phẩm
import { Product } from '@/types';

// Biến Component thành async để fetch dữ liệu
export default async function Home() {
  
  // 1. Gọi API lấy danh sách sản phẩm
  let products: Product[] = [];
  try {
    products = await getProducts();
  } catch (error) {
    console.error("Lỗi lấy sản phẩm:", error);
    // Có thể để mảng rỗng hoặc dữ liệu mẫu nếu lỗi
  }

  // Lấy 6 sản phẩm đầu tiên để hiển thị trang chủ
  const featuredProducts = products.slice(0, 6);

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative h-[600px] flex items-center bg-[#0a2745]">
        <div className="absolute inset-0 z-0 opacity-40">
            <img 
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
                alt="Hero Background" 
                className="w-full h-full object-cover"
            />
        </div>
        <div className="container mx-auto px-4 text-center md:text-left relative z-10">
          <div className="md:w-2/3">
            <span className="inline-block py-1 px-3 rounded bg-orange-600/20 text-orange-400 border border-orange-500/30 text-sm font-bold mb-4 tracking-wider uppercase backdrop-blur-sm">
              Giải pháp kho vận toàn diện
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
              TỐI ƯU HÓA <br /> KHÔNG GIAN KHO HÀNG
            </h1>
            <p className="text-lg text-gray-200 mb-8 leading-relaxed max-w-2xl">
              Vinarack chuyên thiết kế, sản xuất và lắp đặt hệ thống kệ chứa hàng công nghiệp tiêu chuẩn quốc tế.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
              <Link href="/products" className="px-8 py-4 bg-[#f97316] text-white rounded font-bold text-lg hover:bg-orange-700 transition shadow-lg text-center">
                XEM SẢN PHẨM
              </Link>
              <Link href="/contact" className="px-8 py-4 bg-transparent border-2 border-white text-white rounded font-bold text-lg hover:bg-white hover:text-[#0f3a68] transition text-center">
                TƯ VẤN MIỄN PHÍ
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-[#f97316] font-bold tracking-wide uppercase text-sm mb-2">Tại sao chọn Vinarack?</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Tiêu Chuẩn Chất Lượng Vượt Trội</h3>
            <div className="w-20 h-1 bg-[#0f3a68] mx-auto mt-4"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 border border-gray-100 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#0f3a68] transition">
                <i className="fas fa-industry text-2xl text-[#0f3a68] group-hover:text-white"></i>
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-800">Sản Xuất Trực Tiếp</h4>
              <p className="text-gray-600 leading-relaxed">Hệ thống nhà máy hiện đại, quy trình khép kín không qua trung gian.</p>
            </div>
            <div className="p-8 border border-gray-100 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#0f3a68] transition">
                <i className="fas fa-shield-alt text-2xl text-[#0f3a68] group-hover:text-white"></i>
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-800">Bảo Hành 5 Năm</h4>
              <p className="text-gray-600 leading-relaxed">Chính sách bảo hành dài hạn. Kiểm tra định kỳ hệ thống kệ.</p>
            </div>
            <div className="p-8 border border-gray-100 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#0f3a68] transition">
                <i className="fas fa-drafting-compass text-2xl text-[#0f3a68] group-hover:text-white"></i>
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-800">Thiết Kế Theo Yêu Cầu</h4>
              <p className="text-gray-600 leading-relaxed">Đội ngũ kỹ sư khảo sát thực tế và thiết kế giải pháp tối ưu.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION (DỮ LIỆU ĐỘNG TỪ API) */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#0f3a68]">Hệ Thống Sản Phẩm</h2>
                    <p className="text-gray-600 mt-2">Đa dạng giải pháp cho mọi tải trọng</p>
                </div>
                <Link href="/products" className="hidden md:inline-flex items-center text-[#f97316] font-bold hover:underline">
                    Xem tất cả danh mục <i className="fas fa-arrow-right ml-2"></i>
                </Link>
            </div>

            {/* Grid hiển thị sản phẩm */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.length > 0 ? (
                    featuredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <div className="col-span-3 text-center py-10 text-gray-500">
                        Đang tải dữ liệu sản phẩm hoặc chưa có sản phẩm nào...
                    </div>
                )}
            </div>
            
            <div className="mt-12 text-center md:hidden">
                <Link href="/products" className="px-6 py-3 border border-[#0f3a68] text-[#0f3a68] rounded font-bold hover:bg-[#0f3a68] hover:text-white transition">
                    Xem tất cả sản phẩm
                </Link>
            </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-[#0f3a68] relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-2/3 mb-8 md:mb-0 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">BẠN CẦN TƯ VẤN GIẢI PHÁP KHO?</h2>
              <p className="text-blue-200 text-lg">Để lại thông tin, kỹ sư của chúng tôi sẽ liên hệ khảo sát và lên bản vẽ 2D/3D miễn phí trong vòng 24h.</p>
            </div>
            <div className="md:w-1/3 text-center">
              <Link href="/contact" className="inline-block px-8 py-4 bg-[#f97316] text-white rounded-lg font-bold text-xl shadow-lg hover:bg-orange-600 transition transform hover:scale-105">
                <i className="fas fa-paper-plane mr-2"></i> GỬI YÊU CẦU NGAY
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}