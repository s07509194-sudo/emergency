import { motion } from "framer-motion";
import { getWeatherCategory } from "../utils/weatherCodes";

interface AnimatedWeatherIconProps {
  code: number;
  size?: number;
}

const CLOUD_PATH =
  "M18 44c-6 0-11-5-11-11 0-5.5 4-10 9.3-10.8C18 15.7 24 11 31 11c7.6 0 14 5.6 15 13 5 .8 8.8 5.1 8.8 10.2 0 6-4.9 9.8-10.9 9.8H18z";

function Sun({ small = false }: { small?: boolean }) {
  const cx = 32;
  const cy = small ? 26 : 32;
  const r = small ? 9 : 14;

  return (
    <g>
      <motion.g
        style={{ transformOrigin: `${cx}px ${cy}px` }}
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <rect
            key={i}
            x={cx - 2}
            y={cy - r - 9}
            width="4"
            height="8"
            rx="2"
            fill="#f59e0b"
            transform={`rotate(${i * 45} ${cx} ${cy})`}
          />
        ))}
      </motion.g>
      <motion.circle
        cx={cx}
        cy={cy}
        r={r}
        fill="#fbbf24"
        style={{ transformOrigin: `${cx}px ${cy}px` }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
    </g>
  );
}

function Cloud({ color = "#94a3b8" }: { color?: string }) {
  return (
    <motion.path
      d={CLOUD_PATH}
      fill={color}
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function Drops({ count = 3, color = "#38bdf8" }: { count?: number; color?: string }) {
  const xs = [18, 30, 42].slice(0, count);
  return (
    <>
      {xs.map((x, i) => (
        <motion.g
          key={x}
          animate={{ y: [0, 12], opacity: [1, 0] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.25,
            ease: "easeIn",
          }}
        >
          <line x1={x} y1="46" x2={x - 3} y2="55" stroke={color} strokeWidth="3" strokeLinecap="round" />
        </motion.g>
      ))}
    </>
  );
}

function Snowflakes() {
  const xs = [18, 30, 42];
  return (
    <>
      {xs.map((x, i) => (
        <motion.circle
          key={x}
          cx={x}
          cy="48"
          r="2.2"
          fill="#e2e8f0"
          animate={{ y: [0, 12, 0], opacity: [1, 0.4, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
        />
      ))}
    </>
  );
}

function Lightning() {
  return (
    <motion.path
      d="M31 44l-6 11h6l-4 9 11-15h-6l5-5z"
      fill="#facc15"
      animate={{ opacity: [0, 1, 0] }}
      transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1 }}
    />
  );
}

function Fog() {
  const ys = [40, 47, 54];
  return (
    <>
      <path d={CLOUD_PATH} fill="#cbd5e1" opacity={0.6} />
      {ys.map((y, i) => (
        <motion.line
          key={y}
          x1="10"
          y1={y}
          x2="54"
          y2={y}
          stroke="#94a3b8"
          strokeWidth="3"
          strokeLinecap="round"
          animate={{ x: [-4, 4, -4] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.35, ease: "easeInOut" }}
        />
      ))}
    </>
  );
}

export default function AnimatedWeatherIcon({ code, size = 48 }: AnimatedWeatherIconProps) {
  const category = getWeatherCategory(code);

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {category === "clear" && <Sun />}

      {category === "partly-cloudy" && (
        <>
          <Sun small />
          <Cloud color="#cbd5e1" />
        </>
      )}

      {category === "cloudy" && <Cloud />}

      {category === "fog" && <Fog />}

      {category === "drizzle" && (
        <>
          <Cloud />
          <Drops count={2} color="#7dd3fc" />
        </>
      )}

      {category === "rain" && (
        <>
          <Cloud color="#64748b" />
          <Drops count={3} />
        </>
      )}

      {category === "snow" && (
        <>
          <Cloud />
          <Snowflakes />
        </>
      )}

      {category === "storm" && (
        <>
          <Cloud color="#475569" />
          <Lightning />
        </>
      )}
    </svg>
  );
}
