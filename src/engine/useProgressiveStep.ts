/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useRef, useState } from 'react';

export type UiMode = 'student' | 'projector';
export type RepresentationMode = 'picture' | 'words' | 'symbol';

export type ProgressivePhase =
  | 'CLEAN_FRAME'
  | 'PRETRAINING'
  | 'SIGNALLED_INCLUSION'
  | 'LINKING'
  | 'SETTLED';

export interface ObjectReadout {
  id: string;
  pictureLabel: string; // 1-3 words
  wordLabel: string;    // 1-3 words
  symbolLabel: string;  // 1-3 words
  anchor: { x: number; y: number };
}

export interface StepQuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  reason: string; // <= 10 words, shown after student acts
}

export interface ClassroomStep {
  id: string;
  title: string;          // Short tracker title
  headline: string;       // <= 8 words
  focusWord?: string;
  question: string;       // <= 12 words, 1 sentence
  teacherPrompt: string;  // <= 20 words, hidden by default, NO answers
  hasPretraining?: boolean;
  components: ObjectReadout[];
  readouts: ObjectReadout[];
  equationLines: string[]; // Cumulative math lines (<= 8 words each)
  reprSummary: {
    picture: string;      // <= 8 words
    words: string;        // <= 8 words
    symbol: string;       // <= 8 words
  };
  check?: {
    prompt: string;       // <= 10 words
    options: StepQuestionOption[];
  };
  ncertRef?: string;      // NCERT textbook reference tag
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Implements 4-phase progressive loading per step:
 * 1. Clean frame (0 ms)
 * 2. Pretraining (only if flagged; one component per tap)
 * 3. Signalled inclusion (400 ms fade + single 1s highlight; others dim to 0.35)
 * 4. Linking (200 ms after settle: object readouts fade in)
 *
 * Manual only: never advances to the next step on a timer.
 */
export function useProgressiveStep(step: ClassroomStep) {
  const [phase, setPhase] = useState<ProgressivePhase>('CLEAN_FRAME');
  const [pretrainingIdx, setPretrainingIdx] = useState(0);
  const [highlightActive, setHighlightActive] = useState(false);
  const timersRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const startInclusionSequence = useCallback(() => {
    clearTimers();
    if (prefersReducedMotion()) {
      setHighlightActive(false);
      setPhase('SETTLED');
      return;
    }

    setPhase('SIGNALLED_INCLUSION');
    setHighlightActive(true);

    // 400ms fade + 1s single highlight -> settle, then 200ms readout link
    const tHighlightEnd = window.setTimeout(() => {
      setHighlightActive(false);
      setPhase('LINKING');
      const tLinkEnd = window.setTimeout(() => {
        setPhase('SETTLED');
      }, 200);
      timersRef.current.push(tLinkEnd);
    }, 1000);

    timersRef.current.push(tHighlightEnd);
  }, [clearTimers]);

  useEffect(() => {
    clearTimers();
    setPretrainingIdx(0);
    setHighlightActive(false);

    if (prefersReducedMotion()) {
      setPhase('SETTLED');
      return clearTimers;
    }

    setPhase('CLEAN_FRAME');
    const tClean = window.setTimeout(() => {
      if (step.hasPretraining && step.components.length > 0) {
        setPhase('PRETRAINING');
      } else {
        startInclusionSequence();
      }
    }, 120);
    timersRef.current.push(tClean);

    return clearTimers;
  }, [step.id, step.hasPretraining, step.components.length, clearTimers, startInclusionSequence]);

  const advancePretrainingOrFinish = useCallback((): boolean => {
    if (phase === 'PRETRAINING') {
      if (pretrainingIdx < step.components.length - 1) {
        setPretrainingIdx((i) => i + 1);
      } else {
        startInclusionSequence();
      }
      return true;
    }
    if (phase === 'CLEAN_FRAME' || phase === 'SIGNALLED_INCLUSION' || phase === 'LINKING') {
      clearTimers();
      setHighlightActive(false);
      setPhase('SETTLED');
      return true;
    }
    return false;
  }, [phase, pretrainingIdx, step.components.length, startInclusionSequence, clearTimers]);

  const isAnimating = useCallback(
    () => phase !== 'SETTLED',
    [phase]
  );

  return {
    phase,
    pretrainingIdx,
    highlightActive,
    isAnimating,
    finishAnimation: advancePretrainingOrFinish,
  };
}
