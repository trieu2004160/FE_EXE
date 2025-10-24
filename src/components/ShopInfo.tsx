import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Heart, MessageCircle, Store } from "lucide-react";
import { Shop } from "@/data/mockData";

interface ShopInfoProps {
  shop: Shop;
}

const ShopInfo = ({ shop }: ShopInfoProps) => {
  const navigate = useNavigate();

  const handleViewShop = () => {
    navigate(`/shop/${shop.id}`);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
      {/* Shop Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={shop.avatar}
              alt={shop.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-gray-100"
            />
            {shop.isVerified && (
              <div className="absolute -bottom-0.5 -right-0.5 bg-blue-500 rounded-full p-0.5">
                <CheckCircle className="h-3.5 w-3.5 text-white fill-current" />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-base text-gray-900 mb-0.5">
              {shop.name}
            </h3>
            <p className="text-sm text-gray-500">Online 3 phút trước</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-sm">
            <Heart className="h-4 w-4" />
            Yêu Thích
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-sm">
            <MessageCircle className="h-4 w-4" />
            Chat
          </Button>
          <Button
            onClick={handleViewShop}
            size="sm"
            className="bg-red-500 hover:bg-red-600 text-white gap-1.5 text-sm"
          >
            <Store className="h-4 w-4" />
            Xem Shop
          </Button>
        </div>
      </div>

      {/* Shop Stats */}
      <div className="pt-4">
        <div className="grid grid-cols-4 gap-6 text-sm">
          <div className="text-center">
            <div className="text-gray-500 mb-1.5">Đánh Giá</div>
            <div className="font-semibold text-red-500 text-base">
              {shop.totalSales}k
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 mb-1.5">Sản Phẩm</div>
            <div className="font-semibold text-gray-900 text-base">
              {shop.totalProducts}
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 mb-1.5">Tham Gia</div>
            <div className="font-semibold text-gray-900 text-base">3 năm</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 mb-1.5">Theo Dõi</div>
            <div className="font-semibold text-gray-900 text-base">61k</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopInfo;
