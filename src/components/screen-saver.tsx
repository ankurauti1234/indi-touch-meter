import { useEffect, useState } from "react";

export function ScreenSaver({
  idle,
  setIdle,
}: {
  idle: boolean;
  setIdle: (v: boolean) => void;
}) {
  const [time, setTime] = useState(new Date());
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const i = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  // When idle becomes true → reset closing state
  useEffect(() => {
    if (idle) setClosing(false);
  }, [idle]);

  if (!idle && !closing) return null;

  const formattedTime = time.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedDate = time.toLocaleDateString("en-IN", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setIdle(false);
    }, 2000); // match animation duration (0.6s)
  };

  return (
    <div
      className={`
        fixed inset-0 bg-black flex flex-col items-center justify-center z-9999
        ${closing ? "screensaver-animate-out" : "screensaver-animate-in"}
      `}
      onClick={handleClose}
    >
      <div className="absolute inset-0 bg-gradient-radial from-gray-700/10 via-transparent to-transparent opacity-40"></div>
      <div className="relative z-10 text-center select-none">
        <h1 className="text-white text-8xl font-light tracking-wider tabular-nums mb-4">
          {formattedTime}
        </h1>
        <div className="w-40 h-px mx-auto my-6 bg-white/20"></div>
        <p className="text-white/60 text-2xl font-light tracking-wide">
          {formattedDate}
        </p>
      </div>
      <div className="absolute bottom-10 text-white/20 text-sm">
        Tap anywhere to exit
      </div>
    </div>
  );
}
