import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, X, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AIAssistant from "@/components/AIAssistant";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
}

const mockCartItems: CartItem[] = [
  {
    id: 1,
    name: "Bộ Hoa Quả Tốt Nghiệp Cao Cấp",
    price: 299000,
    image:
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    quantity: 1,
    category: "Hoa Quả",
  },
  {
    id: 2,
    name: "Bó Hương Nụ Tâm An",
    price: 149000,
    image:
      "https://vach-ngan.com/uploads/images/Nhang%20N%E1%BB%A5%20Tr%E1%BA%A7m%20H%C6%B0%C6%A1ng%20An%20Y%C3%AAn.png",
    quantity: 2,
    category: "Hương Nến",
  },
  {
    id: 4,
    name: "Hoa Sen Tươi Phúc Lộc",
    price: 179000,
    image: "https://nongsandalat.vn/wp-content/uploads/2023/10/sen.jpg",
    quantity: 1,
    category: "Hoa Tươi",
  },
];

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);
  const [promoCode, setPromoCode] = useState("");

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id);
      return;
    }
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 500000 ? 0 : 30000;
  const discount = promoCode === "TOTNGHIEP10" ? subtotal * 0.1 : 0;
  const total = subtotal + shipping - discount;

  const applyPromoCode = () => {
    if (promoCode === "TOTNGHIEP10") {
      // Promo code applied successfully
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <Header />
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-12 max-w-2xl mx-auto">
              <ShoppingBag className="h-24 w-24 text-[#A67C42] mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Giỏ hàng trống
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
              </p>
              <Button
                size="lg"
                className="bg-[#A67C42] hover:bg-[#8B6835] text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Tiếp tục mua sắm
              </Button>
            </div>
          </div>
        </section>
        <Footer />
        <AIAssistant />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <Header />

      {/* Page Header với hình nền */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage: `url(https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#A67C42]/90 via-[#C99F4D]/90 to-[#A67C42]/90" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-full mb-6">
            <ShoppingBag className="w-5 h-5 text-white" />
            <span className="text-sm font-medium text-white">
              Giỏ hàng của bạn
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
            Giỏ Hàng
          </h1>
          <p className="text-xl text-white/95 max-w-2xl mx-auto">
            Xem lại đơn hàng và hoàn tất thanh toán
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center text-gray-800">
                    <ShoppingBag className="h-5 w-5 mr-2 text-[#A67C42]" />
                    Sản phẩm trong giỏ ({cartItems.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl bg-white hover:shadow-lg transition-all duration-300"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-xl shadow-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-2">
                          {item.name}
                        </h3>
                        <Badge className="bg-[#A67C42]/10 text-[#A67C42] hover:bg-[#A67C42]/20 text-xs mb-2 border-none">
                          {item.category}
                        </Badge>
                        <p className="text-xl font-bold text-[#A67C42]">
                          {item.price.toLocaleString("vi-VN")}đ
                        </p>
                      </div>
                      <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="h-9 w-9 border-[#A67C42]/30 hover:bg-[#A67C42] hover:text-white transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="h-9 w-9 border-[#A67C42]/30 hover:bg-[#A67C42] hover:text-white transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4 border-none shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-gray-800">
                    Tóm tắt đơn hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {/* Promo Code */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <Tag className="w-4 h-4 mr-2 text-[#A67C42]" />
                      Mã giảm giá
                    </label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Nhập mã giảm giá"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="border-gray-300 focus:border-[#A67C42] focus:ring-[#A67C42] focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      <Button
                        onClick={applyPromoCode}
                        className="bg-[#A67C42] hover:bg-[#8B6835] text-white px-5"
                      >
                        Áp dụng
                      </Button>
                    </div>
                    {promoCode === "TOTNGHIEP10" && (
                      <p className="text-sm text-green-600 mt-2 font-medium">
                        ✓ Giảm 10% cho lễ tốt nghiệp
                      </p>
                    )}
                  </div>

                  <Separator className="bg-gray-200" />

                  {/* Price Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Tạm tính</span>
                      <span className="font-semibold text-gray-800">
                        {subtotal.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Phí vận chuyển</span>
                      <span className="font-semibold text-gray-800">
                        {shipping === 0 ? (
                          <span className="text-green-600">Miễn phí</span>
                        ) : (
                          `${shipping.toLocaleString("vi-VN")}đ`
                        )}
                      </span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Giảm giá</span>
                        <span className="font-semibold">
                          -{discount.toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                    )}
                    {shipping === 0 && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm text-green-700 font-medium">
                          Miễn phí vận chuyển cho đơn hàng trên 500,000đ
                        </p>
                      </div>
                    )}
                  </div>

                  <Separator className="bg-gray-200" />

                  <div className="flex justify-between text-xl font-bold bg-gradient-to-r from-[#A67C42]/10 to-[#C99F4D]/10 p-4 rounded-xl">
                    <span className="text-gray-800">Tổng cộng</span>
                    <span className="text-[#A67C42]">
                      {total.toLocaleString("vi-VN")}đ
                    </span>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-[#A67C42] to-[#C99F4D] hover:from-[#8B6835] hover:to-[#A67C42] text-white py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    Tiến hành thanh toán
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full border-2 border-[#A67C42] text-[#A67C42] hover:bg-[#A67C42] hover:text-white py-6 text-lg rounded-xl transition-all duration-300"
                  >
                    Tiếp tục mua sắm
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <AIAssistant />
    </div>
  );
};

export default Cart;
