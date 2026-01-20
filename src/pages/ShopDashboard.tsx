import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Settings,
  Package,
  BarChart3,
  LogOut,
  Plus,
  Edit,
  Trash2,
  FileText,
  ShoppingCart,
  Heart,
  Star,
  Store,
  Upload,
  Link as LinkIcon,
  RefreshCw,
  AlertCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Loader2,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import Header from "@/components/Header";
import {
  shopApi,
  ShopProduct,
  ShopDashboardDto,
  ShopProfile,
  ProductFormData,
} from "@/services/shopApi";
import { apiService, type Category } from "@/services/apiService";
import { useToast } from "@/hooks/use-toast";
import { normalizeImageUrl } from "@/utils/imageUtils";
import {
  clearAuthData,
} from "@/utils/tokenUtils";

// Use interfaces from API service
type Product = ShopProduct;

type ShopOrderStatus =
  | "PendingPayment"
  | "Cancelled"
  | "Processing"
  | "Received"
  | "Preparing"
  | "Delivering"
  | "Delivered"
  // legacy values (for old rows)
  | "Pending"
  | "Paid"
  | "Shipping"
  | "Completed";

const ORDER_STATUS_LABEL_VI: Record<ShopOrderStatus, string> = {
  PendingPayment: "Chờ thanh toán",
  Cancelled: "Đã hủy",
  Processing: "Đang xử lý",
  Received: "Đã tiếp nhận",
  Preparing: "Đang chuẩn bị",
  Delivering: "Đang giao hàng",
  Delivered: "Đã giao hàng",

  // legacy mappings
  Pending: "Đang xử lý",
  Paid: "Đang xử lý",
  Shipping: "Đang giao hàng",
  Completed: "Đã giao hàng",
};

const getNextOrderStatus = (current: ShopOrderStatus): ShopOrderStatus | null => {
  switch (current) {
    case "Processing":
    case "Pending":
    case "Paid":
      return "Received";
    case "Received":
      return "Preparing";
    case "Preparing":
      return "Delivering";
    case "Delivering":
    case "Shipping":
      return "Delivered";
    case "Delivered":
    case "Completed":
    case "PendingPayment":
    case "Cancelled":
    default:
      return null;
  }
};

type ShopOrderLine = {
  orderItemId: number;
  productName: string;
  quantity: number;
  price: number;
  shopStatus?: string;
};

type ShopOrder = {
  orderId: number;
  orderCode?: string;
  orderDate: string;
  orderStatus: ShopOrderStatus | string;
  paymentMethod?: string;
  isPaid?: boolean;
  buyerName: string;
  buyerPhoneNumber: string;
  shippingAddress?: {
    street?: string;
    city?: string;
    district?: string;
    ward?: string;
  };
  items: ShopOrderLine[];
};

const normalizeShopOrder = (raw: any): ShopOrder => {
  const shipping = raw?.shippingAddress ?? raw?.ShippingAddress;
  const items = raw?.items ?? raw?.Items ?? [];
  return {
    orderId: raw?.orderId ?? raw?.OrderId ?? 0,
    orderCode: raw?.orderCode ?? raw?.OrderCode,
    orderDate: raw?.orderDate ?? raw?.OrderDate ?? "",
    orderStatus: raw?.orderStatus ?? raw?.OrderStatus ?? "Pending",
    paymentMethod: raw?.paymentMethod ?? raw?.PaymentMethod,
    isPaid: raw?.isPaid ?? raw?.IsPaid,
    buyerName: raw?.buyerName ?? raw?.BuyerName ?? "",
    buyerPhoneNumber: raw?.buyerPhoneNumber ?? raw?.BuyerPhoneNumber ?? "",
    shippingAddress: shipping
      ? {
          street: shipping?.street ?? shipping?.Street,
          city: shipping?.city ?? shipping?.City,
          district: shipping?.district ?? shipping?.District,
          ward: shipping?.ward ?? shipping?.Ward,
        }
      : undefined,
    items: Array.isArray(items)
      ? items.map((it: any) => ({
          orderItemId: it?.orderItemId ?? it?.OrderItemId ?? 0,
          productName: it?.productName ?? it?.ProductName ?? "",
          quantity: it?.quantity ?? it?.Quantity ?? 0,
          price: it?.price ?? it?.Price ?? 0,
          shopStatus: it?.shopStatus ?? it?.ShopStatus,
        }))
      : [],
  };
};

const normalizeShopProduct = (raw: any): ShopProduct => {
  const imagesArray = raw?.images ?? raw?.Images ?? [];
  const firstImageUrl =
    imagesArray?.[0]?.url ?? imagesArray?.[0]?.Url ?? undefined;

  return {
    ...raw,
    id: raw?.id ?? raw?.Id,
    name: raw?.name ?? raw?.Name,
    description: raw?.description ?? raw?.Description,
    features: raw?.features ?? raw?.Features,
    isPopular: raw?.isPopular ?? raw?.IsPopular ?? false,
    basePrice: raw?.basePrice ?? raw?.BasePrice ?? 0,
    maxPrice: raw?.maxPrice ?? raw?.MaxPrice,
    stockQuantity: raw?.stockQuantity ?? raw?.StockQuantity ?? 0,
    productCategoryId: raw?.productCategoryId ?? raw?.ProductCategoryId ?? 0,
    imageUrl:
      raw?.imageUrl ?? raw?.ImageUrl ?? raw?.primaryImageUrl ?? firstImageUrl,
    // Keep both keys so existing UI code can read either
    images: imagesArray,
    Images: imagesArray,
  } as ShopProduct;
};

const ShopDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<ShopDashboardDto | null>(
    null
  );
  const [shopProfile, setShopProfile] = useState<ShopProfile | null>(null);
  const [orders, setOrders] = useState<ShopOrder[]>([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<ShopOrder | null>(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const mustChangePassword =
    localStorage.getItem("mustChangePassword") === "true";

  const [profileForm, setProfileForm] = useState<{
    name: string;
    ownerFullName: string;
    ownerEmail: string;
    contactPhoneNumber: string;
    address: string;
    description: string;
    avatarFile?: File;
    avatarUrl: string;
  }>({
    name: "",
    ownerFullName: "",
    ownerEmail: "",
    contactPhoneNumber: "",
    address: "",
    description: "",
    avatarFile: undefined,
    avatarUrl: "",
  });
  const [avatarMethod, setAvatarMethod] = useState<"file" | "url">("file");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Support deep link to a tab (?tab=settings)
  useEffect(() => {
    const tab = new URLSearchParams(location.search).get("tab");
    if (tab) setActiveTab(tab);
  }, [location.search]);

  // Force settings tab during first-login password change
  useEffect(() => {
    if (mustChangePassword) setActiveTab("settings");
  }, [mustChangePassword]);

  // Check authentication - very lenient, only redirect if absolutely no auth info
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const userRole = localStorage.getItem("userRole");
    const userData = localStorage.getItem("userData");

    console.log("[ShopDashboard] Auth check (lenient):", {
      hasToken: !!token,
      tokenValue: token ? `${token.substring(0, 30)}...` : "none",
      userRole,
      hasUserData: !!userData,
    });

    // ONLY redirect if absolutely no authentication info exists
    // Allow access if ANY of these exist: token, userRole, or userData
    const hasAnyAuth = token || userRole || userData;

    if (!hasAnyAuth) {
      console.warn("[ShopDashboard] No auth info at all, redirecting to login");
      navigate("/login");
      return;
    }

    // If we have any auth info, allow access and let API calls handle validation
    // Don't set errors here - let API errors show instead
    console.log("[ShopDashboard] Auth info exists, allowing access");
  }, [navigate]);

  // Load data from API
  useEffect(() => {
    const loadShopData = async () => {
      // Always try to load data - let API handle authentication
      // If API returns 401, error handler will deal with it

      setLoading(true);
      setError(null);

      try {
        console.log("[ShopDashboard] Loading dashboard data...");

        // Load dashboard data
        const dashboardData = await shopApi.getDashboardData();

        console.log("[ShopDashboard] Dashboard data received:", dashboardData);

        // Map dashboard data - handle both PascalCase and camelCase
        const stats = {
          totalProducts:
            dashboardData.totalProducts ?? dashboardData.TotalProducts ?? 0,
          productsInStock:
            dashboardData.productsInStock ?? dashboardData.ProductsInStock ?? 0,
          outOfStockProducts:
            dashboardData.outOfStockProducts ??
            dashboardData.OutOfStockProducts ??
            0,
          pendingOrderItems:
            dashboardData.pendingOrderItems ??
            dashboardData.PendingOrderItems ??
            0,
          // Additional fields with default values for UI compatibility
          totalOrders: 0,
          pendingOrders:
            dashboardData.pendingOrderItems ??
            dashboardData.PendingOrderItems ??
            0,
          monthlyRevenue: 0,
          recentOrders: [],
          recentActivities: [],
        };

        console.log("[ShopDashboard] Mapped stats:", stats);
        setDashboardStats(stats);

        // Load categories (real DB categories) for product management UI
        try {
          const categoriesData = await apiService.getCategories();
          setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        } catch (categoryErr) {
          console.warn("[ShopDashboard] Failed to load categories:", categoryErr);
          setCategories([]);
        }

        // Load products
        const productsData = await shopApi.getShopProducts();
        const normalized = Array.isArray(productsData)
          ? productsData.map(normalizeShopProduct)
          : [];
        setProducts(normalized);

        // Load shop profile
        const profileData = await shopApi.getShopProfile();
        setShopProfile(profileData);

        // Load orders
        const ordersData = await shopApi.getShopOrders(
          orderStatusFilter ? { status: orderStatusFilter } : undefined
        );
        const normalizedOrders = Array.isArray(ordersData)
          ? ordersData.map(normalizeShopOrder)
          : [];
        setOrders(normalizedOrders);
      } catch (err: any) {
        console.error("Error loading shop data:", err);

        // Handle 401 Unauthorized - show error but don't redirect
        if (
          err?.message?.includes("401") ||
          err?.message?.includes("Unauthorized")
        ) {
          console.warn(
            "[ShopDashboard] 401 Unauthorized - showing error (not redirecting)"
          );
          setError(
            "Bạn không có quyền truy cập hoặc token đã hết hạn. Vui lòng đăng nhập lại."
          );
          // Don't auto-redirect - let user stay and see the error message
          return;
        }

        // Show user-friendly error message
        const errorMessage =
          err?.message || "Không thể tải dữ liệu. Vui lòng thử lại sau.";

        // If it's a network error, provide more helpful message
        if (
          errorMessage.includes("Không thể kết nối đến server") ||
          errorMessage.includes("Failed to fetch")
        ) {
          setError(
            `${errorMessage}\n\nVui lòng đảm bảo backend server đang chạy tại https://localhost:5001`
          );
        } else {
          setError(errorMessage);
        }

        // Fallback to sample data if API fails
        const sampleProducts: Product[] = [
          {
            id: 1,
            name: "Hoa Hồng Đỏ",
            description: "Hoa hồng đỏ tươi, biểu tượng của tình yêu",
            features: "Ý nghĩa cao quý;Màu sắc rực rỡ",
            isPopular: true,
            basePrice: 150000,
            maxPrice: 300000,
            stockQuantity: 50,
            productCategoryId: 1,
            imageUrl:
              "https://images.unsplash.com/photo-1563241527-3004b7be0ffd",
            specifications: {
              xuatXu: "Việt Nam",
              baoQuan: "Nơi khô ráo, thoáng mát",
              hanSuDung: "3-5 ngày",
            },
          },
          {
            id: 2,
            name: "Xôi Nước Cốt Dừa",
            description: "Xôi nước cốt dừa thơm béo, vị ngọt đậm đà",
            features: "Thơm béo;Vị ngọt tự nhiên",
            isPopular: false,
            basePrice: 50000,
            stockQuantity: 30,
            productCategoryId: 3,
            imageUrl:
              "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b",
            specifications: {
              xuatXu: "Việt Nam",
              baoQuan: "Bảo quản lạnh",
              hanSuDung: "1-2 ngày",
            },
          },
          {
            id: 3,
            name: "Combo Tốt Nghiệp Cơ Bản",
            description: "Gói cơ bản với hoa tươi và hương nến",
            features: "Đầy đủ vật phẩm;Ý nghĩa tốt lành",
            isPopular: true,
            basePrice: 300000,
            stockQuantity: 20,
            productCategoryId: 4,
            imageUrl:
              "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0",
            specifications: {
              xuatXu: "Việt Nam",
              baoQuan: "Nơi khô ráo",
              hanSuDung: "7 ngày",
            },
          },
        ];
        setProducts(sampleProducts);
      } finally {
        setLoading(false);
      }
    };

    loadShopData();
  }, [orderStatusFilter]);

  const handleUpdateOrderStatus = async (
    orderId: number,
    newStatus: ShopOrderStatus
  ) => {
    try {
      await shopApi.updateOrderStatus(String(orderId), newStatus);
      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId ? { ...o, orderStatus: newStatus } : o
        )
      );
    } catch (err) {
      console.error("Error updating order status:", err);
      setError("Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại sau.");
    }
  };

  const normalizeOrderStatus = (value: string): ShopOrderStatus => {
    const v = String(value || "Pending");
    const allowed: Record<string, true> = {
      PendingPayment: true,
      Cancelled: true,
      Processing: true,
      Received: true,
      Preparing: true,
      Delivering: true,
      Delivered: true,

      // legacy values
      Pending: true,
      Paid: true,
      Shipping: true,
      Completed: true,
    };

    return allowed[v] ? (v as ShopOrderStatus) : "Pending";
  };

  const getOrderStatusLabelVi = (value: string) => {
    const status = normalizeOrderStatus(value);
    return ORDER_STATUS_LABEL_VI[status];
  };

  const formatAddress = (a?: ShopOrder["shippingAddress"]) => {
    if (!a) return "";
    const parts = [a.street, a.ward, a.district, a.city].filter(Boolean);
    return parts.join(", ");
  };

  const handleLogout = () => {
    clearAuthData();
    navigate("/login");
  };

  const validatePassword = (password: string) => {
    if (password.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
    return null;
  };

  const handleSaveShopProfile = async () => {
    if (!profileForm.name.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên cửa hàng",
        variant: "destructive",
      });
      return;
    }

    setIsSavingProfile(true);
    try {
      await shopApi.updateShopProfile({
        name: profileForm.name,
        ownerFullName: profileForm.ownerFullName,
        ownerEmail: profileForm.ownerEmail,
        contactPhoneNumber: profileForm.contactPhoneNumber,
        address: profileForm.address,
        description: profileForm.description,
        avatarFile: avatarMethod === "file" ? profileForm.avatarFile : undefined,
        avatarUrl: avatarMethod === "url" ? profileForm.avatarUrl : undefined,
      });

      const refreshed = await shopApi.getShopProfile();
      setShopProfile(refreshed);
      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin cửa hàng",
      });
    } catch (err: any) {
      const message =
        err?.message || "Không thể cập nhật thông tin. Vui lòng thử lại.";
      toast({
        title: "Lỗi",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (
      !passwordData.oldPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive",
      });
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu mới và xác nhận mật khẩu không khớp",
        variant: "destructive",
      });
      return;
    }
    const passwordError = validatePassword(passwordData.newPassword);
    if (passwordError) {
      toast({ title: "Lỗi", description: passwordError, variant: "destructive" });
      return;
    }

    setIsChangingPassword(true);
    try {
      await apiService.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      if (mustChangePassword) {
        localStorage.removeItem("mustChangePassword");
      }

      toast({
        title: "Thành công",
        description: "Mật khẩu đã được thay đổi thành công",
      });
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });

      if (mustChangePassword) {
        navigate("/shop-dashboard", { replace: true });
      }
    } catch (err) {
      console.error("Error changing password:", err);
      toast({
        title: "Lỗi",
        description:
          "Không thể thay đổi mật khẩu. Vui lòng kiểm tra mật khẩu cũ và thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập mật khẩu để xác nhận",
        variant: "destructive",
      });
      return;
    }

    setIsDeletingAccount(true);
    try {
      await apiService.deleteAccount({ password: deletePassword });
      toast({
        title: "Tài khoản đã được xóa",
        description: "Tài khoản của bạn đã được xóa thành công",
      });
      clearAuthData();
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Error deleting account:", err);
      toast({
        title: "Lỗi",
        description:
          "Không thể xóa tài khoản. Vui lòng kiểm tra mật khẩu và thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsDeletingAccount(false);
    }
  };

  // Keep settings form in sync with loaded profile
  useEffect(() => {
    if (!shopProfile) return;
    setProfileForm((prev) => ({
      ...prev,
      name: shopProfile.name || "",
      ownerFullName: shopProfile.ownerFullName || "",
      ownerEmail: shopProfile.ownerEmail || "",
      contactPhoneNumber: shopProfile.contactPhoneNumber || "",
      address: shopProfile.address || "",
      description: shopProfile.description || "",
    }));
  }, [shopProfile]);

  useEffect(() => {
    if (!profileForm.avatarFile) {
      setAvatarPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(profileForm.avatarFile);
    setAvatarPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [profileForm.avatarFile]);

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await shopApi.deleteProduct(id.toString());
        setProducts(products.filter((p) => p.id !== id));
      } catch (err) {
        console.error("Error deleting product:", err);
        setError("Không thể xóa sản phẩm. Vui lòng thử lại sau.");
      }
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const handleSaveProduct = async (formData: ProductFormData) => {
    try {
      const refreshProducts = async () => {
        const productsData = await shopApi.getShopProducts();
        const normalized = Array.isArray(productsData)
          ? productsData.map(normalizeShopProduct)
          : [];
        setProducts(normalized);
      };

      if (editingProduct) {
        const existingImages: any[] =
          (editingProduct as any)?.images ?? (editingProduct as any)?.Images ?? [];
        const existingImageIds: number[] = existingImages
          .map((img) => img?.id ?? img?.Id)
          .filter((v) => typeof v === "number" && !Number.isNaN(v));

        // Update existing product
        const imageUrls = (formData.imageUrls ?? [])
          .map((u) => String(u).trim())
          .filter((u) => u.length > 0);
        const imageFiles = (formData.imageFiles ?? []).filter(Boolean);

        const keepImageIds =
          formData.keepImageIds ?? (existingImageIds.length ? existingImageIds : undefined);

        const apiProductData = {
          name: formData.name,
          description: formData.description,
          features: formData.features,
          isPopular: formData.isPopular,
          basePrice: formData.basePrice,
          maxPrice: formData.maxPrice,
          stockQuantity: formData.stockQuantity,
          productCategoryId: formData.productCategoryId,
          specifications: (formData.specifications as any) || undefined,
          keepImageIds,
          imageUrls: imageUrls.length ? imageUrls : undefined,
          imageFiles: imageFiles.length ? imageFiles : undefined,
        };

        await shopApi.updateProduct(editingProduct.id.toString(), apiProductData);
        await refreshProducts();
      } else {
        // Add new product
        const imageUrls = (formData.imageUrls ?? [])
          .map((u) => String(u).trim())
          .filter((u) => u.length > 0);
        const imageFiles = (formData.imageFiles ?? []).filter(Boolean);

        const apiProductData = {
          name: formData.name,
          description: formData.description,
          features: formData.features,
          isPopular: formData.isPopular,
          basePrice: formData.basePrice,
          maxPrice: formData.maxPrice,
          stockQuantity: formData.stockQuantity,
          productCategoryId: formData.productCategoryId,
          specifications: (formData.specifications as any) || undefined,
          imageUrls: imageUrls.length ? imageUrls : undefined,
          imageFiles: imageFiles.length ? imageFiles : undefined,
        };

        await shopApi.createProduct(apiProductData);
        await refreshProducts();
      }
      setShowAddForm(false);
      setEditingProduct(null);
    } catch (err) {
      console.error("Error saving product:", err);
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("403") || message.toLowerCase().includes("forbidden")) {
        setError("Bạn không có quyền cập nhật sản phẩm này (403).");
        return;
      }
      if (message.includes("404") || message.toLowerCase().includes("not found")) {
        setError(
          "Không tìm thấy sản phẩm hoặc bạn không có quyền cập nhật sản phẩm này."
        );
      } else {
        setError("Không thể lưu sản phẩm. Vui lòng thử lại sau.");
      }
    }
  };

  const getCategoryName = (categoryId: number) => {
    if (!categoryId) return "Chưa chọn";
    return (
      categories.find((c) => c.id === categoryId)?.name ?? `ID: ${categoryId}`
    );
  };

  // Use dashboardStats from API, fallback to products data if not available
  const stats = [
    {
      title: "Tổng Sản Phẩm",
      value: dashboardStats?.totalProducts ?? products.length,
      icon: Package,
      color: "bg-blue-500",
    },
    {
      title: "Đang Bán",
      value:
        dashboardStats?.productsInStock ??
        products.filter((p) => p.stockQuantity > 0).length,
      icon: ShoppingCart,
      color: "bg-green-500",
    },
    {
      title: "Hết Hàng",
      value:
        dashboardStats?.outOfStockProducts ??
        products.filter((p) => p.stockQuantity <= 0).length,
      icon: Heart,
      color: "bg-red-500",
    },
    {
      title: "Đơn Hàng Chờ",
      value: dashboardStats?.pendingOrderItems ?? 0,
      icon: FileText,
      color: "bg-amber-500",
    },
  ];

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "products", label: "Quản Lý Sản Phẩm", icon: Package },
    { id: "orders", label: "Đơn Hàng", icon: FileText },
    { id: "settings", label: "Cài Đặt", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Include Header */}
      <Header />

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-[calc(100vh-4rem)]">
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold text-[#C99F4D]">Shop Panel</h1>
            <Badge className="mt-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800">
              Chủ Cửa Hàng
            </Badge>
          </div>

          <nav className="mt-6">
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (mustChangePassword && item.id !== "settings") {
                      toast({
                        title: "Cần đổi mật khẩu",
                        description:
                          "Vui lòng đổi mật khẩu khởi tạo trước khi sử dụng các tính năng khác.",
                        variant: "destructive",
                      });
                      setActiveTab("settings");
                      return;
                    }
                    setActiveTab(item.id);
                  }}
                  className={`w-full flex items-center px-6 py-3 text-left hover:bg-green-50 transition-colors ${
                    activeTab === item.id
                      ? "bg-green-50 border-r-4 border-green-500 text-green-700"
                      : "text-gray-600"
                  }`}
                >
                  <IconComponent className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                {sidebarItems.find((item) => item.id === activeTab)?.label ||
                  "Dashboard"}
              </h2>
              <p className="text-gray-600 mt-2">
                Quản lý và điều chỉnh cửa hàng của bạn
              </p>
            </div>
          </div>

          {/* Dashboard Content */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C99F4D]"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span>{error}</span>
                  </div>
                </div>
              ) : (
                <>
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => {
                      const IconComponent = stat.icon;
                      return (
                        <Card
                          key={index}
                          className="hover:shadow-lg transition-shadow"
                        >
                          <CardContent className="p-6 flex items-center">
                            <div
                              className={`p-3 rounded-full ${stat.color} text-white mr-4`}
                            >
                              <IconComponent className="h-6 w-6" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                {stat.title}
                              </p>
                              <p className="text-2xl font-bold text-gray-800">
                                {stat.value}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Hoạt Động Gần Đây</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {dashboardStats?.recentActivities?.map(
                          (activity, index) => (
                            <div
                              key={index}
                              className={`flex items-center justify-between p-4 rounded-lg ${
                                activity.type === "product_updated"
                                  ? "bg-green-50"
                                  : activity.type === "order_created"
                                  ? "bg-blue-50"
                                  : "bg-amber-50"
                              }`}
                            >
                              <div className="flex items-center">
                                <div
                                  className={`w-2 h-2 rounded-full mr-3 ${
                                    activity.type === "product_updated"
                                      ? "bg-green-500"
                                      : activity.type === "order_created"
                                      ? "bg-blue-500"
                                      : "bg-amber-500"
                                  }`}
                                ></div>
                                <span>{activity.description}</span>
                              </div>
                              <span className="text-sm text-gray-500">
                                {new Date(activity.timestamp).toLocaleString(
                                  "vi-VN"
                                )}
                              </span>
                            </div>
                          )
                        ) || (
                          <div className="text-center py-8 text-gray-500">
                            Chưa có hoạt động nào
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          )}

          {/* Products Management */}
          {activeTab === "products" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold">Quản Lý Sản Phẩm</h3>
                  <p className="text-gray-600">Thêm, sửa, xóa sản phẩm</p>
                </div>
                <Button
                  onClick={() => {
                    setEditingProduct(null);
                    setShowAddForm(true);
                  }}
                  className="bg-[#C99F4D] hover:bg-[#B8904A]"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm Sản Phẩm
                </Button>
              </div>

              {/* Products Table */}
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Sản Phẩm
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Danh Mục
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Giá
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Trạng Thái
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Thao Tác
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                          <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <img
                                  src={
                                    product.imageUrl ||
                                    (product.imageFile
                                      ? URL.createObjectURL(product.imageFile)
                                      : "/placeholder.svg")
                                  }
                                  alt={product.name}
                                  className="h-10 w-10 rounded-lg object-cover mr-3"
                                />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {product.name}
                                    {product.isPopular && (
                                      <Star className="h-4 w-4 inline ml-1 text-yellow-500" />
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-500 truncate max-w-xs">
                                    {product.description}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant="outline">
                                {getCategoryName(product.productCategoryId)}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {product.basePrice.toLocaleString("vi-VN")}đ
                              {product.maxPrice &&
                                ` - ${product.maxPrice.toLocaleString(
                                  "vi-VN"
                                )}đ`}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge
                                className={
                                  product.stockQuantity > 0
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }
                              >
                                {product.stockQuantity > 0
                                  ? `Còn ${product.stockQuantity}`
                                  : "Hết hàng"}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditProduct(product)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 hover:bg-red-50"
                                  onClick={() =>
                                    handleDeleteProduct(product.id)
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Orders Management */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold">Đơn Hàng</h3>
                  <p className="text-gray-600">
                    Danh sách đơn hàng thuộc cửa hàng
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    title="Lọc theo trạng thái"
                  >
                    <option value="">Tất cả trạng thái</option>
                    <option value="PendingPayment">Chờ thanh toán</option>
                  <option value="Processing">Đang xử lý</option>
                  <option value="Received">Đã tiếp nhận</option>
                  <option value="Preparing">Đang chuẩn bị</option>
                  <option value="Delivering">Đang giao hàng</option>
                  <option value="Delivered">Đã giao hàng</option>
                  <option value="Pending">Đang xử lý (cũ)</option>
                  <option value="Paid">Đã thanh toán (cũ)</option>
                  <option value="Shipping">Đang giao hàng (cũ)</option>
                  <option value="Completed">Hoàn tất (cũ)</option>
                    <option value="Cancelled">Đã hủy</option>
                  </select>

                  <Button
                    variant="outline"
                    onClick={() => setOrderStatusFilter((v) => v)}
                    title="Tải lại"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Tải lại
                  </Button>
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  {orders.length === 0 ? (
                    <div className="text-center py-16 text-gray-500">
                      Không có đơn hàng phù hợp.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Đơn
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Chi tiết đơn hàng
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Trạng thái
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Thanh toán
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Xử lý đơn
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {orders.map((order) => (
                            <tr
                              key={order.orderId}
                              className="hover:bg-gray-50"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <div className="font-medium">{order.orderCode || `#${order.orderId}`}</div>
                                <div className="text-xs text-gray-500">
                                  {order.orderDate
                                    ? new Date(order.orderDate).toLocaleString(
                                        "vi-VN"
                                      )
                                    : ""}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {(() => {
                                  const items = order.items || [];
                                  const lineCount = items.length;
                                  const total = items.reduce(
                                    (sum, it) =>
                                      sum +
                                      (Number(it.price) || 0) *
                                        (Number(it.quantity) || 0),
                                    0
                                  );

                                  return (
                                    <div className="space-y-1">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setSelectedOrder(order);
                                          setIsOrderDetailsOpen(true);
                                        }}
                                      >
                                        Chi tiết
                                      </Button>

                                      <div className="text-sm font-medium text-gray-900">
                                        {order.buyerName}
                                      </div>
                                      <div className="text-sm text-gray-700">
                                        {order.buyerPhoneNumber}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {lineCount} sản phẩm · Tổng {total.toLocaleString("vi-VN")}đ
                                      </div>
                                    </div>
                                  );
                                })()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant="outline">
                                  {getOrderStatusLabelVi(String(order.orderStatus))}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {(() => {
                                  const paymentMethod = String(order.paymentMethod || "");
                                  const isPaid = Boolean(order.isPaid);
                                  const label = isPaid
                                    ? "Đã thanh toán"
                                    : paymentMethod === "COD"
                                      ? "Chưa thanh toán"
                                      : "Chưa thanh toán";

                                  const className = isPaid
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-yellow-50 text-yellow-700 border-yellow-200";

                                  return (
                                    <Badge variant="outline" className={className} title={paymentMethod ? `Phương thức: ${paymentMethod}` : undefined}>
                                      {label}
                                    </Badge>
                                  );
                                })()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {(() => {
                                  const status = normalizeOrderStatus(
                                    String(order.orderStatus)
                                  );
                                  const next = getNextOrderStatus(status);
                                  const canAdvance = !!next;
                                  const canCancel =
                                    status !== "Cancelled" &&
                                    status !== "Completed" &&
                                    status !== "Delivered";

                                  const paymentMethod = String(order.paymentMethod || "");
                                  const isPaid = Boolean(order.isPaid);
                                  const payosUnpaidBlocked =
                                    paymentMethod === "PayOS" && !isPaid;

                                  return (
                                    <div className="flex items-center gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        disabled={!canAdvance || payosUnpaidBlocked}
                                        onClick={() =>
                                          next &&
                                          handleUpdateOrderStatus(
                                            order.orderId,
                                            next
                                          )
                                        }
                                        title={
                                          payosUnpaidBlocked
                                            ? "Đơn hàng PayOS chưa thanh toán - không thể xử lý"
                                            : canAdvance
                                            ? `Chuyển: ${getOrderStatusLabelVi(
                                                status
                                              )} → ${getOrderStatusLabelVi(next!)}`
                                            : "Không thể chuyển tiếp"
                                        }
                                      >
                                        {canAdvance
                                          ? `Chuyển → ${getOrderStatusLabelVi(next!)}`
                                          : "Đã hoàn tất"}
                                      </Button>

                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-red-600 hover:bg-red-50"
                                        disabled={!canCancel || payosUnpaidBlocked}
                                        onClick={() =>
                                          handleUpdateOrderStatus(order.orderId, "Cancelled")
                                        }
                                        title="Hủy đơn hàng"
                                      >
                                        Hủy
                                      </Button>
                                    </div>
                                  );
                                })()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <Dialog
                    open={isOrderDetailsOpen}
                    onOpenChange={(open) => {
                      setIsOrderDetailsOpen(open);
                      if (!open) setSelectedOrder(null);
                    }}
                  >
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>
                          {selectedOrder
                              ? `Đơn hàng ${selectedOrder.orderCode || `#${selectedOrder.orderId}`}`
                            : "Chi tiết đơn hàng"}
                        </DialogTitle>
                        <DialogDescription>
                          {selectedOrder?.orderDate
                            ? new Date(selectedOrder.orderDate).toLocaleString(
                                "vi-VN"
                              )
                            : ""}
                        </DialogDescription>
                      </DialogHeader>

                      {selectedOrder ? (
                        <div className="space-y-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline">
                              {getOrderStatusLabelVi(
                                String(selectedOrder.orderStatus)
                              )}
                            </Badge>
                            {(() => {
                              const paymentMethod = String(
                                selectedOrder.paymentMethod || ""
                              );
                              const isPaid = Boolean(selectedOrder.isPaid);
                              const label = isPaid
                                ? "Đã thanh toán"
                                : "Chưa thanh toán";
                              const className = isPaid
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-yellow-50 text-yellow-700 border-yellow-200";
                              return (
                                <Badge
                                  variant="outline"
                                  className={className}
                                  title={
                                    paymentMethod
                                      ? `Phương thức: ${paymentMethod}`
                                      : undefined
                                  }
                                >
                                  {label}
                                </Badge>
                              );
                            })()}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="rounded-md border p-4">
                              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                Khách hàng
                              </div>
                              <div className="font-medium">
                                {selectedOrder.buyerName}
                              </div>
                              <div className="text-sm text-gray-600">
                                {selectedOrder.buyerPhoneNumber}
                              </div>
                            </div>
                            <div className="rounded-md border p-4">
                              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                Địa chỉ
                              </div>
                              <div className="text-sm text-gray-700">
                                {formatAddress(selectedOrder.shippingAddress)}
                              </div>
                            </div>
                          </div>

                          <div className="rounded-md border p-4">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                              Sản phẩm
                            </div>
                            <div className="space-y-2">
                              {(selectedOrder.items || []).length === 0 ? (
                                <div className="text-gray-500">(Trống)</div>
                              ) : (
                                (selectedOrder.items || []).map((it) => (
                                  <div
                                    key={it.orderItemId}
                                    className="flex items-start justify-between gap-4"
                                  >
                                    <div className="min-w-0">
                                      <div
                                        className="truncate font-medium"
                                        title={it.productName}
                                      >
                                        {it.productName}
                                      </div>
                                    </div>
                                    <div className="whitespace-nowrap text-sm text-gray-700">
                                      x{Number(it.quantity) || 0} · {(Number(
                                        it.price
                                      ) || 0).toLocaleString("vi-VN")}đ
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                            <div className="mt-3 flex justify-between text-sm font-semibold">
                              <span className="text-gray-600">Tổng</span>
                              <span>
                                {(selectedOrder.items || [])
                                  .reduce(
                                    (sum, it) =>
                                      sum +
                                      (Number(it.price) || 0) *
                                        (Number(it.quantity) || 0),
                                    0
                                  )
                                  .toLocaleString("vi-VN")}đ
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Settings */}
          {activeTab === "settings" && (
            <div className="space-y-8">
              {mustChangePassword && (
                <Alert className="border-amber-200 bg-amber-50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Đây là lần đăng nhập đầu tiên với mật khẩu khởi tạo. Vui lòng
                    đổi mật khẩu để tiếp tục.
                  </AlertDescription>
                </Alert>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="h-5 w-5" />
                    Thông Tin Cửa Hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="shopName">Tên cửa hàng</Label>
                      <Input
                        id="shopName"
                        value={profileForm.name}
                        onChange={(e) =>
                          setProfileForm((p) => ({ ...p, name: e.target.value }))
                        }
                        placeholder="Nhập tên cửa hàng"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ownerName">Tên chủ shop</Label>
                      <Input
                        id="ownerName"
                        value={profileForm.ownerFullName}
                        onChange={(e) =>
                          setProfileForm((p) => ({
                            ...p,
                            ownerFullName: e.target.value,
                          }))
                        }
                        placeholder="Nhập tên chủ shop"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ownerEmail">Email cửa hàng</Label>
                      <Input
                        id="ownerEmail"
                        type="email"
                        value={profileForm.ownerEmail}
                        onChange={(e) =>
                          setProfileForm((p) => ({
                            ...p,
                            ownerEmail: e.target.value,
                          }))
                        }
                        placeholder="Nhập email"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Số điện thoại</Label>
                      <Input
                        id="phone"
                        value={profileForm.contactPhoneNumber}
                        onChange={(e) =>
                          setProfileForm((p) => ({
                            ...p,
                            contactPhoneNumber: e.target.value,
                          }))
                        }
                        placeholder="Nhập số điện thoại"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Địa chỉ</Label>
                      <Input
                        id="address"
                        value={profileForm.address}
                        onChange={(e) =>
                          setProfileForm((p) => ({
                            ...p,
                            address: e.target.value,
                          }))
                        }
                        placeholder="Nhập địa chỉ"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Giới thiệu</Label>
                    <Textarea
                      id="description"
                      value={profileForm.description}
                      onChange={(e) =>
                        setProfileForm((p) => ({
                          ...p,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Giới thiệu cửa hàng"
                      rows={4}
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <Label>Ảnh đại diện (upload)</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant={avatarMethod === "file" ? "default" : "outline"}
                          onClick={() => setAvatarMethod("file")}
                          size="sm"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          File
                        </Button>
                        <Button
                          type="button"
                          variant={avatarMethod === "url" ? "default" : "outline"}
                          onClick={() => setAvatarMethod("url")}
                          size="sm"
                        >
                          <LinkIcon className="h-4 w-4 mr-2" />
                          URL
                        </Button>
                      </div>

                      {avatarMethod === "file" ? (
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            setProfileForm((p) => ({
                              ...p,
                              avatarFile: e.target.files?.[0],
                            }))
                          }
                        />
                      ) : (
                        <Input
                          value={profileForm.avatarUrl}
                          onChange={(e) =>
                            setProfileForm((p) => ({
                              ...p,
                              avatarUrl: e.target.value,
                            }))
                          }
                          placeholder="https://..."
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Xem trước</Label>
                      <div className="rounded-lg border bg-white p-3 flex items-center justify-center min-h-32">
                        {avatarPreviewUrl ? (
                          <img
                            src={avatarPreviewUrl}
                            alt="avatar preview"
                            className="max-h-28 rounded-md object-contain"
                          />
                        ) : avatarMethod === "url" && profileForm.avatarUrl ? (
                          <img
                            src={profileForm.avatarUrl}
                            alt="avatar preview"
                            className="max-h-28 rounded-md object-contain"
                          />
                        ) : shopProfile?.avatarBase64 ? (
                          <img
                            src={normalizeImageUrl(shopProfile.avatarBase64)}
                            alt="avatar"
                            className="max-h-28 rounded-md object-contain"
                          />
                        ) : (
                          <div className="text-sm text-gray-500">Chưa có ảnh</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    <Button
                      type="button"
                      onClick={handleSaveShopProfile}
                      disabled={isSavingProfile}
                    >
                      {isSavingProfile ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Đang lưu...
                        </>
                      ) : (
                        "Lưu thay đổi"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Thay Đổi Mật Khẩu
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="oldPassword">Mật khẩu hiện tại</Label>
                    <div className="relative">
                      <Input
                        id="oldPassword"
                        type={showPasswords.old ? "text" : "password"}
                        value={passwordData.oldPassword}
                        onChange={(e) =>
                          setPasswordData((p) => ({
                            ...p,
                            oldPassword: e.target.value,
                          }))
                        }
                        placeholder="Nhập mật khẩu hiện tại"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowPasswords((s) => ({ ...s, old: !s.old }))
                        }
                      >
                        {showPasswords.old ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="newPassword">Mật khẩu mới</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData((p) => ({
                            ...p,
                            newPassword: e.target.value,
                          }))
                        }
                        placeholder="Nhập mật khẩu mới"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowPasswords((s) => ({ ...s, new: !s.new }))
                        }
                      >
                        {showPasswords.new ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData((p) => ({
                            ...p,
                            confirmPassword: e.target.value,
                          }))
                        }
                        placeholder="Nhập lại mật khẩu mới"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowPasswords((s) => ({
                            ...s,
                            confirm: !s.confirm,
                          }))
                        }
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-end">
                    <Button
                      type="button"
                      onClick={handleChangePassword}
                      disabled={isChangingPassword}
                    >
                      {isChangingPassword ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Đang đổi...
                        </>
                      ) : (
                        "Đổi mật khẩu"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <Trash2 className="h-5 w-5" />
                    Xóa Tài Khoản
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Hành động này không thể hoàn tác. Vui lòng nhập mật khẩu để
                      xác nhận.
                    </AlertDescription>
                  </Alert>

                  {!showDeleteConfirm ? (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      Tôi muốn xóa tài khoản
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="deletePassword">Mật khẩu</Label>
                        <div className="relative">
                          <Input
                            id="deletePassword"
                            type={showDeletePassword ? "text" : "password"}
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            placeholder="Nhập mật khẩu để xác nhận"
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowDeletePassword((v) => !v)}
                          >
                            {showDeletePassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button
                          type="button"
                          variant="destructive"
                          disabled={isDeletingAccount}
                          onClick={handleDeleteAccount}
                        >
                          {isDeletingAccount ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Đang xóa...
                            </>
                          ) : (
                            "Xác nhận xóa"
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowDeleteConfirm(false);
                            setDeletePassword("");
                          }}
                        >
                          Hủy
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {showAddForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          categories={categories}
          onCancel={() => {
            setShowAddForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};

// Product Form Component
const ProductForm = ({
  product,
  onSave,
  categories,
  onCancel,
}: {
  product: Product | null;
  onSave: (data: ProductFormData) => void;
  categories: Category[];
  onCancel: () => void;
}) => {
  const rawExistingImages: any[] =
    (product as any)?.images ?? (product as any)?.Images ?? [];
  const existingImages: Array<{ id: number; url: string }> = Array.isArray(
    rawExistingImages
  )
    ? rawExistingImages
        .map((img: any) => ({
          id: img?.id ?? img?.Id,
          url: img?.url ?? img?.Url,
        }))
        .filter(
          (img: any) =>
            typeof img?.id === "number" &&
            !Number.isNaN(img.id) &&
            typeof img?.url === "string" &&
            img.url.trim().length > 0
        )
    : [];

  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || "",
    description: product?.description || "",
    features: product?.features || "",
    isPopular: product?.isPopular ?? false,
    basePrice: product?.basePrice || 0,
    maxPrice: product?.maxPrice ?? undefined,
    stockQuantity: product?.stockQuantity || 0,
    productCategoryId: product?.productCategoryId ?? 0,
    imageUrls: [],
    imageFiles: [],
    keepImageIds: existingImages.map((i) => i.id),
    specifications: {
      xuatXu: product?.specifications?.xuatXu || "",
      baoQuan: product?.specifications?.baoQuan || "",
      hanSuDung: product?.specifications?.hanSuDung || "",
    },
  });

  const [imageMethod, setImageMethod] = useState<"url" | "file">("url");
  const [urlDraft, setUrlDraft] = useState<string>("");
  const [filePreviewUrls, setFilePreviewUrls] = useState<string[]>([]);
  const [drivePreviewWarning, setDrivePreviewWarning] = useState(false);

  const isGoogleDriveLink = (u: string) => {
    const s = String(u || "").toLowerCase();
    return (
      s.includes("drive.google.com") ||
      s.includes("drive.usercontent.google.com") ||
      s.includes("googleusercontent.com")
    );
  };

  useEffect(() => {
    const urls = (formData.imageFiles ?? []).map((f) => URL.createObjectURL(f));
    setFilePreviewUrls(urls);
    return () => {
      for (const u of urls) URL.revokeObjectURL(u);
    };
  }, [formData.imageFiles]);

  const toggleKeepExisting = (id: number) => {
    setFormData((prev) => {
      const current = prev.keepImageIds ?? [];
      const has = current.includes(id);
      return {
        ...prev,
        keepImageIds: has ? current.filter((x) => x !== id) : [...current, id],
      };
    });
  };

  const addImageUrl = () => {
    const url = urlDraft.trim();
    if (!url) return;
    setFormData((prev) => ({
      ...prev,
      imageUrls: [...(prev.imageUrls ?? []), url],
    }));
    setUrlDraft("");
  };

  const removeImageUrlAt = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: (prev.imageUrls ?? []).filter((_, i) => i !== index),
    }));
  };

  const addImageFiles = (files: File[]) => {
    if (!files.length) return;
    setFormData((prev) => ({
      ...prev,
      imageFiles: [...(prev.imageFiles ?? []), ...files],
    }));
  };

  const removeImageFileAt = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      imageFiles: (prev.imageFiles ?? []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const keptExistingCount = (formData.keepImageIds ?? []).length;
    const newCount =
      (formData.imageUrls ?? []).length + (formData.imageFiles ?? []).length;
    if (product && existingImages.length > 0 && keptExistingCount === 0 && newCount === 0) {
      alert(
        "Bạn đã bỏ hết ảnh hiện có. Vui lòng thêm ít nhất 1 ảnh mới (URL hoặc file)."
      );
      return;
    }

    onSave(formData);
  };

  const currentCategoryExists =
    !!formData.productCategoryId &&
    categories.some((c) => c.id === formData.productCategoryId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>
            {product ? "Chỉnh Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Thông tin cơ bản */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Thông tin cơ bản
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tên sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ví dụ: Hoa Hồng Đỏ"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Danh mục <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.productCategoryId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        productCategoryId: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    title="Chọn danh mục sản phẩm"
                    required
                  >
                    <option value={0} disabled>
                      Chọn danh mục
                    </option>
                    {!currentCategoryExists && formData.productCategoryId ? (
                      <option value={formData.productCategoryId}>
                        ID: {formData.productCategoryId} (không tồn tại)
                      </option>
                    ) : null}
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Mô tả sản phẩm
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Mô tả ngắn về sản phẩm"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Đặc điểm sản phẩm
                </label>
                <Textarea
                  value={formData.features}
                  onChange={(e) =>
                    setFormData({ ...formData, features: e.target.value })
                  }
                  placeholder="Các đặc điểm phân cách bằng dấu ; (ví dụ: Ý nghĩa cao quý;Màu sắc rực rỡ)"
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-3">
                <Switch
                  checked={formData.isPopular}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isPopular: checked })
                  }
                />
                <label className="text-sm font-medium">Sản phẩm nổi bật</label>
              </div>
            </div>

            {/* Giá và số lượng */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Giá và tồn kho
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Giá gốc (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.basePrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        basePrice: Number(e.target.value),
                      })
                    }
                    placeholder="150000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Giá tối đa (VNĐ)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.maxPrice ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxPrice: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                    placeholder="300000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Số lượng tồn kho <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.stockQuantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stockQuantity: Number(e.target.value),
                      })
                    }
                    placeholder="50"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Hình ảnh */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Hình ảnh sản phẩm
              </h3>

              {existingImages.length > 0 ? (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">
                    Ảnh hiện có
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {existingImages.map((img) => {
                      const kept = (formData.keepImageIds ?? []).includes(img.id);
                      return (
                        <div
                          key={img.id}
                          className="relative rounded-md border border-gray-200 overflow-hidden"
                        >
                          <img
                            src={normalizeImageUrl(img.url)}
                            alt=""
                            className={`h-24 w-full object-cover ${
                              kept ? "opacity-100" : "opacity-40"
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => toggleKeepExisting(img.id)}
                            className={`absolute top-1 right-1 inline-flex items-center justify-center rounded-full h-7 w-7 border text-xs ${
                              kept
                                ? "bg-white/90 border-gray-200 hover:bg-white"
                                : "bg-red-600 text-white border-red-600 hover:bg-red-700"
                            }`}
                            title={kept ? "Bỏ ảnh này" : "Giữ lại ảnh này"}
                          >
                            {kept ? <X className="h-4 w-4" /> : <X className="h-4 w-4" />}
                          </button>
                          {!kept ? (
                            <div className="absolute inset-x-0 bottom-0 bg-red-600/80 text-white text-xs px-2 py-1">
                              Sẽ bị xóa
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              <div className="flex space-x-4 mb-4">
                <button
                  type="button"
                  onClick={() => setImageMethod("url")}
                  className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
                    imageMethod === "url"
                      ? "bg-amber-100 text-amber-800 border border-amber-300"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <LinkIcon className="h-4 w-4" />
                  <span>Nhập URL</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageMethod("file")}
                  className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
                    imageMethod === "file"
                      ? "bg-amber-100 text-amber-800 border border-amber-300"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload File</span>
                </button>
              </div>

              {imageMethod === "url" ? (
                <div className="space-y-3">
                  <label className="block text-sm font-medium">
                    Thêm URL hình ảnh (có thể nhiều URL)
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={urlDraft}
                      onChange={(e) => setUrlDraft(e.target.value)}
                      placeholder="https://example.com/anh.jpg"
                    />
                    <Button type="button" variant="outline" onClick={addImageUrl}>
                      Thêm
                    </Button>
                  </div>

                  {(formData.imageUrls ?? []).length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {(formData.imageUrls ?? []).map((u, idx) => (
                        <div
                          key={`${u}-${idx}`}
                          className="relative rounded-md border border-gray-200 overflow-hidden"
                        >
                          <img
                            src={normalizeImageUrl(u)}
                            alt=""
                            className="h-24 w-full object-cover"
                            referrerPolicy="no-referrer"
                            crossOrigin="anonymous"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder.svg";
                              if (isGoogleDriveLink(u)) setDrivePreviewWarning(true);
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removeImageUrlAt(idx)}
                            className="absolute top-1 right-1 inline-flex items-center justify-center rounded-full h-7 w-7 bg-white/90 border border-gray-200 hover:bg-white"
                            title="Xóa URL này"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {drivePreviewWarning ? (
                    <Alert className="border-amber-200 bg-amber-50">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Không thể preview ảnh từ Google Drive. Hãy đảm bảo file Drive được chia sẻ
                        "Anyone with the link" (Công khai) — nếu không, trình duyệt có thể chặn
                        cookie bên thứ ba nên ảnh sẽ không hiển thị.
                      </AlertDescription>
                    </Alert>
                  ) : null}
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="block text-sm font-medium">
                    Upload file ảnh (có thể chọn nhiều)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    title="Chọn file ảnh"
                    placeholder="Chọn file ảnh"
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? []);
                      addImageFiles(files);
                      // allow re-selecting same file
                      e.currentTarget.value = "";
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />

                  {(formData.imageFiles ?? []).length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {(formData.imageFiles ?? []).map((file, idx) => (
                        <div
                          key={`${file.name}-${idx}`}
                          className="relative rounded-md border border-gray-200 overflow-hidden"
                        >
                          <img
                            src={filePreviewUrls[idx]}
                            alt=""
                            className="h-24 w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImageFileAt(idx)}
                            className="absolute top-1 right-1 inline-flex items-center justify-center rounded-full h-7 w-7 bg-white/90 border border-gray-200 hover:bg-white"
                            title="Xóa file này"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* Thông số kỹ thuật */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Thông số kỹ thuật
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Xuất xứ
                  </label>
                  <Input
                    value={formData.specifications?.xuatXu || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specifications: {
                          ...formData.specifications,
                          xuatXu: e.target.value,
                        },
                      })
                    }
                    placeholder="Việt Nam"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Bảo quản
                  </label>
                  <Input
                    value={formData.specifications?.baoQuan || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specifications: {
                          ...formData.specifications,
                          baoQuan: e.target.value,
                        },
                      })
                    }
                    placeholder="Nơi khô ráo, thoáng mát"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Hạn sử dụng
                  </label>
                  <Input
                    value={formData.specifications?.hanSuDung || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specifications: {
                          ...formData.specifications,
                          hanSuDung: e.target.value,
                        },
                      })
                    }
                    placeholder="3-5 ngày"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t">
              <Button
                type="submit"
                className="bg-[#C99F4D] hover:bg-[#B8904A] flex-1"
              >
                {product ? "Cập Nhật" : "Thêm Mới"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Hủy
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShopDashboard;
