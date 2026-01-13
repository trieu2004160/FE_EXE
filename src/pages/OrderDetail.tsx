import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiService } from "@/services/apiService";
import { OrderResponseDto } from "@/services/apiService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Calendar, CreditCard, Package } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";
import { formatOrderStatus, formatPaymentMethod } from "@/utils/orderUtils";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<OrderResponseDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const data = await apiService.getOrderById(parseInt(id));
        setOrder(data);
      } catch (error) {
        console.error("Failed to fetch order:", error);

        // MOCK DATA FALLBACK
        const mockId = parseInt(id);
        if (mockId === 101) {
          setOrder({
            id: 101,
            status: "delivered",
            total: 1500000,
            subtotal: 1500000,
            orderDate: new Date("2023-11-20").toISOString(),
            paymentMethod: "COD",
            shippingAddress: {
              fullName: "Nguyễn Văn A",
              phoneNumber: "0901234567",
              street: "123 Đường ABC",
              ward: "Phường 1",
              district: "Quận 1",
              city: "TP.HCM",
            },
            items: [
              {
                productId: 101,
                productName: "Mâm Cúng Thôi Nôi Bé Trai",
                price: 1500000,
                quantity: 1,
                imageUrl:
                  "https://docungviet.vn/wp-content/uploads/2023/06/mam-cung-thoi-noi-be-trai-goi-vip-1.jpg",
                shopName: "Đồ Cúng Việt",
              },
            ],
          });
          return;
        } else if (mockId === 102) {
          setOrder({
            id: 102,
            status: "processing",
            total: 850000,
            subtotal: 850000,
            orderDate: new Date("2023-11-25").toISOString(),
            paymentMethod: "COD",
            shippingAddress: {
              fullName: "Nguyễn Văn A",
              phoneNumber: "0901234567",
              street: "123 Đường ABC",
              ward: "Phường 1",
              district: "Quận 1",
              city: "TP.HCM",
            },
            items: [
              {
                productId: 102,
                productName: "Heo Quay Sữa",
                price: 850000,
                quantity: 1,
                imageUrl:
                  "https://heoquay.com/wp-content/uploads/2019/07/heo-quay-sua-nguyen-con.jpg",
                shopName: "Heo Quay Ngon",
              },
            ],
          });
          return;
        }

        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin đơn hàng.",
          variant: "destructive",
        });
        navigate("/"); // Redirect to home on error
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return null; // Should have redirected
  }

  const getStatusColor = (status: string) => {
    const s = (status || "").trim();
    switch (s) {
      case "PendingPayment":
        return "bg-yellow-100 text-yellow-800";
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Shipping":
        return "bg-purple-100 text-purple-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6 pl-0 hover:bg-transparent hover:text-primary"
          onClick={() => navigate("/cart?tab=history")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại lịch sử đơn hàng
        </Button>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">
                  Chi tiết đơn hàng #{order.id}
                </CardTitle>
                <Badge className={getStatusColor(order.status)}>
                  {formatOrderStatus(order.status).label}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between"
                    >
                      <div className="flex gap-4">
                        <div className="h-20 w-20 rounded-lg border bg-gray-100 overflow-hidden">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.productName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400">
                              <Package className="h-8 w-8" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{item.productName}</h3>
                          <p className="text-sm text-gray-500">
                            Cung cấp bởi: {item.shopName}
                          </p>
                          <p className="text-sm text-gray-500">
                            Số lượng: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {formatCurrency(item.price)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Tổng: {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin thanh toán</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tạm tính</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Phí vận chuyển</span>
                  <span>Miễn phí</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium text-lg">
                  <span>Tổng cộng</span>
                  <span className="text-primary">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin giao hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">
                      {order.shippingAddress.fullName}
                    </p>
                    <p className="text-gray-500">
                      {order.shippingAddress.phoneNumber}
                    </p>
                    <p className="text-gray-500">
                      {order.shippingAddress.street},{" "}
                      {order.shippingAddress.ward}
                    </p>
                    <p className="text-gray-500">
                      {order.shippingAddress.district},{" "}
                      {order.shippingAddress.city}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div className="text-sm">
                    <p className="text-gray-500">Ngày đặt hàng</p>
                    <p>
                      {order.orderDate && !isNaN(new Date(order.orderDate).getTime())
                        ? new Date(order.orderDate).toLocaleDateString("vi-VN")
                        : "Chưa có thông tin"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                  <div className="text-sm">
                    <p className="text-gray-500">Phương thức thanh toán</p>
                    <p>{formatPaymentMethod(order.paymentMethod)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderDetail;
