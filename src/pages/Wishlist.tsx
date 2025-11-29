import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import ProductCard from "@/components/ProductCard";

const Wishlist = () => {
  const { wishlist, clearWishlist } = useWishlist();
  const { toast } = useToast();



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
                <ProductCard key={product.id} {...product} />
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
