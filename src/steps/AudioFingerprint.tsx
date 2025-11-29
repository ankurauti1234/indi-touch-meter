// src/steps/AudioFingerprint.tsx
import { Badge } from "@/components/ui/badge";

export default function AudioFingerprint() {
  return (
    <div className="space-y-6">
    <div className="p-6 border rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Audio Fingerprinting Service</p>
              <p className="text-sm text-muted-foreground">
                Content recognition through audio fingerprint extraction and matching
              </p>
            </div>
            <Badge variant="default">Running</Badge>
          </div>
          <div className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Fingerprinting Status:</span>
              <span className="font-medium">Active</span>
            </div>
            <div className="flex justify-between">
              <span>Sample Rate:</span>
              <span>16 kHz</span>
            </div>
            <div className="flex justify-between">
              <span>Fingerprint Database:</span>
              <span>TV Content Library</span>
            </div>
            <div className="flex justify-between">
              <span>Matching Latency:</span>
              <span>250 ms</span>
            </div>
          </div>
        </div>
    </div>
  );
}