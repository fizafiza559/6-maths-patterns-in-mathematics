/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SymbolColorKey = 'primary' | 'accent' | 'highlight';

export interface Beat {
  id: string;
  headline?: string;
  focusWord?: string;
  focusColor?: SymbolColorKey;
  caption?: string;
}
