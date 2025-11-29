    // src/steps/Network.tsx
    "use client";

    import { useState, useId } from "react";
    import { Badge } from "@/components/ui/badge";

    import { Label } from "@/components/ui/label";
    import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

    import { Wifi, SignalHigh } from "lucide-react";
    import { WifiDialog } from "@/components/ui/wifi-dialog";

    export default function Network() {
    const [networkType, setNetworkType] = useState<"wifi" | "gsm">("wifi");
    const id = useId();

    return (
    <div className="space-y-6">

            {/* Radio Group with Icons */}
            <RadioGroup
            className="gap-3"
            value={networkType}
            onValueChange={(val: "wifi" | "gsm") => setNetworkType(val)}
            >
            {/* WiFi Option */}
            <div className="relative flex items-start gap-3 rounded-md border border-input p-4 shadow-xs outline-none has-data-[state=checked]:border-primary/60">
                <RadioGroupItem
                id={`${id}-wifi`}
                value="wifi"
                className="order-1 after:absolute after:inset-0"
                />

                <div className="flex items-center gap-4 grow">
                <Wifi className="h-6 w-6 text-primary" />

                <div className="grid grow gap-1">
                    <Label htmlFor={`${id}-wifi`} className="font-medium">
                    WiFi
                    </Label>
                    <p className="text-muted-foreground text-xs">
                    Scan and connect to wireless networks
                    </p>
                </div>
                </div>
            </div>

            {/* GSM Option */}
            <div className="relative flex items-start gap-3 rounded-md border border-input p-4 shadow-xs outline-none has-data-[state=checked]:border-primary/60">
                <RadioGroupItem
                id={`${id}-gsm`}
                value="gsm"
                className="order-1 after:absolute after:inset-0"
                />

                <div className="flex items-center gap-4 grow">
                <SignalHigh className="h-6 w-6 text-primary" />

                <div className="grid grow gap-1">
                    <Label htmlFor={`${id}-gsm`} className="font-medium">
                    GSM
                    </Label>
                    <p className="text-muted-foreground text-xs">
                    Use mobile data via SIM card
                    </p>
                </div>
                </div>
            </div>
            </RadioGroup>

            {/* WiFi Section */}
            {networkType === "wifi" && (
            <WifiDialog triggerType="button"/>
            )}

            {/* GSM Section */}
            {networkType === "gsm" && (
            <div className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                <div>
                    <p className="font-medium">GSM Connection</p>
                    <p className="text-sm text-muted-foreground">Carrier: Airtel</p>
                </div>
                <Badge variant="default">Connected</Badge>
                </div>

                <div className="mt-2 space-y-1 text-sm">
                <p>Signal Strength: 95%</p>
                <p>Data Status: Active</p>
                </div>
            </div>
            )}
        </div>
    );
    }
