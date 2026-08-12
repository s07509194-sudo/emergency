export type AlertLevel = "normal" | "yellow" | "orange" | "red";

export interface WeatherAlert {
  id: "wind" | "rain" | "heat" | "uv";
  title: string;
  level: AlertLevel;
  value: string;
  message: string;
}

function windLevel(speedKmh: number): AlertLevel {
  if (speedKmh >= 60) return "red";
  if (speedKmh >= 50) return "orange";
  if (speedKmh >= 40) return "yellow";
  return "normal";
}

function rainLevel(mm: number): AlertLevel {
  if (mm >= 40) return "red";
  if (mm >= 25) return "orange";
  if (mm >= 10) return "yellow";
  return "normal";
}

function heatLevel(tempC: number): AlertLevel {
  if (tempC >= 48) return "red";
  if (tempC >= 45) return "orange";
  if (tempC >= 42) return "yellow";
  return "normal";
}

function uvLevel(uv: number): AlertLevel {
  if (uv >= 8) return "red";
  if (uv >= 6) return "orange";
  if (uv >= 3) return "yellow";
  return "normal";
}

interface EvaluateParams {
  windSpeed: number;
  precipitation: number;
  todayPrecipSum?: number;
  tempNow: number;
  uvIndex: number;
}

/**
 * الحدود (Thresholds) هنا قيم افتراضية معقولة لمناخ المدينة المنورة،
 * وتقدر تعدلها لاحقًا حسب معايير الأمانة/الأرصاد الرسمية.
 */
export function evaluateWeatherAlerts(params: EvaluateParams): WeatherAlert[] {
  const wind = windLevel(params.windSpeed);
  const rainAmount = params.todayPrecipSum ?? params.precipitation;
  const rain = rainLevel(rainAmount);
  const heat = heatLevel(params.tempNow);
  const uv = uvLevel(params.uvIndex);

  return [
    {
      id: "wind",
      title: "سرعة الرياح",
      level: wind,
      value: `${params.windSpeed} كم/س`,
      message:
        wind === "red"
          ? "رياح شديدة الخطورة، يُنصح بتجنّب الأماكن المفتوحة والمرتفعات"
          : wind === "orange"
          ? "رياح شديدة، تدنٍّ كبير في مدى الرؤية الأفقية"
          : wind === "yellow"
          ? "رياح نشطة، تدنٍّ في مدى الرؤية الأفقية"
          : "سرعة الرياح ضمن المعدل الطبيعي",
    },
    {
      id: "rain",
      title: "الأمطار",
      level: rain,
      value: `${rainAmount} مم`,
      message:
        rain === "red"
          ? "أمطار غزيرة جدًا، احتمال كبير لتكوّن سيول وتجمعات مياه خطيرة"
          : rain === "orange"
          ? "أمطار غزيرة، احتمال تجمعات مياه في المناطق المنخفضة"
          : rain === "yellow"
          ? "أمطار متوسطة، تابع حالة الطرق وشبكات التصريف"
          : "لا توجد أمطار مؤثرة حاليًا",
    },
    {
      id: "heat",
      title: "موجة الحرارة",
      level: heat,
      value: `${params.tempNow}°C`,
      message:
        heat === "red"
          ? "حرارة شديدة الخطورة، تجنّب التعرض المباشر للشمس نهائيًا"
          : heat === "orange"
          ? "حرارة مرتفعة جدًا، يُنصح بتقليل الأنشطة الخارجية وقت الظهيرة"
          : heat === "yellow"
          ? "حرارة مرتفعة، يُنصح بشرب الماء بكثرة"
          : "درجة الحرارة ضمن المعدل الطبيعي",
    },
    {
      id: "uv",
      title: "مؤشر الأشعة",
      level: uv,
      value: `${params.uvIndex}`,
      message:
        uv === "red"
          ? "أشعة شديدة الخطورة، تجنّب التعرض للشمس بدون حماية نهائيًا"
          : uv === "orange"
          ? "أشعة مرتفعة جدًا، استخدم واقي شمس وتجنّب الظهيرة"
          : uv === "yellow"
          ? "أشعة متوسطة، يُنصح باستخدام واقي شمس"
          : "مؤشر الأشعة ضمن المعدل الطبيعي",
    },
  ];
}
