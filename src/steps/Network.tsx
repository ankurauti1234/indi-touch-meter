"use client";

import { useState, useId, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Wifi, SignalHigh, Loader2 } from "lucide-react";
import { WifiDialog } from "@/components/ui/wifi-dialog";

import { invoke } from "@tauri-apps/api/core";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";   // <-- NEW

export default function Network() {
  const [networkType, setNetworkType] = useState<"wifi" | "gsm">("wifi");

  const [wifiConnected, setWifiConnected] = useState(false);
  const [gsmConnected, setGsmConnected] = useState(false);

  const [testing, setTesting] = useState(false);

  const id = useId();

  // Core check
  const checkNetwork = async () => {
    try {
      if (networkType === "wifi") {
        const exists: boolean = await invoke("file_exists", { fileName: "network_wifi" });
        setWifiConnected(exists);
        return exists;
      } else {
        const exists: boolean = await invoke("file_exists", { fileName: "network_gsm" });
        setGsmConnected(exists);
        return exists;
      }
    } catch (e) {
      console.error("Network check failed:", e);
      return false;
    }
  };

  // TEST Button logic with Sonner toast
  const testConnection = async () => {
    setTesting(true);

    try {
      await new Promise((res) => setTimeout(res, 1500)); // just to show spinner
      const passed = await checkNetwork();

      if (passed) {
        toast.success(
          networkType === "wifi"
            ? "WiFi network test passed!"
            : "GSM network test passed!"
        );
      } else {
        toast.error(
          networkType === "wifi"
            ? "WiFi network test failed!"
            : "GSM network test failed!"
        );
      }
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    checkNetwork();
    const i = setInterval(checkNetwork, 5000);
    return () => clearInterval(i);
  }, [networkType]);

  return (
    <div className="flex justify-center w-full items-start gap-4">

      {/* LEFT SIDE */}
  <RadioGroup
        className="gap-3 flex-1 w-full p-2"
        value={networkType}
        onValueChange={(val: "wifi" | "gsm") => setNetworkType(val)}
      >
        {/* WiFi Option */}
        <div className="relative flex items-start gap-3 rounded-md border p-4 shadow-xs has-data-[state=checked]:border-primary/60">
          <RadioGroupItem id={`${id}-wifi`} value="wifi" className="order-1 after:absolute after:inset-0" />

          <div className="flex items-center gap-4 grow">
            <Wifi className="h-6 w-6 text-primary" />

            <div className="grid grow gap-1">
              <Label htmlFor={`${id}-wifi`} className="font-medium">WiFi</Label>
              <p className="text-muted-foreground text-xs">
                Scan and connect to wireless networks
              </p>
            </div>
          </div>
        </div>

        {/* GSM Option */}
        <div className="relative flex items-start gap-3 rounded-md border p-4 shadow-xs has-data-[state=checked]:border-primary/60">
          <RadioGroupItem id={`${id}-gsm`} value="gsm" className="order-1 after:absolute after:inset-0" />

          <div className="flex items-center gap-4 grow">
            <SignalHigh className="h-6 w-6 text-primary" />

            <div className="grid grow gap-1">
              <Label htmlFor={`${id}-gsm`} className="font-medium">GSM</Label>
              <p className="text-muted-foreground text-xs">
                Use mobile data via SIM card
              </p>
            </div>
          </div>
        </div>
      </RadioGroup>

      {/* RIGHT SIDE */}
      <div className="bg-secondary w-full flex-1 p-2 h-64 rounded-l-lg shadow-inner">
        {networkType === "wifi" && (
          <div className="flex flex-col justify-between h-full">
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">WiFi Status</p>
                  <p className="text-sm text-muted-foreground">network_wifi file check</p>
                </div>

                <Badge variant={wifiConnected ? "default" : "secondary"}>
                  {wifiConnected ? "Connected" : "Not Connected"}
                </Badge>
              </div>
            </div>

            <div className="flex justify-center flex-col gap-2 p-2">
              <WifiDialog triggerType="button" />

              <Button
                variant="outline"
                className="w-full"
                onClick={testConnection}
                disabled={testing}
              >
                {testing ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Testing…
                  </div>
                ) : (
                  "Test Network Connection"
                )}
              </Button>
            </div>
          </div>
        )}

        {/* GSM */}
        {networkType === "gsm" && (
          <div className="flex flex-col justify-between h-full">
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">GSM Status</p>
                  <p className="text-sm text-muted-foreground">network_gsm file check</p>
                </div>

                <Badge variant={gsmConnected ? "default" : "secondary"}>
                  {gsmConnected ? "Connected" : "Not Connected"}
                </Badge>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full p-2"
              onClick={testConnection}
              disabled={testing}
            >
              {testing ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Testing…
                </div>
              ) : (
                "Test Network Connection"
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

Network.stepTitle = "Network Setup";