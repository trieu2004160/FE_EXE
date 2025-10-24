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
import ShopInfo from "@/components/ShopInfo";
import { useToast } from "@/hooks/use-toast";
import { useWishlist } from "@/contexts/WishlistContext";
import { getShopById } from "@/data/mockData";

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
  shopId: 1,
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
      "https://vach-ngan.com/uploads/images/Nhang%20N%E1%BB%A5%20Tr%E1%BA%A7m%20H%C6%B0%C6%A1ng%20An%20Y%C3%AAn.png",
    rating: 5,
    reviews: 89,
    category: "Hương Nến",
    shopId: 2,
    isBestSeller: true,
  },
  {
    id: 4,
    name: "Hoa Sen Tươi Phúc Lộc",
    price: 179000,
    image: "https://nongsandalat.vn/wp-content/uploads/2023/10/sen.jpg",
    rating: 5,
    reviews: 156,
    category: "Hoa Tươi",
    shopId: 3,
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
    shopId: 1,
  },
];

const ProductDetail = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const product = mockProduct; // In real app, fetch by id
  const shop = getShopById(product.shopId);
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
      shopId: product.shopId,
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
                <div className="w-f overflow-hidden rounded-lg border border-border">
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-[450px] object-cover"
                  />
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`overflow-hidden rounded-lg border-2 transition-all ${
                        selectedImage === index
                          ? "border-red-500"
                          : "border-gray-200 hover:border-red-300"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-24 object-cover"
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
                    <Badge className="bg-accent text-accent-foreground">
                      Mới
                    </Badge>
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
                          setQuantity(
                            Math.min(product.stockCount, quantity + 1)
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
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <span className="text-muted-foreground">
                              {feature}
                            </span>
                          </li>
                        ))}
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
                <div className="space-y-6">
                  {/* Add Review Form */}

                  {/* Reviews List */}
                  <Card className="bg-gray-50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-foreground">
                          Đánh giá từ khách hàng ({product.reviews})
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
                        {/* Review Item */}
                        <div className="flex items-start gap-4 p-4 border border-border rounded-lg bg-white">
                          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                            N
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-foreground">
                                Nguyễn Thu Hương
                              </span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className="h-4 w-4 text-yellow-400 fill-current"
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground ml-2">
                                2 ngày trước
                              </span>
                            </div>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-2">
                              Sản phẩm rất tươi ngon, đóng gói cẩn thận. Rất hài
                              lòng với chất lượng dịch vụ. Shop giao hàng nhanh
                              và nhiệt tình.
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <button className="hover:text-primary transition-colors">
                                👍 Hữu ích (12)
                              </button>
                              <button className="hover:text-primary transition-colors">
                                💬 Trả lời
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Another Review */}
                        <div className="flex items-start gap-4 p-4 border border-border rounded-lg bg-white">
                          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            M
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-foreground">
                                Minh Đức
                              </span>
                              <div className="flex">
                                {[...Array(4)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className="h-4 w-4 text-yellow-400 fill-current"
                                  />
                                ))}
                                <Star className="h-4 w-4 text-gray-300" />
                              </div>
                              <span className="text-sm text-muted-foreground ml-2">
                                1 tuần trước
                              </span>
                            </div>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-2">
                              Chất lượng tốt, giá cả hợp lý. Sẽ mua lại lần sau.
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <button className="hover:text-primary transition-colors">
                                👍 Hữu ích (5)
                              </button>
                              <button className="hover:text-primary transition-colors">
                                💬 Trả lời
                              </button>
                            </div>
                          </div>
                        </div>
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
                                className="h-8 w-8 text-gray-300 hover:text-yellow-400 transition-colors"
                                title={`Đánh giá ${i + 1} sao`}
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
                          />
                        </div>
                        <div className="flex gap-3">
                          <Button className="bg-primary hover:bg-primary/90">
                            Gửi đánh giá
                          </Button>
                          <Button variant="outline">Hủy</Button>
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
                {relatedProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
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
