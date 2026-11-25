/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  GitMerge,
  Grid,
  Hash,
  Layers,
  Search,
  Shapes,
  Sparkles,
  X,
} from 'lucide-react';
import { COLORS } from '../design/tokens';
import {
  CHAPTER_TITLE,
  CLASS_LABEL,
  SectionConfig,
  SectionId,
} from '../content/sections';

interface IndexDrawerProps {
  open: boolean;
  onClose: () => void;
  sections: SectionConfig[];
  activeSectionId: SectionId;
  activeTopicId?: string;
  onSelectSection: (sectionId: SectionId) => void;
  onSelectTopic?: (topicId: string, sectionId?: SectionId) => void;
}

const SECTION_ICONS: Record<SectionId, React.ComponentType<{ className?: string }>> = {
  'sec-1-1': Sparkles,
  'sec-1-2': Hash,
  'sec-1-3': Grid,
  'sec-1-4': GitMerge,
  'sec-1-5': Shapes,
  'sec-1-6': Layers,
  'sec-1-solutions': CheckCircle2,
};

export const IndexDrawer: React.FC<IndexDrawerProps> = ({
  open,
  onClose,
  sections,
  activeSectionId,
  activeTopicId,
  onSelectSection,
  onSelectTopic,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [howToUseOpen, setHowToUseOpen] = useState(false);

  const drawerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const activeItemRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    setHowToUseOpen(false);
    setSearchQuery('');

    const frameId = window.requestAnimationFrame(() => {
      activeItemRef.current?.scrollIntoView({ block: 'center', behavior: 'auto' });
      closeBtnRef.current?.focus({ preventScroll: true });
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [open, onClose]);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const totalTopics = useMemo(
    () => sections.reduce((sum, sec) => sum + sec.subTabs.length, 0),
    [sections]
  );

  const filteredSections = useMemo(() => {
    if (!normalizedQuery) return sections;

    return sections
      .map((sec) => {
        const secMatches = sec.label.toLowerCase().includes(normalizedQuery);
        if (secMatches) return sec;

        const matchingTabs = sec.subTabs.filter((topic) =>
          `${topic.label} ${topic.headline} ${topic.notation ?? ''}`
            .toLowerCase()
            .includes(normalizedQuery)
        );

        if (matchingTabs.length === 0) return null;
        return { ...sec, subTabs: matchingTabs };
      })
      .filter((s): s is SectionConfig => s !== null);
  }, [sections, normalizedQuery]);

  if (!open) return null;

  const toggleSectionCollapse = (secId: string) => {
    setCollapsedSections((prev) => ({ ...prev, [secId]: !prev[secId] }));
  };

  return (
    <div data-no-nav="true" className="fixed inset-0 z-50 flex justify-end">
      {/* Soft dimmed backdrop */}
      <div
        data-no-nav="true"
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-[1px] animate-backdrop-in"
      />

      {/* Right-side primary navigation drawer */}
      <div
        ref={drawerRef}
        id="index-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="index-drawer-title"
        data-no-nav="true"
        className="relative z-10 h-full w-full sm:w-[380px] md:w-[420px] bg-white border-l border-slate-200/80 shadow-2xl flex flex-col animate-drawer-in"
      >
        {/* Header & Quick Search */}
        <div className="px-4 sm:px-5 pt-4 pb-3.5 border-b border-slate-200/80 flex flex-col gap-3 shrink-0 bg-white">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Grid className="w-4 h-4 shrink-0" style={{ color: COLORS.primary }} />
                <h2
                  id="index-drawer-title"
                  className="text-[20px] font-extrabold tracking-tight leading-tight"
                  style={{ color: COLORS.headingText }}
                >
                  Chapter Index
                </h2>
              </div>
              <p className="text-[16px] font-semibold mt-0.5" style={{ color: COLORS.mutedText }}>
                {CLASS_LABEL} · {CHAPTER_TITLE} ({totalTopics} topics)
              </p>
            </div>

            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              aria-label="Close chapter index"
              className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter/search input */}
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Triangular, Squares, Koch..."
              aria-label="Filter sections or topics"
              className="w-full min-h-[44px] pl-9 pr-9 rounded-xl bg-slate-50 border border-slate-300 text-[16px] font-semibold text-slate-900 placeholder:text-slate-500 focus:outline-none focus:bg-white transition-colors"
              style={{ accentColor: COLORS.primary }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  searchInputRef.current?.focus();
                }}
                aria-label="Clear search filter"
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 absolute right-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Section Navigation Hub */}
        <nav
          aria-label="Chapter index"
          className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-3.5 sm:px-4 py-3.5 space-y-3 bg-slate-50/40"
        >
          {filteredSections.length === 0 ? (
            <div className="py-12 px-4 text-center flex flex-col items-center gap-2">
              <Search className="w-6 h-6 text-slate-300" />
              <p className="text-[16px] font-semibold text-slate-600">
                No topics match &ldquo;{searchQuery}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="min-h-[44px] px-3 text-[16px] font-bold hover:underline cursor-pointer"
                style={{ color: COLORS.primary }}
              >
                Show all sections
              </button>
            </div>
          ) : (
            filteredSections.map((sec) => {
              const isActiveSection = sec.id === activeSectionId;
              const isCollapsed = !normalizedQuery && Boolean(collapsedSections[sec.id]);
              const SectionIcon = SECTION_ICONS[sec.id] || BookOpen;

              return (
                <section
                  key={sec.id}
                  className={`rounded-2xl border bg-white overflow-hidden transition-colors ${
                    isActiveSection ? 'border-sky-200 shadow-2xs' : 'border-slate-200/80'
                  }`}
                >
                  {/* Section Card Header */}
                  <div className="flex items-center justify-between gap-2 px-3 py-2.5 border-b border-slate-100/90">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectSection(sec.id);
                        onClose();
                      }}
                      className="flex-1 min-w-0 flex items-center gap-2.5 text-left cursor-pointer group"
                    >
                      <span
                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: COLORS.accent.tint, color: COLORS.primary }}
                      >
                        <SectionIcon className="w-4 h-4" />
                      </span>
                      <div className="min-w-0">
                        <div className="text-[16px] font-extrabold text-slate-900 transition-colors leading-snug">
                          {sec.label}
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleSectionCollapse(sec.id)}
                      aria-expanded={!isCollapsed}
                      aria-label={`Toggle ${sec.label}`}
                      className="w-11 h-11 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer shrink-0 transition-colors"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isCollapsed ? '-rotate-90' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Topic Rows */}
                  {!isCollapsed && (
                    <div className="p-1.5 flex flex-col gap-1">
                      {sec.subTabs.map((topic) => {
                        const isActiveTopic = isActiveSection && topic.id === activeTopicId;

                        return (
                          <button
                            key={topic.id}
                            ref={isActiveTopic ? activeItemRef : undefined}
                            type="button"
                            onClick={() => {
                              if (onSelectTopic) {
                                onSelectTopic(topic.id, sec.id);
                              } else {
                                onSelectSection(sec.id);
                              }
                              onClose();
                            }}
                            aria-current={isActiveTopic ? 'page' : undefined}
                            className="w-full min-h-[44px] px-3 py-2 rounded-xl text-left flex items-center justify-between gap-2.5 transition-colors cursor-pointer hover:bg-slate-50"
                            style={
                              isActiveTopic
                                ? { backgroundColor: COLORS.accent.tint, color: COLORS.primary }
                                : { color: COLORS.bodyText }
                            }
                          >
                            <span
                              className={`text-[16px] leading-snug ${
                                isActiveTopic ? 'font-bold' : 'font-semibold'
                              }`}
                              style={{ color: isActiveTopic ? COLORS.primary : COLORS.headingText }}
                            >
                              {topic.label}
                            </span>

                            {topic.notation && (
                              <span className="text-[16px] font-semibold tabular-nums text-slate-600 whitespace-nowrap shrink-0">
                                {topic.notation}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            })
          )}
        </nav>

        {/* Bottom collapsed 'Quick Navigation Tips' row */}
        <div className="shrink-0 border-t border-slate-200/80 px-3.5 py-2 bg-white">
          <button
            type="button"
            onClick={() => setHowToUseOpen((prev) => !prev)}
            aria-expanded={howToUseOpen}
            className="w-full min-h-[44px] px-2.5 py-1.5 rounded-xl flex items-center justify-between text-[16px] font-bold text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <span>Navigation help</span>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                howToUseOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {howToUseOpen && (
            <ul className="px-2.5 pb-2.5 pt-1 space-y-1.5 text-[16px] leading-relaxed text-slate-700">
              <li>Tap stage for next step. Double-tap to go back.</li>
              <li>Use Previous, Next, or arrow keys anytime.</li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
