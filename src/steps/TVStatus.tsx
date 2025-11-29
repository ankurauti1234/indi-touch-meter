// src/steps/TVStatus.tsx
import { Badge } from "@/components/ui/badge";

export default function TVStatus() {
  return (
    <div className="max-w-md mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-1 p-1 bg-muted rounded-full">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <Badge variant="default">TV is ON</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            The TV is currently powered on and ready for operation.
          </p>
        </div>
      </div>
    </div>
  );
}