import { useState, useEffect } from "react";
import {
  Flower,
  Leaf,
  Heart,
  Star,
  Gift,
  Shield,
  Clock,
  Award,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductCard from "@/components/ProductCard";
import { apiService, Product } from "@/services/apiService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import flowersHeroImage from "@/assets/flowers-hero.jpg";
import type { DisplayCategoryKey } from "@/config/displayCategories";

const FlowersCategory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const displayKey: DisplayCategoryKey = "hoa-tuoi";

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

        // Fallback to keyword-based matching
        const [allProducts, categories] = await Promise.all([
          apiService.getProducts(),
          apiService.getCategories(),
        ]);

        const flowerCategory = categories.find(
          (cat) =>
            cat.name.toLowerCase().includes("hoa") ||
            cat.name.toLowerCase().includes("flower"),
        );

        if (flowerCategory) {
          setProducts(
            allProducts.filter(
              (product) => product.productCategoryId === flowerCategory.id,
            ),
          );
          return;
        }

        setProducts(
          allProducts.filter(
            (product) =>
              product.name.toLowerCase().includes("hoa") ||
              product.name.toLowerCase().includes("flower"),
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Không thể tải sản phẩm</p>
          <Button onClick={() => window.location.reload()}>Thử lại</Button>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: Flower,
      title: "Hoa Tươi Mỗi Ngày",
      description:
        "Hoa được nhập về hàng ngày từ các nhà vườn uy tín, đảm bảo độ tươi mới tối đa cho dịp quan trọng của bạn",
      gradient: "from-amber-400 to-yellow-500",
    },
    {
      icon: Shield,
      title: "Tự Nhiên 100%",
      description:
        "Không sử dụng hóa chất bảo quản độc hại, an toàn tuyệt đối cho sức khỏe gia đình bạn",
      gradient: "from-orange-400 to-amber-500",
    },
    {
      icon: Heart,
      title: "Ý Nghĩa Tâm Linh",
      description:
        "Mang lại may mắn, thành công và hạnh phúc trong học tập, công việc và cuộc sống",
      gradient: "from-yellow-400 to-orange-500",
    },
    {
      icon: Award,
      title: "Chất Lượng Cao",
      description:
        "Được chọn lọc kỹ lưỡng bởi các chuyên gia có kinh nghiệm hơn 15 năm trong ngành",
      gradient: "from-amber-500 to-yellow-600",
    },
  ];

  const flowerTypes = [
    {
      name: "Hoa Hồng Đỏ",
      description: "Biểu tượng của tình yêu và thành công",
      image:
        "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      benefits: ["Ý nghĩa cao quý", "Màu sắc rực rỡ", "Hương thơm dễ chịu"],
      price: "150.000đ - 300.000đ",
      popular: true,
    },
    {
      name: "Hoa Cúc Trắng",
      description: "Thể hiện sự trong sạch và thuần khiết",
      image:
        "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      benefits: ["Tôn kính tổ tiên", "Màu sắc trang nhã", "Bền lâu"],
      price: "80.000đ - 200.000đ",
      popular: false,
    },
    {
      name: "Hoa Sen Hồng",
      description: "Biểu tượng của sự thanh cao và giác ngộ",
      image:
        "https://images.unsplash.com/photo-1561181286-d3fee7d55364?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      benefits: ["Ý nghĩa tâm linh", "Vẻ đẹp thanh tao", "Phù hợp cúng kiến"],
      price: "200.000đ - 450.000đ",
      popular: true,
    },
  ];

  const occasions = [
    {
      title: "Cúng Tổ Tiên",
      description: "Hoa thể hiện lòng thành kính với tổ tiên",
      flowers: ["Hoa cúc vàng", "Hoa sen hồng", "Hoa hồng đỏ", "Hoa ly trắng"],
      color: "bg-[#C99F4D]",
      textColor: "text-amber-800",
      icon: Heart,
      // borderColor: "border-amber-200",
    },
    {
      title: "Lễ Tốt Nghiệp",
      description: "Hoa chúc mừng thành công ",
      flowers: ["Hoa hồng đỏ", "Hoa cúc vàng", "Hoa ly trắng", "Hoa tulip"],
      color: "bg-[#C99F4D]",
      textColor: "text-yellow-800",
      icon: Star,
      // borderColor: "border-yellow-200",
    },
    {
      title: "Cúng Thần Tài",
      description: "Hoa mang lại may mắn và tài lộc",
      flowers: ["Hoa cúc vàng", "Hoa hồng đỏ", "Hoa tulip", "Hoa lay-ơn"],
      color: "bg-[#C99F4D]",
      textColor: "text-amber-800",
      icon: Gift,
      // borderColor: "border-yellow-200",
    },
  ];

  const testimonials = [
    {
      name: "Chị Minh Anh",
      role: "Phụ huynh học sinh",
      content:
        "Hoa rất tươi và đẹp, con tôi rất hài lòng trong ngày tốt nghiệp. Dịch vụ tận tình!",
      rating: 5,
    },
    {
      name: "Anh Đức Minh",
      role: "Sinh viên",
      content:
        "Chất lượng hoa tuyệt vời, giá cả hợp lý. Sẽ giới thiệu cho bạn bè.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-yellow-50/30">
      <Header />

      {/* Hero Section - Cải thiện layout và visual */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50/50 to-orange-50/5">
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
                    Hoa Tươi trang trí
                  </span>
                  <br />
                  <span className="text-[#B8904A]">Mâm Cúng</span>
                </h1>
                <p className="text-xl text-gray-700 leading-relaxed max-w-xl">
                  Mỗi bông hoa được chọn lọc kỹ lưỡng từ những nhà vườn uy tín,
                  mang ý nghĩa tốt lành và thành công cho những dịp quan trọng
                  nhất của bạn.
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
                  <div className="text-2xl font-bold text-[#C99F4D]">15+</div>
                  <div className="text-sm text-gray-600">Năm kinh nghiệm</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#C99F4D]">10K+</div>
                  <div className="text-sm text-gray-600">
                    Khách hàng hài lòng
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#C99F4D]">100%</div>
                  <div className="text-sm text-gray-600">Hoa tươi tự nhiên</div>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-100/40 to-orange-100/40 rounded-3xl transform rotate-3 scale-105"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-yellow-100/40 to-amber-100/40 rounded-3xl transform -rotate-2 scale-110"></div>

              {/* Main image */}
              <div className="relative">
                <img
                  src={flowersHeroImage}
                  alt="Hoa tươi cao cấp cho lễ tốt nghiệp"
                  className="relative rounded-3xl shadow-2xl w-full h-auto transform hover:scale-105 transition-transform duration-500"
                />

                {/* Floating badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold text-gray-800">
                      Chất lượng cao
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Cải thiện thiết kế */}
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
                      className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#C99F4D] ${feature.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}
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

      {/* Types Section - Cải thiện layout */}

      {/* Culture Section - Cải thiện layout */}
      <section className="py-20 bg-gradient-to-br from-amber-50 via-yellow-50/50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Hình ảnh minh họa */}
            <div className="relative order-2 lg:order-1">
              <div className="absolute -top-4 -left-4 w-[500px] h-full bg-gradient-to-br from-amber-200/30 to-yellow-200/30 rounded-2xl transform rotate-3"></div>

              <div className="relative">
                <img
                  src="https://i.pinimg.com/736x/97/c0/40/97c04005f56c05b03838463807b3e7ca.jpg"
                  alt="Hoa tươi rực rỡ"
                  className="rounded-2xl shadow-2xl h-[500px] object-cover transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Nội dung */}
            <div className="space-y-8 order-1 lg:order-2">
              <div>
                <Badge className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200 mb-4 px-4 py-2 font-semibold">
                  Nghệ Thuật Hoa Tươi
                </Badge>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#C99F4D] mb-6">
                  Vẻ Đẹp Và Ý Nghĩa Của Hoa Tươi
                </h2>
              </div>

              <div className="space-y-3">
                <div className="bg-white rounded-2xl p-4 shadow-lg border-l-4 border-[#C99F4D]">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Biểu Tượng Của Niềm Vui
                  </h3>
                  <p className="text-gray-600">
                    Hoa tươi mang đến nguồn năng lượng tích cực, tượng trưng cho
                    niềm vui, sự may mắn và lời chúc tốt đẹp trong mọi dịp đặc
                    biệt.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-lg border-l-4 border-[#8B7355]">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Thông Điệp Tình Cảm
                  </h3>
                  <p className="text-gray-600">
                    Mỗi loài hoa là một câu chuyện, một thông điệp gửi gắm yêu
                    thương, lòng biết ơn hay lời chúc mừng chân thành.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-lg border-l-4 border-[#A67C5A]">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Không Gian Tươi Mới
                  </h3>
                  <p className="text-gray-600">
                    Hương hoa dịu nhẹ giúp tinh thần thư giãn, làm mới không khí
                    và tạo cảm giác an yên cho không gian sống.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button className="bg-gradient-to-r from-[#C99F4D] to-[#B8904A] hover:from-[#B8904A] hover:to-[#A67C42] text-white font-semibold px-6 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <Flower className="h-4 w-4 mr-2" />
                  Khám phá thêm
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-[#C99F4D] text-[#C99F4D] hover:bg-[#C99F4D] hover:text-white font-semibold px-6 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Leaf className="h-4 w-4 mr-2" />
                  Cách chăm sóc
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Care Section - Hoàn toàn mới */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Badge className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200 mb-2 px-4 py-2 font-semibold">
              Hướng Dẫn Chăm Sóc
            </Badge>
            <h3 className="text-3xl md:text-4xl font-bold text-[#C99F4D] mb-2">
              Bí Quyết Giữ Hoa Tươi Lâu
            </h3>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              Làm thế nào để hoa tươi của bạn luôn đẹp và thơm trong suốt buổi
              lễ quan trọng
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-amber-50 to-yellow-50 transform hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#C99F4D] flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <Flower className="h-10 w-10 text-white" />
                  </div>
                  <h5 className="text-xl font-bold text-amber-900 mb-4">
                    Chọn Hoa Tươi
                  </h5>
                  <p className="text-amber-800 leading-relaxed">
                    Chọn hoa có màu sắc tươi mới, cánh hoa không bị dập nát,
                    cuống hoa còn xanh và cứng cáp
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-yellow-50 to-orange-50 transform hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#C99F4D] flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <Leaf className="h-10 w-10 text-white" />
                  </div>
                  <h5 className="text-xl font-bold text-orange-900 mb-4">
                    Bảo Quản Đúng Cách
                  </h5>
                  <p className="text-orange-800 leading-relaxed">
                    Cắm hoa vào nước sạch, để nơi thoáng mát, tránh ánh nắng
                    trực tiếp và gió lớn
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-orange-50 to-amber-50 transform hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#C99F4D] flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <Clock className="h-10 w-10 text-white" />
                  </div>
                  <h5 className="text-xl font-bold text-amber-900 mb-4">
                    Sử Dụng Kịp Thời
                  </h5>
                  <p className="text-amber-800 leading-relaxed">
                    Sử dụng trong ngày để đảm bảo độ tươi tốt nhất và hương thơm
                    tự nhiên
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Additional Tips */}
            <Card className="mt-5 bg-[#C99F4D] text-white border-0 shadow-2xl">
              <CardContent className="p-2">
                <div className="text-center">
                  <Gift className="h-10 w-10 mx-auto mb-2 text-white" />
                  <h4 className="text-xl font-bold mb-2">
                    Mẹo Hay Từ Chuyên Gia
                  </h4>
                  <p className="text-amber-100 text-sm  mx-auto leading-relaxed">
                    Thêm một chút đường vào nước cắm hoa để kéo dài thời gian
                    tươi. Cắt chéo cuống hoa dưới nước chảy để tránh bọt khí làm
                    tắc mạch hoa.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Mới */}

      {/* Products Section - Cải thiện */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200 mb-4 px-4 py-2 font-semibold">
              Sản Phẩm Đặc Biệt
            </Badge>
            <h3 className="text-4xl md:text-4xl font-bold text-[#C99F4D] mb-6">
              Bộ Sưu Tập Hoa Tươi
            </h3>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              Khám phá những sản phẩm hoa tươi đặc biệt, được lựa chọn kỹ lưỡng
              từ những nhà vườn uy tín nhất
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => {
                const productCardProps = {
                  ...product,
                  price: product.basePrice,
                  originalPrice: product.maxPrice,
                  rating: 4.5,
                  reviews: product.reviews?.length || 0,
                  category: "Hoa Tươi",
                  shopId: product.shop?.id || 1,
                  isBestSeller: product.isPopular,
                  isNew: false,
                };
                return (
                  <div
                    key={product.id}
                    className="transform hover:scale-105 transition-transform duration-300"
                  >
                    <ProductCard {...productCardProps} />
                  </div>
                );
              })}
            </div>
          ) : (
            <Card className="max-w-md mx-auto bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
              <CardContent className="text-center py-16">
                <Flower className="h-16 w-16 text-amber-400 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  Đang cập nhật
                </h4>
                <p className="text-gray-600">
                  Sản phẩm mới đang được bổ sung...
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* CTA Section - Cải thiện thiết kế */}

      <Footer />
    </div>
  );
};

export default FlowersCategory;
