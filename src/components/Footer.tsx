import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";
import logoIcon from "@/assets/z7048679417409_951f2312b6a4acf2cd06da22ec333170-removebg-preview.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-stone-50 border-t border-stone-200 pt-8 ">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
          <div>
            <div className="mb-4">
              <Link to="/" className="flex items-center gap-2">
                <img
                  src={logoIcon}
                  alt="Logo"
                  className="w-20 h-20 object-contain"
                />
                <span className="text-xl lg:text-2xl font-bold text-[#C99F4D]">
                  NOVA
                </span>
              </Link>
            </div>
            <p className="text-stone-600 text-sm leading-relaxed">
              Chuyên cung cấp hoa tươi cao cấp cho các dịp đặc biệt, đặc biệt là
              lễ tốt nghiệp.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              <a
                href="#"
                className="group p-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-blue-500/30"
              >
                <Facebook className="h-6 w-6 text-white group-hover:animate-bounce" />
              </a>
              <a
                href="#"
                className="group p-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-purple-500/30"
              >
                <Instagram className="h-6 w-6 text-white group-hover:animate-pulse" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-stone-800 mb-4">Liên Kết</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-stone-600 hover:text-stone-800 transition-colors"
                >
                  Trang Chủ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-stone-600 hover:text-stone-800 transition-colors"
                >
                  Sản Phẩm
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-stone-600 hover:text-stone-800 transition-colors"
                >
                  Về Chúng Tôi
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-stone-600 hover:text-stone-800 transition-colors"
                >
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-stone-800 mb-4">Dịch Vụ</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-stone-600 hover:text-stone-800 transition-colors"
                >
                  Giao Hàng Tận Nơi
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-stone-600 hover:text-stone-800 transition-colors"
                >
                  Tư Vấn Miễn Phí
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-stone-600 hover:text-stone-800 transition-colors"
                >
                  Chăm Sóc Khách Hàng
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-stone-800 mb-4">Liên Hệ</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-stone-600">
                <Phone className="h-4 w-4" />
                <span>0389 560 964</span>
              </li>
              <li className="flex items-center gap-2 text-stone-600">
                <Mail className="h-4 w-4" />
                <span>teamnova.company@gmail.com</span>
              </li>
              <li className="flex items-start gap-2 text-stone-600">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>Đại Học FPT Quy Nhơn, Khu đô thị mới An Phú Thịnh, Quy Nhơn, Gia Lai</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
