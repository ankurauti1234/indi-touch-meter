"use client";

import { useStep } from "@/components/ui/MultiStepWizard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function Welcome() {
  const { goNext } = useStep(); // next step trigger

  const requirements = [
    "Device is connected to power source",
    "Device is connected to TV via HDMI/Line-In",
    "WiFi credentials or SIM card available",
    "Household ID from registration",
  ];

  return (
    <div className="max-w-3xl mx-auto w-full h-full space-y-8  flex flex-col justify-center">
      {/* Header Section */}
      <div className="text-center space-y-4 flex flex-col items-center">

              <img
      src="logo.png"
      className="size-24"
      />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Indi Touch Meter Setup
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Welcome to the guided installation wizard. We'll help you configure
            your device, connect to the network, and complete activation in just
            a few steps.
          </p>
        </div>
      </div>

      {/* Requirements Checklist */}
      {/* <Card className="border-2 border-muted p-0 gap-0">
        <CardContent className="p-6">
          <div className="space-y-4">
            <h2 className="text-sm font-semibold">Before You Begin</h2>

            <div className="space-y-3">
              {requirements.map((requirement, index) => (
                <div key={index} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{requirement}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* Start Button */}
      <div className=" flex justify-center">
        <Button className="w-96 py-3" onClick={goNext}>
          Start Installation
        </Button>
      </div>

      {/* Footer Text */}
      <p className="text-xs text-muted-foreground text-center pt-2">
        You can't exit the setup until all steps are completed.
      </p>
    </div>
  );
}
