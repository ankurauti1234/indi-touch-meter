// src/steps/AudioFingerprint.tsx
"use client";

import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Badge } from "@/components/ui/badge";

export default function AudioFingerprint() {
  const [isRunning, setIsRunning] = useState(false);

  const checkFingerprint = async () => {
    try {
      const exists = await invoke<boolean>("file_exists", {
        fileName: "audio_fingerprint",
      });
      setIsRunning(exists);
    } catch (err) {
      console.error("audio_fingerprint check failed:", err);
    }
  };

  useEffect(() => {
    checkFingerprint();
    const interval = setInterval(checkFingerprint, 5000);
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
            <p className="font-medium">Audio Fingerprinting</p>
            <p className="text-sm text-muted-foreground">
              Recognizes TV content using audio comparison.
            </p>
          </div>

          <Badge
            variant={isRunning ? "default" : "secondary"}
            className="px-3 py-1 text-xs"
          >
            {isRunning ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Fingerprint service updates every 5 seconds.
      </p>
    </div>
  );
}

AudioFingerprint.stepTitle = "Audio Fingerprint";
