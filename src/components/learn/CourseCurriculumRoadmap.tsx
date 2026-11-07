"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  Lock,
  Play,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Trophy,
  Flame,
  Clock,
  BookOpen,
  Code2,
  Layers,
  Zap,
  Check,
  RotateCcw,
  Maximize2,
  Gamepad2,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Step,
  Chapter,
  CHAPTERS,
  STEPS,
  MINIGAMES,
  isMinigamesUnlocked,
} from "@/lib/curriculumData";
import { ResponsiveContainer, AreaChart, Area } from "recharts";

interface CourseCurriculumRoadmapProps {
  steps?: Step[];
  chapters?: Chapter[];
  completedStepIds?: number[];
  currentStepId?: number;
  selectedChapter?: number;
  onSelectStep: (stepIdx: number) => void;
  onSelectChapter?: (chapterId: number) => void;
  isEmbeddedInSidebar?: boolean;
  onOpenFullscreenCurriculum?: () => void;
  onSwitchToWorkspace?: () => void;
  onOpenMinigame?: (gameId: string) => void;
  onOpenHistoryModal?: () => void;
  mascotName?: string;
  mascotAvatar?: string;
}

export function CourseCurriculumRoadmap({
  steps = STEPS,
  chapters = CHAPTERS,
  completedStepIds = [1, 2, 3],
  currentStepId = 4,
  selectedChapter = 1,
  onSelectStep,
  onSelectChapter,
  isEmbeddedInSidebar = false,
  onOpenFullscreenCurriculum,
  onSwitchToWorkspace,
  onOpenMinigame,
  onOpenHistoryModal,
  mascotName = "StarPy",
  mascotAvatar = "/starpy.jpg",
}: CourseCurriculumRoadmapProps) {
  const [activeChapterId, setActiveChapterId] = React.useState(selectedChapter);

  // Sync internal chapter state with prop if controlled
  React.useEffect(() => {
    if (selectedChapter) {
      setActiveChapterId(selectedChapter);
    }
  }, [selectedChapter]);

  const handleChapterChange = (chapterId: number) => {
    setActiveChapterId(chapterId);
    if (onSelectChapter) {
      onSelectChapter(chapterId);
    }
  };

  // Current active chapter details
  const currentChapter = useMemo(
    () => chapters.find((c) => c.id === activeChapterId) || chapters[0],
    [chapters, activeChapterId]
  );

  // Filter steps for currently active chapter
  const chapterSteps = useMemo(
    () => steps.filter((s) => s.chapterId === activeChapterId),
    [steps, activeChapterId]
  );

  // Overall course progress
  const totalSteps = steps.length;
  const completedCount = completedStepIds.length;
  const progressPct = Math.round((completedCount / totalSteps) * 100 * 10) / 10;

  // Chapter progress helper
  const getChapterProgress = (chapter: Chapter) => {
    const chapterStepList = steps.filter((s) => s.chapterId === chapter.id);
    const done = chapterStepList.filter((s) =>
      completedStepIds.includes(s.id)
    ).length;
    return { done, total: chapterStepList.length };
  };

  // Step Status Helper
  const getStepStatus = (stepId: number) => {
    if (completedStepIds.includes(stepId)) return "completed";
    if (stepId === currentStepId) return "current";
    // If previous step is completed or it's step 1, consider unlocked
    if (stepId === 1 || completedStepIds.includes(stepId - 1)) return "unlocked";
    return "locked";
  };

  /* ═════════════════════════════════════════════════════════════════
     EMBEDDED SIDEBAR VIEW (When used inside the Left Tab of Code Editor)
  ═══════════════════════════════════════════════════════════════════ */
  if (isEmbeddedInSidebar) {
    return (
      <div className="flex flex-col h-full overflow-hidden bg-slate-900/95 text-slate-100">
        {/* Compact Header & Chapter Selector */}
        <div className="shrink-0 p-4 border-b border-slate-800 bg-slate-950/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Skill Tree Roadmap
              </span>
            </div>
            {onOpenFullscreenCurriculum && (
              <button
                onClick={onOpenFullscreenCurriculum}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-[11px] font-semibold border border-cyan-500/30 transition-all cursor-pointer"
                title="ขยายเป็นมุมมองเต็มหน้าจอ"
              >
                <Maximize2 size={12} />
                <span>มุมมองเต็มจอ</span>
              </button>
            )}
          </div>

          {/* Mini Progress Card */}
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500">ภาพรวมหลักสูตร</span>
              <span className="font-mono font-bold text-cyan-400">
                Completed {completedCount} of {totalSteps} steps • {progressPct}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Chapter Selector Dropdown / Scroll Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {chapters.map((ch) => {
              const { done, total } = getChapterProgress(ch);
              const isActive = ch.id === activeChapterId;
              const isAllDone = done === total;
              return (
                <button
                  key={ch.id}
                  onClick={() => handleChapterChange(ch.id)}
                  className={cn(
                    "shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer",
                    isActive
                      ? "bg-cyan-500/20 border-cyan-400 text-white shadow-xs"
                      : "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-200 hover:border-slate-700"
                  )}
                >
                  <span>{ch.icon}</span>
                  <span>Ch.{ch.number}</span>
                  <span
                    className={cn(
                      "text-[10px] px-1 py-0.2 rounded font-mono",
                      isAllDone
                        ? "bg-emerald-950 text-emerald-400"
                        : "bg-slate-800 text-slate-500"
                    )}
                  >
                    {done}/{total}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Embedded Vertical Timeline Steps */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="relative pl-7 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0 before:border-l-2 before:border-dashed before:border-slate-300">
            {chapterSteps.map((s) => {
              const status = getStepStatus(s.id);
              const isCompleted = status === "completed";
              const isCurrent = status === "current";
              const isLocked = status === "locked";

              return (
                <div key={s.id} className="relative mb-4 last:mb-0 group">
                  {/* Step Node */}
                  <div
                    className={cn(
                      "absolute -left-7 top-2 w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all z-10",
                      isCompleted
                        ? "bg-emerald-500 text-slate-950 ring-2 ring-emerald-400/50 shadow-md shadow-emerald-500/30"
                        : isCurrent
                        ? "bg-gradient-to-tr from-cyan-500 to-blue-600 text-white ring-4 ring-cyan-400/40 animate-pulse shadow-md shadow-cyan-500/50"
                        : isLocked
                        ? "bg-transparent border-2 border-dashed border-slate-700 text-slate-600 opacity-60 cursor-not-allowed"
                        : "bg-slate-800 border border-slate-700 text-slate-300"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={15} className="stroke-[2.5]" />
                    ) : isLocked ? (
                      <Lock size={11} />
                    ) : (
                      <span>{s.id}</span>
                    )}
                  </div>

                  {/* Compact Step Card */}
                  <div
                    onClick={() => {
                      if (isLocked) return;
                      onSelectStep(s.id - 1);
                    }}
                    className={cn(
                      "p-3 rounded-xl border transition-all text-left",
                      isCurrent
                        ? "bg-slate-900 border-cyan-400/80 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-400/20 cursor-pointer"
                        : isCompleted
                        ? "bg-slate-950/60 border-emerald-900/60 text-slate-200 hover:border-emerald-600 cursor-pointer"
                        : isLocked
                        ? "bg-slate-950/30 border-dashed border-slate-800/60 text-slate-500 opacity-60 cursor-not-allowed"
                        : "bg-slate-950/40 border-slate-800 text-slate-300 hover:border-cyan-500/40 cursor-pointer"
                    )}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-mono font-bold text-cyan-400">
                        Step {s.id} • {s.summaryBadge}
                      </span>
                      <span className="text-[10px] text-amber-400 font-mono">
                        +{s.xp} XP
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white line-clamp-1 mb-0.5">
                      {s.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mb-2 font-light">
                      {s.description}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[11px]">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Clock size={11} /> ~{s.estimatedMinutes} นาที
                      </span>
                      <button
                        disabled={isLocked}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isLocked) return;
                          onSelectStep(s.id - 1);
                        }}
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold transition-all flex items-center gap-1",
                          isCompleted
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800/60 hover:bg-emerald-900 cursor-pointer"
                            : isCurrent
                            ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-extrabold shadow-sm cursor-pointer"
                            : isLocked
                            ? "bg-slate-900 border border-dashed border-slate-800 text-slate-600 cursor-not-allowed"
                            : "bg-slate-800 text-cyan-300 hover:bg-slate-700 cursor-pointer"
                        )}
                      >
                        {isCompleted
                          ? "Review 🔄"
                          : isCurrent
                          ? "Start Lesson 🚀"
                          : isLocked
                          ? "Locked 🔒"
                          : "Start ⚡"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Game Arena link in sidebar */}
          <Link
            href="/arena"
            className="block p-3 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800/80 transition-colors space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Gamepad2 size={13} className="text-purple-400" />
                <span>PyStep Game Arena</span>
              </span>
              <span className={cn(
                "text-[10px] font-mono px-1.5 py-0.2 rounded border font-bold",
                isMinigamesUnlocked(completedStepIds)
                  ? "bg-emerald-950 text-emerald-400 border-emerald-800/60"
                  : "bg-slate-900 text-amber-400 border-amber-900/60"
              )}>
                {isMinigamesUnlocked(completedStepIds) ? "🔓 Unlocked" : "🔒 Ch.24 Locked"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {isMinigamesUnlocked(completedStepIds)
                ? "ปลดล็อกโซนเกมแล้ว! คลิกเพื่อเข้าสู่ Game Arena"
                : "เรียนจบ Chapter 24 (Capstone Project) เพื่อปลดล็อกโซนเกม"}
            </p>
          </Link>
        </div>
      </div>
    );
  }

  /* ═════════════════════════════════════════════════════════════════
     FULL SPLIT VIEW LAYOUT (21st.dev Style Vertical Timeline)
  ═══════════════════════════════════════════════════════════════════ */
  return (
    <div className="flex-1 w-full bg-[#F8FAFC] text-slate-900 overflow-y-auto selection:bg-emerald-500 selection:text-slate-900">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60">
        <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -right-40 w-[450px] h-[450px] bg-blue-400/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Two-Column Split View Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ═════════════════════════════════════════════════════════
              LEFT COLUMN (Header / Course Overview Section)
          ═══════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-6">
            {/* Top Pill Badge & History Button */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-mono font-bold tracking-wider uppercase shadow-xs">
                <span className="text-base">🐍</span>
                <span>PYTHON LEARNING PATHWAY</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              </div>

              {onOpenHistoryModal && (
                <button
                  onClick={onOpenHistoryModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  <BookOpen size={12} className="text-indigo-600" />
                  <span>ประวัติ & ปรัชญา (MarcusCode)</span>
                </button>
              )}
            </div>

            {/* Main Title & Subtitle */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                A structured journey from beginner to{" "}
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Python mastery.
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light">
                เรียนรู้ผ่านการลงมือทำจริง (Learn by Doing) พร้อมคำแนะนำจาก AI
                Mentor และโจทย์ท้าทายไต่ระดับความยาก
              </p>
            </div>

            {/* Course Progress Summary Card */}
            <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
                  Course Progress
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  {completedCount} / {totalSteps} สำเร็จ ({progressPct}%)
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/80">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700"
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              {/* Mini Stats Pills */}
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-center gap-1 text-emerald-600 font-bold text-xs">
                    <Trophy size={13} />
                    <span>{completedCount * 100}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">XP สะสม</div>
                </div>

                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-center gap-1 text-rose-500 font-bold text-xs">
                    <Flame size={13} className="fill-rose-500" />
                    <span>3 วัน</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Streak ต่อเนื่อง</div>
                </div>

                <div className="p-2 rounded-xl bg-slate-950/50 border border-slate-800/60">
                  <div className="flex items-center justify-center gap-1 text-cyan-400 font-bold text-xs">
                    <Layers size={13} />
                    <span>Ch.{activeChapterId}/6</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">บทเรียนปัจจุบัน</div>
                </div>
              </div>
            </div>

            {/* Sparkline Analytics Cards (Integrated from stats-4 design) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 space-y-1 shadow-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-semibold">Learning Velocity</span>
                  <span className="text-emerald-400 font-mono font-bold">+10.4%</span>
                </div>
                <div className="text-sm font-black text-slate-900 font-mono">
                  +15.8 XP/hr
                </div>
                <div className="h-10 mt-1 overflow-hidden">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { val: 12 }, { val: 15 }, { val: 18 }, { val: 24 },
                        { val: 21 }, { val: 28 }, { val: 35 }, { val: 42 },
                        { val: 48 }, { val: 56 }
                      ]}
                    >
                      <defs>
                        <linearGradient id="learnSpark1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="val"
                        stroke="#10b981"
                        fill="url(#learnSpark1)"
                        strokeWidth={1.5}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 space-y-1 shadow-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-semibold">Daily Momentum</span>
                  <span className="text-cyan-400 font-mono font-bold">+6.3%</span>
                </div>
                <div className="text-sm font-black text-slate-900 font-mono">
                  96.4% Accuracy
                </div>
                <div className="h-10 mt-1 overflow-hidden">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { val: 40 }, { val: 48 }, { val: 45 }, { val: 55 },
                        { val: 52 }, { val: 62 }, { val: 70 }, { val: 75 },
                        { val: 82 }, { val: 94 }
                      ]}
                    >
                      <defs>
                        <linearGradient id="learnSpark2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="val"
                        stroke="#06b6d4"
                        fill="url(#learnSpark2)"
                        strokeWidth={1.5}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* ═════════════════════════════════════════════════════
                Chapter Selector (Chapters 1 to 6)
            ══════════════════════════════════════════════════════ */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Course Chapters / เลือกบทเรียน (Chapter 1 - 6)
                </h3>
                <span className="text-[11px] text-slate-500">
                  คลิกเพื่อเปลี่ยนบท
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
                {chapters.map((ch) => {
                  const { done, total } = getChapterProgress(ch);
                  const isSelected = ch.id === activeChapterId;
                  const isComplete = done === total;

                  return (
                    <button
                      key={ch.id}
                      onClick={() => handleChapterChange(ch.id)}
                      className={cn(
                        "w-full p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between group",
                        isSelected
                          ? "bg-slate-900 border-cyan-400/90 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400/30"
                          : "bg-slate-900/40 border-slate-800/70 hover:bg-slate-900/80 hover:border-slate-700"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={cn(
                            "w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0 transition-transform group-hover:scale-105",
                            isSelected
                              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                              : "bg-slate-800 text-slate-500 border border-slate-700/60"
                          )}
                        >
                          {ch.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono text-cyan-400 font-bold">
                              Ch.{ch.number}
                            </span>
                            <span className="text-xs font-bold text-white truncate">
                              {ch.title}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate font-light">
                            {ch.titleEn}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2 ml-2">
                        <span
                          className={cn(
                            "text-[10px] font-mono px-2 py-0.5 rounded-full border",
                            isComplete
                              ? "bg-emerald-950/80 text-emerald-400 border-emerald-800/60"
                              : isSelected
                              ? "bg-cyan-950/80 text-cyan-300 border-cyan-800/60"
                              : "bg-slate-950 text-slate-500 border-slate-800"
                          )}
                        >
                          {done}/{total} Steps
                        </span>
                        <ChevronRight
                          size={14}
                          className={cn(
                            "transition-transform",
                            isSelected
                              ? "text-cyan-400 translate-x-0.5"
                              : "text-slate-600 group-hover:text-slate-500"
                          )}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>


            {/* Quick Jump to Current Lesson CTA */}
            {onSwitchToWorkspace && (
              <button
                onClick={onSwitchToWorkspace}
                className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>เข้าสู่โหมดห้องเขียนโค้ด (Code Studio)</span>
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            )}
          </div>

          {/* ═════════════════════════════════════════════════════════
              RIGHT COLUMN (Vertical Timeline Steps)
          ═══════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 space-y-6">
            {/* Active Chapter Header Banner */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400">
                  <span>{currentChapter.icon}</span>
                  <span>CHAPTER {currentChapter.number} OF 6</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-500">{currentChapter.badge}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  {currentChapter.title}
                </h2>
                <p className="text-xs text-slate-500 font-light">
                  {currentChapter.description}
                </p>
              </div>

              {/* Chapter Prev / Next Navigation Buttons */}
              <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                <button
                  disabled={activeChapterId === 1}
                  onClick={() => handleChapterChange(activeChapterId - 1)}
                  className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                  title="บทเรียนก่อนหน้า"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-mono text-slate-500 px-2">
                  {activeChapterId} / {chapters.length}
                </span>
                <button
                  disabled={activeChapterId === chapters.length}
                  onClick={() => handleChapterChange(activeChapterId + 1)}
                  className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                  title="บทเรียนถัดไป"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Vertical Timeline Container */}
            <div className="relative pl-12 sm:pl-16 space-y-8">
              {/* Continuous Connected Vertical Timeline Line (Dashed) */}
              <div className="absolute left-6 sm:left-8 top-6 bottom-6 w-0 border-l-2 border-dashed border-slate-300 pointer-events-none" />

              {chapterSteps.map((s, idx) => {
                const status = getStepStatus(s.id);
                const isCompleted = status === "completed";
                const isCurrent = status === "current";
                const isLocked = status === "locked";

                return (
                  <div key={s.id} className="relative group">
                    {/* Node on Vertical Timeline */}
                    <div
                      className={cn(
                        "absolute -left-12 sm:-left-16 top-4 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-black transition-all duration-300 z-10",
                        isCompleted
                          ? "bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/30 shadow-lg shadow-emerald-500/30 group-hover:scale-105 cursor-pointer"
                          : isCurrent
                          ? "bg-gradient-to-tr from-cyan-500 to-blue-600 text-white ring-4 ring-cyan-400/40 shadow-xl shadow-cyan-500/40 group-hover:scale-105 cursor-pointer"
                          : isLocked
                          ? "bg-transparent border-2 border-dashed border-slate-700 text-slate-600 opacity-60 cursor-not-allowed"
                          : "bg-slate-800 border-2 border-cyan-500/50 text-cyan-300 shadow-md group-hover:border-cyan-400 cursor-pointer"
                      )}
                      onClick={() => {
                        if (isLocked) return;
                        onSelectStep(s.id - 1);
                      }}
                    >
                      {/* Current step animated ping pulse ring */}
                      {isCurrent && (
                        <span className="absolute inset-0 rounded-2xl bg-cyan-400 opacity-20 animate-ping pointer-events-none" />
                      )}

                      {isCompleted ? (
                        <CheckCircle2
                          size={24}
                          className="stroke-[2.5] text-slate-950"
                        />
                      ) : isLocked ? (
                        <Lock size={18} className="text-slate-600" />
                      ) : isCurrent ? (
                        <div className="flex flex-col items-center">
                          <Play size={16} className="fill-white" />
                          <span className="text-[10px] font-mono font-extrabold leading-none mt-0.5">
                            {s.id}
                          </span>
                        </div>
                      ) : (
                        <span className="font-mono text-sm font-bold">
                          {s.id}
                        </span>
                      )}
                    </div>

                    {/* 21st.dev Style Lesson Card */}
                    <div
                      onClick={() => {
                        if (isLocked) return;
                        onSelectStep(s.id - 1);
                      }}
                      className={cn(
                        "rounded-2xl border transition-all duration-300 p-5 sm:p-6 backdrop-blur-xl group/card",
                        isCurrent
                          ? "bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-cyan-950/30 border-cyan-500/70 shadow-2xl shadow-cyan-500/15 ring-1 ring-cyan-400/30 hover:border-cyan-400 hover:shadow-cyan-500/20 cursor-pointer"
                          : isCompleted
                          ? "bg-slate-900/75 border-emerald-900/40 hover:border-emerald-500/60 hover:bg-slate-900/90 hover:shadow-xl hover:shadow-emerald-500/10 cursor-pointer"
                          : isLocked
                          ? "bg-slate-950/30 border-dashed border-slate-800/80 opacity-60 cursor-not-allowed"
                          : "bg-slate-900/60 border-slate-800/80 hover:border-cyan-500/50 hover:bg-slate-900/85 hover:shadow-xl hover:shadow-cyan-500/10 cursor-pointer"
                      )}
                    >
                      {/* Top Meta Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border",
                              isCurrent
                                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                                : isCompleted
                                ? "bg-emerald-950/60 text-emerald-400 border-emerald-800/60"
                                : "bg-slate-800 text-slate-500 border-slate-700/60"
                            )}
                          >
                            Step {s.id}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">
                            {s.category}
                          </span>
                        </div>

                        {/* Status Chip */}
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/40">
                            +{s.xp} XP
                          </span>

                          <span
                            className={cn(
                              "px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1",
                              isCompleted
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                : isCurrent
                                ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-extrabold"
                                : isLocked
                                ? "bg-slate-900/80 text-slate-500 border border-dashed border-slate-700/60"
                                : "bg-slate-800 text-slate-300 border border-slate-700"
                            )}
                          >
                            {isCompleted ? (
                              <>
                                <Check size={12} className="stroke-[3]" />
                                <span>Passed ✅</span>
                              </>
                            ) : isCurrent ? (
                              <>
                                <Zap size={12} className="fill-cyan-400" />
                                <span>Current 🚀</span>
                              </>
                            ) : isLocked ? (
                              <>
                                <Lock size={11} />
                                <span>Locked 🔒</span>
                              </>
                            ) : (
                              <span>Unlocked ⚡</span>
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Lesson Titles (Thai + English) */}
                      <div className="space-y-1 mb-3">
                        <h3 className="text-base sm:text-lg font-bold text-white group-hover/card:text-cyan-300 transition-colors">
                          Step {s.id}: {s.title}
                        </h3>
                        <p className="text-xs sm:text-sm font-mono text-slate-500">
                          {s.titleEn}
                        </p>
                      </div>

                      {/* Short Description */}
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                        {s.description}
                      </p>

                      {/* Key Skills Tags */}
                      {s.keySkills && s.keySkills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {s.keySkills.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/50 text-slate-300 text-[11px] font-mono"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Bottom Footer Action Row */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                          <Clock size={13} className="text-slate-500" />
                          <span>~{s.estimatedMinutes} นาที</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-500">{s.difficulty}</span>
                        </div>

                        {/* Action Button */}
                        <button
                          disabled={isLocked}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isLocked) return;
                            onSelectStep(s.id - 1);
                          }}
                          className={cn(
                            "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
                            isCompleted
                              ? "bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 cursor-pointer"
                              : isCurrent
                              ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold shadow-lg shadow-cyan-500/30 group-hover/card:scale-102 cursor-pointer"
                              : isLocked
                              ? "bg-slate-900 border border-dashed border-slate-800 text-slate-600 cursor-not-allowed"
                              : "bg-slate-800 hover:bg-cyan-600 hover:text-white text-cyan-300 border border-cyan-500/40 cursor-pointer"
                          )}
                        >
                          {isCompleted ? (
                            <>
                              <span>Review 🔄</span>
                            </>
                          ) : isCurrent ? (
                            <>
                              <span>Start Lesson 🚀</span>
                              <ArrowRight size={14} />
                            </>
                          ) : isLocked ? (
                            <>
                              <Lock size={12} />
                              <span>Locked 🔒</span>
                            </>
                          ) : (
                            <>
                              <span>Start Lesson 🚀</span>
                              <ArrowRight size={14} />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ═════════════════════════════════════════════════════════
                CERTIFICATE OF ACHIEVEMENT: COMPLETION SECTION
            ═══════════════════════════════════════════════════════════ */}
            <div className="mt-12 pt-8 border-t border-slate-200/80 space-y-6">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50 via-white to-amber-50/40 border-2 border-amber-300/80 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-400/20 shrink-0">
                    <Award size={28} className="text-slate-950" />
                  </div>
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      <span>🎓 OFFICIAL CERTIFICATE</span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900">
                      เกียรติบัตรรับรองความสำเร็จ (Python Mastery)
                    </h3>
                    <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
                      เรียนรู้และผ่านโจทย์ครบทั้ง 6 บทเรียน 24 สเตปย่อย เพื่อปลดล็อกใบประกาศนียบัตรรับรองความสามารถอย่างเป็นทางการ พร้อมสั่งพิมพ์หรือดาวน์โหลด PDF ในขนาด A4 แนวนอนได้ทันที
                    </p>
                  </div>
                </div>

                <div className="shrink-0 w-full md:w-auto text-center md:text-right">
                  <Link
                    href="/certificate"
                    className={cn(
                      "inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-md w-full md:w-auto",
                      completedCount >= totalSteps
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20 ring-4 ring-amber-300 animate-pulse cursor-pointer"
                        : "bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
                    )}
                  >
                    <Award size={16} />
                    <span>
                      {completedCount >= totalSteps
                        ? "รับเกียรติบัตรของคุณ (Claim Now)"
                        : `ดูสถานะเกียรติบัตร (${completedCount}/${totalSteps})`}
                    </span>
                    <ArrowRight size={14} />
                  </Link>
                  <p className="text-[11px] text-slate-400 mt-2">
                    {completedCount >= totalSteps
                      ? "สำเร็จหลักสูตรครบ 100% แล้ว!"
                      : `สำเร็จแล้ว ${Math.round((completedCount / totalSteps) * 100)}%`}
                  </p>
                </div>
              </div>
            </div>

            {/* ═════════════════════════════════════════════════════════
                ARCADE MINI-GAMES SECTION (5 GAMES - UNLOCKED AT CHAPTER 6)
            ═══════════════════════════════════════════════════════════ */}
            {/* ═════════════════════════════════════════════════════════
                GAME ARENA LINK
            ═══════════════════════════════════════════════════════════ */}
            <div className="mt-8 pt-8 border-t border-slate-200/80">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
                    <Gamepad2 size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">PyStep Game Arena</h4>
                    <p className="text-xs text-slate-600">เข้าสู่โซนประลองเกมฝึกทักษะตรรกะและอัลกอริทึม</p>
                  </div>
                </div>
                <Link
                  href="/arena"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <span>เข้าสู่ Game Arena</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
