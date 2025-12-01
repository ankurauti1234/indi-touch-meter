// src/steps/ObjectDetection.tsx
"use client";

import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Badge } from "@/components/ui/badge";

export default function ObjectDetection() {
  const [isRunning, setIsRunning] = useState(false);

  const checkDetection = async () => {
    try {
      const exists = await invoke<boolean>("file_exists", {
        fileName: "object_detection",
      });
      setIsRunning(exists);
    } catch (err) {
      console.error("object_detection check failed:", err);
    }
  };

  useEffect(() => {
    checkDetection();
    const interval = setInterval(checkDetection, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-3xl w-full mx-auto flex flex-col p-4 space-y-4 min-h-64">

      <div
        className={`p-4 rounded-lg border transition-all ${
          isRunning ? "bg-accent/15 border-accent" : "bg-card border-muted"
        }`}
      >
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <p className="font-medium">Object Detection</p>
            <p className="text-sm text-muted-foreground">
              Detects presence and movement in the device area.
            </p>
          </div>

          <Badge
            variant={isRunning ? "default" : "secondary"}
            className="px-3 py-1 text-xs"
          >
            {isRunning ? "Running" : "Stopped"}
          </Badge>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Object detection status updates every 5 seconds.
      </p>
    </div>
  );
}

ObjectDetection.stepTitle = "Object Detection";
