/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function polygonCorners(sides: number): number {
  return sides;
}

export function polygonAddOne(startSides: number): number {
  return startSides + 1;
}

export function polygonName(sides: number): string {
  switch (sides) {
    case 3:
      return 'Triangle';
    case 4:
      return 'Square';
    case 5:
      return 'Pentagon';
    case 6:
      return 'Hexagon';
    default:
      return `${sides}-gon`;
  }
}

export function completeGraphEdges(nodes: number): number {
  return (nodes * (nodes - 1)) / 2;
}

export function triangularNumber(n: number): number {
  return (n * (n + 1)) / 2;
}

export function completeGraphEquation(nodes: number): string {
  if (nodes <= 1) return '0';
  const parts = Array.from({ length: nodes - 1 }, (_, i) => String(i + 1));
  return `${parts.join(' + ')} = ${completeGraphEdges(nodes)}`;
}

export function stackedSquareCount(n: number): number {
  return n * n;
}

export function rowTriangles(row: number): number {
  return 2 * row - 1;
}

export function stackedTriangleSum(n: number): number {
  let sum = 0;
  for (let r = 1; r <= n; r += 1) {
    sum += rowTriangles(r);
  }
  return sum;
}

export function stackedTriangleEquation(n: number): string {
  const rows = Array.from({ length: n }, (_, i) => String(rowTriangles(i + 1)));
  return `${rows.join(' + ')} = ${stackedTriangleSum(n)} = ${n} × ${n}`;
}

export function kochSegments(step: number): number {
  return 3 * Math.pow(4, step);
}

export function kochEquation(step: number): string {
  if (step === 0) return '3 sides';
  const factors = Array.from({ length: step }, () => '4').join(' × ');
  return `3 × ${factors} = ${kochSegments(step)}`;
}

export type PredictionSpec = {
  question: string;
  options: string[];
  answerValue: number;
  correct: number;
  reason: string;
};

function buildPrediction(
  question: string,
  options: number[],
  answerValue: number,
  reason: string
): PredictionSpec {
  const strOptions = options.map(String);
  return {
    question,
    options: strOptions,
    answerValue,
    correct: options.indexOf(answerValue),
    reason,
  };
}

const POLY_START = 4;
const POLY_NEXT = polygonAddOne(POLY_START);

const GRAPH_START = 3;
const GRAPH_NEXT = 4;
const GRAPH_OLD_EDGES = completeGraphEdges(GRAPH_START);
const GRAPH_NEW_EDGES = GRAPH_NEXT - 1;
const GRAPH_TOTAL_EDGES = completeGraphEdges(GRAPH_NEXT);

const STACK_N = 3;
const STACK_TOTAL = stackedTriangleSum(STACK_N);

const KOCH_STEP_1 = 1;
const KOCH_SEG_0 = kochSegments(0);
const KOCH_SEG_1 = kochSegments(KOCH_STEP_1);

const KOCH_STEP_2 = 2;
const KOCH_SEG_2 = kochSegments(KOCH_STEP_2);

export const PREDICTIONS = {
  polygon: buildPrediction(
    `Add 1 corner to a ${POLY_START}-side square. Sides now?`,
    [4, 5, 6],
    POLY_NEXT,
    `${POLY_START} sides + 1 corner = ${POLY_NEXT} sides (${polygonName(POLY_NEXT)}).`
  ),
  completeGraph: buildPrediction(
    `K₃ has ${GRAPH_OLD_EDGES} lines. Add a 4th dot. Total lines?`,
    [4, 6, 8],
    GRAPH_TOTAL_EDGES,
    `${GRAPH_OLD_EDGES} old + ${GRAPH_NEW_EDGES} new lines = ${GRAPH_TOTAL_EDGES} (${completeGraphEquation(GRAPH_NEXT)}).`
  ),
  stackedTriangle: buildPrediction(
    `Rows hold ${rowTriangles(1)} + ${rowTriangles(2)} + ${rowTriangles(3)} triangles. Total?`,
    [8, 9, 10],
    STACK_TOTAL,
    `${stackedTriangleEquation(STACK_N)} triangles.`
  ),
  kochOne: buildPrediction(
    `Start with ${KOCH_SEG_0} sides. Split each into 4 parts. Sides now?`,
    [7, 9, 12],
    KOCH_SEG_1,
    `${kochEquation(KOCH_STEP_1)} segments.`
  ),
  kochTwo: buildPrediction(
    `Step 1 has ${KOCH_SEG_1} sides. Split each into 4 for Step 2?`,
    [16, 36, 48],
    KOCH_SEG_2,
    `${KOCH_SEG_1} × 4 = ${KOCH_SEG_2} segments (${kochEquation(KOCH_STEP_2)}).`
  ),
} as const;

export type Check = {
  name: string;
  expected: string | number | boolean;
  actual: string | number | boolean;
  pass: boolean;
};

export function runSelfCheck(): Check[] {
  const rows: Check[] = [];
  const add = (
    name: string,
    expected: string | number | boolean,
    actual: string | number | boolean
  ) => {
    rows.push({ name, expected, actual, pass: expected === actual });
  };

  for (let s = 3; s <= 7; s += 1) {
    add(`Polygon with ${s} sides has ${s} corners`, s, polygonCorners(s));
  }
  add('Adding 1 corner to 4-sided square gives 5 sides', 5, polygonAddOne(4));

  for (let n = 2; n <= 6; n += 1) {
    add(
      `Complete graph K${n} edges match triangular T${n - 1}`,
      triangularNumber(n - 1),
      completeGraphEdges(n)
    );
  }

  for (let n = 1; n <= 4; n += 1) {
    add(
      `Stacked triangle rows 1..${n} equal ${n}×${n} square`,
      stackedSquareCount(n),
      stackedTriangleSum(n)
    );
  }

  add('Koch Step 0 has 3 segments', 3, kochSegments(0));
  add('Koch Step 1 has 12 segments', 12, kochSegments(1));
  add('Koch Step 2 has 48 segments', 48, kochSegments(2));
  add('Koch Step 3 has 192 segments', 192, kochSegments(3));
  add('Each Koch step multiplies by 4', 4, kochSegments(2) / kochSegments(1));

  (Object.entries(PREDICTIONS) as [string, PredictionSpec][]).forEach(([key, spec]) => {
    const validIndex = spec.correct >= 0 && spec.correct < spec.options.length;
    add(`Prediction "${key}" has valid correct index`, true, validIndex);
    add(
      `Prediction "${key}" correct option matches computed answer`,
      String(spec.answerValue),
      spec.options[spec.correct] ?? ''
    );
    add(
      `Prediction "${key}" reason contains computed answer`,
      true,
      spec.reason.includes(String(spec.answerValue))
    );
  });

  return rows;
}
