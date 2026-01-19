export type OrderStatusKey =
  | "Pending"
  | "PendingPayment"
  | "Paid"
  | "Shipping"
  | "Completed"
  | "Cancelled"
  | "Processing"
  | "Received"
  | "Preparing"
  | "Delivering"
  | "Delivered"
  | string;

export function formatOrderStatus(status: string): {
  label: string;
  badgeClassName: string;
} {
  const key = (status || "").trim();

  switch (key) {
    case "PendingPayment":
      return {
        label: "Đang chờ thanh toán",
        badgeClassName: "bg-yellow-50 text-yellow-700 border-yellow-200",
      };
    // Payment-state should be shown separately via IsPaid badge.
    // Keep legacy "Paid" mapped to processing.
    case "Paid":
      return {
        label: "Đang xử lý",
        badgeClassName: "bg-blue-50 text-blue-700 border-blue-200",
      };
    case "Processing":
      return {
        label: "Đang xử lý",
        badgeClassName: "bg-blue-50 text-blue-700 border-blue-200",
      };
    case "Received":
      return {
        label: "Đã tiếp nhận",
        badgeClassName: "bg-indigo-50 text-indigo-700 border-indigo-200",
      };
    case "Preparing":
      return {
        label: "Đang chuẩn bị",
        badgeClassName: "bg-orange-50 text-orange-700 border-orange-200",
      };
    case "Shipping":
      return {
        label: "Đang giao hàng",
        badgeClassName: "bg-purple-50 text-purple-700 border-purple-200",
      };
    case "Delivering":
      return {
        label: "Đang giao hàng",
        badgeClassName: "bg-purple-50 text-purple-700 border-purple-200",
      };
    case "Completed":
      return {
        label: "Đã giao hàng",
        badgeClassName: "bg-green-50 text-green-700 border-green-200",
      };
    case "Delivered":
      return {
        label: "Đã giao hàng",
        badgeClassName: "bg-green-50 text-green-700 border-green-200",
      };
    case "Cancelled":
      return {
        label: "Đã hủy",
        badgeClassName: "bg-red-50 text-red-700 border-red-200",
      };
    case "Pending":
      return {
        label: "Đang xử lý",
        badgeClassName: "bg-blue-50 text-blue-700 border-blue-200",
      };
    default:
      return {
        label: key || "Không rõ",
        badgeClassName: "bg-gray-50 text-gray-700 border-gray-200",
      };
  }
}

export function formatPaymentMethod(method: string | undefined): string {
  const key = (method || "").trim();
  switch (key) {
    case "PayOS":
      return "PayOS";
    case "COD":
      return "Thanh toán khi nhận hàng (COD)";
    default:
      return key || "Không rõ";
  }
}
