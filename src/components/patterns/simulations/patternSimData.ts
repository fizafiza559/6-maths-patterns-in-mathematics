/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SubTabId } from '../../../content/sections';
import { ClassroomStep } from '../../../engine/useProgressiveStep';
import {
  completeGraphEdges,
  kochSegments,
  polygonCorners,
  rowTriangles,
  stackedSquareCount,
  stackedTriangleSum,
} from '../shapeMirror/selfcheck';

export type SimTopicId = Exclude<
  SubTabId,
  'sol-sec-1-1' | 'sol-sec-1-2' | 'sol-sec-1-3' | 'sol-sec-1-4' | 'sol-sec-1-5-6'
>;

const TOPIC_NCERT_REFS: Record<SimTopicId, string> = {
  'what-is-math': 'Figure It Out (p. 2)',
  'humanity-forward': 'Figure It Out (p. 2-3)',
  'number-sequences': 'Table 1 (p. 4)',
  'sequence-rules': 'Figure It Out (p. 3)',
  'pictorial-dots': 'Table 2 (p. 5)',
  'number-36-magic': 'Figure It Out (p. 5)',
  'hexagonal-numbers': 'Figure It Out (p. 5-6)',
  'powers-dimensions': 'Figure It Out (p. 6)',
  'odd-sum-square': 'Figure It Out (p. 8)',
  'up-down-square': 'Figure It Out (p. 9)',
  'triangular-pairs': 'Figure It Out (p. 9)',
  'hexagonal-to-cubes': 'Figure It Out (p. 10)',
  'powers-of-2-sum': 'Figure It Out (p. 10)',
  'regular-polygons': 'Table 3 (p. 11)',
  'complete-graphs': 'Figure It Out (p. 11)',
  'stacked-shapes': 'Figure It Out (p. 12)',
  'koch-snowflake': 'Figure It Out (p. 12)',
  'shape-number-insights': 'Figure It Out (p. 12)',
  'chapter-summary': 'Chapter 1 Summary (p. 12)',
};

const RAW_PATTERN_SIM_STEPS: Record<SimTopicId, ClassroomStep[]> = {
  'what-is-math': [
    {
      id: 'wim-1',
      title: 'Repeating shapes',
      headline: 'Find what repeats next',
      focusWord: 'repeats',
      question: 'Look at the row and name shape 7.',
      teacherPrompt: 'Where do you see repeating pairs like this around our classroom?',
      hasPretraining: true,
      components: [
        { id: 'c1', pictureLabel: '○ Circle', wordLabel: 'First shape', symbolLabel: 'A = Circle', anchor: { x: 82, y: 180 } },
        { id: 's1', pictureLabel: '□ Square', wordLabel: 'Second shape', symbolLabel: 'B = Square', anchor: { x: 156, y: 180 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: '○, □ pair', wordLabel: 'Repeats twice', symbolLabel: 'A, B unit', anchor: { x: 119, y: 112 } },
        { id: 'r2', pictureLabel: '○ Slot 7', wordLabel: 'Circle next', symbolLabel: '7 → A', anchor: { x: 525, y: 120 } },
      ],
      equationLines: ['1: ○   2: □', '3: ○   4: □', '5: ○   6: □', '7 → ○'],
      reprSummary: {
        picture: 'Circle and square take turns.',
        words: 'Each pair repeats in order.',
        symbol: 'Odd slots = A, even = B',
      },
      check: {
        prompt: 'What belongs in slot 7?',
        options: [
          { id: 'circle', text: 'Circle', isCorrect: true, reason: 'Each pair starts fresh with a circle.' },
          { id: 'square', text: 'Square', isCorrect: false, reason: 'Slot 6 already ended with a square.' },
        ],
      },
    },
    {
      id: 'wim-2',
      title: 'Growing dots',
      headline: 'Count how dots grow',
      focusWord: 'grow',
      question: 'See how many new dots join each figure.',
      teacherPrompt: 'How can you jump straight to Figure 5 without drawing all dots?',
      components: [
        { id: 'f1', pictureLabel: '1 dot', wordLabel: 'Start with 1', symbolLabel: 'n₁ = 1', anchor: { x: 130, y: 225 } },
        { id: 'f2', pictureLabel: '3 dots', wordLabel: 'Add 2 dots', symbolLabel: '1 + 2 = 3', anchor: { x: 255, y: 195 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: '1, 3, 5', wordLabel: 'Plus 2 each', symbolLabel: '+2 step', anchor: { x: 255, y: 135 } },
        { id: 'r2', pictureLabel: '7 dots', wordLabel: 'Fig 4 has 7', symbolLabel: '5 + 2 = 7', anchor: { x: 505, y: 85 } },
      ],
      equationLines: ['Fig 1 = 1', 'Fig 2 = 1 + 2 = 3', 'Fig 3 = 3 + 2 = 5', 'Fig 4 = 5 + 2 = 7'],
      reprSummary: {
        picture: 'Each tower grows by two dots.',
        words: 'You add two dots every step.',
        symbol: 'Next = Current + 2',
      },
      check: {
        prompt: 'How many dots in Figure 4?',
        options: [
          { id: '7', text: '7 dots', isCorrect: true, reason: 'You add 2 dots to 5.' },
          { id: '6', text: '6 dots', isCorrect: false, reason: 'Check the jump from 3 to 5.' },
        ],
      },
    },
    {
      id: 'wim-3',
      title: 'Moon cycles',
      headline: 'Spot cycles in nature',
      focusWord: 'cycles',
      question: 'Track how many days a full moon repeats.',
      teacherPrompt: 'What other cycles in nature help farmers or travellers plan ahead?',
      components: [
        { id: 'd0', pictureLabel: 'Full Moon', wordLabel: 'Day 0 bright', symbolLabel: 't = 0', anchor: { x: 110, y: 185 } },
        { id: 'd15', pictureLabel: 'New Moon', wordLabel: 'Day 15 dark', symbolLabel: 't = 15', anchor: { x: 295, y: 185 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: 'Half cycle', wordLabel: '15 days', symbolLabel: 'T / 2 ≈ 15', anchor: { x: 202, y: 132 } },
        { id: 'r2', pictureLabel: 'Full again', wordLabel: '30 days', symbolLabel: 'T ≈ 30 d', anchor: { x: 480, y: 132 } },
      ],
      equationLines: ['Day 0 = Full', 'Day 15 = New', 'Day 30 = Full', 'Cycle ≈ 30 days'],
      reprSummary: {
        picture: 'Moon shapes repeat on a loop.',
        words: 'Same phase returns every 30 days.',
        symbol: 'Period ≈ 30 days',
      },
    },
  ],

  'humanity-forward': [
    {
      id: 'hum-1',
      title: 'Planet orbits',
      headline: 'Math guides space orbits',
      focusWord: 'orbits',
      question: 'Compare inner and outer paths around a star.',
      teacherPrompt: 'Why do engineers need exact orbit rules before launching a satellite?',
      components: [
        { id: 'sun', pictureLabel: 'Center star', wordLabel: 'Pulls inward', symbolLabel: 'Focus', anchor: { x: 250, y: 185 } },
        { id: 'sat', pictureLabel: 'Spacecraft', wordLabel: 'Outer path', symbolLabel: 'r = large', anchor: { x: 455, y: 128 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: 'Inner ring', wordLabel: 'Fast trip', symbolLabel: 'Small r', anchor: { x: 290, y: 120 } },
        { id: 'r2', pictureLabel: 'Outer ring', wordLabel: 'Longer trip', symbolLabel: 'T² ∝ r³', anchor: { x: 440, y: 78 } },
      ],
      equationLines: ['Near star → fast', 'Far star → slow', 'T² ∝ r³'],
      reprSummary: {
        picture: 'Wider ellipse means a longer loop.',
        words: 'Farther orbits take more time.',
        symbol: 'Larger r → larger T',
      },
    },
    {
      id: 'hum-2',
      title: 'DNA base pairs',
      headline: 'Match DNA base pairs',
      focusWord: 'pairs',
      question: 'Match each top letter with its lower partner.',
      teacherPrompt: 'Why is a fixed pairing rule helpful when a cell copies DNA?',
      components: [
        { id: 'top', pictureLabel: 'Top A-T-C-G', wordLabel: 'Code letters', symbolLabel: 'Strand 1', anchor: { x: 275, y: 110 } },
        { id: 'bond', pictureLabel: 'Pair links', wordLabel: 'Fixed bonds', symbolLabel: 'A↔T, C↔G', anchor: { x: 320, y: 180 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: 'A meets T', wordLabel: 'First pair', symbolLabel: 'A ↔ T', anchor: { x: 228, y: 275 } },
        { id: 'r2', pictureLabel: 'C meets G', wordLabel: 'Second pair', symbolLabel: 'C ↔ G', anchor: { x: 418, y: 275 } },
      ],
      equationLines: ['Top: A  T  C  G', 'Bot: T  A  G  C', 'A ↔ T   C ↔ G'],
      reprSummary: {
        picture: 'Every rung joins a matching pair.',
        words: 'A pairs with T, C with G.',
        symbol: 'A↔T, C↔G',
      },
    },
    {
      id: 'hum-3',
      title: 'Binary switches',
      headline: 'Zeros and ones run chips',
      focusWord: 'chips',
      question: 'Flip switches A and B to test AND.',
      teacherPrompt: 'How could just 0 and 1 represent letters, photos, and music?',
      components: [
        { id: 'a', pictureLabel: 'Switch A', wordLabel: 'On or Off', symbolLabel: 'A ∈ {0,1}', anchor: { x: 140, y: 133 } },
        { id: 'b', pictureLabel: 'Switch B', wordLabel: 'On or Off', symbolLabel: 'B ∈ {0,1}', anchor: { x: 140, y: 225 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: 'AND gate', wordLabel: 'Needs both', symbolLabel: 'A · B', anchor: { x: 312, y: 112 } },
        { id: 'r2', pictureLabel: 'Lamp output', wordLabel: 'On when 1,1', symbolLabel: 'OUT = A∧B', anchor: { x: 482, y: 130 } },
      ],
      equationLines: ['1 AND 0 = 0', '0 AND 1 = 0', '1 AND 1 = 1'],
      reprSummary: {
        picture: 'Both wires on lights the bulb.',
        words: 'Output is 1 when both are 1.',
        symbol: 'OUT = A ∧ B',
      },
    },
  ],

  'number-sequences': [
    {
      id: 'ns-1',
      title: 'Triangular jumps',
      headline: 'Notice jumps that grow',
      focusWord: 'grow',
      question: 'Add the next counting jump to 28.',
      teacherPrompt: 'How is this jump pattern different from counting odd numbers?',
      hasPretraining: true,
      components: [
        { id: 't1', pictureLabel: '1, 3, 6, 10', wordLabel: 'First 4 terms', symbolLabel: 'T₁..T₄', anchor: { x: 165, y: 173 } },
        { id: 't2', pictureLabel: '15, 21, 28', wordLabel: 'Next 3 terms', symbolLabel: '+5, +6, +7', anchor: { x: 385, y: 173 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: 'Growing arcs', wordLabel: '+2, +3, +4…', symbolLabel: 'Δ = +n', anchor: { x: 260, y: 108 } },
        { id: 'r2', pictureLabel: 'Next box', wordLabel: '28 + 8 = 36', symbolLabel: 'T₈ = 36', anchor: { x: 527, y: 112 } },
      ],
      equationLines: ['1 + 2 = 3', '3 + 3 = 6', '6 + 4 = 10', '21 + 7 = 28', '28 + 8 = 36'],
      reprSummary: {
        picture: 'Each arc grows 1 step wider.',
        words: 'You add 1 more each step.',
        symbol: 'Tₙ = Tₙ₋₁ + n',
      },
      check: {
        prompt: 'What comes right after 28?',
        options: [
          { id: '36', text: '36', isCorrect: true, reason: 'Add +8 after adding +7.' },
          { id: '35', text: '35', isCorrect: false, reason: 'Adding 7 keeps the jump the same.' },
        ],
      },
    },
    {
      id: 'ns-2',
      title: 'Virahānka rule',
      headline: 'Add the two before',
      focusWord: 'two',
      question: 'Combine 13 and 21 to find term 8.',
      teacherPrompt: 'Where have you seen petals or spirals follow Virahānka numbers?',
      components: [
        { id: 'v1', pictureLabel: '13 box', wordLabel: 'Two back', symbolLabel: 'a₆ = 13', anchor: { x: 388, y: 173 } },
        { id: 'v2', pictureLabel: '21 box', wordLabel: 'One back', symbolLabel: 'a₇ = 21', anchor: { x: 452, y: 173 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: 'Two arrows', wordLabel: 'Sum previous 2', symbolLabel: '13 + 21', anchor: { x: 430, y: 98 } },
        { id: 'r2', pictureLabel: '34 box', wordLabel: 'Equals 34', symbolLabel: 'a₈ = 34', anchor: { x: 527, y: 222 } },
      ],
      equationLines: ['1 + 2 = 3', '2 + 3 = 5', '5 + 8 = 13', '8 + 13 = 21', '13 + 21 = 34'],
      reprSummary: {
        picture: 'Two previous boxes feed the next.',
        words: 'Add the last two numbers.',
        symbol: 'aₙ = aₙ₋₁ + aₙ₋₂',
      },
      check: {
        prompt: 'What is 13 + 21?',
        options: [
          { id: '34', text: '34', isCorrect: true, reason: 'Sum of the two preceding terms.' },
          { id: '29', text: '29', isCorrect: false, reason: 'Add 13 and 21, not 8 and 21.' },
        ],
      },
    },
    {
      id: 'ns-3',
      title: 'Powers of 2 & 3',
      headline: 'Double or triple each step',
      focusWord: 'triple',
      question: 'Compare doubling (×2) with tripling (×3).',
      teacherPrompt: 'Why does tripling pass doubling so fast after just five steps?',
      components: [
        { id: 'p2', pictureLabel: 'Row 1: ×2', wordLabel: 'Doubles fast', symbolLabel: '2ⁿ', anchor: { x: 250, y: 148 } },
        { id: 'p3', pictureLabel: 'Row 2: ×3', wordLabel: 'Triples faster', symbolLabel: '3ⁿ', anchor: { x: 250, y: 232 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: '64 → 128', wordLabel: 'Times 2', symbolLabel: '2⁷ = 128', anchor: { x: 520, y: 112 } },
        { id: 'r2', pictureLabel: 'Up to 243', wordLabel: 'Times 3', symbolLabel: '3⁵ = 243', anchor: { x: 440, y: 270 } },
      ],
      equationLines: ['2⁴ = 16   3⁴ = 81', '2⁵ = 32   3⁵ = 243', '2⁶ = 64', '2⁷ = 128'],
      reprSummary: {
        picture: 'Bottom row outruns top row.',
        words: 'Multiplying by 3 beats multiplying by 2.',
        symbol: '×2 vs ×3',
      },
    },
  ],

  'sequence-rules': [
    {
      id: 'sr-1',
      title: 'Cube rule',
      headline: 'Test rules on every term',
      focusWord: 'every',
      question: 'Use the cube rule to find 7 × 7 × 7.',
      teacherPrompt: 'Why is checking only the first two numbers never enough to prove a rule?',
      components: [
        { id: 'c4', pictureLabel: '64 box', wordLabel: '4 cubed', symbolLabel: '4³ = 64', anchor: { x: 258, y: 170 } },
        { id: 'c6', pictureLabel: '216 box', wordLabel: '6 cubed', symbolLabel: '6³ = 216', anchor: { x: 382, y: 170 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: 'n × n × n', wordLabel: 'Cube rule', symbolLabel: 'n³', anchor: { x: 240, y: 112 } },
        { id: 'r2', pictureLabel: '343, 512, 729', wordLabel: 'Next 3 cubes', symbolLabel: '7³, 8³, 9³', anchor: { x: 524, y: 118 } },
      ],
      equationLines: ['4³ = 64', '5³ = 125', '6³ = 216', '7³ = 343'],
      reprSummary: {
        picture: 'Boxes show 1 to 6 cubed.',
        words: 'Multiply each number by itself twice.',
        symbol: 'aₙ = n³',
      },
    },
    {
      id: 'sr-2',
      title: 'Explore Table 1',
      headline: 'Pick any Table 1 rule',
      focusWord: 'Table 1',
      question: 'Switch sequences below to check the next three terms.',
      teacherPrompt: 'Which two sequences in Table 1 both start with 1, 3, ...?',
      components: [
        { id: 'terms', pictureLabel: 'First 6 terms', wordLabel: 'Known start', symbolLabel: 'a₁..a₆', anchor: { x: 225, y: 170 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: 'Given terms', wordLabel: 'Check pattern', symbolLabel: 'Rule check', anchor: { x: 225, y: 118 } },
        { id: 'r2', pictureLabel: 'Next 3', wordLabel: 'Predicted terms', symbolLabel: 'a₇, a₈, a₉', anchor: { x: 524, y: 118 } },
      ],
      equationLines: ['81 × 3 = 243', '243 × 3 = 729', '729 × 3 = 2,187'],
      reprSummary: {
        picture: 'Compare given boxes and new boxes.',
        words: 'Use the selector to test all 10.',
        symbol: 'Table 1 rules',
      },
    },
  ],

  'pictorial-dots': [
    {
      id: 'pd-1',
      title: 'Triangle dot grids',
      headline: 'Why dots make triangles',
      focusWord: 'triangles',
      question: 'Add a 5-dot bottom row to make T5.',
      teacherPrompt: 'How does drawing dots show why T5 equals 1 + 2 + 3 + 4 + 5?',
      hasPretraining: true,
      components: [
        { id: 't3', pictureLabel: '6 dots', wordLabel: '3 rows high', symbolLabel: 'T₃ = 6', anchor: { x: 286, y: 160 } },
        { id: 't4', pictureLabel: '10 dots', wordLabel: '4 rows high', symbolLabel: 'T₄ = 10', anchor: { x: 391, y: 165 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: '+1 per row', wordLabel: 'Rows 1..4', symbolLabel: '1+2+3+4', anchor: { x: 250, y: 100 } },
        { id: 'r2', pictureLabel: '15 dots', wordLabel: 'Row 5 adds 5', symbolLabel: 'T₅ = 15', anchor: { x: 495, y: 105 } },
      ],
      equationLines: ['T₃ = 1 + 2 + 3 = 6', 'T₄ = 6 + 4 = 10', 'T₅ = 10 + 5 = 15'],
      reprSummary: {
        picture: 'Each bottom row is 1 dot wider.',
        words: 'Rows of 1 to 5 form a triangle.',
        symbol: 'Tₙ = 1 + 2 + … + n',
      },
    },
    {
      id: 'pd-2',
      title: '3D cube blocks',
      headline: 'Stack layers into cubes',
      focusWord: 'cubes',
      question: 'Count unit blocks inside a 4 × 4 × 4 cube.',
      teacherPrompt: 'Why is 16 a flat square while 64 is a solid cube?',
      components: [
        { id: 'c2', pictureLabel: '2×2×2 block', wordLabel: '8 unit cubes', symbolLabel: '2³ = 8', anchor: { x: 185, y: 165 } },
        { id: 'c3', pictureLabel: '3×3×3 block', wordLabel: '27 unit cubes', symbolLabel: '3³ = 27', anchor: { x: 345, y: 158 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: '3 layers', wordLabel: '9 × 3 blocks', symbolLabel: '3³ = 27', anchor: { x: 345, y: 88 } },
        { id: 'r2', pictureLabel: '4 layers', wordLabel: '16 × 4 blocks', symbolLabel: '4³ = 64', anchor: { x: 510, y: 78 } },
      ],
      equationLines: ['2 × 2 × 2 = 8', '3 × 3 × 3 = 27', '4 × 4 × 4 = 64'],
      reprSummary: {
        picture: 'Four 4×4 sheets stack up.',
        words: 'Equal width, depth, and height.',
        symbol: 'n × n × n = n³',
      },
    },
  ],

  'number-36-magic': [
    {
      id: 'n36-1',
      title: '36 dots morph',
      headline: 'See 36 as two shapes',
      focusWord: '36',
      question: 'Watch 36 dots rearrange from triangle to square.',
      teacherPrompt: 'Did any dot get added or removed when the triangle became a square?',
      components: [
        { id: 'dots', pictureLabel: '36 dots', wordLabel: 'Same dot count', symbolLabel: 'N = 36', anchor: { x: 320, y: 175 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: '8 rows / 6×6', wordLabel: 'Two layouts', symbolLabel: 'T₈ = 6²', anchor: { x: 320, y: 56 } },
      ],
      equationLines: ['1 + 2 + … + 8 = 36', '6 × 6 = 36', 'T₈ = 6² = 36'],
      reprSummary: {
        picture: 'Same 36 dots glide in place.',
        words: '36 fits an 8-row triangle and 6×6 square.',
        symbol: 'T₈ = 36 = 6²',
      },
    },
    {
      id: 'n36-2',
      title: 'Compare squares',
      headline: 'Not all squares are triangles',
      focusWord: 'triangles',
      question: 'Compare 9 with 1 and 36.',
      teacherPrompt: 'Can you guess if any number larger than 36 is also both?',
      components: [
        { id: 's9', pictureLabel: '9 card', wordLabel: 'Square only', symbolLabel: '3² = 9', anchor: { x: 205, y: 175 } },
        { id: 's36', pictureLabel: '36 card', wordLabel: 'Fits both', symbolLabel: 'T₈ = 6²', anchor: { x: 435, y: 175 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: 'Skips 9', wordLabel: '6 then 10', symbolLabel: 'T₃=6, T₄=10', anchor: { x: 205, y: 90 } },
        { id: 'r2', pictureLabel: '1 & 36', wordLabel: 'Match both', symbolLabel: '1, 36', anchor: { x: 435, y: 90 } },
      ],
      equationLines: ['T₃ = 6, T₄ = 10 (no 9)', 'T₁ = 1² = 1', 'T₈ = 6² = 36'],
      reprSummary: {
        picture: '9 falls between 6 and 10.',
        words: 'Only special counts match both shapes.',
        symbol: '1 and 36 match both',
      },
    },
  ],

  'hexagonal-numbers': [
    {
      id: 'hex-1',
      title: 'Hexagon rings',
      headline: 'Rings grow by six',
      focusWord: 'six',
      question: 'Wrap Ring 4 (+24 dots) around 37 dots.',
      teacherPrompt: 'Why does each new hexagonal ring always add 6 more dots than the last?',
      hasPretraining: true,
      components: [
        { id: 'h0', pictureLabel: 'Center dot', wordLabel: '1 in middle', symbolLabel: 'H₁ = 1', anchor: { x: 320, y: 184 } },
        { id: 'h3', pictureLabel: 'Rings 1–3', wordLabel: '37 dots total', symbolLabel: 'H₄ = 37', anchor: { x: 250, y: 135 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: '6 sides', wordLabel: '+6 per ring', symbolLabel: '6 × k', anchor: { x: 155, y: 120 } },
        { id: 'r2', pictureLabel: 'Ring 4 (+24)', wordLabel: 'Total is 61', symbolLabel: '37 + 24 = 61', anchor: { x: 495, y: 184 } },
      ],
      equationLines: ['1 + 6 = 7', '7 + 12 = 19', '19 + 18 = 37', '37 + 24 = 61'],
      reprSummary: {
        picture: 'Outer pink ring adds 24 dots.',
        words: 'Each ring adds 6 more than before.',
        symbol: 'Hₙ₊₁ = Hₙ + 6n',
      },
      check: {
        prompt: 'What is 37 + 24?',
        options: [
          { id: '61', text: '61', isCorrect: true, reason: 'Ring 4 adds 24 to 37.' },
          { id: '55', text: '55', isCorrect: false, reason: 'Add 24, not 18.' },
        ],
      },
    },
    {
      id: 'hex-2',
      title: 'Ring 5 and sliders',
      headline: 'Test any ring count',
      focusWord: 'ring',
      question: 'Add Ring 5 (+30) or explore rings below.',
      teacherPrompt: 'How many dots will Ring 10 alone add around the hexagon?',
      components: [
        { id: 'h4', pictureLabel: '61 dots', wordLabel: '4 rings', symbolLabel: 'H₅ = 61', anchor: { x: 320, y: 184 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: 'Ring 5 (+30)', wordLabel: '5 × 6 dots', symbolLabel: '+30 dots', anchor: { x: 155, y: 120 } },
        { id: 'r2', pictureLabel: '91 dots', wordLabel: '61 + 30 = 91', symbolLabel: 'H₆ = 91', anchor: { x: 495, y: 184 } },
      ],
      equationLines: ['37 + 24 = 61', '61 + 30 = 91', 'Ring k = 6 × k'],
      reprSummary: {
        picture: 'Use buttons to change rings.',
        words: 'Ring 5 adds 30 dots to 61.',
        symbol: '61 + 30 = 91',
      },
    },
  ],

  'powers-dimensions': [
    {
      id: 'pow-1',
      title: 'Doubling dimensions',
      headline: 'New dimensions double corners',
      focusWord: 'double',
      question: 'Connect two 8-corner cubes into a 4D hypercube.',
      teacherPrompt: 'How many corners would a 5D cube have if you copied the 4D shape?',
      components: [
        { id: 'd2', pictureLabel: '2D square', wordLabel: '4 corners', symbolLabel: '2² = 4', anchor: { x: 167, y: 180 } },
        { id: 'd3', pictureLabel: '3D cube', wordLabel: '8 corners', symbolLabel: '2³ = 8', anchor: { x: 290, y: 180 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: 'Copy + link', wordLabel: 'Doubles count', symbolLabel: '× 2', anchor: { x: 360, y: 118 } },
        { id: 'r2', pictureLabel: '4D hypercube', wordLabel: '16 corners', symbolLabel: '2⁴ = 16', anchor: { x: 470, y: 118 } },
      ],
      equationLines: ['1D = 2', '2D = 4', '3D = 8', '4D = 8 × 2 = 16'],
      reprSummary: {
        picture: 'Two linked cubes show 16 corners.',
        words: 'Copying a shape doubles its corners.',
        symbol: '2ⁿ vertices',
      },
    },
    {
      id: 'pow-2',
      title: 'Tripling prisms',
      headline: 'Prisms triple corner counts',
      focusWord: 'triple',
      question: 'Link three 9-corner prisms to picture 3³.',
      teacherPrompt: 'What would 3⁴ look like using arrays of prisms?',
      components: [
        { id: 't1', pictureLabel: 'Triangle', wordLabel: '3 corners', symbolLabel: '3¹ = 3', anchor: { x: 175, y: 180 } },
        { id: 't2', pictureLabel: 'Prism', wordLabel: '9 corners', symbolLabel: '3² = 9', anchor: { x: 325, y: 180 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: '×3 copy', wordLabel: 'Three prisms', symbolLabel: '9 × 3', anchor: { x: 390, y: 110 } },
        { id: 'r2', pictureLabel: '27 corners', wordLabel: '3 cubed', symbolLabel: '3³ = 27', anchor: { x: 500, y: 110 } },
      ],
      equationLines: ['3¹ = 3', '3² = 9', '3³ = 9 × 3 = 27'],
      reprSummary: {
        picture: 'Three prisms join corner to corner.',
        words: 'Tripling 9 vertices gives 27.',
        symbol: '3ⁿ vertices',
      },
    },
  ],

  'odd-sum-square': [
    {
      id: 'odd-1',
      title: 'L-shaped odd strips',
      headline: 'Odd L-strips build squares',
      focusWord: 'squares',
      question: 'Wrap 7 dots around the 3 × 3 square.',
      teacherPrompt: 'Why does every new L-strip have 2 more dots than the one before?',
      hasPretraining: true,
      components: [
        { id: 'sq2', pictureLabel: '2×2 core', wordLabel: '1 + 3 = 4', symbolLabel: '2² = 4', anchor: { x: 250, y: 105 } },
        { id: 'l3', pictureLabel: 'L-strip 3', wordLabel: 'Adds 5 dots', symbolLabel: '+5 → 9', anchor: { x: 315, y: 165 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: 'Odd L-bands', wordLabel: '1, 3, 5, 7', symbolLabel: '2k - 1', anchor: { x: 140, y: 155 } },
        { id: 'r2', pictureLabel: '4×4 square', wordLabel: '16 dots total', symbolLabel: '4² = 16', anchor: { x: 470, y: 155 } },
      ],
      equationLines: ['1 = 1²', '1 + 3 = 2²', '1 + 3 + 5 = 3²', '1 + 3 + 5 + 7 = 4²'],
      reprSummary: {
        picture: 'Pink and blue L-bands wrap tight.',
        words: 'First 4 odds fill a 4×4 square.',
        symbol: 'Σ(2k−1) = n²',
      },
      check: {
        prompt: 'What is 1 + 3 + 5 + 7?',
        options: [
          { id: '16', text: '16 (4²)', isCorrect: true, reason: 'Four odd strips form a 4×4 square.' },
          { id: '14', text: '14', isCorrect: false, reason: 'Add 7 to 9 to get 16.' },
        ],
      },
    },
    {
      id: 'odd-2',
      title: 'First 100 odds',
      headline: 'Sum 100 odds in seconds',
      focusWord: '100',
      question: 'Scale the L-strip rule to 10 and 100 odds.',
      teacherPrompt: 'What is the sum of the first 50 odd numbers using this picture?',
      components: [
        { id: 'ten', pictureLabel: '10×10 grid', wordLabel: '10 odds = 100', symbolLabel: '10² = 100', anchor: { x: 190, y: 170 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: '100 sum', wordLabel: '10 squared', symbolLabel: '10² = 100', anchor: { x: 190, y: 92 } },
        { id: 'r2', pictureLabel: '10,000 sum', wordLabel: '100 squared', symbolLabel: '100² = 10,000', anchor: { x: 442, y: 78 } },
      ],
      equationLines: ['10 odds = 10² = 100', '100 odds = 100² = 10,000'],
      reprSummary: {
        picture: '100 strips make a 100×100 square.',
        words: 'Count how many odds, then square it.',
        symbol: 'n odds = n²',
      },
    },
  ],

  'up-down-square': [
    {
      id: 'ud-1',
      title: 'Tilted diagonals',
      headline: 'Count up and down to square',
      focusWord: 'up and down',
      question: 'Slice a tilted 4 × 4 square into vertical columns.',
      teacherPrompt: 'Why do the column heights rise by 1 and then fall by 1?',
      components: [
        { id: 'left', pictureLabel: '1, 2, 3 up', wordLabel: 'Left columns', symbolLabel: '1+2+3', anchor: { x: 245, y: 176 } },
        { id: 'peak', pictureLabel: 'Peak = 4', wordLabel: 'Middle column', symbolLabel: 'Peak n=4', anchor: { x: 320, y: 176 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: 'Peak 4', wordLabel: 'Highest stack', symbolLabel: 'n = 4', anchor: { x: 320, y: 74 } },
        { id: 'r2', pictureLabel: '4×4 tilted', wordLabel: 'Sum equals 16', symbolLabel: '4² = 16', anchor: { x: 495, y: 176 } },
      ],
      equationLines: ['1+2+1 = 4', '1+2+3+2+1 = 9', '1+2+3+4+3+2+1 = 16'],
      reprSummary: {
        picture: 'Tilted square columns read 1..4..1.',
        words: 'Going up to 4 and down gives 4².',
        symbol: '1+…+n+…+1 = n²',
      },
    },
    {
      id: 'ud-2',
      title: 'Peak 100 rule',
      headline: 'Jump straight from the peak',
      focusWord: 'peak',
      question: 'Find 1 + 2 + … + 100 + … + 2 + 1.',
      teacherPrompt: 'If the sum is 64, what must the middle peak number be?',
      components: [
        { id: 'd5', pictureLabel: 'Peak 5', wordLabel: 'Gives 25', symbolLabel: '5² = 25', anchor: { x: 195, y: 180 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: '5×5 diamond', wordLabel: 'Peak 5 → 25', symbolLabel: '5² = 25', anchor: { x: 195, y: 94 } },
        { id: 'r2', pictureLabel: '100×100 diamond', wordLabel: 'Peak 100 → 10,000', symbolLabel: '100² = 10,000', anchor: { x: 460, y: 78 } },
      ],
      equationLines: ['Peak 5 → 5² = 25', 'Peak 100 → 100² = 10,000'],
      reprSummary: {
        picture: 'Big diamond has 100 dots across.',
        words: 'Square the peak to find the sum.',
        symbol: 'Peak n → n²',
      },
    },
  ],

  'triangular-pairs': [
    {
      id: 'tp-1',
      title: 'Two triangles snap',
      headline: 'Two triangles form a square',
      focusWord: 'square',
      question: 'Slide T3 (6) onto T4 (10) to fill 4 × 4.',
      teacherPrompt: 'Why does every row total 4 when the two triangles snap together?',
      hasPretraining: true,
      components: [
        { id: 't4', pictureLabel: 'Blue T4', wordLabel: '10 dots', symbolLabel: 'T₄ = 10', anchor: { x: 265, y: 205 } },
        { id: 't3', pictureLabel: 'Pink T3', wordLabel: '6 dots', symbolLabel: 'T₃ = 6', anchor: { x: 360, y: 110 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: 'T3 + T4', wordLabel: '6 + 10 dots', symbolLabel: 'T₃ + T₄', anchor: { x: 145, y: 155 } },
        { id: 'r2', pictureLabel: '4×4 square', wordLabel: '16 dots total', symbolLabel: '4² = 16', anchor: { x: 470, y: 155 } },
      ],
      equationLines: ['1 + 3 = 4 (2²)', '3 + 6 = 9 (3²)', '6 + 10 = 16 (4²)'],
      reprSummary: {
        picture: 'Pink triangle slides to fit blue.',
        words: 'Neighboring triangles lock into a square.',
        symbol: 'Tₙ₋₁ + Tₙ = n²',
      },
    },
    {
      id: 'tp-2',
      title: 'Test larger pairs',
      headline: 'Try larger triangle pairs',
      focusWord: 'pairs',
      question: 'Add T4 (10) and T5 (15) to make 5 × 5.',
      teacherPrompt: 'Which two triangular numbers add up to 100?',
      components: [
        { id: 't5', pictureLabel: '25 grid', wordLabel: '5 rows × 5', symbolLabel: 'T₄ + T₅ = 5²', anchor: { x: 300, y: 160 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: '10 + 15', wordLabel: 'Sum is 25', symbolLabel: 'T₄ + T₅ = 25', anchor: { x: 145, y: 155 } },
        { id: 'r2', pictureLabel: '5×5 box', wordLabel: 'Side equals 5', symbolLabel: '5² = 25', anchor: { x: 485, y: 155 } },
      ],
      equationLines: ['6 + 10 = 16 (4²)', '10 + 15 = 25 (5²)'],
      reprSummary: {
        picture: 'Grid grows smoothly as n changes.',
        words: 'Square side matches the bigger triangle.',
        symbol: 'T₄ + T₅ = 5²',
      },
    },
  ],

  'hexagonal-to-cubes': [
    {
      id: 'hc-1',
      title: '6 triangles + 1',
      headline: 'Six triangles build a hexagon',
      focusWord: 'hexagon',
      question: 'Place 6 triangles of 3 dots around 1 center dot.',
      teacherPrompt: 'What hexagonal number do you get from 6 × T3 + 1?',
      components: [
        { id: 'ctr', pictureLabel: '1 center dot', wordLabel: 'Plus 1 dot', symbolLabel: '+ 1', anchor: { x: 320, y: 185 } },
        { id: 'sec', pictureLabel: '6 sectors', wordLabel: '3 dots each', symbolLabel: '6 × T₂', anchor: { x: 270, y: 135 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: '6 × 3 dots', wordLabel: 'Six wedges', symbolLabel: '6 × T₂ = 18', anchor: { x: 155, y: 135 } },
        { id: 'r2', pictureLabel: '19 total', wordLabel: 'With center dot', symbolLabel: '18 + 1 = 19', anchor: { x: 485, y: 135 } },
      ],
      equationLines: ['(6 × 1) + 1 = 7', '(6 × 3) + 1 = 19', '(6 × 6) + 1 = 37'],
      reprSummary: {
        picture: 'Six dot wedges circle one core.',
        words: 'Six triangles plus one make a hexagon.',
        symbol: '6 × Tₙ + 1 = Hₙ₊₁',
      },
    },
    {
      id: 'hc-2',
      title: 'Hexagons to cubes',
      headline: 'Hexagon layers build cubes',
      focusWord: 'cubes',
      question: 'Add hexagonal shells 1 + 7 + 19 + 37.',
      teacherPrompt: 'Look at a cube corner: why do its outer block layers look hexagonal?',
      components: [
        { id: 's1', pictureLabel: '1, 7, 19 shells', wordLabel: 'Sum is 27', symbolLabel: '3³ = 27', anchor: { x: 245, y: 165 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: '1 + 7 + 19', wordLabel: '3 layers = 27', symbolLabel: '3³ = 27', anchor: { x: 245, y: 92 } },
        { id: 'r2', pictureLabel: '+37 shell', wordLabel: '4 layers = 64', symbolLabel: '4³ = 64', anchor: { x: 505, y: 92 } },
      ],
      equationLines: ['1 = 1³', '1 + 7 = 8 (2³)', '1 + 7 + 19 = 27 (3³)', '27 + 37 = 64 (4³)'],
      reprSummary: {
        picture: 'Each shell wraps the cube corner.',
        words: 'Adding hexagonal numbers produces cubes.',
        symbol: 'Σ Hex = n³',
      },
    },
  ],

  'powers-of-2-sum': [
    {
      id: 'p2-1',
      title: 'Powers of 2 + 1',
      headline: 'One block completes the bar',
      focusWord: 'completes',
      question: 'Add +1 to (1 + 2 + 4 + 8 = 15).',
      teacherPrompt: 'Watch 1 + 1 merge into 2: why does every block double down the line?',
      components: [
        { id: 'bars', pictureLabel: '1, 2, 4, 8 bars', wordLabel: 'Length 15', symbolLabel: 'Sum = 15', anchor: { x: 270, y: 178 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: '1+2+4+8', wordLabel: 'Equals 15', symbolLabel: '2⁴ − 1 = 15', anchor: { x: 220, y: 120 } },
        { id: 'r2', pictureLabel: '+1 cap', wordLabel: 'Fills 16 bar', symbolLabel: '15 + 1 = 16', anchor: { x: 530, y: 120 } },
      ],
      equationLines: ['1 + 2 = 3 (4 − 1)', '1 + 2 + 4 = 7 (8 − 1)', '1 + 2 + 4 + 8 = 15', '15 + 1 = 16 (2⁴)'],
      reprSummary: {
        picture: 'One tiny unit closes the gap.',
        words: 'Adding 1 jumps to the next power.',
        symbol: '2ⁿ⁺¹ − 1',
      },
    },
    {
      id: 'p2-2',
      title: 'Sum to 32',
      headline: 'Predict sums without adding',
      focusWord: 'without',
      question: 'Use the next power of 2 to find 1 + … + 32.',
      teacherPrompt: 'What is 1 + 2 + 4 + … + 128 without adding piece by piece?',
      components: [
        { id: 'b32', pictureLabel: 'Bars to 32', wordLabel: '1 short of 64', symbolLabel: '64 − 1', anchor: { x: 300, y: 178 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: 'Sum to 32', wordLabel: 'Equals 63', symbolLabel: '64 − 1 = 63', anchor: { x: 240, y: 120 } },
        { id: 'r2', pictureLabel: '+1 completes', wordLabel: 'Next is 64', symbolLabel: '2⁶ = 64', anchor: { x: 530, y: 120 } },
      ],
      equationLines: ['1 + 2 + … + 16 = 31', '1 + 2 + … + 32 = 63', '63 + 1 = 64 (2⁶)'],
      reprSummary: {
        picture: 'Missing unit piece equals 1.',
        words: 'Double the last bar, subtract 1.',
        symbol: '64 − 1 = 63',
      },
    },
  ],

  'regular-polygons': [
    {
      id: 'rp-1',
      title: 'Sides equal corners',
      headline: 'Add one corner, add one side',
      focusWord: 'corner',
      question: 'Insert a 5th corner into a 4-side square.',
      teacherPrompt: 'Can you draw a closed polygon where sides do not equal corners?',
      hasPretraining: true,
      components: [
        { id: 'sq', pictureLabel: 'Square loop', wordLabel: '4 equal sides', symbolLabel: '4 sides', anchor: { x: 320, y: 178 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: '5 corners', wordLabel: 'Five vertices', symbolLabel: 'V = 5', anchor: { x: 170, y: 120 } },
        { id: 'r2', pictureLabel: '5 sides', wordLabel: 'Pentagon loop', symbolLabel: 'S = 5', anchor: { x: 470, y: 120 } },
      ],
      equationLines: ['Triangle: 3 sides, 3 corners', 'Square: 4 sides, 4 corners', 'Pentagon: 5 sides, 5 corners'],
      reprSummary: {
        picture: 'Closed ring pairs sides and corners.',
        words: 'Every new corner splits one side.',
        symbol: 'Sides = Corners',
      },
    },
    {
      id: 'rp-2',
      title: 'Polygons 3 to 10',
      headline: 'Counting from three to ten',
      focusWord: 'ten',
      question: 'Slide from 3 sides up to a 10-side decagon.',
      teacherPrompt: 'Which Table 1 sequence matches regular polygon side counts?',
      components: [
        { id: 'dec', pictureLabel: 'Polygon loop', wordLabel: 'Equal sides', symbolLabel: 'n-gon', anchor: { x: 320, y: 178 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: 'Counting 3..10', wordLabel: 'Plus 1 each', symbolLabel: 'n = 3..10', anchor: { x: 155, y: 115 } },
        { id: 'r2', pictureLabel: 'Decagon', wordLabel: '10 equal sides', symbolLabel: 'S = 10', anchor: { x: 485, y: 115 } },
      ],
      equationLines: ['Octagon = 8', 'Nonagon = 9', 'Decagon = 10'],
      reprSummary: {
        picture: 'Drag slider to change sides.',
        words: 'Polygons count 3, 4, 5, up to 10.',
        symbol: '3, 4, 5, …, 10',
      },
    },
  ],

  'complete-graphs': [
    {
      id: 'cg-1',
      title: 'Complete graph K4',
      headline: 'New dot links all others',
      focusWord: 'links',
      question: 'Add dot 4 to K3 and count new lines.',
      teacherPrompt: 'Why did dot 4 add 3 new lines instead of 4?',
      hasPretraining: true,
      components: [
        { id: 'k3', pictureLabel: '3-dot triangle', wordLabel: '3 old lines', symbolLabel: 'K₃ = 3', anchor: { x: 280, y: 190 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: '3 new chords', wordLabel: 'Links 3 dots', symbolLabel: '+3 lines', anchor: { x: 145, y: 120 } },
        { id: 'r2', pictureLabel: 'K4 total', wordLabel: '6 lines total', symbolLabel: '3 + 3 = 6', anchor: { x: 480, y: 120 } },
      ],
      equationLines: ['K₂ = 1', 'K₃ = 1 + 2 = 3', 'K₄ = 1 + 2 + 3 = 6'],
      reprSummary: {
        picture: 'Pink lines reach every old dot.',
        words: 'Dot 4 connects to 3 earlier dots.',
        symbol: '1 + 2 + 3 = 6',
      },
    },
    {
      id: 'cg-2',
      title: 'K5 and K6 graphs',
      headline: 'Graph lines match triangles',
      focusWord: 'triangles',
      question: 'Test K5 and K6 to see triangular sums.',
      teacherPrompt: 'In a room of 6 people who all shake hands once, how many handshakes happen?',
      components: [
        { id: 'k5', pictureLabel: 'Graph web', wordLabel: 'Every pair', symbolLabel: 'Kₙ', anchor: { x: 280, y: 185 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: 'Add n − 1', wordLabel: '+4 for K5', symbolLabel: '6 + 4 = 10', anchor: { x: 145, y: 120 } },
        { id: 'r2', pictureLabel: 'Triangular Tₙ₋₁', wordLabel: '1, 3, 6, 10, 15', symbolLabel: 'Kₙ = Tₙ₋₁', anchor: { x: 495, y: 120 } },
      ],
      equationLines: ['K₄ = 6', 'K₅ = 6 + 4 = 10', 'K₆ = 10 + 5 = 15'],
      reprSummary: {
        picture: 'Switch K2 to K6 below.',
        words: 'Lines follow triangular numbers.',
        symbol: 'Kₙ = 1 + … + (n−1)',
      },
    },
  ],

  'stacked-shapes': [
    {
      id: 'ss-1',
      title: 'Stacked odd rows',
      headline: 'Triangle rows count odd numbers',
      focusWord: 'odd',
      question: 'Add Row 3 (+5 small triangles) beside the 3 × 3 square.',
      teacherPrompt: 'Why does each row below hold 2 more small triangles than the row above?',
      components: [
        { id: 'tri', pictureLabel: 'Rows 1–2', wordLabel: '1 + 3 = 4', symbolLabel: '2² = 4', anchor: { x: 210, y: 120 } },
        { id: 'sq', pictureLabel: 'Square grid', wordLabel: 'Unit squares', symbolLabel: 'n × n', anchor: { x: 445, y: 135 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: '1, 3, 5 rows', wordLabel: '9 small triangles', symbolLabel: '1+3+5 = 9', anchor: { x: 210, y: 235 } },
        { id: 'r2', pictureLabel: '3×3 grid', wordLabel: '9 small squares', symbolLabel: '3² = 9', anchor: { x: 445, y: 235 } },
      ],
      equationLines: ['Row 1 = 1', 'Row 1+2 = 1 + 3 = 4', 'Rows 1–3 = 1 + 3 + 5 = 9'],
      reprSummary: {
        picture: 'Odd triangle rows match square grids.',
        words: 'Rows hold 1, 3, and 5 triangles.',
        symbol: '1 + 3 + 5 = 3²',
      },
    },
    {
      id: 'ss-2',
      title: 'Explore 1 to 5 rows',
      headline: 'Both stacks make squares',
      focusWord: 'squares',
      question: 'Change the stack size to compare triangles and squares.',
      teacherPrompt: 'How many small triangles are in Row 5 alone of a 5-row pyramid?',
      components: [
        { id: 's4', pictureLabel: '4-row stack', wordLabel: '16 total', symbolLabel: '4² = 16', anchor: { x: 320, y: 175 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: 'Odd sum', wordLabel: '1+3+5+7', symbolLabel: 'Σ(2k−1)', anchor: { x: 210, y: 265 } },
        { id: 'r2', pictureLabel: 'Grid area', wordLabel: 'Matches n×n', symbolLabel: 'n² = 16', anchor: { x: 455, y: 265 } },
      ],
      equationLines: ['3 rows = 9 (3²)', '4 rows = 16 (4²)', '5 rows = 25 (5²)'],
      reprSummary: {
        picture: 'Tap grid buttons below to resize.',
        words: 'Every stack count is a square number.',
        symbol: 'Total = n²',
      },
    },
  ],

  'koch-snowflake': [
    {
      id: 'ks-1',
      title: 'Speed bump rule',
      headline: 'One side splits into four',
      focusWord: 'four',
      question: 'Replace all 3 triangle sides with 4-part bumps.',
      teacherPrompt: 'Why do segments multiply by 4 instead of adding 4 each step?',
      hasPretraining: true,
      components: [
        { id: 'bump', pictureLabel: '1 → 4 bump', wordLabel: 'Replacement rule', symbolLabel: '× 4 rule', anchor: { x: 139, y: 180 } },
        { id: 'tri', pictureLabel: '3 sides', wordLabel: 'Start triangle', symbolLabel: 'S₀ = 3', anchor: { x: 400, y: 185 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: '4 parts/side', wordLabel: 'Each flat splits', symbolLabel: '1 → 4', anchor: { x: 139, y: 92 } },
        { id: 'r2', pictureLabel: '12 segments', wordLabel: '3 times 4', symbolLabel: '3 × 4 = 12', anchor: { x: 400, y: 74 } },
      ],
      equationLines: ['Step 0 = 3', 'Step 1 = 3 × 4 = 12'],
      reprSummary: {
        picture: 'Every edge grows a triangular bump.',
        words: 'Three sides split into twelve segments.',
        symbol: '3 × 4 = 12',
      },
    },
    {
      id: 'ks-2',
      title: 'Koch steps 2 and 3',
      headline: 'Multiply by four again',
      focusWord: 'four',
      question: 'Split all 12 sides into 4 parts each.',
      teacherPrompt: 'How many segments will Step 4 have if Step 3 has 192?',
      components: [
        { id: 'k1', pictureLabel: 'Snowflake', wordLabel: 'Self-similar edge', symbolLabel: '3 × 4ⁿ', anchor: { x: 400, y: 185 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: '×4 rule', wordLabel: 'Times 4 each step', symbolLabel: '× 4', anchor: { x: 139, y: 92 } },
        { id: 'r2', pictureLabel: '48 segments', wordLabel: '12 × 4 = 48', symbolLabel: '3 × 4² = 48', anchor: { x: 400, y: 74 } },
      ],
      equationLines: ['Step 0 = 3', 'Step 1 = 12', 'Step 2 = 48', 'Step 3 = 192'],
      reprSummary: {
        picture: 'Bumps appear on smaller bumps.',
        words: 'Segment counts triple powers of 4.',
        symbol: 'Sₙ = 3 × 4ⁿ',
      },
    },
  ],

  'shape-number-insights': [
    {
      id: 'smi-1',
      title: 'Polygons → Counting',
      headline: 'Polygons mirror counting numbers',
      focusWord: 'counting',
      question: 'Add 1 corner to turn a 4-side square into 5.',
      teacherPrompt: 'Which shape pattern matches 3, 4, 5, 6, ...?',
      components: [
        { id: 'p', pictureLabel: 'Square → Pentagon', wordLabel: '4 + 1 = 5', symbolLabel: `${polygonCorners(5)} sides`, anchor: { x: 320, y: 185 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: '5 corners', wordLabel: 'Equal sides', symbolLabel: 'V = S = 5', anchor: { x: 320, y: 78 } },
      ],
      equationLines: ['3, 4, 5, 6, …', 'Corners = Sides'],
      reprSummary: {
        picture: 'One extra corner makes five sides.',
        words: 'Polygons match counting from 3.',
        symbol: '3, 4, 5, 6…',
      },
    },
    {
      id: 'smi-2',
      title: 'Graphs → Triangular',
      headline: 'Complete graphs mirror triangles',
      focusWord: 'triangles',
      question: 'Compare K4 lines with triangular dot rows.',
      teacherPrompt: 'Why do both shapes add +1, +2, +3, +4 at each step?',
      components: [
        { id: 'g', pictureLabel: 'K4 web', wordLabel: '6 lines', symbolLabel: `K₄ = ${completeGraphEdges(4)}`, anchor: { x: 190, y: 185 } },
        { id: 't', pictureLabel: '6 dots', wordLabel: '1 + 2 + 3', symbolLabel: 'T₃ = 6', anchor: { x: 455, y: 170 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: 'K4 = 6 lines', wordLabel: '1 + 2 + 3', symbolLabel: 'K₄ = 6', anchor: { x: 190, y: 85 } },
        { id: 'r2', pictureLabel: 'T3 = 6 dots', wordLabel: 'Same sum', symbolLabel: 'T₃ = 6', anchor: { x: 455, y: 85 } },
      ],
      equationLines: ['K₃ = 3, T₂ = 3', 'K₄ = 3 + 3 = 6', 'Kₙ = Tₙ₋₁'],
      reprSummary: {
        picture: 'Web lines match triangle dots.',
        words: 'Each new dot adds n − 1 lines.',
        symbol: 'Kₙ = 1 + … + (n−1)',
      },
    },
    {
      id: 'smi-3',
      title: 'Stacks → Squares',
      headline: 'Stacked shapes mirror squares',
      focusWord: 'squares',
      question: 'Match 1 + 3 + 5 triangles to 3 × 3 squares.',
      teacherPrompt: 'Why do two totally different shapes give the exact same count?',
      components: [
        { id: 'st', pictureLabel: '3-row stack', wordLabel: '1 + 3 + 5', symbolLabel: `${rowTriangles(1)}+${rowTriangles(2)}+${rowTriangles(3)}`, anchor: { x: 190, y: 170 } },
        { id: 'sq', pictureLabel: '3×3 grid', wordLabel: '9 unit squares', symbolLabel: `${stackedSquareCount(3)} squares`, anchor: { x: 445, y: 160 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: '1+3+5 = 9', wordLabel: 'Odd rows', symbolLabel: `Sum = ${stackedTriangleSum(3)}`, anchor: { x: 190, y: 78 } },
        { id: 'r2', pictureLabel: '3×3 = 9', wordLabel: 'Square grid', symbolLabel: '3² = 9', anchor: { x: 445, y: 78 } },
      ],
      equationLines: ['1 + 3 = 4 = 2²', '1 + 3 + 5 = 9 = 3²'],
      reprSummary: {
        picture: 'Both stacks hold 9 small shapes.',
        words: 'Odd triangle rows equal n×n squares.',
        symbol: 'Σ(2k−1) = n²',
      },
    },
    {
      id: 'smi-4',
      title: 'Koch → 3 × 4ⁿ',
      headline: 'Fractals multiply powers of four',
      focusWord: 'four',
      question: 'See how Step 1 (12) becomes Step 2 (48).',
      teacherPrompt: 'How do pictures turn big numbers like 768 into an easy rule?',
      components: [
        { id: 'k', pictureLabel: 'Step 2 flake', wordLabel: '48 edges', symbolLabel: `${kochSegments(2)} sides`, anchor: { x: 420, y: 185 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: '×4 bump', wordLabel: '1 splits to 4', symbolLabel: '× 4', anchor: { x: 135, y: 120 } },
        { id: 'r2', pictureLabel: '48 edges', wordLabel: '12 times 4', symbolLabel: '3 × 4² = 48', anchor: { x: 420, y: 72 } },
      ],
      equationLines: ['Step 0 = 3', 'Step 1 = 12', 'Step 2 = 48 (3 × 4²)'],
      reprSummary: {
        picture: 'Every flat side grows 4 parts.',
        words: 'Each iteration multiplies edges by 4.',
        symbol: '3 × 4ⁿ',
      },
    },
  ],

  'chapter-summary': [
    {
      id: 'sum-1',
      title: 'Art and science',
      headline: 'Spot patterns and ask why',
      focusWord: 'why',
      question: 'Connect number rules, dot pictures, and shape sequences.',
      teacherPrompt: 'Which pattern in this chapter surprised you the most, and why?',
      components: [
        { id: 'num', pictureLabel: 'Table 1', wordLabel: 'Number rules', symbolLabel: '1, 3, 6, 10', anchor: { x: 145, y: 170 } },
        { id: 'vis', pictureLabel: 'Dot proofs', wordLabel: 'Visual why', symbolLabel: 'n², n³', anchor: { x: 320, y: 170 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: 'Numbers', wordLabel: 'Rules & sums', symbolLabel: 'Table 1', anchor: { x: 145, y: 88 } },
        { id: 'r2', pictureLabel: 'Shapes', wordLabel: 'Mirror numbers', symbolLabel: 'Table 3', anchor: { x: 495, y: 88 } },
      ],
      equationLines: ['Odd sum = n²', 'Tₙ₋₁ + Tₙ = n²', 'Σ Hex = n³', 'Koch = 3 × 4ⁿ'],
      reprSummary: {
        picture: 'Pictures explain why rules work.',
        words: 'Math links numbers, pictures, and shapes.',
        symbol: 'Pattern + Proof',
      },
    },
    {
      id: 'sum-2',
      title: 'Chapter check',
      headline: 'Check your big chapter ideas',
      focusWord: 'ideas',
      question: 'Match hexagonal sums to cubes in one step.',
      teacherPrompt: 'How would you explain to a friend why 1 + 7 + 19 equals 27?',
      components: [
        { id: 'hex', pictureLabel: 'Hex shells', wordLabel: '1, 7, 19, 37', symbolLabel: 'Σ Hex = n³', anchor: { x: 320, y: 170 } },
      ],
      readouts: [
        { id: 'r1', pictureLabel: '1 + 7 + 19', wordLabel: 'Equals 27', symbolLabel: '3³ = 27', anchor: { x: 320, y: 88 } },
        { id: 'r2', pictureLabel: 'Cube blocks', wordLabel: '3D cubes', symbolLabel: '1, 8, 27, 64', anchor: { x: 495, y: 265 } },
      ],
      equationLines: ['1 = 1³', '1 + 7 = 8 = 2³', '1 + 7 + 19 = 27 = 3³', '27 + 37 = 64 = 4³'],
      reprSummary: {
        picture: 'Hexagonal shells wrap into cubes.',
        words: 'Adding hexagons builds cube numbers.',
        symbol: 'Σ Hex = n³',
      },
      check: {
        prompt: 'Adding 1 + 7 + 19 + 37 makes?',
        options: [
          { id: 'cubes', text: 'Cube numbers (64 = 4³)', isCorrect: true, reason: 'Hexagonal shells wrap around cube corners.' },
          { id: 'squares', text: 'Square numbers', isCorrect: false, reason: '1 + 7 = 8 is a cube, not square.' },
        ],
      },
    },
  ],
};

export const PATTERN_SIM_STEPS: Record<SimTopicId, ClassroomStep[]> = Object.fromEntries(
  Object.entries(RAW_PATTERN_SIM_STEPS).map(([topicId, steps]) => [
    topicId,
    steps.map((step) => ({
      ...step,
      ncertRef: step.ncertRef || TOPIC_NCERT_REFS[topicId as SimTopicId],
    })),
  ])
) as Record<SimTopicId, ClassroomStep[]>;
