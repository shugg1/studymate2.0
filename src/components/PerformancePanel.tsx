import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Panel, PanelTitle } from "@/components/ui/panel";
import { clearStats, loadQuestionStats, loadStats, subscribeProgress } from "@/lib/science/store";
import { useSubject } from "@/lib/science/subject";
import { catNames, topicsFor } from "@/lib/science/topics";
import type { CatStats, TopicId } from "@/lib/science/types";
import {
  divisionById,
  legacyUnitScore,
  MATHS_UNITS,
  questionsForScope,
  scoreDivision,
} from "@/lib/science/units";
import { cn } from "@/lib/utils";

export function PerformancePanel() {
  const subject = useSubject();
  const topics = topicsFor(subject);
  const [tick, setTick] = useState(0);
  const [open, setOpen] = useState<string | null>(null);
  const [stats, setStats] = useState<Record<TopicId, CatStats> | null>(null);
  const [qStats, setQStats] = useState<Record<string, CatStats>>({});

  useEffect(() => {
    setOpen(null);
  }, [subject]);

  useEffect(() => {
    function load() {
      setStats(loadStats());
      setQStats(loadQuestionStats());
    }
    load();
    return subscribeProgress(load);
  }, [tick]);

  function reset() {
    if (window.confirm("Reset all progress data?")) {
      clearStats();
      setOpen(null);
      setTick((t) => t + 1);
    }
  }

  return (
    <Panel>
      <PanelTitle
        kicker="Track"
        title="Progress"
        description={
          subject === "maths"
            ? "Kept on this device. Close the tab and open StudyMate again in this browser — the scores are still here. Amber and red need another look."
            : "Kept on this device. Close the tab and open StudyMate again in this browser — the scores are still here. Games and quizzes both write here."
        }
      />
      {subject === "maths" ? (
        <div className="space-y-8">
          {MATHS_UNITS.map((unit) => {
            const legacy = stats ? legacyUnitScore(unit, stats) : { c: 0, t: 0 };
            const partTotals = unit.divisions.reduce(
              (sum, div) => {
                const stat = scoreDivision(div, qStats, stats ?? undefined);
                return { c: sum.c + stat.c, t: sum.t + stat.t };
              },
              { c: 0, t: 0 },
            );
            return (
              <section key={unit.id}>
                <h3 className="text-sm font-bold uppercase tracking-wide text-muted">{unit.title}</h3>
                {partTotals.t === 0 && legacy.t > 0 && (
                  <p className="mt-1 text-xs text-muted">
                    Older quizzes were saved on the whole unit ({legacy.c}/{legacy.t}). New quizzes fill each part.
                  </p>
                )}
                <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                  {unit.divisions
                    .filter((div) => questionsForScope(`div:${div.id}`, "maths").length > 0)
                    .map((div) => {
                    const data = scoreDivision(div, qStats, stats ?? undefined);
                    return (
                      <ScoreCard
                        key={div.id}
                        label={div.short}
                        data={data}
                        open={open === `div:${div.id}`}
                        onClick={() => setOpen(`div:${div.id}`)}
                      />
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {topics.map((key) => {
            const data = stats?.[key] ?? { c: 0, t: 0 };
            return (
              <ScoreCard
                key={key}
                label={catNames[key]}
                data={data}
                open={open === key}
                onClick={() => setOpen(key)}
              />
            );
          })}
        </div>
      )}

      {open && (
        <div className="mt-8">
          <h3 className="text-lg font-bold">{openTitle(open, subject === "maths")} — individual questions</h3>
          <p className="text-sm text-muted">Each question keeps its own record.</p>
          <div className="mt-3 space-y-2">
            {questionsForScope(open, subject).map((q, i) => {
              const d = qStats[q.q] ?? { c: 0, t: 0 };
              const percent = d.t ? Math.round((d.c / d.t) * 100) : 0;
              return (
                <div key={q.q} className="rounded-[var(--radius-sm)] border border-border bg-bg px-4 py-3">
                  <p className="text-sm font-semibold">
                    {i + 1}. {q.q}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {d.t ? `${d.c}/${d.t} correct (${percent}%)` : "Not attempted yet"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Button variant="danger" className="mt-8" onClick={reset}>
        Reset progress
      </Button>
    </Panel>
  );
}

function openTitle(open: string, maths: boolean) {
  if (maths && open.startsWith("div:")) {
    const hit = divisionById(open.slice(4));
    if (hit) return `${hit.unit.title} · ${hit.div.label}`;
  }
  return catNames[open as TopicId] ?? open;
}

function ScoreCard({
  label,
  data,
  open,
  onClick,
}: {
  label: string;
  data: CatStats;
  open: boolean;
  onClick: () => void;
}) {
  const percent = data.t === 0 ? 0 : Math.round((data.c / data.t) * 100);
  let status = "No data yet";
  let tone = "border-border";
  if (data.t > 0 && percent >= 80) {
    status = "A range";
    tone = "border-success";
  } else if (data.t > 0 && percent >= 50) {
    status = "Getting there";
    tone = "border-warning";
  } else if (data.t > 0) {
    status = "Needs review";
    tone = "border-danger";
  }
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={open}
      className={cn(
        "rounded-[var(--radius-md)] border-b-4 bg-bg p-4 text-center transition-transform hover:-translate-y-0.5",
        tone,
        open && "ring-2 ring-ring",
      )}
    >
      <h3 className="text-sm font-bold">{label}</h3>
      <p className="my-1 font-mono text-3xl font-bold tabular-nums">{percent}%</p>
      <p className="text-xs text-muted">
        {data.c} / {data.t} correct
      </p>
      <p className="mt-2 text-xs font-bold">{status}</p>
    </button>
  );
}
