import { useState, useEffect } from "react";
import {
  Apple,
  Leaf,
  Heart,
  Star,
  Shield,
  Award,
  ArrowRight,
  Flower,
  Clock,
  Snowflake,
  Gift,
  Lightbulb,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductCard from "@/components/ProductCard";
import { apiService, Product } from "@/services/apiService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import fruitsHeroImage from "@/assets/flowers-hero.jpg"; // Sẽ thay bằng ảnh hoa quả
import fruitsBannerImage from "@/assets/traditional-flowers.jpg"; // Sẽ thay bằng ảnh hoa quả truyền thống

const FruitsCategory = () => {
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

        // Find fruit category
        const fruitCategory = categories.find(
          (cat) =>
            cat.name.toLowerCase().includes("hoa quả") ||
            cat.name.toLowerCase().includes("trái cây") ||
            cat.name.toLowerCase().includes("fruit")
        );

        if (fruitCategory) {
          const fruitProducts = allProducts.filter(
            (product) => product.productCategoryId === fruitCategory.id
          );
          setProducts(fruitProducts);
        } else {
          // If no fruit category found, filter by name containing fruit keywords
          const fruitProducts = allProducts.filter(
            (product) =>
              product.name.toLowerCase().includes("quả") ||
              product.name.toLowerCase().includes("trái cây") ||
              product.name.toLowerCase().includes("fruit")
          );
          setProducts(fruitProducts);
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

  const features = [
    {
      icon: Apple,
      title: "Hoa Quả Tươi Ngon",
      description:
        "Hoa quả được chọn lọc từ những vườn cây uy tín, thu hoạch đúng độ chín tối ưu để đảm bảo hương vị tốt nhất",
      gradient: "from-[#C99F4D] to-[#8B7355]",
    },
    {
      icon: Shield,
      title: "An Toàn Tuyệt Đối",
      description:
        "Không sử dụng chất bảo quản độc hại, quy trình sản xuất theo tiêu chuẩn VietGAP, an toàn cho cả gia đình",
      gradient: "from-[#8B7355] to-[#A67C5A]",
    },
    {
      icon: Heart,
      title: "Ý Nghĩa Tâm Linh",
      description:
        "Mang lại sức khỏe dồi dào, may mắn trong học tập và thành công trong công việc theo phong thủy truyền thống",
      gradient: "from-[#A67C5A] to-[#C99F4D]",
    },
    {
      icon: Award,
      title: "Chất Lượng Xuất Khẩu",
      description:
        "Đạt tiêu chuẩn xuất khẩu quốc tế, được kiểm định chất lượng nghiêm ngặt bởi các tổ chức uy tín",
      gradient: "from-[#C99F4D] to-[#8B7355]",
    },
  ];

  const fruitTypes = [
    {
      name: "Cam Sành Cao Cấp",
      description: "Cam sành ngọt thanh, giàu vitamin C",
      image:
        "https://bizweb.dktcdn.net/thumb/grande/100/390/808/products/unnamed-2.jpg?v=1592642521770",
      benefits: [
        "Giàu vitamin C tự nhiên",
        "Tăng cường miễn dịch",
        "Ý nghĩa may mắn thịnh vượng",
      ],
      price: "80.000đ - 150.000đ",
      popular: true,
    },
    {
      name: "Táo Fuji Nhật Bản",
      description: "Táo Fuji nhập khẩu, giòn ngọt, thơm mát tự nhiên",
      image:
        "https://tfruit.com.vn/wp-content/uploads/2019/08/t%C3%A1o-fuji-m%E1%BB%B9.jpg",
      benefits: ["Chất lượng cao cấp", "Giòn ngọt tự nhiên", "Bổ sung chất xơ"],
      price: "200.000đ - 350.000đ",
      popular: true,
    },
    {
      name: "Xoài Cát Hòa Lộc",
      description: "Xoài cát Hòa Lộc đặc sản, thịt dày, ngọt đậm đà",
      image:
        "https://bizweb.dktcdn.net/thumb/1024x1024/100/482/702/products/xoai-cat-hoa-loc-03.jpg?v=1750920195250",
      benefits: ["Đặc sản miền Tây", "Thịt dày ngọt đậm", "Giàu vitamin A"],
      price: "120.000đ - 280.000đ",
      popular: false,
    },
  ];
  const testimonials = [
    {
      name: "Chị Thu Hà",
      role: "Khách hàng thân thiết",
      content:
        "Trái cây ở đây luôn tươi giòn và ngọt tự nhiên. Tôi rất yên tâm khi đặt cho cả gia đình!",
      rating: 5,
    },
    {
      name: "Anh Hoàng Nam",
      role: "Nhân viên văn phòng",
      content:
        "Giao hàng nhanh, đóng gói cẩn thận, trái cây chất lượng vượt mong đợi. Rất đáng tiền!",
      rating: 5,
    },
  ];

  const occasions = [
    {
      title: "Cúng Tổ Tiên",
      description: "Hoa quả thể hiện lòng thành kính với tổ tiên",
      fruits: [
        "Cam sành vàng",
        "Táo đỏ tươi",
        "Xoài cát chín",
        "Chuối tiêu hương",
      ],
      color: "bg-gradient-to-br from-[#C99F4D]/10 to-[#8B7355]/10",
      textColor: "text-[#8B7355]",
      icon: Heart,
      borderColor: "border-[#C99F4D]/20",
    },
    {
      title: "Lễ Tốt Nghiệp",
      description: "Hoa quả mang lại sức khỏe và thành công",
      fruits: [
        "Táo đỏ may mắn",
        "Cam ngọt thành công",
        "Nho xanh thịnh vượng",
        "Lê vàng tài lộc",
      ],
      color: "bg-gradient-to-br from-[#8B7355]/10 to-[#A67C5A]/10",
      textColor: "text-[#C99F4D]",
      icon: Star,
      borderColor: "border-[#8B7355]/20",
    },
    {
      title: "Cúng Thần Tài",
      description: "Hoa quả vàng mang lại tài lộc phát đạt",
      fruits: [
        "Cam vàng thịnh vượng",
        "Xoài vàng tài lộc",
        "Chuối vàng may mắn",
        "Đu đủ vàng phát tài",
      ],
      color: "bg-gradient-to-br from-[#A67C5A]/10 to-[#C99F4D]/10",
      textColor: "text-[#8B7355]",
      icon: Gift,
      borderColor: "border-[#A67C5A]/20",
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section - Modern & Bold */}
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
                    Hoa - Quả Dành Cho
                  </span>
                  <br />
                  <span className="text-[#B8904A]">Mâm Cúng</span>
                </h1>
                <p className="text-xl text-gray-700 leading-relaxed max-w-xl">
                  Mỗi loại trái cây đều được tuyển chọn cẩn thận từ những nhà
                  vườn uy tín, mang thông điệp về sức khỏe, may mắn và thịnh
                  vượng cho ngày lễ tốt nghiệp đầy ý nghĩa của bạn.
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
                  src="https://i.pinimg.com/1200x/33/22/29/33222903e54dbadc4cb7dd0a38307095.jpg"
                  alt="Hoa tươi cao cấp cho lễ tốt nghiệp"
                  className="relative rounded-3xl shadow-2xl w-full h-auto transform hover:scale-105 transition-transform duration-500"
                />

                {/* Floating badge */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-2xl">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#C99F4D]">
                      800+
                    </div>
                    <div className="text-gray-600 font-medium">
                      Khách hàng hài lòng
                    </div>
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

      <section className="py-20 bg-gradient-to-br from-amber-50 via-yellow-50/50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-[600px] h-full bg-gradient-to-br from-amber-200/30 to-yellow-200/30 rounded-2xl transform rotate-3"></div>
              {/* <div className="absolute -bottom-4 -right-4 w-full h-full bg-gradient-to-br from-orange-200/30 to-amber-200/30 rounded-2xl transform -rotate-2"></div> */}

              <div className="relative">
                <img
                  src="https://i.pinimg.com/1200x/3e/b3/b3/3eb3b3b0dc81525a87c702297b0e315e.jpg"
                  alt="Hoa tươi truyền thống"
                  className="rounded-2xl shadow-2xl h-[500px] transform hover:scale-105 transition-transform duration-500"
                />

                {/* Floating elements */}
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <span className="text-sm font-semibold text-gray-800">
                      Tươi mỗi ngày
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8 order-1 lg:order-2">
              <div>
                <Badge className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200 mb-4 px-4 py-2 font-semibold">
                  Văn Hóa Truyền Thống
                </Badge>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#C99F4D] mb-6 whitespace-nowrap">
                  Ý Nghĩa Trái Cây Trong Lễ Tốt Nghiệp
                </h2>
              </div>

              <div className="space-y-3">
                <div className="bg-white rounded-2xl p-4 shadow-lg border-l-4 border-[#C99F4D]">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Biểu Tượng Sức Khỏe
                  </h3>
                  <p className="text-gray-600">
                    Trái cây tươi ngon thể hiện sức khỏe dồi dào, năng lượng
                    tích cực và tinh thần tươi mới cho hành trình mới sau khi
                    tốt nghiệp.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-lg border-l-4 border-[#8B7355]">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    May Mắn Và Thành Công
                  </h3>
                  <p className="text-gray-600">
                    Màu sắc rực rỡ của các loại trái cây mang đến may mắn, thành
                    công và sự thịnh vượng trong con đường phía trước.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-lg border-l-4 border-[#A67C5A]">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Lòng Biết Ơn
                  </h3>
                  <p className="text-gray-600">
                    Dâng mâm trái cây là cách thể hiện lòng biết ơn sâu sắc đến
                    tổ tiên, thầy cô và gia đình — những người luôn đồng hành
                    trong quá trình học tập.
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
                  Cách bảo quản trái cây
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Culture & Meaning Section */}

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Badge className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200 mb-2 px-4 py-2 font-semibold">
              Hướng Dẫn Bảo Quản
            </Badge>
            <h3 className="text-3xl md:text-4xl font-bold text-[#C99F4D] mb-2">
              Bí Quyết Giữ Trái Cây Tươi Lâu
            </h3>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              Giữ cho trái cây của bạn luôn tươi ngon, mọng nước và giữ được
              hương vị tự nhiên cho những dịp lễ quan trọng.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Card 1 */}
              <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-amber-50 to-yellow-50 transform hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#C99F4D] flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <Apple className="h-10 w-10 text-white" />
                  </div>
                  <h5 className="text-xl font-bold text-amber-900 mb-4">
                    Chọn Trái Cây Tươi
                  </h5>
                  <p className="text-amber-800 leading-relaxed">
                    Ưu tiên trái cây có vỏ căng bóng, không dập nát, màu sắc
                    tươi tự nhiên và có mùi thơm đặc trưng.
                  </p>
                </CardContent>
              </Card>

              {/* Card 2 */}
              <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-yellow-50 to-orange-50 transform hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#C99F4D] flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <Snowflake className="h-10 w-10 text-white" />
                  </div>
                  <h5 className="text-xl font-bold text-orange-900 mb-4">
                    Bảo Quản Đúng Nhiệt Độ
                  </h5>
                  <p className="text-orange-800 leading-relaxed">
                    Giữ trái cây ở nơi thoáng mát hoặc trong ngăn mát tủ lạnh.
                    Không rửa trước khi bảo quản để tránh ẩm mốc.
                  </p>
                </CardContent>
              </Card>

              {/* Card 3 */}
              <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-orange-50 to-amber-50 transform hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#C99F4D] flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <Clock className="h-10 w-10 text-white" />
                  </div>
                  <h5 className="text-xl font-bold text-amber-900 mb-4">
                    Sử Dụng Đúng Thời Điểm
                  </h5>
                  <p className="text-amber-800 leading-relaxed">
                    Dùng trái cây trong vòng 3–5 ngày sau khi mua để đảm bảo độ
                    tươi ngon và giữ trọn hương vị tự nhiên nhất.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Additional Tips */}
            <Card className="mt-8 bg-gradient-to-r from-[#C99F4D] to-[#B8904A] text-white border-0 shadow-2xl rounded-3xl">
              <CardContent className="p-2 text-center">
                <div className="flex justify-center mb-4">
                  <Lightbulb className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-2xl font-semibold mb-2 tracking-wide">
                  Mẹo Hay Từ Chuyên Gia
                </h4>
                <p className="text-amber-100 text-sm  mx-auto leading-relaxed">
                  Ngâm trái cây trong nước muối loãng khoảng 5 phút trước khi ăn
                  để loại bỏ vi khuẩn. Tránh để táo, chuối, lê gần nhau vì khí
                  ethylene sẽ làm chín nhanh hơn.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Products Showcase */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200 mb-4 px-4 py-2 font-semibold">
              Sản Phẩm Đặc Biệt
            </Badge>
            <h3 className="text-4xl md:text-4xl font-bold text-[#C99F4D] mb-6">
              Hoa Quả Đặc Biệt
            </h3>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              Khám phá bộ sưu tập hoa quả được lựa chọn kỹ lưỡng từ những vườn
              cây uy tín nhất
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
                  category: "Hoa Quả",
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
      <section className="py-20 bg-gradient-to-br from-amber-50/50 via-yellow-50/30 to-orange-50/50">
        <div className="container mx-auto px-4">
          {/* Tiêu đề */}
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200 mb-4 px-4 py-2 font-semibold">
              Khách Hàng Nói Gì
            </Badge>
            <h3 className="text-4xl md:text-4xl font-bold text-[#C99F4D] mb-6">
              Đánh Giá Về Trái Cây Tươi
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Những chia sẻ chân thật từ khách hàng đã thưởng thức hương vị ngọt
              lành và tươi mới từ cửa hàng trái cây của chúng tôi.
            </p>
          </div>

          {/* Danh sách đánh giá */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="hover:shadow-xl transition-all duration-300 border-amber-200 bg-white/80 backdrop-blur-sm rounded-2xl"
              >
                <CardContent className="p-8">
                  {/* Đánh giá sao */}
                  <div className="flex items-center mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-500 fill-current"
                      />
                    ))}
                  </div>

                  {/* Nội dung đánh giá */}
                  <p className="text-gray-700 italic mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>

                  {/* Thông tin khách hàng */}
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

export default FruitsCategory;
