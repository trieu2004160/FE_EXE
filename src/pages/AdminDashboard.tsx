import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { toast } from "@/components/ui/use-toast";
import {
  Settings,
  Package,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  ShoppingBag,
  Store,
  CheckCircle,
  Eye,
  EyeOff,
  RefreshCw,
  GripVertical,
  TrendingUp,
  Activity,
  DollarSign,
  Percent,
  Key,
  Lock,
  Unlock,
  ChevronUp,
  ChevronDown,
  Check,
  X,
} from "lucide-react";
import Header from "@/components/Header";

import {
  apiService,
  AdminCategoryDto,
  AdminShopDto,
  AdminProductDto,
  CommissionConfig,
  RevenueStats,
  RevenueByShop,
} from "@/services/apiService";

// Types
interface CategoryFormData {
  name: string;
  description?: string;
  imageUrl?: string;
  isVisible: boolean;
  displayOrder: number;
}

interface ShopFormData {
  shopName: string;
  ownerEmail: string;
  ownerFullName: string;
  phone?: string;
  address?: string;
  isActive: boolean;
}

interface SystemLog {
  id: string;
  timestamp: string;
  userName: string;
  userEmail: string;
  userType: "Admin" | "Shop";
  action: string;
  details: string;
  ipAddress: string;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // State for categories
  const [categories, setCategories] = useState<AdminCategoryDto[]>([]);
  const [editingCategory, setEditingCategory] =
    useState<AdminCategoryDto | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  // State for shops
  const [shops, setShops] = useState<AdminShopDto[]>([]);
  const [editingShop, setEditingShop] = useState<AdminShopDto | null>(null);
  const [showShopForm, setShowShopForm] = useState(false);
  const [showConvertForm, setShowConvertForm] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [resetPasswordShop, setResetPasswordShop] =
    useState<AdminShopDto | null>(null);

  // State for products
  const [products, setProducts] = useState<AdminProductDto[]>([]);

  // State for commission config
  const [commissionConfig, setCommissionConfig] = useState<CommissionConfig>({
    defaultCommissionRate: 10,
    shopCommissionRates: {},
  });

  // State for revenue stats
  const [revenueStats, setRevenueStats] = useState<RevenueStats>({
    totalRevenue: 0,
    totalCommission: 0,
    totalOrders: 0,
    activeShops: 0,
    revenueToday: 0,
    revenueThisWeek: 0,
    revenueThisMonth: 0,
    revenueThisYear: 0,
  });
  const [revenueByShop, setRevenueByShop] = useState<RevenueByShop[]>([]);
  const [revenuePeriod, setRevenuePeriod] = useState<
    "daily" | "weekly" | "monthly" | "yearly"
  >("daily");

  // State for system logs
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const userRole = localStorage.getItem("userRole");
    if (!token || userRole !== "admin") {
      navigate("/login");
    }
  }, [navigate]);

  // Load data based on active tab
  useEffect(() => {
    if (activeTab === "dashboard") {
      loadDashboardData();
    } else if (activeTab === "categories") {
      loadCategories();
    } else if (activeTab === "shops") {
      loadShops();
    } else if (activeTab === "products") {
      loadProducts();
    } else if (activeTab === "config") {
      loadCommissionConfig();
      loadShops();
    } else if (activeTab === "revenue") {
      loadRevenueStats();
      loadRevenueByShop();
    } else if (activeTab === "logs") {
      loadSystemLogs();
    }
  }, [activeTab]);

  // Reload revenue data when period changes
  useEffect(() => {
    if (activeTab === "revenue") {
      loadRevenueStats();
      loadRevenueByShop();
    }
  }, [activeTab, revenuePeriod]);

  // Data loading functions
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Load all necessary data for dashboard
      const [shopsData, productsData, revenueData, logsData] =
        await Promise.all([
          apiService.getAdminShops(),
          apiService.getAdminProducts(),
          apiService.getRevenueStats(),
          apiService.getSystemLogs(),
        ]);

      setShops(shopsData);
      setProducts(productsData);
      setRevenueStats(revenueData as RevenueStats);
      setSystemLogs(logsData as SystemLog[]);

      // Also load commission config
      try {
        const commissionData = await apiService.getCommissionConfig();
        setCommissionConfig(commissionData);
      } catch (error) {
        console.log("Commission config not available:", error);
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu dashboard",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAdminCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh mục sản phẩm",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadShops = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAdminShops();
      setShops(data);
    } catch (error) {
      console.error("Failed to load shops:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách shop",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAdminProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách sản phẩm",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load categories when needed for product category change
  useEffect(() => {
    if (activeTab === "products" && categories.length === 0) {
      loadCategories();
    }
  }, [activeTab, categories.length]);

  const loadCommissionConfig = async () => {
    try {
      setLoading(true);
      const data = await apiService.getCommissionConfig();
      setCommissionConfig(data);
    } catch (error) {
      console.error("Failed to load commission config:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải cấu hình hoa hồng",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadRevenueStats = async () => {
    try {
      setLoading(true);
      const stats = await apiService.getRevenueStats();
      setRevenueStats(stats);
    } catch (error) {
      console.error("Failed to load revenue stats:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải thống kê doanh thu",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadRevenueByShop = async () => {
    try {
      setLoading(true);
      const byShop = await apiService.getRevenueByShop();
      setRevenueByShop(byShop);
    } catch (error) {
      console.error("Failed to load revenue by shop:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải doanh thu theo shop",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSystemLogs = async () => {
    try {
      setLoading(true);
      const data = await apiService.getSystemLogs({ limit: 50 });
      setSystemLogs(data as SystemLog[]);
    } catch (error) {
      console.error("Failed to load system logs:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải nhật ký hệ thống",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Category management functions
  const handleSaveCategory = async (formData: CategoryFormData) => {
    try {
      setLoading(true);
      if (editingCategory) {
        await apiService.updateAdminCategory(editingCategory.id, formData);
        toast({
          title: "Thành công",
          description: "Cập nhật danh mục thành công",
        });
      } else {
        await apiService.createAdminCategory(formData);
        toast({
          title: "Thành công",
          description: "Tạo danh mục mới thành công",
        });
      }
      setShowCategoryForm(false);
      setEditingCategory(null);
      loadCategories();
    } catch (error) {
      console.error("Failed to save category:", error);
      toast({
        title: "Lỗi",
        description: "Không thể lưu danh mục",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;

    try {
      setLoading(true);
      await apiService.deleteAdminCategory(id);
      toast({
        title: "Thành công",
        description: "Xóa danh mục thành công",
      });
      loadCategories();
    } catch (error) {
      console.error("Failed to delete category:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa danh mục",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCategoryVisibility = async (
    id: number,
    isVisible: boolean
  ) => {
    try {
      setLoading(true);
      await apiService.toggleCategoryVisibility(id, isVisible);
      toast({
        title: "Thành công",
        description: `Đã ${isVisible ? "hiện" : "ẩn"} danh mục`,
      });
      loadCategories();
    } catch (error) {
      console.error("Failed to toggle category visibility:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thay đổi trạng thái danh mục",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReorderCategories = async (categoryIds: number[]) => {
    try {
      setLoading(true);
      await apiService.reorderCategories(categoryIds);
      toast({
        title: "Thành công",
        description: "Cập nhật thứ tự danh mục thành công",
      });
      loadCategories();
    } catch (error) {
      console.error("Failed to reorder categories:", error);
      toast({
        title: "Lỗi",
        description: "Không thể sắp xếp lại danh mục",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMoveCategory = async (
    currentIndex: number,
    direction: "up" | "down"
  ) => {
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= categories.length) return;

    const newCategories = [...categories];
    [newCategories[currentIndex], newCategories[newIndex]] = [
      newCategories[newIndex],
      newCategories[currentIndex],
    ];

    // Update displayOrder
    const categoryIds = newCategories.map((cat) => cat.id);
    await handleReorderCategories(categoryIds);
  };

  // Shop management functions
  const handleSaveShop = async (formData: ShopFormData) => {
    try {
      setLoading(true);
      if (editingShop) {
        await apiService.updateShopInfo(editingShop.id, {
          name: formData.shopName,
          ownerFullName: formData.ownerFullName,
          contactPhoneNumber: formData.phone,
          address: formData.address,
          isLocked: !formData.isActive,
        });
        toast({
          title: "Thành công",
          description: "Cập nhật thông tin shop thành công",
        });
      } else {
        await apiService.createShopAccount({
          email: formData.ownerEmail,
          fullName: formData.ownerFullName,
          password: "Shop123456", // Default password
          shopName: formData.shopName,
        });
        toast({
          title: "Thành công",
          description: "Tạo shop mới thành công. Mật khẩu mặc định: Shop123456",
        });
      }
      setShowShopForm(false);
      setEditingShop(null);
      loadShops();
    } catch (error) {
      console.error("Failed to save shop:", error);
      toast({
        title: "Lỗi",
        description: "Không thể lưu thông tin shop",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetShopPassword = async (
    id: number,
    newPassword: string,
    shopName: string
  ) => {
    try {
      setLoading(true);
      await apiService.resetShopPassword(id, newPassword);
      toast({
        title: "Thành công",
        description: `Đã reset mật khẩu cho shop ${shopName}`,
      });
      setShowResetPasswordModal(false);
      setResetPasswordShop(null);
      loadShops();
    } catch (error) {
      console.error("Failed to reset shop password:", error);
      toast({
        title: "Lỗi",
        description: "Không thể reset mật khẩu shop",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleShopStatus = async (id: number, isLocked: boolean) => {
    try {
      setLoading(true);
      await apiService.updateShopStatus(id, !isLocked);
      toast({
        title: "Thành công",
        description: `Đã ${isLocked ? "mở khóa" : "khóa"} shop`,
      });
      loadShops();
    } catch (error) {
      console.error("Failed to update shop status:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thay đổi trạng thái shop",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConvertGuestToShop = async (
    userEmail: string,
    shopName: string
  ) => {
    try {
      setLoading(true);
      await apiService.convertGuestToShop({ userEmail, shopName });
      toast({
        title: "Thành công",
        description: `Đã chuyển tài khoản ${userEmail} thành shop ${shopName}`,
      });
      setShowConvertForm(false);
      loadShops();
    } catch (error) {
      console.error("Failed to convert guest to shop:", error);
      toast({
        title: "Lỗi",
        description: "Không thể chuyển đổi tài khoản",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Product management functions
  const handleToggleProductVisibility = async (
    id: number,
    isVisible: boolean
  ) => {
    try {
      setLoading(true);
      await apiService.toggleProductVisibility(id, isVisible);
      toast({
        title: "Thành công",
        description: `Đã ${isVisible ? "hiện" : "ẩn"} sản phẩm`,
      });
      loadProducts();
    } catch (error) {
      console.error("Failed to toggle product visibility:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thay đổi trạng thái sản phẩm",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeProductCategory = async (
    productId: number,
    categoryId: number
  ): Promise<boolean> => {
    try {
      setLoading(true);
      await apiService.changeProductCategory(productId, categoryId);
      toast({
        title: "Thành công",
        description: "Đã chuyển danh mục sản phẩm",
      });
      loadProducts();
      return true;
    } catch (error) {
      console.error("Failed to change product category:", error);
      toast({
        title: "Lỗi",
        description: "Không thể chuyển danh mục sản phẩm",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Commission config functions
  const handleSetDefaultCommission = async (rate: number) => {
    try {
      setLoading(true);
      await apiService.setDefaultCommission(rate);
      toast({
        title: "Thành công",
        description: "Cập nhật hoa hồng mặc định thành công",
      });
      loadCommissionConfig();
    } catch (error) {
      console.error("Failed to set default commission:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật hoa hồng mặc định",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetShopCommission = async (shopId: number, rate: number) => {
    try {
      setLoading(true);
      await apiService.setShopCommission(shopId, rate);
      toast({
        title: "Thành công",
        description: "Cập nhật hoa hồng shop thành công",
      });
      loadCommissionConfig();
    } catch (error) {
      console.error("Failed to set shop commission:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật hoa hồng shop",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "categories", label: "Quản lý Danh Mục", icon: Package },
    { id: "shops", label: "Quản lý Shop", icon: Store },
    { id: "products", label: "Quản lý Sản Phẩm", icon: Package },
    { id: "config", label: "Cấu Hình", icon: Settings },
    { id: "revenue", label: "Doanh Thu", icon: DollarSign },
    { id: "logs", label: "Nhật Ký", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Include Header */}
      <Header />

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-[calc(100vh-4rem)]">
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold text-[#C99F4D]">Admin Panel</h1>
            <Badge className="mt-2 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800">
              Quản Trị Viên
            </Badge>
          </div>

          <nav className="mt-6">
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-6 py-3 text-left hover:bg-amber-50 transition-colors ${
                    activeTab === item.id
                      ? "bg-amber-50 border-r-4 border-amber-500 text-amber-700"
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

          {/* Dashboard Content */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex items-center">
                    <div className="p-3 rounded-full bg-blue-500 text-white mr-4">
                      <Store className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tổng Shop</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {shops.length}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex items-center">
                    <div className="p-3 rounded-full bg-green-500 text-white mr-4">
                      <Package className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tổng Sản Phẩm</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {products.length}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex items-center">
                    <div className="p-3 rounded-full bg-amber-500 text-white mr-4">
                      <DollarSign className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Doanh Thu Tháng</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {revenueStats.revenueThisMonth.toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex items-center">
                    <div className="p-3 rounded-full bg-purple-500 text-white mr-4">
                      <Percent className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Hoa Hồng Mặc Định</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {commissionConfig.defaultCommissionRate}%
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Hoạt Động Gần Đây</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {systemLogs.slice(0, 5).map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          <div>
                            <p className="font-medium">{log.action}</p>
                            <p className="text-sm text-gray-500">
                              {log.details}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(log.timestamp).toLocaleString("vi-VN")}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Categories Management */}
          {activeTab === "categories" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <Button
                  onClick={() => {
                    setEditingCategory(null);
                    setShowCategoryForm(true);
                  }}
                  className="bg-[#C99F4D] hover:bg-[#B8904A]"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm Danh Mục
                </Button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-[#C99F4D] mr-3" />
                  <span className="text-gray-600">Đang tải danh mục...</span>
                </div>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-32">Thứ tự</TableHead>
                            <TableHead>Tên Danh Mục</TableHead>
                            <TableHead>Mô Tả</TableHead>
                            <TableHead>Trạng Thái</TableHead>
                            <TableHead className="w-48">Thao Tác</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {categories.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={5}
                                className="text-center py-12 text-gray-500"
                              >
                                Chưa có danh mục nào. Hãy thêm danh mục mới!
                              </TableCell>
                            </TableRow>
                          ) : (
                            categories.map((category, index) => (
                              <TableRow
                                key={category.id}
                                className="hover:bg-gray-50"
                              >
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                                    <span className="text-sm font-medium w-8">
                                      {index + 1}
                                    </span>
                                    <div className="flex flex-col gap-1">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 w-6 p-0"
                                        onClick={() =>
                                          handleMoveCategory(index, "up")
                                        }
                                        disabled={index === 0}
                                      >
                                        <ChevronUp className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 w-6 p-0"
                                        onClick={() =>
                                          handleMoveCategory(index, "down")
                                        }
                                        disabled={
                                          index === categories.length - 1
                                        }
                                      >
                                        <ChevronDown className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    {category.imageUrl && (
                                      <img
                                        src={category.imageUrl}
                                        alt={category.name}
                                        className="h-10 w-10 rounded-lg object-cover"
                                      />
                                    )}
                                    <div className="font-medium">
                                      {category.name}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm text-gray-500 truncate max-w-xs">
                                    {category.description || "—"}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    className={
                                      category.isVisible !== false
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }
                                  >
                                    {category.isVisible !== false
                                      ? "Hiển thị"
                                      : "Ẩn"}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        handleToggleCategoryVisibility(
                                          category.id,
                                          category.isVisible !== false
                                        )
                                      }
                                      title={
                                        category.isVisible !== false
                                          ? "Ẩn danh mục"
                                          : "Hiển thị danh mục"
                                      }
                                    >
                                      {category.isVisible !== false ? (
                                        <EyeOff className="h-4 w-4" />
                                      ) : (
                                        <Eye className="h-4 w-4" />
                                      )}
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setEditingCategory(category);
                                        setShowCategoryForm(true);
                                      }}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-red-600 hover:bg-red-50"
                                      onClick={() =>
                                        handleDeleteCategory(category.id)
                                      }
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Shop Management */}
          {activeTab === "shops" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold">Quản Lý Shop</h3>
                  <p className="text-gray-600">
                    Thêm mới, sửa thông tin và quản lý trạng thái shop
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setEditingShop(null);
                      setShowShopForm(true);
                    }}
                    className="bg-[#C99F4D] hover:bg-[#B8904A]"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm Shop Mới
                  </Button>
                  <Button
                    onClick={() => setShowConvertForm(true)}
                    variant="outline"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Chuyển Đổi User
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-[#C99F4D] mr-3" />
                  <span className="text-gray-600">
                    Đang tải danh sách shop...
                  </span>
                </div>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Thông Tin Shop</TableHead>
                            <TableHead>Chủ Shop</TableHead>
                            <TableHead>Liên Hệ</TableHead>
                            <TableHead>Trạng Thái</TableHead>
                            <TableHead>Hoa Hồng</TableHead>
                            <TableHead className="w-48">Thao Tác</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {shops.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={6}
                                className="text-center py-12 text-gray-500"
                              >
                                Chưa có shop nào. Hãy thêm shop mới!
                              </TableCell>
                            </TableRow>
                          ) : (
                            shops.map((shop) => (
                              <TableRow
                                key={shop.id}
                                className="hover:bg-gray-50"
                              >
                                <TableCell>
                                  <div className="font-medium">{shop.name}</div>
                                  <div className="text-sm text-gray-500">
                                    ID: #{shop.id}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium">
                                    {shop.ownerFullName || "N/A"}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {shop.ownerEmail}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm">
                                    {shop.contactPhoneNumber || "Chưa có"}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {shop.address || "Chưa có địa chỉ"}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    className={
                                      !shop.isLocked
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }
                                  >
                                    {!shop.isLocked ? (
                                      <>
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Hoạt Động
                                      </>
                                    ) : (
                                      <>
                                        <Lock className="h-3 w-3 mr-1" />
                                        Bị Khóa
                                      </>
                                    )}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm font-medium">
                                    {shop.commissionRate
                                      ? `${shop.commissionRate}%`
                                      : "Mặc định"}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-1">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setEditingShop(shop);
                                        setShowShopForm(true);
                                      }}
                                      title="Sửa thông tin"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        handleToggleShopStatus(
                                          shop.id,
                                          shop.isLocked
                                        )
                                      }
                                      className={
                                        shop.isLocked
                                          ? "text-green-600 hover:bg-green-50"
                                          : "text-orange-600 hover:bg-orange-50"
                                      }
                                      title={
                                        shop.isLocked
                                          ? "Mở khóa shop"
                                          : "Khóa shop"
                                      }
                                    >
                                      {shop.isLocked ? (
                                        <Unlock className="h-4 w-4" />
                                      ) : (
                                        <Lock className="h-4 w-4" />
                                      )}
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setResetPasswordShop(shop);
                                        setShowResetPasswordModal(true);
                                      }}
                                      className="text-blue-600 hover:bg-blue-50"
                                      title="Reset mật khẩu"
                                    >
                                      <Key className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Products Management */}
          {activeTab === "products" && (
            <div className="space-y-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-[#C99F4D] mr-3" />
                  <span className="text-gray-600">Đang tải sản phẩm...</span>
                </div>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Sản Phẩm</TableHead>
                            <TableHead>Shop</TableHead>
                            <TableHead>Danh Mục</TableHead>
                            <TableHead>Giá</TableHead>
                            <TableHead>Tồn Kho</TableHead>
                            <TableHead>Trạng Thái</TableHead>
                            <TableHead className="w-64">Thao Tác</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {products.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={7}
                                className="text-center py-12 text-gray-500"
                              >
                                Chưa có sản phẩm nào trong hệ thống
                              </TableCell>
                            </TableRow>
                          ) : (
                            products.map((product) => (
                              <TableRow
                                key={product.id}
                                className="hover:bg-gray-50"
                              >
                                <TableCell>
                                  <div className="font-medium">
                                    {product.name}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm text-gray-600">
                                    {product.shopName}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">
                                    {product.categoryName}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium">
                                    {product.basePrice.toLocaleString("vi-VN")}đ
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm">
                                    {product.stockQuantity > 0 ? (
                                      <span className="text-green-600">
                                        {product.stockQuantity}
                                      </span>
                                    ) : (
                                      <span className="text-red-600">
                                        Hết hàng
                                      </span>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    className={
                                      product.isVisible !== false
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }
                                  >
                                    {product.isVisible !== false
                                      ? "Hiển thị"
                                      : "Ẩn"}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        handleToggleProductVisibility(
                                          product.id,
                                          product.isVisible !== false
                                        )
                                      }
                                      title={
                                        product.isVisible !== false
                                          ? "Ẩn sản phẩm"
                                          : "Hiển thị sản phẩm"
                                      }
                                    >
                                      {product.isVisible !== false ? (
                                        <EyeOff className="h-4 w-4" />
                                      ) : (
                                        <Eye className="h-4 w-4" />
                                      )}
                                    </Button>
                                    <ProductChangeCategoryDialog
                                      product={product}
                                      categories={categories}
                                      onSave={handleChangeProductCategory}
                                    />
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Config Management */}
          {activeTab === "config" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold">Quản Lý Cấu Hình</h3>
                  <p className="text-gray-600">
                    Cấu hình hoa hồng mặc định và hoa hồng theo shop
                  </p>
                </div>
              </div>

              {/* Default Commission */}
              <Card>
                <CardHeader>
                  <CardTitle>Hoa Hồng Mặc Định</CardTitle>
                  <CardDescription>
                    Phần trăm hoa hồng mặc định áp dụng cho tất cả shop (trừ
                    shop có cấu hình riêng)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin text-[#C99F4D] mr-3" />
                      <span className="text-gray-600">Đang tải...</span>
                    </div>
                  ) : (
                    <DefaultCommissionForm
                      defaultRate={commissionConfig.defaultCommissionRate || 0}
                      onSave={handleSetDefaultCommission}
                    />
                  )}
                </CardContent>
              </Card>

              {/* Shop Commissions */}
              <Card>
                <CardHeader>
                  <CardTitle>Hoa Hồng Theo Shop</CardTitle>
                  <CardDescription>
                    Cấu hình phần trăm hoa hồng riêng cho từng shop (nếu không
                    có sẽ dùng mặc định)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin text-[#C99F4D] mr-3" />
                      <span className="text-gray-600">Đang tải...</span>
                    </div>
                  ) : (
                    <ShopCommissionTable
                      shops={shops}
                      shopCommissionRates={
                        commissionConfig.shopCommissionRates || {}
                      }
                      defaultRate={commissionConfig.defaultCommissionRate || 0}
                      onSave={handleSetShopCommission}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Revenue Management */}
          {activeTab === "revenue" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold">Báo Cáo Doanh Thu</h3>
                  <p className="text-gray-600">
                    Theo dõi doanh thu theo thời gian và shop
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={revenuePeriod === "daily" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setRevenuePeriod("daily")}
                  >
                    Hôm Nay
                  </Button>
                  <Button
                    variant={revenuePeriod === "weekly" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setRevenuePeriod("weekly")}
                  >
                    Tuần Này
                  </Button>
                  <Button
                    variant={
                      revenuePeriod === "monthly" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setRevenuePeriod("monthly")}
                  >
                    Tháng Này
                  </Button>
                  <Button
                    variant={revenuePeriod === "yearly" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setRevenuePeriod("yearly")}
                  >
                    Năm Này
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-[#C99F4D] mr-3" />
                  <span className="text-gray-600">Đang tải doanh thu...</span>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Revenue Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Tổng Doanh Thu
                            </p>
                            <p className="text-2xl font-bold text-[#C99F4D]">
                              {revenueStats?.totalRevenue
                                ? `${revenueStats.totalRevenue.toLocaleString(
                                    "vi-VN"
                                  )}đ`
                                : "0đ"}
                            </p>
                          </div>
                          <div className="h-8 w-8 bg-[#C99F4D] bg-opacity-10 rounded-full flex items-center justify-center">
                            <DollarSign className="h-4 w-4 text-[#C99F4D]" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Hoa Hồng
                            </p>
                            <p className="text-2xl font-bold text-green-600">
                              {revenueStats?.totalCommission
                                ? `${revenueStats.totalCommission.toLocaleString(
                                    "vi-VN"
                                  )}đ`
                                : "0đ"}
                            </p>
                          </div>
                          <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Đơn Hàng
                            </p>
                            <p className="text-2xl font-bold text-blue-600">
                              {revenueStats?.totalOrders || 0}
                            </p>
                          </div>
                          <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <ShoppingBag className="h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Shop Hoạt Động
                            </p>
                            <p className="text-2xl font-bold text-purple-600">
                              {revenueStats?.activeShops || 0}
                            </p>
                          </div>
                          <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <Store className="h-4 w-4 text-purple-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Revenue by Shop */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Doanh Thu Theo Shop</CardTitle>
                      <CardDescription>
                        Chi tiết doanh thu và hoa hồng của từng shop
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Shop</TableHead>
                              <TableHead>Doanh Thu</TableHead>
                              <TableHead>Hoa Hồng</TableHead>
                              <TableHead>Đơn Hàng</TableHead>
                              <TableHead>Tỷ Lệ Hoa Hồng</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {revenueByShop && revenueByShop.length > 0 ? (
                              revenueByShop.map((item) => (
                                <TableRow key={item.shopId}>
                                  <TableCell>
                                    <div className="font-medium">
                                      {item.shopName}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="font-medium text-[#C99F4D]">
                                      {item.revenue.toLocaleString("vi-VN")}đ
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="font-medium text-green-600">
                                      {item.commission.toLocaleString("vi-VN")}đ
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="text-gray-600">
                                      {item.orderCount}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline">
                                      {item.commissionRate}%
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell
                                  colSpan={5}
                                  className="text-center py-8 text-gray-500"
                                >
                                  Chưa có dữ liệu doanh thu trong kỳ này
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* System Logs */}
          {activeTab === "logs" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold">Nhật Ký Hệ Thống</h3>
                  <p className="text-gray-600">
                    Theo dõi hoạt động của admin và shop trong hệ thống
                  </p>
                </div>
                <Button
                  onClick={loadSystemLogs}
                  disabled={loading}
                  className="bg-[#C99F4D] hover:bg-[#B8944A]"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Tải Lại
                </Button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-[#C99F4D] mr-3" />
                  <span className="text-gray-600">Đang tải nhật ký...</span>
                </div>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Thời Gian</TableHead>
                            <TableHead>Người Dùng</TableHead>
                            <TableHead>Loại</TableHead>
                            <TableHead>Hành Động</TableHead>
                            <TableHead>Chi Tiết</TableHead>
                            <TableHead>IP</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {systemLogs.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={6}
                                className="text-center py-12 text-gray-500"
                              >
                                Chưa có nhật ký nào trong hệ thống
                              </TableCell>
                            </TableRow>
                          ) : (
                            systemLogs.map((log) => (
                              <TableRow
                                key={log.id}
                                className="hover:bg-gray-50"
                              >
                                <TableCell>
                                  <div className="text-sm">
                                    {new Date(log.timestamp).toLocaleString(
                                      "vi-VN"
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium">
                                    {log.userName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {log.userEmail}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    className={
                                      log.userType === "Admin"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-blue-100 text-blue-800"
                                    }
                                  >
                                    {log.userType}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium">
                                    {log.action}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div
                                    className="text-sm max-w-xs truncate"
                                    title={log.details}
                                  >
                                    {log.details}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm text-gray-500">
                                    {log.ipAddress}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Category Form Modal */}
      {showCategoryForm && (
        <CategoryForm
          category={editingCategory}
          onSave={handleSaveCategory}
          onCancel={() => {
            setShowCategoryForm(false);
            setEditingCategory(null);
          }}
        />
      )}

      {/* Shop Form Modal */}
      {showShopForm && (
        <ShopForm
          shop={editingShop}
          onSave={handleSaveShop}
          onCancel={() => {
            setShowShopForm(false);
            setEditingShop(null);
          }}
        />
      )}

      {/* Convert User to Shop Modal */}
      {showConvertForm && (
        <ConvertToShopForm
          onSave={handleConvertGuestToShop}
          onCancel={() => setShowConvertForm(false)}
        />
      )}

      {/* Reset Password Modal */}
      {showResetPasswordModal && resetPasswordShop && (
        <ResetPasswordModal
          shop={resetPasswordShop}
          onSave={handleResetShopPassword}
          onCancel={() => {
            setShowResetPasswordModal(false);
            setResetPasswordShop(null);
          }}
        />
      )}
    </div>
  );
};

// Category Form Component
const CategoryForm = ({
  category,
  onSave,
  onCancel,
}: {
  category: AdminCategoryDto | null;
  onSave: (data: CategoryFormData) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: category?.name || "",
    description: category?.description || "",
    imageUrl: category?.imageUrl || "",
    isVisible: category?.isVisible !== false,
    displayOrder: category?.displayOrder || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên danh mục");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>
            {category ? "Chỉnh Sửa Danh Mục" : "Thêm Danh Mục Mới"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="categoryName">Tên danh mục *</Label>
              <Input
                id="categoryName"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ví dụ: Hoa Tươi, Hương Nến..."
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="categoryDescription">Mô tả</Label>
              <Textarea
                id="categoryDescription"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Mô tả về danh mục này..."
                rows={3}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="categoryImageUrl">URL hình ảnh</Label>
              <Input
                id="categoryImageUrl"
                value={formData.imageUrl || ""}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
                className="mt-1"
              />
              {formData.imageUrl && (
                <div className="mt-2">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded-lg border"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="isVisible"
                  checked={formData.isVisible}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isVisible: checked })
                  }
                />
                <Label htmlFor="isVisible" className="cursor-pointer">
                  Hiển thị danh mục
                </Label>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="bg-[#C99F4D] hover:bg-[#B8904A] flex-1"
              >
                {category ? "Cập Nhật" : "Thêm Mới"}
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

// Shop Form Component
const ShopForm = ({
  shop,
  onSave,
  onCancel,
}: {
  shop: AdminShopDto | null;
  onSave: (data: ShopFormData) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState<ShopFormData>({
    shopName: shop?.name || "",
    ownerEmail: shop?.ownerEmail || "",
    ownerFullName: shop?.ownerFullName || "",
    phone: shop?.contactPhoneNumber || "",
    address: shop?.address || "",
    isActive: shop ? !shop.isLocked : true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.shopName.trim() || !formData.ownerEmail.trim()) {
      alert("Vui lòng nhập tên shop và email chủ shop");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>
            {shop ? "Chỉnh Sửa Thông Tin Shop" : "Thêm Shop Mới"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="shopName">Tên Shop *</Label>
                <Input
                  id="shopName"
                  value={formData.shopName}
                  onChange={(e) =>
                    setFormData({ ...formData, shopName: e.target.value })
                  }
                  placeholder="Ví dụ: Shop Hoa Tươi ABC"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="ownerEmail">Email Chủ Shop *</Label>
                <Input
                  id="ownerEmail"
                  type="email"
                  value={formData.ownerEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerEmail: e.target.value })
                  }
                  placeholder="shop@example.com"
                  required
                  disabled={!!shop}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="ownerFullName">Tên Chủ Shop</Label>
              <Input
                id="ownerFullName"
                value={formData.ownerFullName}
                onChange={(e) =>
                  setFormData({ ...formData, ownerFullName: e.target.value })
                }
                placeholder="Nguyễn Văn A"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Số Điện Thoại</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="0123456789"
                  className="mt-1"
                />
              </div>
              <div className="flex items-center gap-2 mt-6">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  Cho phép hoạt động
                </Label>
              </div>
            </div>

            <div>
              <Label htmlFor="address">Địa Chỉ</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Địa chỉ của shop..."
                rows={3}
                className="mt-1"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="bg-[#C99F4D] hover:bg-[#B8904A] flex-1"
              >
                {shop ? "Cập Nhật" : "Thêm Shop"}
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

// Convert User to Shop Form Component
const ConvertToShopForm = ({
  onSave,
  onCancel,
}: {
  onSave: (userEmail: string, shopName: string) => void;
  onCancel: () => void;
}) => {
  const [userEmail, setUserEmail] = useState("");
  const [shopName, setShopName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail.trim() || !shopName.trim()) {
      alert("Vui lòng nhập email user và tên shop");
      return;
    }
    onSave(userEmail, shopName);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Chuyển User Thành Shop</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="userEmail">Email User *</Label>
              <Input
                id="userEmail"
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="user@example.com"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="shopName">Tên Shop *</Label>
              <Input
                id="shopName"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="Shop của tôi"
                required
                className="mt-1"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="bg-[#C99F4D] hover:bg-[#B8904A] flex-1"
              >
                Chuyển Đổi
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

// Reset Password Modal Component
const ResetPasswordModal = ({
  shop,
  onSave,
  onCancel,
}: {
  shop: AdminShopDto;
  onSave: (id: number, newPassword: string, shopName: string) => void;
  onCancel: () => void;
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      alert("Vui lòng nhập mật khẩu mới");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp");
      return;
    }
    if (newPassword.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    onSave(shop.id, newPassword, shop.name);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Mật Khẩu Shop</CardTitle>
          <p className="text-sm text-gray-600">
            Đặt lại mật khẩu cho: <strong>{shop.name}</strong>
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="newPassword">Mật Khẩu Mới *</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                required
                minLength={6}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Xác Nhận Mật Khẩu *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                required
                className="mt-1"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 flex-1"
              >
                Reset Mật Khẩu
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

// Product Change Category Dialog Component
const ProductChangeCategoryDialog = ({
  product,
  categories,
  onSave,
}: {
  product: AdminProductDto;
  categories: AdminCategoryDto[];
  onSave: (productId: number, categoryId: number) => Promise<boolean>;
}) => {
  const [open, setOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryId) {
      return;
    }
    setIsSubmitting(true);
    try {
      const success = await onSave(product.id, selectedCategoryId);
      if (success) {
        setOpen(false);
        setSelectedCategoryId(0);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" title="Chuyển danh mục">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chuyển Danh Mục Sản Phẩm</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="productName">Sản phẩm</Label>
            <Input
              id="productName"
              value={product.name}
              disabled
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="currentCategory">Danh mục hiện tại</Label>
            <Input
              id="currentCategory"
              value={product.categoryName}
              disabled
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="newCategory">Chọn danh mục mới *</Label>
            <Select
              value={selectedCategoryId.toString()}
              onValueChange={(value) => setSelectedCategoryId(Number(value))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Chọn danh mục mới" />
              </SelectTrigger>
              <SelectContent>
                {categories
                  .filter((cat) => cat.isVisible !== false)
                  .map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-[#C99F4D] hover:bg-[#B8904A]"
              disabled={!selectedCategoryId || isSubmitting}
            >
              {isSubmitting ? "Đang xử lý..." : "Chuyển Danh Mục"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Default Commission Form Component
const DefaultCommissionForm = ({
  defaultRate,
  onSave,
}: {
  defaultRate: number;
  onSave: (rate: number) => Promise<void>;
}) => {
  const [rate, setRate] = useState<number>(defaultRate);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setRate(defaultRate);
  }, [defaultRate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rate < 0 || rate > 100) {
      alert("Phần trăm hoa hồng phải từ 0 đến 100");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSave(rate);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-end gap-4">
        <div className="flex-1">
          <Label htmlFor="defaultRate">Phần trăm hoa hồng mặc định (%)</Label>
          <Input
            id="defaultRate"
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="mt-1"
            placeholder="Nhập phần trăm (0-100)"
          />
          <p className="text-sm text-gray-500 mt-1">
            Ví dụ: {rate}% = {((rate / 100) * 10000000).toLocaleString("vi-VN")}
            đ từ đơn hàng 10 triệu
          </p>
        </div>
        <Button
          type="submit"
          className="bg-[#C99F4D] hover:bg-[#B8904A]"
          disabled={isSubmitting || rate === defaultRate}
        >
          {isSubmitting ? "Đang lưu..." : "Lưu"}
        </Button>
      </div>
    </form>
  );
};

// Shop Commission Table Component
const ShopCommissionTable = ({
  shops,
  shopCommissionRates,
  defaultRate,
  onSave,
}: {
  shops: AdminShopDto[];
  shopCommissionRates: Record<number, number>;
  defaultRate: number;
  onSave: (shopId: number, rate: number) => Promise<void>;
}) => {
  const [editingShopId, setEditingShopId] = useState<number | null>(null);
  const [editRate, setEditRate] = useState<number>(0);

  const handleEdit = (shop: AdminShopDto) => {
    setEditRate(shopCommissionRates[shop.id] ?? defaultRate);
    setEditingShopId(shop.id);
  };

  const handleSave = async (shopId: number) => {
    if (editRate < 0 || editRate > 100) {
      alert("Phần trăm hoa hồng phải từ 0 đến 100");
      return;
    }
    try {
      await onSave(shopId, editRate);
      setEditingShopId(null);
    } catch (error) {
      // Error handled in parent
    }
  };

  const handleCancel = () => {
    setEditingShopId(null);
    setEditRate(0);
  };

  if (shops.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Chưa có shop nào trong hệ thống
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên Shop</TableHead>
            <TableHead>Email Chủ Shop</TableHead>
            <TableHead>Hoa Hồng Hiện Tại</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead className="w-64">Thao Tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shops.map((shop) => {
            const currentRate = shopCommissionRates[shop.id] ?? defaultRate;
            const isCustom = shopCommissionRates[shop.id] !== undefined;
            const isEditing = editingShopId === shop.id;

            return (
              <TableRow key={shop.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="font-medium">{shop.name}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-600">{shop.ownerEmail}</div>
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={editRate}
                        onChange={(e) => setEditRate(Number(e.target.value))}
                        className="w-24"
                      />
                      <span className="text-sm">%</span>
                    </div>
                  ) : (
                    <div className="font-medium">
                      {currentRate.toFixed(1)}%
                      {isCustom && (
                        <Badge variant="outline" className="ml-2">
                          Tùy chỉnh
                        </Badge>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {isCustom ? (
                    <Badge className="bg-blue-100 text-blue-800">
                      Tùy chỉnh
                    </Badge>
                  ) : (
                    <Badge variant="outline">Mặc định</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSave(shop.id)}
                        className="text-green-600 hover:bg-green-50"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancel}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(shop)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminDashboard;
