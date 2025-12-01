import { ModeToggle } from "./mode-toggle";
import { BrightnessController } from "./brightness-controller";
import { BatteryStatus } from "./battery-status";
import { ShutdownRebootControls } from "./shutdown-reboot";
import { WifiDialog } from "./wifi-dialog";
import { DateTimeDisplay } from "../date-time-display";

import { Settings } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Label } from "./label";
import { Button } from "./button";

export const StatusBar = () => {
  return (
    <div className="bg-card border border-b-0 w-full p-2 flex items-center justify-between rounded-t-lg fixed bottom-0">
      {/* LEFT SIDE – Battery always visible */}
      <div className="flex items-center gap-4">
        {/* <BatteryStatus percent={68} onMains={true} /> */}
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">
        <BatteryStatus percent={68} onMains={true} />

        {/* STATUS ICON BUTTON */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline">
              <Settings className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-72 mb-1 p-0">
            <div className="mb-2 p-2 bg-muted border-b">
              <h1 className="text-sm">System Options</h1>
            </div>

            <div className="flex items-center w-full justify-evenly gap-2 p-2">
              <div className="p-2 border rounded-md w-full">
                <Label className="text-xs text-muted-foreground">
                  WiFi Settings
                </Label>
                <WifiDialog />
              </div>

              <div className="p-2 border rounded-md w-full">
                <Label className="text-xs text-muted-foreground">
                  Theme Toggle
                </Label>
                <ModeToggle />
              </div>
            </div>

            <div className="p-2">
              <div className="p-2 border rounded-md">
              <Label className="text-xs text-muted-foreground">
                Brightness
              </Label>
              <BrightnessController />
            </div>
            </div>

            <DropdownMenuSeparator />
            <div className="p-2">
              <ShutdownRebootControls />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* CLOCK */}
        <DateTimeDisplay />
      </div>
    </div>
  );
};
