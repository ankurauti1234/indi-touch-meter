"use client";

import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Keyboard } from "@/components/keyboard";

export default function HHID() {
  const [hhid, setHhid] = useState("");
  const [meterId, setMeterId] = useState("");
  const [status, setStatus] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    invoke<string>("read_device_id")
      .then(setMeterId)
      .catch(() => setStatus("Failed to load device ID"));
  }, []);

  const handleVirtualKey = (key: string) => {
    if (key === "Backspace") return setHhid((prev) => prev.slice(0, -1));
    if (/^\d$/.test(key) && hhid.length < 4) return setHhid(hhid + key);
    if (key === "Enter" && hhid.length === 4) return handleSend();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && hhid.length === 4) handleSend();
  };

  const handleSend = async () => {
    if (hhid.length !== 4 || !meterId) return;
    try {
      setIsSending(true);
      setStatus("Sending...");
      const response = await invoke<string>("initiate_assignment", {
        meterId,
        hhid,
      });
      setStatus(response);
    } catch (err: any) {
      setStatus(`Failed: ${err}`);
    } finally {
      setIsSending(false);
    }
  };

  const statusGood =
    status.toLowerCase().includes("success") ||
    status.toLowerCase().includes("sent") ||
    status.toLowerCase().includes("assigned");

  return (
    <div className="max-w-3xl w-full mx-auto flex flex-col p-4 space-y-4 min-h-64">

      {/* Input Card */}
      <div
        className={`p-4 rounded-lg border transition-all ${
          hhid.length === 4
            ? "bg-accent/15 border-accent"
            : "bg-card border-muted"
        }`}
      >
        <div className="space-y-3">
          <Label className="text-sm">Enter your Household ID</Label>

          {/* Input with HH prefix */}
          <div className="flex items-center ">
            <div className="px-3 h-14 flex items-center justify-center rounded-md bg-border text-muted-foreground font-semibold text-2xl">
              HH
            </div>

            <input
              inputMode="numeric"
              maxLength={4}
              className="
                flex-1 text-start text-2xl font-mono
                bg-muted rounded-md px-4 py-3
                focus:outline-none
              "
              placeholder="0000"
              value={hhid}
              disabled={isSending}
              onFocus={() => setIsKeyboardOpen(true)}
              onChange={(e) =>
                setHhid(e.target.value.replace(/\D/g, "").slice(0, 4))
              }
              onKeyDown={handleKeyPress}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            Enter the 4-digit household identifier assigned to you.
          </p>
        </div>
      </div>

      {/* Button */}
      <Button
        className="w-full py-3"
        disabled={hhid.length !== 4 || isSending}
        onClick={handleSend}
      >
        {isSending ? "Sending..." : "Submit Household ID"}
      </Button>

      {/* Status */}
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

      {/* Virtual Keyboard */}
      <Keyboard
        isOpen={isKeyboardOpen}
        onClose={() => setIsKeyboardOpen(false)}
        onKeyPress={handleVirtualKey}
        targetInput="hhid"
        inputValue={hhid}
        inputPlaceholder="0000"
        inputLabel="Enter your Household ID"
        inputMaxLength={4}
        inputType="numeric"
        inputPrefix="HH"
      />
    </div>
  );
}

HHID.stepTitle = "Household ID";
