// src/steps/OTP.tsx
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { Keyboard } from "@/components/keyboard";

export default function OTP() {
  const [otp, setOtp] = useState("");
  const [meterId, setMeterId] = useState("");
  const [hhid, setHhid] = useState("");
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    invoke<string>("read_device_id").then(setMeterId).catch(() => {});
    invoke<string>("read_hhid").then(setHhid).catch(() => {});
  }, []);

  const handleVirtualKeyPress = (key: string) => {
    if (key === "Backspace") return setOtp((prev) => prev.slice(0, -1));
    if (/^\d$/.test(key) && otp.length < 4) return setOtp((prev) => prev + key);
    if (key === "Enter" && otp.length === 4) handleSubmit();
  };

  const handleSubmit = async () => {
    if (!meterId || !hhid) return setStatus("Missing meter ID or HHID");

    try {
      setIsVerifying(true);
      setStatus("Verifying...");
      const response = await invoke<string>("verify_otp", { meterId, hhid, otp });
      setStatus(response);
    } catch (err: any) {
      setStatus(`Failed: ${err}`);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRetry = async () => {
    if (!meterId || !hhid) return setStatus("Missing meter ID or HHID");
    try {
      setStatus("Resending OTP...");
      const response = await invoke<string>("retry_otp", { meterId, hhid });
      setStatus(response);
    } catch (err: any) {
      setStatus(`Retry failed: ${err}`);
    }
  };

  const statusGood =
    status.toLowerCase().includes("success") ||
    status.toLowerCase().includes("sent") ||
    status.toLowerCase().includes("verified");

  return (
    <div className="max-w-3xl w-full mx-auto flex flex-col p-4 space-y-4 min-h-64">

      {/* OTP Card */}
      <div
        className={`p-4 rounded-lg border transition-all ${
          otp.length === 4
            ? "bg-accent/15 border-accent"
            : "bg-card border-muted"
        }`}
      >
        <div className="space-y-4 text-center">
          <Label className="text-sm">
            Enter the 4-digit verification code
          </Label>

          <div
            onClick={() => setIsKeyboardOpen(true)}
            className="inline-block cursor-pointer"
          >
            <InputOTP
              maxLength={4}
              value={otp}
              onChange={(value) => setOtp(value.replace(/\D/g, ""))}
              disabled={isVerifying}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
          </div>

         <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            onClick={handleRetry}
            disabled={isVerifying}
          >
            Resend OTP
          </Button>
           <Button
            disabled={otp.length !== 4 || isVerifying}
            onClick={handleSubmit}
          >
            {isVerifying ? "Verifying..." : "Verify OTP"}
          </Button>
         </div>
        </div>
      </div>

      {/* Status Card */}
      {status && (
        <div
          className={`p-3 rounded-lg text-sm border ${
            statusGood
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {status}
        </div>
      )}

      {/* Hint */}
      <p className="text-xs text-muted-foreground text-center">
        The OTP is validated against the registered household details.
      </p>

      {/* Keyboard with all props */}
      <Keyboard
        isOpen={isKeyboardOpen}
        onClose={() => setIsKeyboardOpen(false)}
        onKeyPress={handleVirtualKeyPress}
        targetInput="otp"
        inputValue={otp}
        inputPlaceholder="0000"
        inputLabel="Enter the 4-digit verification code"
        inputMaxLength={4}
        inputType="numeric"
      />
    </div>
  );
}

OTP.stepTitle = "OTP Verification";
