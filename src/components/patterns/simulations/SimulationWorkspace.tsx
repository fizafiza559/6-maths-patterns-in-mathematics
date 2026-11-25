/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { COLORS } from '../../../design/tokens';
import {
  ClassroomStep,
  RepresentationMode,
  UiMode,
  useProgressiveStep,
} from '../../../engine/useProgressiveStep';
import { HighlightHeadline } from '../../HighlightHeadline';
import {
  DEFAULT_SANDBOX_STATE,
  getReadoutLabel,
  PatternSvgCanvas,
  SandboxState,
  TABLE_1_SEQUENCES,
} from './PatternSvgCanvas';
import { SimTopicId } from './patternSimData';

export interface ActiveTopicStep extends ClassroomStep {
  topicId: SimTopicId;
  topicStepIndex: number;
}

interface SimulationWorkspaceProps {
  step: ActiveTopicStep;
  mode: UiMode;
  reprMode: RepresentationMode;
  onChangeReprMode: (r: RepresentationMode) => void;
  progressive: ReturnType<typeof useProgressiveStep>;
}

export function useSimulationViews({
  step,
  mode,
  reprMode,
  onChangeReprMode,
  progressive,
}: SimulationWorkspaceProps) {
  const [sandbox, setSandbox] = useState<SandboxState>(DEFAULT_SANDBOX_STATE);
  const [selectedOptId, setSelectedOptId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedOptId(null);
  }, [step.id]);

  const isProjector = mode === 'projector';
  const bodyClass = isProjector ? 'cm-body-projector' : 'cm-body-student';
  const btnClass = isProjector ? 'cm-btn-projector px-4' : 'cm-btn-student px-3';

  // Student mode (phone, tablet, laptop): latest 2 lines; Projector: up to 6 lines, earlier dimmed
  const maxEqLines = isProjector ? 6 : 2;
  const visibleEqLines = step.equationLines.slice(-maxEqLines);

  const chosenOption = step.check?.options.find((o) => o.id === selectedOptId);

  const renderSandboxControls = () => {
    const cls = `${btnClass} rounded-xl border cursor-pointer whitespace-nowrap transition-colors`;

    if (step.topicId === 'humanity-forward' && step.topicStepIndex === 2) {
      return (
        <div data-no-nav="true" className="w-full flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => setSandbox((s) => ({ ...s, binA: s.binA ? 0 : 1 }))}
            className={cls}
            style={{
              backgroundColor: sandbox.binA ? COLORS.accent.tint : COLORS.surface,
              borderColor: COLORS.primary,
              color: COLORS.headingText,
            }}
          >
            A = {sandbox.binA}
          </button>
          <button
            type="button"
            onClick={() => setSandbox((s) => ({ ...s, binB: s.binB ? 0 : 1 }))}
            className={cls}
            style={{
              backgroundColor: sandbox.binB ? COLORS.accent.tint : COLORS.surface,
              borderColor: COLORS.primary,
              color: COLORS.headingText,
            }}
          >
            B = {sandbox.binB}
          </button>
        </div>
      );
    }

    if (step.topicId === 'sequence-rules' && step.topicStepIndex === 1) {
      return (
        <div data-no-nav="true" className="w-full flex items-center gap-3 pt-1">
          <select
            aria-label="Choose sequence"
            value={sandbox.seqIdx}
            onChange={(e) => setSandbox((s) => ({ ...s, seqIdx: Number(e.target.value) }))}
            className={`${btnClass} rounded-xl border bg-white cursor-pointer`}
            style={{ borderColor: COLORS.divider, color: COLORS.headingText }}
          >
            {TABLE_1_SEQUENCES.map((seq, i) => (
              <option key={seq.name} value={i}>
                {seq.name} ({seq.rule})
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (step.topicId === 'number-36-magic' && step.topicStepIndex === 0) {
      return (
        <div data-no-nav="true" className="w-full flex flex-wrap items-center gap-3 pt-1">
          {(['triangle', 'square'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setSandbox((s) => ({ ...s, morph36: m }))}
              className={cls}
              style={{
                backgroundColor: sandbox.morph36 === m ? COLORS.primary : COLORS.surface,
                borderColor: sandbox.morph36 === m ? COLORS.primary : COLORS.divider,
                color: sandbox.morph36 === m ? COLORS.surface : COLORS.headingText,
              }}
            >
              {m === 'triangle' ? 'Triangle (T₈)' : 'Square (6²)'}
            </button>
          ))}
        </div>
      );
    }

    if (step.topicId === 'hexagonal-numbers' && step.topicStepIndex === 1) {
      return (
        <div data-no-nav="true" className="w-full flex flex-wrap items-center gap-3 pt-1">
          {[2, 3, 4, 5].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setSandbox((s) => ({ ...s, hexRings: r }))}
              className={cls}
              style={{
                backgroundColor: sandbox.hexRings === r ? COLORS.primary : COLORS.surface,
                borderColor: sandbox.hexRings === r ? COLORS.primary : COLORS.divider,
                color: sandbox.hexRings === r ? COLORS.surface : COLORS.headingText,
              }}
            >
              {r} rings
            </button>
          ))}
        </div>
      );
    }

    if (
      ((step.topicId === 'odd-sum-square' || step.topicId === 'up-down-square') &&
        step.topicStepIndex === 0) ||
      (step.topicId === 'triangular-pairs' && step.topicStepIndex === 1)
    ) {
      return (
        <div data-no-nav="true" className="w-full flex flex-wrap items-center gap-3 pt-1">
          {[2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setSandbox((s) => ({ ...s, relN: n }))}
              className={cls}
              style={{
                backgroundColor: sandbox.relN === n ? COLORS.primary : COLORS.surface,
                borderColor: sandbox.relN === n ? COLORS.primary : COLORS.divider,
                color: sandbox.relN === n ? COLORS.surface : COLORS.headingText,
              }}
            >
              n = {n}
            </button>
          ))}
        </div>
      );
    }

    if (step.topicId === 'regular-polygons' && step.topicStepIndex === 1) {
      return (
        <div data-no-nav="true" className="w-full flex items-center gap-3 pt-1">
          <label className={bodyClass} style={{ color: COLORS.headingText }}>
            Sides: {sandbox.polySides}
          </label>
          <input
            type="range"
            min={3}
            max={10}
            value={sandbox.polySides}
            onChange={(e) => setSandbox((s) => ({ ...s, polySides: Number(e.target.value) }))}
            aria-label="Polygon sides"
            className="w-44 min-h-[44px] cursor-pointer"
          />
        </div>
      );
    }

    if (step.topicId === 'complete-graphs' && step.topicStepIndex === 1) {
      return (
        <div data-no-nav="true" className="w-full flex flex-wrap items-center gap-3 pt-1">
          {[2, 3, 4, 5, 6].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setSandbox((s) => ({ ...s, graphNodes: n }))}
              className={cls}
              style={{
                backgroundColor: sandbox.graphNodes === n ? COLORS.primary : COLORS.surface,
                borderColor: sandbox.graphNodes === n ? COLORS.primary : COLORS.divider,
                color: sandbox.graphNodes === n ? COLORS.surface : COLORS.headingText,
              }}
            >
              K{n}
            </button>
          ))}
        </div>
      );
    }

    if (step.topicId === 'stacked-shapes' && step.topicStepIndex === 1) {
      return (
        <div data-no-nav="true" className="w-full flex flex-wrap items-center gap-3 pt-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setSandbox((s) => ({ ...s, stackN: n }))}
              className={cls}
              style={{
                backgroundColor: sandbox.stackN === n ? COLORS.primary : COLORS.surface,
                borderColor: sandbox.stackN === n ? COLORS.primary : COLORS.divider,
                color: sandbox.stackN === n ? COLORS.surface : COLORS.headingText,
              }}
            >
              {n} × {n}
            </button>
          ))}
        </div>
      );
    }

    if (step.topicId === 'koch-snowflake' && step.topicStepIndex === 1) {
      return (
        <div data-no-nav="true" className="w-full flex flex-wrap items-center gap-3 pt-1">
          {[0, 1, 2, 3].map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setSandbox((s) => ({ ...s, kochStep: k }))}
              className={cls}
              style={{
                backgroundColor: sandbox.kochStep === k ? COLORS.primary : COLORS.surface,
                borderColor: sandbox.kochStep === k ? COLORS.primary : COLORS.divider,
                color: sandbox.kochStep === k ? COLORS.surface : COLORS.headingText,
              }}
            >
              Step {k}
            </button>
          ))}
        </div>
      );
    }

    return null;
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
          <PatternSvgCanvas
            topicId={step.topicId}
            step={step}
            stepIndex={step.topicStepIndex}
            phase={progressive.phase}
            pretrainingIdx={progressive.pretrainingIdx}
            highlightActive={progressive.highlightActive}
            mode={mode}
            reprMode={reprMode}
            sandbox={sandbox}
          />
        </div>

        {progressive.phase === 'PRETRAINING' && step.components.length > 0 && (
          <div className="flex items-center justify-between gap-2 pt-1 shrink-0">
            <span className="text-[16px] font-semibold" style={{ color: COLORS.primary }}>
              Part {progressive.pretrainingIdx + 1} of {step.components.length} — tap stage for next
            </span>
          </div>
        )}

        {renderSandboxControls()}
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
          {/* 3-option representation toggle: Picture | Words | Symbol */}
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

          {/* Running Equation (latest 2 student / up to 6 projector, earlier dimmed) */}
          <div
            className="rounded-xl border p-3 space-y-1"
            style={{ backgroundColor: COLORS.pageBg, borderColor: COLORS.divider }}
          >
            {visibleEqLines.map((line, i) => {
              const isLatest = i === visibleEqLines.length - 1;
              return (
                <div
                  key={`${i}-${line}`}
                  className={bodyClass}
                  style={{
                    color: COLORS.headingText,
                    opacity: isLatest ? 1 : 0.45,
                  }}
                >
                  {line}
                </div>
              );
            })}
          </div>

          {/* Live Readouts (mirrored on stage objects) */}
          <div className="flex flex-wrap gap-3">
            {step.readouts.map((r, idx) => {
              const isHi = idx === step.readouts.length - 1;
              return (
                <div
                  key={r.id}
                  className={`${bodyClass} px-3 py-1.5 rounded-xl border`}
                  style={{
                    backgroundColor: isHi ? COLORS.highlight.tint : COLORS.accent.tint,
                    borderColor: isHi ? COLORS.highlight.solid : COLORS.primary,
                    color: isHi ? COLORS.highlight.text : COLORS.headingText,
                  }}
                >
                  {getReadoutLabel(r, reprMode)}
                </div>
              );
            })}
          </div>

          {/* Concise Representation Line (<= 8 words) */}
          <p className={bodyClass} style={{ color: COLORS.bodyText }}>
            {step.reprSummary[reprMode]}
          </p>
        </div>

        {/* Optional Minds-On Check (Answer reason shown ONLY after student acts) */}
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
};
