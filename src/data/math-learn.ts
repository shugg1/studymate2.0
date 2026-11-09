export type LearnPack = {
  method: string[];
  prompt: string;
  steps: string[];
  answer: string;
  wrong: string;
  fix: string;
};

/** One teach-it pack per maths part. Not a quiz — nothing here is scored. */
export const MATHS_LEARN: Record<string, LearnPack> = {
  forms: {
    method: [
      "Name the feature you actually need: y-intercept, x-intercepts, axis, turning point, or min/max.",
      "Use the form that already shows it. Turning point form shows the vertex. Factor form shows the roots. General form shows the y-intercept.",
      "Only change form if you have to. Then expand back and check the three coefficients still match.",
    ],
    prompt: "Fastest way to the turning point of y = (x − 1)(x − 5), and what is that point?",
    steps: [
      "It is already in factor form, so the roots are 1 and 5. Don't expand yet.",
      "The axis is the midpoint of the roots: x = (1 + 5) / 2 = 3.",
      "Substitute that x: y = (3 − 1)(3 − 5) = 2 × −2 = −4.",
    ],
    answer: "Factor form is the fast one. Turning point (3, −4).",
    wrong: "I'll expand to general form before I look for the vertex.",
    fix: "You don't need to. The midpoint of the roots is the axis. Substitute that x for the y-value.",
  },
  tp: {
    method: [
      "Rewrite the bracket as (x − h). (x + 1) means h = −1, not +1.",
      "k is the number added outside the square. The turning point is (h, k) and the axis is x = h.",
      "If a is negative it opens down (a maximum). |a| > 1 is narrower than y = x². |a| < 1 is wider.",
    ],
    prompt: "Describe y = −2(x + 1)² + 5 compared with y = x².",
    steps: [
      "(x + 1) is (x − (−1)), so h = −1 and k = 5. Turning point (−1, 5).",
      "a = −2, so it opens downwards: a maximum, not a minimum.",
      "|a| = 2, which is more than 1, so the graph is narrower. The axis is x = −1.",
    ],
    answer: "Maximum at (−1, 5), narrower than y = x², axis x = −1.",
    wrong: "y = (x + 3)² − 4 has turning point (3, −4).",
    fix: "The bracket is (x − h). (x + 3) means h = −3. The turning point is (−3, −4).",
  },
  axes: {
    method: [
      "Y-intercept: substitute x = 0. You are evaluating, not solving.",
      "X-intercepts from turning point form: set y = 0, isolate the square, then take both square roots.",
      "Two signs, unless the right-hand side is 0 (it touches) or negative (no real x-intercepts).",
    ],
    prompt: "Find the intercepts of y = (x − 3)² − 16.",
    steps: [
      "Y-intercept: x = 0 gives (0 − 3)² − 16 = 9 − 16 = −7. The point is (0, −7).",
      "Set y = 0: (x − 3)² = 16.",
      "x − 3 = 4 or x − 3 = −4, so x = 7 or x = −1.",
    ],
    answer: "Y-intercept (0, −7). X-intercepts x = 7 and x = −1.",
    wrong: "From (x − 5)² = 16 I only take x − 5 = 4, so the only answer is x = 9.",
    fix: "A square equation has two roots unless the right side is 0. Also x − 5 = −4, so x = 1.",
  },
  factor: {
    method: [
      "If a product is 0, one of the factors is 0. A number in front, as long as it isn't 0, does not make a new root.",
      "The axis is the average of the roots. Substitute that x to get the turning point's y.",
      "Y-intercept: put x = 0. A minus in front flips max and min, but the intercepts stay.",
    ],
    prompt: "Turning point and y-intercept of y = (x − 1)(x − 7).",
    steps: [
      "Roots are x = 1 and x = 7. The axis is x = (1 + 7) / 2 = 4.",
      "y = (4 − 1)(4 − 7) = 3 × −3 = −9. Turning point (4, −9).",
      "Y-intercept: (0 − 1)(0 − 7) = (−1)(−7) = 7. Point (0, 7).",
    ],
    answer: "Turning point (4, −9). Y-intercept (0, 7).",
    wrong: "y = −(x − 1)(x − 7) has different x-intercepts, because of the minus.",
    fix: "The minus is a, not a root. The intercepts are the same. It only flips the parabola from a minimum to a maximum.",
  },
  expand: {
    method: [
      "Every term in the first bracket multiplies every term in the second. Then collect like terms.",
      "(x + k)² = x² + 2kx + k². The middle term is not optional. (x + k)(x − k) = x² − k², with no x term.",
      "A multiplier stays outside a square. 2(x + 3)² is not (2x + 6)².",
    ],
    prompt: "Expand (x − 2)(x − 5).",
    steps: [
      "x × x = x². x × −5 = −5x. −2 × x = −2x. −2 × −5 = +10.",
      "The middle terms collect: −5x − 2x = −7x.",
    ],
    answer: "x² − 7x + 10. The last term is positive, because a negative times a negative is positive.",
    wrong: "(x − 2)(x − 5) = x² − 7x − 10.",
    fix: "(−2)(−5) = +10, not −10. The expanded form is x² − 7x + 10.",
  },
  factorise: {
    method: [
      "For x² + bx + c, find two numbers that multiply to c and add to b. Then write (x + m)(x + n) and expand to check.",
      "Difference of two squares only works for a subtraction: x² − k² = (x − k)(x + k). x² + 16 is not that.",
      "If a is not 1, find a pair with product ac and sum b, split the middle term, then take common factors. An HCF pulled out first does not change the roots.",
    ],
    prompt: "Factorise x² − 5x + 6.",
    steps: [
      "You need two numbers with product +6 and sum −5.",
      "−2 and −3: product +6, sum −5.",
    ],
    answer: "(x − 2)(x − 3). Expand it back if you want the check.",
    wrong: "x² + 16 = (x − 4)(x + 4).",
    fix: "(x − 4)(x + 4) is x² − 16. A sum of squares does not factor over the reals, and the graph has no x-intercepts.",
  },
  square: {
    method: [
      "Halve the coefficient of x and square it. Add that number and subtract it again, so the expression does not change.",
      "If a is not 1, factor a out of the x terms first. Don't expand the outer minus until the correction is in place.",
      "Read (h, k) off the finished form. If the turning point is on the wrong side of the x-axis for the way it opens, there are no real x-intercepts.",
    ],
    prompt: "Complete the square: x² + 10x + 31.",
    steps: [
      "Half of 10 is 5, and 5² = 25.",
      "x² + 10x + 25 − 25 + 31 = (x + 5)² + 6.",
      "The turning point is (−5, 6). It is a minimum above the x-axis.",
    ],
    answer: "(x + 5)² + 6. No real x-intercepts.",
    wrong: "I added 25 to x² + 10x + 18 and wrote (x + 5)² + 18.",
    fix: "Adding 25 alone changes the graph. (x + 5)² is x² + 10x + 25, so x² + 10x + 18 = (x + 5)² − 7.",
  },
  formula: {
    method: [
      "In y = ax² + bx + c the y-intercept is (0, c). The axis is x = −b / 2a. Substitute that x to get the turning point.",
      "Δ = b² − 4ac. Positive: two real roots. Zero: the graph touches. Negative: it misses the x-axis.",
      "x = (−b ± √Δ) / 2a. The sign in front of b is minus. Factorise if the numbers are nice; use this when they aren't.",
    ],
    prompt: "Axis, turning point and roots of y = x² − 6x + 8.",
    steps: [
      "a = 1, b = −6, c = 8. Axis x = −(−6) / 2 = 3.",
      "y = 9 − 18 + 8 = −1. Turning point (3, −1), and a is positive so it is a minimum.",
      "Δ = 36 − 32 = 4. x = (6 ± 2) / 2, so x = 4 or x = 2.",
    ],
    answer: "Axis x = 3. Turning point (3, −1). Roots x = 2 and x = 4.",
    wrong: "The quadratic formula is (b ± √(b² − 4ac)) / 2a.",
    fix: "The front of the formula is −b, not +b. x = (−b ± √(b² − 4ac)) / 2a.",
  },
  venn: {
    method: [
      "The four regions — A only, both, B only, neither — add up to n(ξ). Use that as a check.",
      "“Only” is not a symbol. A only is the part of A outside the overlap.",
      "n(A ∪ B) = n(A) + n(B) − n(A ∩ B), because the overlap was counted twice.",
    ],
    prompt: "A Venn diagram has 7 in A only, 5 in both, 9 in B only and 4 in neither. Find n(ξ) and n(A ∪ B).",
    steps: [
      "Everything in the box: 7 + 5 + 9 + 4 = 25. That is n(ξ).",
      "The union is every region except neither: 7 + 5 + 9 = 21.",
      "Check with the formula. n(A) = 12, n(B) = 14, overlap 5. 12 + 14 − 5 = 21.",
    ],
    answer: "n(ξ) = 25 and n(A ∪ B) = 21.",
    wrong: "n(A ∪ B) = n(A) + n(B) = 12 + 14 = 26.",
    fix: "The 5 in the overlap were in both counts. Subtract them once: 12 + 14 − 5 = 21.",
  },
  table: {
    method: [
      "A two-way table is the same four regions as a Venn diagram. Rows are A and not A. Columns are B and not B.",
      "Fill the cell you know, then subtract from the row and column totals.",
      "Neither is the grand total minus the union. The grand total is n(ξ).",
    ],
    prompt: "25 students: 14 bike, 12 skateboard, 5 both. Find how many bike only, and how many do neither.",
    steps: [
      "Bike only = 14 − 5 = 9. Skateboard only = 12 − 5 = 7.",
      "Union = 9 + 5 + 7 = 21.",
      "Neither = 25 − 21 = 4.",
    ],
    answer: "9 bike only, 4 neither. P(bike and not skateboard) = 9/25.",
    wrong: "Neither is 25 − 14 − 12, which is negative, so the question is wrong.",
    fix: "The 5 who do both are inside each of those totals. 25 − (14 + 12 − 5) = 4.",
  },
  steps: {
    method: [
      "List the ordered pairs, or just multiply the number of choices at each stage.",
      "Without replacement, the second stage has one fewer option. Don't count drawing the same item twice.",
      "“Given” changes the denominator to the outcomes that fit the condition, not the whole table.",
    ],
    prompt: "Two letters are drawn in order from BOOK, without replacement. Find P(both are O).",
    steps: [
      "Four letters, and the second draw has three left: 4 × 3 = 12 equally likely outcomes.",
      "Both O: 2 choices for the first O, then 1 left. That is 2 outcomes.",
      "2/12 = 1/6.",
    ],
    answer: "1/6.",
    wrong: "There are 4 × 4 = 16 outcomes, including drawing the same letter twice.",
    fix: "Without replacement the letter is not put back. The second draw has 3 letters, so there are 12 outcomes, not 16.",
  },
  tree: {
    method: [
      "Multiply the probabilities along one branch. Add the branches that fit the question.",
      "Without replacement, the second denominator drops by 1. The numerator drops only if that colour was the one taken.",
      "If a box is chosen first, don't pour the counters into one pile. Each box was equally likely, even if one holds more counters.",
    ],
    prompt: "A bag has 4 red and 3 blue. Two draws without replacement. Find P(both red).",
    steps: [
      "First red is 4/7. Three red remain, and six marbles remain, so the second red is 3/6.",
      "Multiply along the branch: 4/7 × 3/6 = 12/42.",
      "12/42 simplifies by 6: 2/7.",
    ],
    answer: "2/7.",
    wrong: "P(both red) = 4/7 × 4/7.",
    fix: "That is with replacement. The second draw is 3/6, because a red marble has left the bag.",
  },
  addition: {
    method: [
      "P(A or B) = P(A) + P(B) − P(A and B). Subtract the overlap once.",
      "Mutually exclusive means the overlap is 0, so you really can just add.",
      "If the two probabilities already add to more than 1, they cannot be mutually exclusive. The smallest possible overlap is P(A) + P(B) − 1.",
    ],
    prompt: "24 people: 15 drink coffee, 11 drink tea, 6 drink both. Find P(coffee or tea) and P(neither).",
    steps: [
      "Union: 15/24 + 11/24 − 6/24 = 20/24 = 5/6.",
      "Neither is the complement of that union: 1 − 5/6 = 1/6.",
    ],
    answer: "P(coffee or tea) = 5/6. P(neither) = 1/6.",
    wrong: "Hearts or kings on a card is mutually exclusive, so just add the two probabilities.",
    fix: "The king of hearts is in both sets. Hearts or clubs is the mutually exclusive pair. Hearts or kings is not.",
  },
  conditional: {
    method: [
      "P(A given B) = n(A and B) / n(B). The denominator is the group you have been told you are inside.",
      "Independent means the condition changes nothing: P(A given B) = P(A). Same statement as P(A and B) = P(A) × P(B).",
      "If both probabilities are above zero, the events cannot be mutually exclusive and independent. Given B, a mutually exclusive A would have probability 0.",
    ],
    prompt: "24 students: 15 play netball, 13 play hockey, 7 play both. Are the sports independent?",
    steps: [
      "P(hockey given netball) = 7/15.",
      "P(hockey) = 13/24.",
      "7/15 is about 0.47 and 13/24 is about 0.54. They are not equal.",
    ],
    answer: "No. Knowing someone plays netball changes the probability they play hockey.",
    wrong: "They share 7 students, so the sports are independent.",
    fix: "An overlap does not mean independence. Independence is when that overlap equals the product of the separate probabilities. 7/24 is not (15/24) × (13/24).",
  },
  area: {
    method: [
      "Split the picture into shapes you know. Add the pieces that are there. Subtract holes and cut-outs.",
      "Perimeter is the outside only. The join where two shapes meet is inside, so it is not part of the perimeter.",
      "A semicircle on the side of a rectangle fits only if the diameter equals that side. The radius is half the side.",
    ],
    prompt: "A lawn is a 10 m by 15 m rectangle with a semicircle of radius 5 m on one end. Find the area.",
    steps: [
      "Rectangle: 10 × 15 = 150.",
      "Semicircle: ½ × π × 5² = 12.5π, about 39.27.",
      "Add them. The join is not a hole, so you do not subtract it from the area.",
    ],
    answer: "About 189.27 m².",
    wrong: "The perimeter of that lawn includes the diameter of the semicircle.",
    fix: "The diameter is the join with the rectangle. It is inside the shape, so it is not part of the outside boundary.",
  },
  prismsa: {
    method: [
      "Cube: 6a². Rectangular prism: 2(lw + lh + wh). That counts every face twice, in pairs.",
      "Cylinder: two circles plus the curved side, 2πr² + 2πrh. Lying on its side does not change the formula.",
      "Open top: leave that face out. Stacked solids: don't count a face that is glued to another face.",
    ],
    prompt: "Surface area of a cube of side 5 cm, and of a 6 cm by 4 cm by 3 cm prism.",
    steps: [
      "Cube: 6 × 5² = 6 × 25 = 150.",
      "Prism pairs: 6×4 = 24, 6×3 = 18, 4×3 = 12. Sum 54, then double it.",
    ],
    answer: "Cube 150 cm². Prism 108 cm².",
    wrong: "An open-top tank has the same surface area as the closed prism.",
    fix: "Leave the missing face out. An open tank is the base plus the walls, not all six faces.",
  },
  conesa: {
    method: [
      "If you are given the vertical height of a cone, find the slant first: l = √(r² + h²).",
      "Curved surface is πrl. Total surface area adds the base: πr² + πrl.",
      "For a square pyramid the face slant goes to the middle of a side, ℓ = √(h² + (a/2)²), not to the corner. Total surface area is a² + 2aℓ.",
    ],
    prompt: "Total surface area of a cone with radius 8 cm and vertical height 15 cm.",
    steps: [
      "Slant l = √(8² + 15²) = √(64 + 225) = √289 = 17.",
      "Base π × 64, curved π × 8 × 17 = 136π.",
      "64π + 136π = 200π.",
    ],
    answer: "200π cm², about 628.32 cm².",
    wrong: "I put the vertical height 15 straight into πrl as the slant.",
    fix: "15 is h, not l. The slant is the hypotenuse of the right triangle, which is 17.",
  },
  prismvol: {
    method: [
      "Volume of a prism or a cylinder is the area of the cross-section times the length.",
      "Cylinder: V = πr²h. Cube: V = a³. Rectangular prism: V = lwh.",
      "1 cm³ = 1 mL and 1 m³ = 1000 L. Convert the lengths into the same unit before you multiply.",
    ],
    prompt: "A tank is 1.2 m by 0.5 m by 0.4 m. How many litres does it hold?",
    steps: [
      "Volume in cubic metres: 1.2 × 0.5 × 0.4 = 0.24.",
      "1 m³ = 1000 L, so multiply by 1000.",
    ],
    answer: "240 L.",
    wrong: "0.24 m³ is 0.24 litres.",
    fix: "A cubic metre is 1000 litres, not 1. 0.24 m³ is 240 L.",
  },
  conevol: {
    method: [
      "A pyramid or a cone is one third of the prism with the same base and the same height. V = ⅓ × base area × height.",
      "For a cone that is V = ⅓πr²h. Use the vertical height, not the slant.",
      "Similar cones: the volume scale is the cube of the length scale. Half the volume means the depth is the cube root of 1/2 of the full height.",
    ],
    prompt: "Volume of a square pyramid with base edge 9 cm and height 8 cm.",
    steps: [
      "Base area = 9 × 9 = 81.",
      "V = ⅓ × 81 × 8 = 27 × 8.",
    ],
    answer: "216 cm³.",
    wrong: "A cone of radius 3 cm and height 10 cm has volume π × 9 × 10.",
    fix: "That is the cylinder. The cone is one third of it, about 94.25 cm³, not 282.74 cm³.",
  },
  sphere: {
    method: [
      "Use the radius. If the question gives the diameter, halve it before either formula.",
      "Surface area 4πr². Volume ⁴⁄₃πr³. A hemisphere's volume is half of that: ²⁄₃πr³.",
      "A solid hemisphere includes the flat face. Curved surface 2πr² plus the circle πr² is 3πr².",
    ],
    prompt: "Surface area and volume of a sphere of radius 4 cm.",
    steps: [
      "Surface area: 4π × 4² = 4π × 16 = 64π, about 201.06.",
      "Volume: ⁴⁄₃π × 4³ = ⁴⁄₃π × 64 = 256π/3, about 268.08.",
    ],
    answer: "About 201.06 cm² and 268.08 cm³.",
    wrong: "Diameter 14 m, so I substitute 14 into 4πr².",
    fix: "14 is the diameter. The radius is 7. Surface area is 4π × 49 = 196π, about 615.75 m².",
  },
  accuracy: {
    method: [
      "Percentage error = |measured − actual| / actual × 100. The actual value is the denominator, not the measured one.",
      "On the sheet, accuracy is 100 minus that error. A 1% error is 99% accuracy.",
      "To the nearest unit, the true value sits within half a unit. For a rectangle, the lower perimeter uses both lower limits, and the upper area uses both upper limits.",
    ],
    prompt: "A recipe needs 200 g and you pour 220 g. Also, a pencil is recorded as 14 cm to the nearest centimetre. Find the percentage error and the limits.",
    steps: [
      "Error = |220 − 200| / 200 × 100 = 20/200 × 100 = 10%.",
      "14 cm to the nearest centimetre can be anything from half a centimetre below to half a centimetre above.",
    ],
    answer: "10% error. Limits 13.5 cm to 14.5 cm.",
    wrong: "Percentage error = 20/220, about 9.1%.",
    fix: "Divide by the actual amount, which is 200 g, not by the amount you poured.",
  },
  findrule: {
    method: [
      "Write the form the information already gives. Two roots: y = a(x − p)(x − q). A turning point: y = a(x − h)² + k.",
      "Substitute a point that is not a root and not the turning point. Solve that one equation for a.",
      "Check the finished rule against every point you were given. If two points disagree, it is not one quadratic.",
    ],
    prompt: "Roots −2 and 3, and the graph passes through (0, −12). Find the equation.",
    steps: [
      "The roots fix the brackets: y = a(x + 2)(x − 3). Leave a unknown.",
      "Put in (0, −12): −12 = a(2)(−3) = −6a, so a = 2.",
      "Check the point you used: 2(2)(−3) = −12. The roots still give 0.",
    ],
    answer: "y = 2(x + 2)(x − 3).",
    wrong: "I'll substitute the root x = −2 to find a.",
    fix: "A root makes both sides 0. That is 0 = 0, which is true for every a. Use a point that is not a root.",
  },
  models: {
    method: [
      "Pick the form, then find a. Ground at 0 and at r: y = ax(x − r). A vertex (h, k): y = a(x − h)² + k.",
      "Answer only on the interval you were given. Outside it, the equation need not describe the bridge, cable or roof.",
      "If the vertex is inside the interval, that height is the min or max. If it is outside, check the endpoints. A solution with x < 0 is not a time after release.",
    ],
    prompt: "A roof meets the ground at x = 0 and x = 8 and passes through (2, 6), in metres. How high is it at x = 3?",
    steps: [
      "y = ax(x − 8). The point (2, 6): 6 = a(2)(−6) = −12a, so a = −1/2.",
      "y = −½x(x − 8). At x = 3: y = −½(3)(−5) = 7.5.",
      "The roof only uses 0 ≤ x ≤ 8. x = 3 is inside that interval, so 7.5 m is a real height of the roof.",
    ],
    answer: "7.5 m. The rule is y = −½x(x − 8), and it only describes the roof for 0 ≤ x ≤ 8.",
    wrong: "The full parabola is also 0 at a negative x, so that is another point where the ball lands.",
    fix: "Time starts at release. A negative root is before the ball is thrown, so it is not a landing time. Use the root that is after x = 0.",
  },
};
