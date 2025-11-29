import { Lightbulb } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export function BrightnessController() {
  const max = 12;
  const skipInterval = 2;
  const ticks = [...Array(max + 1)].map((_, i) => i);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Lightbulb className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Brightness</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <Label className="text-sm mb-2 block">Adjust Brightness</Label>

          <div className="w-full">
            <Slider aria-label="Brightness Slider" defaultValue={[6]} max={max} />

            <span
              aria-hidden="true"
              className="mt-3 flex w-full items-center justify-between gap-1 px-2 font-medium text-muted-foreground text-xs"
            >
              {ticks.map((_, i) => (
                <span
                  className="flex w-0 flex-col items-center justify-center gap-1"
                  key={String(i)}
                >
                  <span
                    className={cn(
                      "h-1 w-px bg-muted-foreground/70",
                      i % skipInterval !== 0 && "h-0.5"
                    )}
                  />
                  <span className={cn(i % skipInterval !== 0 && "opacity-0")}>
                    {i}
                  </span>
                </span>
              ))}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
