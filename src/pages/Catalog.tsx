import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Search, Filter, Grid, List, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiService, Product, Category } from "@/services/apiService";
import { getProductImageUrl } from "@/utils/imageUtils";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Catalog = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [priceRange, setPriceRange] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentCategory, setCurrentCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        const normalizedProducts = productsData.map((product) => {
          const normalized = {
            ...product,
            imageUrl: getProductImageUrl(product),
          };
          console.log('Catalog - Product:', product.name, 'Original ImageUrls:', product.ImageUrls, 'Normalized imageUrl:', normalized.imageUrl);
          return normalized;
        });

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

  useEffect(() => {
    // Set current category
    if (category) {
      const decodedCategory = decodeURIComponent(category);
      setCurrentCategory(decodedCategory);
    }
  }, [category]);

  useEffect(() => {
    let filtered = products;

    // Filter by category if specified
    if (currentCategory && currentCategory !== "Tất cả") {
      const categoryObj = categories.find((c) => c.name === currentCategory);
      if (categoryObj) {
        filtered = filtered.filter(
          (product) => product.productCategoryId === categoryObj.id
        );
      }
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by price range
    if (priceRange !== "all") {
      switch (priceRange) {
        case "under-500k":
          filtered = filtered.filter((p) => p.basePrice < 500000);
          break;
        case "500k-1m":
          filtered = filtered.filter(
            (p) => p.basePrice >= 500000 && p.basePrice < 1000000
          );
          break;
        case "1m-2m":
          filtered = filtered.filter(
            (p) => p.basePrice >= 1000000 && p.basePrice < 2000000
          );
          break;
        case "over-2m":
          filtered = filtered.filter((p) => p.basePrice >= 2000000);
          break;
      }
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case "price-high":
        filtered.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case "rating":
        // API doesn't provide rating, so no sorting
        break;
      case "name":
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFilteredProducts(filtered);
  }, [products, categories, currentCategory, searchQuery, sortBy, priceRange]);

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

  const handleCategoryChange = (newCategory: string) => {
    setCurrentCategory(newCategory);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {currentCategory
                ? `Danh Mục: ${currentCategory}`
                : "Tất Cả Sản Phẩm"}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Khám phá bộ sưu tập đồ cúng chất lượng cao
            </p>

            {/* Breadcrumb */}
            <nav className="flex justify-center mt-6">
              <ol className="flex items-center space-x-2 text-sm">
                <li>
                  <Link
                    to="/"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Trang chủ
                  </Link>
                </li>
                <li className="text-muted-foreground">/</li>
                <li>
                  <Link
                    to="/products"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Sản phẩm
                  </Link>
                </li>
                {currentCategory && (
                  <>
                    <li className="text-muted-foreground">/</li>
                    <li className="text-foreground font-medium">
                      {currentCategory}
                    </li>
                  </>
                )}
              </ol>
            </nav>
          </div>
        </div>
      </section>

      {/* Filters & Controls */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Left side - Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select
                value={currentCategory}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả danh mục</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Price Filter */}
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Khoảng giá" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả mức giá</SelectItem>
                  <SelectItem value="under-500k">Dưới 500k</SelectItem>
                  <SelectItem value="500k-1m">500k - 1M</SelectItem>
                  <SelectItem value="1m-2m">1M - 2M</SelectItem>
                  <SelectItem value="over-2m">Trên 2M</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Right side - Sort & View */}
            <div className="flex gap-4 items-center">
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Tên A-Z</SelectItem>
                  <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                  <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
                  <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-muted-foreground">
              Hiển thị {filteredProducts.length} sản phẩm
              {currentCategory && ` trong danh mục "${currentCategory}"`}
            </p>

            {/* Active filters */}
            <div className="flex gap-2">
              {currentCategory && (
                <Badge variant="secondary" className="gap-1">
                  {currentCategory}
                  <button
                    onClick={() => handleCategoryChange("")}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery("")}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="mb-6">
                <Filter className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để xem thêm sản phẩm
                </p>
              </div>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setCurrentCategory("");
                  setPriceRange("all");
                }}
              >
                Xóa bộ lọc
              </Button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
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
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={
                          product.imageUrl ||
                          "https://via.placeholder.com/96x96"
                        }
                        alt={product.name}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <Badge variant="secondary" className="text-xs mb-2">
                          {categories.find(
                            (c) => c.id === product.productCategoryId
                          )?.name || "Sản phẩm"}
                        </Badge>
                        <Link to={`/product/${product.id}`}>
                          <h3 className="font-semibold text-foreground hover:text-primary transition">
                            {product.name}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-lg font-semibold text-[#C99F4D]">
                            {product.basePrice.toLocaleString("vi-VN")}đ
                          </span>
                          {product.maxPrice &&
                            product.maxPrice > product.basePrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                {product.maxPrice.toLocaleString("vi-VN")}đ
                              </span>
                            )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button size="sm">Thêm vào giỏ</Button>
                        <Button variant="outline" size="sm">
                          <Link to={`/product/${product.id}`}>
                            Xem chi tiết
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Catalog;
