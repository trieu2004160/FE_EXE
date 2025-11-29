import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

const NewsletterSection = () => {
    return (
        <section className="py-24 bg-[#1a1a1a] relative overflow-hidden">
            {/* Subtle Pattern */}
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center p-4 bg-white/5 rounded-full mb-8 backdrop-blur-sm border border-white/10">
                        <Mail className="w-6 h-6 text-[#C99F4D]" />
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">
                        Đăng Ký Nhận Tin
                    </h2>

                    <p className="text-gray-400 mb-10 text-lg font-light max-w-2xl mx-auto">
                        Nhận thông báo về các bộ sưu tập mới và ưu đãi độc quyền dành riêng cho thành viên.
                    </p>

                    <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
                        <Input
                            type="email"
                            placeholder="Địa chỉ email của bạn..."
                            className="bg-white/5 border-white/10 h-14 text-white placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-[#C99F4D] focus-visible:border-[#C99F4D] rounded-full px-6"
                        />
                        <Button
                            type="submit"
                            className="h-14 px-10 bg-[#C99F4D] hover:bg-[#B8904A] text-white font-medium transition-all duration-300 rounded-full shadow-lg hover:shadow-[#C99F4D]/20"
                        >
                            Đăng Ký
                        </Button>
                    </form>

                    <p className="text-gray-600 text-xs mt-6">
                        Bằng cách đăng ký, bạn đồng ý với chính sách bảo mật của chúng tôi.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default NewsletterSection;
