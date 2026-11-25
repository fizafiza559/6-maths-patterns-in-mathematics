/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { COLORS } from '../../../design/tokens';
import {
  ClassroomStep,
  ObjectReadout,
  ProgressivePhase,
  RepresentationMode,
  UiMode,
} from '../../../engine/useProgressiveStep';
import { SimTopicId } from './patternSimData';
import {
  completeGraphEdges,
  kochSegments,
  polygonName,
  rowTriangles,
  stackedTriangleSum,
} from '../shapeMirror/selfcheck';

export interface SandboxState {
  binA: number;
  binB: number;
  seqIdx: number;
  morph36: 'triangle' | 'square';
  hexRings: number;
  relN: number;
  polySides: number;
  graphNodes: number;
  stackN: number;
  kochStep: number;
}

export const DEFAULT_SANDBOX_STATE: SandboxState = {
  binA: 1,
  binB: 0,
  seqIdx: 4,
  morph36: 'triangle',
  hexRings: 4,
  relN: 4,
  polySides: 5,
  graphNodes: 4,
  stackN: 3,
  kochStep: 1,
};

export const TABLE_1_SEQUENCES = [
  { name: "All 1's", terms: [1, 1, 1, 1, 1, 1], next3: [1, 1, 1], rule: 'Always 1' },
  { name: 'Counting', terms: [1, 2, 3, 4, 5, 6], next3: [7, 8, 9], rule: '+1 each step' },
  { name: 'Odd', terms: [1, 3, 5, 7, 9, 11], next3: [13, 15, 17], rule: 'Start 1, +2' },
  { name: 'Even', terms: [2, 4, 6, 8, 10, 12], next3: [14, 16, 18], rule: 'Start 2, +2' },
  { name: 'Triangular', terms: [1, 3, 6, 10, 15, 21], next3: [28, 36, 45], rule: '+2, +3, +4…' },
  { name: 'Squares', terms: [1, 4, 9, 16, 25, 36], next3: [49, 64, 81], rule: 'n × n' },
  { name: 'Cubes', terms: [1, 8, 27, 64, 125, 216], next3: [343, 512, 729], rule: 'n × n × n' },
  { name: 'Virahānka', terms: [1, 2, 3, 5, 8, 13], next3: [21, 34, 55], rule: 'Sum last two' },
  { name: 'Powers of 2', terms: [1, 2, 4, 8, 16, 32], next3: [64, 128, 256], rule: '× 2 each step' },
  { name: 'Powers of 3', terms: [1, 3, 9, 27, 81, 243], next3: [729, 2187, 6561], rule: '× 3 each step' },
];

interface PatternSvgCanvasProps {
  topicId: SimTopicId;
  step: ClassroomStep;
  stepIndex: number;
  phase: ProgressivePhase;
  pretrainingIdx: number;
  highlightActive: boolean;
  mode: UiMode;
  reprMode: RepresentationMode;
  sandbox: SandboxState;
}

export function getReadoutLabel(r: ObjectReadout, repr: RepresentationMode): string {
  if (repr === 'picture') return r.pictureLabel;
  if (repr === 'words') return r.wordLabel;
  return r.symbolLabel;
}

function polygonPoints(cx: number, cy: number, r: number, sides: number, rotOffset = -Math.PI / 2) {
  return Array.from({ length: sides }, (_, i) => {
    const a = rotOffset + (2 * Math.PI * i) / sides;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  });
}

function buildKochPoints(cx: number, cy: number, r: number, step: number): { x: number; y: number }[] {
  const base = polygonPoints(cx, cy, r, 3, -Math.PI / 2);
  let pts = [base[0], base[1], base[2], base[0]];
  for (let s = 0; s < step; s += 1) {
    const next: { x: number; y: number }[] = [];
    for (let i = 0; i < pts.length - 1; i += 1) {
      const a = pts[i];
      const b = pts[i + 1];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const p1 = { x: a.x + dx / 3, y: a.y + dy / 3 };
      const p3 = { x: a.x + (2 * dx) / 3, y: a.y + (2 * dy) / 3 };
      const cos60 = 0.5;
      const sin60 = Math.sqrt(3) / 2;
      const vx = p3.x - p1.x;
      const vy = p3.y - p1.y;
      const p2 = {
        x: p1.x + vx * cos60 + vy * sin60,
        y: p1.y - vx * sin60 + vy * cos60,
      };
      next.push(a, p1, p2, p3);
    }
    next.push(pts[pts.length - 1]);
    pts = next;
  }
  return pts;
}

function pointsToSvgString(pts: { x: number; y: number }[]) {
  return pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
}

function compute36DotPositions(): { triX: number; triY: number; sqX: number; sqY: number }[] {
  const list: { triX: number; triY: number; sqX: number; sqY: number }[] = [];
  let idx = 0;
  for (let r = 1; r <= 8; r += 1) {
    for (let c = 0; c < r; c += 1) {
      const triX = 320 + (c - (r - 1) / 2) * 30;
      const triY = 72 + (r - 1) * 28;
      const sqRow = Math.floor(idx / 6);
      const sqCol = idx % 6;
      const sqX = 320 + (sqCol - 2.5) * 38;
      const sqY = 86 + sqRow * 36;
      list.push({ triX, triY, sqX, sqY });
      idx += 1;
    }
  }
  return list;
}

const DOTS_36 = compute36DotPositions();

function getHexRingDots(maxRings: number, cx: number, cy: number, spacing: number) {
  const dots: { x: number; y: number; ring: number }[] = [{ x: cx, y: cy, ring: 0 }];
  const dirs = [
    [1, 0],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [0, -1],
    [1, -1],
  ];
  for (let ring = 1; ring <= maxRings; ring += 1) {
    let q = -ring;
    let r = ring;
    for (let d = 0; d < 6; d += 1) {
      for (let s = 0; s < ring; s += 1) {
        const px = cx + spacing * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r);
        const py = cy + spacing * ((3 / 2) * r);
        dots.push({ x: px, y: py, ring });
        q += dirs[d][0];
        r += dirs[d][1];
      }
    }
  }
  return dots;
}

export const PatternSvgCanvas: React.FC<PatternSvgCanvasProps> = ({
  topicId,
  step,
  stepIndex,
  phase,
  pretrainingIdx,
  highlightActive,
  mode,
  reprMode,
  sandbox,
}) => {
  const isCleanFrame = phase === 'CLEAN_FRAME';
  const isPretraining = phase === 'PRETRAINING';
  const showIncluded =
    phase === 'SIGNALLED_INCLUSION' || phase === 'LINKING' || phase === 'SETTLED';
  const showReadouts = phase === 'LINKING' || phase === 'SETTLED';
  const dimBase = phase === 'SIGNALLED_INCLUSION' && highlightActive ? 0.35 : 1;

  const labelFontSize = mode === 'projector' ? 18 : 15;

  const renderOnObjectTag = (
    x: number,
    y: number,
    text: string,
    tone: 'primary' | 'highlight' = 'primary',
    animClass = 'animate-fade-200'
  ) => {
    const charW = mode === 'projector' ? 9.5 : 8.2;
    const w = Math.max(88, Math.min(210, text.length * charW + 22));
    const h = mode === 'projector' ? 34 : 30;
    const bx = Math.max(8, Math.min(632 - w, x - w / 2));
    const by = Math.max(8, Math.min(342 - h, y - h / 2));
    const isHi = tone === 'highlight';

    return (
      <g className={animClass}>
        <rect
          x={bx}
          y={by}
          width={w}
          height={h}
          rx="8"
          fill={isHi ? COLORS.highlight.tint : COLORS.accent.tint}
          stroke={isHi ? COLORS.highlight.solid : COLORS.primary}
          strokeWidth="2"
        />
        <text
          x={bx + w / 2}
          y={by + h / 2 + (mode === 'projector' ? 6 : 5)}
          textAnchor="middle"
          fontSize={labelFontSize}
          fontWeight="700"
          fill={isHi ? COLORS.highlight.text : COLORS.headingText}
        >
          {text}
        </text>
      </g>
    );
  };

  const renderSingleHighlightRing = (x: number, y: number, r = 34) => {
    if (!(phase === 'SIGNALLED_INCLUSION' && highlightActive)) return null;
    return (
      <circle
        cx={x}
        cy={y}
        r={r}
        fill="none"
        stroke={COLORS.highlight.solid}
        strokeWidth="3.5"
        className="animate-highlight-once"
        style={{ transformOrigin: `${x}px ${y}px` }}
      />
    );
  };

  const renderBaseAxes = () => (
    <g opacity="0.45">
      <line x1="40" y1="300" x2="600" y2="300" stroke={COLORS.divider} strokeWidth="2" />
      <line x1="40" y1="40" x2="40" y2="300" stroke={COLORS.divider} strokeWidth="1.5" />
    </g>
  );

  const renderObjects = () => {
    if (isCleanFrame) return null;

    switch (topicId) {
      case 'what-is-math': {
        if (stepIndex === 0) {
          const slots = [82, 156, 230, 304, 378, 452];
          return (
            <g>
              <g opacity={dimBase}>
                {slots.map((x, i) => {
                  const showItem = !isPretraining || (i % 2 === pretrainingIdx);
                  if (!showItem) return null;
                  return i % 2 === 0 ? (
                    <circle key={i} cx={x} cy="180" r="24" fill={COLORS.accent.tint} stroke={COLORS.primary} strokeWidth="2.5" />
                  ) : (
                    <rect key={i} x={x - 22} y="158" width="44" height="44" rx="6" fill={COLORS.highlight.tint} stroke={COLORS.highlight.solid} strokeWidth="2.5" />
                  );
                })}
              </g>
              {showIncluded && (
                <g className="animate-fade-400">
                  <circle cx="525" cy="180" r="24" fill={COLORS.accent.tint} stroke={COLORS.highlight.solid} strokeWidth="3" />
                  {renderSingleHighlightRing(525, 180, 36)}
                </g>
              )}
            </g>
          );
        }
        if (stepIndex === 1) {
          const cols = [
            { n: 1, x: 130 },
            { n: 3, x: 255 },
            { n: 5, x: 380 },
          ];
          return (
            <g>
              <g opacity={dimBase}>
                {cols.map((col, ci) =>
                  Array.from({ length: col.n }, (_, d) => (
                    <circle key={`${ci}-${d}`} cx={col.x} cy={255 - d * 24} r="8.5" fill={COLORS.primary} />
                  ))
                )}
              </g>
              {showIncluded && (
                <g className="animate-fade-400">
                  {Array.from({ length: 7 }, (_, d) => (
                    <circle
                      key={d}
                      cx="505"
                      cy={255 - d * 24}
                      r="8.5"
                      fill={d >= 5 ? COLORS.highlight.solid : COLORS.primary}
                    />
                  ))}
                  {renderSingleHighlightRing(505, 183, 42)}
                </g>
              )}
            </g>
          );
        }
        return (
          <g>
            <g opacity={dimBase}>
              <line x1="95" y1="185" x2="500" y2="185" stroke={COLORS.divider} strokeWidth="3" />
              <circle cx="110" cy="185" r="24" fill={COLORS.chipAmberBg} stroke={COLORS.chipAmberBorder} strokeWidth="2.5" />
              <circle cx="295" cy="185" r="24" fill={COLORS.headingText} stroke={COLORS.primary} strokeWidth="2.5" />
            </g>
            {showIncluded && (
              <g className="animate-fade-400">
                <circle cx="480" cy="185" r="24" fill={COLORS.chipAmberBg} stroke={COLORS.highlight.solid} strokeWidth="3" />
                {renderSingleHighlightRing(480, 185, 36)}
              </g>
            )}
          </g>
        );
      }

      case 'humanity-forward': {
        if (stepIndex === 0) {
          return (
            <g>
              <g opacity={dimBase}>
                <ellipse cx="290" cy="185" rx="105" ry="48" fill="none" stroke={COLORS.primary} strokeWidth="2" />
                <circle cx="250" cy="185" r="26" fill={COLORS.chipAmberBg} stroke={COLORS.chipAmberBorder} strokeWidth="2.5" />
              </g>
              {showIncluded && (
                <g className="animate-fade-400">
                  <ellipse cx="310" cy="185" rx="190" ry="85" fill="none" stroke={COLORS.highlight.solid} strokeWidth="2.5" />
                  <circle cx="455" cy="128" r="14" fill={COLORS.highlight.solid} />
                  {renderSingleHighlightRing(455, 128, 28)}
                </g>
              )}
            </g>
          );
        }
        if (stepIndex === 1) {
          const top = ['A', 'T', 'C', 'G'];
          const bot = ['T', 'A', 'G', 'C'];
          return (
            <g>
              {top.map((b, i) => {
                const x = 180 + i * 95;
                return (
                  <g key={i}>
                    <g opacity={dimBase}>
                      <rect x={x - 24} y="100" width="48" height="40" rx="8" fill={COLORS.accent.tint} stroke={COLORS.primary} strokeWidth="2" />
                      <text x={x} y="127" textAnchor="middle" fontSize={labelFontSize + 2} fontWeight="800" fill={COLORS.headingText}>
                        {b}
                      </text>
                      <line x1={x} y1="140" x2={x} y2="210" stroke={COLORS.divider} strokeWidth="2.5" />
                    </g>
                    {showIncluded && (
                      <g className="animate-fade-400">
                        <rect x={x - 24} y="210" width="48" height="40" rx="8" fill={COLORS.highlight.tint} stroke={COLORS.highlight.solid} strokeWidth="2.5" />
                        <text x={x} y="237" textAnchor="middle" fontSize={labelFontSize + 2} fontWeight="800" fill={COLORS.highlight.text}>
                          {bot[i]}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
              {renderSingleHighlightRing(322, 230, 52)}
            </g>
          );
        }
        const outVal = sandbox.binA === 1 && sandbox.binB === 1 ? 1 : 0;
        return (
          <g>
            <g opacity={dimBase}>
              <rect x="95" y="113" width="90" height="42" rx="8" fill={sandbox.binA ? COLORS.accent.tint : COLORS.pageBg} stroke={COLORS.primary} strokeWidth="2" />
              <text x="140" y="140" textAnchor="middle" fontSize={labelFontSize} fontWeight="800" fill={COLORS.headingText}>
                A = {sandbox.binA}
              </text>
              <line x1="185" y1="134" x2="265" y2="158" stroke={COLORS.primary} strokeWidth="3" />
              <rect x="95" y="205" width="90" height="42" rx="8" fill={sandbox.binB ? COLORS.accent.tint : COLORS.pageBg} stroke={COLORS.primary} strokeWidth="2" />
              <text x="140" y="232" textAnchor="middle" fontSize={labelFontSize} fontWeight="800" fill={COLORS.headingText}>
                B = {sandbox.binB}
              </text>
              <line x1="185" y1="226" x2="265" y2="202" stroke={COLORS.primary} strokeWidth="3" />
              <path d="M 265 135 L 330 135 A 45 45 0 0 1 330 225 L 265 225 Z" fill={COLORS.surface} stroke={COLORS.headingText} strokeWidth="3" />
              <text x="312" y="186" textAnchor="middle" fontSize={labelFontSize} fontWeight="800" fill={COLORS.headingText}>
                AND
              </text>
            </g>
            {showIncluded && (
              <g className="animate-fade-400">
                <line x1="375" y1="180" x2="435" y2="180" stroke={outVal ? COLORS.successBorder : COLORS.highlight.solid} strokeWidth="3" />
                <rect
                  x="435"
                  y="158"
                  width="96"
                  height="44"
                  rx="10"
                  fill={outVal ? COLORS.successBg : COLORS.highlight.tint}
                  stroke={outVal ? COLORS.successBorder : COLORS.highlight.solid}
                  strokeWidth="2.5"
                />
                <text
                  x="483"
                  y="186"
                  textAnchor="middle"
                  fontSize={labelFontSize}
                  fontWeight="800"
                  fill={outVal ? COLORS.successText : COLORS.highlight.text}
                >
                  OUT = {outVal}
                </text>
                {renderSingleHighlightRing(483, 180, 38)}
              </g>
            )}
          </g>
        );
      }

      case 'number-sequences': {
        if (stepIndex === 0) {
          const vals = [1, 3, 6, 10, 15, 21, 28];
          return (
            <g>
              <g opacity={dimBase}>
                {vals.map((v, i) => {
                  const x = 68 + i * 64;
                  const showThis = !isPretraining || (pretrainingIdx === 0 ? i < 4 : i >= 4);
                  if (!showThis) return null;
                  return (
                    <g key={i}>
                      <rect x={x - 24} y="152" width="48" height="44" rx="8" fill={COLORS.accent.tint} stroke={COLORS.primary} strokeWidth="2" />
                      <text x={x} y="180" textAnchor="middle" fontSize={labelFontSize + 1} fontWeight="800" fill={COLORS.headingText}>
                        {v}
                      </text>
                      {i > 0 && (
                        <path d={`M ${x - 64} 148 Q ${x - 32} 122 ${x} 148`} fill="none" stroke={COLORS.primary} strokeWidth="2" />
                      )}
                    </g>
                  );
                })}
              </g>
              {showIncluded && (
                <g className="animate-fade-400">
                  <path d="M 452 148 Q 488 120 524 148" fill="none" stroke={COLORS.highlight.solid} strokeWidth="2.5" />
                  <rect x="498" y="152" width="56" height="44" rx="8" fill={COLORS.highlight.tint} stroke={COLORS.highlight.solid} strokeWidth="2.5" />
                  <text x="526" y="180" textAnchor="middle" fontSize={labelFontSize + 1} fontWeight="800" fill={COLORS.highlight.text}>
                    36
                  </text>
                  {renderSingleHighlightRing(526, 174, 38)}
                </g>
              )}
            </g>
          );
        }
        if (stepIndex === 1) {
          const vals = [1, 2, 3, 5, 8, 13, 21];
          return (
            <g>
              <g opacity={dimBase}>
                {vals.map((v, i) => {
                  const x = 68 + i * 64;
                  return (
                    <g key={i}>
                      <rect
                        x={x - 24}
                        y="152"
                        width="48"
                        height="44"
                        rx="8"
                        fill={i >= 5 ? COLORS.accent.tint : COLORS.surface}
                        stroke={i >= 5 ? COLORS.primary : COLORS.divider}
                        strokeWidth="2"
                      />
                      <text x={x} y="180" textAnchor="middle" fontSize={labelFontSize + 1} fontWeight="800" fill={COLORS.headingText}>
                        {v}
                      </text>
                    </g>
                  );
                })}
              </g>
              {showIncluded && (
                <g className="animate-fade-400">
                  <path d="M 388 150 Q 458 102 526 150" fill="none" stroke={COLORS.highlight.solid} strokeWidth="2.5" />
                  <path d="M 452 150 Q 489 122 526 150" fill="none" stroke={COLORS.accent.solid} strokeWidth="2.5" />
                  <rect x="498" y="152" width="56" height="44" rx="8" fill={COLORS.highlight.tint} stroke={COLORS.highlight.solid} strokeWidth="2.5" />
                  <text x="526" y="180" textAnchor="middle" fontSize={labelFontSize + 1} fontWeight="800" fill={COLORS.highlight.text}>
                    34
                  </text>
                  {renderSingleHighlightRing(526, 174, 38)}
                </g>
              )}
            </g>
          );
        }
        const p2 = [1, 2, 4, 8, 16, 32, 64];
        const p3 = [1, 3, 9, 27, 81, 243];
        return (
          <g>
            <g opacity={dimBase}>
              {p2.map((v, i) => (
                <g key={i}>
                  <rect x={48 + i * 62} y="132" width="46" height="38" rx="7" fill={COLORS.accent.tint} stroke={COLORS.primary} strokeWidth="2" />
                  <text x={71 + i * 62} y="157" textAnchor="middle" fontSize={labelFontSize} fontWeight="800" fill={COLORS.headingText}>
                    {v}
                  </text>
                </g>
              ))}
              {p3.map((v, i) => (
                <g key={i}>
                  <rect x={48 + i * 74} y="214" width="56" height="38" rx="7" fill={COLORS.highlight.tint} stroke={COLORS.highlight.solid} strokeWidth="2" />
                  <text x={76 + i * 74} y="239" textAnchor="middle" fontSize={labelFontSize} fontWeight="800" fill={COLORS.highlight.text}>
                    {v}
                  </text>
                </g>
              ))}
            </g>
            {showIncluded && (
              <g className="animate-fade-400">
                <rect x="490" y="132" width="60" height="38" rx="7" fill={COLORS.highlight.tint} stroke={COLORS.highlight.solid} strokeWidth="2.5" />
                <text x="520" y="157" textAnchor="middle" fontSize={labelFontSize} fontWeight="800" fill={COLORS.highlight.text}>
                  128
                </text>
                {renderSingleHighlightRing(520, 151, 36)}
              </g>
            )}
          </g>
        );
      }

      case 'sequence-rules': {
        const seq = stepIndex === 0 ? TABLE_1_SEQUENCES[6] : TABLE_1_SEQUENCES[sandbox.seqIdx];
        return (
          <g>
            <g opacity={dimBase}>
              {seq.terms.map((v, i) => {
                const x = 70 + i * 62;
                return (
                  <g key={i}>
                    <rect x={x - 25} y="148" width="50" height="44" rx="8" fill={COLORS.accent.tint} stroke={COLORS.primary} strokeWidth="2" />
                    <text x={x} y="176" textAnchor="middle" fontSize={labelFontSize} fontWeight="800" fill={COLORS.headingText}>
                      {v}
                    </text>
                  </g>
                );
              })}
            </g>
            {showIncluded && (
              <g className="animate-fade-400">
                <rect x="442" y="148" width="164" height="44" rx="8" fill={COLORS.highlight.tint} stroke={COLORS.highlight.solid} strokeWidth="2.5" />
                <text x="524" y="176" textAnchor="middle" fontSize={labelFontSize} fontWeight="800" fill={COLORS.highlight.text}>
                  {seq.next3.join(', ')}
                </text>
                {renderSingleHighlightRing(524, 170, 44)}
              </g>
            )}
          </g>
        );
      }

      case 'pictorial-dots': {
        if (stepIndex === 0) {
          return (
            <g>
              <g opacity={dimBase}>
                {[1, 2, 3, 4].map((n, ti) => {
                  const showThis = !isPretraining || (pretrainingIdx === 0 ? n <= 3 : n === 4);
                  if (!showThis) return null;
                  const cx = 76 + ti * 105;
                  return Array.from({ length: n }, (_, r) =>
                    Array.from({ length: r + 1 }, (_, c) => (
                      <circle key={`${n}-${r}-${c}`} cx={cx + (c - r / 2) * 16} cy={145 + r * 16} r="5.5" fill={COLORS.primary} />
                    ))
                  );
                })}
              </g>
              {showIncluded && (
                <g className="animate-fade-400">
                  {Array.from({ length: 5 }, (_, r) =>
                    Array.from({ length: r + 1 }, (_, c) => (
                      <circle
                        key={`5-${r}-${c}`}
                        cx={495 + (c - r / 2) * 16}
                        cy={145 + r * 16}
                        r="5.5"
                        fill={r === 4 ? COLORS.highlight.solid : COLORS.primary}
                      />
                    ))
                  )}
                  {renderSingleHighlightRing(495, 209, 44)}
                </g>
              )}
            </g>
          );
        }
        const drawIsoCube = (cx: number, cy: number, size: number, col: string, fill: string) => {
          const dx = size * 0.72;
          const dy = size * 0.42;
          return (
            <g>
              <polygon points={`${cx - size},${cy - size / 2} ${cx - size + dx},${cy - size / 2 - dy} ${cx + dx},${cy - dy} ${cx},${cy}`} fill={fill} stroke={col} strokeWidth="2" />
              <polygon points={`${cx - size},${cy - size / 2} ${cx},${cy} ${cx},${cy + size} ${cx - size},${cy + size / 2}`} fill={fill} stroke={col} strokeWidth="2" />
              <polygon points={`${cx},${cy} ${cx + dx},${cy - dy} ${cx + dx},${cy + size - dy} ${cx},${cy + size}`} fill={fill} stroke={col} strokeWidth="2" />
            </g>
          );
        };
        return (
          <g>
            <g opacity={dimBase}>
              {drawIsoCube(185, 165, 28, COLORS.primary, COLORS.accent.tint)}
              {drawIsoCube(345, 158, 42, COLORS.primary, COLORS.accent.tint)}
            </g>
            {showIncluded && (
              <g className="animate-fade-400">
                {drawIsoCube(510, 150, 56, COLORS.highlight.solid, COLORS.highlight.tint)}
                {renderSingleHighlightRing(510, 155, 52)}
              </g>
            )}
          </g>
        );
      }

      case 'number-36-magic': {
        if (stepIndex === 0) {
          const isSquare = showIncluded && sandbox.morph36 === 'square';
          return (
            <g>
              {DOTS_36.map((d, idx) => (
                <circle
                  key={idx}
                  cx={isSquare ? d.sqX : d.triX}
                  cy={isSquare ? d.sqY : d.triY}
                  r="8.5"
                  fill={isSquare ? COLORS.highlight.solid : COLORS.primary}
                  style={{ transition: 'cx 400ms ease, cy 400ms ease, fill 200ms ease' }}
                />
              ))}
              {renderSingleHighlightRing(320, 180, 118)}
            </g>
          );
        }
        return (
          <g>
            <g opacity={dimBase}>
              <rect x="115" y="115" width="180" height="120" rx="14" fill={COLORS.pageBg} stroke={COLORS.divider} strokeWidth="2" />
              <text x="205" y="182" textAnchor="middle" fontSize={labelFontSize + 4} fontWeight="800" fill={COLORS.headingText}>
                9 = 3²
              </text>
            </g>
            {showIncluded && (
              <g className="animate-fade-400">
                <rect x="345" y="115" width="180" height="120" rx="14" fill={COLORS.highlight.tint} stroke={COLORS.highlight.solid} strokeWidth="2.5" />
                <text x="435" y="182" textAnchor="middle" fontSize={labelFontSize + 4} fontWeight="800" fill={COLORS.highlight.text}>
                  1 &amp; 36
                </text>
                {renderSingleHighlightRing(435, 175, 52)}
              </g>
            )}
          </g>
        );
      }

      case 'hexagonal-numbers': {
        const rings = showIncluded ? (stepIndex === 0 ? Math.max(4, sandbox.hexRings) : Math.max(5, sandbox.hexRings)) : 3;
        const allDots = getHexRingDots(rings, 320, 184, rings >= 5 ? 16 : 20);
        return (
          <g>
            {allDots.map((d, i) => {
              if (isPretraining && pretrainingIdx === 0 && d.ring > 0) return null;
              const isNew = d.ring === rings && showIncluded;
              return (
                <circle
                  key={i}
                  cx={d.x}
                  cy={d.y}
                  r={rings >= 5 ? 4.8 : 6}
                  fill={isNew ? COLORS.highlight.solid : d.ring === 0 ? COLORS.highlight.text : COLORS.primary}
                  opacity={isNew ? 1 : dimBase}
                />
              );
            })}
            {renderSingleHighlightRing(320, 184, 118)}
          </g>
        );
      }

      case 'powers-dimensions': {
        if (stepIndex === 0) {
          const drawCube = (x: number, y: number, col: string) => {
            const s = 34;
            const o = 14;
            return (
              <g stroke={col} strokeWidth="2" fill="none">
                <rect x={x} y={y} width={s} height={s} />
                <rect x={x + o} y={y - o} width={s} height={s} />
                <line x1={x} y1={y} x2={x + o} y2={y - o} />
                <line x1={x + s} y1={y} x2={x + s + o} y2={y - o} />
                <line x1={x} y1={y + s} x2={x + o} y2={y + s - o} />
                <line x1={x + s} y1={y + s} x2={x + s + o} y2={y + s - o} />
              </g>
            );
          };
          return (
            <g>
              <g opacity={dimBase}>
                <rect x="145" y="158" width="44" height="44" fill={COLORS.accent.tint} stroke={COLORS.primary} strokeWidth="2.5" />
                {drawCube(265, 162, COLORS.primary)}
              </g>
              {showIncluded && (
                <g className="animate-fade-400">
                  {drawCube(410, 152, COLORS.highlight.solid)}
                  {drawCube(478, 174, COLORS.highlight.solid)}
                  <line x1="410" y1="152" x2="478" y2="174" stroke={COLORS.accent.solid} strokeWidth="1.5" />
                  <line x1="444" y1="152" x2="512" y2="174" stroke={COLORS.accent.solid} strokeWidth="1.5" />
                  <line x1="410" y1="186" x2="478" y2="208" stroke={COLORS.accent.solid} strokeWidth="1.5" />
                  <line x1="444" y1="186" x2="512" y2="208" stroke={COLORS.accent.solid} strokeWidth="1.5" />
                  {renderSingleHighlightRing(470, 180, 56)}
                </g>
              )}
            </g>
          );
        }
        const drawPrism = (cx: number, cy: number, col: string) => (
          <g stroke={col} strokeWidth="2" fill="none">
            <polygon points={`${cx - 18},${cy + 14} ${cx + 18},${cy + 14} ${cx},${cy - 18}`} />
            <polygon points={`${cx + 12},${cy + 24} ${cx + 48},${cy + 24} ${cx + 30},${cy - 8}`} />
            <line x1={cx - 18} y1={cy + 14} x2={cx + 12} y2={cy + 24} />
            <line x1={cx + 18} y1={cy + 14} x2={cx + 48} y2={cy + 24} />
            <line x1={cx} y1={cy - 18} x2={cx + 30} y2={cy - 8} />
          </g>
        );
        return (
          <g>
            <g opacity={dimBase}>
              <polygon points="150,200 200,200 175,152" fill={COLORS.accent.tint} stroke={COLORS.primary} strokeWidth="2.5" />
              {drawPrism(310, 180, COLORS.primary)}
            </g>
            {showIncluded && (
              <g className="animate-fade-400">
                {drawPrism(445, 145, COLORS.highlight.solid)}
                {drawPrism(475, 180, COLORS.highlight.solid)}
                {drawPrism(505, 215, COLORS.highlight.solid)}
                {renderSingleHighlightRing(490, 180, 56)}
              </g>
            )}
          </g>
        );
      }

      case 'odd-sum-square': {
        if (stepIndex === 0) {
          const n = showIncluded ? sandbox.relN : 3;
          const cell = 38;
          const ox = 250;
          const oy = 90;
          return (
            <g>
              {Array.from({ length: n }, (_, r) =>
                Array.from({ length: n }, (_, c) => {
                  const layer = Math.max(r, c) + 1;
                  if (isPretraining && pretrainingIdx === 0 && layer > 2) return null;
                  const isNew = showIncluded && layer === n;
                  return (
                    <circle
                      key={`${r}-${c}`}
                      cx={ox + c * cell}
                      cy={oy + r * cell}
                      r="11.5"
                      fill={layer % 2 === 1 ? COLORS.primary : COLORS.highlight.solid}
                      opacity={isNew ? 1 : dimBase}
                    />
                  );
                })
              )}
              {renderSingleHighlightRing(ox + ((n - 1) * cell) / 2, oy + ((n - 1) * cell) / 2, 95)}
            </g>
          );
        }
        return (
          <g>
            <g opacity={dimBase}>
              <rect x="130" y="115" width="120" height="120" rx="12" fill={COLORS.accent.tint} stroke={COLORS.primary} strokeWidth="2.5" />
              <text x="190" y="180" textAnchor="middle" fontSize={labelFontSize + 2} fontWeight="800" fill={COLORS.headingText}>
                10 × 10
              </text>
            </g>
            {showIncluded && (
              <g className="animate-fade-400">
                <rect x="360" y="95" width="165" height="165" rx="12" fill={COLORS.highlight.tint} stroke={COLORS.highlight.solid} strokeWidth="2.5" />
                <text x="442" y="182" textAnchor="middle" fontSize={labelFontSize + 3} fontWeight="800" fill={COLORS.highlight.text}>
                  100 × 100
                </text>
                {renderSingleHighlightRing(442, 178, 88)}
              </g>
            )}
          </g>
        );
      }

      case 'up-down-square': {
        if (stepIndex === 0) {
          const n = showIncluded ? sandbox.relN : 4;
          const cols = Array.from({ length: 2 * n - 1 }, (_, i) => (i < n ? i + 1 : 2 * n - 1 - i));
          return (
            <g>
              {cols.map((count, ci) => {
                const x = 320 + (ci - (n - 1)) * 34;
                const isPeak = ci === n - 1;
                const isRight = ci > n - 1;
                if (isRight && !showIncluded) return null;
                return (
                  <g key={ci} opacity={isRight ? 1 : dimBase}>
                    {Array.from({ length: count }, (_, r) => (
                      <circle
                        key={r}
                        cx={x}
                        cy={176 + (r - (count - 1) / 2) * 28}
                        r="8.5"
                        fill={isPeak ? COLORS.highlight.solid : COLORS.primary}
                      />
                    ))}
                  </g>
                );
              })}
              {renderSingleHighlightRing(320, 176, 98)}
            </g>
          );
        }
        return (
          <g>
            <g opacity={dimBase}>
              <polygon points="195,115 260,180 195,245 130,180" fill={COLORS.accent.tint} stroke={COLORS.primary} strokeWidth="2.5" />
            </g>
            {showIncluded && (
              <g className="animate-fade-400">
                <polygon points="460,95 545,180 460,265 375,180" fill={COLORS.highlight.tint} stroke={COLORS.highlight.solid} strokeWidth="2.5" />
                {renderSingleHighlightRing(460, 180, 90)}
              </g>
            )}
          </g>
        );
      }

      case 'triangular-pairs': {
        const n = stepIndex === 0 ? 4 : sandbox.relN;
        const cell = 34;
        const ox = 250;
        const oy = 96;
        const shiftX = showIncluded ? 0 : 42;
        const shiftY = showIncluded ? 0 : -28;
        return (
          <g>
            <g opacity={dimBase}>
              {Array.from({ length: n }, (_, r) =>
                Array.from({ length: r + 1 }, (_, c) => (
                  <circle key={`l-${r}-${c}`} cx={ox + c * cell} cy={oy + r * cell} r="10" fill={COLORS.primary} />
                ))
              )}
            </g>
            {(!isPretraining || pretrainingIdx === 1) && (
              <g
                style={{
                  transform: `translate(${shiftX}px, ${shiftY}px)`,
                  transition: 'transform 400ms ease',
                }}
              >
                {Array.from({ length: n - 1 }, (_, r) =>
                  Array.from({ length: n - 1 - r }, (_, k) => (
                    <circle
                      key={`u-${r}-${k}`}
                      cx={ox + (r + 1 + k) * cell}
                      cy={oy + r * cell}
                      r="10"
                      fill={COLORS.highlight.solid}
                    />
                  ))
                )}
              </g>
            )}
            {renderSingleHighlightRing(ox + ((n - 1) * cell) / 2, oy + ((n - 1) * cell) / 2, 85)}
          </g>
        );
      }

      case 'hexagonal-to-cubes': {
        if (stepIndex === 0) {
          const angles = [0, 60, 120, 180, 240, 300];
          return (
            <g>
              <circle cx="320" cy="185" r="8.5" fill={COLORS.highlight.solid} />
              {angles.map((deg, ai) => {
                if (ai >= 4 && !showIncluded) return null;
                const rad = (deg * Math.PI) / 180;
                const pts = [
                  { x: 320 + Math.cos(rad) * 34, y: 185 + Math.sin(rad) * 34 },
                  { x: 320 + Math.cos(rad - 0.25) * 68, y: 185 + Math.sin(rad - 0.25) * 68 },
                  { x: 320 + Math.cos(rad + 0.25) * 68, y: 185 + Math.sin(rad + 0.25) * 68 },
                ];
                return pts.map((pt, pi) => (
                  <circle
                    key={`${ai}-${pi}`}
                    cx={pt.x}
                    cy={pt.y}
                    r="7.5"
                    fill={ai >= 4 ? COLORS.highlight.solid : COLORS.primary}
                    opacity={ai >= 4 ? 1 : dimBase}
                  />
                ));
              })}
              {renderSingleHighlightRing(320, 185, 86)}
            </g>
          );
        }
        const shells = ['+1', '+7', '+19', '+37'];
        return (
          <g>
            {shells.map((lbl, i) => {
              if (i === 3 && !showIncluded) return null;
              const x = 115 + i * 130;
              return (
                <g key={i} opacity={i === 3 ? 1 : dimBase}>
                  <polygon
                    points={`${x},120 ${x + 38},142 ${x + 38},186 ${x},208 ${x - 38},186 ${x - 38},142`}
                    fill={i === 3 ? COLORS.highlight.tint : COLORS.accent.tint}
                    stroke={i === 3 ? COLORS.highlight.solid : COLORS.primary}
                    strokeWidth="2.5"
                  />
                  <text x={x} y="170" textAnchor="middle" fontSize={labelFontSize} fontWeight="800" fill={COLORS.headingText}>
                    {lbl}
                  </text>
                </g>
              );
            })}
            {renderSingleHighlightRing(505, 164, 52)}
          </g>
        );
      }

      case 'powers-of-2-sum': {
        const terms = stepIndex === 0 ? [1, 2, 4, 8] : [1, 2, 4, 8, 16, 32];
        const totalCap = terms.reduce((a, b) => a + b, 0) + 1;
        const unitW = 440 / totalCap;
        let curX = 95;
        return (
          <g>
            <g opacity={dimBase}>
              {terms.map((t, i) => {
                const w = Math.max(12, t * unitW);
                const x = curX;
                curX += w;
                return (
                  <g key={i}>
                    <rect x={x} y="152" width={w - 2} height="56" rx="4" fill={i % 2 === 0 ? COLORS.primary : COLORS.accent.solid} />
                    {w > 26 && (
                      <text x={x + w / 2 - 1} y="186" textAnchor="middle" fontSize={labelFontSize} fontWeight="800" fill={COLORS.surface}>
                        {t}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
            {showIncluded && (
              <g className="animate-fade-400">
                <rect x={curX} y="152" width={Math.max(14, unitW)} height="56" rx="4" fill={COLORS.highlight.solid} />
                {renderSingleHighlightRing(curX + Math.max(7, unitW / 2), 180, 32)}
              </g>
            )}
          </g>
        );
      }

      case 'regular-polygons': {
        const sides = stepIndex === 0 ? (showIncluded ? 5 : 4) : sandbox.polySides;
        const pts = polygonPoints(320, 178, 90, sides);
        return (
          <g>
            <polygon
              points={pointsToSvgString(pts)}
              fill={COLORS.accent.tint}
              stroke={COLORS.primary}
              strokeWidth="3"
              opacity={dimBase}
            />
            {pts.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="7.5"
                fill={i === sides - 1 && showIncluded ? COLORS.highlight.solid : COLORS.primary}
              />
            ))}
            <text x="320" y="186" textAnchor="middle" fontSize={labelFontSize + 2} fontWeight="800" fill={COLORS.headingText}>
              {polygonName(sides)}
            </text>
            {renderSingleHighlightRing(320, 178, 98)}
          </g>
        );
      }

      case 'complete-graphs': {
        const n = stepIndex === 0 ? (showIncluded ? 4 : 3) : sandbox.graphNodes;
        const pts = polygonPoints(280, 185, 88, n);
        const newIdx = n - 1;
        return (
          <g>
            {pts.map((a, i) =>
              pts.slice(i + 1).map((b, jOff) => {
                const j = i + 1 + jOff;
                const isNew = j === newIdx && showIncluded;
                return (
                  <line
                    key={`${i}-${j}`}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke={isNew ? COLORS.highlight.solid : COLORS.primary}
                    strokeWidth={isNew ? 3 : 2}
                    opacity={isNew ? 1 : dimBase}
                  />
                );
              })
            )}
            {pts.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="8" fill={i === newIdx ? COLORS.highlight.solid : COLORS.primary} />
            ))}
            <rect x="425" y="150" width="140" height="72" rx="12" fill={COLORS.pageBg} stroke={COLORS.divider} strokeWidth="2" />
            <text x="495" y="193" textAnchor="middle" fontSize={labelFontSize + 1} fontWeight="800" fill={COLORS.headingText}>
              K{n}: {completeGraphEdges(n)} lines
            </text>
            {renderSingleHighlightRing(280, 185, 96)}
          </g>
        );
      }

      case 'stacked-shapes': {
        const n = stepIndex === 0 ? (showIncluded ? 3 : 2) : sandbox.stackN;
        const rowH = 34;
        const colW = 20;
        const triCx = 210;
        const triTopY = 82;
        const sqSize = 32;
        const sqX = 395;
        const sqY = 90;
        return (
          <g>
            {Array.from({ length: n }, (_, r) =>
              Array.from({ length: 2 * r + 1 }, (_, c) => {
                const y0 = triTopY + r * rowH;
                const xM = triCx + (c - r) * colW;
                const pts =
                  c % 2 === 1
                    ? `${xM - colW},${y0} ${xM + colW},${y0} ${xM},${y0 + rowH}`
                    : `${xM},${y0} ${xM - colW},${y0 + rowH} ${xM + colW},${y0 + rowH}`;
                const isLast = r === n - 1 && showIncluded;
                return (
                  <polygon
                    key={`${r}-${c}`}
                    points={pts}
                    fill={isLast ? COLORS.highlight.tint : COLORS.accent.tint}
                    stroke={isLast ? COLORS.highlight.solid : COLORS.primary}
                    strokeWidth="2"
                    opacity={isLast ? 1 : dimBase}
                  />
                );
              })
            )}
            {Array.from({ length: n }, (_, r) =>
              Array.from({ length: n }, (_, c) => (
                <rect
                  key={`${r}-${c}`}
                  x={sqX + c * sqSize}
                  y={sqY + r * sqSize}
                  width={sqSize}
                  height={sqSize}
                  fill={(r === n - 1 || c === n - 1) && showIncluded ? COLORS.highlight.tint : COLORS.accent.tint}
                  stroke={COLORS.primary}
                  strokeWidth="2"
                  opacity={dimBase}
                />
              ))
            )}
            {renderSingleHighlightRing(triCx, triTopY + ((n - 1) * rowH) / 2, 75)}
          </g>
        );
      }

      case 'koch-snowflake': {
        const kStep = stepIndex === 0 ? (showIncluded ? 1 : 0) : sandbox.kochStep;
        return (
          <g>
            <g opacity={dimBase}>
              <rect x="44" y="128" width="190" height="114" rx="12" fill={COLORS.pageBg} stroke={COLORS.divider} strokeWidth="1.5" />
              <line x1="74" y1="158" x2="204" y2="158" stroke={COLORS.primary} strokeWidth="3" />
              <polyline points="74,218 117,218 139,184 161,218 204,218" fill="none" stroke={COLORS.highlight.solid} strokeWidth="3" />
            </g>
            <polygon
              points={pointsToSvgString(buildKochPoints(400, 188, 92, kStep))}
              fill={COLORS.accent.tint}
              stroke={showIncluded ? COLORS.highlight.solid : COLORS.primary}
              strokeWidth="2.5"
            />
            {renderSingleHighlightRing(400, 188, 102)}
          </g>
        );
      }

      case 'shape-number-insights': {
        if (stepIndex === 0) {
          const sides = showIncluded ? 5 : 4;
          const pts = polygonPoints(320, 185, 86, sides);
          return (
            <g>
              <polygon points={pointsToSvgString(pts)} fill={COLORS.accent.tint} stroke={COLORS.primary} strokeWidth="3" />
              {pts.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="7.5" fill={i === sides - 1 && showIncluded ? COLORS.highlight.solid : COLORS.primary} />
              ))}
              {renderSingleHighlightRing(320, 185, 96)}
            </g>
          );
        }
        if (stepIndex === 1) {
          const n = showIncluded ? 4 : 3;
          const pts = polygonPoints(190, 185, 76, n);
          return (
            <g>
              {pts.map((a, i) =>
                pts.slice(i + 1).map((b, jOff) => (
                  <line
                    key={`${i}-${jOff}`}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke={i + 1 + jOff === n - 1 && showIncluded ? COLORS.highlight.solid : COLORS.primary}
                    strokeWidth="2.5"
                  />
                ))
              )}
              {pts.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="7.5" fill={COLORS.primary} />
              ))}
              {[1, 2, 3].map((row) =>
                Array.from({ length: row }, (_, c) => (
                  <circle
                    key={`${row}-${c}`}
                    cx={455 + (c - (row - 1) / 2) * 28}
                    cy={138 + (row - 1) * 32}
                    r="9"
                    fill={row === 3 && showIncluded ? COLORS.highlight.solid : COLORS.primary}
                  />
                ))
              )}
              {renderSingleHighlightRing(190, 185, 86)}
            </g>
          );
        }
        if (stepIndex === 2) {
          const n = showIncluded ? 3 : 2;
          return (
            <g>
              {Array.from({ length: n }, (_, r) =>
                Array.from({ length: 2 * r + 1 }, (_, c) => {
                  const y0 = 110 + r * 36;
                  const xM = 190 + (c - r) * 20;
                  const pts = c % 2 === 1 ? `${xM - 20},${y0} ${xM + 20},${y0} ${xM},${y0 + 36}` : `${xM},${y0} ${xM - 20},${y0 + 36} ${xM + 20},${y0 + 36}`;
                  return <polygon key={`${r}-${c}`} points={pts} fill={r === 2 ? COLORS.highlight.tint : COLORS.accent.tint} stroke={COLORS.primary} strokeWidth="2" />;
                })
              )}
              {Array.from({ length: n }, (_, r) =>
                Array.from({ length: n }, (_, c) => (
                  <rect key={`${r}-${c}`} x={390 + c * 36} y={110 + r * 36} width="36" height="36" fill={r === 2 || c === 2 ? COLORS.highlight.tint : COLORS.accent.tint} stroke={COLORS.primary} strokeWidth="2" />
                ))
              )}
              {renderSingleHighlightRing(190, 165, 76)}
            </g>
          );
        }
        const kStep = showIncluded ? 2 : 1;
        return (
          <g>
            <polyline points="68,195 112,195 135,158 158,195 202,195" fill="none" stroke={COLORS.highlight.solid} strokeWidth="3" opacity={dimBase} />
            <polygon
              points={pointsToSvgString(buildKochPoints(420, 185, 88, kStep))}
              fill={COLORS.accent.tint}
              stroke={showIncluded ? COLORS.highlight.solid : COLORS.primary}
              strokeWidth="2.5"
            />
            {renderSingleHighlightRing(420, 185, 98)}
          </g>
        );
      }

      case 'chapter-summary': {
        return (
          <g>
            <g opacity={dimBase}>
              <rect x="65" y="120" width="160" height="105" rx="14" fill={COLORS.accent.tint} stroke={COLORS.primary} strokeWidth="2.5" />
              <text x="145" y="178" textAnchor="middle" fontSize={labelFontSize} fontWeight="800" fill={COLORS.headingText}>
                1, 3, 6, 10
              </text>
              <rect x="245" y="120" width="150" height="105" rx="14" fill={COLORS.highlight.tint} stroke={COLORS.highlight.solid} strokeWidth="2.5" />
              <text x="320" y="178" textAnchor="middle" fontSize={labelFontSize} fontWeight="800" fill={COLORS.headingText}>
                n² &amp; n³
              </text>
            </g>
            {showIncluded && (
              <g className="animate-fade-400">
                <rect x="415" y="120" width="160" height="105" rx="14" fill={COLORS.successBg} stroke={COLORS.successBorder} strokeWidth="2.5" />
                <text x="495" y="178" textAnchor="middle" fontSize={labelFontSize} fontWeight="800" fill={COLORS.successText}>
                  3 × 4ⁿ
                </text>
                {renderSingleHighlightRing(495, 172, 68)}
              </g>
            )}
          </g>
        );
      }
    }
  };

  return (
    <svg
      viewBox="0 0 640 350"
      className="w-full h-full max-h-[340px] lg:max-h-full select-none"
      role="img"
      aria-label={step.title}
    >
      {/* 1. Clean frame (0 ms) */}
      {renderBaseAxes()}

      {/* 2 & 3. Objects + single 1s highlight */}
      {renderObjects()}

      {/* 2b. Pretraining single component label */}
      {isPretraining && step.components[pretrainingIdx] && (
        renderOnObjectTag(
          step.components[pretrainingIdx].anchor.x,
          Math.max(40, step.components[pretrainingIdx].anchor.y - 45),
          getReadoutLabel(step.components[pretrainingIdx], reprMode),
          'primary',
          'animate-fade-200'
        )
      )}

      {/* 4. Linking (200 ms after settle): on-object readouts (1–3 words each) */}
      {showReadouts &&
        step.readouts.map((r, idx) => (
          <React.Fragment key={r.id}>
            {renderOnObjectTag(
              r.anchor.x,
              r.anchor.y,
              getReadoutLabel(r, reprMode),
              idx === step.readouts.length - 1 ? 'highlight' : 'primary',
              'animate-fade-200'
            )}
          </React.Fragment>
        ))}
    </svg>
  );
};
