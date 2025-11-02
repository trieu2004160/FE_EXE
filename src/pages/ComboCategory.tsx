import { useState, useEffect } from "react";
import { Package, Gift, Heart, Clock, Flower, Leaf, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductCard from "@/components/ProductCard";
import { apiService, Product } from "@/services/apiService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ComboCategory = () => {
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

        // Find combo category
        const comboCategory = categories.find(
          (cat) =>
            cat.name.toLowerCase().includes("combo") ||
            cat.name.toLowerCase().includes("bộ")
        );

        if (comboCategory) {
          const comboProducts = allProducts.filter(
            (product) => product.productCategoryId === comboCategory.id
          );
          setProducts(comboProducts);
        } else {
          // If no combo category found, filter by name
          const comboProducts = allProducts.filter(
            (product) =>
              product.name.toLowerCase().includes("combo") ||
              product.name.toLowerCase().includes("bộ")
          );
          setProducts(comboProducts);
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
      icon: Package,
      title: "Combo Tiết Kiệm",
      description: "Tiết kiệm chi phí với các gói combo đa dạng",
    },
    {
      icon: Gift,
      title: "Đóng Gói Tinh Tế",
      description: "Đóng gói đẹp mắt, phù hợp làm quà tặng",
    },
    {
      icon: Heart,
      title: "Ý Nghĩa Trọn Vẹn",
      description: "Kết hợp hoàn hảo mang lại may mắn trọn vẹn",
    },
    {
      icon: Star,
      title: "Chất Lượng Đảm Bảo",
      description: "Tất cả sản phẩm trong combo đều chất lượng cao",
    },
  ];

  const comboTypes = [
    {
      name: "Combo Cúng Thần Tài",
      description: "Mâm cúng trọn gói cầu tài lộc, bình an cho gia chủ.",
      image:
        "https://i.pinimg.com/736x/d9/fd/9f/d9fd9fc67ab6744269950f68b2cc5971.jpg",
      price: "299.000đ",
      benefits: [
        "Đầy đủ lễ vật",
        "Tiết kiệm 15%",
        "Phù hợp cửa hàng, gia đình",
      ],
    },
    {
      name: "Combo Cúng Khai Trương",
      description: "Trọn gói lễ khai trương với đầy đủ lễ vật, sung túc.",
      image:
        "https://ksetup.net/wp-content/uploads/2025/01/mam-cung-khai-truong-3.jpg",
      price: "399.000đ",
      benefits: [
        "Heo quay, xôi gấc, hoa quả",
        "Tượng trưng tài lộc",
        "Dịch vụ tận nơi",
      ],
    },
    {
      name: "Combo Cúng Rằm",
      description: "Mâm cúng truyền thống cho ngày rằm – gọn gàng.",
      image:
        "https://i.pinimg.com/736x/cd/26/40/cd264001b9c820812fe62989952e0dd4.jpg",
      price: "249.000đ",
      benefits: ["Đầy đủ món cơ bản", "Tiết kiệm 20%", "Phù hợp mọi gia đình"],
    },
  ];

  const comboOfferings = [
    {
      title: "Combo Cúng Gia Tiên",
      description:
        "Trọn gói lễ vật trang trọng, thể hiện lòng hiếu kính tổ tiên.",
      items: ["Hoa tươi", "Hương nến", "Xôi chè", "Trái cây ngũ quả"],
      color: "bg-amber-100 text-amber-800",
      price: "250.000₫",
    },
    {
      title: "Combo Cúng Ông Công Ông Táo",
      description:
        "Mâm cúng tươm tất tiễn Táo Quân về trời, cầu năm mới bình an.",
      items: [
        "Ba con cá chép",
        "Xôi gấc đỏ",
        "Hương hoa quả",
        "Trầu cau, rượu nếp",
      ],
      color: "bg-yellow-100 text-yellow-800",
      price: "330.000₫",
    },
    {
      title: "Combo Cúng Tân Gia",
      description:
        "Lễ vật trọn gói chúc mừng nhà mới, mang tài lộc và bình an.",
      items: [
        "Heo quay mini",
        "Trái cây phong thủy",
        "Hoa tươi, hương nến",
        "Rượu khai lộc",
      ],
      color: "bg-orange-100 text-orange-800",
      price: "380.000₫",
    },
  ];

  return (
    <div>
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
                  ✨Combo Tiết Kiệm✨
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-[#C99F4D] to-[#D4AF37] bg-clip-text text-transparent">
                    Combo Tiết Kiệm
                  </span>
                  <br />
                </h1>
                <p className="text-xl text-gray-700 leading-relaxed max-w-xl">
                  Combo đồ cúng trọn gói, đầy đủ lễ vật – tiện lợi, tiết kiệm và
                  ý nghĩa cho mọi dịp lễ.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#C99F4D] to-[#B8904A] hover:from-[#B8904A] hover:to-[#A67C42] text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-semibold"
                >
                  <Flower className="mr-2 h-5 w-5" />
                  Xem Combo
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-[#C99F4D] text-[#C99F4D] hover:bg-[#C99F4D] hover:text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-semibold"
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Tư Vấn Combo
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-8 pt-8 border-t border-amber-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#C99F4D]">10+</div>
                  <div className="text-sm text-gray-600">
                    Năm kinh nghiệm chuẩn bị lễ vật
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#C99F4D]">50K+</div>
                  <div className="text-sm text-gray-600">
                    Khách hàng tin tưởng & hài lòng
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#C99F4D]">100%</div>
                  <div className="text-sm text-gray-600">
                    Lễ vật tươi mới & đầy đủ
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br w-[550px] ml-9 from-amber-100/40 to-orange-100/40 rounded-3xl transform rotate-3 scale-105"></div>
              <div className="absolute inset-0 bg-gradient-to-tl  w-[550px] from-yellow-100/40 to-amber-100/40 rounded-3xl transform -rotate-2 scale-110"></div>

              {/* Main image */}
              <div className="relative">
                <img
                  src="https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/545847489_641524629014973_5535955644678067889_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHX9MZ-q8EQDG4A_AourIKbth8wdN_xJx-2HzB03_EnH6IUoSCtfCKfQAHfeKukYsS9rpcRtwykwPnx5Hvhcpgy&_nc_ohc=LHjbYQj0nxoQ7kNvwGvlfhA&_nc_oc=AdndRmAqQzEU1cAh3n_QEFPJj6w2eawo--BE09uA8WLt_XJoCfPNTtZ1rCFQDNiB8Q0&_nc_zt=23&_nc_ht=scontent.fsgn2-9.fna&_nc_gid=lmL9WMUYZuHA5OL2WTcXqg&oh=00_Afe775xK1mjpuxjfQXLc4UeVrh72zoBcStPzqI5ih8DsXw&oe=68F4F54C"
                  alt="Combo xôi tiết kiệm thơm ngon mỗi ngày"
                  className="relative rounded-3xl shadow-2xl w-[500px] h-[500px] transform hover:scale-105 transition-transform duration-500 ml-14"
                />

                {/* Floating badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold text-gray-800">
                      Chất lượng đảm bảo
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
              Combo Đồ Cúng Tiết Kiệm – Trọn Vẹn, Tươm Tất, Vừa Túi Tiền
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
              Chúng tôi cam kết mang đến những phần đồ cúng đầy đủ, tươm tất và
              ý nghĩa, giúp bạn chuẩn bị lễ vật chu đáo, tiết kiệm chi phí mà
              vẫn đảm bảo sự trang trọng và thành tâm.
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
                      className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#C99F4D]  flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}
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

      {/* Types Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50/50 via-yellow-50/30 to-orange-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Badge className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200 mb-4 px-4 py-2 font-semibold">
              Combo Nổi Bật
            </Badge>
            <h2 className="text-xl md:text-4xl font-bold text-[#C99F4D] mb-6">
              Combo Đồ Cúng Trọn Gói
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Đa dạng combo đồ cúng trọn gói, đầy đủ lễ vật và ý nghĩa cho mọi
              dịp lễ quan trọng.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {comboTypes.map((type, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-500 overflow-hidden border-0 bg-white/80 backdrop-blur-sm transform hover:-translate-y-3"
              >
                <div className="relative overflow-hidden">
                  {type && (
                    <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      Phổ biến
                    </div>
                  )}
                  <img
                    src={type.image}
                    alt={type.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/30 transition-all duration-300"></div>
                </div>

                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-gray-800 group-hover:text-[#C99F4D] transition-colors">
                      {type.name}
                    </h3>
                    <Badge className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 font-semibold">
                      {type.price}
                    </Badge>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {type.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    {type.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-700 font-medium">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full bg-gradient-to-r from-[#C99F4D] to-[#B8904A] hover:from-[#B8904A] hover:to-[#A67C42] text-white font-semibold py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    <Flower className="mr-2 h-4 w-4" />
                    Xem Combo Ngay
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Occasions Section */}
      <section className="py-20 bg-gradient-to-b ">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-[#FCE7A2] text-[#8B5E00] border-none mb-4 px-5 py-2 font-semibold tracking-wide shadow-sm">
              Theo Từng Dịp Lễ
            </Badge>
            <h2 className="text-4xl font-bold text-[#C99F4D] mb-4">
              Combo Theo Dịp
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Mỗi dịp lễ mang ý nghĩa riêng, và một mâm đồ cúng tươm tất chính
              là cách thể hiện lòng thành kính, tri ân và cầu mong may mắn trọn
              vẹn nhất.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {comboOfferings.map((occasion, index) => (
              <Card
                key={index}
                className="border-amber-200 bg-white shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 rounded-2xl"
              >
                <div className="p-6 bg-amber-50 border-b border-amber-200">
                  <Badge className="bg-[#FCE7A2] text-[#8B5E00] mb-3 hover:bg-[#FCE7A2] hover:text-[#8B5E00] hover:cursor-pointer py-1.5 px-3 font-medium text-xs uppercase tracking-wide">
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
                    {occasion.items.map((flower, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 rounded-lg bg-amber-50/50 hover:bg-amber-100 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#C99F4D] flex items-center justify-center flex-shrink-0 shadow-sm">
                          <Flower className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-gray-700 font-medium">
                          {flower}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-6 bg-[#C99F4D] text-white border-[#C99F4D] hover:bg-[#B88A3E] hover:border-[#B88A3E] font-semibold py-3 transition-all duration-300 rounded-xl"
                  >
                    Xem Chi Tiết
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 via-yellow-50/50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Hình ảnh minh họa */}
            <div className="relative order-2 lg:order-1">
              {/* Hiệu ứng nền */}
              <div className="absolute -top-4 -left-4 w-[500px] h-full bg-gradient-to-br from-amber-200/30 to-yellow-200/30 rounded-2xl transform rotate-3"></div>

              <div className="relative">
                <img
                  src="https://scontent.fdad3-4.fna.fbcdn.net/v/t39.30808-6/532464477_620527011114735_3462853838480093441_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGymVmtcAnik5jAhph2Ekp5eaLO-4DtpZd5os77gO2ll4sjK8vFTSJd4fZMlGAGKdet6Wyg2bYUm_qIPTL13oiY&_nc_ohc=yIQeM4GDnZwQ7kNvwEErRrt&_nc_oc=Adm3SyCp18nNTti6nevv1fQ9Nl4Aoo5Iv1vzrQhX_f3vpXpmcANh1KrKDKwGJ48Us4E&_nc_zt=23&_nc_ht=scontent.fdad3-4.fna&_nc_gid=F8HqXM6PBuABXqdp2vQSlw&oh=00_Afc2fzvBvYh9tejlYMCp5FdVEdh9CG8Nam09LCAb3LbOgQ&oe=68F89F6B"
                  alt="Combo đồ cúng"
                  className="rounded-2xl shadow-2xl h-[600px] transform hover:scale-105 transition-transform duration-500"
                />

                {/* Thẻ nổi */}
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <span className="text-sm font-semibold text-gray-800">
                      Sẵn sàng mọi dịp lễ
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Nội dung */}
            <div className="space-y-8 order-1 lg:order-2">
              <div>
                <Badge className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200 mb-4 px-4 py-2 font-semibold">
                  Combo Đồ Cúng Trọn Gói
                </Badge>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#C99F4D] mb-6 whitespace-nowrap">
                  Tiện Lợi – Đầy Đủ – Trang Trọng
                </h2>
              </div>

              <div className="space-y-3">
                <div className="bg-white rounded-2xl p-4 shadow-lg border-l-4 border-[#C99F4D]">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Đầy Đủ Lễ Vật
                  </h3>
                  <p className="text-gray-600">
                    Combo bao gồm đầy đủ hương, hoa, xôi, chè, trái cây và bánh
                    kẹo – tiện lợi mà vẫn chỉn chu.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-lg border-l-4 border-[#8B7355]">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Tiết Kiệm Thời Gian
                  </h3>
                  <p className="text-gray-600">
                    Chỉ cần chọn combo phù hợp, mọi lễ vật được chuẩn bị chu đáo
                    – không cần lo mua sắm lặt vặt.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-lg border-l-4 border-[#A67C5A]">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Ý Nghĩa & Trang Trọng
                  </h3>
                  <p className="text-gray-600">
                    Mỗi combo được sắp xếp hài hòa, tôn nghiêm – thể hiện lòng
                    thành kính với tổ tiên và thần linh.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button className="bg-gradient-to-r from-[#C99F4D] to-[#B8904A] hover:from-[#B8904A] hover:to-[#A67C42] text-white font-semibold px-6 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <Package className="h-4 w-4 mr-2" />
                  Khám phá combo
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-[#C99F4D] text-[#C99F4D] hover:bg-[#C99F4D] hover:text-white font-semibold px-6 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Leaf className="h-4 w-4 mr-2" />
                  Xem bảng giá
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Culture/Care Section */}

      {/* Products Section */}
      <section className="py-16 section-bg-faded">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-[#C99F4D] mb-4 break-words">
              Combo Đặc Biệt Có Sẵn
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Khám phá những combo đặc biệt, được thiết kế riêng cho từng dịp
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Đang cập nhật combo mới...</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}

      <section className="py-20 bg-gradient-to-br from-amber-50/50 via-yellow-50/30 to-orange-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200 mb-4 px-4 py-2 font-semibold">
              Khách Hàng Nói Gì
            </Badge>
            <h3 className="text-4xl md:text-4xl font-bold text-[#C99F4D] mb-6">
              Đánh Giá Về Combo Đồ Cúng Trọn Gói
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Cảm nhận từ những khách hàng đã đặt combo đồ cúng — trọn vẹn, chu
              đáo và thể hiện lòng thành kính trong mỗi dịp lễ.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                rating: 5,
                content:
                  "Combo cúng gia tiên chuẩn bị rất chu đáo, mọi thứ tươi mới và sắp xếp trang trọng. Gia đình mình rất hài lòng!",
                name: "Nguyễn Thị Lan",
                role: "Khách hàng tại TP.HCM",
              },
              {
                rating: 5,
                content:
                  "Tôi đặt combo cúng Thần Tài cho cửa hàng, lễ vật đầy đủ và đẹp mắt. Nhân viên giao đúng giờ, phục vụ tận tâm.",
                name: "Trần Quốc Bảo",
                role: "Chủ tiệm vàng Bảo Kim",
              },
              {
                rating: 4,
                content:
                  "Dịch vụ nhanh, giá hợp lý. Mâm cúng tốt nghiệp được chuẩn bị rất ý nghĩa và đẹp, phù hợp để chụp hình kỷ niệm.",
                name: "Lê Minh Tú",
                role: "Phụ huynh học sinh",
              },
              {
                rating: 5,
                content:
                  "Mình rất ấn tượng với cách trang trí mâm cúng. Mọi thứ được gói gọn gàng, thể hiện được sự tôn nghiêm và tinh tế.",
                name: "Phạm Hồng Ngọc",
                role: "Khách hàng thường xuyên",
              },
            ].map((testimonial, index) => (
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

export default ComboCategory;
