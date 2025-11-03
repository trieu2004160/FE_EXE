import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { apiService, Product } from "@/services/apiService";
import { Loader2 } from "lucide-react";
import { getProductImageUrl } from "@/utils/imageUtils";

const ProductGrid = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await apiService.getProducts();
        // Get popular/featured products (isPopular = true) or first 8 products
        const featured = allProducts
          .filter((p) => p.isPopular)
          .slice(0, 8);
        
        // If not enough popular products, add more
        if (featured.length < 8) {
          const remaining = allProducts
            .filter((p) => !featured.includes(p))
            .slice(0, 8 - featured.length);
          setFeaturedProducts([...featured, ...remaining]);
        } else {
          setFeaturedProducts(featured);
        }
      } catch (error) {
        console.error("Error fetching featured products:", error);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-amber-50/70 via-white to-orange-50/70 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-6">
          <h2 className="text-5xl font-medium bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent leading-snug tracking-wide font-sans">
            Sản Phẩm Nổi Bật
          </h2>

          <p className="text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed font-light">
            Những sản phẩm đồ cúng chất lượng cao, được khách hàng tin tưởng và
            lựa chọn nhiều nhất. Mỗi món đều được tuyển chọn kỹ lưỡng để mang
            đến sự trọn vẹn cho các dịp quan trọng.
          </p>

          {/* Decorative Line */}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#C99F4D]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-4">
            {featuredProducts.map((product, index) => {
              // Get normalized image URL using utility function
              const imageUrl = getProductImageUrl(product);
              
              // Convert API Product to ProductCard format
              const productCardProps = {
                id: product.id,
                name: product.name,
                price: product.basePrice,
                originalPrice: product.maxPrice,
                image: imageUrl || "",
                imageUrl: product.imageUrl,
                ImageUrls: product.ImageUrls,
                imageUrls: product.imageUrls,
                rating: 4.5,
                reviews: product.reviews?.length || 0,
                category: "",
                shopId: product.shop?.id || 1,
                isBestSeller: product.isPopular,
                isNew: false,
              };
              
              return (
                <div
                  key={product.id}
                  className="transform hover:-translate-y-2 transition-all duration-500 ease-out animate-fade-in-up"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <ProductCard {...productCardProps} />
                </div>
              );
            })}
        </div>
        )}

        {/* Call to Action Section */}
        <div className="text-center mt-16">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100 max-w-xl mx-auto">
            <h3 className="text-lg font-medium text-gray-700 mb-3 tracking-wide">
              Khám Phá Thêm Sản Phẩm
            </h3>
            <p className="text-xs text-gray-400 mb-6 font-light">
              500+ sản phẩm chất lượng cao đang chờ bạn khám phá
            </p>
            <Link to="/products" className="group">
              <button className="relative bg-[#C99F4D] hover:bg-[#B8904A] text-white px-6 py-2.5 rounded-lg font-light text-sm shadow-sm hover:shadow-md transition-all duration-300 ease-out">
                <span className="relative flex items-center justify-center space-x-1.5">
                  <span>Xem Tất Cả</span>
                  <svg
                    className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </button>
            </Link>

            {/* Stats */}
            <div className="flex justify-center items-center space-x-6 mt-6 text-xs text-gray-400 font-light">
              <div className="flex items-center space-x-1">
                <svg
                  className="w-3 h-3 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Miễn phí ship</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg
                  className="w-3 h-3 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Chất lượng cao</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg
                  className="w-3 h-3 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                </svg>
                <span>Hỗ trợ 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
