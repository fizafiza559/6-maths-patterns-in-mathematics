/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Layers,
  MessageSquare,
  Monitor,
} from 'lucide-react';
import { COLORS } from '../design/tokens';
import { SectionConfig, SectionId } from '../content/sections';
import { useTapNavigator } from './useTapNavigator';
import { UiMode } from './useProgressiveStep';

export interface ClassroomStepMeta {
  id: string;
  title: string;
  teacherPrompt: string;
  ncertRef?: string;
}

export interface ClassroomShellProps {
  sections: SectionConfig[];
  activeSectionId: SectionId;
  onSelectSection: (sectionId: SectionId) => void;

  steps: ClassroomStepMeta[];
  currentStepIndex: number;
  onPrevStep: () => void;
  onNextStep: () => void;
  isAnimating?: () => boolean;
  finishAnimation?: () => boolean;

  mode: UiMode;
  onToggleMode: () => void;
  showTeacherPrompt: boolean;
  onToggleTeacherPrompt: () => void;
  onOpenIndex: () => void;
  indexOpen?: boolean;

  stage: React.ReactNode;
  symbols: React.ReactNode;
  introSlide?: React.ReactNode;
  trackerLabel?: string;
}

/**
 * SHELL.tsx — Classroom Math UI layout shell.
 * Four form factors: phone (<600), tablet portrait (600-1023), tablet landscape / laptop (>=1024), projector.
 */
export const ClassroomShell: React.FC<ClassroomShellProps> = ({
  sections,
  activeSectionId,
  onSelectSection,
  steps,
  currentStepIndex,
  onPrevStep,
  onNextStep,
  isAnimating,
  finishAnimation,
  mode,
  onToggleMode,
  showTeacherPrompt,
  onToggleTeacherPrompt,
  onOpenIndex,
  indexOpen = false,
  stage,
  symbols,
  introSlide,
  trackerLabel,
}) => {
  const isProjector = mode === 'projector';
  const totalSteps = Math.max(1, steps.length);
  const clampedIdx = Math.max(0, Math.min(totalSteps - 1, currentStepIndex));
  const currentStep = steps[clampedIdx] || { id: 'step', title: '', teacherPrompt: '' };

  const isFirst = clampedIdx <= 0;
  const isLast = clampedIdx >= totalSteps - 1;

  const { stagePointerProps, ripples } = useTapNavigator({
    units: steps,
    currentIndex: clampedIdx,
    goNext: () => {
      if (isLast) return false;
      onNextStep();
      return true;
    },
    goBack: () => {
      if (!isFirst) onPrevStep();
    },
    isAnimating,
    finishAnimation,
    disabled: indexOpen,
  });

  const btnClass = isProjector ? 'cm-btn-projector px-4' : 'cm-btn-student px-3';
  const trackerClass = isProjector ? 'cm-tracker-projector' : 'cm-tracker-student';

  return (
    <div
      className="min-h-[100dvh] lg:h-[100dvh] lg:overflow-hidden w-full flex flex-col select-none"
      style={{ backgroundColor: COLORS.pageBg, color: COLORS.bodyText }}
    >
      {/* TOP BAR: sections (scroll) | Projector view | Teacher prompts | Index */}
      <header
        data-no-nav="true"
        className="w-full border-b px-3 sm:px-4 lg:px-6 py-2 flex items-center justify-end gap-3 shrink-0 z-30"
        style={{ backgroundColor: COLORS.surface, borderColor: COLORS.divider }}
      >
        {/* Right controls with 12px (gap-3) spacing */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleMode}
            aria-pressed={isProjector}
            className={`${btnClass} rounded-xl border inline-flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors`}
            style={{
              backgroundColor: isProjector ? COLORS.accent.tint : COLORS.surface,
              borderColor: isProjector ? COLORS.primary : COLORS.divider,
              color: isProjector ? COLORS.primary : COLORS.headingText,
            }}
          >
            <Monitor className={isProjector ? 'w-5 h-5 shrink-0' : 'w-4 h-4 shrink-0'} />
            <span className="hidden sm:inline">Projector view</span>
          </button>

          <button
            type="button"
            onClick={onToggleTeacherPrompt}
            aria-pressed={showTeacherPrompt}
            className={`${btnClass} rounded-xl border inline-flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors`}
            style={{
              backgroundColor: showTeacherPrompt ? COLORS.chipAmberBg : COLORS.surface,
              borderColor: showTeacherPrompt ? COLORS.chipAmberBorder : COLORS.divider,
              color: showTeacherPrompt ? COLORS.chipAmberText : COLORS.headingText,
            }}
          >
            <MessageSquare className={isProjector ? 'w-5 h-5 shrink-0' : 'w-4 h-4 shrink-0'} />
            <span className="hidden md:inline">Teacher prompts</span>
          </button>

          <button
            type="button"
            onClick={onOpenIndex}
            aria-label="Open Index"
            className={`${btnClass} rounded-xl border inline-flex items-center gap-2 whitespace-nowrap cursor-pointer`}
            style={{
              backgroundColor: COLORS.primary,
              borderColor: COLORS.primary,
              color: COLORS.surface,
            }}
          >
            <Layers className={isProjector ? 'w-5 h-5 shrink-0' : 'w-4 h-4 shrink-0'} />
            <span>Index</span>
          </button>
        </div>
      </header>

      {/* MAIN TWO-ZONE WORKSPACE (1 col <1024px, 2 cols >=1024px) */}
      <div className="flex-1 min-h-0 w-full max-w-[1680px] mx-auto px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 flex flex-col gap-3 lg:overflow-hidden">
        <div
          className={`flex-1 min-h-0 grid grid-cols-1 gap-3 ${
            introSlide
              ? ''
              : isProjector
              ? 'lg:grid-cols-[minmax(0,1fr)_420px]'
              : 'lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_390px]'
          }`}
        >
          {/* ZONE A: STAGE (or full-width Intro Slide; tap = next, double tap = back) */}
          <section
            {...stagePointerProps}
            aria-label={introSlide ? 'Section introduction' : 'Simulation stage'}
            className={`min-w-0 min-h-[300px] lg:min-h-0 rounded-2xl border flex flex-col items-center justify-center relative overflow-hidden ${
              introSlide ? 'p-0' : 'p-3 sm:p-4'
            }`}
            style={{
              backgroundColor: COLORS.surface,
              borderColor: COLORS.divider,
              touchAction: 'manipulation',
            }}
          >
            {introSlide ?? stage}

            {ripples.map((r) => (
              <span
                key={r.id}
                aria-hidden="true"
                className="fixed pointer-events-none z-40 rounded-full animate-tap-ripple"
                style={{
                  left: r.x,
                  top: r.y,
                  width: '44px',
                  height: '44px',
                  backgroundColor: COLORS.accent.tint,
                  border: `2px solid ${COLORS.primary}`,
                }}
              />
            ))}
          </section>

          {/* ZONE B: SYMBOLS (hidden on intro slides) */}
          {!introSlide && (
            <aside
              data-no-nav="true"
              aria-label="Symbol panel"
              className="min-w-0 lg:min-h-0 rounded-2xl border p-3 sm:p-4 flex flex-col justify-between gap-3 lg:overflow-y-auto no-scrollbar"
              style={{
                backgroundColor: COLORS.surface,
                borderColor: COLORS.divider,
              }}
            >
              {symbols}
            </aside>
          )}
        </div>

        {/* TEACHER PROMPT BAR (hidden by default and never shown on intro slides) */}
        {!introSlide && showTeacherPrompt && currentStep.teacherPrompt && (
          <div
            data-no-nav="true"
            role="note"
            aria-label="Teacher prompt"
            className="w-full rounded-xl border px-4 py-2.5 flex items-center justify-between gap-3 shrink-0"
            style={{
              backgroundColor: COLORS.chipAmberBg,
              borderColor: COLORS.chipAmberBorder,
              color: COLORS.chipAmberText,
            }}
          >
            <p
              className={isProjector ? 'cm-body-projector text-left' : 'cm-body-student text-left'}
              style={{ color: COLORS.headingText }}
            >
              <span className="font-extrabold" style={{ color: COLORS.chipAmberText }}>
                Ask class{currentStep.ncertRef ? ` (${currentStep.ncertRef})` : ''}:{' '}
              </span>
              {currentStep.teacherPrompt}
            </p>
          </div>
        )}
      </div>

      {/* DOCK: [< Previous]  Step n of N: title  [Next >] */}
      <footer
        data-no-nav="true"
        className="w-full border-t px-3 sm:px-4 lg:px-6 pt-2 shrink-0 z-20"
        style={{
          backgroundColor: COLORS.surface,
          borderColor: COLORS.divider,
          paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
        }}
      >
        <div className="w-full max-w-[1680px] mx-auto flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={isFirst}
            onClick={onPrevStep}
            className={`${btnClass} rounded-xl border inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0 transition-opacity`}
            style={{
              backgroundColor: COLORS.surface,
              borderColor: COLORS.divider,
              color: COLORS.headingText,
            }}
          >
            <ChevronLeft className={isProjector ? 'w-5 h-5' : 'w-4 h-4'} />
            <span>Previous</span>
          </button>

          <div
            aria-live="polite"
            aria-atomic="true"
            className={`${trackerClass} text-center truncate px-2`}
            style={{ color: COLORS.headingText }}
          >
            {trackerLabel ?? `Step ${clampedIdx + 1} of ${totalSteps}: ${currentStep.title}`}
          </div>

          <button
            type="button"
            disabled={isLast}
            onClick={onNextStep}
            className={`${btnClass} rounded-xl border inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0 transition-opacity`}
            style={{
              backgroundColor: COLORS.primary,
              borderColor: COLORS.primary,
              color: COLORS.surface,
            }}
          >
            <span>Next</span>
            <ChevronRight className={isProjector ? 'w-5 h-5' : 'w-4 h-4'} />
          </button>
        </div>
      </footer>
    </div>
  );
};
