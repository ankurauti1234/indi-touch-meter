// src/steps/TVStatus.tsx
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Badge } from "@/components/ui/badge";

export default function TVStatus() {
  const [isOn, setIsOn] = useState(false);

  const checkTVStatus = async () => {
    try {
      const exists = await invoke<boolean>("file_exists", { fileName: "tv_on" });
      setIsOn(exists);
    } catch (error) {
      console.error("Failed to check tv_on:", error);
    }
  };

  useEffect(() => {
    checkTVStatus();
    const interval = setInterval(checkTVStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className=" w-full mx-auto h-full flex flex-col space-y-4 p-4 items-center justify-between min-h-64">

      {/* TV Status Card */}
<div className=" w-full max-w-3xl">
        <div
        className={`flex justify-between items-center p-4 rounded-lg border transition-all ${
          isOn ? "bg-accent/15 border-accent" : "bg-card border-muted"
        }`}
      >
        <div className="flex flex-col">
          <p className="font-medium">TV Power Status</p>
          <p className="text-sm text-muted-foreground">
            Reports the current power state of the connected TV
          </p>
        </div>

        <Badge
          variant={isOn ? "default" : "secondary"}
          className="px-3 py-1 text-xs"
        >
          {isOn ? "On" : "Off"}
        </Badge>
      </div>
</div>

      {/* Bottom Label */}
      <p className="text-xs text-muted-foreground text-center">
        TV power state is automatically detected every 5 seconds.
      </p>
    </div>
  );
}

TVStatus.stepTitle = "TV Status";
