// src/steps/InputSource.tsx
import { Badge } from "@/components/ui/badge";

export default function InputSource() {
  return (
    <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center p-6 border rounded-lg">
            <div>
              <p className="font-medium">HDMI Input</p>
              <p className="text-sm text-muted-foreground">Primary video and audio input from TV</p>
            </div>
            <Badge variant="default">Active</Badge>
          </div>
          <div className="flex justify-between items-center p-6 border rounded-lg bg-muted/50">
            <div>
              <p className="font-medium">Line In Input</p>
              <p className="text-sm text-muted-foreground">External audio input through 3.5mm jack</p>
            </div>
            <Badge variant="secondary">Inactive</Badge>
          </div>
        </div>
        <div className="p-6 border rounded-lg">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Current input source is automatically detected and set to the active input.
            </p>
            <div className="inline-flex items-center gap-2 px-8 py-4 bg-green-500/10 border border-green-500/20 rounded-full">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="font-medium text-green-700">HDMI Input is currently active</span>
            </div>
          </div>
        </div>
    </div>
  );
}