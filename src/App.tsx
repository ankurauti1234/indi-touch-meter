
import { useEffect, useState, useRef } from "react";
import "./App.css";

import Welcome from "./steps/Welcome";
import Network from "./steps/Network";
import DeviceId from "./steps/DeviceId";
import HHID from "./steps/HHID";
import OTP from "./steps/OTP";
import TVStatus from "./steps/TVStatus";
import InputSource from "./steps/InputSource";
import ObjectDetection from "./steps/ObjectDetection";
import Summary from "./steps/Summary";
import Members from "./steps/Members";
import AudioFingerprint from "./steps/AudioFingerprint";

import { MultiStepWizard } from "./components/ui/MultiStepWizard";
import { ThemeProvider } from "./components/ui/theme-provider";
import { ScreenSaver } from "./components/screen-saver";

function App() {
  const [idle, setIdle] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    setIdle(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => setIdle(true), 60000); // 10 sec
  };

  useEffect(() => {
    resetTimer();

    const events = [
      "mousedown",
      "touchstart",
      "keypress",
    ];

    events.forEach((evt) => window.addEventListener(evt, resetTimer));

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, resetTimer));
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="circuit-background relative">
        <MultiStepWizard>
          <Welcome />
          <Network />
          <DeviceId />
          <HHID />
          <OTP />
          <TVStatus />
          <InputSource />
          <ObjectDetection />
          <AudioFingerprint />
          <Summary />
          <Members />
        </MultiStepWizard>

        {/* Screen Saver */}
        <ScreenSaver idle={idle} setIdle={setIdle} />
      </div>
    </ThemeProvider>
  );
}

export default App;
