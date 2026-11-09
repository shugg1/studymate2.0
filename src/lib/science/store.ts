import type { CatStats, TimetableEvent, TopicId } from "./types";
import { TOPIC_ORDER } from "./topics";

const STATS_KEY = "year9-sciStats";
const QSTATS_KEY = "year9-sciQuestionStats";
const TT_KEY = "year9-sciTimetable";
const PROGRESS_EVENT = "studymate-progress";

export type ProgressUpdate = { cat: TopicId; q: string; correct: boolean };

function emptyStats(): Record<TopicId, CatStats> {
  return Object.fromEntries(TOPIC_ORDER.map((cat) => [cat, { c: 0, t: 0 }])) as Record<
    TopicId,
    CatStats
  >;
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* This browser is blocking storage. There is no account to fall back on. */
  }
}

function notifyProgress() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(PROGRESS_EVENT));
}

export function loadStats(): Record<TopicId, CatStats> {
  const stored = readJson<Partial<Record<TopicId, CatStats>>>(STATS_KEY, {});
  const base = emptyStats();
  for (const cat of TOPIC_ORDER) {
    if (stored[cat]) base[cat] = stored[cat]!;
  }
  return base;
}

export function loadQuestionStats(): Record<string, CatStats> {
  return readJson(QSTATS_KEY, {});
}

function persist(stats: Record<TopicId, CatStats>, qStats: Record<string, CatStats>) {
  writeJson(STATS_KEY, stats);
  writeJson(QSTATS_KEY, qStats);
  notifyProgress();
}

export function saveQuizResults(updates: ProgressUpdate[]) {
  if (!updates.length || typeof window === "undefined") return;
  const stats = loadStats();
  const qStats = loadQuestionStats();
  for (const u of updates) {
    if (!stats[u.cat]) stats[u.cat] = { c: 0, t: 0 };
    stats[u.cat].t += 1;
    if (u.correct) stats[u.cat].c += 1;
    if (!qStats[u.q]) qStats[u.q] = { c: 0, t: 0 };
    qStats[u.q].t += 1;
    if (u.correct) qStats[u.q].c += 1;
  }
  persist(stats, qStats);
}

/** Change an answer that was already stored, without counting it as a second attempt. */
export function replaceQuizResult(prev: ProgressUpdate | null, next: ProgressUpdate) {
  if (!prev) {
    saveQuizResults([next]);
    return;
  }
  if (prev.cat === next.cat && prev.q === next.q && prev.correct === next.correct) return;
  const stats = loadStats();
  const qStats = loadQuestionStats();
  const undo = (cat: TopicId, q: string, correct: boolean) => {
    const cs = stats[cat];
    if (cs) {
      cs.t = Math.max(0, cs.t - 1);
      if (correct) cs.c = Math.max(0, cs.c - 1);
    }
    const qs = qStats[q];
    if (!qs) return;
    qs.t = Math.max(0, qs.t - 1);
    if (correct) qs.c = Math.max(0, qs.c - 1);
    if (qs.t <= 0) delete qStats[q];
  };
  undo(prev.cat, prev.q, prev.correct);
  writeJson(STATS_KEY, stats);
  writeJson(QSTATS_KEY, qStats);
  saveQuizResults([next]);
}

export function clearStats() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STATS_KEY);
    localStorage.removeItem(QSTATS_KEY);
  } catch {
    /* ignore */
  }
  notifyProgress();
}

export function subscribeProgress(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const onVisible = () => {
    if (document.visibilityState === "visible") onChange();
  };
  window.addEventListener(PROGRESS_EVENT, onChange);
  window.addEventListener("storage", onChange);
  document.addEventListener("visibilitychange", onVisible);
  return () => {
    window.removeEventListener(PROGRESS_EVENT, onChange);
    window.removeEventListener("storage", onChange);
    document.removeEventListener("visibilitychange", onVisible);
  };
}

export function loadTimetable(): Record<string, TimetableEvent> {
  return readJson(TT_KEY, {});
}

export function saveTimetable(events: Record<string, TimetableEvent>) {
  writeJson(TT_KEY, events);
}
