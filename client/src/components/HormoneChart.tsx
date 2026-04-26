import { useMemo } from "react";

interface HormoneChartProps {
  cycleDay: number | null;
  cycleLength?: number;
}

// Generate a smooth SVG path from a set of [x, y] control points using cubic bezier
function smoothPath(points: [number, number][]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx = (prev[0] + curr[0]) / 2;
    d += ` C ${cpx} ${prev[1]}, ${cpx} ${curr[1]}, ${curr[0]} ${curr[1]}`;
  }
  return d;
}

export default function HormoneChart({ cycleDay, cycleLength = 28 }: HormoneChartProps) {
  const W = 320;
  const H = 120;
  const PAD_X = 8;
  const PAD_Y = 10;
  const chartW = W - PAD_X * 2;
  const chartH = H - PAD_Y * 2;

  // Map a cycle day (1-based) to an x pixel position
  const dayToX = (day: number) => PAD_X + ((day - 1) / (cycleLength - 1)) * chartW;

  // Map a 0-1 value to a y pixel position (0 = top, 1 = bottom)
  const valToY = (v: number) => PAD_Y + (1 - v) * chartH;

  // Hormone curves — approximate shapes across a 28-day cycle
  // Each array is [day, 0-1 value] control points
  const estrogenPoints = useMemo((): [number, number][] => {
    const days = cycleLength;
    const scale = days / 28;
    return [
      [1, 0.15],
      [Math.round(5 * scale), 0.2],
      [Math.round(10 * scale), 0.55],
      [Math.round(13 * scale), 0.95],  // pre-ovulation peak
      [Math.round(15 * scale), 0.5],
      [Math.round(20 * scale), 0.55],  // secondary luteal rise
      [Math.round(24 * scale), 0.35],
      [days, 0.15],
    ].map(([d, v]) => [dayToX(d as number), valToY(v as number)]);
  }, [cycleLength]);

  const progesteronePoints = useMemo((): [number, number][] => {
    const days = cycleLength;
    const scale = days / 28;
    return [
      [1, 0.05],
      [Math.round(13 * scale), 0.08],
      [Math.round(16 * scale), 0.25],
      [Math.round(21 * scale), 0.88],  // luteal peak
      [Math.round(25 * scale), 0.55],
      [days, 0.05],
    ].map(([d, v]) => [dayToX(d as number), valToY(v as number)]);
  }, [cycleLength]);

  const lhPoints = useMemo((): [number, number][] => {
    const days = cycleLength;
    const scale = days / 28;
    return [
      [1, 0.05],
      [Math.round(12 * scale), 0.08],
      [Math.round(13.5 * scale), 0.92], // LH surge
      [Math.round(15 * scale), 0.1],
      [days, 0.05],
    ].map(([d, v]) => [dayToX(d as number), valToY(v as number)]);
  }, [cycleLength]);

  const fshPoints = useMemo((): [number, number][] => {
    const days = cycleLength;
    const scale = days / 28;
    return [
      [1, 0.3],
      [Math.round(5 * scale), 0.45],
      [Math.round(13 * scale), 0.7],  // FSH peak before ovulation
      [Math.round(15 * scale), 0.2],
      [Math.round(20 * scale), 0.15],
      [days, 0.25],
    ].map(([d, v]) => [dayToX(d as number), valToY(v as number)]);
  }, [cycleLength]);

  // Phase band definitions
  const phases = [
    { name: "Flow", startDay: 1, endDay: Math.round(cycleLength * 0.18), color: "#8B4A6B", label: "Flow" },
    { name: "Bloom", startDay: Math.round(cycleLength * 0.18) + 1, endDay: Math.round(cycleLength * 0.46), color: "#5B8A6B", label: "Bloom" },
    { name: "Spark", startDay: Math.round(cycleLength * 0.46) + 1, endDay: Math.round(cycleLength * 0.61), color: "#C4846E", label: "Spark" },
    { name: "Recharge", startDay: Math.round(cycleLength * 0.61) + 1, endDay: cycleLength, color: "#7A6B8A", label: "Recharge" },
  ];

  const currentX = cycleDay ? dayToX(Math.min(cycleDay, cycleLength)) : null;

  // Find which phase the user is in
  const currentPhaseColor = cycleDay
    ? phases.find(p => cycleDay >= p.startDay && cycleDay <= p.endDay)?.color ?? "#8B4A6B"
    : null;

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(247,242,235,0.04)', border: '1px solid rgba(247,242,235,0.08)' }}>
      <div className="px-5 pt-4 pb-1">
        <p className="text-xs font-medium tracking-widest uppercase" style={{ color: 'rgba(247,242,235,0.4)' }}>
          Hormone Map
        </p>
        {cycleDay && (
          <p className="text-xs mt-0.5" style={{ color: 'rgba(247,242,235,0.5)' }}>
            Day {cycleDay} of {cycleLength}
          </p>
        )}
      </div>

      {/* Wave chart */}
      <div className="px-3 pb-1">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display: 'block' }}>
          {/* Subtle grid lines */}
          {[0.25, 0.5, 0.75].map(v => (
            <line
              key={v}
              x1={PAD_X} y1={valToY(v)}
              x2={W - PAD_X} y2={valToY(v)}
              stroke="rgba(247,242,235,0.05)"
              strokeWidth="1"
            />
          ))}

          {/* Phase background bands */}
          {phases.map(p => (
            <rect
              key={p.name}
              x={dayToX(p.startDay)}
              y={PAD_Y}
              width={dayToX(p.endDay) - dayToX(p.startDay)}
              height={chartH}
              fill={p.color}
              fillOpacity={0.07}
            />
          ))}

          {/* FSH — muted gold */}
          <path
            d={smoothPath(fshPoints)}
            fill="none"
            stroke="#C4A86E"
            strokeWidth="1.5"
            strokeOpacity="0.5"
            strokeDasharray="4 3"
          />

          {/* LH — soft amber */}
          <path
            d={smoothPath(lhPoints)}
            fill="none"
            stroke="#E8B46E"
            strokeWidth="1.5"
            strokeOpacity="0.65"
          />

          {/* Progesterone — lavender */}
          <path
            d={smoothPath(progesteronePoints)}
            fill="none"
            stroke="#9B8AB4"
            strokeWidth="2"
            strokeOpacity="0.85"
          />

          {/* Estrogen — rose */}
          <path
            d={smoothPath(estrogenPoints)}
            fill="none"
            stroke="#C4846E"
            strokeWidth="2.5"
            strokeOpacity="0.9"
          />

          {/* Current day marker */}
          {currentX !== null && (
            <>
              <line
                x1={currentX} y1={PAD_Y}
                x2={currentX} y2={H - PAD_Y}
                stroke={currentPhaseColor ?? "#E8B4A0"}
                strokeWidth="1.5"
                strokeOpacity="0.9"
                strokeDasharray="3 2"
              />
              <circle
                cx={currentX}
                cy={H - PAD_Y}
                r="3.5"
                fill={currentPhaseColor ?? "#E8B4A0"}
                fillOpacity="0.9"
              />
            </>
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="px-5 pb-3 flex flex-wrap gap-x-4 gap-y-1">
        {[
          { label: "Estrogen", color: "#C4846E" },
          { label: "Progesterone", color: "#9B8AB4" },
          { label: "LH", color: "#E8B46E" },
          { label: "FSH", color: "#C4A86E", dashed: true },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-1.5">
            <svg width="18" height="8" viewBox="0 0 18 8">
              <line
                x1="0" y1="4" x2="18" y2="4"
                stroke={item.color}
                strokeWidth={item.label === "Estrogen" ? 2.5 : 2}
                strokeDasharray={item.dashed ? "4 3" : undefined}
              />
            </svg>
            <span className="text-xs" style={{ color: 'rgba(247,242,235,0.45)' }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Phase band labels */}
      <div className="px-3 pb-4">
        <div className="flex rounded-xl overflow-hidden" style={{ height: 28 }}>
          {phases.map(p => (
            <div
              key={p.name}
              className="flex items-center justify-center text-xs font-medium"
              style={{
                flex: p.endDay - p.startDay + 1,
                background: p.color,
                opacity: cycleDay && cycleDay >= p.startDay && cycleDay <= p.endDay ? 0.85 : 0.3,
                color: '#fff',
                fontSize: '10px',
                letterSpacing: '0.05em',
                transition: 'opacity 0.2s',
              }}
            >
              {p.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
