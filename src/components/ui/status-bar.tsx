import { ModeToggle } from "./mode-toggle";
import { BrightnessController } from "./brightness-controller";
import { BatteryStatus } from "./battery-status";
import { ShutdownRebootControls } from "./shutdown-reboot";
import { WifiDialog } from "./wifi-dialog";
import { DateTimeDisplay } from "../date-time-display";

export const StatusBar = () => {
  return (
    <div className="bg-card border border-b-0 w-full p-2 flex items-center justify-between rounded-t-lg">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">
        <BatteryStatus percent={68} onMains={true} />
        <WifiDialog />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">
        <ModeToggle />
        <BrightnessController />
        <ShutdownRebootControls />
        |
        <DateTimeDisplay />
      </div>
    </div>
  );
};
