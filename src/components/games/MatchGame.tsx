import { useEffect, useMemo, useRef, useState } from "react";
import { MATCH_SETS } from "@/data/match-pairs";
import { Button } from "@/components/ui/button";
import { saveQuizResults } from "@/lib/science/store";
import { useSubject } from "@/lib/science/subject";
import { MATHS_TOPICS, SCIENCE_TOPICS } from "@/lib/science/topics";
import type { TopicId } from "@/lib/science/types";
import { cn, shuffle } from "@/lib/utils";

type Card = { id: string; text: string; pair: string; side: "term" | "def" };

export function MatchGame() {
  const subject = useSubject();
  const packs = MATCH_SETS.filter((s) =>
    subject === "maths" ? MATHS_TOPICS.includes(s.id as TopicId) : SCIENCE_TOPICS.includes(s.id as TopicId) || s.id === "mix",
  );
  const [setId, setSetId] = useState(packs[0]!.id);

  useEffect(() => {
    setSetId(packs[0]!.id);
  }, [subject]);
  const [left, setLeft] = useState<Card[]>([]);
  const [right, setRight] = useState<Card[]>([]);
  const [pick, setPick] = useState<Card | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string[]>([]);
  const [misses, setMisses] = useState(0);
  const saved = useRef(false);

  const pack = packs.find((s) => s.id === setId) ?? packs[0]!;
  const done = left.length > 0 && matched.length === left.length;

  function start() {
    saved.current = false;
    const cards: Card[] = pack.pairs.flatMap((p, i) => [
      { id: `t-${i}`, text: p.term, pair: String(i), side: "term" as const },
      { id: `d-${i}`, text: p.def, pair: String(i), side: "def" as const },
    ]);
    setLeft(shuffle(cards.filter((c) => c.side === "term")));
    setRight(shuffle(cards.filter((c) => c.side === "def")));
    setPick(null);
    setMatched([]);
    setWrong([]);
    setMisses(0);
  }

  useEffect(() => {
    if (!done || saved.current) return;
    saved.current = true;
    const cat: TopicId = pack.id === "mix" ? "physics" : (pack.id as TopicId);
    saveQuizResults(
      pack.pairs.map((p) => ({
        cat,
        q: `Match: ${p.term}`,
        correct: true,
      })),
    );
  }, [done, pack]);

  function tap(card: Card) {
    if (matched.includes(card.id) || done) return;
    if (!pick) {
      setPick(card);
      return;
    }
    if (pick.id === card.id) {
      setPick(null);
      return;
    }
    if (pick.pair === card.pair && pick.side !== card.side) {
      setMatched((m) => [...m, pick.id, card.id]);
      setPick(null);
      setWrong([]);
    } else {
      setMisses((n) => n + 1);
      setWrong([pick.id, card.id]);
      setPick(null);
      window.setTimeout(() => setWrong([]), 450);
    }
  }

  const remaining = useMemo(() => left.filter((c) => !matched.includes(c.id)).length, [left, matched]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <select
          className="h-11 rounded-[var(--radius-md)] border border-border bg-bg px-3 text-sm"
          value={setId}
          onChange={(e) => setSetId(e.target.value as typeof setId)}
        >
          {packs.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        <Button variant="action" onClick={start}>
          Deal pairs
        </Button>
      </div>
      {left.length === 0 ? (
        <p className="mt-6 text-sm text-muted">Deal a set, then tap one term and its definition.</p>
      ) : (
        <>
          <p className="mt-4 text-sm text-muted">
            {remaining} pairs left · {misses} misses
          </p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <Column cards={left} pick={pick} matched={matched} wrong={wrong} onTap={tap} />
            <Column cards={right} pick={pick} matched={matched} wrong={wrong} onTap={tap} />
          </div>
          {done && (
            <p className="mt-4 rounded-[var(--radius-sm)] border border-success/40 bg-success/10 px-4 py-3 text-sm text-success">
              Set complete with {misses} misses. Saved on this device.
            </p>
          )}
        </>
      )}
    </div>
  );
}

function Column({
  cards,
  pick,
  matched,
  wrong,
  onTap,
}: {
  cards: Card[];
  pick: Card | null;
  matched: string[];
  wrong: string[];
  onTap: (c: Card) => void;
}) {
  return (
    <div className="grid gap-2">
      {cards.map((c) => {
        const isOn = pick?.id === c.id;
        const isMatch = matched.includes(c.id);
        const isWrong = wrong.includes(c.id);
        return (
          <button
            key={c.id}
            type="button"
            disabled={isMatch}
            onClick={() => onTap(c)}
            className={cn(
              "min-h-12 rounded-[var(--radius-sm)] border px-3 py-3 text-left text-sm font-semibold",
              isMatch && "border-success bg-success/15 text-success",
              isWrong && "border-danger bg-danger/15",
              isOn && "border-primary bg-primary/15",
              !isOn && !isMatch && !isWrong && "border-border bg-bg hover:border-primary",
            )}
          >
            {c.text}
          </button>
        );
      })}
    </div>
  );
}
