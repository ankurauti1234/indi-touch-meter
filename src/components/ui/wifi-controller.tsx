"use client";

import { useState } from "react";
import {
  WifiOff,
  WifiHigh,
  WifiLow,
  Wifi,
  Lock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface WifiNetwork {
  ssid: string;
  saved?: boolean;
  connected?: boolean;
  strength: number; // 0–100
  secure: boolean;
}

export function WifiController() {
  const [password, setPassword] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState<WifiNetwork | null>(
    null
  );

  // Fake networks for UI only
  const networks: WifiNetwork[] = [
    { ssid: "Home-WiFi", saved: true, connected: true, strength: 88, secure: true },
    { ssid: "Office-AP", saved: true, strength: 74, secure: true },
    { ssid: "Cafe-Free", strength: 52, secure: false },
    { ssid: "NeighborNet", strength: 22, secure: true },
  ];

  // Color based on signal strength
  const getColor = (strength: number) => {
    if (strength >= 75) return "text-green-500";
    if (strength >= 45) return "text-yellow-500";
    if (strength >= 20) return "text-orange-500";
    return "text-red-500";
  };

  // Icon based on strength + color
  const getWifiIcon = (strength: number, className = "h-4 w-4") => {
    const colored = cn(className, getColor(strength));

    if (strength >= 75) return <WifiHigh className={colored} />;
    if (strength >= 45) return <Wifi className={colored} />;
    if (strength >= 20) return <WifiLow className={colored} />;
    return <WifiOff className="h-4 w-4 text-red-500" />;
  };

  const connectedNetwork = networks.find((n) => n.connected);

  return (
    <Dialog>
      {/* ----------- STATUS BAR BUTTON GROUP ------------ */}
      <DialogTrigger asChild>
        <ButtonGroup>
          <Button variant="outline" size="icon">
            {connectedNetwork
              ? getWifiIcon(connectedNetwork.strength)
              : <WifiOff className=" text-red-500" />
            }
          </Button>

          {/* SCROLLING SSID TEXT */}
          <Button variant="outline" className="pointer-events-none w-24 overflow-hidden relative">
            <div className="absolute whitespace-nowrap animate-scroll text-xs text-muted-foreground">
              {connectedNetwork ? connectedNetwork.ssid : "Not Connected"}
            </div>
          </Button>
        </ButtonGroup>
      </DialogTrigger>

      {/* ----------- WIFI DIALOG UI ------------ */}
      <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            Wi-Fi Settings
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 space-y-6 overflow-y-auto">

          {/* Connected Section */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground">
              Connected Network
            </h3>

            {connectedNetwork ? (
              <div className="flex justify-between items-center border p-3 rounded-md">
                <div className="flex items-center gap-2">
                  {getWifiIcon(connectedNetwork.strength)}
                  <span className="font-medium">{connectedNetwork.ssid}</span>
                </div>
                <Button variant="outline" size="sm">Disconnect</Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No connection</p>
            )}
          </div>

          {/* Available Networks */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground">
              Available Networks
            </h3>

            <div className="space-y-2">
              {networks.map((n) => (
                <button
                  key={n.ssid}
                  className="w-full flex justify-between items-center border p-3 rounded-md hover:bg-muted/30 transition text-left"
                  onClick={() => setSelectedNetwork(n)}
                >
                  <div className="flex items-center gap-2">
                    {getWifiIcon(n.strength)}
                    <span>{n.ssid}</span>
                    {n.secure && <Lock className="h-3 w-3 text-muted-foreground" />}
                  </div>

                  {n.connected ? (
                    <span className="text-xs text-primary font-medium">Connected</span>
                  ) : n.saved ? (
                    <span className="text-xs text-muted-foreground">Saved</span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>

          {/* Password + Connect */}
          {selectedNetwork && (
            <div className="border-t pt-4 space-y-3">
              <h3 className="text-sm font-medium">
                Connect to {selectedNetwork.ssid}
              </h3>

              {selectedNetwork.secure && (
                <div className="space-y-1">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    placeholder="Enter Wi-Fi password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              )}

              <Button className="w-full">Connect</Button>
            </div>
          )}
        </div>

        <DialogFooter className="border-t px-6 py-4">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>

      {/* SCROLL ANIMATION */}
      {/* <style>
        {`
          .animate-scroll {
            animation: scroll-text 8s linear infinite;
          }
          @keyframes scroll-text {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}
      </style> */}
    </Dialog>
  );
}
