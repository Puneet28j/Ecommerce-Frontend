import { WifiOff } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { useEffect, useState } from "react";

export function OfflineWarning() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <Alert
      variant="destructive"
      className="fixed bottom-4 left-4 right-4 max-w-lg mx-auto z-50 animate-in fade-in slide-in-from-bottom-4"
    >
      <WifiOff className="h-4 w-4" />
      <AlertTitle>No Internet Connection</AlertTitle>
      <AlertDescription>
        Please check your internet connection and try again.
      </AlertDescription>
    </Alert>
  );
}
