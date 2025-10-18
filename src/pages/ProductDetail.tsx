import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AIAssistant from "@/components/AIAssistant";
import ProductCard from "@/components/ProductCard";
import { useToast } from "@/hooks/use-toast";
import { useWishlist } from "@/contexts/WishlistContext";

// Mock product data
const mockProduct = {
  id: 1,
  name: "Bộ Hoa Quả Tốt Nghiệp Cao Cấp",
  price: 299000,
  originalPrice: 399000,
  images: [
    "https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1572635196243-4dd75fbdbd7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  ],
  rating: 4.8,
  reviews: 124,
  category: "Hoa Quả",
  inStock: true,
  stockCount: 15,
  isNew: true,
  isBestSeller: true,
  description:
    "Bộ hoa quả cao cấp được tuyển chọn kỹ lưỡng, bao gồm 5 loại hoa quả tươi ngon nhất, mang ý nghĩa cát tường cho lễ tốt nghiệp. Mỗi món đều được chuẩn bị với tâm huyết để tạo nên một mâm cúng hoàn hảo.",
  features: [
    "5 loại hoa quả tươi ngon được tuyển chọn",
    "Ý nghĩa cát tường cho lễ tốt nghiệp",
    "Đóng gói cẩn thận, đảm bảo chất lượng",
    "Có thể tùy chỉnh theo yêu cầu",
  ],
  specifications: [
    { label: "Xuất xứ", value: "Việt Nam" },
    { label: "Bảo quản", value: "Nơi khô ráo, thoáng mát" },
    { label: "Hạn sử dụng", value: "3-5 ngày" },
    { label: "Trọng lượng", value: "2-3 kg" },
  ],
};

const relatedProducts = [
  {
    id: 2,
    name: "Bó Hương Nụ Tâm An",
    price: 149000,
    image:
      "https://images.unsplash.com/photo-1594736797933-d0aa48ad0db6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    rating: 5,
    reviews: 89,
    category: "Hương Nến",
    isBestSeller: true,
  },
  {
    id: 4,
    name: "Hoa Sen Tươi Phúc Lộc",
    price: 179000,
    image:
      "https://images.unsplash.com/photo-1528475478853-5bb5d2dd637f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    rating: 5,
    reviews: 156,
    category: "Hoa Tươi",
    isNew: true,
  },
  {
    id: 6,
    name: "Trà Hoa Cúc Thanh Tịnh",
    price: 129000,
    originalPrice: 159000,
    image:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    rating: 5,
    reviews: 203,
    category: "Đồ Uống",
  },
];

const ProductDetail = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const product = mockProduct; // In real app, fetch by id
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  const handleAddToCart = () => {
    toast({
      title: "Đã thêm vào giỏ hàng!",
      description: `${product.name} x${quantity}`,
    });
  };

  const handleAddToWishlist = () => {
    const productForWishlist = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      rating: product.rating,
      reviews: product.reviews,
      category: product.category,
      originalPrice: product.originalPrice,
      isNew: product.isNew,
      isBestSeller: product.isBestSeller,
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
          <span>Sản phẩm</span>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border border-border">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 transition-smooth ${
                    selectedImage === index
                      ? "border-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.isNew && (
                <Badge className="bg-accent text-accent-foreground">Mới</Badge>
              )}
              {product.isBestSeller && (
                <Badge className="bg-secondary text-secondary-foreground">
                  Bán chạy
                </Badge>
              )}
              {discount > 0 && (
                <Badge className="bg-primary text-primary-foreground">
                  -{discount}%
                </Badge>
              )}
              <Badge variant="secondary">{product.category}</Badge>
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
                        i < Math.floor(product.rating)
                          ? "text-secondary fill-current"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {product.rating} ({product.reviews} đánh giá)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      product.inStock ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <span className="text-sm text-muted-foreground">
                    {product.inStock
                      ? `Còn ${product.stockCount} sản phẩm`
                      : "Hết hàng"}
                  </span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-primary">
                {product.price.toLocaleString("vi-VN")}đ
              </span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  {product.originalPrice.toLocaleString("vi-VN")}đ
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
                      setQuantity(Math.min(product.stockCount, quantity + 1))
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
                  disabled={!product.inStock}
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
            <Card className="bg-gradient-card border-border/50">
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

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-16">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Mô tả</TabsTrigger>
            <TabsTrigger value="specifications">Thông số</TabsTrigger>
            <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Đặc điểm nổi bật
                </h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Thông số kỹ thuật
                </h3>
                <div className="space-y-3">
                  {product.specifications.map((spec, index) => (
                    <div
                      key={index}
                      className="flex justify-between py-2 border-b border-border/50 last:border-0"
                    >
                      <span className="font-medium text-foreground">
                        {spec.label}:
                      </span>
                      <span className="text-muted-foreground">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Đánh giá từ khách hàng
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 border border-border rounded-lg">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                      N
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">Nguyễn Thu Hương</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 text-secondary fill-current"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Sản phẩm rất tươi ngon, đóng gói cẩn thận. Rất hài lòng
                        với chất lượng dịch vụ.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Sản Phẩm Liên Quan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>
      </div>

      <Footer />
      <AIAssistant />
    </div>
  );
};

export default ProductDetail;
