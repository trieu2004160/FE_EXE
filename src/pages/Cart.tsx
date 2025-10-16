import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react";
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
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    quantity: 1,
    category: "Hoa Quả"
  },
  {
    id: 2,
    name: "Bó Hương Nụ Tâm An",
    price: 149000,
    image: "https://images.unsplash.com/photo-1594736797933-d0aa48ad0db6?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    quantity: 2,
    category: "Hương Nến"
  },
  {
    id: 4,
    name: "Hoa Sen Tươi Phúc Lộc",
    price: 179000,
    image: "https://images.unsplash.com/photo-1528475478853-5bb5d2dd637f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    quantity: 1,
    category: "Hoa Tươi"
  }
];

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);
  const [promoCode, setPromoCode] = useState("");

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id);
      return;
    }
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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
      <div className="min-h-screen bg-background">
        <Header />
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Giỏ hàng trống
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
            </p>
            <Button size="lg" className="bg-gradient-primary text-primary-foreground">
              Tiếp tục mua sắm
            </Button>
          </div>
        </section>
        <Footer />
        <AIAssistant />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Page Header */}
      <section className="bg-gradient-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Giỏ Hàng
          </h1>
          <p className="text-xl text-primary-foreground/90">
            Xem lại đơn hàng và hoàn tất thanh toán
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Sản phẩm trong giỏ ({cartItems.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{item.name}</h3>
                        <Badge variant="secondary" className="text-xs mb-2">
                          {item.category}
                        </Badge>
                        <p className="text-lg font-bold text-primary">
                          {item.price.toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Tóm tắt đơn hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Promo Code */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Mã giảm giá
                    </label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Nhập mã giảm giá"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                      />
                      <Button variant="outline" onClick={applyPromoCode}>
                        Áp dụng
                      </Button>
                    </div>
                    {promoCode === "TOTNGHIEP10" && (
                      <p className="text-sm text-accent mt-1">✓ Giảm 10% cho lễ tốt nghiệp</p>
                    )}
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tạm tính</span>
                      <span className="font-semibold">{subtotal.toLocaleString('vi-VN')}đ</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phí vận chuyển</span>
                      <span className="font-semibold">
                        {shipping === 0 ? "Miễn phí" : `${shipping.toLocaleString('vi-VN')}đ`}
                      </span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-accent">
                        <span>Giảm giá</span>
                        <span className="font-semibold">-{discount.toLocaleString('vi-VN')}đ</span>
                      </div>
                    )}
                    {shipping === 0 && (
                      <p className="text-sm text-accent">🚚 Miễn phí vận chuyển cho đơn hàng trên 500,000đ</p>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng cộng</span>
                    <span className="text-primary">{total.toLocaleString('vi-VN')}đ</span>
                  </div>

                  <Button className="w-full bg-gradient-primary text-primary-foreground hover:shadow-glow transition-bounce">
                    Tiến hành thanh toán
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  <Button variant="outline" className="w-full">
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