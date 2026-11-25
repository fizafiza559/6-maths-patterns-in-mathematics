/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PATTERN_SIM_STEPS, SimTopicId } from '../components/patterns/simulations/patternSimData';

export interface TopicIntroSlide {
  id: string;
  text: string;
  focusPhrase: string;
  sourceStepId: string;
}

export const TOPIC_INTROS: Record<SimTopicId, TopicIntroSlide[]> = {
  'what-is-math': [
    {
      id: 'wim-intro-1',
      text: 'Mathematics is the search for patterns',
      focusPhrase: 'search for patterns',
      sourceStepId: 'wim-1',
    },
    {
      id: 'wim-intro-2',
      text: 'Such patterns indeed exist all around us',
      focusPhrase: 'all around us',
      sourceStepId: 'wim-2',
    },
    {
      id: 'wim-intro-3',
      text: "Let's explore some examples",
      focusPhrase: 'explore some examples',
      sourceStepId: 'wim-3',
    },
  ],

  'humanity-forward': [
    {
      id: 'hum-intro-1',
      text: 'We will see how math guides orbits.',
      focusPhrase: 'guides orbits',
      sourceStepId: 'hum-1',
    },
    {
      id: 'hum-intro-2',
      text: 'We will match DNA base pairs.',
      focusPhrase: 'DNA base pairs',
      sourceStepId: 'hum-2',
    },
    {
      id: 'hum-intro-3',
      text: 'We will test zeros and ones.',
      focusPhrase: 'zeros and ones',
      sourceStepId: 'hum-3',
    },
  ],

  'number-sequences': [
    {
      id: 'ns-intro-1',
      text: 'We will notice triangular jumps that grow.',
      focusPhrase: 'triangular jumps',
      sourceStepId: 'ns-1',
    },
    {
      id: 'ns-intro-2',
      text: 'We will add the two numbers before.',
      focusPhrase: 'two numbers before',
      sourceStepId: 'ns-2',
    },
    {
      id: 'ns-intro-3',
      text: 'We will double or triple each step.',
      focusPhrase: 'double or triple',
      sourceStepId: 'ns-3',
    },
  ],

  'sequence-rules': [
    {
      id: 'sr-intro-1',
      text: 'We will test the cube rule.',
      focusPhrase: 'cube rule',
      sourceStepId: 'sr-1',
    },
    {
      id: 'sr-intro-2',
      text: 'We will pick any Table 1 rule.',
      focusPhrase: 'Table 1 rule',
      sourceStepId: 'sr-2',
    },
  ],

  'pictorial-dots': [
    {
      id: 'pd-intro-1',
      text: 'We will see why dots make triangles.',
      focusPhrase: 'make triangles',
      sourceStepId: 'pd-1',
    },
    {
      id: 'pd-intro-2',
      text: 'We will stack layers into cubes.',
      focusPhrase: 'into cubes',
      sourceStepId: 'pd-2',
    },
  ],

  'number-36-magic': [
    {
      id: 'n36-intro-1',
      text: 'We will see 36 as two shapes.',
      focusPhrase: 'two shapes',
      sourceStepId: 'n36-1',
    },
    {
      id: 'n36-intro-2',
      text: 'We will compare squares and triangles.',
      focusPhrase: 'squares and triangles',
      sourceStepId: 'n36-2',
    },
  ],

  'hexagonal-numbers': [
    {
      id: 'hex-intro-1',
      text: 'We will see hexagon rings grow by six.',
      focusPhrase: 'grow by six',
      sourceStepId: 'hex-1',
    },
    {
      id: 'hex-intro-2',
      text: 'We will test any hexagon ring count.',
      focusPhrase: 'ring count',
      sourceStepId: 'hex-2',
    },
  ],

  'powers-dimensions': [
    {
      id: 'pow-intro-1',
      text: 'We will see new dimensions double corners.',
      focusPhrase: 'double corners',
      sourceStepId: 'pow-1',
    },
    {
      id: 'pow-intro-2',
      text: 'We will see prisms triple corners.',
      focusPhrase: 'triple corners',
      sourceStepId: 'pow-2',
    },
  ],

  'odd-sum-square': [
    {
      id: 'odd-intro-1',
      text: 'We will see odd strips build squares.',
      focusPhrase: 'build squares',
      sourceStepId: 'odd-1',
    },
    {
      id: 'odd-intro-2',
      text: 'We will sum 100 odds in seconds.',
      focusPhrase: '100 odds',
      sourceStepId: 'odd-2',
    },
  ],

  'up-down-square': [
    {
      id: 'ud-intro-1',
      text: 'We will count up and down to square.',
      focusPhrase: 'up and down',
      sourceStepId: 'ud-1',
    },
    {
      id: 'ud-intro-2',
      text: 'We will jump straight from the peak.',
      focusPhrase: 'the peak',
      sourceStepId: 'ud-2',
    },
  ],

  'triangular-pairs': [
    {
      id: 'tp-intro-1',
      text: 'We will join two triangles into a square.',
      focusPhrase: 'into a square',
      sourceStepId: 'tp-1',
    },
    {
      id: 'tp-intro-2',
      text: 'We will try larger triangle pairs.',
      focusPhrase: 'triangle pairs',
      sourceStepId: 'tp-2',
    },
  ],

  'hexagonal-to-cubes': [
    {
      id: 'hc-intro-1',
      text: 'We will build hexagons from six triangles.',
      focusPhrase: 'six triangles',
      sourceStepId: 'hc-1',
    },
    {
      id: 'hc-intro-2',
      text: 'We will see hexagon layers build cubes.',
      focusPhrase: 'build cubes',
      sourceStepId: 'hc-2',
    },
  ],

  'powers-of-2-sum': [
    {
      id: 'p2-intro-1',
      text: 'We will see one block complete the bar.',
      focusPhrase: 'complete the bar',
      sourceStepId: 'p2-1',
    },
    {
      id: 'p2-intro-2',
      text: 'We will predict sums without adding.',
      focusPhrase: 'without adding',
      sourceStepId: 'p2-2',
    },
  ],

  'regular-polygons': [
    {
      id: 'rp-intro-1',
      text: 'We will match equal sides and corners.',
      focusPhrase: 'sides and corners',
      sourceStepId: 'rp-1',
    },
    {
      id: 'rp-intro-2',
      text: 'We will count polygons from three to ten.',
      focusPhrase: 'three to ten',
      sourceStepId: 'rp-2',
    },
  ],

  'complete-graphs': [
    {
      id: 'cg-intro-1',
      text: 'We will see new dots link all others.',
      focusPhrase: 'link all others',
      sourceStepId: 'cg-1',
    },
    {
      id: 'cg-intro-2',
      text: 'We will match graph lines to triangles.',
      focusPhrase: 'to triangles',
      sourceStepId: 'cg-2',
    },
  ],

  'stacked-shapes': [
    {
      id: 'ss-intro-1',
      text: 'We will count odd rows in stacked triangles.',
      focusPhrase: 'stacked triangles',
      sourceStepId: 'ss-1',
    },
    {
      id: 'ss-intro-2',
      text: 'We will see both stacks make squares.',
      focusPhrase: 'make squares',
      sourceStepId: 'ss-2',
    },
  ],

  'koch-snowflake': [
    {
      id: 'ks-intro-1',
      text: 'We will split each side into four.',
      focusPhrase: 'into four',
      sourceStepId: 'ks-1',
    },
    {
      id: 'ks-intro-2',
      text: 'We will multiply snowflake sides by four.',
      focusPhrase: 'by four',
      sourceStepId: 'ks-2',
    },
  ],

  'shape-number-insights': [
    {
      id: 'smi-intro-1',
      text: 'We will see polygons mirror counting numbers.',
      focusPhrase: 'counting numbers',
      sourceStepId: 'smi-1',
    },
    {
      id: 'smi-intro-2',
      text: 'We will see complete graphs mirror triangles.',
      focusPhrase: 'mirror triangles',
      sourceStepId: 'smi-2',
    },
    {
      id: 'smi-intro-3',
      text: 'We will see stacked shapes mirror squares.',
      focusPhrase: 'mirror squares',
      sourceStepId: 'smi-3',
    },
    {
      id: 'smi-intro-4',
      text: 'We will see fractals multiply by four.',
      focusPhrase: 'by four',
      sourceStepId: 'smi-4',
    },
  ],

  'chapter-summary': [
    {
      id: 'sum-intro-1',
      text: 'We will connect numbers, pictures, and shapes.',
      focusPhrase: 'numbers, pictures, and shapes',
      sourceStepId: 'sum-1',
    },
    {
      id: 'sum-intro-2',
      text: 'We will check our big chapter ideas.',
      focusPhrase: 'chapter ideas',
      sourceStepId: 'sum-2',
    },
  ],
};

export function validateTopicIntros() {
  const errors: string[] = [];
  (Object.keys(PATTERN_SIM_STEPS) as SimTopicId[]).forEach((topicId) => {
    const slides = TOPIC_INTROS[topicId] || [];
    const steps = PATTERN_SIM_STEPS[topicId] || [];
    if (slides.length < 2 || slides.length > 5) {
      errors.push(`${topicId}: expected 2..5 intro slides, got ${slides.length}`);
    }
    slides.forEach((slide) => {
      const words = slide.text.trim().split(/\s+/);
      if (words.length > 25) {
        errors.push(`${slide.id}: exceeds 25 words (${words.length}): "${slide.text}"`);
      }
      if (!slide.text.includes(slide.focusPhrase)) {
        errors.push(`${slide.id}: focusPhrase "${slide.focusPhrase}" not found in "${slide.text}"`);
      }
      if (!steps.some((s) => s.id === slide.sourceStepId)) {
        errors.push(`${slide.id}: sourceStepId "${slide.sourceStepId}" missing in topic ${topicId}`);
      }
    });
  });
  return { valid: errors.length === 0, errors };
}
