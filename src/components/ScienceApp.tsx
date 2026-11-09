import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  Atom,
  BarChart3,
  BookOpenText,
  CalendarDays,
  Gamepad2,
  PenLine,
} from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { CalendarPanel } from "@/components/CalendarPanel";
import { GamesPanel } from "@/components/GamesPanel";
import { LabsPanel } from "@/components/LabsPanel";
import { NotesPanel } from "@/components/NotesPanel";
import { PerformancePanel } from "@/components/PerformancePanel";
import { QuizPanel } from "@/components/QuizPanel";
import { questionsFor } from "@/lib/science/bank";
import { mathNotes } from "@/data/math-notes";
import { noteSections } from "@/data/notes";
import { SubjectProvider } from "@/lib/science/subject";
import { SUBJECTS } from "@/lib/science/topics";
import type { SubjectId } from "@/lib/science/types";
import { cn } from "@/lib/utils";

type Tab = "notes" | "quizzes" | "labs" | "games" | "stats" | "calendar";

const TABS: { id: Tab; label: string; icon: typeof BookOpenText }[] = [
  { id: "notes", label: "Notes", icon: BookOpenText },
  { id: "quizzes", label: "Quizzes", icon: PenLine },
  { id: "labs", label: "Labs", icon: Atom },
  { id: "games", label: "Games", icon: Gamepad2 },
  { id: "stats", label: "Progress", icon: BarChart3 },
  { id: "calendar", label: "Planner", icon: CalendarDays },
];

const SUBJECT_KEY = "studymate-subject";
const TAB_KEY = "studymate-tab";

export function ScienceApp() {
  const [subject, setSubject] = useState<SubjectId>("science");
  const [tab, setTab] = useState<Tab>("notes");
  const [quizTopic, setQuizTopic] = useState<"all" | string>("all");

  useEffect(() => {
    document.documentElement.dataset.subject = subject;
  }, [subject]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SUBJECT_KEY);
      if (stored === "science" || stored === "maths") setSubject(stored);
      const storedTab = localStorage.getItem(TAB_KEY);
      if (storedTab && TABS.some((item) => item.id === storedTab)) setTab(storedTab as Tab);
    } catch {
      /* ignore */
    }
  }, []);

  function chooseSubject(id: SubjectId) {
    setSubject(id);
    setQuizTopic("all");
    try {
      localStorage.setItem(SUBJECT_KEY, id);
    } catch {
      /* ignore */
    }
  }

  function chooseTab(id: Tab) {
    setTab(id);
    try {
      localStorage.setItem(TAB_KEY, id);
    } catch {
      /* ignore */
    }
  }

  const counts = useMemo(() => {
    const notes = subject === "maths" ? mathNotes.length : noteSections.length;
    return { notes, questions: questionsFor("all", subject).length };
  }, [subject]);

  return (
    <SubjectProvider value={subject}>
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col lg:flex-row">
        <aside className="hidden w-60 shrink-0 flex-col border-r border-border px-5 py-8 lg:flex">
          <Wordmark />
          <SubjectSwitch subject={subject} onChange={chooseSubject} />
          <nav className="mt-6 flex flex-col gap-1" aria-label="StudyMate">
            {TABS.map((item) => (
              <NavBtn
                key={item.id}
                active={tab === item.id}
                onClick={() => chooseTab(item.id)}
                icon={<item.icon className="size-4" />}
                label={item.label}
              />
            ))}
          </nav>
          <p className="mt-auto pt-8 text-xs text-muted">
            {counts.notes} {subject === "maths" ? (counts.notes === 1 ? "unit" : "units") : counts.notes === 1 ? "unit" : "note packs"} · {counts.questions} questions
          </p>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-border bg-bg/90 px-4 py-3 backdrop-blur-md lg:hidden">
            <Wordmark />
            <SubjectSwitch subject={subject} onChange={chooseSubject} compact />
            <nav className="-mx-1 mt-3 flex gap-1 overflow-x-auto pb-1" aria-label="StudyMate">
              {TABS.map((item) => (
                <NavBtn
                  key={item.id}
                  active={tab === item.id}
                  onClick={() => chooseTab(item.id)}
                  icon={<item.icon className="size-4" />}
                  label={item.label}
                  compact
                />
              ))}
            </nav>
          </header>

          <div className="px-4 py-6 md:px-8 md:py-8">
            <div className="fade-in" key={`${subject}-${tab}`}>
              {tab === "notes" && (
                <NotesPanel
                  onDrill={(topic) => {
                    setQuizTopic(topic);
                    chooseTab("quizzes");
                  }}
                />
              )}
              {tab === "quizzes" && <QuizPanel initialTopic={quizTopic} />}
              {tab === "labs" && <LabsPanel />}
              {tab === "games" && <GamesPanel />}
              {tab === "stats" && <PerformancePanel />}
              {tab === "calendar" && <CalendarPanel />}
            </div>
          </div>
        </div>
      </div>
    </SubjectProvider>
  );
}

function Wordmark() {
  return (
    <div className="flex items-center gap-3">
      <BrandMark />
      <p className="font-display text-xl font-bold leading-none tracking-tight">
        Study<span className="text-primary">Mate</span>
      </p>
    </div>
  );
}

function SubjectSwitch({
  subject,
  onChange,
  compact,
}: {
  subject: SubjectId;
  onChange: (id: SubjectId) => void;
  compact?: boolean;
}) {
  return (
    <div className={cn("grid grid-cols-2 gap-1 rounded-[var(--radius-sm)] border border-border bg-bg p-1", compact ? "mt-3" : "mt-5")}>
      {SUBJECTS.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={cn(
            "h-10 rounded-[var(--radius-sm)] text-sm font-semibold",
            subject === item.id
              ? "bg-primary text-primary-foreground"
              : "text-muted hover:text-foreground",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function NavBtn({
  active,
  onClick,
  icon,
  label,
  compact,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center gap-2 rounded-[var(--radius-sm)] border text-sm font-semibold transition-colors",
        compact ? "h-10 px-3" : "h-11 w-full px-3",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-transparent text-muted hover:border-border hover:bg-surface-hover hover:text-foreground",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
