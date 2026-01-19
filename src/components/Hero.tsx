import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  Star,
  Heart,
  Award,
  ShoppingBag,
  TrendingUp,
  Users,
  Clock,
} from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-amber-950 via-yellow-950 to-amber-950">
      {/* Animated Background Gradient Orbs - Golden Theme */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-yellow-400/20 to-amber-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-orange-400/15 to-yellow-500/15 rounded-full blur-3xl animate-pulse-slower" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-amber-400/10 to-yellow-400/10 rounded-full blur-3xl animate-spin-slow" />
      </div>

      {/* Background Image with Golden Overlay */}
      <div className="absolute inset-0 opacity-50">
        <div
          className="absolute inset-0 bg-cover bg-center scale-110 animate-ken-burns"
          style={{ backgroundImage: `url(${heroBanner})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-yellow-900/25 to-orange-900/30" />
      </div>

      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(251,191,36,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Floating Elements - Golden */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[10%] w-3 h-3 bg-yellow-300 rounded-full animate-float-1 shadow-lg shadow-yellow-300/70" />
        <div className="absolute top-40 right-[15%] w-2 h-2 bg-amber-300 rounded-full animate-float-2 shadow-lg shadow-amber-300/70" />
        <div className="absolute bottom-32 left-[20%] w-2.5 h-2.5 bg-yellow-400 rounded-full animate-float-3 shadow-lg shadow-yellow-400/70" />
        <div className="absolute bottom-20 right-[25%] w-3 h-3 bg-orange-300 rounded-full animate-float-4 shadow-lg shadow-orange-300/70" />
        <div className="absolute top-1/3 left-[5%] w-2 h-2 bg-amber-400 rounded-full animate-float-5 shadow-lg shadow-amber-400/70" />
        <div className="absolute top-2/3 right-[10%] w-2 h-2 bg-yellow-500 rounded-full animate-float-6 shadow-lg shadow-yellow-500/70" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Premium Badge - Golden */}
          <div className="flex justify-center mb-8 animate-fade-in-down">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500/30 via-amber-500/30 to-yellow-500/30 backdrop-blur-xl border border-yellow-400/60 rounded-full shadow-2xl shadow-yellow-500/30">
              <Sparkles className="w-5 h-5 text-yellow-300 animate-spin-slow" />
              <span className="text-sm font-semibold text-yellow-100 tracking-wide">
                ƯU ĐÃI ĐẶC BIỆT THÁNG NÀY
              </span>
              <TrendingUp className="w-4 h-4 text-yellow-300" />
            </div>
          </div>

          {/* Main Heading - Golden */}
          <div className="text-center mb-8 animate-fade-in-up">
            <h1 className="text-3xl sm:text-3xl md:text-3xl lg:text-6xl font-black mb-6 tracking-tight">
              <span className="block bg-gradient-to-r from-yellow-200 via-amber-100 to-yellow-200 bg-clip-text text-transparent drop-shadow-2xl leading-[1.1] pb-3 [text-shadow:0_0_80px_rgba(251,191,36,0.5)]">
                Trọn Gói Lễ Cúng
              </span>
            </h1>

            <div className="mt-8 space-y-4">
              <p className="text-2xl sm:text-3xl md:text-4xl text-amber-100/90 font-light tracking-wide">
                Trang Nhã & Tinh Tế
              </p>
              <div className="flex items-center justify-center gap-3 text-yellow-300/80">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-yellow-400/60" />
                <Sparkles className="w-5 h-5" />
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-yellow-400/60" />
              </div>
            </div>
          </div>

          {/* Subtitle - Golden */}
          <div className="text-center max-w-4xl mx-auto mb-12 animate-fade-in-up-delay-1">
            <p className="text-lg sm:text-xl md:text-2xl text-amber-100/80 leading-relaxed mb-3 font-light">
              Bộ sưu tập đồ cúng cao cấp với thiết kế tối giản
            </p>
            <p className="text-base sm:text-lg md:text-xl text-yellow-200/90 leading-relaxed font-medium">
              Màu sắc đồng nhất, thể hiện sự thành kính và tôn nghiêm
            </p>
          </div>

          {/* CTA Buttons - Golden */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-20 animate-fade-in-up-delay-2">
            <Link to="/products" className="w-full sm:w-auto group">
              <Button
                size="lg"
                className="w-full sm:w-auto px-12 py-8 text-lg font-bold bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-500 hover:via-amber-500 hover:to-yellow-600 text-amber-950 rounded-2xl shadow-2xl shadow-yellow-500/50 hover:shadow-yellow-400/70 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 border border-yellow-300/50"
              >
                <ShoppingBag className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                Khám Phá Sản Phẩm
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </Link>
            <Link to="/contact" className="w-full sm:w-auto group">
              <Button
                size="lg"
                className="w-full sm:w-auto px-12 py-8 text-lg font-semibold bg-amber-100/10 hover:bg-amber-100/20 text-amber-100 rounded-2xl backdrop-blur-xl border-2 border-amber-300/40 hover:border-amber-200/60 shadow-2xl hover:shadow-amber-300/30 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300"
              >
                <Heart className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                Tư Vấn Miễn Phí
                <Sparkles className="ml-3 h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
              </Button>
            </Link>
          </div>

          {/* Stats Cards - Golden Theme */}

          {/* Trust Indicators - Golden */}
          <div className="mt-16 text-center animate-fade-in-up-delay-6">
            <div className="inline-flex items-center gap-8 px-8 py-4 bg-amber-100/5 backdrop-blur-xl rounded-full border border-amber-300/20">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2"></div>
                <span className="text-amber-100/80 text-sm ml-2">
                  Sản Phẩm Chất Lượng Cao
                </span>
              </div>
              <div className="w-px h-6 bg-amber-300/30" />
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-amber-100/80 text-sm">
                  Giao hàng toàn quốc
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes ken-burns {
          0% {
            transform: scale(1) translate(0, 0);
          }
          25% {
            transform: scale(1.1) translate(-2%, -1%);
          }
          50% {
            transform: scale(1.05) translate(2%, 2%);
          }
          75% {
            transform: scale(1.15) translate(-1%, 1%);
          }
          100% {
            transform: scale(1) translate(1%, -1%);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.05);
          }
        }
        
        @keyframes pulse-slower {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
        
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, -30px); }
        }
        
        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(15px, -25px); }
        }
        
        @keyframes float-3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-25px, 20px); }
        }
        
        @keyframes float-4 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -20px); }
        }
        
        @keyframes float-5 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-15px, -35px); }
        }
        
        @keyframes float-6 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, 15px); }
        }
        
        .animate-fade-in-down {
          animation: fade-in-down 1s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out 0.2s both;
        }
        
        .animate-fade-in-up-delay-1 {
          animation: fade-in-up 1s ease-out 0.4s both;
        }
        
        .animate-fade-in-up-delay-2 {
          animation: fade-in-up 1s ease-out 0.6s both;
        }
        
        .animate-fade-in-up-delay-3 {
          animation: fade-in-up 1s ease-out 0.8s both;
        }
        
        .animate-fade-in-up-delay-4 {
          animation: fade-in-up 1s ease-out 1s both;
        }
        
        .animate-fade-in-up-delay-5 {
          animation: fade-in-up 1s ease-out 1.2s both;
        }
        
        .animate-fade-in-up-delay-6 {
          animation: fade-in-up 1s ease-out 1.4s both;
        }
        
        .animate-ken-burns {
          animation: ken-burns 90s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        
        .animate-pulse-slower {
          animation: pulse-slower 10s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-float-1 {
          animation: float-1 8s ease-in-out infinite;
        }
        
        .animate-float-2 {
          animation: float-2 7s ease-in-out infinite;
        }
        
        .animate-float-3 {
          animation: float-3 9s ease-in-out infinite;
        }
        
        .animate-float-4 {
          animation: float-4 6s ease-in-out infinite;
        }
        
        .animate-float-5 {
          animation: float-5 10s ease-in-out infinite;
        }
        
        .animate-float-6 {
          animation: float-6 8.5s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;
