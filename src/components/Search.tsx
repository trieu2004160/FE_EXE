import { useState, useEffect, useCallback } from "react";
import {
  Search as SearchIcon,
  X,
  Loader2,
  Store,
  Package,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  apiService,
  ProductSearchResultDto,
  ShopSearchResultDto,
} from "@/services/apiService";

interface SearchProps {
  onClose?: () => void;
  className?: string;
}

const Search = ({ onClose, className = "" }: SearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    products: ProductSearchResultDto[];
    shops: ShopSearchResultDto[];
  }>({ products: [], shops: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to normalize string for accent-insensitive search
  const normalizeString = (str: string) => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "d");
  };

  const performSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Use getProducts and filter client-side to avoid backend errors
      const allProducts = await apiService.getProducts();

      const normalizedQuery = normalizeString(searchQuery.trim());
      const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);

      const filteredProducts = allProducts
        .filter((p: any) => {
          const normalizedName = normalizeString(p.name || "");
          const normalizedShopName = normalizeString(
            p.shop?.shopName || p.Shop?.ShopName || ""
          );
          const searchTarget = `${normalizedName} ${normalizedShopName}`;

          // Check if ALL tokens are present in the search target (Name + ShopName)
          return queryTokens.every((token) => searchTarget.includes(token));
        })
        .slice(0, 5); // Limit to 5 results

      // Map items to ensure camelCase properties
      const mappedProducts = filteredProducts.map((p: any) => {
        // Handle image extraction from various possible backend formats
        let imgUrl = p.imageUrl || p.ImageUrl || "";

        // Check for Images array (backend DTO format)
        if (
          !imgUrl &&
          p.Images &&
          Array.isArray(p.Images) &&
          p.Images.length > 0
        ) {
          imgUrl = p.Images[0].url || p.Images[0].Url;
        }
        // Check for images array (camelCase format)
        if (
          !imgUrl &&
          p.images &&
          Array.isArray(p.images) &&
          p.images.length > 0
        ) {
          imgUrl = p.images[0].url || p.images[0].Url;
        }

        return {
          id: p.id || p.Id,
          name: p.name || p.Name,
          imageUrl: imgUrl,
          basePrice: p.basePrice || p.BasePrice || 0,
          shopName: p.shop?.shopName || p.Shop?.ShopName || "",
        };
      });

      setSearchResults({
        products: mappedProducts,
        shops: [], // Client-side filtering for shops is not implemented yet
      });
    } catch (apiError) {
      console.error("Search API error:", apiError);
      const errorMessage =
        apiError instanceof Error ? apiError.message : "Có lỗi xảy ra";
      setError(errorMessage);
      setSearchResults({ products: [], shops: [] });
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  const navigateToProduct = (productId: number) => {
    onClose?.();
    window.location.href = `/product/${productId}`;
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch();
      } else {
        setSearchResults({ products: [], shops: [] });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, performSearch]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      onClose?.(); // Close dropdown if exists
      // Navigate to products page with search query
      window.location.href = `/products?search=${encodeURIComponent(
        searchQuery.trim()
      )}`;
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults({ products: [], shops: [] });
    setError(null);
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden backdrop-blur-sm ${className}`}
    >
      {/* Search Header - Gradient Background */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-b border-amber-100">
        <div className="p-5">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <SearchIcon className="h-5 w-5 text-amber-600" />
              </div>
              <Input
                placeholder="Tìm kiếm sản phẩm, cửa hàng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-12 pr-12 h-12 bg-white/80 backdrop-blur-sm border-amber-200 
                         rounded-xl text-base
                         focus:border-amber-400 focus:ring-2 focus:ring-amber-200
                         transition-all duration-200 shadow-sm
                         placeholder:text-gray-400  focus-visible:ring-0 focus-visible:ring-offset-0"
                autoFocus
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 
                           hover:bg-amber-100 rounded-lg transition-colors"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4 text-gray-500" />
                </Button>
              )}
            </div>
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-12 w-12 hover:bg-amber-100 rounded-xl transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="max-h-[32rem] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {loading && (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl mb-4">
              <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
            </div>
            <p className="text-gray-600 font-medium">Đang tìm kiếm...</p>
            <p className="text-sm text-gray-400 mt-1">
              Vui lòng đợi trong giây lát
            </p>
          </div>
        )}

        {error && (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-2xl mb-4">
              <X className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-red-600 font-medium mb-3">{error}</p>
            <Button
              variant="outline"
              onClick={performSearch}
              className="rounded-xl border-red-200 text-red-600 hover:bg-red-50"
            >
              Thử lại
            </Button>
          </div>
        )}

        {!loading &&
          !error &&
          searchQuery &&
          searchResults.products.length === 0 &&
          searchResults.shops.length === 0 && (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-2xl mb-4">
                <SearchIcon className="h-10 w-10 text-gray-300" />
              </div>
              <p className="text-gray-600 font-medium mb-1">
                Không tìm thấy kết quả nào
              </p>
              <p className="text-sm text-gray-400">
                Thử thay đổi từ khóa tìm kiếm
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          (searchResults.products.length > 0 ||
            searchResults.shops.length > 0) && (
            <div className="p-5">
              {/* Results Summary */}
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-amber-600" />
                  <p className="text-sm font-medium text-gray-700">
                    {searchResults.products.length} sản phẩm
                    {searchResults.shops.length > 0 &&
                      ` • ${searchResults.shops.length} cửa hàng`}
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-amber-100 text-amber-800 hover:bg-amber-200 px-3 py-1 rounded-full font-medium"
                >
                  "{searchQuery}"
                </Badge>
              </div>

              {/* Shops Section */}
              {searchResults.shops.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center justify-center w-7 h-7 bg-green-100 rounded-lg">
                      <Store className="h-4 w-4 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-base text-gray-800">
                      Cửa hàng
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {searchResults.shops.map((shop) => (
                      <Card
                        key={shop.id}
                        className="group hover:shadow-lg hover:border-green-200 transition-all duration-200 
                                 cursor-pointer border-gray-200 rounded-xl overflow-hidden"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              {shop.imageUrl ? (
                                <img
                                  src={shop.imageUrl}
                                  alt={shop.name}
                                  className="w-16 h-16 object-cover rounded-xl shadow-sm 
                                           group-hover:scale-105 transition-transform duration-200"
                                />
                              ) : (
                                <div
                                  className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 
                                              rounded-xl flex items-center justify-center"
                                >
                                  <Store className="h-8 w-8 text-green-600" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-base text-gray-800 truncate group-hover:text-green-600 transition-colors">
                                {shop.name}
                              </h4>
                              {shop.popularProducts.length > 0 && (
                                <p className="text-sm text-gray-500 mt-1">
                                  <span className="inline-flex items-center gap-1">
                                    <Package className="h-3.5 w-3.5" />
                                    {shop.popularProducts.length} sản phẩm nổi
                                    bật
                                  </span>
                                </p>
                              )}
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-lg border-green-200 text-green-600 
                                         hover:bg-green-50 hover:border-green-300
                                         transition-colors"
                            >
                              Xem
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Products Section */}
              {searchResults.products.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center justify-center w-7 h-7 bg-amber-100 rounded-lg">
                      <Package className="h-4 w-4 text-amber-600" />
                    </div>
                    <h3 className="font-semibold text-base text-gray-800">
                      Sản phẩm
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {searchResults.products.map((product) => (
                      <Card
                        key={product.id}
                        className="group hover:shadow-lg hover:border-amber-200 transition-all duration-200 
                                   cursor-pointer border-gray-200 rounded-xl overflow-hidden"
                        onClick={() => navigateToProduct(product.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="relative flex-shrink-0">
                              <img
                                src={
                                  product.imageUrl ||
                                  "/placeholder.svg"
                                }
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded-xl shadow-sm
                                           group-hover:scale-105 transition-transform duration-200"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4
                                className="font-semibold text-base text-gray-800 line-clamp-1 
                                             group-hover:text-amber-600 transition-colors"
                              >
                                {product.name}
                              </h4>
                              <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">
                                <Store className="h-3.5 w-3.5 inline mr-1" />
                                {product.shopName}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-lg font-bold text-amber-600">
                                  {product.basePrice.toLocaleString("vi-VN")}đ
                                </span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-lg border-amber-200 text-amber-600 
                                         hover:bg-amber-50 hover:border-amber-300
                                         transition-colors flex-shrink-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigateToProduct(product.id);
                              }}
                            >
                              Xem
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        {!searchQuery && (
          <div className="p-12 text-center">
            <div
              className="inline-flex items-center justify-center w-20 h-20 
                            bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl mb-4"
            >
              <SearchIcon className="h-10 w-10 text-amber-400" />
            </div>
            <p className="text-gray-600 font-medium mb-1">Tìm kiếm nhanh</p>
            <p className="text-sm text-gray-400">
              Nhập từ khóa để tìm sản phẩm hoặc cửa hàng
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
