// src/steps/Summary.tsx
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function Summary() {
  const [deviceId, setDeviceId] = useState("Loading...");
  const [hhid, setHhid] = useState("Not set");
  const [, setIsVerified] = useState(false);

  const [networkType, setNetworkType] = useState<"wifi" | "gsm" | "none">("none");
  const [networkConnected, setNetworkConnected] = useState(false);

  const [tvOn, setTvOn] = useState(false);
  const [hdmiActive, setHdmiActive] = useState(false);
  const [objectDetection, setObjectDetection] = useState(false);
  const [audioFingerprint, setAudioFingerprint] = useState(false);

  const loadStatus = async () => {
    try {
      setDeviceId(await invoke("read_device_id"));

      try {
        const household: string = await invoke("read_hhid");
        setHhid(household);
        setIsVerified(true);
      } catch {
        setHhid("Not verified");
        setIsVerified(false);
      }

      const wifi = await invoke("file_exists", { fileName: "network_wifi" });
      const gsm = await invoke("file_exists", { fileName: "network_gsm" });

      if (wifi) {
        setNetworkType("wifi");
        setNetworkConnected(true);
      } else if (gsm) {
        setNetworkType("gsm");
        setNetworkConnected(true);
      } else {
        setNetworkType("none");
        setNetworkConnected(false);
      }

      setTvOn(await invoke("file_exists", { fileName: "tv_on" }));
      setHdmiActive(await invoke("file_exists", { fileName: "input_hdmi" }));
      setObjectDetection(await invoke("file_exists", { fileName: "object_detection" }));
      setAudioFingerprint(await invoke("file_exists", { fileName: "audio_fingerprint" }));
    } catch (err) {
      console.error("Summary load error:", err);
    }
  };

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
  <div className="flex items-center justify-center p-4 min-h-64  w-full max-w-3xl mx-auto gap-12">

        {/* LEFT */}
        <div className="space-y-6 w-full">
          <MiniSection title="Device">
            <Row label="Device ID" value={deviceId} />
            <Row label="Household ID" value={hhid} />
          </MiniSection>

          <MiniSection title="Network">
            <Row label="Type" value={networkType === "none" ? "None" : networkType.toUpperCase()} />
            <Row
              label="Status"
              value={
                <Badge variant={networkConnected ? "default" : "secondary"} className="text-xs py-0 px-2">
                  {networkConnected ? "Connected" : "Not Connected"}
                </Badge>
              }
            />
          </MiniSection>
        </div>

        {/* RIGHT */}
        <div className="space-y-6 w-full">
          <MiniSection title="TV & Input">
            <Row label="TV Power" value={tvOn ? "On" : "Off"} />
            <Row label="Input" value={hdmiActive ? "HDMI" : "None"} />
          </MiniSection>

          <MiniSection title="Detection">
            <Row label="Object Detection" value={objectDetection ? "Running" : "Stopped"} />
            <Row label="Audio Fingerprint" value={audioFingerprint ? "Active" : "Inactive"} />
          </MiniSection>
        </div>
      </div>
  );
}

/* ---------------------------------------------------------------- */
/* Super-Compact Mini Section                                       */
/* ---------------------------------------------------------------- */
function MiniSection({ title, children }: { title: string; children: any }) {
  return (
    <div className="space-y-1">
      <h3 className="text-xs font-medium uppercase tracking-wide">
        {title}
      </h3>
      <Separator className="opacity-50 mb-2" />

      <div className="space-y-1">{children}</div>

    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Compact Row                                                      */
/* ---------------------------------------------------------------- */
function Row({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between items-center text-xs py-0.5">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}


Summary.stepTitle = "Summary";
