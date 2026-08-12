import { useEffect, useState } from "react";
import { animate } from "framer-motion";

interface CountUpNumberProps {
  value: number;
  duration?: number;
}

export default function CountUpNumber({ value, duration = 1.5 }: CountUpNumberProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate(latest) {
        setDisplay(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [value, duration]);

  return <>{display.toLocaleString()}</>;
}