/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SectionId =
  | 'sec-1-1'
  | 'sec-1-2'
  | 'sec-1-3'
  | 'sec-1-4'
  | 'sec-1-5'
  | 'sec-1-6'
  | 'sec-1-solutions';

export type SubTabId =
  | 'what-is-math'
  | 'humanity-forward'
  | 'number-sequences'
  | 'sequence-rules'
  | 'pictorial-dots'
  | 'number-36-magic'
  | 'hexagonal-numbers'
  | 'powers-dimensions'
  | 'odd-sum-square'
  | 'up-down-square'
  | 'triangular-pairs'
  | 'hexagonal-to-cubes'
  | 'powers-of-2-sum'
  | 'regular-polygons'
  | 'complete-graphs'
  | 'stacked-shapes'
  | 'koch-snowflake'
  | 'shape-number-insights'
  | 'chapter-summary'
  | 'sol-sec-1-1'
  | 'sol-sec-1-2'
  | 'sol-sec-1-3'
  | 'sol-sec-1-4'
  | 'sol-sec-1-5-6';

export interface SubTabConfig {
  id: SubTabId;
  label: string;
  headline: string;
  focusWord: string;
  caption: string;
  notation?: string;
}

export interface SectionConfig {
  id: SectionId;
  label: string;
  shortLabel: string;
  subTabs: SubTabConfig[];
}

export const CHAPTER_TITLE = 'Patterns in Mathematics';
export const CLASS_LABEL = 'Class 6';

export const CHAPTER_SECTIONS: SectionConfig[] = [
  {
    id: 'sec-1-1',
    label: '1.1 What is Mathematics?',
    shortLabel: '1.1 Intro',
    subTabs: [
      {
        id: 'what-is-math',
        label: 'Search for Patterns',
        headline: 'Mathematics is the Search for Patterns',
        focusWord: 'Patterns',
        caption: 'Mathematics aims not only to discover what patterns exist all around us, but also to explain why they exist.',
        notation: 'Nature · Art · Science',
      },
      {
        id: 'humanity-forward',
        label: 'Propelling Humanity',
        headline: 'How Patterns Propel Humanity Forward',
        focusWord: 'Humanity',
        caption: 'From gravitation and satellite orbits to genetics and computing, discovering patterns transforms human progress.',
        notation: 'Fig. 1.1–1.2',
      },
    ],
  },
  {
    id: 'sec-1-2',
    label: '1.2 Patterns in Numbers',
    shortLabel: '1.2 Numbers',
    subTabs: [
      {
        id: 'number-sequences',
        label: 'Key Number Sequences',
        headline: 'Number Sequences: Table 1 Overview',
        focusWord: 'Sequences',
        caption: 'Explore the 10 foundational number sequences studied in number theory, from counting and odd numbers to cubes and Virahānka numbers.',
        notation: 'Table 1',
      },
      {
        id: 'sequence-rules',
        label: 'Figure It Out · Rules & Next Terms',
        headline: 'Recognising Pattern Rules & Generating Next Terms',
        focusWord: 'Rules',
        caption: 'Figure out the pattern rule for each sequence and predict the next three numbers.',
        notation: 'p. 3 Questions',
      },
    ],
  },
  {
    id: 'sec-1-3',
    label: '1.3 Visualising Number Sequences',
    shortLabel: '1.3 Visualising',
    subTabs: [
      {
        id: 'pictorial-dots',
        label: 'Table 2: Pictorial Dots & Cubes',
        headline: 'Visualising Number Sequences with Pictures',
        focusWord: 'Visualising',
        caption: 'Represent counting numbers, odd/even numbers, triangular numbers, squares, and cubes as geometric dot and block arrangements.',
        notation: 'Table 2',
      },
      {
        id: 'number-36-magic',
        label: 'The Magic of 36: Triangle & Square',
        headline: '36 is Both a Triangular & a Square Number!',
        focusWord: '36',
        caption: '36 dots can be arranged simultaneously as an 8-row triangle (1+2+...+8) and as a 6×6 square grid.',
        notation: 'T₈ = 36 = 6²',
      },
      {
        id: 'hexagonal-numbers',
        label: 'Hexagonal Numbers (1, 7, 19, 37...)',
        headline: 'Concentric Rings: The Hexagonal Number Sequence',
        focusWord: 'Hexagonal',
        caption: 'Hexagonal numbers grow by adding concentric hexagonal rings of 6, 12, 18, 24 dots. What comes next?',
        notation: '1, 7, 19, 37, 61...',
      },
      {
        id: 'powers-dimensions',
        label: 'Powers of 2 & 3 in Dimensions',
        headline: 'Visualising Powers Through Geometric Dimensions',
        focusWord: 'Dimensions',
        caption: 'Powers of 2 double across 0D point, 1D line, 2D square, 3D cube, and 4D hypercube; powers of 3 build triangular prisms.',
        notation: '2ⁿ & 3ⁿ',
      },
    ],
  },
  {
    id: 'sec-1-4',
    label: '1.4 Relations among Sequences',
    shortLabel: '1.4 Relations',
    subTabs: [
      {
        id: 'odd-sum-square',
        label: 'Odd Numbers to Squares',
        headline: 'Adding Consecutive Odd Numbers Gives Squares',
        focusWord: 'Square',
        caption: 'Watch L-shaped colored gnomon strips wrap around corner dots to visually prove that 1 + 3 + 5 + ... = n².',
        notation: '1+3+5+... = n²',
      },
      {
        id: 'up-down-square',
        label: 'Adding Up & Down to Squares',
        headline: 'Counting Up and Down Always Gives a Square',
        focusWord: 'Up and Down',
        caption: '1 + 2 + ... + n + ... + 2 + 1 = n². Slicing a square diagonally visually proves this remarkable symmetry.',
        notation: 'Sum to 100 = 10,000',
      },
      {
        id: 'triangular-pairs',
        label: 'Pairs of Triangular Numbers',
        headline: 'Two Consecutive Triangular Numbers Make a Square',
        focusWord: 'Triangular Numbers',
        caption: 'Slide two consecutive triangular numbers T_{n-1} and T_n together to see them snap into an n×n square.',
        notation: 'Tₙ₋₁ + Tₙ = n²',
      },
      {
        id: 'hexagonal-to-cubes',
        label: 'Hexagons to Cubes & Triangles × 6 + 1',
        headline: 'Hexagonal Numbers Sum to Cube Numbers',
        focusWord: 'Cubes',
        caption: 'Adding 1 + 7 + 19 + 37 + ... produces 1, 8, 27, 64 (cubes)! Also, 6 × Triangular Number + 1 = Hexagonal Number.',
        notation: 'Σ Hex = n³',
      },
      {
        id: 'powers-of-2-sum',
        label: 'Adding Powers of 2',
        headline: 'Adding Powers of 2 Starting with 1',
        focusWord: 'Powers of 2',
        caption: '1 + 2 + 4 + ... + 2ⁿ = 2ⁿ⁺¹ - 1. Adding 1 returns the next power of 2!',
        notation: '2ⁿ⁺¹ - 1',
      },
    ],
  },
  {
    id: 'sec-1-5',
    label: '1.5 Patterns in Shapes',
    shortLabel: '1.5 Shapes',
    subTabs: [
      {
        id: 'regular-polygons',
        label: 'Regular Polygons (Sides 3–10)',
        headline: 'Regular Polygons: Equal Sides & Equal Corners',
        focusWord: 'Regular Polygons',
        caption: 'Explore equilateral triangles, squares, pentagons, hexagons up to decagons with equal sides and angles.',
        notation: 'Table 3',
      },
      {
        id: 'complete-graphs',
        label: 'Complete Graphs (K₂ to K₆)',
        headline: 'Complete Graphs: Connecting Every Pair of Points',
        focusWord: 'Complete Graphs',
        caption: 'In complete graph K_n, every point connects to every other point. The number of lines is the triangular sequence!',
        notation: 'K₂, K₃, K₄, K₅, K₆',
      },
      {
        id: 'stacked-shapes',
        label: 'Stacked Squares & Triangles',
        headline: 'Stacked Grids of Squares and Triangles',
        focusWord: 'Stacked',
        caption: 'Count the little unit squares (n²) and little unit triangles in stacked grids (rows of 1, 3, 5, 7 triangles sum to n²).',
        notation: '1, 4, 9, 16, 25',
      },
      {
        id: 'koch-snowflake',
        label: 'The Koch Snowflake Fractal',
        headline: 'The Koch Snowflake: Speed Bumps on Segments',
        focusWord: 'Koch Snowflake',
        caption: 'Replace each line segment with a 4-part speed bump. Segments multiply by 4 at each step: 3, 12, 48, 192, 768.',
        notation: '3 × 4ⁿ',
      },
    ],
  },
  {
    id: 'sec-1-6',
    label: '1.6 Shape & Number Relations',
    shortLabel: '1.6 Connections',
    subTabs: [
      {
        id: 'shape-number-insights',
        label: 'Connecting Shapes & Numbers',
        headline: 'Why Shapes and Number Sequences Mirror Each Other',
        focusWord: 'Mirror',
        caption: 'Why complete graph edges are triangular numbers, stacked triangles equal squares, and polygons match sides and vertices.',
        notation: 'Synthesis',
      },
      {
        id: 'chapter-summary',
        label: 'Chapter 1 Summary',
        headline: 'Patterns in Mathematics · Key Principles & Summary',
        focusWord: 'Summary',
        caption: 'Key concepts: number theory, geometric sequences, visual proofs, and mathematical patterns propelling humanity.',
        notation: 'Recap',
      },
    ],
  },
  {
    id: 'sec-1-solutions',
    label: 'Figure It Out · Solutions',
    shortLabel: 'Solutions',
    subTabs: [
      {
        id: 'sol-sec-1-1',
        label: '1.1 Everyday Math & Progress',
        headline: 'Figure It Out Solutions · Section 1.1',
        focusWord: 'Solutions',
        caption: 'Official NCERT solutions for everyday life examples and how mathematics propels humanity forward.',
        notation: 'p. 2 & p. 13',
      },
      {
        id: 'sol-sec-1-2',
        label: '1.2 Table 1 Sequences',
        headline: 'Figure It Out Solutions · Section 1.2',
        focusWord: 'Solutions',
        caption: 'Pattern recognition rules and the next 3 terms for all 10 sequences in Table 1.',
        notation: 'p. 3 & p. 13',
      },
      {
        id: 'sol-sec-1-3',
        label: '1.3 36, Hexagons & Dimensions',
        headline: 'Figure It Out Solutions · Section 1.3',
        focusWord: 'Solutions',
        caption: 'Why 36 is triangular and square, next hexagonal number (61), and powers of 2 and 3 visualizations.',
        notation: 'p. 5 & pp. 13–14',
      },
      {
        id: 'sol-sec-1-4',
        label: '1.4 Relations Among Sequences',
        headline: 'Figure It Out Solutions · Section 1.4',
        focusWord: 'Solutions',
        caption: 'Odd sums to 100 and 10,000, up-and-down sums, triangular pairs making squares, and hexagonal sums making cubes.',
        notation: 'pp. 8–9 & pp. 14–16',
      },
      {
        id: 'sol-sec-1-5-6',
        label: '1.5 & 1.6 Shapes & Relations',
        headline: 'Figure It Out Solutions · Sections 1.5 & 1.6',
        focusWord: 'Solutions',
        caption: 'Side and corner counts of polygons, lines in complete graphs, stacked shapes, and Koch snowflake segment count (3×4ⁿ).',
        notation: 'pp. 11–12 & pp. 16–17',
      },
    ],
  },
];
