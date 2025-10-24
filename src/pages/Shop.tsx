import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  Store,
  ArrowLeft,
  Package,
  TrendingUp,
  Users,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AIAssistant from "@/components/AIAssistant";
import ProductCard from "@/components/ProductCard";
import {
  getShopById,
  getProductsByShopId,
  Shop,
  Product,
} from "@/data/mockData";

const ShopPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const shopId = parseInt(id);
      const shopData = getShopById(shopId);
      const shopProducts = getProductsByShopId(shopId);

      setShop(shopData || null);
      setProducts(shopProducts);
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Đang tải...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Không tìm thấy cửa hàng
            </h1>
            <Button onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Về trang chủ
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const categories = [...new Set(products.map((product) => product.category))];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center hover:text-primary transition-smooth"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Quay lại
          </button>
          <span>/</span>
          <span>Cửa hàng</span>
          <span>/</span>
          <span className="text-foreground">{shop.name}</span>
        </div>

        {/* Shop Header */}
        <Card className="bg-gray-50 border-border/50 mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="relative">
                <img
                  src={shop.avatar}
                  alt={shop.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-border"
                />
                {shop.isVerified && (
                  <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-2">
                    <CheckCircle className="h-6 w-6 text-primary-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-3xl font-bold text-foreground">
                    {shop.name}
                  </h1>
                  {shop.isVerified && (
                    <Badge className="bg-primary text-primary-foreground">
                      Đã xác thực
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                  {shop.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-secondary fill-current" />
                    <span className="font-semibold">{shop.rating}</span>
                    <span className="text-muted-foreground">
                      ({shop.totalSales} đánh giá)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{shop.totalProducts}</span>
                    <span className="text-muted-foreground">sản phẩm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-accent" />
                    <span className="text-muted-foreground">
                      Tham gia {formatDate(shop.joinedDate)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{shop.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{shop.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{shop.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shop Content */}
        <Tabs defaultValue="products" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">
              Sản phẩm ({products.length})
            </TabsTrigger>
            <TabsTrigger value="about">Thông tin cửa hàng</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-6">
            {products.length > 0 ? (
              <div className="space-y-6">
                {/* Category Filter */}
                {categories.length > 1 && (
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="cursor-pointer">
                      Tất cả ({products.length})
                    </Badge>
                    {categories.map((category) => {
                      const count = products.filter(
                        (p) => p.category === category
                      ).length;
                      return (
                        <Badge
                          key={category}
                          variant="outline"
                          className="cursor-pointer"
                        >
                          {category} ({count})
                        </Badge>
                      );
                    })}
                  </div>
                )}

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Store className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Chưa có sản phẩm
                  </h3>
                  <p className="text-muted-foreground">
                    Cửa hàng này chưa có sản phẩm nào được đăng bán.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Thông tin liên hệ */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    Thông tin liên hệ
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span>{shop.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-accent" />
                      <span>{shop.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-secondary" />
                      <span>{shop.email}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bản đồ - thay thế phần Thống kê */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    Tìm đường đến cửa hàng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px] rounded-lg overflow-hidden mb-3 border border-border">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.286923518261!2d106.69109337480553!3d10.78974535901087!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f404b084253%3A0x4b23c49e5e792c6a!2zMTIzIMSQLiBMw6ogTOG7o2ksIFBoxrDhu51uZyDEkOG6oWkgNCwgUXXhuq1uIDEsIFRow6BuaCBwaOG7kSBI4buNYyBNaW5oLCBWaWV0bmFt!5e0!3m2!1svi!2s!4v1739855333123!5m2!1svi!2s"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full bg-[#C99F4D] hover:bg-[#B8904A] text-white font-semibold transition-all duration-300"
                    onClick={() =>
                      window.open(
                        "https://maps.app.goo.gl/QReMbPswyo6ve8aNA",
                        "_blank"
                      )
                    }
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Xem chỉ đường trên Google Maps
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
      <AIAssistant />
    </div>
  );
};

export default ShopPage;
