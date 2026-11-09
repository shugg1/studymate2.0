import type { SubjectId, TopicId } from "./types";

export const SCIENCE_TOPICS: TopicId[] = [
  "energy",
  "heat",
  "sound",
  "emspectrum",
  "light",
  "electricity",
  "radioactivity",
  "physics",
  "chemistry",
  "reproduction",
  "body",
  "carbon",
];

export const MATHS_TOPICS: TopicId[] = [
  "tpform",
  "intercepts",
  "factorform",
  "expanding",
  "factorising",
  "completedsquare",
  "quadraticformula",
  "findrule",
  "models",
  "probability",
  "measurement",
];

export const TOPIC_ORDER: TopicId[] = [...SCIENCE_TOPICS, ...MATHS_TOPICS];

export function topicsFor(subject: SubjectId): TopicId[] {
  return subject === "maths" ? MATHS_TOPICS : SCIENCE_TOPICS;
}

export const catNames: Record<TopicId, string> = {
  energy: "Energy & Transformations",
  heat: "Heat Transfer & Insulation",
  sound: "Sound & Waves",
  electricity: "Electricity & Circuits",
  light: "Light: Reflection, Refraction & Colour",
  emspectrum: "Electromagnetic Spectrum",
  radioactivity: "Isotopes & Radioactivity",
  physics: "Physics: Mixed",
  reproduction: "Bio: Reproduction",
  chemistry: "Chem: Atomic Structure & Reactions",
  carbon: "Earth: Carbon Cycle",
  body: "Bio: Body Regulation",
  tpform: "Turning point form",
  intercepts: "Crossing the axes",
  factorform: "Factor form",
  expanding: "Expanding",
  factorising: "Factorising",
  completedsquare: "Completing the square",
  quadraticformula: "General form & formula",
  findrule: "Finding the equation",
  models: "Models in context",
  probability: "Probability",
  measurement: "Measurement",
};

export const topicBlurb: Record<TopicId, string> = {
  energy: "Forms of energy, conservation, Sankey diagrams, work, GPE and KE.",
  heat: "Temperature, conduction, convection, radiation and insulation investigations.",
  sound: "Mechanical waves, amplitude, frequency and how sound travels.",
  electricity: "Current, voltage, resistance, series and parallel circuits.",
  light: "Visible light, reflection, refraction, lenses, TIR and colour.",
  emspectrum: "Radio to gamma: order, uses, hazards and wave properties.",
  radioactivity: "Isotopes, decay types, half-life and uses of radioisotopes.",
  physics: "Mixed physics recap across heat, energy, electricity and light.",
  reproduction: "Sexual and asexual strategies, gametes and fertilisation.",
  chemistry: "Atoms, ions, reactions, acids and the 2026 chemistry pack.",
  carbon: "Carbon cycle, photosynthesis, respiration and Earth's spheres.",
  body: "Nervous and endocrine systems, homeostasis and coordination.",
  tpform: "Read a, h and k. Turning point, opening, skinny vs wide.",
  intercepts: "Y-intercept, solving (x − h)² = c, and x-intercepts.",
  factorform: "Null factor law, roots, axis from the midpoint, sign of a.",
  expanding: "Box / FOIL, squares, difference of squares, outside multipliers.",
  factorising: "Monic pairs, DOTS, perfect squares, non-monic ac method.",
  completedsquare: "Rewrite general form to reveal the turning point.",
  quadraticformula: "ax² + bx + c, axis −b/2a, discriminant and roots.",
  findrule: "One extra point finds a. A root or the turning point itself does not.",
  models: "Build the rule, then answer only on the interval the object actually uses.",
  probability: "Venn diagrams, two-way tables, trees, the addition rule, and conditional probability.",
  measurement: "Composite area, surface area, volume, spheres, and limits of accuracy.",
};

export const SUBJECTS: { id: SubjectId; label: string; blurb: string }[] = [
  { id: "science", label: "Science", blurb: "Light, energy, electricity, radioactivity." },
  { id: "maths", label: "Maths", blurb: "Quadratics, probability and measurement." },
];
