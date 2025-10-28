import { useState, useEffect } from "react";
import { Search as SearchIcon, Filter, X, Loader2 } from "lucide-react";
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
import {
  apiService,
  SearchParams,
  SearchResponse,
  Product,
} from "@/services/apiService";
import ProductCard from "@/components/ProductCard";

interface SearchProps {
  onClose?: () => void;
  className?: string;
}

const Search = ({ onClose, className = "" }: SearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchParams>({
    category: "",
    minPrice: undefined,
    maxPrice: undefined,
    sortBy: "name",
    page: 1,
    pageSize: 20,
  });

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, filters]);

  const performSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const searchParams: SearchParams = {
        query: searchQuery.trim(),
        ...filters,
      };

      const response: SearchResponse = await apiService.searchProducts(
        searchParams
      );
      setSearchResults(response.products);
    } catch (apiError) {
      console.warn("Search API not available:", apiError);
      setError("Không thể tìm kiếm. Vui lòng thử lại sau.");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof SearchParams, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: "name",
      page: 1,
      pageSize: 20,
    });
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setError(null);
  };

  return (
    <div
      className={`bg-white border border-border rounded-lg shadow-lg ${className}`}
    >
      {/* Search Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-primary text-primary-foreground" : ""}
          >
            <Filter className="h-4 w-4" />
          </Button>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Danh mục
                </label>
                <Select
                  value={filters.category || ""}
                  onValueChange={(value) =>
                    handleFilterChange("category", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tất cả danh mục</SelectItem>
                    <SelectItem value="Hoa Tươi">Hoa Tươi</SelectItem>
                    <SelectItem value="Hoa Quả">Hoa Quả</SelectItem>
                    <SelectItem value="Hương Nến">Hương Nến</SelectItem>
                    <SelectItem value="Xôi Chè">Xôi Chè</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Giá tối thiểu
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "minPrice",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Giá tối đa
                </label>
                <Input
                  type="number"
                  placeholder="10000000"
                  value={filters.maxPrice || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "maxPrice",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Select
                value={filters.sortBy || "name"}
                onValueChange={(value) => handleFilterChange("sortBy", value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Tên A-Z</SelectItem>
                  <SelectItem value="price">Giá thấp đến cao</SelectItem>
                  <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
                  <SelectItem value="createdAt">Mới nhất</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={clearFilters}>
                Xóa bộ lọc
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Search Results */}
      <div className="max-h-96 overflow-y-auto">
        {loading && (
          <div className="p-8 text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
            <p className="text-muted-foreground">Đang tìm kiếm...</p>
          </div>
        )}

        {error && (
          <div className="p-8 text-center">
            <p className="text-red-500 mb-2">{error}</p>
            <Button variant="outline" onClick={performSearch}>
              Thử lại
            </Button>
          </div>
        )}

        {!loading && !error && searchQuery && searchResults.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Không tìm thấy sản phẩm nào</p>
            <p className="text-sm text-muted-foreground mt-1">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
            </p>
          </div>
        )}

        {!loading && !error && searchResults.length > 0 && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                Tìm thấy {searchResults.length} sản phẩm
              </p>
              <Badge variant="secondary">"{searchQuery}"</Badge>
            </div>

            <div className="space-y-2">
              {searchResults.map((product) => (
                <Card
                  key={product.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          product.imageUrl ||
                          "https://via.placeholder.com/60x60"
                        }
                        alt={product.name}
                        className="w-15 h-15 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm line-clamp-1">
                          {product.name}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {product.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-semibold text-primary">
                            {product.basePrice.toLocaleString("vi-VN")}đ
                          </span>
                          {product.maxPrice &&
                            product.maxPrice > product.basePrice && (
                              <span className="text-xs text-muted-foreground line-through">
                                {product.maxPrice.toLocaleString("vi-VN")}đ
                              </span>
                            )}
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Xem
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {!searchQuery && (
          <div className="p-8 text-center">
            <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Nhập từ khóa để tìm kiếm sản phẩm
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
