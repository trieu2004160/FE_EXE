import { useState, useEffect } from "react";
import {
  Soup,
  Utensils,
  Gift,
  Clock,
  Flower,
  Leaf,
  Heart,
  Star,
  ChefHat,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductCard from "@/components/ProductCard";
import { getProductsByCategory, Product } from "@/data/mockData";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const XoiCheCategory = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const xoiCheProducts = getProductsByCategory("Xôi – Chè");
    setProducts(xoiCheProducts);
  }, []);

  const features = [
    {
      icon: Soup,
      title: "Xôi Chè Truyền Thống",
      description: "Được làm theo công thức gia truyền của Việt Nam",
    },
    {
      icon: Utensils,
      title: "Chế Biến Tươi Ngon",
      description: "Chế biến tại chỗ, đảm bảo độ tươi và chất lượng",
    },
    {
      icon: Heart,
      title: "Ý Nghĩa Cúng Dường",
      description: "Mang lại sự viên mãn và may mắn trong học tập",
    },
    {
      icon: Star,
      title: "Nguyên Liệu Tự Nhiên",
      description: "Sử dụng nguyên liệu tự nhiên, không chất bảo quản",
    },
  ];

  const xoiCheTypes = [
    {
      name: "Xôi Nước Cốt Dừa",
      description: "Xôi nước cốt dừa thơm béo, vị ngọt đậm đà",
      image:
        "https://dienmaythucpham.com/wp-content/uploads/2023/11/xoi-la-dua-5.jpg",
      benefits: ["Thơm béo", "Vị ngọt đậm đà", "Bổ dưỡng"],
      price: "25.000đ",
    },
    {
      name: "Chè Đậu Xanh",
      description: "Chè đậu xanh mềm mịn, thanh mát và bổ dưỡng",
      image:
        "https://i.pinimg.com/1200x/9d/f8/a0/9df8a0841bdb31f465e4480953f1a061.jpg",
      benefits: ["Mềm mịn", "Thanh mát", "Giàu dinh dưỡng"],
      price: "20.000đ",
    },
    {
      name: "Xôi Đậu Phộng",
      description: "Xôi đậu phộng giòn tan, thơm nức mũi",
      image:
        "https://i.pinimg.com/736x/9b/0a/78/9b0a783b13fbae78dadf662ae1515421.jpg",
      benefits: ["Giòn tan", "Thơm nức", "Dẻo ngon"],
      price: "22.000đ",
    },
  ];

  const occasions = [
    {
      title: "Cúng Tổ Tiên",
      description: "Xôi chè thể hiện lòng thành kính",
      flowers: ["Xôi trắng", "Chè đậu xanh", "Xôi gấc", "Chè ba màu"],
      color: "bg-amber-100 text-amber-800",
    },
    {
      title: "Lễ Tốt Nghiệp",
      description: "Xôi chè mang lại sự viên mãn",
      flowers: [
        "Xôi nước cốt dừa",
        "Chè thái",
        "Xôi đậu phộng",
        "Chè khoai môn",
      ],
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      title: "Cúng Thần Tài",
      description: "Xôi chè mang lại may mắn tài lộc",
      flowers: ["Xôi vàng", "Chè vàng", "Xôi đỗ xanh", "Chè bưởi"],
      color: "bg-amber-100 text-amber-800",
    },
  ];
  const testimonials = [
    {
      name: "Cô Lan Phương",
      role: "Khách hàng thân thiết",
      content:
        "Xôi rất dẻo, thơm và nóng hổi. Ăn buổi sáng là no đến trưa, vị mặn ngọt vừa phải, rất đáng tiền!",
      rating: 5,
    },
    {
      name: "Anh Quốc Huy",
      role: "Nhân viên văn phòng",
      content:
        "Xôi gà ngon tuyệt, da gà giòn và nước mắm chấm đậm đà. Phục vụ nhanh, đóng gói cẩn thận.",
      rating: 5,
    },
  ];

  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50/50 to-orange-50/5">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-24 h-32 bg-gradient-to-br from-amber-200/30 to-yellow-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-20 h-40 bg-gradient-to-br from-orange-200/30 to-amber-200/30 rounded-full blur-xl"></div>

        <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200 text-sm py-2 px-6 font-semibold shadow-md hover:shadow-lg transition-all duration-300">
                  ✨ Bộ Sưu Tập Hoa Tươi Cao Cấp ✨
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-[#C99F4D] to-[#D4AF37] bg-clip-text text-transparent">
                    Xôi Dành Cho
                  </span>
                  <br />
                  <span className="text-[#B8904A]">Lễ Tốt Nghiệp</span>
                </h1>
                <p className="text-xl text-gray-700 leading-relaxed max-w-xl">
                  Mỗi món xôi chè được chế biến tươi ngon, mang ý nghĩa viên mãn
                  và may mắn cho những dịp quan trọng của bạn
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
                  <div className="text-2xl font-bold text-[#C99F4D]">10+</div>
                  <div className="text-sm text-gray-600">
                    Năm kinh nghiệm nấu xôi
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#C99F4D]">20K+</div>
                  <div className="text-sm text-gray-600">
                    Khách hàng hài lòng
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#C99F4D]">100%</div>
                  <div className="text-sm text-gray-600">
                    Nguyên liệu tự nhiên
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-100/40 to-orange-100/40 rounded-3xl transform rotate-3 scale-10"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-yellow-100/40 to-amber-100/40 rounded-3xl transform -rotate-2 scale-10"></div>

              {/* Main image */}
              <div className="relative">
                <img
                  src="https://i.pinimg.com/1200x/94/3b/13/943b13b49e0c4bd0a79ffbbb30b3e984.jpg"
                  alt="Hoa tươi cao cấp cho lễ tốt nghiệp"
                  className="relative rounded-3xl shadow-2xl w-[500px] h-[550px] ml-28 transform hover:scale-105 transition-transform duration-500"
                />

                {/* Floating badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg mr-6">
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
              Xôi Ngon – Tinh Hoa Truyền Thống
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
              Chúng tôi mang đến những phần xôi thơm ngon, dẻo mềm và đậm đà
              hương vị Việt, được làm từ nguyên liệu tuyển chọn và công thức gia
              truyền.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Star,
                title: "Nguyên Liệu Tuyển Chọn",
                description:
                  "Chúng tôi chỉ sử dụng nếp cái hoa vàng và nguyên liệu tươi mới từ những nhà cung cấp uy tín.",
              },
              {
                icon: Heart,
                title: "Hương Vị Truyền Thống",
                description:
                  "Giữ trọn vị xôi truyền thống Việt Nam qua từng hạt nếp, hòa quyện cùng nước cốt dừa béo thơm.",
              },
              {
                icon: Clock,
                title: "Luôn Tươi Mới Mỗi Ngày",
                description:
                  "Xôi được nấu mới mỗi sáng, đảm bảo luôn nóng hổi và thơm ngon khi đến tay khách hàng.",
              },
              {
                icon: Gift,
                title: "Phục Vụ Tận Tâm",
                description:
                  "Giao hàng nhanh chóng, đóng gói cẩn thận và phục vụ với nụ cười chân thành.",
              },
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card
                  key={index}
                  className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-amber-50/30 hover:from-amber-50 hover:to-yellow-50 transform hover:-translate-y-2"
                >
                  <CardContent className="p-8 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#C99F4D] flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
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

      {/* Types Section */}
      <section className="py-20 bg-gradient-to-b ">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-[#FCE7A2] text-[#8B5E00] border-none mb-4 px-5 py-2 font-semibold tracking-wide shadow-sm">
              Theo Từng Dịp Lễ
            </Badge>
            <h2 className="text-4xl font-bold text-[#C99F4D] mb-4">
              Xôi Theo Dịp
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Mỗi dịp lễ có những món xôi chè mang ý nghĩa riêng, thể hiện lòng
              biết ơn, hạnh phúc và may mắn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {occasions.map((occasion, index) => (
              <Card
                key={index}
                className="border-amber-200 bg-white shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 rounded-2xl"
              >
                <div className="p-6 bg-amber-50 border-b border-amber-200">
                  <Badge className="bg-[#FCE7A2] text-[#8B5E00] hover:bg-[#FCE7A2] hover:text-[#8B5E00] mb-3 py-1.5 px-3 font-medium text-xs uppercase tracking-wide">
                    {occasion.title}
                  </Badge>
                  <h3 className="text-xl font-semibold text-[#C99F4D] mb-1">
                    {occasion.description}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Giá từ{" "}
                    <span className="font-bold text-[#B7791F]">120.000₫</span>
                  </p>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    {occasion.flowers.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 rounded-lg bg-amber-50/50 hover:bg-amber-100 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#C99F4D] flex items-center justify-center flex-shrink-0 shadow-sm">
                          <Leaf className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-gray-700 font-medium">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-6 border-[#C99F4D] text-[#C99F4D] hover:bg-[#C99F4D] hover:text-white font-semibold py-3 transition-all duration-300 rounded-xl"
                  >
                    Xem thêm món xôi chè
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Occasions Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 via-yellow-50/50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Hình ảnh minh họa */}
            <div className="relative order-2 lg:order-1">
              {/* Hiệu ứng nền */}
              <div className="absolute -top-4 -left-4 w-[500px] h-full bg-gradient-to-br from-amber-200/30 to-yellow-200/30 rounded-2xl transform rotate-3"></div>
              {/* <div className="absolute -bottom-4 -right-4 w-[500px] h-full bg-gradient-to-br from-orange-200/30 to-amber-200/30 rounded-2xl transform -rotate-2"></div> */}

              <div className="relative">
                <img
                  src="https://i.pinimg.com/1200x/a2/82/d6/a282d6c7ed0ee2fbf9a57f6aaa6855dc.jpg"
                  alt="Xôi truyền thống"
                  className="rounded-2xl shadow-2xl h-[600px] transform hover:scale-105 transition-transform duration-500"
                />

                {/* Thẻ nổi */}
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <span className="text-sm font-semibold text-gray-800">
                      Ấm áp mỗi ngày
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Nội dung */}
            <div className="space-y-8 order-1 lg:order-2">
              <div>
                <Badge className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200 mb-4 px-4 py-2 font-semibold">
                  Ẩm Thực Truyền Thống
                </Badge>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#C99F4D] mb-6 whitespace-nowrap">
                  Ý Nghĩa Món Xôi Trong Lễ Tốt Nghiệp
                </h2>
              </div>

              <div className="space-y-3">
                <div className="bg-white rounded-2xl p-4 shadow-lg border-l-4 border-[#C99F4D]">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Biểu Tượng No Đủ
                  </h3>
                  <p className="text-gray-600">
                    Xôi là biểu tượng cho sự no ấm, đủ đầy và sung túc — cầu
                    chúc cho người tốt nghiệp có cuộc sống viên mãn phía trước.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-lg border-l-4 border-[#8B7355]">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    May Mắn & Thành Công
                  </h3>
                  <p className="text-gray-600">
                    Hạt nếp dẻo quện tượng trưng cho sự gắn kết, may mắn và bền
                    bỉ — những yếu tố cần thiết trên con đường lập nghiệp.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-lg border-l-4 border-[#A67C5A]">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Lòng Biết Ơn
                  </h3>
                  <p className="text-gray-600">
                    Món xôi dâng trong lễ tốt nghiệp thể hiện lòng biết ơn với
                    ông bà, cha mẹ và thầy cô đã nuôi dưỡng, dạy dỗ nên người.
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
                  Cách nấu xôi ngon
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Badge className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200 mb-2 px-4 py-2 font-semibold">
              Hướng Dẫn Chế Biến
            </Badge>
            <h3 className="text-3xl md:text-4xl font-bold text-[#C99F4D] mb-2">
              Bí Quyết Nấu Xôi Truyền Thống Ngon
            </h3>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              Những mẹo nhỏ giúp bạn nấu được nồi xôi dẻo thơm, vàng óng và đậm
              đà hương vị quê hương.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-amber-50 to-yellow-50 transform hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#C99F4D] flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <Utensils className="h-10 w-10 text-white" />
                  </div>
                  <h5 className="text-xl font-bold text-amber-900 mb-4">
                    Chọn Nếp Ngon
                  </h5>
                  <p className="text-amber-800 leading-relaxed">
                    Chọn nếp mới, hạt tròn đều, thơm nhẹ. Tránh nếp bị mốc hay
                    khô để xôi chín dẻo và bóng mượt.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-yellow-50 to-orange-50 transform hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#C99F4D] flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <Soup className="h-10 w-10 text-white" />
                  </div>
                  <h5 className="text-xl font-bold text-orange-900 mb-4">
                    Ngâm & Hấp Đúng Cách
                  </h5>
                  <p className="text-orange-800 leading-relaxed">
                    Ngâm nếp từ 6–8 tiếng, để ráo và hấp bằng xửng có lót lá
                    chuối. Giữ lửa đều giúp xôi chín dẻo và không bị nát.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-orange-50 to-amber-50 transform hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#C99F4D] flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <Clock className="h-10 w-10 text-white" />
                  </div>
                  <h5 className="text-xl font-bold text-amber-900 mb-4">
                    Giữ Nóng Khi Dùng
                  </h5>
                  <p className="text-amber-800 leading-relaxed">
                    Giữ xôi trong nồi ấm hoặc hộp kín để xôi luôn mềm, không
                    khô. Có thể thêm chút dầu hoặc nước cốt dừa để giữ độ bóng.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Mẹo nhỏ */}
            <Card className="mt-5 bg-[#C99F4D] text-white border-0 shadow-2xl">
              <CardContent className="p-2">
                <div className="text-center">
                  <ChefHat className="h-10 w-10 mx-auto mb-2 text-white" />
                  <h4 className="text-xl font-bold mb-2">
                    Mẹo Hay Từ Người Làng Nghề
                  </h4>
                  <p className="text-amber-100 text-sm mx-auto leading-relaxed">
                    Khi hấp, mở nắp nồi lau hơi nước đọng để tránh xôi bị nhão.
                    Trộn thêm ít muối và dầu ăn giúp xôi bóng, dẻo và thơm lâu.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200 mb-4 px-4 py-2 font-semibold">
              Sản Phẩm Đặc Biệt
            </Badge>
            <h3 className="text-4xl md:text-4xl font-bold text-[#C99F4D] mb-6">
              Bộ Sưu Tập Xôi Truyền Thống
            </h3>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              Khám phá những món xôi đặc biệt, được chọn lựa và nấu thủ công từ
              những nguyên liệu tinh túy nhất của ẩm thực Việt.
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="transform hover:scale-105 transition-transform duration-300"
                >
                  <ProductCard {...product} />
                </div>
              ))}
            </div>
          ) : (
            <Card className="max-w-md mx-auto bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
              <CardContent className="text-center py-16">
                <Utensils className="h-16 w-16 text-amber-400 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  Đang cập nhật món xôi
                </h4>
                <p className="text-gray-600">
                  Những món xôi ngon nhất đang được chuẩn bị...
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
      <section className="py-20 bg-gradient-to-br from-amber-50/50 via-yellow-50/30 to-orange-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200 mb-4 px-4 py-2 font-semibold">
              Khách Hàng Nói Gì
            </Badge>
            <h3 className="text-4xl md:text-4xl font-bold text-[#C99F4D] mb-6">
              Đánh Giá Về Món Xôi Truyền Thống
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Cảm nhận chân thực từ những khách hàng đã thưởng thức xôi truyền
              thống — tinh túy ẩm thực Việt trong từng hạt nếp.
            </p>
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

export default XoiCheCategory;
