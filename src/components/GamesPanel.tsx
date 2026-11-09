import { useEffect, useState } from "react";
import { ArrowLeft, Brain, Clock, Crosshair, Layers, Radiation, Sparkles, Zap } from "lucide-react";
import { FormulaBlitz } from "@/components/games/FormulaBlitz";
import { MatchGame } from "@/components/games/MatchGame";
import { RadiationRush } from "@/components/games/RadiationRush";
import { SpectrumSort } from "@/components/games/SpectrumSort";
import { WeakSpot } from "@/components/games/WeakSpot";
import { ScopeSelect } from "@/components/ScopeSelect";
import { Button } from "@/components/ui/button";
import { Panel, PanelTitle } from "@/components/ui/panel";
import { questionsFor } from "@/lib/science/bank";
import { saveQuizResults } from "@/lib/science/store";
import { useSubject } from "@/lib/science/subject";
import { catNames, topicsFor } from "@/lib/science/topics";
import type { Question, TopicId } from "@/lib/science/types";
import { questionsForScope } from "@/lib/science/units";
import { shuffle } from "@/lib/utils";

type GameId = "flash" | "sprint" | "match" | "spectrum" | "blitz" | "radiation" | "weak";

const SCIENCE_GAMES: GameId[] = ["weak", "match", "spectrum", "blitz", "radiation", "flash", "sprint"];
const MATHS_GAMES: GameId[] = ["weak", "match", "flash", "sprint"];

const GAMES: { id: GameId; title: string; blurb: string; icon: typeof Brain }[] = [
  { id: "weak", title: "Weak-spot drill", blurb: "Questions you miss, plus ones you have not tried.", icon: Crosshair },
  { id: "match", title: "Term match", blurb: "Pair definitions until the language is automatic.", icon: Layers },
  { id: "spectrum", title: "Spectrum order", blurb: "Radio to gamma. The sequence that always appears in exams.", icon: Sparkles },
  { id: "blitz", title: "Formula blitz", blurb: "GPE, KE, work and efficiency — numbers until they stick.", icon: Zap },
  { id: "radiation", title: "Radiation rush", blurb: "Alpha, beta or gamma from a property. No hesitation.", icon: Radiation },
  { id: "flash", title: "Flashcards", blurb: "Think, then reveal. Same bank as the quizzes.", icon: Brain },
  { id: "sprint", title: "60-second sprint", blurb: "As many multiple-choice as you can. Build speed.", icon: Clock },
];

export function GamesPanel({ initialGame = null }: { initialGame?: GameId | null }) {
  const subject = useSubject();
  const allowed = subject === "maths" ? MATHS_GAMES : SCIENCE_GAMES;
  const [game, setGame] = useState<GameId | null>(initialGame);
  const visible = GAMES.filter((g) => allowed.includes(g.id));
  const active = GAMES.find((g) => g.id === game && allowed.includes(g.id));

  useEffect(() => {
    setGame(null);
  }, [subject]);

  if (!active) {
    return (
      <Panel>
        <PanelTitle
          kicker="Practice"
          title="Study games"
          description={
            subject === "maths"
              ? "After you have walked through a part in Notes. Weak-spot drill first if you have already sat a quiz."
              : "Short loops that put the Year 9 packs into muscle memory. Weak-spot drill first if you have already sat a quiz."
          }
        />
        <div className="grid gap-3 sm:grid-cols-2">
          {visible.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setGame(item.id)}
                className="rounded-[var(--radius-md)] border border-border bg-bg p-5 text-left transition-colors hover:border-primary"
              >
                <Icon className="size-5 text-primary" />
                <h3 className="mt-3 text-lg font-bold">{item.title}</h3>
                <p className="mt-1 text-sm text-muted">{item.blurb}</p>
              </button>
            );
          })}
        </div>
      </Panel>
    );
  }

  return (
    <Panel>
      <Button variant="ghost" className="mb-4 px-2" onClick={() => setGame(null)}>
        <ArrowLeft className="size-4" />
        All games
      </Button>
      <PanelTitle title={active.title} description={active.blurb} />
      {game === "flash" && <Flashcards />}
      {game === "sprint" && <SpeedRound />}
      {game === "match" && <MatchGame />}
      {game === "spectrum" && <SpectrumSort />}
      {game === "blitz" && <FormulaBlitz />}
      {game === "radiation" && <RadiationRush />}
      {game === "weak" && <WeakSpot />}
    </Panel>
  );
}

function Flashcards() {
  const subject = useSubject();
  const topics = topicsFor(subject);
  const [topic, setTopic] = useState("all");
  const [cards, setCards] = useState<Question[]>([]);
  const [i, setI] = useState(0);
  const [show, setShow] = useState(false);

  function start() {
    setCards(shuffle(questionsForScope(topic, subject)).slice(0, 15));
    setI(0);
    setShow(false);
  }

  const card = cards[i];
  const answer = card ? (Array.isArray(card.a) ? card.a[0] : card.a) : "";

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {subject === "maths" ? (
          <ScopeSelect
            value={topic}
            onChange={setTopic}
            className="h-11 min-w-0 flex-1 rounded-[var(--radius-md)] border border-border bg-bg px-3 text-sm text-foreground"
          />
        ) : (
          <select
            className="h-11 flex-1 rounded-[var(--radius-md)] border border-border bg-bg px-3 text-sm"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          >
            <option value="all">All topics</option>
            {topics.map((id) => (
              <option key={id} value={id}>
                {catNames[id]}
              </option>
            ))}
          </select>
        )}
        <Button variant="action" onClick={start}>
          Deal pack
        </Button>
      </div>
      {card ? (
        <>
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="mt-4 flex min-h-[200px] w-full flex-col items-center justify-center rounded-[var(--radius-md)] border border-border bg-bg px-6 py-8 text-center"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              {show ? "Answer" : "Question"} · {i + 1}/{cards.length}
            </span>
            <span className="mt-3 text-lg font-bold">{show ? answer : card.q}</span>
            <span className="mt-3 text-sm text-secondary">{show ? "Hide" : "Reveal"}</span>
          </button>
          {show && (
            <div className="mt-3 flex gap-2">
              <Button
                onClick={() => {
                  saveQuizResults([{ cat: card.cat as TopicId, q: card.q, correct: false }]);
                  setI((n) => (n + 1) % cards.length);
                  setShow(false);
                }}
              >
                Not yet
              </Button>
              <Button
                variant="action"
                className="ml-auto"
                onClick={() => {
                  saveQuizResults([{ cat: card.cat as TopicId, q: card.q, correct: true }]);
                  setI((n) => (n + 1) % cards.length);
                  setShow(false);
                }}
              >
                Knew it
              </Button>
            </div>
          )}
          <div className="mt-3 flex gap-2">
            <Button
              onClick={() => {
                setI((i - 1 + cards.length) % cards.length);
                setShow(false);
              }}
            >
              Previous
            </Button>
            <Button className="ml-auto" onClick={() => {
              setI((i + 1) % cards.length);
              setShow(false);
            }}>
              Next
            </Button>
          </div>
        </>
      ) : (
        <p className="mt-6 text-sm text-muted">Deal a pack of up to 15 cards from the question bank.</p>
      )}
    </div>
  );
}

function SpeedRound() {
  const subject = useSubject();
  const [time, setTime] = useState(60);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [active, setActive] = useState(false);
  const [pool, setPool] = useState<Question[]>([]);
  const [current, setCurrent] = useState<Question | null>(null);

  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          setActive(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [active]);

  function deal(from: Question[]) {
    const next = from[from.length - 1];
    const rest = from.slice(0, -1);
    setCurrent(next ?? null);
    setPool(rest.length ? rest : shuffle(questionsFor("all", subject).filter((q) => q.type === "mcq")));
  }

  function start() {
    setTime(60);
    setScore(0);
    setStreak(0);
    setActive(true);
    deal(shuffle(questionsFor("all", subject).filter((q) => q.type === "mcq")));
  }

  function answer(opt: string) {
    if (!active || !current) return;
    const right = opt === (Array.isArray(current.a) ? current.a[0] : current.a);
    saveQuizResults([{ cat: current.cat as TopicId, q: current.q, correct: right }]);
    if (right) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
    window.setTimeout(() => deal(pool), 160);
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 text-sm">
        <Stat label="Time" value={String(time)} />
        <Stat label="Score" value={String(score)} />
        <Stat label="Streak" value={String(streak)} />
      </div>
      <Button variant="action" className="mt-4" onClick={start}>
        Start 60-second round
      </Button>
      <div className="mt-4">
        {active && current ? (
          <>
            <p className="min-h-16 text-base font-bold">{current.q}</p>
            <div className="mt-3 grid gap-2">
              {(current.options ?? []).map((opt) => (
                <Button key={opt} className="w-full justify-start" onClick={() => answer(opt)}>
                  {opt}
                </Button>
              ))}
            </div>
          </>
        ) : !active && time === 0 ? (
          <p className="rounded-[var(--radius-sm)] border border-success/40 bg-success/10 p-3 text-success">
            Time. Final score: <strong>{score}</strong>
          </p>
        ) : null}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-[var(--radius-sm)] bg-bg px-3 py-2">
      <span className="text-muted">{label}</span>
      <strong className="font-mono tabular-nums">{value}</strong>
    </div>
  );
}
