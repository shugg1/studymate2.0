import { useEffect, useMemo, useRef, useState } from "react";
import { ScopeSelect } from "@/components/ScopeSelect";
import { Button } from "@/components/ui/button";
import { Panel, PanelTitle } from "@/components/ui/panel";
import { replaceQuizResult, type ProgressUpdate } from "@/lib/science/store";
import { useSubject } from "@/lib/science/subject";
import { catNames, topicsFor } from "@/lib/science/topics";
import type { Question, TopicId } from "@/lib/science/types";
import { labelForQuestion, questionsForScope, scopeKeyForTopic } from "@/lib/science/units";
import { answersMatch, shuffle } from "@/lib/utils";

type QuizItem = Question & { userAns?: string; answered?: boolean };

export function QuizPanel({ initialTopic = "all" }: { initialTopic?: string }) {
  const subject = useSubject();
  const topics = topicsFor(subject);
  const [scope, setScope] = useState(scopeKeyForTopic(initialTopic));
  const [length, setLength] = useState(10);
  const [exam, setExam] = useState(false);
  const [remain, setRemain] = useState(0);
  const [items, setItems] = useState<QuizItem[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const itemsRef = useRef(items);
  const submittedRef = useRef(submitted);
  const recorded = useRef<Map<number, ProgressUpdate>>(new Map());
  const flushRef = useRef<() => void>(() => {});
  itemsRef.current = items;
  submittedRef.current = submitted;

  function remember(index: number, q: QuizItem, userAns: string) {
    const next: ProgressUpdate = {
      cat: q.cat as TopicId,
      q: q.q,
      correct: answersMatch(userAns, q.a),
    };
    replaceQuizResult(recorded.current.get(index) ?? null, next);
    recorded.current.set(index, next);
  }

  flushRef.current = () => {
    itemsRef.current.forEach((q, i) => {
      if (!q.answered || recorded.current.has(i)) return;
      remember(i, q, q.userAns || "");
    });
  };

  useEffect(() => {
    const flush = () => flushRef.current();
    window.addEventListener("pagehide", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, []);

  useEffect(() => {
    setScope(scopeKeyForTopic(initialTopic));
  }, [initialTopic, subject]);

  const available = useMemo(() => questionsForScope(scope, subject).length, [scope, subject]);

  function start() {
    const pool = shuffle(questionsForScope(scope, subject));
    const n = Math.min(length, pool.length);
    recorded.current = new Map();
    setItems(pool.slice(0, n).map((q) => ({ ...q, options: q.options ? shuffle(q.options) : q.options })));
    setSubmitted(false);
    submittedRef.current = false;
    setScore(null);
    setRemain(exam ? (n <= 10 ? 8 * 60 : 15 * 60) : 0);
  }

  function submit() {
    if (submittedRef.current) return;
    submittedRef.current = true;
    flushRef.current();
    const curr = itemsRef.current;
    const updates = curr.filter((q) => q.answered);
    setSubmitted(true);
    setScore(updates.filter((q) => answersMatch(q.userAns || "", q.a)).length);
    setRemain(0);
  }

  useEffect(() => {
    if (!exam || items.length === 0 || submitted) return;
    const id = window.setInterval(() => {
      setRemain((t) => {
        if (t <= 1) {
          window.setTimeout(() => submit(), 0);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [exam, items.length, submitted]);

  const mins = Math.floor(remain / 60);
  const secs = String(remain % 60).padStart(2, "0");

  return (
    <Panel>
      <PanelTitle
        kicker="Test"
        title="Smart quizzes"
        description={`${available} questions in this pick. Each answer is kept on this device as you go. Close the tab and it is still in Progress.`}
      />
      <div className="flex flex-wrap gap-3">
        {subject === "maths" ? (
          <ScopeSelect value={scope} onChange={setScope} />
        ) : (
          <select
            className="h-11 rounded-[var(--radius-md)] border border-border bg-bg px-3 text-sm text-foreground"
            value={topics.includes(scope as TopicId) || scope === "all" ? scope : "all"}
            onChange={(e) => setScope(e.target.value)}
            aria-label="Quiz topic"
          >
            <option value="all">Mix this subject ({questionsForScope("all", subject).length})</option>
            {topics.map((id) => (
              <option key={id} value={id}>
                {catNames[id]}
              </option>
            ))}
          </select>
        )}
        <select
          className="h-11 rounded-[var(--radius-md)] border border-border bg-bg px-3 text-sm text-foreground"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          aria-label="Quiz length"
        >
          <option value={5}>5 questions</option>
          <option value={10}>10 questions</option>
          <option value={20}>20 questions</option>
        </select>
        <label className="flex h-11 items-center gap-2 rounded-[var(--radius-md)] border border-border bg-bg px-3 text-sm">
          <input
            type="checkbox"
            checked={exam}
            onChange={(e) => setExam(e.target.checked)}
            className="size-4 accent-primary"
          />
          Exam clock
        </label>
        <Button variant="action" onClick={start} disabled={available === 0}>
          Start quiz
        </Button>
      </div>

      {exam && items.length > 0 && !submitted && (
        <p className="mt-4 font-mono text-lg tabular-nums text-primary">
          {mins}:{secs}
        </p>
      )}

      {items.length === 0 ? (
        <p className="mt-8 text-sm text-muted">Choose a topic and start a quiz to begin.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {score !== null && (
            <div className="rounded-[var(--radius-sm)] border border-success/40 bg-success/10 px-4 py-3 text-success">
              Saved on this device: {score} / {items.filter((q) => q.answered).length} correct. It stays in Progress after you close the tab.
            </div>
          )}
          {items.map((q, i) => {
            const correct = submitted && answersMatch(q.userAns || "", q.a);
            const showAnswer = submitted && q.answered;
            return (
              <article
                key={`${q.q}-${i}`}
                className="rounded-[var(--radius-md)] border border-border bg-bg p-4 md:p-5"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  {subject === "maths" ? labelForQuestion(q) : (catNames[q.cat as TopicId] ?? q.cat)}
                </span>
                <p className="mt-2 font-semibold text-foreground">
                  {i + 1}. {q.q}
                </p>
                {q.type === "mcq" && q.options ? (
                  <div className="mt-3 grid gap-2">
                    {q.options.map((opt) => {
                      let cls = "mcq";
                      if (showAnswer && opt === (Array.isArray(q.a) ? q.a[0] : q.a)) cls = "correct";
                      else if (showAnswer && opt === q.userAns && !correct) cls = "incorrect";
                      return (
                        <button
                          key={opt}
                          type="button"
                          disabled={submitted}
                          onClick={() => {
                            if (submitted) return;
                            setItems((prev) =>
                              prev.map((item, idx) => (idx === i ? { ...item, userAns: opt, answered: true } : item)),
                            );
                            remember(i, q, opt);
                          }}
                          className={[
                            "w-full rounded-[var(--radius-sm)] border px-4 py-3 text-left text-sm font-semibold transition-colors",
                            cls === "correct"
                              ? "border-success bg-success text-success-foreground"
                              : cls === "incorrect"
                                ? "border-danger bg-danger text-danger-foreground"
                                : q.userAns === opt
                                  ? "border-primary bg-primary/15 text-foreground"
                                  : "border-border bg-surface-hover text-foreground hover:border-primary",
                          ].join(" ")}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <input
                    className="mt-3 h-11 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm text-foreground"
                    placeholder="Type your answer"
                    value={q.userAns ?? ""}
                    disabled={submitted}
                    onChange={(e) => {
                      const value = e.target.value;
                      setItems((prev) =>
                        prev.map((item, idx) => (idx === i ? { ...item, userAns: value, answered: value.trim().length > 0 } : item)),
                      );
                    }}
                    onBlur={(e) => {
                      if (submitted || !e.target.value.trim()) return;
                      remember(i, q, e.target.value);
                    }}
                  />
                )}
                {showAnswer && (
                  <p
                    className={`mt-3 rounded-[var(--radius-sm)] border px-3 py-2 text-sm font-bold ${
                      correct
                        ? "border-success bg-success/15 text-success"
                        : "border-danger bg-danger/15 text-danger"
                    }`}
                  >
                    {correct
                      ? "Correct"
                      : `Incorrect. The accepted answer is: ${Array.isArray(q.a) ? q.a[0] : q.a}`}
                  </p>
                )}
              </article>
            );
          })}
          {!submitted && (
            <Button variant="action" size="full" onClick={submit}>
              Submit and mark
            </Button>
          )}
        </div>
      )}
    </Panel>
  );
}
