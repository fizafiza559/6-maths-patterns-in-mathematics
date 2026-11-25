/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { COLORS } from '../design/tokens';
import { UiMode } from '../engine/useProgressiveStep';

export interface SectionIntroSlideProps {
  text: string;
  focusPhrase: string;
  mode: UiMode;
}

/**
 * Dedicated intro slide component matching the reference layout:
 * - Plain grid background
 * - One centred line of large text in Inter
 * - One focus phrase in the focus colour
 * - Zero stage objects, zero side panel, zero teacher prompt
 */
export const SectionIntroSlide: React.FC<SectionIntroSlideProps> = ({
  text,
  focusPhrase,
  mode,
}) => {
  const idx = focusPhrase ? text.indexOf(focusPhrase) : -1;
  const before = idx >= 0 ? text.slice(0, idx) : text;
  const match = idx >= 0 ? text.slice(idx, idx + focusPhrase.length) : '';
  const after = idx >= 0 ? text.slice(idx + focusPhrase.length) : '';

  const textClass =
    mode === 'projector'
      ? 'text-[24px] sm:text-[34px] lg:text-[44px] font-extrabold leading-[1.15] tracking-[-0.02em]'
      : 'text-[22px] sm:text-[28px] lg:text-[36px] font-extrabold leading-[1.2] tracking-[-0.02em]';

  return (
    <div
      className="w-full h-full min-h-[300px] rounded-2xl flex items-center justify-center px-4 sm:px-8 text-center"
      style={{
        backgroundColor: COLORS.stageBg,
        backgroundImage: `linear-gradient(to right, ${COLORS.canvasGrid} 1px, transparent 1px), linear-gradient(to bottom, ${COLORS.canvasGrid} 1px, transparent 1px)`,
        backgroundSize: '28px 28px',
      }}
    >
      <h1
        className={`${textClass} animate-fade-400 text-center max-w-full lg:whitespace-nowrap`}
        style={{ color: COLORS.headingText }}
      >
        {before}
        {match && <span style={{ color: COLORS.primary }}>{match}</span>}
        {after}
      </h1>
    </div>
  );
};

/**
 * Opening chapter title slide ("PATTERNS IN / MATHEMATICS") rendered on the
 * same plain grid stage with no side panel or teacher prompt.
 */
export const ChapterTitleSlide: React.FC<{ mode: UiMode }> = ({ mode }) => {
  const titleClass =
    mode === 'projector'
      ? 'text-[40px] sm:text-[56px] lg:text-[64px] font-extrabold leading-[1.08] tracking-[-0.02em]'
      : 'text-[32px] sm:text-[44px] lg:text-[54px] font-extrabold leading-[1.1] tracking-[-0.02em]';

  return (
    <div
      className="w-full h-full min-h-[300px] rounded-2xl flex items-center justify-center px-4 sm:px-8 text-center"
      style={{
        backgroundColor: COLORS.stageBg,
        backgroundImage: `linear-gradient(to right, ${COLORS.canvasGrid} 1px, transparent 1px), linear-gradient(to bottom, ${COLORS.canvasGrid} 1px, transparent 1px)`,
        backgroundSize: '28px 28px',
      }}
    >
      <h1
        className={`${titleClass} animate-fade-400 text-center flex flex-col items-center`}
        style={{ color: COLORS.headingText }}
      >
        <span>PATTERNS IN</span>
        <span style={{ color: COLORS.primary }}>MATHEMATICS</span>
      </h1>
    </div>
  );
};
