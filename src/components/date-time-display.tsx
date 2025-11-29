import { useState, useEffect } from "react";

export const DateTimeDisplay = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = time.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedTime = time.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <div className="text-sm text-muted-foreground font-medium font-mono flex flex-col items-end leading-tight">
      <span>
        {formattedTime}
      </span>
      <span>
        {formattedDate}
      </span>
    </div>
  );
};
