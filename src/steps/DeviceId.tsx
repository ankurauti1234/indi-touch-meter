"use client";

import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

export default function DeviceId() {
  const [deviceId, setDeviceId] = useState<string>("Loading...");

  useEffect(() => {
    invoke<string>("read_device_id")
      .then((id) => setDeviceId(id))
      .catch((_err) => setDeviceId("Error reading device ID"));
  }, []);

  return (
    <div className="max-w-md mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-2xl font-mono bg-muted p-4 rounded-lg">
            Device ID: {deviceId}
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            This is the unique identifier for this device. It is automatically generated and cannot be changed.
          </p>
        </div>
      </div>
    </div>
  );
}
