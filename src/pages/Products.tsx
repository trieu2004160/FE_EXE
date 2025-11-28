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
        // Gọi API lấy tất cả sản phẩm và danh mục
        const [productsData, categoriesData] = await Promise.all([
          apiService.getProducts(),
          apiService.getCategories(),
        ]);

        // Xử lý dữ liệu sản phẩm (Map ảnh base64)
        const rawList = Array.isArray(productsData) ? productsData : (productsData as any).products || [];

        const normalizedProducts = rawList.map((product: any) => {
          const imagesList = product.images || product.Images || [];
          let displayImage = "https://placehold.co/400x300?text=No+Image";

          if (imagesList.length > 0) {
            const firstImgUrl = imagesList[0].url || imagesList[0].Url;
            if (firstImgUrl) {
              displayImage = firstImgUrl;
            }
          } else if (product.imageUrl) {
            displayImage = product.imageUrl;
          }

          return {
            ...product,
            id: product.id || product.Id,
            name: product.name || product.Name,
            basePrice: product.basePrice || product.BasePrice,
            maxPrice: product.maxPrice || product.MaxPrice,
            isPopular: product.isPopular || product.IsPopular,
            productCategoryId: product.productCategoryId || product.ProductCategoryId,
            shopId: product.shopId || product.ShopId || 1,
            imageUrl: displayImage,
          };
        });

        setProducts(normalizedProducts);
        setCategories(categoriesData);
      } catch (err) {
        console.error("Lỗi tải sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter and sort products (Client-side filtering)
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Lọc theo danh mục
    let matchesCategory = true;
    if (selectedCategory !== "Tất cả") {
      const catObj = categories.find(c => c.name === selectedCategory);
      if (catObj) {
        matchesCategory = product.productCategoryId === catObj.id;
      }
    }

    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low": return a.basePrice - b.basePrice;
      case "price-high": return b.basePrice - a.basePrice;
      case "name": return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Đang tải sản phẩm...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <section className="relative py-16 overflow-hidden" style={{ height: "30vh" }}>
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://i.pinimg.com/1200x/c1/b9/5b/c1b95be20d4d2494931739a6f36046b1.jpg"
            alt="Products Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">Tất Cả Sản Phẩm</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">Khám phá các sản phẩm chất lượng</p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full lg:w-80"
              />
            </div>
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedCategory === "Tất cả" ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory("Tất cả")}
              >Tất cả</Badge>
              {categories.map((cat) => (
                <Badge
                  key={cat.id}
                  variant={selectedCategory === cat.name ? "default" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(cat.name)}
                >{cat.name}</Badge>
              ))}
            </div>
            {/* Sort View */}
            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Nổi bật</SelectItem>
                  <SelectItem value="price-low">Giá thấp - cao</SelectItem>
                  <SelectItem value="price-high">Giá cao - thấp</SelectItem>
                  <SelectItem value="name">Tên A-Z</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border rounded-md bg-white">
                <Button variant="ghost" size="icon" onClick={() => setViewMode("grid")} className={viewMode === "grid" ? "bg-gray-200" : ""}>
                  <Grid className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setViewMode("list")} className={viewMode === "list" ? "bg-gray-200" : ""}>
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {sortedProducts.length === 0 ? (
            <div className="text-center py-16">
              <p>Không tìm thấy sản phẩm nào</p>
              <Button onClick={() => { setSearchTerm(""); setSelectedCategory("Tất cả"); }}>Xóa bộ lọc</Button>
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6" : "space-y-4"}>
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.basePrice}
                  originalPrice={product.maxPrice}
                  image={product.imageUrl || ""} // Quan trọng: Dùng field đã map
                  rating={4.5}
                  reviews={0}
                  category={categories.find((c) => c.id === product.productCategoryId)?.name || "Sản phẩm"}
                  shopId={product.shopId || 1}
                  isBestSeller={product.isPopular}
                  isNew={false}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Products;