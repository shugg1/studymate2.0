const FORMS = [
  { id: "tp", name: "Turning point", rule: "y = a(x − h)² + k" },
  { id: "factor", name: "Factor", rule: "y = a(x − p)(x − q)" },
  { id: "general", name: "General", rule: "y = ax² + bx + c" },
] as const;

const FEATURES: { feature: string; tp: string; factor: string; general: string }[] = [
  { feature: "Y-intercept", tp: "(0, ah² + k)", factor: "(0, apq)", general: "(0, c)" },
  {
    feature: "X-intercepts",
    tp: "x = h ± √(−k / a), if −k/a ≥ 0",
    factor: "x = p and x = q",
    general: "x = (−b ± √Δ) / 2a",
  },
  {
    feature: "How many roots",
    tp: "−k/a > 0 two. = 0 touches. < 0 none",
    factor: "p ≠ q two. p = q touches once",
    general: "Δ > 0 two. Δ = 0 touches. Δ < 0 none",
  },
  { feature: "Axis", tp: "x = h", factor: "x = (p + q) / 2", general: "x = −b / 2a" },
  {
    feature: "Turning point",
    tp: "(h, k)",
    factor: "((p + q) / 2, −a(p − q)² / 4)",
    general: "(−b / 2a, −Δ / 4a)",
  },
  {
    feature: "Min or max",
    tp: "a > 0 minimum. a < 0 maximum",
    factor: "a > 0 minimum. a < 0 maximum",
    general: "a > 0 minimum. a < 0 maximum",
  },
  {
    feature: "Width",
    tp: "|a| > 1 narrower than y = x². |a| < 1 wider",
    factor: "|a| > 1 narrower than y = x². |a| < 1 wider",
    general: "|a| > 1 narrower than y = x². |a| < 1 wider",
  },
];

const CONVERSIONS: { name: string; formula: string; note: string }[] = [
  {
    name: "Turning point → general",
    formula: "Expand a(x − h)² + k",
    note: "Square first, multiply by a, then add k. Check a, b and c afterwards.",
  },
  {
    name: "Factor → general",
    formula: "Expand a(x − p)(x − q)",
    note: "Every term in the first bracket times every term in the second. A minus times a minus is a plus.",
  },
  {
    name: "General → turning point",
    formula: "Complete the square, or h = −b / 2a and k = −Δ / 4a",
    note: "If a is not 1, factor a out of the x terms before you complete the square. Add and subtract (b/2)² so the graph does not move.",
  },
  {
    name: "General → factor",
    formula: "Factorise, or take the roots and rebuild y = a(x − p)(x − q)",
    note: "Monic: pair to c that adds to b. Difference of squares: subtraction only. Non-monic: ac split, and take out an HCF first. No real roots means no real factor form.",
  },
  {
    name: "Factor → turning point",
    formula: "h = (p + q) / 2, then substitute that x",
    note: "Do not expand. The midpoint of the roots is the axis. The y-value there is k.",
  },
  {
    name: "Turning point → factor",
    formula: "Set y = 0 and solve (x − h)² = −k / a",
    note: "Two roots give y = a(x − p)(x − q). One root means it touches: y = a(x − r)². If −k/a is negative, stop. There is no real factor form.",
  },
];

const GIVEN: { name: string; formula: string; note: string }[] = [
  {
    name: "Given the turning point (h, k)",
    formula: "y = a(x − h)² + k",
    note: "h and k are fixed. One other point finds a. Substituting the turning point again only gives k = k.",
  },
  {
    name: "Given the roots p and q",
    formula: "y = a(x − p)(x − q)",
    note: "The brackets are fixed. One point that is not a root finds a. Substituting a root gives 0 = 0.",
  },
  {
    name: "Given the axis x = h only",
    formula: "h is known. k and a are not",
    note: "The axis is the x-coordinate of the vertex. You still need the height k and the stretch a.",
  },
  {
    name: "Given the y-intercept (0, c) only",
    formula: "In general form the constant is c",
    note: "That is one number. It does not fix a, b, the axis, the vertex or the roots.",
  },
  {
    name: "Given only the minimum or maximum value",
    formula: "That number is k",
    note: "a > 0 means k is a minimum. a < 0 means k is a maximum. You still need h, and a point if a is unknown.",
  },
  {
    name: "Given a touch at x = r",
    formula: "y = a(x − r)²",
    note: "One repeated root. The turning point sits on the axis at (r, 0). Another point finds a.",
  },
  {
    name: "Given Δ = b² − 4ac",
    formula: "Positive: two roots. Zero: one touch. Negative: none",
    note: "The sign counts the roots. It does not, by itself, tell you what they are.",
  },
  {
    name: "Given a root at 0",
    formula: "y = ax(x − q)",
    note: "The y-intercept is already (0, 0) for every a. Ask for a different point, such as the value at x = 2.",
  },
  {
    name: "Given two points the same distance from the axis",
    formula: "They produce the same equation for a",
    note: "Either point will do. If two supplied points disagree, the information is not one quadratic.",
  },
  {
    name: "Given a model on an interval",
    formula: "Use the form, then stay inside the interval",
    note: "Ground at 0 and at r: y = ax(x − r). A vertex (h, k): y = a(x − h)² + k. If the vertex is inside the interval it is the min or max. If it is outside, check the endpoints. A value of x off the interval is not the real object.",
  },
];

const START: { name: string; detail: string }[] = [
  { name: "You want the vertex", detail: "Turning point form. It is already (h, k)." },
  { name: "You want the roots", detail: "Factor form. Set each bracket to 0. The number a is not a root." },
  { name: "You want the y-intercept", detail: "General form, or just substitute x = 0. You are evaluating, not solving." },
  { name: "The numbers are messy and it will not factor", detail: "Quadratic formula for the roots. Axis from −b / 2a if you only need the vertex." },
  { name: "You are building the rule", detail: "Vertex given: turning point form. Two roots given: factor form. Then one extra point finds a." },
];

export function FeaturesGrid() {
  return (
    <section className="mt-6">
      <h4 className="text-lg font-bold">Features grid</h4>
      <p className="mt-2 text-sm text-muted">
        The formulas as they stand. Nothing here is a slider. Read the feature off the form that already shows it, change form only when you have to, and remember that one given value rarely fixes the whole parabola.
      </p>

      <h5 className="mt-6 text-base font-bold">Which form to open</h5>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {START.map((item) => (
          <li key={item.name} className="rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3">
            <p className="text-sm font-bold">{item.name}</p>
            <p className="mt-1 text-sm text-muted">{item.detail}</p>
          </li>
        ))}
      </ul>

      <h5 className="mt-8 text-base font-bold">Read a feature</h5>
      <p className="mt-1 text-sm text-muted">Δ = b² − 4ac. The same five facts, plus how many roots and the width.</p>
      <FeatureTable />

      <MethodList
        title="Change of form"
        lede="Expand when you are leaving a bracket. Complete the square or use −b / 2a when you need the vertex out of general form. Factorise when you need the roots."
        rows={CONVERSIONS}
      />
      <MethodList
        title="Given one value"
        lede="Write the form that value already fixes. Then see what is still unknown. A root, or the vertex itself, does not find a."
        rows={GIVEN}
      />
    </section>
  );
}

function FeatureTable() {
  return (
    <>
      <div className="mt-3 hidden max-w-full overflow-x-auto md:block">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr>
              <th className="border-b border-border px-3 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
                Feature
              </th>
              {FORMS.map((form) => (
                <th key={form.id} className="border-b border-border px-3 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">{form.name}</p>
                  <p className="mt-1 font-mono text-sm font-semibold text-primary">{form.rule}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FEATURES.map((row) => (
              <tr key={row.feature}>
                <th className="border-b border-border px-3 py-3 align-top font-bold text-foreground">{row.feature}</th>
                <td className="border-b border-border px-3 py-3 align-top font-mono text-sm">{row.tp}</td>
                <td className="border-b border-border px-3 py-3 align-top font-mono text-sm">{row.factor}</td>
                <td className="border-b border-border px-3 py-3 align-top font-mono text-sm">{row.general}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 grid gap-3 md:hidden">
        {FORMS.map((form) => (
          <article key={form.id} className="rounded-[var(--radius-md)] border border-border bg-surface p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">{form.name}</p>
            <p className="mt-1 font-mono text-sm font-semibold text-primary">{form.rule}</p>
            <dl className="mt-3 space-y-2">
              {FEATURES.map((row) => (
                <div key={row.feature} className="border-t border-border pt-2">
                  <dt className="text-xs font-bold uppercase tracking-wide text-muted">{row.feature}</dt>
                  <dd className="mt-1 font-mono text-sm">
                    {form.id === "tp" ? row.tp : form.id === "factor" ? row.factor : row.general}
                  </dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
    </>
  );
}

function MethodList({
  title,
  lede,
  rows,
}: {
  title: string;
  lede: string;
  rows: { name: string; formula: string; note: string }[];
}) {
  return (
    <div className="mt-8">
      <h5 className="text-base font-bold">{title}</h5>
      <p className="mt-1 text-sm text-muted">{lede}</p>
      <div className="mt-3 overflow-hidden rounded-[var(--radius-md)] border border-border">
        {rows.map((row) => (
          <article key={row.name} className="border-b border-border px-4 py-3 last:border-b-0">
            <p className="text-sm font-bold">{row.name}</p>
            <p className="mt-1 font-mono text-sm text-primary">{row.formula}</p>
            <p className="mt-1 text-sm text-muted">{row.note}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
