import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Minus,
  Plus,
  X,
  ShoppingBag,
  ArrowRight,
  Tag,
  Loader2,
} from "lucide-react";
import Header from "@/components/Header";
import AIAssistant from "@/components/AIAssistant";
import {
  apiService,
  CartResponseDto,
  CartItemDto,
  ShopInCartDto,
} from "@/services/apiService";
import { useNavigate } from "react-router-dom";
import { normalizeImageUrl } from "@/utils/imageUtils";

interface CartItem {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
  category: string;
  shopId: number;
  selected?: boolean;
  isSelected?: boolean;
}

const Cart = () => {
  const [cartData, setCartData] = useState<CartResponseDto | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch cart data from API
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      setError("");
      try {
        const cartResponse = await apiService.getCart();
        setCartData(cartResponse);

        // Flatten cart items from shops structure
        const flattenedItems: CartItem[] = [];
        cartResponse.shops.forEach((shop: ShopInCartDto) => {
          shop.items.forEach((item: CartItemDto) => {
            console.log("Cart item imageUrl:", item.imageUrl);
            flattenedItems.push({
              id: item.id,
              name: item.productName,
              price: item.price,
              imageUrl: item.imageUrl,
              quantity: item.quantity,
              category: "", // Category not available in cart API
              shopId: shop.shopId,
              selected: item.isSelected,
              isSelected: item.isSelected,
            });
          });
        });
        setCartItems(flattenedItems);
      } catch (err: any) {
        console.error("Error fetching cart:", err);
        setError(err.message || "Không thể tải giỏ hàng. Vui lòng đăng nhập.");
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Group cart items by shop
  const groupedItems = cartItems.reduce((groups, item) => {
    const shopId = item.shopId;
    if (!groups[shopId]) {
      groups[shopId] = [];
    }
    groups[shopId].push(item);
    return groups;
  }, {} as Record<number, CartItem[]>);

  // Get shop info from cartData
  const getShopName = (shopId: number): string => {
    const shop = cartData?.shops.find((s) => s.shopId === shopId);
    return shop?.shopName || `Shop ${shopId}`;
  };

  const toggleItemSelection = async (itemId: number) => {
    const item = cartItems.find((i) => i.id === itemId);
    if (!item) return;

    const newSelected = !(item.selected ?? item.isSelected ?? false);

    try {
      const updatedCart = await apiService.selectCartItem(itemId, newSelected);
      setCartData(updatedCart);

      // Update local state
      setCartItems((items) =>
        items.map((i) =>
          i.id === itemId
            ? { ...i, selected: newSelected, isSelected: newSelected }
            : i
        )
      );
    } catch (err: any) {
      console.error("Error updating item selection:", err);
    }
  };

  const toggleShopSelection = async (shopId: number) => {
    const shopItems = groupedItems[shopId] || [];
    const allSelected = shopItems.every((item) => item.selected || item.isSelected);
    const newSelected = !allSelected;

    try {
      // Call API for each item in the shop
      const promises = shopItems.map((item) =>
        apiService.selectCartItem(item.id, newSelected)
      );
      
      // Wait for all API calls to complete
      const results = await Promise.all(promises);
      
      // Update cart data from the last response (they should all be the same)
      if (results.length > 0) {
        setCartData(results[results.length - 1]);
      }

      // Update local state
      setCartItems((items) =>
        items.map((item) =>
          item.shopId === shopId
            ? { ...item, selected: newSelected, isSelected: newSelected }
            : item
        )
      );
    } catch (err: any) {
      console.error("Error updating shop selection:", err);
    }
  };

  const deselectAllFromShop = async (shopId: number) => {
    const shopItems = groupedItems[shopId] || [];

    try {
      // Call API for each item in the shop
      const promises = shopItems.map((item) =>
        apiService.selectCartItem(item.id, false)
      );
      
      // Wait for all API calls to complete
      const results = await Promise.all(promises);
      
      // Update cart data from the last response
      if (results.length > 0) {
        setCartData(results[results.length - 1]);
      }

      // Update local state
      setCartItems((items) =>
        items.map((item) =>
          item.shopId === shopId
            ? { ...item, selected: false, isSelected: false }
            : item
        )
      );
    } catch (err: any) {
      console.error("Error deselecting shop items:", err);
    }
  };

  const selectAllFromShop = async (shopId: number) => {
    const shopItems = groupedItems[shopId] || [];

    try {
      // Call API for each item in the shop
      const promises = shopItems.map((item) =>
        apiService.selectCartItem(item.id, true)
      );
      
      // Wait for all API calls to complete
      const results = await Promise.all(promises);
      
      // Update cart data from the last response
      if (results.length > 0) {
        setCartData(results[results.length - 1]);
      }

      // Update local state
      setCartItems((items) =>
        items.map((item) =>
          item.shopId === shopId
            ? { ...item, selected: true, isSelected: true }
            : item
        )
      );
    } catch (err: any) {
      console.error("Error selecting shop items:", err);
    }
  };

  const updateQuantity = async (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      await removeItem(id);
      return;
    }

    try {
      const updatedCart = await apiService.updateCartItemQuantity(
        id,
        newQuantity
      );
      setCartData(updatedCart);

      setCartItems((items) =>
        items.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );

      // Dispatch event to update cart count in Header
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err: any) {
      console.error("Error updating quantity:", err);
    }
  };

  const removeItem = async (id: number) => {
    try {
      const updatedCart = await apiService.removeCartItem(id);
      setCartData(updatedCart);

      // Update local state
      const flattenedItems: CartItem[] = [];
      updatedCart.shops.forEach((shop: ShopInCartDto) => {
        shop.items.forEach((item: CartItemDto) => {
          flattenedItems.push({
            id: item.id,
            name: item.productName,
            price: item.price,
            imageUrl: item.imageUrl,
            quantity: item.quantity,
            category: "",
            shopId: shop.shopId,
            selected: item.isSelected,
            isSelected: item.isSelected,
          });
        });
      });
      setCartItems(flattenedItems);

      // Dispatch event to update cart count in Header
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err: any) {
      console.error("Error removing item:", err);
    }
  };

  // Calculate totals only for selected items
  const selectedItems = cartItems.filter(
    (item) => item.selected || item.isSelected
  );

  // Use totalPrice from API if available (for selected items), otherwise calculate
  const subtotal =
    cartData?.totalPrice ||
    selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500000 ? 0 : 30000;
  const discount = promoCode === "TOTNGHIEP10" ? subtotal * 0.1 : 0;
  const total = subtotal + shipping - discount;

  const applyPromoCode = () => {
    if (promoCode === "TOTNGHIEP10") {
      // Promo code applied successfully
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <Header />
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#A67C42]" />
            <p className="text-gray-600">Đang tải giỏ hàng...</p>
          </div>
        </section>

        <AIAssistant />
      </div>
    );
  }

  if (error && !cartItems.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <Header />
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-12 max-w-2xl mx-auto">
              <p className="text-red-500 mb-4">{error}</p>
              <p className="text-gray-600">
                Vui lòng đăng nhập để xem giỏ hàng
              </p>
            </div>
          </div>
        </section>

        <AIAssistant />
      </div>
    );
  }

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

        <AIAssistant />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <Header />

      {/* Page Header với hình nền */}

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {Object.entries(groupedItems).map(([shopId, items]) => {
                const shopIdNum = parseInt(shopId, 10);
                const shopName = getShopName(shopIdNum);
                const selectedCount = items.filter(
                  (item) => item.selected || item.isSelected
                ).length;
                const allSelected =
                  items.length > 0 && selectedCount === items.length;
                const anySelected = selectedCount > 0;

                return (
                  <Card
                    key={shopId}
                    className="border-none shadow-xl bg-white/80 backdrop-blur-sm mb-6"
                  >
                    <CardHeader className="border-b border-gray-100">
                      <CardTitle className="flex items-center justify-between text-gray-800">
                        <div className="flex items-center">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              ref={(el) => {
                                if (el) {
                                  el.indeterminate =
                                    anySelected && !allSelected;
                                }
                              }}
                              checked={allSelected}
                              onChange={() => toggleShopSelection(shopIdNum)}
                              className="mr-2 h-4 w-4 text-[#A67C42] rounded border-gray-300 focus:ring-2 focus:ring-[#A67C42]"
                              aria-label={`Chọn sản phẩm từ ${shopName}`}
                            />
                            <ShoppingBag className="h-5 w-5 mr-2 text-[#A67C42]" />
                            <span>
                              {shopName} ({selectedCount}/{items.length} sản
                              phẩm được chọn)
                            </span>
                          </label>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={
                            allSelected
                              ? () => deselectAllFromShop(shopIdNum)
                              : () => selectAllFromShop(shopIdNum)
                          }
                          className="text-xs"
                        >
                          {allSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className={`flex items-center gap-4 p-4 border rounded-xl bg-white hover:shadow-lg transition-all duration-300 ${
                            item.selected || item.isSelected
                              ? "border-[#A67C42] bg-[#A67C42]/5"
                              : "border-gray-200"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={item.selected || item.isSelected || false}
                            onChange={() => toggleItemSelection(item.id)}
                            className="h-4 w-4 text-[#A67C42] rounded border-gray-300 focus:ring-2 focus:ring-[#A67C42]"
                            aria-label={`Chọn ${item.name}`}
                          />
                          <img
                            src={(() => {
                              const normalizedUrl = normalizeImageUrl(
                                item.imageUrl
                              );
                              console.log(
                                "Normalized image URL for",
                                item.name,
                                ":",
                                normalizedUrl
                              );
                              return (
                                normalizedUrl ||
                                "https://via.placeholder.com/200?text=No+Image"
                              );
                            })()}
                            alt={item.name}
                            className="w-24 h-24 object-cover rounded-xl shadow-md"
                            onError={(e) => {
                              console.log(
                                "Image load error for",
                                item.name,
                                ":",
                                e.currentTarget.src
                              );
                              e.currentTarget.src =
                                "https://via.placeholder.com/200?text=No+Image";
                            }}
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
                );
              })}
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
                      <span>Tạm tính ({selectedItems.length} sản phẩm)</span>
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

                  <Button
                    className="w-full bg-gradient-to-r from-[#A67C42] to-[#C99F4D] hover:from-[#8B6835] hover:to-[#A67C42] text-white py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    disabled={selectedItems.length === 0}
                    onClick={() =>
                      selectedItems.length > 0 && navigate("/checkout")
                    }
                  >
                    {selectedItems.length > 0
                      ? `Tiến hành thanh toán (${selectedItems.length} sản phẩm)`
                      : "Vui lòng chọn sản phẩm để thanh toán"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full border-2 border-[#A67C42] text-[#A67C42] hover:bg-[#A67C42] hover:text-white py-6 text-lg rounded-xl transition-all duration-300"
                    onClick={() => navigate("/")}
                  >
                    Tiếp tục mua sắm
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <AIAssistant />
    </div>
  );
};

export default Cart;
