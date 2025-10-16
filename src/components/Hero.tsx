import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Star, Heart, Award } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Background image with subtle overlay */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90 transition-all duration-1000"
          style={{ backgroundImage: `url(${heroBanner})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
        <div className="absolute inset-0 bg-white/15" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          {/* Animated Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-2xl mb-6 animate-[fadeInUp_1s_ease-out] bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent">
            Cúng Lễ Tốt Nghiệp
          </h1>

          {/* Animated Subtitle */}
          <p className="text-lg md:text-xl text-white/90 drop-shadow-lg animate-[fadeInUp_1s_ease-out_0.2s_both] max-w-2xl mx-auto leading-relaxed">
            Chọn bộ đồ cúng tối giản, trang nhã và đồng nhất màu sắc.
          </p>

          {/* Animated Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center animate-[fadeInUp_1s_ease-out_0.4s_both]">
            <Link to="/products">
              <Button
                size="lg"
                className="px-8 py-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold hover:from-yellow-500 hover:to-orange-600 shadow-2xl backdrop-blur-sm transform hover:scale-105 transition-all duration-300 group"
              >
                <Sparkles className="mr-2 h-5 w-5 group-hover:animate-spin" />
                Khám Phá Ngay
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                variant="secondary"
                className="px-8 py-6 bg-white/20 text-white border-white/40 hover:bg-white/30 backdrop-blur-sm shadow-xl transform hover:scale-105 transition-all duration-300 group"
              >
                <ArrowRight className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                Liên Hệ Tư Vấn
              </Button>
            </Link>
          </div>

          {/* Animated Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-300 hover:bg-white/20 animate-[fadeInUp_1s_ease-out_0.6s_both] group cursor-pointer">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4 group-hover:animate-pulse">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                100+
              </h3>
              <p className="text-white/80 font-medium">Sản phẩm đa dạng</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-300 hover:bg-white/20 animate-[fadeInUp_1s_ease-out_0.8s_both] group cursor-pointer">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-400 to-red-500 rounded-full mb-4 group-hover:animate-pulse">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-pink-400 to-red-500 bg-clip-text text-transparent">
                1000+
              </h3>
              <p className="text-white/80 font-medium">Khách hàng tin tưởng</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-300 hover:bg-white/20 animate-[fadeInUp_1s_ease-out_1s_both] group cursor-pointer">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mb-4 group-hover:animate-pulse">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                24/7
              </h3>
              <p className="text-white/80 font-medium">Hỗ trợ AI trực tuyến</p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
