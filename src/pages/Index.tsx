import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import { apiService, Product } from "@/services/apiService";
// import AIAssistant from "@/components/AIAssistant";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiService.getProducts();
        // Handle array or object response
        const productList = Array.isArray(data) ? data : (data as any).products || [];
        // Take first 8 products for home page
        setProducts(productList.slice(0, 8));
      } catch (error) {
        console.error("Failed to fetch products for home page:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Categories />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-8">Sản Phẩm Nổi Bật</h2>
        {loading ? (
          <div className="text-center">Đang tải...</div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
      <Footer />
      <Chatbot />
      {/* <AIAssistant /> */}
    </div>
  );
};

export default Index;
