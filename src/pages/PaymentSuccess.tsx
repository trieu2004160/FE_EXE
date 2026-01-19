import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ShoppingBag, ArrowRight, Home } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AIAssistant from "@/components/AIAssistant";
import { apiService } from "@/services/apiService";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderIdParam = searchParams.get("orderId");
  const orderCodeParam = searchParams.get("orderCode");

  useEffect(() => {
    // Optional: Fire confetti or analytics event here
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const sync = async () => {
      if (!orderIdParam) return;

      const numericOrderId = Number(orderIdParam);
      if (!Number.isFinite(numericOrderId)) return;

      try {
        // Fallback: update order/cart immediately after returning from PayOS
        const res = await apiService.syncPayOSPayment(numericOrderId);
        if (res?.updated) {
          window.dispatchEvent(new Event("cartUpdated"));
        }
      } catch (e) {
        // Ignore (user may not be logged in, or payment still processing)
        console.warn("[PaymentSuccess] PayOS sync failed:", e);
      }
    };

    void sync();
  }, [orderIdParam]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Header />

      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[70vh]">
        <Card className="max-w-lg w-full border-none shadow-2xl bg-white/90 backdrop-blur-sm animate-in fade-in zoom-in duration-500">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-green-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-800">
              Đặt hàng thành công!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6 pt-4">
            <div className="space-y-2">
              <p className="text-gray-600 text-lg">
                Cảm ơn bạn đã mua hàng tại
              </p><p className="text-gray-600 text-lg">
                Sàn Thương Mại Đồ Cúng NoVa
              </p>
              {orderCodeParam && (
                <p className="text-gray-500">
                  Mã thanh toán của bạn là:{" "}
                  <span className="font-bold text-gray-800">#{orderCodeParam}</span>
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <Button
                className="w-full bg-[#A67C42] hover:bg-[#8B6835] text-white py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => navigate("/products")}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Tiếp tục mua sắm
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="w-full border-gray-300 hover:bg-gray-50 py-6"
                  onClick={() => navigate("/")}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Trang chủ
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-gray-300 hover:bg-gray-50 py-6"
                  onClick={() => navigate(`/cart?tab=history`)}
                >
                  Lịch sử đơn hàng
                  <ArrowRight className="ml-2 h-4 w-4" />
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

export default PaymentSuccess;
