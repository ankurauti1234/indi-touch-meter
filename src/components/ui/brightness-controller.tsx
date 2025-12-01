import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export function BrightnessController() {
  const max = 12;
  const skipInterval = 2;
  const ticks = [...Array(max + 1)].map((_, i) => i);

  return (
    <div className="w-full px-1 py-2">

      <Slider aria-label="Brightness Slider" defaultValue={[6]} max={max} />

      {/* Tick marks */}
      <div
        aria-hidden="true"
        className="mt-2 flex w-full items-center justify-between gap-1 px-1 text-muted-foreground text-[10px]"
      >
        {ticks.map((_, i) => (
          <span
            className="flex flex-col items-center justify-center w-0 gap-0.5"
            key={i}
          >
            <span
              className={cn(
                "h-1 w-px bg-muted-foreground/70",
                i % skipInterval !== 0 && "h-0.5"
              )}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
