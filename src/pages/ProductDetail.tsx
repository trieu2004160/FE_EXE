import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart, ShoppingCart, Star, Minus, Plus, Share2, Truck, Shield, RotateCcw, Clock, ArrowLeft, Loader2,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AIAssistant from "@/components/AIAssistant";
import ShopInfo from "@/components/ShopInfo";
import { useToast } from "@/hooks/use-toast";
import { useWishlist } from "@/contexts/WishlistContext";
import { apiService, Product } from "@/services/apiService";

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>(""); // Ảnh đang được chọn để xem
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        // 1. Gọi API lấy chi tiết
        const productData: any = await apiService.getProductById(id);

        // 2. Xử lý ảnh
        const imagesList = productData.images || productData.Images || [];
        let mainImage = "https://placehold.co/600x400?text=No+Image";

        if (imagesList.length > 0) {
          mainImage = imagesList[0].url || imagesList[0].Url;
        } else if (productData.imageUrl) {
          mainImage = productData.imageUrl;
        }

        const normalizedProduct = {
          ...productData,
          id: productData.id || productData.Id,
          name: productData.name || productData.Name,
          basePrice: productData.basePrice || productData.BasePrice,
          maxPrice: productData.maxPrice || productData.MaxPrice,
          description: productData.description || productData.Description,
          stockQuantity: productData.stockQuantity || productData.StockQuantity,
          features: productData.features || productData.Features,
          specifications: productData.specifications || productData.Specifications,
          imageUrl: mainImage,
          images: imagesList
        };

        setProduct(normalizedProduct);
        setSelectedImage(mainImage); // Mặc định chọn ảnh đầu tiên

      } catch (apiError: any) {
        console.error("Error fetching product:", apiError);
        setError("Không thể tải sản phẩm.");
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      const token = localStorage.getItem("userToken") || localStorage.getItem("token");
      if (!token) {
        toast({ title: "Vui lòng đăng nhập", variant: "destructive" });
        navigate("/login");
        return;
      }
      await apiService.addItemToCart({ productId: product.id, quantity });
      window.dispatchEvent(new Event("cartUpdated"));
      toast({ title: "Đã thêm vào giỏ hàng!", description: `${product.name} x${quantity}` });
    } catch (error) {
      toast({ title: "Lỗi", description: "Không thể thêm vào giỏ hàng.", variant: "destructive" });
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center"><Loader2 className="animate-spin" /></div>;
  if (!product) return <div className="min-h-screen flex justify-center items-center">Không tìm thấy sản phẩm</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 pl-0 hover:bg-transparent">
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
        </Button>

        <Card className="bg-white mb-8">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* --- PHẦN ẢNH SẢN PHẨM --- */}
              <div className="space-y-3">
                {/* Ảnh lớn */}
                <div className="w-full overflow-hidden rounded-lg border border-border bg-white">
                  <img
                    src={selectedImage}
                    alt={product.name}
                    className="w-full h-[450px] object-contain" // Dùng object-contain để thấy hết ảnh
                  />
                </div>
                {/* List ảnh nhỏ */}
                <div className="grid grid-cols-5 gap-2">
                  {product.images && product.images.map((img: any, idx: number) => (
                    <div
                      key={idx}
                      className={`cursor-pointer border rounded overflow-hidden h-20 ${selectedImage === img.url ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'}`}
                      onClick={() => setSelectedImage(img.url)}
                    >
                      <img src={img.url} className="w-full h-full object-cover" alt="thumbnail" />
                    </div>
                  ))}
                </div>
              </div>

              {/* --- THÔNG TIN SẢN PHẨM --- */}
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-primary">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.basePrice)}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex border rounded-md">
                    <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus className="h-4 w-4" /></Button>
                    <span className="w-12 flex items-center justify-center font-bold">{quantity}</span>
                    <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)}><Plus className="h-4 w-4" /></Button>
                  </div>
                  <Button onClick={handleAddToCart} size="lg" className="flex-1 bg-primary text-white">
                    <ShoppingCart className="mr-2 h-5 w-5" /> Thêm vào giỏ
                  </Button>
                  <Button variant="outline" size="icon"><Heart className="h-5 w-5" /></Button>
                </div>

                {/* Mô tả ngắn */}
                <div className="prose max-w-none text-gray-600">
                  <p>{product.description}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thông tin chi tiết & Đánh giá */}
        <Card className="bg-white">
          <CardContent className="p-6">
            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">Chi tiết & Thông số</TabsTrigger>
                <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="mt-4 space-y-4">
                <h3 className="font-bold text-lg">Đặc điểm nổi bật</h3>
                <p>{product.features || "Đang cập nhật..."}</p>

                <h3 className="font-bold text-lg mt-4">Thông số kỹ thuật</h3>
                {/* Render specifications nếu có */}
                {product.specifications && (
                  <pre className="bg-gray-50 p-4 rounded text-sm overflow-auto">
                    {typeof product.specifications === 'string' ? product.specifications : JSON.stringify(product.specifications, null, 2)}
                  </pre>
                )}
              </TabsContent>
              <TabsContent value="reviews" className="mt-4">
                <p className="text-gray-500">Chức năng đánh giá đang được cập nhật.</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <Footer />
      <AIAssistant />
    </div>
  );
};

export default ProductDetail;