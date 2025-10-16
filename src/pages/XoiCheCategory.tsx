import { useState, useEffect } from "react";
import { Soup, Utensils, Heart, Star } from "lucide-react";
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
    const xoiCheProducts = getProductsByCategory("Xôi Chè");
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
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      benefits: ["Thơm béo", "Vị ngọt đậm đà", "Bổ dưỡng"],
    },
    {
      name: "Chè Đậu Xanh",
      description: "Chè đậu xanh mềm mịn, thanh mát và bổ dưỡng",
      image:
        "https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      benefits: ["Mềm mịn", "Thanh mát", "Giàu dinh dưỡng"],
    },
    {
      name: "Xôi Đậu Phộng",
      description: "Xôi đậu phộng giòn tan, thơm nức mũi",
      image:
        "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      benefits: ["Giòn tan", "Thơm nức", "Dẻo ngon"],
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

  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50/70 via-white to-orange-50/70 overflow-hidden isolate">
        <div className="container mx-auto px-4 py-20 lg:py-28 relative z-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border-amber-100 text-sm py-2 px-4 font-medium shadow-sm">
                ✦ Bộ Sưu Tập Xôi Chè Cao Cấp
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-[#C99F4D]">
                  Xôi Chè Dành Cho Lễ Tốt Nghiệp
                </span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Mỗi món xôi chè được chế biến tươi ngon, mang ý nghĩa viên mãn
                và may mắn cho những dịp quan trọng của bạn
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
              <div className="pointer-events-none absolute inset-2 bg-gradient-to-t from-amber-100/50 to-orange-100/50 rounded-3xl transform rotate-3 scale-10 -z-10"></div>
              <img
                src="https://i.pinimg.com/1200x/94/3b/13/943b13b49e0c4bd0a79ffbbb30b3e984.jpg"
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
              Tại sao nên chọn xôi chè của chúng tôi cho các dịp quan trọng
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
              Phân Loại Xôi Chè
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Đa dạng món xôi chè thơm ngon phù hợp với mọi dịp lễ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {xoiCheTypes.map((type, index) => (
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
      <section className="py-16 bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-50 -mt-1">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#C99F4D] mb-4">
              Xôi Chè Theo Dịp
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Mỗi dịp lễ có những món xôi chè phù hợp riêng
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
                        <Soup className="h-4 w-4 text-amber-600" />
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
      <section className="py-16 bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-50 -mt-1">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Xôi chè truyền thống"
                className="rounded-lg shadow-lg w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 to-yellow-600/10 rounded-lg"></div>
            </div>

            <div>
              <Badge className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 mb-4">
                Văn Hóa Truyền Thống
              </Badge>
              <h2 className="text-3xl font-bold text-[#C99F4D] mb-6">
                Ý Nghĩa Xôi Chè Trong Lễ Tốt Nghiệp
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Xôi chè trong văn hóa Việt Nam luôn mang ý nghĩa viên mãn, thể
                  hiện sự trọn vẹn và niềm vui trong những thành tựu học tập.
                </p>
                <p>
                  Hạt nếp tròn đầy thể hiện sự trọn vẹn trong thành công, màu
                  sắc đa dạng tượng trưng cho tương lai tươi sáng.
                </p>
                <p>
                  Món xôi chè tươi ngon mang lại cảm giác ấm áp, hạnh phúc cho
                  buổi lễ quan trọng.
                </p>
              </div>
              <div className="mt-6 flex gap-4">
                <Button className="bg-[#C99F4D] hover:bg-[#B8904A] text-white">
                  <Soup className="h-4 w-4 mr-2" />
                  Tìm hiểu thêm
                </Button>
                <Button
                  variant="outline"
                  className="border-[#C99F4D] text-[#C99F4D] hover:bg-[#C99F4D] hover:text-white"
                >
                  Cách chế biến
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Culture/Care Section */}
      <section className="py-16 bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-50 -mt-1">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-[#C99F4D] mb-4 break-words">
              Văn Hóa Xôi Chè Tốt Nghiệp
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Xôi chè không chỉ là món ăn mà còn thể hiện sự viên mãn trong
              thành công
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
                <Soup className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                <h5 className="font-semibold text-amber-900 mb-2">
                  Chọn Xôi Chè
                </h5>
                <p className="text-amber-800 text-sm">
                  Chọn xôi chè tươi ngon, hạt nếp đều, màu sắc tự nhiên
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-6 text-center border border-amber-200">
                <Utensils className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                <h5 className="font-semibold text-amber-900 mb-2">
                  Bảo Quản Đúng Cách
                </h5>
                <p className="text-amber-800 text-sm">
                  Bảo quản nơi mát mẻ, tránh để lâu trong nhiệt độ cao
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-6 text-center border border-amber-200">
                <Star className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                <h5 className="font-semibold text-amber-900 mb-2">
                  Thưởng Thức Kịp Thời
                </h5>
                <p className="text-amber-800 text-sm">
                  Thưởng thức khi còn tươi để đảm bảo hương vị tốt nhất
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-50 -mt-1">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-[#C99F4D] mb-4 break-words">
              Sản Phẩm Xôi Chè Đặc Biệt
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Khám phá những món xôi chè đặc biệt, được chế biến tươi ngon
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
              <Soup className="h-16 w-16 text-gray-300 mx-auto mb-4" />
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
              Cần Tư Vấn Chọn Xôi Chè?
            </h3>
            <p className="text-amber-100 mb-8 text-lg leading-relaxed drop-shadow">
              Đội ngũ chuyên gia của chúng tôi sẵn sàng hỗ trợ bạn chọn món xôi
              chè thơm ngon nhất cho ngày tốt nghiệp quan trọng. Liên hệ ngay để
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

export default XoiCheCategory;
