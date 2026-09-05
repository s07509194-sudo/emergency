import { useEffect, useState } from "react";

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export default function DigitalClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());

  const dateLabel = now.toLocaleDateString("ar-EG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className="
        rounded-2xl p-6 text-center
        bg-gradient-to-br from-teal-950 via-teal-900 to-emerald-900
        shadow-lg border border-white/10
      "
    >
      <div className="flex items-center justify-center gap-1 font-mono font-bold tracking-wider">
        <span className="text-4xl sm:text-5xl text-white">{hours}</span>
        <span className="text-4xl sm:text-5xl text-slate-500">:</span>
        <span className="text-4xl sm:text-5xl text-emerald-300">{minutes}</span>
        <span className="text-4xl sm:text-5xl text-slate-500">:</span>
        <span className="text-4xl sm:text-5xl text-amber-400 animate-pulse">{seconds}</span>
      </div>

      <p className="text-white/70 text-sm mt-3">{dateLabel}</p>
    </div>
  );
}
