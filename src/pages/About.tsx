import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Shield, Truck, Clock, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AIAssistant from "@/components/AIAssistant";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Tâm Huyết",
      description:
        "Chúng tôi hiểu ý nghĩa thiêng liêng của lễ cúng và cam kết mang đến những sản phẩm chất lượng nhất",
    },
    {
      icon: Shield,
      title: "Chất Lượng",
      description:
        "Tất cả sản phẩm đều được tuyển chọn kỹ lưỡng, đảm bảo tươi ngon và an toàn cho sức khỏe",
    },
    {
      icon: Truck,
      title: "Giao Hàng Nhanh",
      description:
        "Dịch vụ giao hàng tận nơi trong ngày, đảm bảo sản phẩm đến tay khách hàng kịp thời",
    },
    {
      icon: Clock,
      title: "Hỗ Trợ 24/7",
      description:
        "Đội ngũ AI và nhân viên tư vấn luôn sẵn sàng hỗ trợ khách hàng mọi lúc, mọi nơi",
    },
  ];

  const stats = [
    { number: "5+", label: "Năm kinh nghiệm", color: "text-primary" },
    { number: "1000+", label: "Khách hàng tin tưởng", color: "text-primary" },
    { number: "100+", label: "Sản phẩm đa dạng", color: "text-accent" },
    { number: "99%", label: "Độ hài lòng", color: "text-primary" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section
        className="relative py-16 overflow-hidden"
        style={{ height: "30vh" }}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://i.pinimg.com/1200x/c1/b9/5b/c1b95be20d4d2494931739a6f36046b1.jpg"
            alt="Products Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Về Chúng Tôi
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
            Chuyên cung cấp đồ cúng cao cấp với tâm huyết và sự tận tâm
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-secondary text-secondary-foreground">
                Câu chuyện của chúng tôi
              </Badge>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Hành Trình Phục Vụ Cộng Đồng
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-[#C99F4D]">NOVA</strong> được thành
                  lập với mong muốn mang đến những sản phẩm đồ cúng chất lượng
                  cao, phục vụ các gia đình Việt Nam trong những dịp lễ quan
                  trọng, đặc biệt là lễ tốt nghiệp.
                </p>
                <p>
                  Chúng tôi hiểu rằng mỗi lễ cúng đều mang ý nghĩa thiêng liêng,
                  thể hiện lòng biết ơn và sự tôn kính của con cháu đối với tổ
                  tiên. Vì vậy, mỗi sản phẩm được chúng tôi tuyển chọn đều phải
                  đạt tiêu chuẩn cao nhất về chất lượng và ý nghĩa.
                </p>
                <p>
                  Với sự hỗ trợ của công nghệ AI hiện đại, chúng tôi mang đến
                  trải nghiệm mua sắm tiện lợi, giúp khách hàng dễ dàng lựa chọn
                  những sản phẩm phù hợp nhất cho từng dịp cúng lễ.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://i.pinimg.com/736x/0e/2f/13/0e2f133922d3cae044e006f7730ba0b9.jpg"
                alt="Đồ cúng truyền thống"
                className="rounded-lg shadow-medium w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-lg shadow-strong border border-border">
                <div className="flex items-center space-x-3">
                  <Heart className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="font-semibold text-foreground">Cam Kết</p>
                    <p className="text-sm text-muted-foreground">
                      Chất lượng hàng đầu
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Giá Trị Cốt Lõi
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Những giá trị mà chúng tôi luôn kiên trì và phấn đấu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card
                  key={index}
                  className="group hover:shadow-medium transition-smooth bg-gradient-card border-border/50"
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2 text-lg">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div
                  className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2`}
                >
                  {stat.number}
                </div>
                <p className="text-muted-foreground font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Đội Ngũ Của Chúng Tôi
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Những người luôn tận tâm phục vụ khách hàng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-6 text-center">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                  alt="CEO"
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-semibold text-foreground text-lg mb-1">
                  Nguyễn Minh Hoàng
                </h3>
                <p className="text-ellipsis font-medium mb-2">Founder & CEO</p>
                <p className="text-muted-foreground text-sm">
                  5+ năm kinh nghiệm trong lĩnh vực đồ cúng truyền thống
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-6 text-center">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                  alt="Marketing Manager"
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-semibold text-foreground text-lg mb-1">
                  Trần Thị Mai
                </h3>
                <p className="text-ellipsis font-medium mb-2">
                  Marketing Manager
                </p>
                <p className="text-muted-foreground text-sm">
                  Chuyên gia về trải nghiệm khách hàng và phát triển sản phẩm
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gradient-primary flex items-center justify-center">
                  <Users className="h-12 w-12 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground text-lg mb-1">
                  Đội Ngũ AI
                </h3>
                <p className="text-ellipsis font-medium mb-2">
                  Trợ lý thông minh
                </p>
                <p className="text-muted-foreground text-sm">
                  Hệ thống AI tiên tiến hỗ trợ tư vấn 24/7
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
      <AIAssistant />
    </div>
  );
};

export default About;
