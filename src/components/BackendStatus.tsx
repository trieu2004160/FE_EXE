import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Wifi, WifiOff } from "lucide-react";
import { apiService } from "@/services/apiService";

export const BackendStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkBackendConnection = async () => {
      setIsChecking(true);
      try {
        const connected = await apiService.healthCheck();
        setIsConnected(connected);
      } catch (error) {
        setIsConnected(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkBackendConnection();

    // Check every 30 seconds
    const interval = setInterval(checkBackendConnection, 30000);

    return () => clearInterval(interval);
  }, []);

  if (isChecking) {
    return (
      <Alert className="mb-4">
        <Wifi className="h-4 w-4 animate-pulse" />
        <AlertDescription>Đang kiểm tra kết nối backend...</AlertDescription>
      </Alert>
    );
  }

  if (isConnected === null) return null;

  return (
    <Alert
      className={`mb-4 ${
        isConnected
          ? "border-green-200 bg-green-50"
          : "border-yellow-200 bg-yellow-50"
      }`}
    >
      {isConnected ? (
        <>
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Đã kết nối với backend API
          </AlertDescription>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            Backend API không khả dụng - sử dụng chế độ offline
          </AlertDescription>
        </>
      )}
    </Alert>
  );
};

export default BackendStatus;
