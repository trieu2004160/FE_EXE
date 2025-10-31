import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  ShoppingCart,
  Star,
  Minus,
  Plus,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Clock,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AIAssistant from "@/components/AIAssistant";
import ProductCard from "@/components/ProductCard";
import ShopInfo from "@/components/ShopInfo";
import { useToast } from "@/hooks/use-toast";
import { useWishlist } from "@/contexts/WishlistContext";
import {
  apiService,
  Product,
  ProductDetailResponse,
  ProductReview,
} from "@/services/apiService";

import { mockProducts } from "@/data/mockData";

// Fallback product data
const fallbackProduct: Product = {
  id: 1,
  name: "Bộ Hoa Quả Tốt Nghiệp Cao Cấp",
  basePrice: 299000,
  maxPrice: 399000,
  imageUrl:
    "https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  isPopular: true,
  stockQuantity: 15,
  productCategoryId: 1,
  description:
    "Bộ hoa quả cao cấp được tuyển chọn kỹ lưỡng, bao gồm 5 loại hoa quả tươi ngon nhất, mang ý nghĩa cát tường cho lễ tốt nghiệp.",
  features:
    "5 loại hoa quả tươi ngon được tuyển chọn\nÝ nghĩa cát tường cho lễ tốt nghiệp\nĐóng gói cẩn thận, đảm bảo chất lượng\nCó thể tùy chỉnh theo yêu cầu",
  specifications:
    "Xuất xứ: Việt Nam\nBảo quản: Nơi khô ráo, thoáng mát\nHạn sử dụng: 3-5 ngày\nTrọng lượng: 2-3 kg",
  shop: {
    id: 1,
    shopName: "Shop Đồ Cúng Tâm Linh",
  },
  reviews: [],
};

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // State management
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Review form state
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        // Only use API data - no fallback to mock data
        const productId = parseInt(id);
        const response: any = await apiService.getProductById(productId);

        // Backend returns PascalCase (Product, RelatedProducts), map to camelCase
        const product = response.product || response.Product;
        const relatedProducts =
          response.relatedProducts || response.RelatedProducts || [];

        if (!product) {
          throw new Error("Product not found in response");
        }

        setProduct(product);
        setRelatedProducts(
          Array.isArray(relatedProducts) ? relatedProducts : []
        );

        // Fetch reviews separately
        try {
          const productReviews = await apiService.getProductReviews(productId);
          setReviews(productReviews);
        } catch (reviewError) {
          console.warn("Failed to fetch reviews:", reviewError);
          setReviews([]);
        }
      } catch (apiError: any) {
        console.error("Error fetching product:", apiError);
        setError(
          apiError?.message || "Không thể tải sản phẩm. Vui lòng thử lại sau."
        );

        // Fallback to mock data when API is not available (only for development)
        if (process.env.NODE_ENV === "development") {
          console.warn("Using fallback data in development mode");
          setProduct(fallbackProduct);
          setRelatedProducts([]);
          setReviews([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  // Calculate discount
  const discount =
    product?.maxPrice && product.maxPrice > product.basePrice
      ? Math.round(
          ((product.maxPrice - product.basePrice) / product.maxPrice) * 100
        )
      : 0;

  // Get shop info
  const shop = product?.shop
    ? {
        id: product.shop.id,
        name: product.shop.shopName,
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        description:
          "Chuyên cung cấp đồ cúng, hoa quả, hương nến chất lượng cao.",
        address: "123 Lê Lợi, Quận 1, TP.HCM",
        phone: "0909 123 456",
        email: "shop1@email.com",
        isVerified: true,
        rating: 4.9,
        totalSales: 1200,
        totalProducts: 25,
        joinedDate: "2023-01-15",
      }
    : null;

  const handleAddToCart = () => {
    if (!product) return;

    toast({
      title: "Đã thêm vào giỏ hàng!",
      description: `${product.name} x${quantity}`,
    });
  };

  const handleAddToWishlist = () => {
    if (!product) return;

    const productForWishlist = {
      id: product.id,
      name: product.name,
      price: product.basePrice,
      image: product.imageUrl || "",
      rating: 4.5, // Default rating since API doesn't provide it
      reviews: reviews.length,
      category: "Product", // Default category
      originalPrice: product.maxPrice,
      isNew: false, // Default values
      isBestSeller: product.isPopular,
      shopId: product.shop?.id || 1,
    };

    const inWishlist = isInWishlist(product.id);
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast({
        title: "Đã xóa khỏi yêu thích",
        description: product.name,
      });
    } else {
      addToWishlist(productForWishlist);
      toast({
        title: "Đã thêm vào yêu thích!",
        description: product.name,
      });
    }
  };

  const handleSubmitReview = async () => {
    if (!product || reviewRating === 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn đánh giá từ 1-5 sao",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingReview(true);

    try {
      await apiService.createProductReview(product.id, {
        rating: reviewRating,
        comment: reviewComment.trim() || undefined,
      });

      toast({
        title: "Cảm ơn bạn!",
        description: "Đánh giá của bạn đã được gửi thành công",
      });

      // Reset form
      setReviewRating(0);
      setReviewComment("");

      // Refresh reviews
      try {
        const productReviews = await apiService.getProductReviews(product.id);
        setReviews(productReviews);
      } catch (error) {
        console.warn("Failed to refresh reviews:", error);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Lỗi",
        description: "Không thể gửi đánh giá. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Không thể tải sản phẩm</p>
          <Button onClick={() => navigate(-1)}>Quay lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
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
          <span>Sản phẩm</span>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        {/* Product Main Info Card */}
        <Card className="bg-white mb-8">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Product Images */}
              <div className="space-y-3">
                {/* Ảnh chính */}
                <div className="w-full overflow-hidden rounded-lg border border-border bg-white relative">
                  <img
                    src={product.imageUrl || "https://via.placeholder.com/800x800?text=No+Image"}
                    alt={product.name}
                    className="w-full h-[450px] object-cover"
                    style={{
                      imageRendering: '-webkit-optimize-contrast',
                      imageRendering: 'crisp-edges',
                      backfaceVisibility: 'hidden',
                      transform: 'translateZ(0)',
                      WebkitTransform: 'translateZ(0)',
                    }}
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://via.placeholder.com/800x800?text=No+Image";
                    }}
                  />
                </div>

                {/* Ảnh nhỏ (hiện tại chỉ 1 ảnh, nhưng để sẵn grid cho mở rộng sau này) */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  <div className="overflow-hidden rounded-lg border-2 border-red-500 bg-white cursor-pointer hover:border-primary transition-colors">
                    <img
                      src={product.imageUrl || "https://via.placeholder.com/200x200?text=No+Image"}
                      alt={product.name}
                      className="w-full h-32 object-cover"
                      style={{
                        imageRendering: '-webkit-optimize-contrast',
                        imageRendering: 'crisp-edges',
                        backfaceVisibility: 'hidden',
                        transform: 'translateZ(0)',
                      }}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/200x200?text=No+Image";
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  {product.isPopular && (
                    <Badge className="bg-secondary text-secondary-foreground">
                      Bán chạy
                    </Badge>
                  )}
                  {discount > 0 && (
                    <Badge className="bg-primary text-primary-foreground">
                      -{discount}%
                    </Badge>
                  )}
                  <Badge variant="secondary">Sản phẩm</Badge>
                </div>

                {/* Title & Rating */}
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-4">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < 4 // Default 4-star rating
                              ? "text-secondary fill-current"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-muted-foreground">
                        4.5 ({reviews.length} đánh giá)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          product.stockQuantity > 0
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      />
                      <span className="text-sm text-muted-foreground">
                        {product.stockQuantity > 0
                          ? `Còn ${product.stockQuantity} sản phẩm`
                          : "Hết hàng"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-primary">
                    {product.basePrice.toLocaleString("vi-VN")}đ
                  </span>
                  {product.maxPrice && product.maxPrice > product.basePrice && (
                    <span className="text-xl text-muted-foreground line-through">
                      {product.maxPrice.toLocaleString("vi-VN")}đ
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>

                {/* Quantity & Actions */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-foreground">
                      Số lượng:
                    </label>
                    <div className="flex items-center border border-border rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="h-10 w-10"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-16 text-center font-semibold">
                        {quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setQuantity(
                            Math.min(product.stockQuantity, quantity + 1)
                          )
                        }
                        className="h-10 w-10"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleAddToCart}
                      className="flex-1 bg-gradient-primary text-primary-foreground hover:shadow-glow transition-bounce"
                      size="lg"
                      disabled={product.stockQuantity <= 0}
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Thêm vào giỏ
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleAddToWishlist}
                      className={
                        isInWishlist(product.id)
                          ? "text-primary border-primary"
                          : ""
                      }
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          isInWishlist(product.id) ? "fill-current" : ""
                        }`}
                      />
                    </Button>
                    <Button variant="outline" size="lg">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Features */}
                <Card className="bg-gray-50 border-border/50">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Truck className="h-5 w-5 text-primary" />
                        <span className="text-sm">Giao hàng miễn phí</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-accent" />
                        <span className="text-sm">Đảm bảo chất lượng</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <RotateCcw className="h-5 w-5 text-secondary" />
                        <span className="text-sm">Đổi trả 24h</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-primary" />
                        <span className="text-sm">Giao hàng nhanh</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Details Tabs Card */}
        <Card className="bg-white mb-8">
          <CardContent className="p-8">
            <Tabs defaultValue="description">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Mô tả</TabsTrigger>
                <TabsTrigger value="specifications">Thông số</TabsTrigger>
                <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6">
                <div className="space-y-6">
                  <Card className="bg-gray-50">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-foreground mb-4">
                        Đặc điểm nổi bật
                      </h3>
                      <ul className="space-y-2">
                        {product.features ? (
                          // Split by both newline and semicolon, then filter empty strings
                          product.features
                            .split(/[\n;]/)
                            .map((feature) => feature.trim())
                            .filter((feature) => feature.length > 0)
                            .map((feature, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2"
                              >
                                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                                <span className="text-muted-foreground">
                                  {feature}
                                </span>
                              </li>
                            ))
                        ) : (
                          <li className="text-muted-foreground">
                            Không có thông tin đặc điểm
                          </li>
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="specifications" className="mt-6">
                <Card className="bg-gray-50">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      Thông số kỹ thuật
                    </h3>
                    {(() => {
                      // Handle specifications - can be object, JSON string, or string
                      let specs: Record<string, string> | null = null;

                      if (!product.specifications) {
                        return (
                          <div className="text-center py-8 text-muted-foreground">
                            Không có thông số kỹ thuật
                          </div>
                        );
                      }

                      // Case 1: Already an object (Dictionary from backend)
                      if (
                        typeof product.specifications === "object" &&
                        !Array.isArray(product.specifications)
                      ) {
                        specs = product.specifications as Record<
                          string,
                          string
                        >;
                      }
                      // Case 2: JSON string - try to parse
                      else if (typeof product.specifications === "string") {
                        try {
                          // Try parsing as JSON first
                          const parsed = JSON.parse(product.specifications);
                          if (
                            typeof parsed === "object" &&
                            !Array.isArray(parsed)
                          ) {
                            specs = parsed;
                          }
                        } catch (e) {
                          // If not JSON, treat as plain string format (backward compatibility)
                          // Format: "Key: Value\nKey2: Value2"
                          const lines = product.specifications.split("\n");
                          const parsedSpecs: Record<string, string> = {};
                          lines.forEach((line) => {
                            const trimmed = line.trim();
                            if (trimmed) {
                              const colonIndex = trimmed.indexOf(":");
                              if (colonIndex > -1) {
                                const key = trimmed
                                  .substring(0, colonIndex)
                                  .trim();
                                const value = trimmed
                                  .substring(colonIndex + 1)
                                  .trim();
                                if (key) {
                                  parsedSpecs[key] = value || "N/A";
                                }
                              }
                            }
                          });
                          if (Object.keys(parsedSpecs).length > 0) {
                            specs = parsedSpecs;
                          }
                        }
                      }

                      // Display specifications as table
                      if (specs && Object.keys(specs).length > 0) {
                        return (
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                              <tbody>
                                {Object.entries(specs).map(
                                  ([key, value], index) => (
                                    <tr
                                      key={index}
                                      className="border-b border-border/50 last:border-0 hover:bg-gray-100/50 transition-colors"
                                    >
                                      <td className="py-3 px-4 font-medium text-foreground align-top w-1/3">
                                        {key}
                                      </td>
                                      <td className="py-3 px-4 text-muted-foreground align-top">
                                        {value || "N/A"}
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        );
                      }

                      // No valid specifications found
                      return (
                        <div className="text-center py-8 text-muted-foreground">
                          Không có thông số kỹ thuật
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-6">
                  {/* Add Review Form */}

                  {/* Reviews List */}
                  <Card className="bg-gray-50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-foreground">
                          Đánh giá từ khách hàng ({reviews.length})
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            Sắp xếp:
                          </span>
                          <select
                            className="text-sm border border-border rounded px-2 py-1"
                            title="Sắp xếp đánh giá"
                          >
                            <option>Mới nhất</option>
                            <option>Cũ nhất</option>
                            <option>Đánh giá cao</option>
                            <option>Đánh giá thấp</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {reviews.length > 0 ? (
                          reviews.map((review) => (
                            <div
                              key={review.id}
                              className="flex items-start gap-4 p-4 border border-border rounded-lg bg-white"
                            >
                              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                                {review.user?.fullName?.charAt(0) || "U"}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-semibold text-foreground">
                                    {review.user?.fullName || "Khách hàng"}
                                  </span>
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${
                                          i < review.rating
                                            ? "text-yellow-400 fill-current"
                                            : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-muted-foreground ml-2">
                                    {new Date(
                                      review.createdAt
                                    ).toLocaleDateString("vi-VN")}
                                  </span>
                                </div>
                                <p className="text-muted-foreground text-sm leading-relaxed mb-2">
                                  {review.comment ||
                                    "Khách hàng đã đánh giá sản phẩm này."}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <button className="hover:text-primary transition-colors">
                                    👍 Hữu ích (0)
                                  </button>
                                  <button className="hover:text-primary transition-colors">
                                    💬 Trả lời
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <p>Chưa có đánh giá nào cho sản phẩm này.</p>
                            <p className="text-sm">
                              Hãy là người đầu tiên đánh giá!
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Load More Reviews */}
                      <div className="text-center mt-6">
                        <Button variant="outline" size="lg">
                          Xem thêm đánh giá
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-foreground mb-4">
                        Viết đánh giá
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">
                            Đánh giá của bạn
                          </label>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <button
                                key={i}
                                className={`h-8 w-8 transition-colors ${
                                  i < reviewRating
                                    ? "text-yellow-400"
                                    : "text-gray-300 hover:text-yellow-400"
                                }`}
                                title={`Đánh giá ${i + 1} sao`}
                                onClick={() => setReviewRating(i + 1)}
                              >
                                <Star className="h-full w-full" />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">
                            Nhận xét
                          </label>
                          <textarea
                            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                            className="w-full p-3 border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            rows={4}
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                          />
                        </div>
                        <div className="flex gap-3">
                          <Button
                            className="bg-primary hover:bg-primary/90"
                            onClick={handleSubmitReview}
                            disabled={isSubmittingReview || reviewRating === 0}
                          >
                            {isSubmittingReview
                              ? "Đang gửi..."
                              : "Gửi đánh giá"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setReviewRating(0);
                              setReviewComment("");
                            }}
                          >
                            Hủy
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        {/* Shop Information Card */}
        {shop && (
          <Card className="bg-white mb-8">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Thông tin cửa hàng
                  </h2>
                  <p className="text-muted-foreground">
                    Tìm hiểu thêm về shop bán sản phẩm này
                  </p>
                </div>
                <ShopInfo shop={shop} />
              </div>
            </CardContent>
          </Card>
        )}
        {/* Related Products Card */}
        <Card className="bg-white mb-8">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Sản Phẩm Liên Quan
                </h2>
                <p className="text-muted-foreground">
                  Khám phá thêm các sản phẩm tương tự
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {relatedProducts.length > 0 ? (
                  relatedProducts.map((relatedProduct) => (
                    <ProductCard
                      key={relatedProduct.id}
                      id={relatedProduct.id}
                      name={relatedProduct.name}
                      price={relatedProduct.basePrice}
                      originalPrice={relatedProduct.maxPrice}
                      image={relatedProduct.imageUrl || ""}
                      rating={4.5}
                      reviews={0}
                      category="Sản phẩm"
                      shopId={relatedProduct.shop?.id || 1}
                      isBestSeller={relatedProduct.isPopular}
                      isNew={false}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    <p>Không có sản phẩm liên quan</p>
                  </div>
                )}
              </div>

              <div className="text-center pt-4">
                <Button variant="outline" size="lg" className="px-8">
                  Xem thêm sản phẩm
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
      <AIAssistant />
    </div>
  );
};

export default ProductDetail;
