import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { apiService } from "@/services/apiService";

function useQueryParam(name: string): string {
  const { search } = useLocation();
  return useMemo(() => {
    const params = new URLSearchParams(search);
    return (params.get(name) || "").trim();
  }, [name, search]);
}

const PaymentCancel = () => {
  const navigate = useNavigate();
  const orderIdParam = useQueryParam("orderId");

  const [status, setStatus] = useState<"idle" | "working" | "done" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const orderId = Number(orderIdParam);
      if (!orderIdParam || Number.isNaN(orderId) || orderId <= 0) {
        setStatus("error");
        setMessage("Thiếu orderId từ PayOS. Vui lòng quay lại giỏ hàng.");
        return;
      }

      setStatus("working");
      try {
        await apiService.cancelPayOSPayment(orderId);
        if (cancelled) return;
        setStatus("done");
        setMessage("Bạn đã hủy thanh toán. Đơn hàng tạm đã được xóa.");

        // Take user back to checkout/cart to continue.
        setTimeout(() => navigate("/checkout"), 800);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Có lỗi xảy ra";
        if (cancelled) return;
        setStatus("error");
        setMessage(msg);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [navigate, orderIdParam]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-2">Hủy thanh toán</h1>
        <p className="text-sm text-gray-300 mb-6">
          {status === "working"
            ? "Đang xử lý hủy thanh toán..."
            : "Thanh toán PayOS đã bị hủy."}
        </p>

        {message && (
          <Alert className="mb-4" variant={status === "error" ? "destructive" : "default"}>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <Button
            className="w-full bg-[#C99F4D] hover:bg-[#B8904A]"
            onClick={() => navigate("/checkout")}
          >
            Quay lại thanh toán
          </Button>
          <Link className="block text-center text-sm text-[#C99F4D] underline" to="/cart">
            Về giỏ hàng
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
