import { useState, useEffect } from "react";
import { Apple, Leaf, Heart, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductCard from "@/components/ProductCard";
import { getProductsByCategory, Product } from "@/data/mockData";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const FruitsCategory = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fruitProducts = getProductsByCategory("Hoa Quả");
    setProducts(fruitProducts);
  }, []);

  const features = [
    {
      icon: Apple,
      title: "Hoa Quả Tươi Ngon",
      description: "Hoa quả được chọn lọc từ những vườn cây uy tín",
    },
    {
      icon: Leaf,
      title: "Tự Nhiên 100%",
      description: "Không sử dụng chất bảo quản, an toàn cho sức khỏe",
    },
    {
      icon: Heart,
      title: "Ý Nghĩa Tốt Lành",
      description: "Mang lại sức khỏe và may mắn trong học tập",
    },
    {
      icon: Star,
      title: "Chất Lượng Cao",
      description: "Được thu hoạch đúng độ chín, đảm bảo chất lượng",
    },
  ];

  const fruitTypes = [
    {
      name: "Cam Sành",
      description: "Cam sành ngọt thanh, giàu vitamin C",
      image:
        "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      benefits: ["Giàu vitamin C", "Tốt cho sức khỏe", "Ý nghĩa may mắn"],
    },
    {
      name: "Táo Đỏ",
      description: "Táo đỏ giòn ngọt, biểu tượng của thành công",
      image:
        "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      benefits: ["Giòn ngọt", "Màu sắc đẹp", "Ý nghĩa thành công"],
    },
    {
      name: "Nho Xanh",
      description: "Nho xanh tươi mát, thể hiện sự thịnh vượng",
      image:
        "https://images.unsplash.com/photo-1537640538966-79f369143040?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      benefits: ["Tươi mát", "Dễ ăn", "Phù hợp cúng kiến"],
    },
  ];

  const occasions = [
    {
      title: "Cúng Tổ Tiên",
      description: "Hoa quả thể hiện lòng thành kính",
      flowers: ["Cam sành", "Táo đỏ", "Nho xanh", "Chuối tiêu"],
      color: "bg-amber-100 text-amber-800",
    },
    {
      title: "Lễ Tốt Nghiệp",
      description: "Hoa quả chúc mừng thành công",
      flowers: ["Táo đỏ", "Cam sành", "Nho xanh", "Dưa hấu"],
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      title: "Cúng Thần Tài",
      description: "Hoa quả mang lại may mắn tài lộc",
      flowers: ["Cam vàng", "Táo đỏ", "Chuối", "Dứa"],
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
              <Badge className="bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border-amber-100 text-sm py-2 px-4 font-medium">
                ✦ Bộ Sưu Tập Hoa Quả Tươi Ngon
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-[#C99F4D]">
                  Hoa Quả Dành Cho Lễ Tốt Nghiệp
                </span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Mỗi trái cây được chọn lọc kỹ lưỡng, mang ý nghĩa tốt lành và
                sức khỏe cho những dịp quan trọng của bạn
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
                src="https://i.pinimg.com/736x/fe/0b/12/fe0b12ee47f8aadacece6c122c975048.jpg"
                alt="Hoa quả tươi ngon cho lễ tốt nghiệp"
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
              Tại sao nên chọn hoa quả của chúng tôi cho các dịp quan trọng
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
              Phân Loại Hoa Quả
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Đa dạng loại hoa quả tươi ngon phù hợp với mọi dịp lễ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {fruitTypes.map((type, index) => (
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
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-600/20 to-yellow-600/20 group-hover:from-amber-600/30 group-hover:to-yellow-600/30 transition-colors"></div>
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
              Hoa Quả Theo Dịp
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Mỗi dịp lễ có những loại hoa quả phù hợp riêng
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
                        <Apple className="h-4 w-4 text-amber-600" />
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
                src="https://i.pinimg.com/1200x/3a/7a/6c/3a7a6cb333ebf78a0ea7b71a45c7bc4c.jpg"
                alt="Hoa quả truyền thống"
                className="rounded-lg shadow-lg w-[500px] h-[650px]"
              />
              <div className="absolute inset-0 bg-gradient-to-br  rounded-lg"></div>
            </div>

            <div>
              <Badge className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 mb-4">
                Văn Hóa Truyền Thống
              </Badge>
              <h2 className="text-3xl font-bold text-[#C99F4D] mb-6">
                Ý Nghĩa Hoa Quả Trong Lễ Tốt Nghiệp
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Hoa quả trong văn hóa Việt Nam luôn mang ý nghĩa tốt lành, thể
                  hiện sự sung túc và lòng biết ơn đối với tổ tiên, thầy cô và
                  những người hướng dẫn.
                </p>
                <p>
                  Màu sắc tươi mới của hoa quả thể hiện sự khởi đầu mới, sức
                  khỏe và thành công trong học tập và công việc sắp tới.
                </p>
                <p>
                  Vị ngọt thanh của hoa quả mang lại cảm giác tươi mới, tích cực
                  cho buổi lễ quan trọng.
                </p>
              </div>
              <div className="mt-6 flex gap-4">
                <Button className="bg-[#C99F4D] hover:bg-[#B8904A] text-white">
                  <Apple className="h-4 w-4 mr-2" />
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

      {/* Culture/Care Section */}
      <section className="py-16 bg-gradient-to-br from-amber-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-[#C99F4D] mb-4 break-words">
              Văn Hóa Hoa Quả Tốt Nghiệp
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Hoa quả không chỉ là thức ăn mà còn thể hiện sự quan tâm sức khỏe
            </p>
          </div>

          <div className="mt-12 bg-white rounded-xl shadow-lg p-8 border border-amber-200">
            <div className="text-center mb-8">
              <Heart className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h4 className="text-2xl font-bold text-amber-900 mb-4">
                Cách Chọn & Bảo Quản
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-6 text-center border border-amber-200">
                <Apple className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                <h5 className="font-semibold text-amber-900 mb-2">
                  Chọn Hoa Quả
                </h5>
                <p className="text-amber-800 text-sm">
                  Chọn hoa quả tươi, không dập nát, màu sắc đều đẹp
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-6 text-center border border-amber-200">
                <Leaf className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                <h5 className="font-semibold text-amber-900 mb-2">
                  Bảo Quản Đúng Cách
                </h5>
                <p className="text-amber-800 text-sm">
                  Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-6 text-center border border-amber-200">
                <Star className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                <h5 className="font-semibold text-amber-900 mb-2">
                  Sử Dụng Kịp Thời
                </h5>
                <p className="text-amber-800 text-sm">
                  Sử dụng khi còn tươi để đảm bảo chất lượng và ý nghĩa
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
              Sản Phẩm Hoa Quả Đặc Biệt
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Khám phá những loại hoa quả đặc biệt, được lựa chọn kỹ lưỡng
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
              <Apple className="h-16 w-16 text-gray-300 mx-auto mb-4" />
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
              Cần Tư Vấn Chọn Hoa Quả?
            </h3>
            <p className="text-amber-100 mb-8 text-lg leading-relaxed drop-shadow">
              Đội ngũ chuyên gia của chúng tôi sẵn sàng hỗ trợ bạn chọn loại hoa
              quả tươi ngon nhất cho ngày tốt nghiệp quan trọng. Liên hệ ngay để
              nhận tư vấn miễn phí!
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

export default FruitsCategory;
