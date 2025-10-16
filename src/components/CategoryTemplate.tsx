import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface CategoryTemplateProps {
  category: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  gradient: string;
  description: string;
  children: ReactNode;
}

const CategoryTemplate = ({
  category,
  icon: Icon,
  color,
  bgColor,
  gradient,
  description,
  children,
}: CategoryTemplateProps) => {
  return (
    <div className="min-h-screen">
      {/* Category Hero Section */}
      <section className={`relative py-20 ${bgColor} overflow-hidden`}>
        <div className="absolute inset-0 opacity-20">
          <div className={`w-full h-full ${gradient}`} />
        </div>

        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${color.replace(
                "#",
                ""
              )}' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
            }}
          />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          {/* Category Icon */}
          <div
            className={`w-20 h-20 mx-auto mb-6 rounded-full bg-white/90 flex items-center justify-center shadow-lg`}
          >
            <Icon className={`h-10 w-10`} style={{ color }} />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            {category}
          </h1>

          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>

          {/* Category Stats */}
          <div className="flex justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">25+</div>
              <div className="text-sm text-gray-600">Sản phẩm</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">4.8★</div>
              <div className="text-sm text-gray-600">Đánh giá</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">100%</div>
              <div className="text-sm text-gray-600">Chất lượng</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Content */}
      <div className="bg-white">{children}</div>
    </div>
  );
};

export default CategoryTemplate;
