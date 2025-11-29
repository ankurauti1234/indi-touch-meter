// src/steps/Welcome.tsx
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Welcome() {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <CardHeader>
        <CardTitle className="text-4xl font-bold">Welcome to Indi Touch Meter Setup</CardTitle>
        <CardDescription>
          Follow the steps below to configure your device and complete the setup process.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          This setup wizard will guide you through network configuration, device identification,
          verification, and member setup.
        </p>
      </CardContent>
    </div>
  );
}