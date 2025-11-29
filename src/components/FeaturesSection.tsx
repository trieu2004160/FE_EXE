import { ShieldCheck, Truck, Clock, Headphones } from "lucide-react";

const features = [
    {
        icon: <ShieldCheck className="w-8 h-8 text-[#C99F4D]" />,
        title: "Chất Lượng Đảm Bảo",
        description: "Cam kết 100% sản phẩm chất lượng cao",
    },
    {
        icon: <Truck className="w-8 h-8 text-[#C99F4D]" />,
        title: "Giao Hàng Nhanh",
        description: "Vận chuyển an toàn, đúng hẹn",
    },
    {
        icon: <Clock className="w-8 h-8 text-[#C99F4D]" />,
        title: "Đặt Hàng 24/7",
        description: "Dịch vụ trực tuyến mọi lúc mọi nơi",
    },
    {
        icon: <Headphones className="w-8 h-8 text-[#C99F4D]" />,
        title: "Hỗ Trợ Tận Tình",
        description: "Tư vấn chuyên nghiệp, chu đáo",
    },
];

const FeaturesSection = () => {
    return (
        <section className="py-12 border-b border-gray-100 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center text-center px-4 py-4 md:py-0"
                        >
                            <div className="mb-4 p-3 bg-amber-50 rounded-full">
                                {feature.icon}
                            </div>
                            <h3 className="text-base font-semibold mb-1 text-gray-900">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-gray-500">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
