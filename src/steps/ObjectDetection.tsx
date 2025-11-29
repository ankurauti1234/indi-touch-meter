// src/steps/ObjectDetection.tsx
import { Badge } from "@/components/ui/badge";

export default function ObjectDetection() {
  return (
    <div className="space-y-6">
  <div className="p-6 border rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Object Detection Service</p>
              <p className="text-sm text-muted-foreground">
                Real-time detection and tracking of people and objects in the viewing area
              </p>
            </div>
            <Badge variant="default">Running</Badge>
          </div>
          <div className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Detection Status:</span>
              <span className="font-medium">Active</span>
            </div>
            <div className="flex justify-between">
              <span>Frame Rate:</span>
              <span>30 FPS</span>
            </div>
            <div className="flex justify-between">
              <span>Detection Model:</span>
              <span>YOLOv8</span>
            </div>
          </div>
        </div>
    </div>
  );
}