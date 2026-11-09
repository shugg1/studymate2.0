import type { TopicId } from "@/lib/science/types";

export type MatchPair = { term: string; def: string };

export const MATCH_SETS: { id: TopicId | "mix"; label: string; pairs: MatchPair[] }[] = [
  {
    id: "energy",
    label: "Energy",
    pairs: [
      { term: "Kinetic energy", def: "Energy of a moving object, Ek = ½mv²" },
      { term: "GPE", def: "Stored energy due to height, Ep = mgh" },
      { term: "Work", def: "Energy transferred when a force moves an object, W = Fs" },
      { term: "Efficiency", def: "Useful energy out ÷ total energy in × 100%" },
      { term: "Sankey diagram", def: "Arrow diagram where width shows energy amount" },
      { term: "Conservation of energy", def: "Energy cannot be created or destroyed, only transferred" },
    ],
  },
  {
    id: "light",
    label: "Light",
    pairs: [
      { term: "Law of reflection", def: "Angle of incidence equals angle of reflection" },
      { term: "Normal", def: "A line drawn at 90° to a surface at the point of incidence" },
      { term: "Refraction", def: "Bending of light when it changes speed between media" },
      { term: "TIR", def: "All light reflects inside a denser medium when i ≥ critical angle" },
      { term: "Dispersion", def: "White light splitting into ROYGBIV because colours slow by different amounts" },
      { term: "Additive primaries", def: "Red, green and blue light mix to make white" },
    ],
  },
  {
    id: "emspectrum",
    label: "EM spectrum",
    pairs: [
      { term: "Radio waves", def: "Longest wavelength EM waves; radio and TV" },
      { term: "Microwaves", def: "Heat food by vibrating water molecules; also radar" },
      { term: "Infrared", def: "Heat radiation; remotes and thermal cameras" },
      { term: "Ultraviolet", def: "Can cause sunburn and skin cancer; also makes vitamin D" },
      { term: "X-rays", def: "Pass through soft tissue; used to image bones" },
      { term: "Gamma rays", def: "Highest energy EM waves; from radioactive nuclei" },
    ],
  },
  {
    id: "electricity",
    label: "Electricity",
    pairs: [
      { term: "Current", def: "Flow of charge, measured in amps" },
      { term: "Voltage", def: "Energy per coulomb / push on charges, measured in volts" },
      { term: "Resistance", def: "Opposition to current, measured in ohms" },
      { term: "Series circuit", def: "One path; current the same everywhere; voltage shared" },
      { term: "Parallel circuit", def: "Branches; voltage the same across each; current splits" },
      { term: "Ammeter", def: "Measures current and is placed in series" },
    ],
  },
  {
    id: "radioactivity",
    label: "Radioactivity",
    pairs: [
      { term: "Isotope", def: "Same number of protons, different number of neutrons" },
      { term: "Alpha particle", def: "Helium nucleus; stopped by paper; highly ionising" },
      { term: "Beta particle", def: "Fast electron; stopped by aluminium" },
      { term: "Gamma ray", def: "EM wave; most penetrating; needs thick lead or concrete" },
      { term: "Half-life", def: "Time for half the radioactive nuclei in a sample to decay" },
      { term: "Ionising radiation", def: "Radiation that can knock electrons off atoms and damage DNA" },
    ],
  },
  {
    id: "tpform",
    label: "Turning point form",
    pairs: [
      { term: "y = a(x − h)² + k", def: "Turning point form; vertex is (h, k)" },
      { term: "h", def: "x-coordinate of the turning point; axis is x = h" },
      { term: "k", def: "y-coordinate of the turning point; min or max value" },
      { term: "a > 0", def: "Opens upward; turning point is a minimum" },
      { term: "a < 0", def: "Opens downward; turning point is a maximum" },
      { term: "|a| > 1", def: "Narrower / skinnier than y = x²" },
    ],
  },
  {
    id: "factorform",
    label: "Factor form",
    pairs: [
      { term: "Null factor law", def: "If AB = 0 then A = 0 or B = 0" },
      { term: "y = a(x − p)(x − q)", def: "Factor form; x-intercepts at p and q" },
      { term: "Axis from roots", def: "x = (p + q) / 2, the midpoint" },
      { term: "Repeated root", def: "Both factors the same; graph touches the axis" },
      { term: "y-intercept from factors", def: "Put x = 0 to get apq" },
      { term: "Sign of a", def: "Flips max/min without moving the x-intercepts" },
    ],
  },
  {
    id: "factorising",
    label: "Factorising",
    pairs: [
      { term: "Monic pair", def: "Two numbers with the right product (c) and sum (b)" },
      { term: "DOTS", def: "x² − k² = (x − k)(x + k)" },
      { term: "Perfect square", def: "x² ± 2kx + k² = (x ± k)²" },
      { term: "ac method", def: "Pair with product ac and sum b, then box" },
      { term: "HCF first", def: "Pull a common factor out; roots stay the same" },
      { term: "x² + k²", def: "Not DOTS; no real linear factors" },
    ],
  },
  {
    id: "quadraticformula",
    label: "General form",
    pairs: [
      { term: "y = ax² + bx + c", def: "General form; y-intercept is (0, c)" },
      { term: "Axis formula", def: "x = −b / 2a" },
      { term: "Quadratic formula", def: "x = (−b ± √(b² − 4ac)) / 2a" },
      { term: "Δ > 0", def: "Two distinct real x-intercepts" },
      { term: "Δ = 0", def: "One real root; graph touches the axis" },
      { term: "Δ < 0", def: "No real x-intercepts" },
    ],
  },
  {
    id: "findrule",
    label: "Finding the equation",
    pairs: [
      { term: "Two roots and a point", def: "y = a(x − p)(x − q), then substitute the extra point" },
      { term: "Turning point and a point", def: "y = a(x − h)² + k, then substitute the extra point" },
      { term: "Substitute a root", def: "Gives 0 = 0, so it does not find a" },
      { term: "Substitute the vertex again", def: "Gives k = k, so it does not find a" },
      { term: "A root at 0", def: "The y-intercept is already (0, 0) for every a" },
      { term: "Points disagree", def: "The information is not one quadratic" },
    ],
  },
  {
    id: "models",
    label: "Models",
    pairs: [
      { term: "Ground at 0 and r", def: "y = ax(x − r), only on the given span" },
      { term: "Vertex given", def: "y = a(x − h)² + k" },
      { term: "Vertex inside the interval", def: "That height is the min or max of the real object" },
      { term: "Vertex outside the interval", def: "Check the endpoints, not the off-stage vertex" },
      { term: "x outside the domain", def: "The equation need not describe the real object there" },
      { term: "Negative time root", def: "Before release, so it is not a landing time" },
    ],
  },
  {
    id: "probability",
    label: "Probability",
    pairs: [
      { term: "A ∩ B", def: "And: only the overlap of the two sets" },
      { term: "A ∪ B", def: "Or: everything in either set, including the overlap" },
      { term: "A′", def: "Not A: everything in the sample space outside A" },
      { term: "Addition rule", def: "P(A ∪ B) = P(A) + P(B) − P(A ∩ B)" },
      { term: "Mutually exclusive", def: "Intersection is empty, so the union is just the sum" },
      { term: "P(A | B)", def: "P(A ∩ B) / P(B), the overlap divided by the group you were told" },
      { term: "Independent", def: "P(A | B) = P(A), so the intersection equals the product" },
    ],
  },
  {
    id: "measurement",
    label: "Measurement",
    pairs: [
      { term: "Cylinder surface area", def: "2πr² + 2πrh" },
      { term: "Cone volume", def: "⅓πr²h" },
      { term: "Sphere surface area", def: "4πr²" },
      { term: "Sphere volume", def: "⁴⁄₃πr³" },
      { term: "Percentage error", def: "|measured − actual| ÷ actual × 100" },
      { term: "Limits of accuracy", def: "Half a unit either side of a rounded measurement" },
    ],
  },
];

