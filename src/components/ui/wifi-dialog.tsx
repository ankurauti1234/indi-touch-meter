"use client";

import { useState } from "react";
import {
  WifiOff,
  Wifi,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { Keyboard } from "@/components/keyboard";

export interface WifiNetwork {
  ssid: string;
  saved?: boolean;
  connected?: boolean;
  strength: number;
  secure: boolean;
}

interface WifiDialogProps {
  triggerType?: "status" | "button";
}

export function WifiDialog({ triggerType = "status" }: WifiDialogProps) {
  const [password, setPassword] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState<WifiNetwork | null>(null);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const networks: WifiNetwork[] = [
    { ssid: "Home-WiFi", saved: true, connected: true, strength: 88, secure: true },
    { ssid: "Office-AP", saved: true, strength: 74, secure: true },
    { ssid: "Cafe-Free", strength: 52, secure: false },
    { ssid: "NeighborNet", strength: 22, secure: true },
    { ssid: "NeighborNet-2", strength: 22, secure: true },
    { ssid: "NeighborNet-3", strength: 22, secure: true },
  ];

  const connectedNetwork = networks.find((n) => n.connected);

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

  const handleVirtualKeyPress = (key: string) => {
    if (key === "Backspace") {
      setPassword((prev) => prev.slice(0, -1));
      return;
    }

    if (key === "Enter" && selectedNetwork) {
      console.log("Attempting connection…");
      return;
    }

    if (key.length === 1) {
      setPassword((prev) => prev + key);
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          {triggerType === "status" ? (
            <ButtonGroup>
              <Button variant="outline" size="icon">
                {connectedNetwork
                  ? getWifiIcon(connectedNetwork.strength)
                  : <WifiOff className="text-red-500" />}
              </Button>

              <Button variant="outline" className="pointer-events-none w-24 overflow-hidden relative">
                <div className="absolute whitespace-nowrap text-xs text-muted-foreground">
                  {connectedNetwork ? connectedNetwork.ssid : "Not Connected"}
                </div>
              </Button>
            </ButtonGroup>
          ) : (
            <Button className="w-full">Configure WiFi Network</Button>
          )}
        </DialogTrigger>

        <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg [&>button:last-child]:top-3.5">
          <DialogHeader className="contents space-y-0 text-left">
            <DialogTitle className="border-b px-6 py-4 text-base">
              Wi-Fi Settings
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-2 overflow-y-auto">

            {/* Connected section */}
            <div className="space-y-2 p-4">
              <h3 className="font-medium text-sm text-muted-foreground">Connected Network</h3>

              {connectedNetwork ? (
                <div className="flex justify-between items-center border p-3 rounded-md bg-secondary">
                  <div className="flex items-center gap-2">
                    {getWifiIcon(connectedNetwork.strength)}
                    <span className="font-medium">{connectedNetwork.ssid}</span>
                  </div>
                  <Button variant="outline" size="sm" className="hover:bg-destructive">Disconnect</Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No connection</p>
              )}
            </div>

            {/* Available networks */}
            <div className=" p-4 pt-0">
              <h3 className="font-medium text-sm text-muted-foreground border border-b-0 rounded-t-lg p-2">
                Available Networks
              </h3>

              <div className="space-y-2 max-h-96 overflow-y-auto border p-2 rounded-b-lg">
                {networks.map((n, idx) => (
                  <div key={`${n.ssid}-${idx}`} className="border rounded-md overflow-hidden">
                    <button
                      className="w-full flex justify-between items-center p-3 hover:bg-muted/30 transition text-left"
                      onClick={() => {
                        setSelectedNetwork(n);
                        setIsKeyboardOpen(false);
                        setPassword("");
                      }}
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

                    {/* Expanded network settings */}
                    {selectedNetwork?.ssid === n.ssid && !n.connected && (
                      <div className="border-t bg-muted/20 p-3 space-y-3">

                        {n.secure && (
                          <div className="space-y-1">
                            <Label>Password</Label>

                            {/* Password with Show/Hide Eye toggle */}
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter Wi-Fi password"
                                value={password}
                                onFocus={() => setIsKeyboardOpen(true)}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pr-10"
                              />

                              <button
                                type="button"
                                onClick={() => setShowPassword((p) => !p)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end">
                          <Button
                            onClick={() => {
                              console.log(`Connect to ${n.ssid} with password: ${password}`);
                            }}
                          >
                            Connect
                          </Button>
                        </div>

                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Virtual keyboard with all props */}
      <Keyboard
        isOpen={isKeyboardOpen}
        onClose={() => setIsKeyboardOpen(false)}
        onKeyPress={handleVirtualKeyPress}
        targetInput="wifi-password"
        inputValue={password}
        inputPlaceholder="Enter Wi-Fi password"
        inputLabel={selectedNetwork ? `Password for "${selectedNetwork.ssid}"` : "Wi-Fi Password"}
        inputType={showPassword ? "text" : "password"}
      />
    </>
  );
}