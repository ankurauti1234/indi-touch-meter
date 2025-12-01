// src/steps/InputSource.tsx
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Badge } from "@/components/ui/badge";

export default function InputSource() {
  const [hdmiActive, setHdmiActive] = useState(false);
  const [lineInActive, setLineInActive] = useState(false);

  const checkInputs = async () => {
    try {
      const hdmi = await invoke<boolean>("file_exists", { fileName: "input_hdmi" });
      const lineIn = await invoke<boolean>("file_exists", { fileName: "input_linein" });

      setHdmiActive(hdmi);
      setLineInActive(lineIn);
    } catch (error) {
      console.error("Failed to check input files:", error);
    }
  };

  useEffect(() => {
    checkInputs();
    const interval = setInterval(checkInputs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-3xl w-full mx-auto h-full flex flex-col  space-y-4 justify-between p-4 min-h-64">
      {/* Input List */}
      <div className="space-y-4 h-full flex-1">
        <InputItem
          title="HDMI Input"
          description="Primary audio/video input"
          active={hdmiActive}
        />

        <InputItem
          title="Line In Input"
          description="3.5mm external audio input"
          active={lineInActive}
        />
      </div>

  <p className="text-xs text-muted-foreground text-center">
          The system automatically selects the currently active input source.
        </p>
      {/* Active Source Summary */}
      {/* <div className="p-6 rounded-lg border bg-card text-center space-y-3">
      

        <div className="inline-flex items-center gap-2 px-6 py-3 border rounded-full bg-muted">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 block" />
          <span className="font-medium">
            {activeLabel === "None"
              ? "No active input detected"
              : `${activeLabel} is currently active`}
          </span>
        </div>
      </div> */}
    </div>
  );
}

/* ------------------------------------------------------- */
/* Reusable Item Component                                 */
/* ------------------------------------------------------- */

function InputItem({
  title,
  description,
  active,
}: {
  title: string;
  description: string;
  active: boolean;
}) {
  return (
    <div
      className={`flex justify-between items-center p-4 rounded-lg border transition-all w-full ${
        active
          ? "bg-accent/15 border-accent"
          : "bg-card border-muted"
      }`}
    >
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <Badge
        variant={active ? "default" : "secondary"}
        className="px-3 py-1 text-xs"
      >
        {active ? "Active" : "Inactive"}
      </Badge>
    </div>
  );
}

InputSource.stepTitle = "Input Source";
