"use client";

import { useState } from "react";
import {
  WifiOff,
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

export interface WifiNetwork {
  ssid: string;
  saved?: boolean;
  connected?: boolean;
  strength: number;
  secure: boolean;
}

interface WifiDialogProps {
  /** Choose how dialog opens */
  triggerType?: "status" | "button";
}

export function WifiDialog({ triggerType = "status" }: WifiDialogProps) {
  const [password, setPassword] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState<WifiNetwork | null>(null);

  const networks: WifiNetwork[] = [
    { ssid: "Home-WiFi", saved: true, connected: true, strength: 88, secure: true },
    { ssid: "Office-AP", saved: true, strength: 74, secure: true },
    { ssid: "Cafe-Free", strength: 52, secure: false },
    { ssid: "NeighborNet", strength: 22, secure: true },
  ];

  const connectedNetwork = networks.find((n) => n.connected);

  // Color based on strength
  const getColor = (strength: number) => {
    if (strength >= 75) return "text-green-500";
    if (strength >= 45) return "text-yellow-500";
    if (strength >= 20) return "text-orange-500";
    return "text-red-500";
  };

  const getWifiIcon = (strength: number, className = "h-4 w-4") => {
    const colored = cn(className, getColor(strength));
    if (strength >= 20) return <Wifi className={colored} />;
    return <WifiOff className="h-4 w-4 text-red-500" />;
  };

  return (
    <Dialog>
      {/* ------------------ TRIGGER UI ------------------ */}
      <DialogTrigger asChild>
        {triggerType === "status" ? (
          // --- STATUS BAR BUTTON GROUP ---
          <ButtonGroup>
            <Button variant="outline" size="icon">
              {connectedNetwork
                ? getWifiIcon(connectedNetwork.strength)
                : <WifiOff className="text-red-500" />
              }
            </Button>

            <Button variant="outline" className="pointer-events-none w-24 overflow-hidden relative">
              <div className="absolute whitespace-nowrap text-xs text-muted-foreground">
                {connectedNetwork ? connectedNetwork.ssid : "Not Connected"}
              </div>
            </Button>
          </ButtonGroup>
        ) : (
          // --- SIMPLE CONFIGURE BUTTON ---
          <Button className="w-full">
            Configure WiFi Network
          </Button>
        )}
      </DialogTrigger>

      {/* ------------------ DIALOG CONTENT ------------------ */}
      <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            Wi-Fi Settings
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 space-y-6 overflow-y-auto">

          {/* --- Connected network --- */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground">Connected Network</h3>

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

          {/* --- Available Networks --- */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground">Available Networks</h3>

            <div className="space-y-2">
              {networks.map((n) => (
                <div
                  key={n.ssid}
                  className="border rounded-md overflow-hidden"
                >
                  <button
                    className="w-full flex justify-between items-center p-3 hover:bg-muted/30 transition text-left"
                    onClick={() => setSelectedNetwork(selectedNetwork?.ssid === n.ssid ? null : n)}
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

                  {/* --- Expanded password entry area --- */}
                  {selectedNetwork?.ssid === n.ssid && !n.connected && (
                    <div className="border-t bg-muted/20 p-3 space-y-3">
                      {n.secure && (
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

                      <Button 
                        className="w-full"
                        onClick={() => {
                          // Handle connection logic here
                          console.log(`Connecting to ${n.ssid}`);
                        }}
                      >
                        Connect
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        <DialogFooter className="border-t px-6 py-4">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}