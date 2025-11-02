import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Users,
} from "lucide-react";
import { offlineAuthService } from "@/services/offlineAuthService";
import { apiService } from "@/services/apiService";

export const OfflineStatus = () => {
  const [isBackendAvailable, setIsBackendAvailable] = useState<boolean | null>(
    null
  );
  const [offlineUsersCount, setOfflineUsersCount] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  const checkBackendStatus = async () => {
    setIsChecking(true);
    try {
      const isAvailable = await apiService.healthCheck();
      setIsBackendAvailable(isAvailable);
    } catch (error) {
      setIsBackendAvailable(false);
    } finally {
      setIsChecking(false);
    }
  };

  const updateOfflineUsersCount = () => {
    const count = offlineAuthService.getOfflineUsersCount();
    setOfflineUsersCount(count);
  };

  useEffect(() => {
    checkBackendStatus();
    updateOfflineUsersCount();

    // Check backend status every 30 seconds
    const interval = setInterval(checkBackendStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4 max-w-md mx-auto">
      Connection Status
      {/* <Alert
        className={`border-l-4 ${
          isBackendAvailable === null
            ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
            : isBackendAvailable
            ? "border-green-500 bg-green-50 dark:bg-green-900/20"
            : "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
        }`}
      >
        <div className="flex items-center gap-2">
          {isChecking ? (
            <RefreshCw className="h-4 w-4 animate-spin text-yellow-600" />
          ) : isBackendAvailable === null ? (
            <RefreshCw className="h-4 w-4 text-yellow-600" />
          ) : isBackendAvailable ? (
            <Wifi className="h-4 w-4 text-green-600" />
          ) : (
            <WifiOff className="h-4 w-4 text-orange-600" />
          )}

          <AlertDescription
            className={`text-sm font-medium ${
              isBackendAvailable === null
                ? "text-yellow-800 dark:text-yellow-200"
                : isBackendAvailable
                ? "text-green-800 dark:text-green-200"
                : "text-orange-800 dark:text-orange-200"
            }`}
          >
            {isChecking
              ? "Đang kiểm tra kết nối..."
              : isBackendAvailable === null
              ? "Chưa kiểm tra backend"
              : isBackendAvailable
              ? "🟢 Backend API có sẵn"
              : "🟠 Chế độ offline - Backend không khả dụng"}
          </AlertDescription>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={checkBackendStatus}
          disabled={isChecking}
          className="mt-2 h-7 px-2 py-1 text-xs"
        >
          <RefreshCw
            className={`h-3 w-3 mr-1 ${isChecking ? "animate-spin" : ""}`}
          />
          Kiểm tra lại
        </Button>
      </Alert> */}
      {/* Offline Mode Info */}
      {/* {isBackendAvailable === false && (
        <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
            <div className="space-y-2">
              <p className="font-medium">Chế độ offline được kích hoạt</p>
              <ul className="text-xs space-y-1 ml-4 list-disc">
                <li>Tài khoản được lưu trong trình duyệt</li>
                <li>Tính năng đăng ký/đăng nhập vẫn hoạt động</li>
                <li>Dữ liệu sẽ đồng bộ khi backend khả dụng</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )} */}
      {/* Offline Users Count */}
      {offlineUsersCount > 0 && (
        <Alert className="border-gray-200 bg-gray-50 dark:bg-gray-900/20">
          <Users className="h-4 w-4 text-gray-600" />
          <AlertDescription className="text-gray-800 dark:text-gray-200 text-sm">
            <span className="font-medium">
              {offlineUsersCount} tài khoản offline
            </span>{" "}
            đã được tạo
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
