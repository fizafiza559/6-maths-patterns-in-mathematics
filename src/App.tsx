/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { CHAPTER_SECTIONS, SectionConfig, SectionId } from './content/sections';
import { TOPIC_INTROS, TopicIntroSlide } from './content/topicIntros';
import { ClassroomShell, ClassroomStepMeta } from './engine/SHELL';
import {
  ClassroomStep,
  RepresentationMode,
  UiMode,
  useProgressiveStep,
} from './engine/useProgressiveStep';
import { IndexDrawer } from './components/IndexDrawer';
import { ChapterTitleSlide, SectionIntroSlide } from './components/SectionIntroSlide';
import { PATTERN_SIM_STEPS, SimTopicId } from './components/patterns/simulations/patternSimData';
import {
  ActiveTopicStep,
  useSimulationViews,
} from './components/patterns/simulations/SimulationWorkspace';
import {
  SOLUTION_STEPS,
  SolutionStepItem,
  useSolutionViews,
} from './components/patterns/ChapterSolutionsStage';

type ConceptTimelineEntry =
  | {
      kind: 'title';
      id: string;
      topicId: SimTopicId;
      fallbackStep: ActiveTopicStep;
    }
  | {
      kind: 'intro';
      id: string;
      topicId: SimTopicId;
      intro: TopicIntroSlide;
      introIndex: number;
      introTotal: number;
      fallbackStep: ActiveTopicStep;
    }
  | {
      kind: 'step';
      id: string;
      topicId: SimTopicId;
      step: ActiveTopicStep;
      stepNumber: number;
      totalSectionSteps: number;
    };

interface SharedShellControls {
  sections: SectionConfig[];
  activeSectionId: SectionId;
  onSelectSection: (sectionId: SectionId) => void;
  currentStepIndex: number;
  onPrevStep: () => void;
  onNextStep: () => void;
  mode: UiMode;
  onToggleMode: () => void;
  showTeacherPrompt: boolean;
  onToggleTeacherPrompt: () => void;
  reprMode: RepresentationMode;
  onChangeReprMode: (r: RepresentationMode) => void;
  indexOpen: boolean;
  onOpenIndex: () => void;
}

const NO_OP_FALSE = () => false;

const ConceptClassroomView: React.FC<
  SharedShellControls & { entries: ConceptTimelineEntry[] }
> = ({
  sections,
  activeSectionId,
  onSelectSection,
  entries,
  currentStepIndex,
  onPrevStep,
  onNextStep,
  mode,
  onToggleMode,
  showTeacherPrompt,
  onToggleTeacherPrompt,
  reprMode,
  onChangeReprMode,
  indexOpen,
  onOpenIndex,
}) => {
  const safeIdx = Math.max(0, Math.min(entries.length - 1, currentStepIndex));
  const entry = entries[safeIdx];

  // Always pass an entry-specific step id to useProgressiveStep so moving from
  // the last intro slide into Step 1 cleanly resets progressive loading phases.
  const hookStep: ActiveTopicStep = useMemo(() => {
    if (entry.kind === 'step') return entry.step;
    return {
      ...entry.fallbackStep,
      id: entry.id,
      hasPretraining: false,
      components: [],
    };
  }, [entry]);

  const progressive = useProgressiveStep(hookStep);
  const { stage, symbols } = useSimulationViews({
    step: hookStep,
    mode,
    reprMode,
    onChangeReprMode,
    progressive,
  });

  const shellSteps: ClassroomStepMeta[] = useMemo(
    () =>
      entries.map((item) =>
        item.kind === 'step'
          ? {
              id: item.id,
              title: item.step.title,
              teacherPrompt: item.step.teacherPrompt,
              ncertRef: item.step.ncertRef,
            }
          : { id: item.id, title: '', teacherPrompt: '' }
      ),
    [entries]
  );

  const isOverlaySlide = entry.kind === 'title' || entry.kind === 'intro';
  const trackerLabel =
    entry.kind === 'title'
      ? 'Patterns in Mathematics'
      : entry.kind === 'intro'
      ? `Intro ${entry.introIndex + 1} of ${entry.introTotal}`
      : `Step ${entry.stepNumber} of ${entry.totalSectionSteps}: ${entry.step.title}`;

  return (
    <ClassroomShell
      sections={sections}
      activeSectionId={activeSectionId}
      onSelectSection={onSelectSection}
      steps={shellSteps}
      currentStepIndex={safeIdx}
      onPrevStep={onPrevStep}
      onNextStep={onNextStep}
      isAnimating={isOverlaySlide ? NO_OP_FALSE : progressive.isAnimating}
      finishAnimation={isOverlaySlide ? NO_OP_FALSE : progressive.finishAnimation}
      mode={mode}
      onToggleMode={onToggleMode}
      showTeacherPrompt={showTeacherPrompt}
      onToggleTeacherPrompt={onToggleTeacherPrompt}
      onOpenIndex={onOpenIndex}
      indexOpen={indexOpen}
      introSlide={
        entry.kind === 'title' ? (
          <ChapterTitleSlide mode={mode} />
        ) : entry.kind === 'intro' ? (
          <SectionIntroSlide
            text={entry.intro.text}
            focusPhrase={entry.intro.focusPhrase}
            mode={mode}
          />
        ) : undefined
      }
      trackerLabel={trackerLabel}
      stage={stage}
      symbols={symbols}
    />
  );
};

const SolutionsClassroomView: React.FC<
  SharedShellControls & { steps: SolutionStepItem[] }
> = ({
  sections,
  activeSectionId,
  onSelectSection,
  steps,
  currentStepIndex,
  onPrevStep,
  onNextStep,
  mode,
  onToggleMode,
  showTeacherPrompt,
  onToggleTeacherPrompt,
  reprMode,
  onChangeReprMode,
  indexOpen,
  onOpenIndex,
}) => {
  const safeIdx = Math.max(0, Math.min(steps.length - 1, currentStepIndex));
  const step = steps[safeIdx];
  const progressive = useProgressiveStep(step as ClassroomStep);
  const { stage, symbols } = useSolutionViews({
    step,
    mode,
    reprMode,
    onChangeReprMode,
    phase: progressive.phase,
  });

  return (
    <ClassroomShell
      sections={sections}
      activeSectionId={activeSectionId}
      onSelectSection={onSelectSection}
      steps={steps}
      currentStepIndex={safeIdx}
      onPrevStep={onPrevStep}
      onNextStep={onNextStep}
      isAnimating={progressive.isAnimating}
      finishAnimation={progressive.finishAnimation}
      mode={mode}
      onToggleMode={onToggleMode}
      showTeacherPrompt={showTeacherPrompt}
      onToggleTeacherPrompt={onToggleTeacherPrompt}
      onOpenIndex={onOpenIndex}
      indexOpen={indexOpen}
      stage={stage}
      symbols={symbols}
    />
  );
};

function buildConceptTimeline(section: SectionConfig): ConceptTimelineEntry[] {
  const totalSectionSteps = section.subTabs.reduce(
    (sum, st) => sum + (PATTERN_SIM_STEPS[st.id as SimTopicId]?.length ?? 0),
    0
  );

  const entries: ConceptTimelineEntry[] = [];
  let runningStepNumber = 0;

  section.subTabs.forEach((st, subTabIdx) => {
    const topicId = st.id as SimTopicId;
    const topicSteps = PATTERN_SIM_STEPS[topicId] ?? [];
    if (topicSteps.length === 0) return;

    const firstActiveStep: ActiveTopicStep = {
      ...topicSteps[0],
      topicId,
      topicStepIndex: 0,
    };

    if (section.id === 'sec-1-1' && subTabIdx === 0) {
      entries.push({
        kind: 'title',
        id: 'chapter-title-slide',
        topicId,
        fallbackStep: firstActiveStep,
      });
    }

    const intros = TOPIC_INTROS[topicId] ?? [];
    intros.forEach((intro, introIndex) => {
      entries.push({
        kind: 'intro',
        id: intro.id,
        topicId,
        intro,
        introIndex,
        introTotal: intros.length,
        fallbackStep: firstActiveStep,
      });
    });

    topicSteps.forEach((step, idx) => {
      runningStepNumber += 1;
      entries.push({
        kind: 'step',
        id: step.id,
        topicId,
        step: {
          ...step,
          topicId,
          topicStepIndex: idx,
        },
        stepNumber: runningStepNumber,
        totalSectionSteps,
      });
    });
  });

  return entries;
}

export default function App() {
  const [activeSectionId, setActiveSectionId] = useState<SectionId>('sec-1-1');
  const [stepIndex, setStepIndex] = useState(0);
  const [mode, setMode] = useState<UiMode>('student');
  const [showTeacherPrompt, setShowTeacherPrompt] = useState(false);
  const [reprMode, setReprMode] = useState<RepresentationMode>('picture');
  const [indexOpen, setIndexOpen] = useState(false);

  const activeSection = useMemo(
    () => CHAPTER_SECTIONS.find((s) => s.id === activeSectionId) || CHAPTER_SECTIONS[0],
    [activeSectionId]
  );

  const isSolutions = activeSectionId === 'sec-1-solutions';

  const conceptEntries = useMemo(
    () => (isSolutions ? [] : buildConceptTimeline(activeSection)),
    [activeSection, isSolutions]
  );

  const activeTotal = isSolutions ? SOLUTION_STEPS.length : conceptEntries.length;
  const clampedStepIndex = Math.max(0, Math.min(Math.max(1, activeTotal) - 1, stepIndex));

  const activeTopicId = useMemo(() => {
    if (isSolutions) {
      return SOLUTION_STEPS[clampedStepIndex]?.subTabId;
    }
    return conceptEntries[clampedStepIndex]?.topicId;
  }, [isSolutions, clampedStepIndex, conceptEntries]);

  const handleSelectSection = (sectionId: SectionId) => {
    setActiveSectionId(sectionId);
    setStepIndex(0);
  };

  const handleSelectTopic = (topicId: string, sectionId?: SectionId) => {
    const targetSecId =
      sectionId ||
      CHAPTER_SECTIONS.find((sec) => sec.subTabs.some((st) => st.id === topicId))?.id ||
      activeSectionId;

    setActiveSectionId(targetSecId);

    if (targetSecId === 'sec-1-solutions') {
      const idx = SOLUTION_STEPS.findIndex((s) => s.subTabId === topicId);
      setStepIndex(idx >= 0 ? idx : 0);
      return;
    }

    const targetSection =
      CHAPTER_SECTIONS.find((sec) => sec.id === targetSecId) || CHAPTER_SECTIONS[0];
    const targetEntries = buildConceptTimeline(targetSection);
    const idx = targetEntries.findIndex((e) => e.kind !== 'title' && e.topicId === topicId);
    setStepIndex(idx >= 0 ? idx : 0);
  };

  const handlePrevStep = () => {
    setStepIndex((i) => Math.max(0, i - 1));
  };

  const handleNextStep = () => {
    setStepIndex((i) => Math.min(Math.max(0, activeTotal - 1), i + 1));
  };

  const sharedProps: SharedShellControls = {
    sections: CHAPTER_SECTIONS,
    activeSectionId,
    onSelectSection: handleSelectSection,
    currentStepIndex: clampedStepIndex,
    onPrevStep: handlePrevStep,
    onNextStep: handleNextStep,
    mode,
    onToggleMode: () => setMode((m) => (m === 'student' ? 'projector' : 'student')),
    showTeacherPrompt,
    onToggleTeacherPrompt: () => setShowTeacherPrompt((v) => !v),
    reprMode,
    onChangeReprMode: setReprMode,
    indexOpen,
    onOpenIndex: () => setIndexOpen(true),
  };

  return (
    <>
      {isSolutions ? (
        <SolutionsClassroomView {...sharedProps} steps={SOLUTION_STEPS} />
      ) : (
        <ConceptClassroomView {...sharedProps} entries={conceptEntries} />
      )}

      <IndexDrawer
        open={indexOpen}
        onClose={() => setIndexOpen(false)}
        sections={CHAPTER_SECTIONS}
        activeSectionId={activeSectionId}
        activeTopicId={activeTopicId}
        onSelectSection={handleSelectSection}
        onSelectTopic={handleSelectTopic}
      />
    </>
  );
}
