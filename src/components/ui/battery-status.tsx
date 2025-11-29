"use client";

import { BatteryFull, BatteryMedium, BatteryLow, Plug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { cn } from "@/lib/utils";

interface BatteryStatusProps {
  percent?: number;        // 0–100
  onMains?: boolean;       // true = plugged in
}

export function BatteryStatus({
  percent = 76,
  onMains = false,
}: BatteryStatusProps) {

  const getBatteryIcon = () => {
    if (onMains) return <Plug className="h-4 w-4" />;

    if (percent >= 70) return <BatteryFull className="h-4 w-4" />;
    if (percent >= 30) return <BatteryMedium className="h-4 w-4" />;
    return <BatteryLow className="h-4 w-4" />;
  };

  const getBatteryColor = () => {
    if (onMains) return "text-green-500";
    if (percent >= 70) return "text-green-500";
    if (percent >= 30) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <ButtonGroup>
      <Button
        variant="outline"
        className={cn(
          "flex items-center gap-2 pointer-events-none",
          getBatteryColor()
        )}
      >
        {getBatteryIcon()}
        {/* <span className="text-xs">
          {onMains ? "Mains" : "Battery"}
        </span> */}
      </Button>

      {!onMains && (
        <Button
          variant="outline"
          className={cn(
            "pointer-events-none text-xs font-medium",
            getBatteryColor()
          )}
        >
          {percent}%
        </Button>
      )}

      {onMains && (
        <Button
          variant="outline"
          className="pointer-events-none text-xs font-medium text-green-500"
        >
          Charging
        </Button>
      )}
    </ButtonGroup>
  );
}
