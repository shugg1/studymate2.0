import { questionsFor } from "@/lib/science/bank";
import type { Question, SubjectId, TopicId } from "@/lib/science/types";

export type MathsUnitId = "quadratics" | "probability" | "measurement";

export type MathsDivision = {
  id: string;
  /** Chip and card label. */
  short: string;
  /** Fuller name, used as the part heading. */
  label: string;
  cats: TopicId[];
  /** Class lesson numbers. Filters practice, and the source list in notes. */
  lessons: number[];
  /** "cat" = one quadratics skill. "lesson" = probability or measurement part. */
  by: "cat" | "lesson";
};

export type MathsUnit = {
  id: MathsUnitId;
  title: string;
  noteId: string;
  divisions: MathsDivision[];
};

export const MATHS_UNITS: MathsUnit[] = [
  {
    id: "quadratics",
    title: "Quadratics",
    noteId: "quadratics",
    divisions: [
      { id: "forms", short: "Three forms", label: "The three forms", cats: [], lessons: [1], by: "cat" },
      { id: "tp", short: "Turning point", label: "Turning point form", cats: ["tpform"], lessons: [1], by: "cat" },
      { id: "axes", short: "Axes", label: "Crossing the axes", cats: ["intercepts"], lessons: [3, 18], by: "cat" },
      { id: "factor", short: "Factor form", label: "Factor form", cats: ["factorform"], lessons: [4, 6], by: "cat" },
      { id: "expand", short: "Expanding", label: "Expanding", cats: ["expanding"], lessons: [7, 8, 9], by: "cat" },
      { id: "factorise", short: "Factorising", label: "Factorising", cats: ["factorising"], lessons: [13, 14, 15, 18], by: "cat" },
      { id: "square", short: "Completing the square", label: "Completing the square", cats: ["completedsquare"], lessons: [16, 17, 18], by: "cat" },
      { id: "formula", short: "Formula", label: "General form and the formula", cats: ["quadraticformula"], lessons: [], by: "cat" },
      { id: "findrule", short: "Find the rule", label: "Finding the equation", cats: ["findrule"], lessons: [19], by: "cat" },
      { id: "models", short: "Models", label: "Models in context", cats: ["models"], lessons: [20], by: "cat" },
    ],
  },
  {
    id: "probability",
    title: "Probability",
    noteId: "probability",
    divisions: [
      { id: "venn", short: "Venn diagrams", label: "Venn diagrams", cats: ["probability"], lessons: [1], by: "lesson" },
      { id: "table", short: "Two-way tables", label: "Two-way tables", cats: ["probability"], lessons: [2], by: "lesson" },
      { id: "steps", short: "Two-step experiments", label: "Two-step experiments", cats: ["probability"], lessons: [3], by: "lesson" },
      { id: "tree", short: "Tree diagrams", label: "Tree diagrams", cats: ["probability"], lessons: [4], by: "lesson" },
      { id: "addition", short: "Addition rule", label: "The addition rule", cats: ["probability"], lessons: [5], by: "lesson" },
      { id: "conditional", short: "Conditional", label: "Conditional probability", cats: ["probability"], lessons: [6], by: "lesson" },
    ],
  },
  {
    id: "measurement",
    title: "Measurement",
    noteId: "measurement",
    divisions: [
      { id: "area", short: "Composite area", label: "Composite area and perimeter", cats: ["measurement"], lessons: [2], by: "lesson" },
      { id: "prismsa", short: "Prism & cylinder SA", label: "Surface area of prisms and cylinders", cats: ["measurement"], lessons: [3], by: "lesson" },
      { id: "conesa", short: "Cones & pyramids SA", label: "Cones and pyramids — surface area", cats: ["measurement"], lessons: [4], by: "lesson" },
      { id: "prismvol", short: "Prism & cylinder volume", label: "Volume of prisms and cylinders", cats: ["measurement"], lessons: [5], by: "lesson" },
      { id: "conevol", short: "Pyramid & cone volume", label: "Volume of pyramids and cones", cats: ["measurement"], lessons: [6], by: "lesson" },
      { id: "sphere", short: "Spheres", label: "Spheres and hemispheres", cats: ["measurement"], lessons: [7], by: "lesson" },
      { id: "accuracy", short: "Accuracy", label: "Limits of accuracy", cats: ["measurement"], lessons: [8], by: "lesson" },
    ],
  },
];

const DIV_BY_ID = new Map(MATHS_UNITS.flatMap((unit) => unit.divisions.map((div) => [div.id, { unit, div }] as const)));

const CAT_TO_SCOPE: Record<string, string> = {
  tpform: "div:tp",
  intercepts: "div:axes",
  factorform: "div:factor",
  expanding: "div:expand",
  factorising: "div:factorise",
  completedsquare: "div:square",
  quadraticformula: "div:formula",
  findrule: "div:findrule",
  models: "div:models",
  probability: "unit:probability",
  measurement: "unit:measurement",
};

export function mentionsLesson(source: string, lesson: number): boolean {
  return new RegExp(`Lesson ${lesson}(?!\\d)`).test(source);
}

export function unitForNote(noteId: string | undefined): MathsUnit | undefined {
  return MATHS_UNITS.find((unit) => unit.noteId === noteId);
}

export function divisionById(id: string): { unit: MathsUnit; div: MathsDivision } | undefined {
  return DIV_BY_ID.get(id);
}

export function inDivision(q: Question, div: MathsDivision): boolean {
  if (div.by === "cat") return div.cats.includes(q.cat as TopicId);
  if (!div.cats.includes(q.cat as TopicId)) return false;
  return div.lessons.some((lesson) => mentionsLesson(q.source ?? "", lesson));
}

export function scopeKeyForTopic(topic: string | undefined): string {
  if (!topic || topic === "all") return "all";
  if (topic.startsWith("div:") || topic.startsWith("unit:")) return topic;
  return CAT_TO_SCOPE[topic] ?? topic;
}

export function questionsForScope(key: string, subject: SubjectId): Question[] {
  if (subject !== "maths") {
    return questionsFor(key === "all" ? "all" : (key as TopicId), subject);
  }
  const pool = questionsFor("all", "maths");
  if (key === "all" || key === "") return pool;
  if (key.startsWith("unit:")) {
    const unit = MATHS_UNITS.find((item) => item.id === key.slice(5));
    if (!unit) return [];
    return pool.filter((q) => unit.divisions.some((div) => inDivision(q, div)));
  }
  if (key.startsWith("div:")) {
    const hit = divisionById(key.slice(4));
    if (!hit) return [];
    return pool.filter((q) => inDivision(q, hit.div));
  }
  const mapped = scopeKeyForTopic(key);
  if (mapped !== key) return questionsForScope(mapped, subject);
  return pool.filter((q) => q.cat === key);
}

export function labelForQuestion(q: Question): string {
  for (const unit of MATHS_UNITS) {
    const div = unit.divisions.find((item) => inDivision(q, item));
    if (div) return `${unit.title} · ${div.short}`;
  }
  return q.cat;
}

export function sourcesForDivision(sources: string[], div: MathsDivision | null): string[] {
  if (!div) return sources;
  if (div.lessons.length === 0) return [];
  return sources.filter((source) => div.lessons.some((lesson) => mentionsLesson(source, lesson)));
}

type Score = { c: number; t: number };

export function scoreDivision(
  div: MathsDivision,
  qStats: Record<string, Score>,
  catStats?: Partial<Record<TopicId, Score>>,
): Score {
  let c = 0;
  let t = 0;
  for (const q of questionsForScope(`div:${div.id}`, "maths")) {
    const stat = qStats[q.q];
    if (!stat) continue;
    c += stat.c;
    t += stat.t;
  }
  if (t === 0 && div.by === "cat" && div.cats.length === 1 && catStats) {
    const stat = catStats[div.cats[0]];
    if (stat) return { c: stat.c, t: stat.t };
  }
  return { c, t };
}

export function legacyUnitScore(unit: MathsUnit, catStats: Partial<Record<TopicId, Score>>): Score {
  if (unit.id === "probability") return catStats.probability ?? { c: 0, t: 0 };
  if (unit.id === "measurement") return catStats.measurement ?? { c: 0, t: 0 };
  let c = 0;
  let t = 0;
  for (const div of unit.divisions) {
    for (const cat of div.cats) {
      const stat = catStats[cat];
      if (!stat) continue;
      c += stat.c;
      t += stat.t;
    }
  }
  return { c, t };
}
