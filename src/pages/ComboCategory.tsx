import { useState, useEffect } from "react";
import { Package, Gift, Heart, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductCard from "@/components/ProductCard";
import { getProductsByCategory, Product } from "@/data/mockData";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ComboCategory = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const comboProducts = getProductsByCategory("Combo");
    setProducts(comboProducts);
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
      name: "Combo Tốt Nghiệp Cơ Bản",
      description: "Gói cơ bản với hoa tươi, hương nến và bánh kẹo",
      image:
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      benefits: ["Tiết kiệm 20%", "Đầy đủ món", "Phù hợp mọi gia đình"],
    },
    {
      name: "Combo Tốt Nghiệp Cao Cấp",
      description: "Gói cao cấp với hoa nhập khẩu, hương cao cấp và đặc sản",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      benefits: ["Tiết kiệm 25%", "Sản phẩm cao cấp", "Đóng gói sang trọng"],
    },
    {
      name: "Combo Tốt Nghiệp Đặc Biệt",
      description: "Gói đặc biệt với đầy đủ tất cả loại sản phẩm",
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      benefits: ["Tiết kiệm 30%", "Đầy đủ nhất", "Dịch vụ VIP"],
    },
  ];

  const occasions = [
    {
      title: "Lễ Cúng Tổ Tiên",
      description: "Combo đầy đủ cho lễ cúng trang trọng",
      flowers: ["Hoa tươi", "Hương nến", "Bánh kẹo", "Xôi chè"],
      color: "bg-amber-100 text-amber-800",
    },
    {
      title: "Lễ Tốt Nghiệp Trọng Thể",
      description: "Combo chúc mừng thành công rực rỡ",
      flowers: ["Hoa chúc mừng", "Hương may mắn", "Bánh kem", "Hoa quả"],
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      title: "Cúng Thần Tài May Mắn",
      description: "Combo mang lại tài lộc và thịnh vượng",
      flowers: ["Hoa vàng", "Hương tài lộc", "Bánh vàng", "Combo đặc biệt"],
      color: "bg-amber-100 text-amber-800",
    },
  ];

  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50/70 via-white to-orange-50/70 overflow-hidden isolate">
        <div className="container mx-auto px-4 py-20 lg:py-28 relative z-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border-amber-100 text-sm py-2 px-4 font-medium shadow-sm">
                ✦ Bộ Sưu Tập Combo Cao Cấp
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-[#C99F4D]">
                  Combo Trọn Gói Lễ Tốt Nghiệp
                </span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Gói combo tiết kiệm với đầy đủ sản phẩm cần thiết, mang lại sự
                tiện lợi và ý nghĩa trọn vẹn cho ngày tốt nghiệp quan trọng của
                bạn
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  size="lg"
                  className="bg-[#C99F4D] hover:bg-[#B8904A] text-white shadow-lg"
                >
                  Xem Combo
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-[#C99F4D] text-[#C99F4D] hover:bg-[#C99F4D] hover:text-white"
                >
                  Tư Vấn Miễn Phí
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-2 bg-gradient-to-t from-amber-100/50 to-orange-100/50 rounded-3xl transform rotate-3 scale-10 -z-10"></div>
              <img
                src="https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/545847489_641524629014973_5535955644678067889_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHX9MZ-q8EQDG4A_AourIKbth8wdN_xJx-2HzB03_EnH6IUoSCtfCKfQAHfeKukYsS9rpcRtwykwPnx5Hvhcpgy&_nc_ohc=LHjbYQj0nxoQ7kNvwGvlfhA&_nc_oc=AdndRmAqQzEU1cAh3n_QEFPJj6w2eawo--BE09uA8WLt_XJoCfPNTtZ1rCFQDNiB8Q0&_nc_zt=23&_nc_ht=scontent.fsgn2-9.fna&_nc_gid=lmL9WMUYZuHA5OL2WTcXqg&oh=00_Afe775xK1mjpuxjfQXLc4UeVrh72zoBcStPzqI5ih8DsXw&oe=68F4F54C"
                alt="Xôi chè cao cấp cho lễ tốt nghiệp"
                className="relative rounded-3xl shadow-2xl w-[500px] h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-yellow-50/5 via-orange-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <header className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#C99F4D] mb-4">
              Đặc Điểm Nổi Bật
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Tại sao nên chọn combo của chúng tôi cho các dịp quan trọng
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-shadow border-amber-200"
                >
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center">
                      <IconComponent className="h-8 w-8 text-amber-700" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600">
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
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#C99F4D] mb-4">
              Phân Loại Combo
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Đa dạng gói combo tiết kiệm phù hợp với mọi nhu cầu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {comboTypes.map((type, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col"
              >
                <div className="relative">
                  <img
                    src={type.image}
                    alt={type.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t  transition-colors"></div>
                </div>
                <CardContent className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {type.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{type.description}</p>
                  <div className="space-y-2 mb-4">
                    {type.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full bg-[#C99F4D] hover:bg-[#B8904A] text-white mt-auto">
                    Chọn combo ngay
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Occasions Section */}
      <section className="py-16 section-bg-faded">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#C99F4D] mb-4">
              Combo Theo Dịp
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Mỗi dịp lễ có combo phù hợp riêng với đầy đủ sản phẩm
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {occasions.map((occasion, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex-1 flex flex-col">
                  <Badge className={`mb-4 ${occasion.color}`}>
                    {occasion.title}
                  </Badge>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {occasion.description}
                  </h3>
                  <div className="space-y-2">
                    {occasion.flowers.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-amber-600" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Combo tốt nghiệp truyền thống"
                className="rounded-lg shadow-lg w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 to-yellow-600/10 rounded-lg"></div>
            </div>

            <div>
              <Badge className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 mb-4">
                Văn Hóa Truyền Thống
              </Badge>
              <h2 className="text-3xl font-bold text-[#C99F4D] mb-6">
                Ý Nghĩa Combo Trong Lễ Tốt Nghiệp
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Combo trọn gói trong văn hóa Việt Nam thể hiện sự chu đáo,
                  trang trọng và tôn kính trong những dịp lễ quan trọng.
                </p>
                <p>
                  Sự kết hợp hài hòa của hoa tươi, hương nến, bánh kẹo và xôi
                  chè tạo nên một không gian thiêng liêng và ý nghĩa.
                </p>
                <p>
                  Combo đầy đủ mang lại cảm giác hoàn thiện, trọn vẹn cho buổi
                  lễ tốt nghiệp quan trọng.
                </p>
              </div>
              <div className="mt-6 flex gap-4">
                <Button className="bg-[#C99F4D] hover:bg-[#B8904A] text-white">
                  <Package className="h-4 w-4 mr-2" />
                  Tìm hiểu thêm
                </Button>
                <Button
                  variant="outline"
                  className="border-[#C99F4D] text-[#C99F4D] hover:bg-[#C99F4D] hover:text-white"
                >
                  Tùy chỉnh combo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Culture/Care Section */}
      <section className="py-16 section-bg-faded">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-[#C99F4D] mb-4 break-words">
              Ưu Điểm Combo Tốt Nghiệp
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Combo không chỉ tiết kiệm mà còn đảm bảo sự hoàn hảo trong ngày
              đặc biệt
            </p>
          </div>

          <div className="mt-12 bg-white rounded-xl shadow-lg p-8 border border-amber-200">
            <div className="text-center mb-8">
              <Heart className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h4 className="text-2xl font-bold text-amber-900 mb-4">
                Tại Sao Chọn Combo
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-6 text-center border border-amber-200">
                <Package className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                <h5 className="font-semibold text-amber-900 mb-2">
                  Tiết Kiệm Chi Phí
                </h5>
                <p className="text-amber-800 text-sm">
                  Tiết kiệm 20-30% so với mua lẻ từng sản phẩm
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-6 text-center border border-amber-200">
                <Gift className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                <h5 className="font-semibold text-amber-900 mb-2">
                  Tiện Lợi Tối Đa
                </h5>
                <p className="text-amber-800 text-sm">
                  Một lần mua đủ tất cả, không cần tìm kiếm nhiều nơi
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-6 text-center border border-amber-200">
                <Star className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                <h5 className="font-semibold text-amber-900 mb-2">
                  Chất Lượng Đồng Đều
                </h5>
                <p className="text-amber-800 text-sm">
                  Tất cả sản phẩm đều được chọn lọc kỹ lưỡng
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

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
      <section className="py-16 bg-gradient-to-r from-amber-700 to-yellow-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 break-words drop-shadow-lg">
              Cần Tư Vấn Chọn Combo?
            </h3>
            <p className="text-amber-100 mb-8 text-lg leading-relaxed drop-shadow">
              Đội ngũ chuyên gia của chúng tôi sẵn sàng hỗ trợ bạn chọn combo
              phù hợp nhất cho ngày tốt nghiệp quan trọng. Liên hệ ngay để nhận
              tư vấn miễn phí và ưu đãi đặc biệt!
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button className="bg-white text-amber-800 hover:bg-amber-50 px-8 py-3 font-medium rounded-lg shadow-lg">
                <Heart className="h-4 w-4 mr-2" />
                Tư Vấn Miễn Phí
              </Button>
              <Button
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 font-medium rounded-lg"
              >
                Xem Bảng Giá
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ComboCategory;
