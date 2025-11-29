import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
    {
        id: 1,
        name: "Nguyễn Văn A",
        role: "Khách hàng thân thiết",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        content:
            "Sản phẩm rất đẹp và chất lượng. Tôi đã đặt mâm cúng đầy tháng cho bé và rất hài lòng với sự tỉ mỉ của shop.",
        rating: 5,
    },
    {
        id: 2,
        name: "Trần Thị B",
        role: "Khách hàng mới",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
        content:
            "Giao hàng đúng giờ, nhân viên tư vấn nhiệt tình. Xôi chè rất ngon, sẽ ủng hộ shop dài dài.",
        rating: 5,
    },
    {
        id: 3,
        name: "Lê Văn C",
        role: "Khách hàng doanh nghiệp",
        avatar: "https://i.pravatar.cc/150?u=a04258114e29026302d",
        content:
            "Dịch vụ chuyên nghiệp, giá cả hợp lý. Rất tiện lợi cho những người bận rộn như tôi.",
        rating: 4,
    },
];

const TestimonialsSection = () => {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                        Khách Hàng Nói Gì
                    </h2>
                    <div className="w-20 h-1 bg-[#C99F4D] mx-auto rounded-full mb-6" />
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto font-light">
                        Niềm tin của khách hàng là thành công của chúng tôi
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial) => (
                        <Card
                            key={testimonial.id}
                            className="border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 bg-gray-50/50"
                        >
                            <CardContent className="p-8 flex flex-col h-full">
                                <div className="mb-6 text-[#C99F4D]">
                                    <Quote className="w-10 h-10 opacity-20" />
                                </div>
                                <p className="text-gray-600 mb-8 flex-1 text-lg font-light italic leading-relaxed">
                                    "{testimonial.content}"
                                </p>
                                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-gray-100">
                                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                        <AvatarImage
                                            src={testimonial.avatar}
                                            alt={testimonial.name}
                                        />
                                        <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">
                                            {testimonial.name}
                                        </h4>
                                        <p className="text-xs text-gray-500">{testimonial.role}</p>
                                    </div>
                                    <div className="ml-auto flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < testimonial.rating
                                                        ? "text-[#C99F4D] fill-current"
                                                        : "text-gray-300"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
