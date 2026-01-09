import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  CreditCard,
  Edit2,
  Plus,
  MapPin,
  Tag,
  ShoppingBag,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AIAssistant from "@/components/AIAssistant";
import { useToast } from "@/hooks/use-toast";
import {
  apiService,
  CartResponseDto,
  CartItemDto,
  ShopInCartDto,
  AddressResponseDto,
  UpsertAddressDto,
} from "@/services/apiService";
import { ordersApi, CreateOrderRequest } from "@/services/ordersApi";
import { normalizeImageUrl } from "@/utils/imageUtils";

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Cart state - chỉ lấy selected items
  const [cartData, setCartData] = useState<CartResponseDto | null>(null);
  const [selectedItems, setSelectedItems] = useState<CartItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Address state
  const [addresses, setAddresses] = useState<AddressResponseDto[]>([]);
  const [selectedAddress, setSelectedAddress] =
    useState<AddressResponseDto | null>(null);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Address form
  const [addressForm, setAddressForm] = useState<UpsertAddressDto>({
    fullName: "",
    phoneNumber: "",
    street: "",
    ward: "",
    district: "",
    city: "",
    isDefault: false,
  });

  // Promo code and shipping
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<
    "cash_on_delivery" | "payos"
  >("cash_on_delivery");

  // Fetch addresses function
  const fetchAddresses = async () => {
    try {
      const userAddresses = await apiService.getUserAddresses();
      setAddresses(userAddresses);
      return userAddresses;
    } catch (error) {
      console.error("Error fetching addresses:", error);
      return [];
    }
  };

  // Fetch cart and addresses
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Check authentication
        const token = localStorage.getItem("userToken");
        if (!token || token === "authenticated") {
          toast({
            title: "Vui lòng đăng nhập",
            description: "Bạn cần đăng nhập để thanh toán",
            variant: "destructive",
          });
          navigate("/login");
          return;
        }

        // Fetch cart
        const cart = await apiService.getCart();
        setCartData(cart);

        // Filter only selected items
        const selected: CartItemDto[] = [];
        cart.shops.forEach((shop: ShopInCartDto) => {
          shop.items
            .filter((item) => item.isSelected)
            .forEach((item) => {
              selected.push(item);
            });
        });
        setSelectedItems(selected);

        // Check if there are selected items
        if (selected.length === 0) {
          toast({
            title: "Không có sản phẩm được chọn",
            description: "Vui lòng chọn sản phẩm để thanh toán",
            variant: "destructive",
          });
          navigate("/cart");
          return;
        }

        // Fetch addresses
        const userAddresses = await fetchAddresses();

        // Find default address
        const defaultAddr = userAddresses.find((addr) => addr.isDefault);
        if (defaultAddr) {
          setSelectedAddress(defaultAddr);
        } else if (userAddresses.length > 0) {
          // If no default, use first one
          setSelectedAddress(userAddresses[0]);
        } else {
          // No addresses, show add form
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải dữ liệu. Vui lòng thử lại.",
          variant: "destructive",
        });
        navigate("/cart");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, toast]);

  // Group selected items by shop
  const groupedItems = cartData
    ? cartData.shops
      .filter((shop) => shop.items.some((item) => item.isSelected))
      .map((shop) => ({
        shopId: shop.shopId,
        shopName: shop.shopName,
        items: shop.items.filter((item) => item.isSelected),
      }))
    : [];

  // Calculate totals
  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 500000 ? 0 : 30000;
  const discount =
    promoCode === "TOTNGHIEP10" && promoApplied ? subtotal * 0.1 : 0;
  const total = subtotal + shipping - discount;

  // Handle address selection
  const handleSelectAddress = (address: AddressResponseDto) => {
    setSelectedAddress(address);
    setShowAddressDialog(false);
  };

  // Handle edit address
  const handleEditAddress = (address: AddressResponseDto) => {
    setIsEditMode(true);
    setEditingAddressId(address.id);
    setAddressForm({
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      street: address.street,
      ward: address.ward,
      district: address.district,
      city: address.city,
      isDefault: address.isDefault,
    });
  };

  // Handle update address
  const handleUpdateAddress = async () => {
    try {
      if (
        !addressForm.fullName ||
        !addressForm.phoneNumber ||
        !addressForm.street ||
        !addressForm.ward ||
        !addressForm.district ||
        !addressForm.city
      ) {
        toast({
          title: "Vui lòng điền đầy đủ thông tin",
          variant: "destructive",
        });
        return;
      }

      if (!editingAddressId) return;

      await apiService.updateUserAddress(
        editingAddressId,
        addressForm
      );

      // Refetch addresses to get the latest data
      const updatedAddresses = await fetchAddresses();

      // Find the updated address in the new list
      const updatedAddress = updatedAddresses.find(a => a.id === editingAddressId);

      // Update selected address if it was being edited
      if (selectedAddress?.id === editingAddressId && updatedAddress) {
        setSelectedAddress(updatedAddress);
      }

      // Reset form and editing mode
      setIsEditMode(false);
      setEditingAddressId(null);
      setAddressForm({
        fullName: "",
        phoneNumber: "",
        street: "",
        ward: "",
        district: "",
        city: "",
        isDefault: false,
      });

      toast({
        title: "Thành công",
        description: "Đã cập nhật địa chỉ",
      });
    } catch (error: any) {
      console.error("Error updating address:", error);
      toast({
        title: "Lỗi",
        description: error?.message || "Không thể cập nhật địa chỉ",
        variant: "destructive",
      });
    }
  };

  // Handle add new address
  const handleAddAddress = async () => {
    try {
      if (
        !addressForm.fullName ||
        !addressForm.phoneNumber ||
        !addressForm.street ||
        !addressForm.ward ||
        !addressForm.district ||
        !addressForm.city
      ) {
        toast({
          title: "Vui lòng điền đầy đủ thông tin",
          variant: "destructive",
        });
        return;
      }

      await apiService.addUserAddress(addressForm);

      // Refetch addresses to get the latest data
      const updatedAddresses = await fetchAddresses();

      // If this is the first address or set as default, select it
      // We need to find the newly added address. Since we don't have the ID, 
      // we can assume it's the last one or check if we have only one.
      // A better approach is to rely on the user selecting it, 
      // or if it was set as default, find the default one.

      if (addressForm.isDefault || updatedAddresses.length === 1) {
        const defaultAddr = updatedAddresses.find(a => a.isDefault) || updatedAddresses[0];
        if (defaultAddr) setSelectedAddress(defaultAddr);
      }

      // Reset form
      setAddressForm({
        fullName: "",
        phoneNumber: "",
        street: "",
        ward: "",
        district: "",
        city: "",
        isDefault: false,
      });

      // Close the add address form and show address list
      setShowAddressDialog(true);

      toast({
        title: "Thành công",
        description: "Đã thêm địa chỉ mới",
      });
    } catch (error: any) {
      console.error("Error adding address:", error);
      toast({
        title: "Lỗi",
        description: error?.message || "Không thể thêm địa chỉ",
        variant: "destructive",
      });
    }
  };

  // Handle apply promo code
  const handleApplyPromo = () => {
    if (promoCode === "TOTNGHIEP10") {
      setPromoApplied(true);
      toast({
        title: "Thành công",
        description: "Đã áp dụng mã giảm giá 10%",
      });
    } else {
      toast({
        title: "Mã không hợp lệ",
        description: "Mã giảm giá không tồn tại",
        variant: "destructive",
      });
    }
  };

  // Handle submit order
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[Checkout] Form submitted");

    if (!selectedAddress) {
      console.warn("[Checkout] No address selected");
      toast({
        title: "Vui lòng chọn địa chỉ",
        description: "Bạn cần chọn hoặc thêm địa chỉ giao hàng",
        variant: "destructive",
      });
      return;
    }

    if (selectedItems.length === 0) {
      console.warn("[Checkout] No items selected");
      toast({
        title: "Không có sản phẩm",
        description: "Vui lòng chọn sản phẩm để thanh toán",
        variant: "destructive",
      });
      navigate("/cart");
      return;
    }

    try {
      setSubmitting(true);
      console.log("[Checkout] Creating order...", {
        addressId: selectedAddress.id,
        paymentMethod,
        itemsCount: selectedItems.length,
      });

      // Convert selectedAddress to ShippingAddress format for order
      // Convert selectedAddress to ShippingAddress format for order
      // Backend expects: FullName, PhoneNumber, Street, Ward, District, City
      const shippingAddress = {
        fullName: selectedAddress.fullName,
        phoneNumber: selectedAddress.phoneNumber,
        street: selectedAddress.street,
        ward: selectedAddress.ward,
        district: selectedAddress.district,
        city: selectedAddress.city,
      };

      const orderData: CreateOrderRequest = {
        shippingAddress,
        paymentMethod,
      };

      console.log("[Checkout] Order data prepared:", orderData);
      const order = await ordersApi.create(orderData);
      console.log("[Checkout] Order created successfully:", order);

      toast({
        title: "Đặt hàng thành công!",
        description: `Đơn hàng #${order.id} đã được tạo thành công`,
      });

      // Dispatch event to update cart count
      window.dispatchEvent(new Event("cartUpdated"));

      // Navigate to payment success page
      navigate(`/payment-success?orderId=${order.id}`);
    } catch (error: any) {
      console.error("[Checkout] Error creating order:", error);
      toast({
        title: "Lỗi đặt hàng",
        description:
          error?.message || "Không thể tạo đơn hàng. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-gray-600">Đang tải...</p>
        </div>
        <Footer />
        <AIAssistant />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/cart")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại giỏ hàng
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Thanh toán</h1>
        </div>

        {/* Shipping Address Section - Above the form */}
        {selectedAddress ? (
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <MapPin className="h-5 w-5 text-[#A67C42]" />
                Địa chỉ giao hàng mặc định
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-800 text-lg">
                        {selectedAddress.fullName}
                      </span>
                      {selectedAddress.isDefault && (
                        <span className="text-xs bg-[#A67C42] text-white px-2 py-1 rounded">
                          Mặc định
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      📞 {selectedAddress.phoneNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      📍 {selectedAddress.street}, {selectedAddress.ward},{" "}
                      {selectedAddress.district}, {selectedAddress.city}
                    </p>
                  </div>
                  <Dialog
                    open={showAddressDialog}
                    onOpenChange={setShowAddressDialog}
                  >
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 ml-4"
                      >
                        <Edit2 className="h-4 w-4" />
                        Thay đổi
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {isEditMode
                            ? "Chỉnh sửa địa chỉ giao hàng"
                            : "Chọn địa chỉ giao hàng"}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3 mt-4">
                        {isEditMode ? (
                          // Edit Address Form
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Họ và tên *</Label>
                              <Input
                                className="focus-visible:ring-0 focus-visible:ring-offset-0"
                                value={addressForm.fullName}
                                onChange={(e) =>
                                  setAddressForm({
                                    ...addressForm,
                                    fullName: e.target.value,
                                  })
                                }
                                placeholder="Nhập họ và tên"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Số điện thoại *</Label>
                              <Input
                                className="focus-visible:ring-0 focus-visible:ring-offset-0"
                                value={addressForm.phoneNumber}
                                onChange={(e) =>
                                  setAddressForm({
                                    ...addressForm,
                                    phoneNumber: e.target.value,
                                  })
                                }
                                placeholder="Nhập số điện thoại"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Số nhà, đường *</Label>
                                <Input
                                  className="focus-visible:ring-0 focus-visible:ring-offset-0"
                                  value={addressForm.street}
                                  onChange={(e) =>
                                    setAddressForm({
                                      ...addressForm,
                                      street: e.target.value,
                                    })
                                  }
                                  placeholder="Nhập số nhà, đường"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Phường/Xã *</Label>
                                <Input
                                  className="focus-visible:ring-0 focus-visible:ring-offset-0"
                                  value={addressForm.ward}
                                  onChange={(e) =>
                                    setAddressForm({
                                      ...addressForm,
                                      ward: e.target.value,
                                    })
                                  }
                                  placeholder="Nhập phường/xã"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Quận/Huyện *</Label>
                                <Input
                                  className="focus-visible:ring-0 focus-visible:ring-offset-0"
                                  value={addressForm.district}
                                  onChange={(e) =>
                                    setAddressForm({
                                      ...addressForm,
                                      district: e.target.value,
                                    })
                                  }
                                  placeholder="Nhập quận/huyện"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Thành phố *</Label>
                                <Input
                                  className="focus-visible:ring-0 focus-visible:ring-offset-0"
                                  value={addressForm.city}
                                  onChange={(e) =>
                                    setAddressForm({
                                      ...addressForm,
                                      city: e.target.value,
                                    })
                                  }
                                  placeholder="Nhập thành phố"
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id="editIsDefault"
                                checked={addressForm.isDefault}
                                onChange={(e) =>
                                  setAddressForm({
                                    ...addressForm,
                                    isDefault: e.target.checked,
                                  })
                                }
                                className="h-4 w-4"
                              />
                              <Label
                                htmlFor="editIsDefault"
                                className="cursor-pointer"
                              >
                                Đặt làm địa chỉ mặc định
                              </Label>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setIsEditMode(false);
                                  setEditingAddressId(null);
                                  setAddressForm({
                                    fullName: "",
                                    phoneNumber: "",
                                    street: "",
                                    ward: "",
                                    district: "",
                                    city: "",
                                    isDefault: false,
                                  });
                                }}
                                className="flex-1"
                              >
                                Hủy
                              </Button>
                              <Button
                                type="button"
                                onClick={handleUpdateAddress}
                                className="flex-1 bg-[#A67C42] hover:bg-[#8B6835]"
                              >
                                Cập nhật địa chỉ
                              </Button>
                            </div>
                          </div>
                        ) : (
                          // Address Selection
                          <>
                            {addresses.length > 0 ? (
                              addresses.map((address) => (
                                <div
                                  key={address.id}
                                  className={`border rounded-lg p-4 transition-all ${selectedAddress?.id === address.id
                                      ? "border-[#A67C42] bg-[#A67C42]/5"
                                      : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                  <div className="flex items-start justify-between">
                                    <div
                                      className="flex-1 cursor-pointer"
                                      onClick={() =>
                                        handleSelectAddress(address)
                                      }
                                    >
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="font-semibold">
                                          {address.fullName}
                                        </span>
                                        {address.isDefault && (
                                          <span className="text-xs bg-[#A67C42] text-white px-2 py-1 rounded">
                                            Mặc định
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-sm text-gray-600 mb-1">
                                        {address.phoneNumber}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {address.street}, {address.ward},{" "}
                                        {address.district}, {address.city}
                                      </p>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEditAddress(address)}
                                      className="ml-2"
                                    >
                                      <Edit2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500 text-center py-4">
                                Chưa có địa chỉ nào
                              </p>
                            )}
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full flex items-center gap-2"
                              onClick={() => {
                                setShowAddressDialog(false);
                                setSelectedAddress(null);
                              }}
                            >
                              <Plus className="h-4 w-4" />
                              Thêm địa chỉ mới
                            </Button>
                          </>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <MapPin className="h-5 w-5 text-[#A67C42]" />
                Thêm địa chỉ giao hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Họ và tên *</Label>
                  <Input
                    className=" focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={addressForm.fullName}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        fullName: e.target.value,
                      })
                    }
                    placeholder="Nhập họ và tên"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Số điện thoại *</Label>
                  <Input
                    className=" focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={addressForm.phoneNumber}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        phoneNumber: e.target.value,
                      })
                    }
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Số nhà, đường *</Label>
                    <Input
                      className=" focus-visible:ring-0 focus-visible:ring-offset-0"
                      value={addressForm.street}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          street: e.target.value,
                        })
                      }
                      placeholder="Nhập số nhà, đường"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phường/Xã *</Label>
                    <Input
                      className=" focus-visible:ring-0 focus-visible:ring-offset-0"
                      value={addressForm.ward}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, ward: e.target.value })
                      }
                      placeholder="Nhập phường/xã"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Quận/Huyện *</Label>
                    <Input
                      className=" focus-visible:ring-0 focus-visible:ring-offset-0"
                      value={addressForm.district}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          district: e.target.value,
                        })
                      }
                      placeholder="Nhập quận/huyện"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Thành phố *</Label>
                    <Input
                      className=" focus-visible:ring-0 focus-visible:ring-offset-0"
                      value={addressForm.city}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, city: e.target.value })
                      }
                      placeholder="Nhập thành phố"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={addressForm.isDefault}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        isDefault: e.target.checked,
                      })
                    }
                    className="h-4 w-4"
                  />
                  <Label htmlFor="isDefault" className="cursor-pointer">
                    Đặt làm địa chỉ mặc định
                  </Label>
                </div>
                <Button
                  type="button"
                  onClick={handleAddAddress}
                  className="w-full bg-[#A67C42] hover:bg-[#8B6835]"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm địa chỉ
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Address Dialog - Popup for adding new address */}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Order Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Selected Items by Shop */}
              <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <ShoppingBag className="h-5 w-5 text-[#A67C42]" />
                    Sản phẩm đã chọn ({selectedItems.length} sản phẩm)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {groupedItems.length > 0 ? (
                      groupedItems.map((shopGroup) => (
                        <div key={shopGroup.shopId} className="space-y-3">
                          <div className="flex items-center gap-2 text-base font-semibold text-gray-800 pb-2 border-b">
                            <ShoppingBag className="h-4 w-4 text-[#A67C42]" />
                            {shopGroup.shopName}
                          </div>
                          <div className="space-y-3">
                            {shopGroup.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                <img
                                  src={
                                    normalizeImageUrl(item.imageUrl) ||
                                    "/placeholder.svg"
                                  }
                                  alt={item.productName}
                                  className="w-20 h-20 object-cover rounded-lg"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-800 truncate">
                                    {item.productName}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1">
                                    Số lượng: {item.quantity}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-gray-500">
                                    {item.price.toLocaleString("vi-VN")}đ/SP
                                  </p>
                                  <p className="font-semibold text-[#A67C42] text-lg">
                                    {(
                                      item.price * item.quantity
                                    ).toLocaleString("vi-VN")}
                                    đ
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        Không có sản phẩm nào được chọn
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <CreditCard className="h-5 w-5 text-[#A67C42]" />
                    Phương thức thanh toán
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <label className="flex items-center space-x-3 cursor-pointer p-4 border-2 border-gray-200 rounded-lg hover:border-[#A67C42] transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash_on_delivery"
                      checked={paymentMethod === "cash_on_delivery"}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="h-4 w-4 text-[#A67C42]"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">
                        Thanh toán khi nhận hàng (COD)
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Bạn sẽ thanh toán khi nhận được hàng
                      </div>
                    </div>
                  </label>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4 border-none shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-gray-800">
                    Tóm tắt thanh toán
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Promo Code */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-gray-700">
                      <Tag className="h-4 w-4 text-[#A67C42]" />
                      Mã giảm giá
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Nhập mã giảm giá"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        disabled={promoApplied}
                        className="flex-1  focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      <Button
                        type="button"
                        onClick={handleApplyPromo}
                        disabled={promoApplied}
                        className="bg-[#A67C42] hover:bg-[#8B6835] whitespace-nowrap"
                      >
                        {promoApplied ? "Đã áp dụng" : "Áp dụng"}
                      </Button>
                    </div>
                    {promoApplied && promoCode === "TOTNGHIEP10" && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                        <p className="text-sm text-green-700 font-medium">
                          ✓ Đã áp dụng mã giảm giá 10%
                        </p>
                      </div>
                    )}
                  </div>

                  <hr className="border-gray-200" />

                  {/* Price Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tạm tính</span>
                      <span className="font-semibold text-gray-800">
                        {subtotal.toLocaleString("vi-VN")}đ
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Phí vận chuyển</span>
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
                      <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                        <p className="text-xs text-green-700">
                          ✓ Miễn phí vận chuyển cho đơn hàng trên 500,000đ
                        </p>
                      </div>
                    )}
                  </div>

                  <hr className="border-gray-200" />

                  <div className="flex justify-between text-xl font-bold bg-gradient-to-r from-[#A67C42]/10 to-[#C99F4D]/10 p-4 rounded-xl">
                    <span className="text-gray-800">Tổng cộng</span>
                    <span className="text-[#A67C42]">
                      {total.toLocaleString("vi-VN")}đ
                    </span>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#A67C42] to-[#C99F4D] hover:from-[#8B6835] hover:to-[#A67C42] text-white py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    disabled={submitting || !selectedAddress}
                  >
                    {submitting ? "Đang xử lý..." : "Đặt hàng"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>

      <Footer />
      <AIAssistant />
    </div>
  );
};

export default Checkout;
