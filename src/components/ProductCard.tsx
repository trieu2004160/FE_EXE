import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Product, ProductReview } from "@/services/apiService";
import { getProductImageUrl } from "@/utils/imageUtils";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/apiService";

// Helper to map category ID to name (temporary)
const getCategoryName = (id: number) => {
  const map: Record<number, string> = {
    1: "Hoa Tươi",
    2: "Hương Nến",
    3: "Xôi Chè",
    4: "Combo"
  };
  return map[id] || "Sản phẩm";
};

interface ProductCardProps extends Product {
  reviews?: ProductReview[];
}

const ProductCard = (product: ProductCardProps) => {
  const {
    id,
    name,
    basePrice,
    maxPrice,
    images,
    isPopular,
    productCategoryId,
    reviews,
  } = product;

  // Calculate rating from reviews if available
  const rating = reviews && reviews.length > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 5; // Default 5 stars

  const reviewCount = reviews?.length || 0;

  // Image handling
  const imageUrl = getProductImageUrl(product);

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const navigate = useNavigate();

  const discount = maxPrice && maxPrice > basePrice
    ? Math.round(((maxPrice - basePrice) / maxPrice) * 100)
    : 0;

  const isWishlisted = isInWishlist(id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlisted) {
      removeFromWishlist(id);
      toast({
        title: "Đã xóa khỏi danh sách yêu thích",
        description: `${name} đã được xóa`,
      });
    } else {
      // Map to Wishlist format if needed, or update WishlistContext to accept Product
      // For now, assuming WishlistContext expects something similar to Product
      // We might need to cast or map if WishlistContext uses the old mockData Product interface
      addToWishlist({
        ...product,
        price: basePrice,
        originalPrice: maxPrice,
        image: imageUrl || "",
        category: getCategoryName(productCategoryId),
        rating: rating,
        reviews: reviewCount,
        isNew: false,
        isBestSeller: isPopular,
        shopId: product.shopId || 1
      } as any); // Temporary cast to avoid type errors with WishlistContext
      toast({
        title: "Đã thêm vào danh sách yêu thích",
        description: `${name} đã được thêm`,
      });
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      // Check if user is authenticated
      const token = localStorage.getItem('userToken');
      if (!token || token === 'authenticated') {
        toast({
          title: "Vui lòng đăng nhập",
          description: "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      // Call API to add item to cart
      await apiService.addToCart(id, 1);

      // Dispatch custom event to update cart count in Header
      window.dispatchEvent(new Event("cartUpdated"));

      toast({
        title: "Đã thêm vào giỏ hàng!",
        description: `${name} đã được thêm vào giỏ hàng`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      const errorMessage = error instanceof Error ? error.message : "Không thể thêm vào giỏ hàng. Vui lòng thử lại.";
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="group border rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-900 overflow-hidden m-2 ">
      <Link to={`/product/${id}`}>
        <div className="relative">
          <img
            src={imageUrl || "/assets/no-image.png"}
            alt={name}
            className="w-full h-52 object-cover transition-transform duration-100 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/assets/no-image.png";
            }}
          />
        </div>
      </Link>
      <CardFooter className="p-4 pt-0 mt-auto">
        <Button
          className="w-full h-9 text-sm bg-[#C99F4D] hover:bg-[#B8904A] text-white"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-1.5" />
          Thêm vào giỏ
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
