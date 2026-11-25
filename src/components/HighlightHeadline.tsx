/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { COLORS } from '../design/tokens';
import { SymbolColorKey } from '../types';
import { UiMode } from '../engine/useProgressiveStep';

interface HighlightHeadlineProps {
  text: string;
  focusWord?: string;
  focusColor?: SymbolColorKey;
  mode?: UiMode;
}

export const HighlightHeadline: React.FC<HighlightHeadlineProps> = ({
  text,
  focusWord,
  focusColor = 'accent',
  mode = 'student',
}) => {
  const colorEntry = COLORS[focusColor] || COLORS.accent;
  const accentColor =
    typeof colorEntry === 'object' && colorEntry !== null && 'solid' in colorEntry
      ? colorEntry.solid
      : String(colorEntry);

  let before = text;
  let match = '';
  let after = '';

  if (focusWord && focusWord.trim().length > 0) {
    const idx = text.toLowerCase().indexOf(focusWord.toLowerCase());
    if (idx !== -1) {
      before = text.slice(0, idx);
      match = text.slice(idx, idx + focusWord.length);
      after = text.slice(idx + focusWord.length);
    }
  }

  return (
    <h1
      className={`text-left w-full ${
        mode === 'projector' ? 'cm-headline-projector' : 'cm-headline-student'
      }`}
      style={{ color: COLORS.headingText }}
    >
      {before}
      {match && <span style={{ color: accentColor }}>{match}</span>}
      {after}
    </h1>
  );
};
