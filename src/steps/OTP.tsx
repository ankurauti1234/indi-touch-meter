// src/steps/OTP.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function OTP() {
  const [otp] = useState("");

  return (
    <div className="max-w-sm mx-auto">
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <Label>Enter the 6-digit verification code.</Label>
          {/* <Input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="123456"
            className="text-center text-3xl tracking-widest"
          /> */}

          <InputOTP maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          <Button className="w-full" disabled={otp.length !== 6}>
            Verify OTP
          </Button>
        </div>
      </div>
    </div>
  );
}
