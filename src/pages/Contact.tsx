import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AIAssistant from "@/components/AIAssistant";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate form submission
    toast({
      title: "Gửi tin nhắn thành công!",
      description: "Chúng tôi sẽ phản hồi trong vòng 24 giờ.",
    });

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Địa chỉ",
      details: ["123 Đường Lê Lợi, Quận 1", "TP. Hồ Chí Minh, Việt Nam"],
      color: "text-[#C99F4D]",
    },
    {
      icon: Phone,
      title: "Điện thoại",
      details: ["Hotline: 1900 1234", "Mobile: 0123 456 789"],
      color: "text-[#C99F4D]",
    },
    {
      icon: Mail,
      title: "Email",
      details: ["contact@docungonline.com", "support@docungonline.com"],
      color: "text-[#C99F4D]",
    },
    {
      icon: Clock,
      title: "Thời gian làm việc",
      details: ["Thứ 2 - Thứ 6: 8:00 - 18:00", "Thứ 7 - CN: 9:00 - 17:00"],
      color: "text-[#C99F4D]",
    },
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
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Liên Hệ Với Chúng Tôi
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon;
              return (
                <Card
                  key={index}
                  className="text-center hover:shadow-medium transition-smooth bg-gradient-card border-border/50"
                >
                  <CardContent className="p-6">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-full bg-muted/30 flex items-center justify-center`}
                    >
                      <IconComponent className={`h-8 w-8 ${info.color}`} />
                    </div>
                    <h3 className="font-semibold text-foreground text-lg mb-3">
                      {info.title}
                    </h3>
                    <div className="space-y-1">
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-muted-foreground text-sm">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <MessageCircle className="h-6 w-6 mr-3 text-[#C99F4D]" />
                  Gửi Tin Nhắn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Họ và tên *
                      </label>
                      <Input
                        placeholder="Nhập họ và tên"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Số điện thoại
                      </label>
                      <Input
                        placeholder="Nhập số điện thoại"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Email *
                    </label>
                    <Input
                      type="email"
                      placeholder="Nhập địa chỉ email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Chủ đề
                    </label>
                    <Select
                      value={formData.subject}
                      onValueChange={(value) =>
                        handleInputChange("subject", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn chủ đề" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="product">Tư vấn sản phẩm</SelectItem>
                        <SelectItem value="order">Hỗ trợ đơn hàng</SelectItem>
                        <SelectItem value="complaint">Khiếu nại</SelectItem>
                        <SelectItem value="partnership">
                          Hợp tác kinh doanh
                        </SelectItem>
                        <SelectItem value="other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Nội dung tin nhắn *
                    </label>
                    <Textarea
                      placeholder="Nhập nội dung tin nhắn của bạn..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) =>
                        handleInputChange("message", e.target.value)
                      }
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#C99F4D] text-primary-foreground hover:bg-[#B8904A] transition-bounce"
                    size="lg"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Gửi tin nhắn
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Map & Additional Info */}
            <div className="space-y-6">
              {/* Bản đồ Google Maps */}
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle>Tìm đường đến cửa hàng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video rounded-lg overflow-hidden mb-4">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.286923518261!2d106.69109337480553!3d10.78974535901087!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f404b084253%3A0x4b23c49e5e792c6a!2zMTIzIMSQLiBMw6ogTOG7o2ksIFBoxrDhu51uZyDEkOG6oWkgNCwgUXXhuq1uIDEsIFRow6BuaCBwaOG7kSBI4buNYyBNaW5oLCBWaWV0bmFt!5e0!3m2!1svi!2s!4v1739855333123!5m2!1svi!2s"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full  bg-[#C99F4D] hover:bg-[#B8904A] text-white font-semibold transition-all duration-300"
                    onClick={() =>
                      window.open(
                        "https://maps.app.goo.gl/QReMbPswyo6ve8aNA",
                        "_blank"
                      )
                    }
                  >
                    Xem chỉ đường trên Google Maps
                  </Button>
                </CardContent>
              </Card>

              {/* Câu hỏi thường gặp */}
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle>Câu hỏi thường gặp</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Thời gian giao hàng?
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      Chúng tôi giao hàng trong ngày tại TP.HCM và 1-2 ngày cho
                      các tỉnh thành khác.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Có tư vấn miễn phí không?
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      Có, chúng tôi có AI trợ lý và đội ngũ tư vấn viên hỗ trợ
                      24/7 hoàn toàn miễn phí.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Chính sách đổi trả?
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      Chúng tôi hỗ trợ đổi trả trong vòng 24h nếu sản phẩm không
                      đạt chất lượng.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <AIAssistant />
    </div>
  );
};

export default Contact;
