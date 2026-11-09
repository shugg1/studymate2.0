import { useEffect, useState } from "react";

const DROP = 5;
const G = 10;

function at(t: number, mass: number, friction: number) {
  const clamped = Math.min(1, Math.max(0, t));
  const h = DROP * (2 * clamped - 1) ** 2;
  const pe = mass * G * h;
  const idealKe = mass * G * (DROP - h);
  const thermal = Math.min(friction * mass * G * DROP * clamped, idealKe);
  const ke = idealKe - thermal;
  const speed = mass > 0 ? Math.sqrt((2 * ke) / mass) : 0;
  return { h, pe, ke, thermal, speed, total: pe + ke + thermal };
}

function fmt(n: number) {
  const v = Math.round(n * 10) / 10;
  return Object.is(v, -0) ? "0" : String(v);
}

export function SkateLab() {
  const [t, setT] = useState(0);
  const [mass, setMass] = useState(75);
  const [friction, setFriction] = useState(0);
  const [playing, setPlaying] = useState(false);
  const state = at(t, mass, friction);
  const budget = mass * G * DROP;

  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setT((prev) => {
        const next = Math.min(1, prev + dt * 0.45);
        const nextState = at(next, mass, friction);
        if (friction > 0 && prev > 0.08 && nextState.ke < 1) {
          setPlaying(false);
          return prev;
        }
        if (next >= 1) setPlaying(false);
        return next;
      });
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [playing, mass, friction]);

  const pts = Array.from({ length: 41 }, (_, i) => {
    const p = i / 40;
    const h = DROP * (2 * p - 1) ** 2;
    const x = 36 + p * 280;
    const y = 168 - (h / DROP) * 110;
    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
  }).join(" ");
  const sx = 36 + t * 280;
  const sy = 168 - (state.h / DROP) * 110;

  return (
    <section className="mt-2">
      <p className="text-sm text-muted">
        Drop height is {DROP} m and g is {G}. Drag the skater, or press Drop. Friction off keeps PE + KE constant.
      </p>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_220px]">
        <div>
          <svg viewBox="0 0 360 200" className="w-full rounded-[var(--radius-md)] border border-border bg-bg" role="img" aria-label="Skate track with energy">
            <path d={pts} fill="none" stroke="var(--color-primary)" strokeWidth="3" />
            <line x1="36" y1="168" x2="316" y2="168" className="stroke-border" strokeWidth="1" />
            <circle cx={sx} cy={sy - 10} r="9" fill="var(--color-secondary)" />
            <text x="20" y="24" className="fill-muted" fontSize="11">
              {fmt(state.h)} m
            </text>
          </svg>
          <label className="mt-3 block text-xs font-semibold">
            <span className="flex justify-between">
              Position along the track
              <span className="font-mono text-primary">{t < 0.08 ? "start" : t > 0.92 ? "far lip" : "moving"}</span>
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={t}
              onChange={(e) => {
                setPlaying(false);
                setT(Number(e.target.value));
              }}
              style={{ caretColor: "transparent" }}
              className="mt-1 w-full accent-primary"
            />
          </label>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="block text-xs font-semibold">
              <span className="flex justify-between">
                Mass
                <span className="font-mono text-primary">{mass} kg</span>
              </span>
              <input type="range" min={40} max={100} step={5} value={mass} onChange={(e) => setMass(Number(e.target.value))} style={{ caretColor: "transparent" }}
              className="mt-1 w-full accent-primary" />
            </label>
            <label className="block text-xs font-semibold">
              <span className="flex justify-between">
                Friction
                <span className="font-mono text-primary">{friction === 0 ? "off" : friction.toFixed(2)}</span>
              </span>
              <input
                type="range"
                min={0}
                max={0.85}
                step={0.05}
                value={friction}
                onChange={(e) => setFriction(Number(e.target.value))}
                style={{ caretColor: "transparent" }}
              className="mt-1 w-full accent-primary"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={() => {
              setT(0);
              setPlaying(true);
            }}
            className="mt-3 h-11 rounded-[var(--radius-sm)] border border-primary bg-primary px-4 text-sm font-semibold text-primary-foreground"
          >
            Drop from the left
          </button>
        </div>
        <div className="grid content-start gap-2">
          <Bar label="Potential" value={state.pe} max={budget} />
          <Bar label="Kinetic" value={state.ke} max={budget} />
          <Bar label="Thermal" value={state.thermal} max={budget} />
          <Stat label="Speed" value={`${fmt(state.speed)} m/s`} />
          <Stat label="PE + KE + thermal" value={`${fmt(state.total)} J`} />
          <p className="text-xs text-muted">
            {friction === 0
              ? "Same height means the same speed, whatever the mass. The bars grow with mass; the speed does not."
              : "Friction feeds thermal energy, so kinetic energy runs out before the far lip."}
          </p>
        </div>
      </div>
    </section>
  );
}

function Bar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max <= 0 ? 0 : Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div>
      <div className="flex justify-between text-xs font-semibold">
        <span>{label}</span>
        <span className="font-mono text-primary">{fmt(value)} J</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-surface">
        <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--radius-sm)] border border-border bg-bg px-3 py-2">
      <p className="text-xs font-bold uppercase tracking-wide text-muted">{label}</p>
      <p className="font-mono text-sm">{value}</p>
    </div>
  );
}
