import { Card, CardContent } from "@/components/ui/card";
import { Flower, Flame, Apple, Cookie, Droplets, Gift } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    id: 1,
    name: "Hoa Tươi",
    icon: Flower,
    count: 45,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  {
    id: 2,
    name: "Hương Nến",
    icon: Flame,
    count: 32,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
  },
  {
    id: 3,
    name: "Hoa Quả",
    icon: Apple,
    count: 28,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-900/20",
  },
  {
    id: 4,
    name: "Bánh Kẹo",
    icon: Cookie,
    count: 24,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
  },
  {
    id: 5,
    name: "Xôi – Chè",
    icon: Droplets,
    count: 18,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    id: 6,
    name: "Combo Tiết Kiệm",
    icon: Gift,
    count: 12,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
  },
];

const Categories = () => {
  // Map category names to custom routes
  const getCategoryLink = (categoryName: string) => {
    const customRoutes: { [key: string]: string } = {
      "Hoa Tươi": "/category/hoa-tuoi",
      "Hương Nến": "/category/huong-nen",
      "Bánh Kẹo": "/category/banh-keo",
      "Hoa Quả": "/category/hoa-qua",
      "Xôi – Chè": "/category/xoi-che",
      "Combo Tiết Kiệm": "/category/combo",
    };

    return (
      customRoutes[categoryName] ||
      `/catalog/${encodeURIComponent(categoryName)}`
    );
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Danh Mục Sản Phẩm
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Khám phá đa dạng các loại đồ cúng chất lượng cao cho lễ tốt nghiệp
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={category.id}
                to={getCategoryLink(category.name)}
                className="block"
              >
                <Card className="group hover:shadow-medium transition-smooth cursor-pointer bg-gradient-card border-border/50 hover:border-primary/30">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-full ${category.bgColor} flex items-center justify-center group-hover:scale-110 transition-bounce`}
                    >
                      <IconComponent className={`h-8 w-8 ${category.color}`} />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-smooth">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.count} sản phẩm
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
