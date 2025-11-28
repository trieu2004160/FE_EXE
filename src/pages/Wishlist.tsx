import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import { getProductImageUrl } from "@/utils/imageUtils";

const Wishlist = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { toast } = useToast();

  const handleRemoveFromWishlist = (productId: number, productName: string) => {
    removeFromWishlist(productId);
    toast({
      title: "Đã xóa khỏi danh sách yêu thích",
      description: `${productName} đã được xóa`,
    });
  };

  const handleClearAll = () => {
    clearWishlist();
    toast({
      title: "Đã xóa toàn bộ",
      description: "Đã xóa tất cả sản phẩm khỏi danh sách yêu thích",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section
        className="relative py-16 overflow-hidden"
        style={{ height: "30vh" }}
      >
        <div className="absolute inset-0">
          <img
            src="https://i.pinimg.com/1200x/c1/b9/5b/c1b95be20d4d2494931739a6f36046b1.jpg"
            alt="Wishlist Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Sản Phẩm Yêu Thích
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Những sản phẩm bạn đã lưu để mua sau
          </p>
        </div>
      </section>

      {/* Wishlist Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Danh Sách Yêu Thích
              </h2>
              <p className="text-muted-foreground">
                {wishlist.length} sản phẩm
              </p>
            </div>
            {wishlist.length > 0 && (
              <Button
                variant="outline"
                onClick={handleClearAll}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa tất cả
              </Button>
            )}
          </div>

          {wishlist.length === 0 ? (
            <div className="text-center py-16">
              <div className="mb-6">
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Chưa có sản phẩm yêu thích
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Hãy thêm các sản phẩm bạn thích vào danh sách để dễ dàng tìm
                  lại sau này
                </p>
              </div>
              <Button asChild className="bg-[#A67C42]">
                <Link to="/products">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Khám phá sản phẩm
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((product) => (
                <Card
                  key={product.id}
                  className="group hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative">
                    <Link to={`/product/${product.id}`}>
                      <img
                        src={getProductImageUrl(product) || "/assets/no-image.png"}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    </Link>

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {product.isPopular && (
                        <Badge className="bg-orange-500 text-white text-xs">
                          Phổ biến
                        </Badge>
                      )}
                      {product.maxPrice && (
                        <Badge className="bg-red-500 text-white text-xs">
                          -
                          {Math.round(
                            ((product.maxPrice - product.basePrice) /
                              product.maxPrice) *
                            100
                          )}
                          %
                        </Badge>
                      )}
                    </div>

                    {/* Remove from wishlist button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-3 right-3 bg-white/80 hover:bg-white transition"
                      onClick={() =>
                        handleRemoveFromWishlist(product.id, product.name)
                      }
                    >
                      <Heart className="h-4 w-4 text-red-500 fill-current" />
                    </Button>
                  </div>

                  <CardContent className="p-4">
                    {/* Category removed as it is not in Product interface */}

                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-medium text-base mb-2 text-foreground line-clamp-2 group-hover:text-primary transition">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg font-semibold text-[#C99F4D]">
                        {product.basePrice.toLocaleString("vi-VN")}đ
                      </span>
                      {product.maxPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {product.maxPrice.toLocaleString("vi-VN")}đ
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1 h-9 text-sm">
                        <ShoppingBag className="h-4 w-4 mr-1.5" />
                        Thêm vào giỏ
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          handleRemoveFromWishlist(product.id, product.name)
                        }
                        className="h-9 w-9"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Wishlist;
