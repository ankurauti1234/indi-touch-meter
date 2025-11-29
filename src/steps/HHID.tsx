// src/steps/HHID.tsx
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Info, Send } from "lucide-react";


interface MqttMessage {
  topic: string;
  payload: string;
  qos: number;
}

export default function HHID() {
  const [hhid, setHhid] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState("");

  const connectMqtt = async () => {
    try {
      setStatus("Connecting...");
      
      const config = {
        endpoint: "a3uoz4wfsx2nz3-ats.iot.ap-south-1.amazonaws.com",
        port: 8883,
        client_id: `indi-touch-meter-${Date.now()}`,
        cert_path: "C:\\Users\\ankur\\Dev\\personal\\frontend\\indi-touch-meter\\certs\\INDIREX-ADMIN.crt",
        key_path: "C:\\Users\\ankur\\Dev\\personal\\frontend\\indi-touch-meter\\certs\\INDIREX-ADMIN.key",
        ca_path: "C:\\Users\\ankur\\Dev\\personal\\frontend\\indi-touch-meter\\certs\\AmazonRootCA1.pem",
        // certPath: "../certs/INDIREX-ADMIN.crt",
        // keyPath: "../certs/INDIREX-ADMIN.key",
        // caPath: "../certs/AmazonRootCA1.pem"
      };

      await invoke("mqtt_connect", { config });
      setIsConnected(true);
      setStatus("Connected to AWS IoT Core");
    } catch (error) {
      setStatus(`Connection failed: ${error}`);
      console.error("MQTT Connection Error:", error);
    }
  };

  const sendHHID = async () => {
    if (!hhid || hhid.length !== 4) {
      setStatus("Please enter a valid 4-digit HHID");
      return;
    }

    if (!isConnected) {
      await connectMqtt();
    }

    try {
      setIsSending(true);
      setStatus("Sending...");

      const message: MqttMessage = {
        topic: "apm/test/rust",
        payload: JSON.stringify({ HHID: hhid }),
        qos: 1
      };

      await invoke("mqtt_publish", { message });
      setStatus(`Successfully sent HHID: ${hhid}`);
    } catch (error) {
      setStatus(`Send failed: ${error}`);
      console.error("MQTT Publish Error:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && hhid.length === 4) {
      sendHHID();
    }
  };

  return (
    <div className="max-w-sm mx-auto">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="hhid">Enter 4-digit Household ID</Label>

          <InputGroup>
            <InputGroupInput
              className="pl-2! text-2xl"
              id="hhid"
              maxLength={4}
              value={hhid}
              onChange={(e) => setHhid(e.target.value.replace(/\D/g, ""))}
              onKeyPress={handleKeyPress}
              placeholder="1001"
              disabled={isSending}
            />
            <InputGroupAddon>
              <InputGroupText className="font-semibold">HH</InputGroupText>
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <Tooltip>
                <TooltipTrigger asChild>
                  <InputGroupButton className="rounded-full" size="icon-xs">
                    <Info />
                  </InputGroupButton>
                </TooltipTrigger>
                <TooltipContent>4 digit HHID assigned to your household.</TooltipContent>
              </Tooltip>
            </InputGroupAddon>
          </InputGroup>
        </div>

        <Button 
          onClick={sendHHID} 
          disabled={hhid.length !== 4 || isSending}
          className="w-full"
        >
          <Send className="mr-2 h-4 w-4" />
          {isSending ? "Sending..." : "Send HHID"}
        </Button>

        {status && (
          <div className={`text-sm p-3 rounded-md ${
            status.includes("Success") || status.includes("Connected") 
              ? "bg-green-50 text-green-700 border border-green-200" 
              : status.includes("failed") || status.includes("Error")
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-blue-50 text-blue-700 border border-blue-200"
          }`}>
            {status}
          </div>
        )}

        {isConnected && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Connected to MQTT</span>
          </div>
        )}
      </div>
    </div>
  );
}