import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  OrderHistoryResponseDto,
} from "@/services/apiService";

import { normalizeImageUrl } from "@/utils/imageUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Clock } from "lucide-react";
import { formatOrderStatus } from "@/utils/orderUtils";

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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Initialize activeTab based on URL parameter
  const initialTab = searchParams.get("tab") === "history" ? "history" : "cart";

  const [cartData, setCartData] = useState<CartResponseDto | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState<OrderHistoryResponseDto[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [activeTab, setActiveTab] = useState(initialTab);

  // Check for tab parameter in URL and load orders if needed
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "history") {
      setActiveTab("history");
      fetchOrders();
    }
  }, [searchParams]);

  // Fetch cart data from API
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      setError("");
      try {
        console.log("[Cart] Fetching cart data...");
        const cartResponse = await apiService.getCart();
        console.log("[Cart] Cart data received:", cartResponse);

        setCartData(cartResponse);

        // Flatten cart items from shops structure
        const flattenedItems: CartItem[] = [];
        if (
          cartResponse &&
          cartResponse.shops &&
          Array.isArray(cartResponse.shops)
        ) {
          cartResponse.shops.forEach((shop: ShopInCartDto) => {
            if (shop.items && Array.isArray(shop.items)) {
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
            }
          });
        }
        setCartItems(flattenedItems);
        console.log("[Cart] Flattened items:", flattenedItems);
      } catch (err: any) {
        console.error("[Cart] Error fetching cart:", {
          error: err,
          message: err?.message,
          stack: err?.stack,
          name: err?.name,
        });

        // Check if it's an authentication error
        if (
          err?.message?.includes("401") ||
          err?.message?.includes("Unauthorized")
        ) {
          setError("Vui lòng đăng nhập để xem giỏ hàng");
        } else if (
          err?.message?.includes("Failed to fetch") ||
          err?.message?.includes("kết nối")
        ) {
          setError(
            "Không thể kết nối đến server. Vui lòng kiểm tra:\n1. Backend server đang chạy không?\n2. URL: https://localhost:5001/api/cart\n3. CORS configuration"
          );
        } else {
          setError(
            err.message || "Không thể tải giỏ hàng. Vui lòng thử lại sau."
          );
        }
        setCartItems([]);
        setCartData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const fetchOrders = async () => {
    setLoadingHistory(true);
    setHistoryError("");
    try {
      console.log("[Cart] Fetching orders...");
      const data = await apiService.getUserOrders();
      console.log("[Cart] Orders fetched:", data);

      // Ensure data is an array before accessing or processing
      if (!Array.isArray(data)) {
        console.warn("[Cart] Orders data is not an array:", data);
        setOrders([]);
        return;
      }

      console.log("[Cart] First order structure:", data[0]);

      // Sort by date descending
      const sortedOrders = data.sort(
        (a, b) =>
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
      );
      setOrders(sortedOrders);
    } catch (err) {
      console.error("[Cart] Failed to fetch orders:", err);
      setOrders([]);
      setHistoryError(
        "Không thể tải lịch sử đơn hàng. Vui lòng kiểm tra backend đang chạy và thử lại."
      );
    } finally {
      setLoadingHistory(false);
    }
  };

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
    const allSelected = shopItems.every(
      (item) => item.selected || item.isSelected
    );
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
  // Shipping fee is calculated per shop-split order (consistent with backend).
  const shipping = cartData
    ? cartData.shops
        .filter((shop) => shop.items.some((item) => item.isSelected))
        .reduce((acc, shop) => {
          const shopSubtotal = shop.items
            .filter((item) => item.isSelected)
            .reduce((s, item) => s + item.price * item.quantity, 0);
          const shopShipping =
            shopSubtotal > 300000 ? 0 : shopSubtotal >= 150000 ? 15000 : 30000;
          return acc + shopShipping;
        }, 0)
    : 0;
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
              <p className="text-gray-600 mb-4 whitespace-pre-line">{error}</p>
              <div className="flex gap-2 justify-center mt-6">
                {error.includes("đăng nhập") && (
                  <Button
                    variant="outline"
                    onClick={() => navigate("/login")}
                    className="border-[#A67C42] text-[#A67C42] hover:bg-[#A67C42] hover:text-white"
                  >
                    Đăng nhập
                  </Button>
                )}
              </div>
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

      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value);
              if (value === "history") {
                fetchOrders();
              }
            }}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 mx-auto bg-white/50 p-1 rounded-xl">
              <TabsTrigger
                value="cart"
                className="rounded-lg data-[state=active]:bg-[#A67C42] data-[state=active]:text-white transition-all"
              >
                Giỏ hàng
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="rounded-lg data-[state=active]:bg-[#A67C42] data-[state=active]:text-white transition-all"
              >
                Lịch sử đơn hàng
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cart">
              {cartItems.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-12 max-w-2xl mx-auto text-center">
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
                    onClick={() => navigate("/")}
                  >
                    Tiếp tục mua sắm
                  </Button>
                </div>
              ) : (
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
                                    onChange={() =>
                                      toggleShopSelection(shopIdNum)
                                    }
                                    className="mr-2 h-4 w-4 text-[#A67C42] rounded border-gray-300 focus:ring-2 focus:ring-[#A67C42]"
                                    aria-label={`Chọn sản phẩm từ ${shopName}`}
                                  />
                                  <ShoppingBag className="h-5 w-5 mr-2 text-[#A67C42]" />
                                  <span>
                                    {shopName} ({selectedCount}/{items.length}{" "}
                                    sản phẩm được chọn)
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
                                  checked={
                                    item.selected || item.isSelected || false
                                  }
                                  onChange={() => toggleItemSelection(item.id)}
                                  className="h-4 w-4 text-[#A67C42] rounded border-gray-300 focus:ring-2 focus:ring-[#A67C42]"
                                  aria-label={`Chọn ${item.name}`}
                                />
                                <img
                                  src={(() => {
                                    const normalizedUrl = normalizeImageUrl(
                                      item.imageUrl
                                    );
                                    return (
                                      normalizedUrl ||
                                      "/placeholder.svg"
                                    );
                                  })()}
                                  alt={item.name}
                                  className="w-24 h-24 object-cover rounded-xl shadow-md"
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "/placeholder.svg";
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
                            <span>
                              Tạm tính ({selectedItems.length} sản phẩm)
                            </span>
                            <span className="font-semibold text-gray-800">
                              {subtotal.toLocaleString("vi-VN")}đ
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
              )}
            </TabsContent>

            <TabsContent value="history">
              <div className="max-w-4xl mx-auto space-y-6">
                {loadingHistory ? (
                  <div className="text-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#A67C42]" />
                    <p>Đang tải lịch sử đơn hàng...</p>
                  </div>
                ) : historyError ? (
                  <div className="text-center py-12 bg-white/80 rounded-2xl shadow-sm">
                    <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-700 font-medium mb-2">
                      Không thể tải lịch sử đơn hàng
                    </p>
                    <p className="text-gray-500 mb-6">{historyError}</p>
                    <Button
                      onClick={fetchOrders}
                      className="bg-[#A67C42] hover:bg-[#8B6835] text-white"
                    >
                      Thử lại
                    </Button>
                  </div>
                ) : !orders || orders.length === 0 ? (
                  <div className="text-center py-12 bg-white/80 rounded-2xl shadow-sm">
                    <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">Bạn chưa có đơn hàng nào</p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <Card
                      key={order.id}
                      className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all"
                    >
                      <CardHeader className="bg-white border-b border-gray-100 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="bg-[#A67C42]/10 p-2 rounded-full">
                              <Package className="h-5 w-5 text-[#A67C42]" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">
                                Đơn hàng {order.orderCode || `#${order.id}`}
                              </CardTitle>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                {order.orderDate &&
                                !isNaN(new Date(order.orderDate).getTime())
                                  ? new Date(
                                      order.orderDate
                                    ).toLocaleDateString("vi-VN")
                                  : "Chưa có thông tin"}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={formatOrderStatus(order.status).badgeClassName}
                            >
                              {formatOrderStatus(order.status).label}
                            </Badge>

                            {(() => {
                              const paymentMethod = String(order.paymentMethod || "");
                              const isPaid = typeof order.isPaid === "boolean" ? order.isPaid : undefined;

                              if (isPaid === undefined && !paymentMethod) return null;

                              const paidLabel =
                                isPaid === true
                                  ? "Đã thanh toán"
                                  : isPaid === false
                                    ? "Chưa thanh toán"
                                    : "Không rõ";

                              const paidClass =
                                isPaid === true
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-yellow-50 text-yellow-700 border-yellow-200";

                              return (
                                <Badge
                                  variant="outline"
                                  className={paidClass}
                                  title={paymentMethod ? `Phương thức: ${paymentMethod}` : undefined}
                                >
                                  {paidLabel}
                                </Badge>
                              );
                            })()}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 bg-white">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500">Tổng tiền</p>
                            <p className="text-xl font-bold text-[#A67C42]">
                              {order.total?.toLocaleString("vi-VN") || "0"}đ
                            </p>
                          </div>
                          <div className="text-right">
                            {typeof order.totalItems === "number" && (
                              <p className="text-sm text-gray-500 mb-2">
                                {order.totalItems} sản phẩm
                              </p>
                            )}
                            <Button
                              variant="outline"
                              onClick={() => navigate(`/orders/${order.id}`)}
                              className="border-[#A67C42] text-[#A67C42] hover:bg-[#A67C42] hover:text-white"
                            >
                              Xem chi tiết
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <AIAssistant />
    </div>
  );
};

export default Cart;
