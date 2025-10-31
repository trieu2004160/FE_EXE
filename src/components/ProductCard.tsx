import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Product } from "@/data/mockData";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/hooks/use-toast";

type ProductCardProps = Product;

const ProductCard = (product: ProductCardProps) => {
  const {
    id,
    name,
    price,
    originalPrice,
    image,
    rating,
    reviews,
    category,
    isNew,
    isBestSeller,
  } = product;

  // Support both 'image' (from mockData) and 'imageUrl' (from API)
  const imageUrl = (product as any).imageUrl || image;

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
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
      addToWishlist(product);
      toast({
        title: "Đã thêm vào danh sách yêu thích",
        description: `${name} đã được thêm`,
      });
    }
  };

  return (
    <Card className="group border rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-900 overflow-hidden m-2 ">
      <Link to={`/product/${id}`}>
        <div className="relative">
          <img
            src={imageUrl || "https://via.placeholder.com/400x300?text=No+Image"}
            alt={name}
            className="w-full h-52 object-cover transition-transform duration-100 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://via.placeholder.com/400x300?text=No+Image";
            }}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {isNew && (
              <Badge className="bg-green-500 text-white text-xs">Mới</Badge>
            )}
            {isBestSeller && (
              <Badge className="bg-orange-500 text-white text-xs">
                Bán chạy
              </Badge>
            )}
            {discount > 0 && (
              <Badge className="bg-red-500 text-white text-xs">
                -{discount}%
              </Badge>
            )}
          </div>

          {/* Wishlist */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-white/80 hover:bg-white transition"
            onClick={handleWishlistToggle}
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isWishlisted
                  ? "text-red-500 fill-current"
                  : "text-gray-600 hover:text-red-500"
              }`}
            />
          </Button>
        </div>
      </Link>

      <CardContent className="p-3">
        <Badge variant="secondary" className="text-xs mb-1">
          {category}
        </Badge>

        <Link to={`/product/${id}`}>
          <h3
            className="font-medium text-base mb-2 text-gray-800 line-clamp-2 
             group-hover:text-[#C99F4D] transition-colors duration-300"
          >
            {name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${
                i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-xs text-gray-500">({reviews})</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-slate-950">
            {price.toLocaleString("vi-VN")}đ
          </span>
          {originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              {originalPrice.toLocaleString("vi-VN")}đ
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-3 pt-0">
        <Button className="w-full h-9 text-sm bg-[#C99F4D] hover:bg-[#B8904A] text-white">
          <ShoppingCart className="h-4 w-4 mr-1.5" />
          Thêm vào giỏ
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
