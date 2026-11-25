/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { COLORS } from '../../design/tokens';
import {
  ClassroomStep,
  ProgressivePhase,
  RepresentationMode,
  UiMode,
} from '../../engine/useProgressiveStep';
import { HighlightHeadline } from '../HighlightHeadline';

export type SolutionSectionKey =
  | 'sol-sec-1-1'
  | 'sol-sec-1-2'
  | 'sol-sec-1-3'
  | 'sol-sec-1-4'
  | 'sol-sec-1-5-6';

export interface SolutionStepItem extends ClassroomStep {
  subTabId: SolutionSectionKey;
  pageRef: string;
  svgKind: 'market' | 'table1' | 'magic36' | 'hex61' | 'odds' | 'koch';
}

export const SOLUTION_STEPS: SolutionStepItem[] = [
  {
    id: 'sol-1-1-q1',
    subTabId: 'sol-sec-1-1',
    title: '1.1 Everyday math',
    headline: 'Spot math in daily life',
    focusWord: 'daily',
    question: 'Multiply rate by weight to find market cost.',
    teacherPrompt: 'Where else do you use multiplication rates outside a shop?',
    pageRef: 'p. 2 & p. 13',
    ncertRef: 'Exercise 1.1, Q1 (p. 13)',
    svgKind: 'market',
    components: [],
    readouts: [
      { id: 'r1', pictureLabel: '₹40 per kg', wordLabel: 'Unit rate', symbolLabel: 'r = 40', anchor: { x: 165, y: 120 } },
      { id: 'r2', pictureLabel: '3.5 kg = ₹140', wordLabel: 'Total cost', symbolLabel: '3.5×40 = 140', anchor: { x: 475, y: 120 } },
    ],
    equationLines: ['1 kg = ₹40', '2 kg = ₹80', '3.5 kg = ₹140'],
    reprSummary: {
      picture: 'Cost grows at ₹40 per box.',
      words: 'Multiply the rate by how much you buy.',
      symbol: 'Cost = Rate × Quantity',
    },
    check: {
      prompt: 'Cost of 2.5 kg at ₹40/kg?',
      options: [
        { id: '100', text: '₹100', isCorrect: true, reason: '2.5 × 40 equals 100.' },
        { id: '80', text: '₹80', isCorrect: false, reason: '80 is for 2 kg, not 2.5 kg.' },
      ],
    },
  },
  {
    id: 'sol-1-2-q1',
    subTabId: 'sol-sec-1-2',
    title: '1.2 Table 1 rules',
    headline: 'Find next terms in Table 1',
    focusWord: 'Table 1',
    question: 'Check each Table 1 rule and its next three numbers.',
    teacherPrompt: 'How do you decide whether a sequence adds or multiplies?',
    pageRef: 'p. 3 & p. 13',
    ncertRef: 'Table 1 Solutions (p. 13)',
    svgKind: 'table1',
    components: [],
    readouts: [
      { id: 'r1', pictureLabel: 'Triangular +8', wordLabel: 'Next: 36, 45', symbolLabel: 'T₈=36, T₉=45', anchor: { x: 170, y: 110 } },
      { id: 'r2', pictureLabel: 'Cubes n³', wordLabel: 'Next: 343, 512', symbolLabel: '7³=343', anchor: { x: 470, y: 110 } },
    ],
    equationLines: ['Tri: 28 → 36, 45, 55', 'Squares: 49 → 64, 81, 100', 'Cubes: 216 → 343, 512, 729', 'Vir: 21 → 34, 55, 89'],
    reprSummary: {
      picture: 'Each row grows by a clear jump.',
      words: 'Match the rule to predict ahead.',
      symbol: 'Tₙ, n², n³, 2ⁿ',
    },
    check: {
      prompt: 'Next Virahānka number after 13, 21?',
      options: [
        { id: '34', text: '34', isCorrect: true, reason: '13 + 21 equals 34.' },
        { id: '29', text: '29', isCorrect: false, reason: 'Add the two preceding terms.' },
      ],
    },
  },
  {
    id: 'sol-1-3-q3',
    subTabId: 'sol-sec-1-3',
    title: '1.3 Magic of 36',
    headline: 'Why 36 fits both shapes',
    focusWord: '36',
    question: 'Arrange 36 dots as an 8-row triangle and 6 × 6 square.',
    teacherPrompt: 'What is the only number smaller than 36 that is both triangular and square?',
    pageRef: 'p. 5 & p. 13',
    ncertRef: 'Exercise 1.3, Q3 (p. 13)',
    svgKind: 'magic36',
    components: [],
    readouts: [
      { id: 'r1', pictureLabel: '8-row triangle', wordLabel: '36 dots', symbolLabel: 'T₈ = 36', anchor: { x: 165, y: 275 } },
      { id: 'r2', pictureLabel: '6 × 6 grid', wordLabel: '36 dots', symbolLabel: '6² = 36', anchor: { x: 475, y: 275 } },
    ],
    equationLines: ['1 + 2 + … + 8 = 36', '6 × 6 = 36', 'T₈ = 6² = 36'],
    reprSummary: {
      picture: 'Both shapes hold 36 dots.',
      words: 'Same dots form triangle and square.',
      symbol: 'T₈ = 36 = 6²',
    },
    check: {
      prompt: 'Which square grid has 36 dots?',
      options: [
        { id: '6x6', text: '6 × 6', isCorrect: true, reason: '6 times 6 equals 36.' },
        { id: '8x8', text: '8 × 8', isCorrect: false, reason: '8 times 8 is 64 dots.' },
      ],
    },
  },
  {
    id: 'sol-1-3-q4',
    subTabId: 'sol-sec-1-3',
    title: '1.3 Hexagonal 61',
    headline: 'Next hexagonal number is 61',
    focusWord: '61',
    question: 'Add Ring 4 (+24) to 37 to reach 61.',
    teacherPrompt: 'Why do ring jumps increase by 6 each time?',
    pageRef: 'p. 5 & p. 14',
    ncertRef: 'Exercise 1.3, Q4 (p. 14)',
    svgKind: 'hex61',
    components: [],
    readouts: [
      { id: 'r1', pictureLabel: '+6, +12, +18', wordLabel: 'Ring jumps', symbolLabel: '+6k', anchor: { x: 220, y: 112 } },
      { id: 'r2', pictureLabel: 'Ring 4 = 61', wordLabel: '37 + 24 = 61', symbolLabel: 'H₅ = 61', anchor: { x: 525, y: 112 } },
    ],
    equationLines: ['1 + 6 = 7', '7 + 12 = 19', '19 + 18 = 37', '37 + 24 = 61'],
    reprSummary: {
      picture: 'Ring 4 adds 24 outer dots.',
      words: 'Each ring adds 6 more dots.',
      symbol: '37 + 24 = 61',
    },
    check: {
      prompt: 'Next after 61 (+30)?',
      options: [
        { id: '91', text: '91', isCorrect: true, reason: '61 + 30 equals 91.' },
        { id: '85', text: '85', isCorrect: false, reason: 'Ring 5 adds 30, not 24.' },
      ],
    },
  },
  {
    id: 'sol-1-4-q1',
    subTabId: 'sol-sec-1-4',
    title: '1.4 Square relations',
    headline: 'Four ways to build squares',
    focusWord: 'squares',
    question: 'Odd sums, up-down sums, and triangle pairs all give n².',
    teacherPrompt: 'Which proof makes n² easiest for you to see in your head?',
    pageRef: 'pp. 7–9 & 14–16',
    ncertRef: 'Exercise 1.4, Q1 (p. 14)',
    svgKind: 'odds',
    components: [],
    readouts: [
      { id: 'r1', pictureLabel: '4 × 4 grid', wordLabel: '16 total', symbolLabel: '4² = 16', anchor: { x: 180, y: 120 } },
      { id: 'r2', pictureLabel: '100² = 10,000', wordLabel: '100 odds', symbolLabel: '100²', anchor: { x: 465, y: 120 } },
    ],
    equationLines: ['1+3+5+7 = 16', '1+2+3+4+3+2+1 = 16', 'T₃ + T₄ = 6 + 10 = 16', '100 odds = 10,000'],
    reprSummary: {
      picture: 'One 4×4 grid shows all three rules.',
      words: 'All three sums make 16.',
      symbol: '16 = 4²',
    },
    check: {
      prompt: 'Sum of first 15 odd numbers?',
      options: [
        { id: '225', text: '225 (15²)', isCorrect: true, reason: '15 times 15 equals 225.' },
        { id: '30', text: '30', isCorrect: false, reason: 'Square 15 instead of doubling.' },
      ],
    },
  },
  {
    id: 'sol-1-5-q5',
    subTabId: 'sol-sec-1-5-6',
    title: '1.5–1.6 Shapes & Koch',
    headline: 'Koch snowflake multiplies by four',
    focusWord: 'four',
    question: 'Each straight segment turns into 4 smaller segments.',
    teacherPrompt: 'Why do Koch segments grow so much faster than polygon sides?',
    pageRef: 'pp. 10–12 & 16–17',
    ncertRef: 'Exercise 1.5, Q5 (p. 16)',
    svgKind: 'koch',
    components: [],
    readouts: [
      { id: 'r1', pictureLabel: '1 → 4 rule', wordLabel: 'Times 4', symbolLabel: '× 4', anchor: { x: 165, y: 112 } },
      { id: 'r2', pictureLabel: '3, 12, 48, 192', wordLabel: 'Powers of 4', symbolLabel: '3 × 4ⁿ', anchor: { x: 465, y: 112 } },
    ],
    equationLines: ['Step 0 = 3', 'Step 1 = 12', 'Step 2 = 48', 'Step 3 = 192', 'Step 4 = 768'],
    reprSummary: {
      picture: 'Every flat side grows 4 parts.',
      words: 'Multiply the segment count by 4.',
      symbol: 'Sₙ = 3 × 4ⁿ',
    },
    check: {
      prompt: 'Segments at Koch Step 3?',
      options: [
        { id: '192', text: '192', isCorrect: true, reason: '48 × 4 equals 192.' },
        { id: '64', text: '64', isCorrect: false, reason: 'Start with 3 sides, then ×4 thrice.' },
      ],
    },
  },
];

interface BuildSolutionViewsArgs {
  step: SolutionStepItem;
  mode: UiMode;
  reprMode: RepresentationMode;
  onChangeReprMode: (r: RepresentationMode) => void;
  phase?: ProgressivePhase;
}

export function useSolutionViews({
  step,
  mode,
  reprMode,
  onChangeReprMode,
  phase = 'SETTLED',
}: BuildSolutionViewsArgs) {
  const [selectedOptId, setSelectedOptId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedOptId(null);
  }, [step.id]);

  const isProjector = mode === 'projector';
  const bodyClass = isProjector ? 'cm-body-projector' : 'cm-body-student';
  const btnClass = isProjector ? 'cm-btn-projector px-4' : 'cm-btn-student px-3';
  const labelFontSize = isProjector ? 18 : 15;

  const visibleEqLines = step.equationLines.slice(-(isProjector ? 6 : 2));
  const chosenOption = step.check?.options.find((o) => o.id === selectedOptId);

  const renderSvg = () => {
    if (step.svgKind === 'magic36') {
      return (
        <g>
          {Array.from({ length: 8 }, (_, r) =>
            Array.from({ length: r + 1 }, (_, c) => (
              <circle key={`t-${r}-${c}`} cx={165 + (c - r / 2) * 20} cy={62 + r * 24} r="5.5" fill={COLORS.primary} />
            ))
          )}
          {Array.from({ length: 6 }, (_, r) =>
            Array.from({ length: 6 }, (_, c) => (
              <circle key={`s-${r}-${c}`} cx={415 + c * 24} cy={86 + r * 24} r="6" fill={COLORS.highlight.solid} />
            ))
          )}
        </g>
      );
    }
    if (step.svgKind === 'hex61') {
      return (
        <g>
          {[1, 7, 19, 37, 61].map((val, i) => {
            const x = 90 + i * 115;
            return (
              <g key={val}>
                <polygon
                  points={`${x},135 ${x + 34},155 ${x + 34},195 ${x},215 ${x - 34},195 ${x - 34},155`}
                  fill={i === 4 ? COLORS.highlight.tint : COLORS.accent.tint}
                  stroke={i === 4 ? COLORS.highlight.solid : COLORS.primary}
                  strokeWidth="2.5"
                />
                <text x={x} y="182" textAnchor="middle" fontSize={labelFontSize + 2} fontWeight="800" fill={COLORS.headingText}>
                  {val}
                </text>
              </g>
            );
          })}
        </g>
      );
    }
    if (step.svgKind === 'odds') {
      return (
        <g>
          {Array.from({ length: 4 }, (_, r) =>
            Array.from({ length: 4 }, (_, c) => (
              <rect
                key={`${r}-${c}`}
                x={224 + c * 48}
                y={82 + r * 48}
                width="44"
                height="44"
                rx="8"
                fill={Math.max(r, c) % 2 === 0 ? COLORS.accent.tint : COLORS.highlight.tint}
                stroke={COLORS.primary}
                strokeWidth="2"
              />
            ))
          )}
        </g>
      );
    }
    if (step.svgKind === 'market') {
      return (
        <g>
          {[1, 2, 3, 3.5].map((qty, i) => {
            const x = 110 + i * 135;
            return (
              <g key={i}>
                <rect x={x - 48} y="145" width="96" height="84" rx="12" fill={i === 3 ? COLORS.highlight.tint : COLORS.accent.tint} stroke={i === 3 ? COLORS.highlight.solid : COLORS.primary} strokeWidth="2.5" />
                <text x={x} y="180" textAnchor="middle" fontSize={labelFontSize} fontWeight="800" fill={COLORS.headingText}>
                  {qty} kg
                </text>
                <text x={x} y="208" textAnchor="middle" fontSize={labelFontSize} fontWeight="800" fill={COLORS.primary}>
                  ₹{qty * 40}
                </text>
              </g>
            );
          })}
        </g>
      );
    }
    return (
      <g>
        <rect x="65" y="140" width="510" height="110" rx="14" fill={COLORS.accent.tint} stroke={COLORS.primary} strokeWidth="2.5" />
        <text x="320" y="192" textAnchor="middle" fontSize={labelFontSize + 2} fontWeight="800" fill={COLORS.headingText}>
          {step.pageRef}
        </text>
        <text x="320" y="222" textAnchor="middle" fontSize={labelFontSize} fontWeight="700" fill={COLORS.primary}>
          {step.reprSummary[reprMode]}
        </text>
      </g>
    );
  };

  return {
    stage: (
      <div className="w-full h-full min-h-0 flex flex-col justify-between gap-2">
        <div className="space-y-1 shrink-0">
          {step.ncertRef && (
            <div className="px-2.5 py-0.5 rounded-md border text-[13px] font-bold bg-slate-100 text-slate-700 border-slate-300 w-fit mb-1">
              {step.ncertRef}
            </div>
          )}
          <HighlightHeadline text={step.headline} focusWord={step.focusWord} mode={mode} />
          <p className={bodyClass} style={{ color: COLORS.bodyText }}>
            {step.question}
          </p>
        </div>

        <div className="flex-1 min-h-0 w-full flex items-center justify-center">
          <svg viewBox="0 0 640 330" className="w-full h-full max-h-[320px] lg:max-h-full select-none">
            {phase !== 'CLEAN_FRAME' && (
              <g className="animate-fade-400">
                {renderSvg()}
              </g>
            )}
            {(phase === 'LINKING' || phase === 'SETTLED') &&
              step.readouts.map((r, i) => {
                const txt =
                  reprMode === 'picture'
                    ? r.pictureLabel
                    : reprMode === 'words'
                    ? r.wordLabel
                    : r.symbolLabel;
                const w = Math.max(95, txt.length * 9 + 22);
                const bx = Math.max(8, Math.min(632 - w, r.anchor.x - w / 2));
                const by = Math.max(8, Math.min(295, r.anchor.y - 16));
                const hi = i === step.readouts.length - 1;
                return (
                  <g key={r.id} className="animate-fade-200">
                    <rect
                      x={bx}
                      y={by}
                      width={w}
                      height="32"
                      rx="8"
                      fill={hi ? COLORS.highlight.tint : COLORS.accent.tint}
                      stroke={hi ? COLORS.highlight.solid : COLORS.primary}
                      strokeWidth="2"
                    />
                    <text
                      x={bx + w / 2}
                      y={by + 21}
                      textAnchor="middle"
                      fontSize={labelFontSize}
                      fontWeight="700"
                      fill={hi ? COLORS.highlight.text : COLORS.headingText}
                    >
                      {txt}
                    </text>
                  </g>
                );
              })}
          </svg>
        </div>
      </div>
    ),
    symbols: (
      <div className="w-full h-full flex flex-col justify-between gap-3">
        <div className="space-y-3">
          {step.ncertRef && (
            <div className="px-2.5 py-0.5 rounded-md border text-[13px] font-bold bg-slate-100 text-slate-700 border-slate-300 w-fit">
              {step.ncertRef}
            </div>
          )}
          <div className="grid grid-cols-3 gap-3" role="group" aria-label="View mode">
            {(['picture', 'words', 'symbol'] as RepresentationMode[]).map((opt) => {
              const active = reprMode === opt;
              const label = opt === 'picture' ? 'Picture' : opt === 'words' ? 'Words' : 'Symbol';
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onChangeReprMode(opt)}
                  aria-pressed={active}
                  className={`${isProjector ? 'cm-btn-projector' : 'cm-btn-student'} rounded-xl border cursor-pointer transition-colors`}
                  style={{
                    backgroundColor: active ? COLORS.primary : COLORS.surface,
                    borderColor: active ? COLORS.primary : COLORS.divider,
                    color: active ? COLORS.surface : COLORS.headingText,
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div
            className="rounded-xl border p-3 space-y-1"
            style={{ backgroundColor: COLORS.pageBg, borderColor: COLORS.divider }}
          >
            {visibleEqLines.map((line, i) => (
              <div
                key={`${i}-${line}`}
                className={bodyClass}
                style={{
                  color: COLORS.headingText,
                  opacity: i === visibleEqLines.length - 1 ? 1 : 0.45,
                }}
              >
                {line}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            {step.readouts.map((r, i) => {
              const hi = i === step.readouts.length - 1;
              const txt =
                reprMode === 'picture'
                  ? r.pictureLabel
                  : reprMode === 'words'
                  ? r.wordLabel
                  : r.symbolLabel;
              return (
                <div
                  key={r.id}
                  className={`${bodyClass} px-3 py-1.5 rounded-xl border`}
                  style={{
                    backgroundColor: hi ? COLORS.highlight.tint : COLORS.accent.tint,
                    borderColor: hi ? COLORS.highlight.solid : COLORS.primary,
                    color: hi ? COLORS.highlight.text : COLORS.headingText,
                  }}
                >
                  {txt}
                </div>
              );
            })}
          </div>

          <p className={bodyClass} style={{ color: COLORS.bodyText }}>
            {step.reprSummary[reprMode]}
          </p>
        </div>

        {step.check && (
          <div className="pt-2 border-t space-y-2.5" style={{ borderColor: COLORS.divider }}>
            <p className={bodyClass} style={{ color: COLORS.headingText }}>
              {step.check.prompt}
            </p>
            <div className="flex flex-wrap gap-3">
              {step.check.options.map((opt) => {
                const picked = selectedOptId === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedOptId(opt.id)}
                    className={`${btnClass} rounded-xl border cursor-pointer transition-colors`}
                    style={{
                      backgroundColor: picked
                        ? opt.isCorrect
                          ? COLORS.successBg
                          : COLORS.highlight.tint
                        : COLORS.surface,
                      borderColor: picked
                        ? opt.isCorrect
                          ? COLORS.successBorder
                          : COLORS.highlight.solid
                        : COLORS.divider,
                      color: picked
                        ? opt.isCorrect
                          ? COLORS.successText
                          : COLORS.highlight.text
                        : COLORS.headingText,
                    }}
                  >
                    {opt.text}
                  </button>
                );
              })}
            </div>
            {chosenOption && (
              <div
                className={`${bodyClass} flex items-center gap-2`}
                style={{
                  color: chosenOption.isCorrect ? COLORS.successText : COLORS.highlight.text,
                }}
              >
                {chosenOption.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 shrink-0" />
                )}
                <span>{chosenOption.reason}</span>
              </div>
            )}
          </div>
        )}
      </div>
    ),
  };
}
