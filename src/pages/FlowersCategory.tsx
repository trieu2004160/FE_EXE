import { useState, useEffect } from "react";
import { Flower, Leaf, Heart, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductCard from "@/components/ProductCard";
import { getProductsByCategory, Product } from "@/data/mockData";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import flowersHeroImage from "@/assets/flowers-hero.jpg";
import heroBannerImage from "@/assets/traditional-flowers.jpg";

const FlowersCategory = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const flowerProducts = getProductsByCategory("Hoa Tươi");
    setProducts(flowerProducts);
  }, []);

  const features = [
    {
      icon: Flower,
      title: "Hoa Tươi Mỗi Ngày",
      description: "Hoa được nhập về hàng ngày, đảm bảo độ tươi mới tối đa",
    },
    {
      icon: Leaf,
      title: "Tự Nhiên 100%",
      description: "Không sử dụng hóa chất bảo quản, an toàn cho sức khỏe",
    },
    {
      icon: Heart,
      title: "Ý Nghĩa Tâm Linh",
      description: "Mang lại may mắn, thành công trong học tập và công việc",
    },
    {
      icon: Star,
      title: "Chất Lượng Cao",
      description: "Được chọn lọc kỹ lưỡng từ những nhà vườn uy tín",
    },
  ];

  const flowerTypes = [
    {
      name: "Hoa Hồng Đỏ",
      description: "Biểu tượng của tình yêu và thành công",
      image:
        "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      benefits: ["Ý nghĩa cao quý", "Màu sắc rực rỡ", "Hương thơm dễ chịu"],
    },
    {
      name: "Hoa Cúc Trắng",
      description: "Thể hiện sự trong sạch và thuần khiết",
      image:
        "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      benefits: ["Tôn kính tổ tiên", "Màu sắc trang nhã", "Bền lâu"],
    },
    {
      name: "Hoa Sen Hồng",
      description: "Biểu tượng của sự thanh cao và giác ngộ",
      image:
        "https://images.unsplash.com/photo-1561181286-d3fee7d55364?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      benefits: ["Ý nghĩa tâm linh", "Vẻ đẹp thanh tao", "Phù hợp cúng kiến"],
    },
  ];

  const occasions = [
    {
      title: "Cúng Tổ Tiên",
      description: "Hoa thể hiện lòng thành kính",
      flowers: ["Hoa cúc vàng", "Hoa sen hồng", "Hoa hồng đỏ", "Hoa ly trắng"],
      color: "bg-amber-100 text-amber-800",
    },
    {
      title: "Lễ Tốt Nghiệp",
      description: "Hoa chúc mừng thành công",
      flowers: ["Hoa hồng đỏ", "Hoa cúc vàng", "Hoa ly trắng", "Hoa tulip"],
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      title: "Cúng Thần Tài",
      description: "Hoa mang lại may mắn tài lộc",
      flowers: ["Hoa cúc vàng", "Hoa hồng đỏ", "Hoa tulip", "Hoa lay-ơn"],
      color: "bg-amber-100 text-amber-800",
    },
  ];

  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/70 via-white to-orange-50/70"></div>
        <div className="container mx-auto px-4 py-20 lg:py-28 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border-amber-100 text-sm py-2 px-4 font-medium shadow-sm">
                ✦ Bộ Sưu Tập Hoa Tươi Cao Cấp
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-[#C99F4D]">
                  Hoa Tươi Dành Cho Lễ Tốt Nghiệp
                </span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Mỗi bông hoa được chọn lọc kỹ lưỡng, mang ý nghĩa tốt lành và
                thành công cho những dịp quan trọng của bạn
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  size="lg"
                  className="bg-[#C99F4D] hover:bg-[#B8904A] text-white shadow-lg"
                >
                  Xem Sản Phẩm
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
              <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 to-orange-100/50 rounded-3xl transform rotate-3"></div>
              <img
                src={flowersHeroImage}
                alt="Hoa tươi cao cấp cho lễ tốt nghiệp"
                className="relative rounded-3xl shadow-2xl w-full h-auto"
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
              Tại sao nên chọn hoa tươi của chúng tôi cho các dịp quan trọng
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
                  <CardContent className="p-6">
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
      <section className="py-16 bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-50 -mt-1">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif text-[#C99F4D] mb-4">
              Phân Loại Hoa Tươi
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Đa dạng loại hoa phù hợp với mọi dịp lễ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {flowerTypes.map((type, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={type.image}
                    alt={type.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
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
                  <Button className="w-full bg-[#C99F4D] hover:bg-[#B8904A] text-white">
                    Khám phá ngay
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Occasions Section */}
      <section className="py-20 bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-50 -mt-1">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif text-[#C99F4D] mb-4">
              Hoa Tươi Theo Dịp
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Mỗi dịp lễ có những loại hoa phù hợp riêng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {occasions.map((occasion, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Badge className={`mb-4 ${occasion.color}`}>
                    {occasion.title}
                  </Badge>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {occasion.description}
                  </h3>
                  <div className="space-y-2">
                    {occasion.flowers.map((flower, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Flower className="h-4 w-4 text-amber-600" />
                        <span className="text-gray-700">{flower}</span>
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
      <section className="py-20 bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-50 -mt-1">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src={heroBannerImage}
                alt="Hoa tươi truyền thống"
                className="rounded-lg shadow-lg w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 to-yellow-600/10 rounded-lg"></div>
            </div>

            <div>
              <Badge className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 mb-4">
                Văn Hóa Truyền Thống
              </Badge>
              <h2 className="text-3xl font-serif text-[#C99F4D] mb-6">
                Ý Nghĩa Hoa Tươi Trong Lễ Tốt Nghiệp
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Hoa tươi trong văn hóa Việt Nam luôn mang ý nghĩa tốt lành,
                  thể hiện sự tôn kính và lòng biết ơn đối với tổ tiên, thầy cô
                  và những người hướng dẫn.
                </p>
                <p>
                  Màu sắc tươi mới của hoa thể hiện sự khởi đầu mới, thành công
                  trong học tập và công việc sắp tới của các bạn.
                </p>
                <p>
                  Mùi hương thanh khiết của hoa giúp tạo không gian thiêng
                  liêng, trang trọng cho buổi lễ quan trọng.
                </p>
              </div>
              <div className="mt-6 flex gap-4">
                <Button className="bg-[#C99F4D] hover:bg-[#B8904A] text-white">
                  <Flower className="h-4 w-4 mr-2" />
                  Tìm hiểu thêm
                </Button>
                <Button
                  variant="outline"
                  className="border-[#C99F4D] text-[#C99F4D] hover:bg-[#C99F4D] hover:text-white"
                >
                  Cách bảo quản
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Culture/Care Section - màu vàng thanh lịch */}
      <section className="py-16 bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-50 -mt-1">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-normal text-[#C99F4D] mb-4">
              Văn Hóa Hoa Tươi Tốt Nghiệp
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Hoa tươi không chỉ là món quà ý nghĩa mà còn thể hiện sự quan tâm
              đặc biệt
            </p>
          </div>

          <div className="mt-12 bg-white rounded-xl shadow-lg p-8 border border-amber-200">
            <div className="text-center mb-8">
              <Heart className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h4 className="text-2xl font-serif text-amber-900 mb-4">
                Cách Chọn & Bảo Quản
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-6 text-center border border-amber-200">
                <Flower className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                <h5 className="font-semibold text-amber-900 mb-2">
                  Chọn Hoa Tươi
                </h5>
                <p className="text-amber-800 text-sm">
                  Chọn hoa có màu sắc tươi mới, cánh hoa không bị dập nát
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-6 text-center border border-amber-200">
                <Leaf className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                <h5 className="font-semibold text-amber-900 mb-2">
                  Bảo Quản Đúng Cách
                </h5>
                <p className="text-amber-800 text-sm">
                  Cắm hoa vào nước sạch, để nơi thoáng mát, tránh ánh nắng
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-6 text-center border border-amber-200">
                <Star className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                <h5 className="font-semibold text-amber-900 mb-2">
                  Sử Dụng Kịp Thời
                </h5>
                <p className="text-amber-800 text-sm">
                  Sử dụng trong ngày để đảm bảo độ tươi và hương thơm
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section - màu vàng thanh lịch */}
      <section className="py-16 bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-50 -mt-1">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-serif text-[#C99F4D] mb-4 break-words">
              Sản Phẩm Hoa Tươi Đặc Biệt
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Khám phá những loại hoa đặc biệt, được lựa chọn kỹ lưỡng từ những
              nhà vườn uy tín
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
              <Flower className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Đang cập nhật sản phẩm mới...</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section - màu vàng thanh lịch */}
      <section className="py-16 bg-gradient-to-r from-amber-700 to-yellow-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 break-words drop-shadow-lg">
              Cần Tư Vấn Chọn Hoa?
            </h3>
            <p className="text-amber-100 mb-8 text-lg leading-relaxed drop-shadow">
              Đội ngũ chuyên gia của chúng tôi sẵn sàng hỗ trợ bạn chọn loại hoa
              phù hợp nhất cho ngày tốt nghiệp quan trọng. Liên hệ ngay để nhận
              tư vấn miễn phí!
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button className="bg-white text-amber-800 hover:bg-amber-50 px-8 py-3 font-medium rounded-lg shadow-lg">
                <Heart className="h-4 w-4 mr-2" />
                Tư Vấn Miễn Phí
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FlowersCategory;
