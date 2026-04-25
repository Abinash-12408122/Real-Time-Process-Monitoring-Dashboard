import { AlertTriangle } from "lucide-react";

interface WarningBannerProps {
  visible: boolean;
}

const WarningBanner = ({ visible }: WarningBannerProps) => {
  if (!visible) return null;

  return (
    <div className="animate-fade-in animate-pulse-warning flex items-center gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2.5">
      <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
      <span className="text-xs font-semibold text-destructive">
        ⚠ High CPU Usage Detected! System performance may be affected.
      </span>
    </div>
  );
};

export default WarningBanner;
