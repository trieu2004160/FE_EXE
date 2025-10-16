import { useState, useEffect } from "react";
import { Flame, Wind, Sparkles, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductCard from "@/components/ProductCard";
import { getProductsByCategory, Product } from "@/data/mockData";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import nen from "@/assets/4c.jpg";

const IncenseCategory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const incenseProducts = getProductsByCategory("Hương Nến");
    setProducts(incenseProducts);
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
      description: "Hương trầm cao cấp với mùi hương đậm đà, trang nghiêm",
      image:
        "https://images.unsplash.com/photo-1544550581-5b4be235b1d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      benefits: ["Mùi hương đậm đà", "Cháy lâu ổn định", "Phù hợp lễ cúng"],
    },
    {
      name: "Hương Que",
      description: "Hương que truyền thống, thích hợp cho các dịp lễ cúng",
      image:
        "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      benefits: ["Truyền thống", "Dễ sử dụng", "Giá cả hợp lý"],
    },
    {
      name: "Nến Thờ",
      description: "Nến thờ chất lượng cao, ánh sáng ổn định",
      image:
        "https://images.unsplash.com/photo-1561181286-d3fee7d55364?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      benefits: ["Ánh sáng ổn định", "Không khói", "An toàn sử dụng"],
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

  return (
    <div>
      <Header /> {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br 0"></div>
        <div className="container mx-auto px-4 py-20 lg:py-28 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border-amber-100 text-sm py-2 px-4 font-medium">
                ✦ Bộ Sưu Tập Hương Nến Cao Cấp
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-[#C99F4D]">
                  Hương Nến Dành Cho Lễ Tốt Nghiệp
                </span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Mỗi que hương được chọn lọc kỹ lưỡng, mang ý nghĩa thiêng liêng
                và thành công cho những dịp quan trọng của bạn
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
                src={singleImage}
                alt="Hương nến cao cấp cho lễ tốt nghiệp"
                className="relative rounded-3xl shadow-2xl w-[500px] h-[550px] object-cover"
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
              Tại sao nên chọn hương nến của chúng tôi cho các dịp quan trọng
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
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#C99F4D] mb-4">
              Phân Loại Hương Nến
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Đa dạng loại hương nến phù hợp với mọi dịp lễ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {incenseTypes.map((type, index) => (
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
                    Khám phá ngay
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Occasions Section */}
      <section className="py-16 bg-gradient-to-br from-yellow-50/5 via-orange-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#C99F4D] mb-4">
              Hương Nến Theo Dịp
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Mỗi dịp lễ có những loại hương nến phù hợp riêng
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
                    {occasion.flowers.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Flame className="h-4 w-4 text-amber-600" />
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
                src="https://i.pinimg.com/736x/ab/c2/53/abc253b094647ee0c708afd54d2394c4.jpg"
                alt="Hương nến truyền thống"
                className="rounded-lg shadow-lg w-[500px] h-[650px]"
              />
              <div className="absolute inset-0 bg-gradient-to-br  rounded-lg"></div>
            </div>

            <div>
              <Badge className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 mb-4">
                Văn Hóa Truyền Thống
              </Badge>
              <h2 className="text-3xl font-bold text-[#C99F4D] mb-6">
                Ý Nghĩa Hương Nến Trong Lễ Tốt Nghiệp
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Hương nến trong văn hóa Việt Nam luôn mang ý nghĩa thiêng
                  liêng, thể hiện sự tôn kính và lòng biết ơn đối với tổ tiên,
                  thầy cô và những người hướng dẫn.
                </p>
                <p>
                  Ánh sáng từ nến thể hiện sự soi đường, dẫn lối trong học tập
                  và công việc sắp tới của các bạn.
                </p>
                <p>
                  Mùi hương thanh khiết từ hương giúp tạo không gian thiêng
                  liêng, trang trọng cho buổi lễ quan trọng.
                </p>
              </div>
              <div className="mt-6 flex gap-4">
                <Button className="bg-[#C99F4D] hover:bg-[#B8904A] text-white">
                  <Flame className="h-4 w-4 mr-2" />
                  Tìm hiểu thêm
                </Button>
                <Button
                  variant="outline"
                  className="border-[#C99F4D] text-[#C99F4D] hover:bg-[#C99F4D] hover:text-white"
                >
                  Cách sử dụng
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Culture/Care Section */}
      <section className="py-16 bg-gradient-to-br from-amber-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-[#C99F4D] mb-4 break-words">
              Văn Hóa Hương Nến Tốt Nghiệp
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Hương nến không chỉ là vật phẩm cúng bái mà còn thể hiện sự tôn
              kính
            </p>
          </div>

          <div className="mt-12 bg-white rounded-xl shadow-lg p-8 border border-amber-200">
            <div className="text-center mb-8">
              <Sparkles className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h4 className="text-2xl font-bold text-amber-900 mb-4">
                Cách Chọn & Sử Dụng
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-6 text-center border border-amber-200">
                <Flame className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                <h5 className="font-semibold text-amber-900 mb-2">
                  Chọn Hương Nến
                </h5>
                <p className="text-amber-800 text-sm">
                  Chọn hương nến có mùi thơm nhẹ, không quá nồng
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-6 text-center border border-amber-200">
                <Wind className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                <h5 className="font-semibold text-amber-900 mb-2">
                  Sử Dụng An Toàn
                </h5>
                <p className="text-amber-800 text-sm">
                  Đặt nơi thoáng mát, tránh gió lớn và vật dễ cháy
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-6 text-center border border-amber-200">
                <Clock className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                <h5 className="font-semibold text-amber-900 mb-2">
                  Thời Gian Phù Hợp
                </h5>
                <p className="text-amber-800 text-sm">
                  Thắp trong thời gian lễ cúng, tắt khi kết thúc
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Products Section */}
      <section className="py-16 bg-gradient-to-br from-amber-50 to-yellow-50">
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
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
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
      <section className="py-16 bg-gradient-to-r from-amber-700 to-yellow-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 break-words drop-shadow-lg">
              Cần Tư Vấn Chọn Hương Nến?
            </h3>
            <p className="text-amber-100 mb-8 text-lg leading-relaxed drop-shadow">
              Đội ngũ chuyên gia của chúng tôi sẵn sàng hỗ trợ bạn chọn loại
              hương nến phù hợp nhất cho ngày tốt nghiệp quan trọng. Liên hệ
              ngay để nhận tư vấn miễn phí!
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button className="bg-white text-amber-800 hover:bg-amber-50 px-8 py-3 font-medium rounded-lg shadow-lg">
                <Sparkles className="h-4 w-4 mr-2" />
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

export default IncenseCategory;
