import { useState, useEffect } from "react";
import { Flame, Wind, Timer, Sparkles, Lamp, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductCard from "@/components/ProductCard";
import { apiService, Product } from "@/services/apiService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import nen from "@/assets/4c.jpg";
import { Flower, Leaf, Heart, Star, Gift, Shield, Award } from "lucide-react";
import type { DisplayCategoryKey } from "@/config/displayCategories";
const IncenseCategory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const displayKey: DisplayCategoryKey = "huong-nen";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const mapping = await apiService.getDisplayCategoryMapping();
        const mappedCategoryId = mapping?.mappings?.[displayKey];

        if (typeof mappedCategoryId === "number" && mappedCategoryId > 0) {
          const mappedProducts =
            await apiService.getProductsByCategory(mappedCategoryId);
          setProducts(mappedProducts);
          return;
        }

        const [allProducts, categories] = await Promise.all([
          apiService.getProducts(),
          apiService.getCategories(),
        ]);

        // Fallback: Find incense category
        const incenseCategory = categories.find(
          (cat) =>
            cat.name.toLowerCase().includes("hương") ||
            cat.name.toLowerCase().includes("nến") ||
            cat.name.toLowerCase().includes("incense"),
        );

        if (incenseCategory) {
          setProducts(
            allProducts.filter(
              (product) => product.productCategoryId === incenseCategory.id,
            ),
          );
          return;
        }

        // Last fallback: filter by name
        setProducts(
          allProducts.filter(
            (product) =>
              product.name.toLowerCase().includes("hương") ||
              product.name.toLowerCase().includes("nến") ||
              product.name.toLowerCase().includes("incense"),
          ),
        );
      } catch (apiError) {
        console.error("Error fetching products:", apiError);
        setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const singleImage =
    "https://i.pinimg.com/736x/62/b8/97/62b897c4d61b1f26400fad53e0c6c9c7.jpg";

  const features = [
    {
      icon: Flame,
      title: "Hương Thuần Khiết",
      description: "Được làm từ nguyên liệu tự nhiên, không pha tạp chất",
    },
    {
      icon: Wind,
      title: "Mùi Hương Lâu Phai",
      description: "Giữ mùi hương thanh thoát trong thời gian dài",
    },
    {
      icon: Sparkles,
      title: "Ý Nghĩa Tâm Linh",
      description: "Mang lại sự bình an và kết nối với tâm linh",
    },
    {
      icon: Clock,
      title: "Cháy Đều Lâu",
      description: "Thời gian cháy ổn định, không khói độc hại",
    },
  ];

  const incenseTypes = [
    {
      name: "Hương Trầm",
      description: "Hương trầm cao cấp với mùi hương đậm đà",
      image:
        "https://bizweb.dktcdn.net/thumb/1024x1024/100/487/338/products/tram-huong-tram-nu-tu-phu-plus-vno-1.jpg?v=1691143615320",
      benefits: ["Mùi hương đậm đà", "Cháy lâu ổn định", "Phù hợp lễ cúng"],
      price: "120.000₫ / hộp",
    },
    {
      name: "Hương Que",
      description: "Hương que thích hợp cho các dịp lễ cúng",
      image:
        "https://www.quetrabong.vn/uploads/2023/10/sp-nhang-107-min-6528e5e2d801e.jpg",
      benefits: ["Truyền thống", "Dễ sử dụng", "Giá cả hợp lý"],
      price: "45.000₫ / bó",
    },
    {
      name: "Nến Thờ",
      description: "Nến thờ chất lượng cao, ánh sáng ổn định",
      image:
        "https://product.hstatic.net/1000098547/product/combo3nen_nen-dien-tu-vo-sap-pillar-led_01_5a8c041080fe4e028a133a75c19c76e8_grande.jpg",
      benefits: ["Ánh sáng ổn định", "Không khói", "An toàn sử dụng"],
      price: "80.000₫ / cặp",
    },
  ];

  const occasions = [
    {
      title: "Cúng Tổ Tiên",
      description: "Hương nến thể hiện lòng thành kính",
      flowers: ["Hương trầm", "Nến đỏ", "Hương que", "Nến trắng"],
      color: "bg-amber-100 text-amber-800",
    },
    {
      title: "Lễ Tốt Nghiệp",
      description: "Hương nến chúc mừng thành công",
      flowers: ["Nến thơm", "Hương que", "Nến màu", "Hương trầm"],
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      title: "Cúng Thần Tài",
      description: "Hương nến mang lại may mắn tài lộc",
      flowers: ["Hương vàng", "Nến đỏ", "Hương que", "Nến thờ"],
      color: "bg-amber-100 text-amber-800",
    },
  ];
  const testimonials = [
    {
      name: "Chị Minh Anh",
      role: "Phụ huynh học sinh",
      content:
        "Hương nến rất thơm và bền, con tôi rất hài lòng trong ngày tốt nghiệp. Dịch vụ tận tình!",
      rating: 5,
    },
    {
      name: "Anh Đức Minh",
      role: "Sinh viên",
      content:
        "Chất lượng hương nến tuyệt vời, giá cả hợp lý. Sẽ giớ i thiệu cho bạn bè.",
      rating: 5,
    },
  ];

  return (
    <div>
      <Header /> {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50/50 to-orange-50/10">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-200/30 to-yellow-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-orange-200/30 to-amber-200/30 rounded-full blur-xl"></div>

        <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200 text-sm py-2 px-6 font-semibold shadow-md hover:shadow-lg transition-all duration-300">
                  ✨ Bộ Sưu Tập Hoa Tươi Cao Cấp ✨
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-[#C99F4D] to-[#D4AF37] bg-clip-text text-transparent">
                    Hương – Nến Cho
                  </span>
                  <br />
                  <span className="text-[#B8904A]">Mâm Cúng </span>
                </h1>
                <p className="text-xl text-gray-700 leading-relaxed max-w-xl">
                  Mỗi que hương được chọn lọc kỹ lưỡng, mang ý nghĩa thiêng
                  liêng và thành công cho những dịp quan trọng của bạn
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#C99F4D] to-[#B8904A] hover:from-[#B8904A] hover:to-[#A67C42] text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-semibold"
                >
                  <Flower className="mr-2 h-5 w-5" />
                  Xem Sản Phẩm
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-[#C99F4D] text-[#C99F4D] hover:bg-[#C99F4D] hover:text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-semibold"
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Tư Vấn Miễn Phí
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-8 pt-8 border-t border-amber-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#C99F4D]">3+</div>
                  <div className="text-sm text-gray-600">Năm sản xuất nến</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#C99F4D]">5K+</div>
                  <div className="text-sm text-gray-600">
                    Khách hàng yêu thích
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#C99F4D]">100%</div>
                  <div className="text-sm text-gray-600">Sáp nến tự nhiên</div>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Background decoration */}
              <div className="absolute inset-y-0 inset-x-20 bg-gradient-to-br from-amber-100/60 to-orange-100/60 rounded-2xl transform rotate-2 scale-95"></div>
              <div className="absolute inset-y-0 inset-x-20 bg-gradient-to-tl from-yellow-100/60 to-amber-100/60 rounded-2xl transform -rotate-1 scale-90"></div>

              {/* Main image */}
              <div className="relative">
                <img
                  src="https://i.pinimg.com/736x/62/b8/97/62b897c4d61b1f26400fad53e0c6c9c7.jpg"
                  alt="Hoa tươi cao cấp cho lễ tốt nghiệp"
                  className="relative rounded-3xl shadow-2xl h-[500px] ml-40 transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-20 bg-white relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-amber-300 to-yellow-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-orange-300 to-amber-300 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200 mb-4 px-4 py-2 font-semibold">
              Tại Sao Chọn Chúng Tôi
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-[#C99F4D] mb-6">
              Đặc Điểm Nổi Bật
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
              Chúng tôi cam kết mang đến những bông hoa tươi nhất với chất lượng
              cao nhất cho các dịp quan trọng của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card
                  key={index}
                  className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-amber-50/30 hover:from-amber-50 hover:to-yellow-50 transform hover:-translate-y-2"
                >
                  <CardContent className="p-8 text-center">
                    <div
                      className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#C99F4D] ${feature.description} flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}
                    >
                      <IconComponent className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="font-bold text-xl text-gray-800 mb-4  transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      {/* Occasions Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 via-yellow-50/50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-[500px] h-full bg-gradient-to-br from-amber-200/30 to-yellow-200/30 rounded-2xl transform rotate-3"></div>
              {/* <div className="absolute -bottom-4 -right-4 w-[550px] h-full bg-gradient-to-br from-orange-200/30 to-amber-200/30 rounded-2xl transform -rotate-2"></div> */}

              <div className="relative">
                <img
                  src="https://i.pinimg.com/736x/ab/c2/53/abc253b094647ee0c708afd54d2394c4.jpg"
                  alt="Hoa tươi truyền thống"
                  className="rounded-2xl shadow-2xl h-[500px] transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            <div className="space-y-8 order-1 lg:order-2">
              <div>
                <Badge className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200 mb-4 px-4 py-2 font-semibold">
                  Văn Hóa Truyền Thống
                </Badge>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#C99F4D] mb-6 whitespace-nowrap">
                  Ý Nghĩa Hương – Nến Trong Mâm Cúng
                </h2>
              </div>

              <div className="space-y-3">
                <div className="bg-white rounded-2xl p-4 shadow-lg border-l-4 border-[#C99F4D]">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Biểu Tượng Sức Khỏe
                  </h3>
                  <p className="text-gray-600">
                    Hoa tươi trong văn hóa Việt Nam luôn mang ý nghĩa tốt lành,
                    thể hiện sự tôn kính và lòng biết ơn đối với tổ tiên, thầy
                    cô và những người hướng dẫn.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-lg border-l-4 border-[#8B7355]">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Khởi Đầu Mới
                  </h3>
                  <p className="text-gray-600">
                    Màu sắc tươi mới của hoa thể hiện sự khởi đầu mới, thành
                    công trong học tập và công việc sắp tới của các bạn học
                    sinh, sinh viên.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-lg border-l-4 border-[#A67C5A]">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Không Gian Thiêng Liêng
                  </h3>
                  <p className="text-gray-600">
                    Mùi hương thanh khiết của hoa giúp tạo không gian thiêng
                    liêng, trang trọng cho buổi lễ quan trọng nhất cuộc đời.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button className="bg-gradient-to-r from-[#C99F4D] to-[#B8904A] hover:from-[#B8904A] hover:to-[#A67C42] text-white font-semibold px-6 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <Flower className="h-4 w-4 mr-2" />
                  Tìm hiểu thêm
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-[#C99F4D] text-[#C99F4D] hover:bg-[#C99F4D] hover:text-white font-semibold px-6 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Leaf className="h-4 w-4 mr-2" />
                  Cách bảo quản
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Culture/Care Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Badge className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200 mb-2 px-4 py-2 font-semibold">
              Hướng Dẫn Sử Dụng
            </Badge>
            <h3 className="text-3xl md:text-4xl font-bold text-[#C99F4D] mb-2">
              Bí Quyết Giữ Nến Cháy Đẹp Lâu
            </h3>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              Làm thế nào để nến của bạn luôn tỏa sáng, cháy đều và mang lại
              không gian ấm cúng nhất
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Tip 1 */}
              <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-amber-50 to-yellow-50 transform hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#C99F4D] flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <Flame className="h-10 w-10 text-white" />
                  </div>
                  <h5 className="text-xl font-bold text-amber-900 mb-4">
                    Chọn Nến Chất Lượng
                  </h5>
                  <p className="text-amber-800 leading-relaxed">
                    Ưu tiên nến làm từ sáp tự nhiên (như sáp ong, sáp đậu nành),
                    có bấc cotton và hương thơm nhẹ nhàng.
                  </p>
                </CardContent>
              </Card>

              {/* Tip 2 */}
              <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-yellow-50 to-orange-50 transform hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#C99F4D] flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <Sparkles className="h-10 w-10 text-white" />
                  </div>
                  <h5 className="text-xl font-bold text-orange-900 mb-4">
                    Đốt Nến Đúng Cách
                  </h5>
                  <p className="text-orange-800 leading-relaxed">
                    Lần đầu đốt ít nhất 2 giờ để nến chảy đều. Giữ bấc dài
                    khoảng 0.5 cm để ngọn lửa ổn định và không khói.
                  </p>
                </CardContent>
              </Card>

              {/* Tip 3 */}
              <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-orange-50 to-amber-50 transform hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#C99F4D] flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <Timer className="h-10 w-10 text-white" />
                  </div>
                  <h5 className="text-xl font-bold text-amber-900 mb-4">
                    Bảo Quản Nến
                  </h5>
                  <p className="text-amber-800 leading-relaxed">
                    Đặt nến nơi khô ráo, tránh ánh nắng trực tiếp. Đậy nắp khi
                    không dùng để giữ mùi hương lâu hơn.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Additional Tips */}
            <Card className="mt-5 bg-[#C99F4D] text-white border-0 shadow-2xl">
              <CardContent className="p-2">
                <div className="text-center">
                  <Lamp className="h-10 w-10 mx-auto mb-2 text-white" />
                  <h4 className="text-xl font-bold mb-2">
                    Mẹo Hay Từ Chuyên Gia
                  </h4>
                  <p className="text-amber-100 text-sm mx-auto leading-relaxed">
                    Trước khi tắt nến, hãy dùng nắp đậy hoặc dụng cụ dập lửa để
                    tránh khói. Sau mỗi lần đốt, cắt phần bấc cháy đen để nến
                    cháy đều và đẹp hơn.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Products Section */}
      <section className="py-16 bg-gradient-to-br from-amber-50/10 to-yellow-50/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-[#C99F4D] mb-4 break-words">
              Sản Phẩm Hương Nến Đặc Biệt
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Khám phá những loại hương nến đặc biệt, được lựa chọn kỹ lưỡng
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => {
                const productCardProps = {
                  ...product,
                  price: product.basePrice,
                  originalPrice: product.maxPrice,
                  rating: 4.5,
                  reviews: product.reviews?.length || 0,
                  category: "Hương",
                  shopId: product.shop?.id || 1,
                  isBestSeller: product.isPopular,
                  isNew: false,
                };
                return <ProductCard key={product.id} {...productCardProps} />;
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Flame className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Đang cập nhật sản phẩm mới...</p>
            </div>
          )}
        </div>
      </section>
      {/* CTA Section */}
      <Footer />
    </div>
  );
};

export default IncenseCategory;
