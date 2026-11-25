# Educational Simulation Element Reveal & Step-by-Step Architecture Specification
**Application:** Class 6 Mathematics – *Lines and Angles* (NCERT Ganita Prakash Chapter 2)  
**Target Architecture:** Interactive Single-Page Application (SPA) Simulation  
**Foundation:** Evidence-Based Cognitive Science & Multimedia Learning Principles  
**Status:** Canonical Design & Engineering Specification  

---

## 1. Executive Summary & Cognitive Science Foundations

When students interact with geometry simulations, their working memory must simultaneously parse visual diagrams, process symbolic notation, interpret instructions, and construct causal mental models. Without disciplined cognitive design, educational software routinely triggers **Cognitive Overload** via extraneous cognitive load (visual split-attention, decorative animations, continuous unsegmented playback, and spatial disorientation).

```
                                  COGNITIVE LOAD BUDGET
   ┌──────────────────────────────────────────────────────────────────────────────────┐
   │ INTRINSIC LOAD (Task Logic)     : Kept pure via Component-First Pretraining     │
   │ GERMANE LOAD (Schema Building)  : Maximized via Active Minds-On Predictions      │
   │ EXTRANEOUS LOAD (Interface Noise): Minimized via In-Context Spatial Contiguity,   │
   │                                   Signaling Halos, and Zero Seductive Motion    │
   └──────────────────────────────────────────────────────────────────────────────────┘
```

### The Core Operational Principles

1. **User-Paced Segmenting (The Segmenting Principle):**
   Continuous animations, auto-running solution solvers, and non-stop demonstrations prevent schema consolidation. Every concept breakdown, geometric proof, and practice solution must be subdivided into discrete, user-controlled **Beats (Segments)**. Transition to the next beat is triggered exclusively by explicit user intent (e.g., `"Next Step"`, `"Check Prediction"`), allowing the learner sufficient dwell time to build an internal representation.

2. **Visual Signaling for Added Elements (The Signaling Effect):**
   When a new geometric primitive (ray, point, measurement arc, construction line) enters the stage, visual attention must be steered instantly and gently without altering the scene coordinate layout. Signaling is achieved through a standardized visual grammar: **subtle focus glows** (300ms–600ms decaying halo), **directional leader notches**, and **pulsing anchor rings** that isolate causal dependencies.

3. **Spatial and Temporal Contiguity (Modality & Redundancy Effects):**
   - **Spatial Contiguity:** Explanatory text, segment identifiers, and angle values must be rendered as **in-context dynamic SVG annotations** pinned directly adjacent to the visual primitive.
   - **Temporal Contiguity:** Spoken audio hints occur at the **exact same millisecond ($t = 0\text{ ms}$)** that the corresponding visual stroke begins.
   - **Modality & Redundancy Avoidance:** Spoken narration carries the explanatory burden rather than large blocks of visual text (Modality Effect). Displaying identical full on-screen text alongside spoken narration is strictly prohibited (Redundancy Effect). On-screen text is restricted to compact spatial badges.

4. **Elimination of Decorative Motion (The Coherence Effect):**
   3D page flips, skeuomorphic card wipes, bouncy spring easings, floating decorative particles, and transitional swoosh sounds drain working memory capacity. Screen changes must use **in-place state morphing** or **150ms opacity cross-fades** on a completely static, anchored drafting canvas.

5. **Pretraining Component Models:**
   A composite geometric structure (e.g., an angle formed by two rays, or a multi-line intersecting figure) must never be presented all-at-once. Individual constituent primitives (a point $\to$ a stationary base ray $\to$ a second ray sharing the origin $\to$ the rotational sweep) must be introduced and manipulated in isolation before the composite causal system is assembled.

6. **Active "Minds-On" Step Progression:**
   Purely passive click-through produces the illusion of competence. Before a new step or solution branch is revealed, the learner must be presented with an **Active Prediction Prompt** (e.g., multiple-choice hypothesis, direction toggle, or placement challenge). Feedback is immediate, non-punitive, and leads directly into the visual reveal.

---

## 2. The 5-Phase Step-by-Step State Machine Lifecycle

Rather than automatically animating changes or switching pages abruptly, every step in a multi-step solution and conceptual construction progresses through a disciplined **5-phase state machine lifecycle**:

```
                       5-PHASE STEP-BY-STEP STATE MACHINE LIFECYCLE
                       
  ┌─────────────────────────────────┐
  │  Phase 1: Component Pretraining │  ──> Non-active primitives dimmed (opacity: 0.25).
  │                                 │      Student taps components to verify names & states.
  └────────────────┬────────────────┘
                   │
                   ▼
  ┌─────────────────────────────────┐
  │  Phase 2: Targeted Signaling    │  ──> Focus halo / pointer arrow isolates what changes.
  │                                 │      Ghost outline (dashed stroke) previews inclusion.
  └────────────────┬────────────────┘
                   │
                   ▼
  ┌─────────────────────────────────┐
  │  Phase 3: Minds-On Prediction   │  ──> [Next Step] disabled. Student selects hypothesis
  │                                 │      answering: "What will happen when X is applied?"
  └────────────────┬────────────────┘
                   │  (Hypothesis Selected)
                   ▼
  ┌─────────────────────────────────┐
  │  Phase 4: Segmented Step Reveal │  ──> Ghost morphs into solid in-place.
  │                                 │      Short spoken audio synced with visual motion.
  └────────────────┬────────────────┘
                   │
                   ▼
  ┌─────────────────────────────────┐
  │  Phase 5: Reflective Check      │  ──> Brief self-explanation prompt consolidates schema.
  │                                 │      Correct response unlocks [Next Step] button.
  └─────────────────────────────────┘
```

### Detailed Phase Specifications

#### Phase 1: Component Pretraining (Verification of Primitives)
- **Objective:** Ensure the student recognizes the baseline objects and their states before introducing multi-variable interactions.
- **UI State:**
  - Non-active elements are slightly dimmed (`opacity: 0.25`, `filter: grayscale(40%)`).
  - Active baseline elements remain at `opacity: 1`.
  - Tapping/clicking any component on the canvas opens a micro-badge anchored directly to that element showing its name, mathematical notation, and current state (e.g., `Point A (Fixed Endpoint)` or `Ray BE (Horizontal Base Arm, Angle = 0°)`).

#### Phase 2: Targeted Step Signaling (Focal Isolation)
- **Objective:** Direct student focus exclusively to the region of interest where the current step will execute.
- **UI State:**
  - The newly included element or modified connection line is displayed in a **Signaled Ghost State** (dashed stroke: `stroke-dasharray="4 4"`, `opacity: 0.4`).
  - A subtle focal border, glow ring, or pointer arrow appears around the candidate zone (`stroke="#0EA5E9"`, 400ms gentle pulse).
  - Background components remain static and anchored.

#### Phase 3: Active Minds-On Prediction Prompt (Intellectual Engagement Gate)
- **Objective:** Prevent passive click-through by requiring an intellectual hypothesis before the step reveals itself.
- **UI State:**
  - The `[Next Step]` button is **disabled** (`cursor: not-allowed`, `opacity: 0.5`).
  - A compact prediction card renders anchored directly beside the signaled ghost element:
    *e.g., "If we extend Ray NB, will it share the same starting point as Ray TB?"*
  - Student selects a hypothesis from 2 or 3 mutually exclusive options.
  - Formative, non-punitive feedback displays instantly.

#### Phase 4: Segmented Execution & Reveal (Synchronized Dual Coding)
- **Objective:** Morph the predicted state into reality using simultaneous audio-visual delivery.
- **UI State:**
  - The signaled ghost outline morphs in-place into a solid element via a 300ms stroke sweep (`stroke-dashoffset` transition) or clean 150ms cross-fade.
  - **Modality Compliance:** Spoken audio narration begins at the exact same millisecond ($t = 0\text{ ms}$) as the visual animation (e.g., audio plays: *"Ray NB originates at Point N, shooting rightward, completely separate from Point T"*).
  - **Redundancy Avoidance:** The visual canvas does NOT show a large block of text repeating the audio verbatim. Only a compact 3-word spatial pill appears: `Ray NB → (Origin: Point N)`.

#### Phase 5: Reflective Self-Explanation (Schema Consolidation)
- **Objective:** Consolidate causal understanding before moving forward to the next step.
- **UI State:**
  - A single concise reflection prompt appears:
    *e.g., "Why does Ray NB have a different name than Ray TB even though they point the same way?"*
  - The student completes the check (or taps a self-explanation confirmation).
  - The `[Next Step]` button unlocks with a subtle green pulse, allowing user-controlled progression.

---

## 3. Transition & Motion Engineering Standards

To uphold the **Coherence Effect** and eliminate extraneous cognitive load, the interface strictly adheres to the following motion matrix:

| Interface Event | Recommended Transition Style (Permitted) | Forbidden Patterns (Extraneous Load) |
| :--- | :--- | :--- |
| **Page / Step Switch** | **In-place State Morphing:** Retain persistent layout; cross-fade or fade-in only added elements (150ms opacity transition). | Full-screen page slide, 3D card flips, skeuomorphic page curl, or complete screen redraws. |
| **Element Inclusion** | **Signaled Fade & Pulse:** Fade element to 100% opacity with a brief 1-second highlight outline (`stroke="#0EA5E9"`, 400ms decay). | Bouncing drop-ins, spinning animations, explosive particle bursts, or wobbly spring physics. |
| **Audio Guidance** | **Short Spoken Narration:** Play concise narration synced with visual stroke movement ($t = 0\text{ ms}$ onset). | Displaying identical full on-screen text alongside audio narration (The Redundancy Effect). |
| **Feedback / Rewards** | **Minimal Corrective Signals:** Subtle checkmarks or gentle color shifts placed directly near the target object. | Screen-covering star bursts, pop-up banners, coin sounds, fireworks, or gamified token counters. |

---

## 4. Concrete Walkthroughs: Applying the 5 Phases to Mathematical Solutions

Below are four end-to-end walkthroughs demonstrating how the 5-phase state machine operates in actual mathematical simulations from Chapter 2 (*Lines and Angles*).

---

### Walkthrough 1: Protractor Construction Step 3 & 4 (Section 2.10)
**Curricular Goal:** Construct $\angle TIN = 30^\circ$ on base ray $IN$.

```
     Phase 1: Pretraining          Phase 2: Signaling            Phase 3: Prediction
     ┌───────────────────────┐     ┌───────────────────────┐     ┌───────────────────────┐
     │   I───────────────>N  │     │      ╭─────────╮      │     │      ╭─────────╮      │
     │   (Dimmed Grid)       │ ──> │      │  30° ◌  │  0°  │ ──> │   Inner vs Outer?    │
     │   [Base Ray IN Ready] │     │   I──┴─────────┴──>N  │     │   [Next Step Disabled]│
     └───────────────────────┘     └───────────────────────┘     └───────────────────────┘
                                                                             │
                                                                             ▼
     Phase 5: Reflection           Phase 4: Reveal & Audio
     ┌───────────────────────┐     ┌───────────────────────┐
     │          T            │     │          T            │
     │         /             │ <── │         ◌             │
     │   I────/──────────>N  │     │   I─────────────────>N│
     │   "Why Inner Scale?"  │     │   Audio: "Mark 30°..."│
     │   [Next Step Unlocks] │     │   Point T Pulses Solid│
     └───────────────────────┘     └───────────────────────┘
```

1. **Phase 1: Component Pretraining:**
   - Base ray $IN$ is on screen. The grid is slightly dimmed (`opacity: 0.25`).
   - Tapping vertex $I$ shows micro-pill: `Vertex I (Protractor Center Notch Anchor)`.
   - Tapping ray $IN$ shows micro-pill: `Base Ray IN (Aligned with 0° Baseline)`.
2. **Phase 2: Targeted Step Signaling:**
   - Semi-transparent protractor overlay appears.
   - At $30^\circ$ on the protractor curve, a **ghost marker circle** (dashed ring `◌`, $r=5\text{px}$) pulses with a subtle cyan glow.
   - A pointer notch points directly to the $30^\circ$ tick mark.
3. **Phase 3: Active Minds-On Prediction Prompt:**
   - `[Next Step]` is disabled.
   - Prompt beside protractor: *"Our base ray points right toward 0°. Which scale reads 30° from the right: Inner or Outer?"*
   - Student selects: `[Inner Scale]`. Correct indicator lights up.
4. **Phase 4: Segmented Step Reveal (In-Place Morph & Audio):**
   - Ghost circle morphs into solid Point $T$ (`fill="#005583"`, $r=5.5\text{px}$) with a 400ms pulse halo.
   - **Simultaneous Audio (at $t = 0\text{ ms}$):** Narration speaks: *"We mark Point T at thirty degrees along the inner scale."*
   - **No Redundant Text:** Screen displays only compact spatial badge: `Point T (30°)`.
5. **Phase 5: Reflective Self-Explanation:**
   - Prompt: *"Why would using the outer scale here produce an incorrect obtuse angle of 150°?"*
   - Student confirms: *"Because the outer scale starts from the left (180° on right)."*
   - `[Next Step: Join with Ruler]` illuminates in green, ready for user trigger.

---

### Walkthrough 2: Practice Question 1 – Rihan & Sheetal (Fig. 2.3)
**Textbook Problem:**
- *(a) Rihan marked Point A. How many lines can he draw passing through A?*
- *(b) Sheetal marked Points P and Q. How many straight lines can pass through both?*

#### Part A: Rihan (One Point $A$)
1. **Phase 1: Component Pretraining:**
   - Point $A (320, 180)$ is rendered in isolation.
   - Tapping $A$ reveals in-context tag: `Point A · Zero-dimensional location marker`.
2. **Phase 2: Targeted Step Signaling:**
   - A dashed horizontal guideline passes through $A$ with faint arrows.
   - Halo ring around $A$ pulses twice.
3. **Phase 3: Active Minds-On Prediction Prompt:**
   - `[Next Step]` disabled.
   - Prompt: *"How many straight lines can turn and pass through this single point?"*
   - Options: `[Only 1]`, `[Only 2]`, `[Infinitely many]`.
   - Student selects: `[Infinitely many]`.
4. **Phase 4: Segmented Step Reveal (In-Place Fan-Out & Audio):**
   - User clicks `"+ Add Line Through A"`.
   - Line 1 sweeps through $A$ at $0^\circ$. A second tap sweeps Line 2 at $35^\circ$. A third tap sweeps Line 3 at $70^\circ$.
   - **Simultaneous Audio:** *"Lines can pivot around Point A in every direction without limit."*
   - Spatial Badge pinned at $A$: `Lines through Point A: ∞ (Infinite)`.
5. **Phase 5: Reflective Self-Explanation:**
   - Reflection Check: *"Does drawing more lines change the position of Point A?"*
   - Student selects: *"No, Point A remains the shared intersection of all lines."*
   - `[Proceed to Sheetal: 2 Points]` button unlocks.

#### Part B: Sheetal (Two Points $P$ and $Q$)
1. **Phase 1: Component Pretraining:**
   - Points $P (205, 205)$ and $Q (435, 155)$ appear.
   - Student taps $P$ $\to$ `Point P`. Student taps $Q$ $\to$ `Point Q`.
2. **Phase 2: Targeted Step Signaling:**
   - A dashed straight ghost line connects $P$ and $Q$.
   - Pointer arrows point simultaneously to $P$ and $Q$.
3. **Phase 3: Active Minds-On Prediction Prompt:**
   - Prompt: *"Can we draw a second, different straight line that passes through both P and Q?"*
   - Options: `[Yes, at another tilt]`, `[No, only 1 unique straight line exists]`.
   - Student selects: `[No, only 1 unique straight line exists]`.
4. **Phase 4: Segmented Step Reveal & Counter-Model:**
   - Ghost line morphs into solid Line $PQ$ (`#005583`, stroke: 4px).
   - A red dashed line attempts to pivot through $P$, visibly missing $Q$.
   - **Simultaneous Audio:** *"A straight line cannot bend. Only one line can pass through both points simultaneously."*
   - Spatial Badge: `Unique Line ↔PQ`.
5. **Phase 5: Reflective Self-Explanation:**
   - Reflection Check: *"Why did the second line fail to pass through both points?"*
   - Student confirms: *"Changing the direction caused it to miss Point Q."*
   - `[Next Question]` button unlocks.

---

### Walkthrough 3: Practice Question 3 – Rays from $T$ and $N$ (Fig. 2.5)
**Textbook Problem:**
*Name the rays shown in Fig. 2.5. Is T the starting point of each of these rays?*

```
                              A (355, 105)
                             ●
                            ↗
                           ↗
             T (145, 235) ↗       N (315, 235)    B (465, 235)
             ●────────────────────●───────────────●───────────────>
```

1. **Phase 1: Component Pretraining:**
   - Points $T, N, B$ lie on a baseline; Point $A$ is positioned diagonally upward.
   - Non-active background dimmed.
   - Student taps $T$: `Point T (Leftmost on baseline)`.
   - Student taps $N$: `Point N (Middle on baseline)`.
   - Student taps $B$: `Point B (Rightward on baseline)`.
2. **Phase 2: Targeted Step Signaling (Focusing on Ray $NB \to$):**
   - The sub-beam from $N$ through $B$ shows a **dashed magenta ghost stroke**.
   - A pulsing magenta focal ring ($r=13\text{px}$) highlights Point $N$. Point $T$ remains unhighlighted.
3. **Phase 3: Active Minds-On Prediction Prompt:**
   - `[Next Step]` disabled.
   - Prompt: *"Look closely at Ray NB →. What is its starting point (origin)?"*
   - Options: `[Origin is Point T]`, `[Origin is Point N]`.
   - Student selects: `[Origin is Point N]`.
4. **Phase 4: Segmented Step Reveal (In-Place Morph & Audio):**
   - Dashed magenta stroke morphs into solid high-contrast magenta (`#DB2777`, stroke: 5px) shooting rightward.
   - **Simultaneous Audio ($t = 0\text{ ms}$):** *"Ray NB originates at Point N. Point T lies behind it and is not part of this ray."*
   - Spatial Pill pinned directly at Point $N$: `Origin = Point N (NOT Point T!)`.
5. **Phase 5: Reflective Self-Explanation:**
   - Reflection Check: *"Why are Ray TN and Ray TB the same ray, but Ray NB is different?"*
   - Student confirms: *"Because Ray TN and TB both start at T, whereas Ray NB starts at N."*
   - `[Next Step: Verify Ray TA]` unlocks with green outline.

---

### Walkthrough 4: Practice Question 6 – Ray Naming Directionality (Fig. 2.7)
**Textbook Problem:**
*Ray OA passes through points A and B. Is Ray OA the same as Ray AO?*

```
            O (120, 185)       A (280, 185)       B (430, 185)
            ●──────────────────●──────────────────●───────────────>
```

1. **Phase 1: Component Pretraining:**
   - Collinear points $O, A, B$ appear on the screen.
   - Tapping $O$: `Origin Point O`. Tapping $A$: `Pass-through Point A`. Tapping $B$: `Pass-through Point B`.
2. **Phase 2: Targeted Step Signaling:**
   - Existing Ray $OA \to$ is rendered in solid blue pointing right.
   - A ghost reversed arrow (dashed magenta) appears originating at $A$ and pointing left toward $O$.
3. **Phase 3: Active Minds-On Prediction Prompt:**
   - `[Next Step]` disabled.
   - Prompt: *"If we name the ray 'AO', does it point the same way as Ray OA?"*
   - Options: `[Yes, order of letters does not matter]`, `[No, Ray AO starts at A and points left]`.
   - Student selects: `[No, Ray AO starts at A and points left]`.
4. **Phase 4: Segmented Step Reveal & Counter-Model:**
   - The reversed Ray $AO \to$ morphs in-place into solid magenta (`#DB2777`) shooting left past $O$ to $(48, 185)$.
   - **Simultaneous Audio:** *"Ray AO starts at Point A and shoots in the opposite direction, missing Point B completely."*
   - Twin Spatial Badges:
     - Blue badge at $O$: `Ray OA → (Shoots Right)`.
     - Magenta badge at $A$: `Ray AO → (Shoots Left)`.
     - Center Warning Pill: `Ray OA → ≠ Ray AO →`.
5. **Phase 5: Reflective Self-Explanation:**
   - Reflection Check: *"Why can a line segment be called AB or BA, but a ray cannot be reversed?"*
   - Student confirms: *"Because a ray has a fixed direction starting from its first letter."*
   - `[Practice Complete]` badge unlocks.

---

## 5. Technical Architecture & React State Machine Integration

To guarantee that developers can implement this 5-phase lifecycle with zero ambiguity, the following TypeScript interfaces and state hook are standardized across the codebase.

### 5.1 Step Machine Phase Enum & Interfaces
```typescript
export type StepPhase =
  | 'PHASE_1_PRETRAINING'
  | 'PHASE_2_SIGNALING'
  | 'PHASE_3_PREDICTION'
  | 'PHASE_4_REVEAL'
  | 'PHASE_5_REFLECTION'
  | 'STEP_RESOLVED';

export interface PretrainedComponent {
  id: string;
  label: string;
  stateDescription: string;
  anchor: { x: number; y: number };
}

export interface PredictionHypothesis {
  id: string;
  text: string;
  isCorrect: boolean;
  formativeFeedback: string;
}

export interface StepDefinition {
  stepId: string;
  stepNumber: number;
  totalSteps: number;
  components: PretrainedComponent[];
  signaledElementId: string;
  predictionPrompt: string;
  predictionOptions: PredictionHypothesis[];
  audioNarrationUrl?: string;
  audioDurationMs?: number;
  spatialBadgeText: string;
  reflectionPrompt: string;
  reflectionAnswer: string;
}
```

### 5.2 Canonical Controller Hook: `useStepLifecycle`
```typescript
import { useState, useCallback } from 'react';

export function useStepLifecycle(step: StepDefinition, onStepComplete: () => void) {
  const [phase, setPhase] = useState<StepPhase>('PHASE_1_PRETRAINING');
  const [selectedHypothesis, setSelectedHypothesis] = useState<string | null>(null);
  const [reflectionAnswered, setReflectionAnswered] = useState<boolean>(false);
  const [activePretrainedId, setActivePretrainedId] = useState<string | null>(null);

  // Phase 1 -> Phase 2
  const acknowledgePretraining = useCallback(() => {
    setActivePretrainedId(null);
    setPhase('PHASE_2_SIGNALING');
  }, []);

  // Phase 2 -> Phase 3
  const beginPrediction = useCallback(() => {
    setPhase('PHASE_3_PREDICTION');
  }, []);

  // Phase 3 -> Phase 4
  const submitPrediction = useCallback((hypothesisId: string) => {
    setSelectedHypothesis(hypothesisId);
    const chosen = step.predictionOptions.find((o) => o.id === hypothesisId);
    if (chosen?.isCorrect) {
      setPhase('PHASE_4_REVEAL');
    }
  }, [step]);

  // Phase 4 -> Phase 5 (Triggered when audio/reveal completes)
  const completeReveal = useCallback(() => {
    setPhase('PHASE_5_REFLECTION');
  }, []);

  // Phase 5 -> STEP_RESOLVED
  const completeReflection = useCallback(() => {
    setReflectionAnswered(true);
    setPhase('STEP_RESOLVED');
    onStepComplete();
  }, [onStepComplete]);

  return {
    phase,
    activePretrainedId,
    selectedHypothesis,
    reflectionAnswered,
    isNextDisabled: phase !== 'STEP_RESOLVED',
    setActivePretrainedId,
    acknowledgePretraining,
    beginPrediction,
    submitPrediction,
    completeReveal,
    completeReflection,
  };
}
```

---

## 6. QA Verification Matrix (Cognitive Science Compliance)

Before deploying any subtab, simulation stage, or practice problem, the implementation must pass this 6-point cognitive friction audit:

| Verification Item | Verification Rule | Pass / Fail Criteria |
| :--- | :--- | :--- |
| **Pretraining Check** | Are non-active primitives dimmed to 0.25 opacity in Phase 1? | **PASS** if student can tap components to read their roles before new elements appear. |
| **Targeted Signaling** | Does the candidate element render in a ghost dashed state with a subtle focus glow in Phase 2? | **PASS** if eye gaze is directed without full canvas movement. |
| **Minds-On Gate** | Is the `[Next Step]` button disabled until a prediction hypothesis is selected in Phase 3? | **PASS** if passive click-through is physically blocked. |
| **Synchronized Audio** | Does audio narration trigger at $t = 0\text{ ms}$ simultaneous with the stroke animation in Phase 4? | **PASS** if audio and visual motion are 100% temporally contiguous. |
| **Redundancy Audit** | Is large redundant text omitted from the screen during audio playback? | **PASS** if only concise in-context spatial badges are shown. |
| **Reflective Check** | Does a self-explanation prompt consolidate understanding before unlocking the next step in Phase 5? | **PASS** if schema consolidation is validated. |
