import { useState, useEffect } from "react";
import {
  Camera,
  Sparkles,
  Award,
  Heart,
  Star,
  Gift,
  Users,
  CheckCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductCard from "@/components/ProductCard";
import { apiService, Product } from "@/services/apiService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2 } from "lucide-react";
import { getProductImageUrl } from "@/utils/imageUtils";

const PhotoServiceCategory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [allProducts, categories] = await Promise.all([
          apiService.getProducts(),
          apiService.getCategories(),
        ]);

        // Find photo service category
        const photoCategory = categories.find(
          (cat) =>
            cat.name.toLowerCase().includes("chụp ảnh") ||
            cat.name.toLowerCase().includes("photo") ||
            cat.name.toLowerCase().includes("dịch vụ") ||
            cat.name.toLowerCase().includes("service")
        );

        if (photoCategory) {
          const photoProducts = allProducts.filter(
            (product) => product.productCategoryId === photoCategory.id
          );
          setProducts(photoProducts);
        } else {
          // If no photo category found, filter by name
          const photoProducts = allProducts.filter(
            (product) =>
              product.name.toLowerCase().includes("chụp ảnh") ||
              product.name.toLowerCase().includes("photo") ||
              product.name.toLowerCase().includes("dịch vụ")
          );
          setProducts(photoProducts);
        }
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
          <p className="text-muted-foreground">Đang tải dịch vụ...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Không thể tải dịch vụ</p>
          <Button onClick={() => window.location.reload()}>Thử lại</Button>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: Camera,
      title: "Chụp Ảnh Chuyên Nghiệp",
      description:
        "Đội ngũ nhiếp ảnh gia giàu kinh nghiệm, trang thiết bị hiện đại đảm bảo chất lượng ảnh cao nhất",
      gradient: "from-amber-400 to-yellow-500",
    },
    {
      icon: Sparkles,
      title: "Chỉnh Sửa Đẹp Mắt",
      description:
        "Hậu kỳ chuyên nghiệp, chỉnh sửa ảnh theo yêu cầu để lưu giữ những khoảnh khắc đẹp nhất",
      gradient: "from-orange-400 to-amber-500",
    },
    {
      icon: Heart,
      title: "Lưu Giữ Kỷ Niệm",
      description:
        "Ghi lại trọn vẹn những khoảnh khắc đáng nhớ trong ngày lễ tốt nghiệp quan trọng của bạn",
      gradient: "from-yellow-400 to-orange-500",
    },
    {
      icon: Award,
      title: "Chất Lượng Cao",
      description:
        "Cam kết chất lượng ảnh cao, giao hàng đúng hẹn với giá cả hợp lý nhất",
      gradient: "from-amber-400 to-yellow-500",
    },
  ];

  const serviceTypes = [
    {
      name: "Chụp Ảnh Lễ Tốt Nghiệp",
      description: "Dịch vụ chụp ảnh trọn gói cho lễ tốt nghiệp",
      image:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      benefits: [
        "Chụp tại hiện trường",
        "Chỉnh sửa chuyên nghiệp",
        "Album ảnh kỹ thuật số",
      ],
      price: "1.500.000đ - 3.000.000đ",
      popular: true,
    },
    {
      name: "Chụp Ảnh Gia Đình",
      description: "Lưu giữ khoảnh khắc cùng gia đình trong ngày đặc biệt",
      image:
        "https://images.unsplash.com/photo-1511988617509-a57c8a288659?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      benefits: [
        "Album gia đình",
        "Ảnh chỉnh sửa cao cấp",
        "Nhận ảnh trong 3-5 ngày",
      ],
      price: "800.000đ - 1.500.000đ",
      popular: false,
    },
    {
      name: "Quay Video Lễ Nghiệp",
      description: "Quay phim kỷ yếu, video lễ tốt nghiệp chất lượng cao",
      image:
        "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      benefits: [
        "Video Full HD 4K",
        "Biên tập chuyên nghiệp",
        "Nhạc nền theo yêu cầu",
      ],
      price: "2.000.000đ - 5.000.000đ",
      popular: true,
    },
  ];

  const occasions = [
    {
      title: "Lễ Tốt Nghiệp",
      description: "Chụp ảnh kỷ yếu và lễ tốt nghiệp",
      services: [
        "Chụp ảnh lễ tốt nghiệp",
        "Quay video kỷ yếu",
        "Album kỷ niệm",
        "Chỉnh sửa ảnh chuyên nghiệp",
      ],
      color: "bg-amber-50",
      textColor: "text-amber-800",
      icon: Camera,
      borderColor: "border-amber-200",
    },
    {
      title: "Lễ Cúng Tổ Tiên",
      description: "Ghi lại khoảnh khắc trang trọng",
      services: [
        "Chụp ảnh mâm cúng",
        "Quay video nghi lễ",
        "Album gia đình",
        "Chỉnh sửa theo yêu cầu",
      ],
      color: "bg-amber-50",
      textColor: "text-amber-800",
      icon: Heart,
      borderColor: "border-amber-200",
    },
    {
      title: "Sự Kiện Đặc Biệt",
      description: "Dịch vụ chụp ảnh cho mọi dịp quan trọng",
      services: [
        "Chụp ảnh sự kiện",
        "Quay phim ngắn",
        "Album kỷ niệm",
        "Dịch vụ trọn gói",
      ],
      color: "bg-amber-50",
      textColor: "text-amber-800",
      icon: Gift,
      borderColor: "border-amber-200",
    },
  ];

  const testimonials = [
    {
      name: "Chị Minh Anh",
      role: "Phụ huynh học sinh",
      content:
        "Dịch vụ chụp ảnh rất chuyên nghiệp, ảnh đẹp và chỉnh sửa rất tỉ mỉ. Gia đình tôi rất hài lòng!",
      rating: 5,
    },
    {
      name: "Anh Đức Minh",
      role: "Sinh viên",
      content:
        "Ảnh kỷ yếu rất đẹp, giá cả hợp lý và giao hàng đúng hẹn. Sẽ giới thiệu cho bạn bè!",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-yellow-50/30">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50/50 to-orange-50/5">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-200/30 to-yellow-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-orange-200/30 to-amber-200/30 rounded-full blur-xl"></div>

        <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200 text-sm py-2 px-6 font-semibold shadow-md hover:shadow-lg transition-all duration-300">
                  ✨ Dịch Vụ Chụp Ảnh Chuyên Nghiệp ✨
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-[#C99F4D] to-[#D4AF37] bg-clip-text text-transparent">
                    Chụp Ảnh Lễ
                  </span>
                  <br />
                </h1>
                <p className="text-xl text-gray-700 leading-relaxed max-w-xl">
                  Lưu giữ những khoảnh khắc đáng nhớ nhất trong ngày tốt nghiệp
                  của bạn với dịch vụ chụp ảnh và quay video chuyên nghiệp, chất
                  lượng cao.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#C99F4D] to-[#B8904A] hover:from-[#B8904A] hover:to-[#A67C42] text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-semibold"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  Xem Dịch Vụ
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
                  <div className="text-2xl font-bold text-[#C99F4D]">10+</div>
                  <div className="text-sm text-gray-600">Năm kinh nghiệm</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#C99F4D]">5K+</div>
                  <div className="text-sm text-gray-600">
                    Khách hàng hài lòng
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#C99F4D]">100%</div>
                  <div className="text-sm text-gray-600">
                    Cam kết chất lượng
                  </div>
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
                  src="https://naribabystudio.com/wp-content/uploads/2022/06/IMG_1314-1024x740.jpg"
                  alt="Dịch vụ chụp ảnh lễ tốt nghiệp"
                  className="relative rounded-3xl shadow-2xl w-full h-auto transform hover:scale-105 transition-transform duration-500"
                />

                {/* Floating badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold text-gray-800">
                      Chuyên nghiệp
                    </span>
                  </div>
                </div>
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
              Chúng tôi cam kết mang đến dịch vụ chụp ảnh chuyên nghiệp nhất với
              chất lượng cao nhất cho những khoảnh khắc quan trọng của bạn
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
                      className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}
                    >
                      <IconComponent className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="font-bold text-xl text-gray-800 mb-4 transition-colors">
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200 mb-4 px-5 py-2 font-semibold tracking-wide shadow-sm">
              Theo Từng Dịp Lễ
            </Badge>
            <h2 className="text-4xl font-bold text-[#C99F4D] mb-4">
              Dịch Vụ Theo Dịp
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Mỗi dịp lễ có những yêu cầu riêng, chúng tôi cung cấp dịch vụ phù
              hợp cho từng trường hợp
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {occasions.map((occasion, index) => (
              <Card
                key={index}
                className="border-amber-200 bg-white shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 rounded-2xl"
              >
                <div
                  className={`p-6 ${occasion.color} border-b ${occasion.borderColor}`}
                >
                  <Badge className="bg-[#FCE7A2] text-[#8B5E00] hover:bg-[#FCE7A2] hover:text-[#8B5E00] mb-3 py-1.5 px-3 font-medium text-xs uppercase tracking-wide">
                    {occasion.title}
                  </Badge>
                  <h3 className="text-xl font-semibold text-[#C99F4D] mb-1">
                    {occasion.description}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Giá từ{" "}
                    <span className="font-bold text-[#B7791F]">800.000₫</span>
                  </p>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    {occasion.services.map((service, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 rounded-lg bg-amber-50/50 hover:bg-amber-100 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#C99F4D] flex items-center justify-center flex-shrink-0 shadow-sm">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-gray-700 font-medium">
                          {service}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-6 bg-[#C99F4D] text-white border-[#C99F4D] hover:bg-[#B88A3E] hover:border-[#B88A3E] font-semibold py-3 transition-all duration-300 rounded-xl"
                  >
                    Xem chi tiết
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 via-yellow-50/50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute -top-4 -left-4 w-[500px] h-full bg-gradient-to-br from-amber-200/30 to-yellow-200/30 rounded-2xl transform rotate-3"></div>

              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Quy trình chụp ảnh chuyên nghiệp"
                  className="rounded-2xl shadow-2xl h-[500px] object-cover transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            <div className="space-y-8 order-1 lg:order-2">
              <div>
                <Badge className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200 mb-4 px-4 py-2 font-semibold">
                  Quy Trình Làm Việc
                </Badge>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#C99F4D] mb-6">
                  Cách Chúng Tôi Làm Việc
                </h2>
              </div>

              <div className="space-y-3">
                <div className="bg-white rounded-2xl p-4 shadow-lg border-l-4 border-[#C99F4D]">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Tư Vấn & Đặt Lịch
                  </h3>
                  <p className="text-gray-600">
                    Chúng tôi sẽ tư vấn và lên kế hoạch chụp ảnh phù hợp với nhu
                    cầu và ngân sách của bạn.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-lg border-l-4 border-[#8B7355]">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Chụp Ảnh Chuyên Nghiệp
                  </h3>
                  <p className="text-gray-600">
                    Đội ngũ nhiếp ảnh gia sẽ chụp ảnh tại hiện trường với trang
                    thiết bị hiện đại nhất.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-lg border-l-4 border-[#A67C5A]">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Chỉnh Sửa & Giao Hàng
                  </h3>
                  <p className="text-gray-600">
                    Hậu kỳ chuyên nghiệp và giao hàng đúng hẹn. Bạn sẽ nhận được
                    album ảnh chất lượng cao.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button className="bg-gradient-to-r from-[#C99F4D] to-[#B8904A] hover:from-[#B8904A] hover:to-[#A67C42] text-white font-semibold px-6 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <Camera className="h-4 w-4 mr-2" />
                  Đặt dịch vụ ngay
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-[#C99F4D] text-[#C99F4D] hover:bg-[#C99F4D] hover:text-white font-semibold px-6 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Xem portfolio
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200 mb-4 px-4 py-2 font-semibold">
              Sản Phẩm Đặc Biệt
            </Badge>
            <h3 className="text-4xl md:text-4xl font-bold text-[#C99F4D] mb-6">
              Bộ Sưu Tập Dịch Vụ
            </h3>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              Khám phá các gói dịch vụ chụp ảnh đặc biệt, được thiết kế riêng
              cho từng dịp lễ quan trọng
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => {
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
                  category: "Chụp Ảnh Lễ",
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
                <Camera className="h-16 w-16 text-amber-400 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  Đang cập nhật
                </h4>
                <p className="text-gray-600">
                  Dịch vụ mới đang được bổ sung...
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50/50 via-yellow-50/30 to-orange-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200 mb-4 px-4 py-2 font-semibold">
              Khách Hàng Nói Gì
            </Badge>
            <h3 className="text-4xl md:text-4xl font-bold text-[#C99F4D] mb-6">
              Đánh Giá Từ Khách Hàng
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="hover:shadow-xl transition-all duration-300 border-amber-200 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-500 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PhotoServiceCategory;
