import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Grid, List, Loader2 } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { apiService, Product, Category } from "@/services/apiService";
import { getProductImageUrl } from "@/utils/imageUtils";

const Products = () => {
  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter and sort state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Only use API data - no fallback to mock data
        const [productsData, categoriesData] = await Promise.all([
          apiService.getProducts(),
          apiService.getCategories(),
        ]);

        // Normalize image URLs from backend
        const normalizedProducts = productsData.map((product) => ({
          ...product,
          imageUrl: getProductImageUrl(product),
        }));

        console.log("Products data:", productsData);
        console.log("Normalized products:", normalizedProducts);

        setProducts(normalizedProducts);
        setCategories(categoriesData);
      } catch (apiError) {
        console.error("Failed to fetch data from API:", apiError);
        setError("Không thể tải dữ liệu từ server. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tất cả" ||
      categories.find((c) => c.name === selectedCategory)?.id ===
        product.productCategoryId;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.basePrice - b.basePrice;
      case "price-high":
        return b.basePrice - a.basePrice;
      case "rating":
        return 0; // API doesn't provide rating
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Không thể tải sản phẩm</p>
          <Button onClick={() => window.location.reload()}>Thử lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <section
        className="relative py-16 overflow-hidden"
        style={{ height: "30vh" }}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://i.pinimg.com/1200x/c1/b9/5b/c1b95be20d4d2494931739a6f36046b1.jpg"
            alt="Products Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Tất Cả Sản Phẩm
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
            Khám phá bộ sưu tập đầy đủ các sản phẩm đồ cúng chất lượng cao
          </p>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full lg:w-80 border-gray-300 focus:border-gray-300 focus:ring-0 focus:ring-offset-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 !ring-0 !ring-offset-0 !outline-none"
                style={{ boxShadow: "none !important" }}
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={typeof category === "string" ? category : category.name}
                  variant={
                    selectedCategory ===
                    (typeof category === "string" ? category : category.name)
                      ? "default"
                      : "secondary"
                  }
                  className={`cursor-pointer transition-all duration-200 rounded-md text-sm font-medium shadow-sm
        ${
          selectedCategory ===
          (typeof category === "string" ? category : category.name)
            ? "bg-gray-700 hover:bg-gray-800 text-white"
            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
        }`}
                  onClick={() =>
                    setSelectedCategory(
                      typeof category === "string" ? category : category.name
                    )
                  }
                >
                  {typeof category === "string" ? category : category.name}
                </Badge>
              ))}
            </div>

            {/* Sort & View */}
            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Nổi bật</SelectItem>
                  <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                  <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
                  <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
                  <SelectItem value="name">Tên A-Z</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className={`rounded-none transition-all duration-200 hover:bg-gray-100
      ${
        viewMode === "grid"
          ? "bg-gray-200 text-gray-800 hover:bg-gray-400"
          : "bg-white text-gray-600 hover:bg-gray-400"
      }`}
                >
                  <Grid className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className={`rounded-none transition-all duration-200 hover:bg-gray-100
      ${
        viewMode === "list"
          ? "bg-gray-200 text-gray-800 hover:bg-gray-400"
          : "bg-white text-gray-600 hover:bg-gray-400"
      }`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {sortedProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-4">
                Không tìm thấy sản phẩm nào
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("Tất cả");
                }}
              >
                Xóa bộ lọc
              </Button>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.basePrice}
                  originalPrice={product.maxPrice}
                  image={product.imageUrl || ""}
                  rating={4.5}
                  reviews={0}
                  category={
                    categories.find((c) => c.id === product.productCategoryId)
                      ?.name || "Sản phẩm"
                  }
                  shopId={product.shop?.id || 1}
                  isBestSeller={product.isPopular}
                  isNew={false}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
      {/* <AIAssistant /> */}
    </div>
  );
};

export default Products;
