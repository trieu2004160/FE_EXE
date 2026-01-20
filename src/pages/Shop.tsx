import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Phone, User } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AIAssistant from "@/components/AIAssistant";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiService, type Product, type PublicShopProfileDto } from "@/services/apiService";
import { normalizeImageUrl } from "@/utils/imageUtils";

const ShopPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [shop, setShop] = useState<PublicShopProfileDto | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchShopData = async () => {
      if (!id) return;

      setLoading(true);
      setError("");

      try {
        const shopId = parseInt(id);

        const [profile, shopProducts] = await Promise.all([
          apiService.getPublicShopProfile(shopId),
          apiService.getProductsByShopId(shopId),
        ]);

        setShop(profile);
        setProducts(shopProducts);
      } catch (err: any) {
        console.error("Error fetching shop data:", err);
        setError(err?.message || "Không thể tải thông tin cửa hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Đang tải...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!shop || error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {error || "Không tìm thấy cửa hàng"}
            </h1>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const shopAvatarUrl = shop.avatarBase64
    ? normalizeImageUrl(shop.avatarBase64)
    : undefined;

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
        <Card className="border-border/50 mb-8">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="relative">
                {shopAvatarUrl ? (
                  <img
                    src={shopAvatarUrl}
                    alt={shop.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-border"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full border-4 border-border bg-muted flex items-center justify-center text-2xl font-semibold text-muted-foreground">
                    {(shop.name || "S").charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {shop.name}
                </h1>

                <div className="flex flex-col gap-2 text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Chủ shop: {shop.ownerFullName || "(Chưa cập nhật)"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>SĐT: {shop.contactPhoneNumber || "(Chưa cập nhật)"}</span>
                  </div>
                </div>

                {shop.description && (
                  <p className="text-muted-foreground leading-relaxed">
                    {shop.description}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Sản phẩm đang bán ({products.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} {...(product as any)} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">Chưa có sản phẩm</h3>
                <p className="text-muted-foreground">
                  Cửa hàng này chưa đăng bán sản phẩm nào.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
      <AIAssistant />
    </div>
  );
};

export default ShopPage;
