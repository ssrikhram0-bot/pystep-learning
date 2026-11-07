"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Play,
  Gamepad2,
  Trophy,
  Settings,
  CheckCircle2,
  Lock,
  Sparkles,
  BookOpen,
  Code2,
  Terminal,
  Cpu,
  Layers,
  ArrowRight,
  Flame,
  Zap,
} from "lucide-react";
import { Step, STEPS } from "@/lib/curriculumData";

interface Roadmap24GridViewProps {
  steps?: Step[];
  completedStepIds?: number[];
  currentStepId?: number;
  userName?: string;
  level?: number;
  xp?: number;
  streak?: number;
  onSelectStep: (stepIdx: number) => void;
  onOpenArena?: () => void;
  onOpenCertificate?: () => void;
  onOpenSettings?: () => void;
}

// 24 Steps metadata matching the roadmap image
const ROADMAP_CARD_DATA: Record<
  number,
  {
    icon: string;
    thaiTitle: string;
    codeSnippet: string;
    codeType: "code" | "tags" | "branch";
    tags?: string[];
  }
> = {
  1: { icon: "📖", thaiTitle: "ประวัติความเป็นมาและการติดตั้ง", codeSnippet: "Python", codeType: "code" },
  2: { icon: "</>", thaiTitle: "โครงสร้างภาษาและไวยากรณ์", codeSnippet: "print()\n# comment", codeType: "code" },
  3: { icon: "🧊", thaiTitle: "ตัวแปรและชนิดข้อมูลพื้นฐาน", codeSnippet: "int float\nstr bool", codeType: "tags", tags: ["int", "float", "str", "bool"] },
  4: { icon: "📥", thaiTitle: "รับข้อมูลและแสดงผล", codeSnippet: "name = input()\nprint()", codeType: "code" },
  5: { icon: "🔁", thaiTitle: "การแปลงชนิดข้อมูล", codeSnippet: "int()\nfloat()\nstr()", codeType: "code" },
  6: { icon: "🧮", thaiTitle: "ตัวดำเนินการทางคณิตศาสตร์และตรรกะ", codeSnippet: "+ - * /\n> < and or", codeType: "code" },

  7: { icon: "🔀", thaiTitle: "คำสั่ง if", codeSnippet: "if ...:\n  pass", codeType: "code" },
  8: { icon: "🔀", thaiTitle: "คำสั่ง if-else และ if-elif-else", codeSnippet: "if\nelif\nelse", codeType: "tags", tags: ["if", "elif", "else"] },
  9: { icon: "🔀", thaiTitle: "เงื่อนไขซ้อนเงื่อนไข", codeSnippet: "if:\n  if:\n  else:", codeType: "code" },
  10: { icon: "🔄", thaiTitle: "ลูป while", codeSnippet: "while True:\n  ...", codeType: "code" },
  11: { icon: "🔄", thaiTitle: "ลูป for และ range()", codeSnippet: "for i in range(10):", codeType: "code" },
  12: { icon: "⚡", thaiTitle: "คำสั่ง break และ continue", codeSnippet: "break\ncontinue", codeType: "tags", tags: ["break", "continue"] },

  13: { icon: "💬", thaiTitle: "การจัดการข้อความ", codeSnippet: '"Hello"\n"Python"', codeType: "code" },
  14: { icon: "📋", thaiTitle: "ลำดับข้อมูลและคอลเลกชัน", codeSnippet: "list tuple\nset dict", codeType: "tags", tags: ["list", "tuple", "set", "dict"] },
  15: { icon: "📦", thaiTitle: "ฟังก์ชัน", codeSnippet: "def name():\n  ...", codeType: "code" },
  16: { icon: "↩️", thaiTitle: "การคืนค่าและขอบเขตตัวแปร", codeSnippet: "return x", codeType: "code" },
  17: { icon: "λ", thaiTitle: "ฟังก์ชันแบบ lambda", codeSnippet: "lambda x: x*2", codeType: "code" },
  18: { icon: "⚠️", thaiTitle: "การจัดการข้อผิดพลาด", codeSnippet: "try:\nexcept:", codeType: "code" },

  19: { icon: "🛡️", thaiTitle: "คำสั่ง try-except-else-finally", codeSnippet: "try except\nelse finally", codeType: "tags", tags: ["try", "except", "else", "finally"] },
  20: { icon: "📄", thaiTitle: "การอ่านและเขียนไฟล์", codeSnippet: ".open()\n.read()\n.write()", codeType: "code" },
  21: { icon: "🏗️", thaiTitle: "คลาสและอ็อบเจกต์", codeSnippet: "class Cat:\n  def __init__", codeType: "code" },
  22: { icon: "🌳", thaiTitle: "การสืบทอดและพหุรูปแบบ", codeSnippet: "class Animal:\nclass Dog(Animal):", codeType: "code" },
  23: { icon: "⚙️", thaiTitle: "Thread, Date & Time", codeSnippet: "Thread, Date & Time", codeType: "code" },
  24: { icon: "🏆", thaiTitle: "โปรเจกต์สุดท้ายและสรุปบทเรียน", codeSnippet: "</>", codeType: "code" },
};

export function Roadmap24GridView({
  steps = STEPS,
  completedStepIds = [],
  currentStepId = 1,
  userName = "StarPy Learner",
  level = 1,
  xp = 0,
  streak = 1,
  onSelectStep,
  onOpenArena,
  onOpenCertificate,
  onOpenSettings,
}: Roadmap24GridViewProps) {
  const completedCount = completedStepIds.length;
  const progressPercent = Math.min(100, Math.round((completedCount / 24) * 100));

  return (
    <div className="w-full bg-gradient-to-b from-sky-50/60 via-indigo-50/30 to-purple-50/40 text-slate-800 p-4 sm:p-6 md:p-8 selection:bg-sky-400 selection:text-white rounded-3xl">
      {/* ─────────────────────────────────────────────────────────────
          1. TOP BANNER & USER PROFILE CARD (Exact Roadmap Header)
      ──────────────────────────────────────────────────────────────── */}
      <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-r from-sky-400/90 via-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-500/15 mb-8 p-6 sm:p-8">
        {/* Soft Background Accents */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.2)_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left Title & Mascot Intro */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-4 border-white/60 shadow-lg bg-white/20 shrink-0">
              <Image src="/starpy.jpg" alt="StarPy" fill className="object-cover animate-float-slow" />
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-sky-100 text-xs font-bold border border-white/30">
                <span>🐾 Learn • Practice • Level Up 🐾</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight drop-shadow-sm">
                PyStep <span className="text-amber-300">🐍</span>
              </h1>
              <p className="text-lg sm:text-xl font-bold text-sky-100 tracking-wide">
                Python Learning Journey
              </p>
              <p className="text-xs sm:text-sm text-sky-50/90 max-w-md pt-1">
                เรียน Python จากพื้นฐานสู่ระดับสูง ไปกับน้องแมวสุดน่ารักกันเถอะ! ✨
              </p>
            </div>
          </div>

          {/* Right User Status Card (As in Reference Graphic) */}
          <div className="w-full sm:w-80 bg-slate-900/80 backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4 shrink-0">
            {/* Header: StarPy Lv. & XP Bar */}
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-sky-400 bg-slate-800 shrink-0">
                <Image src="/starpy.jpg" alt="StarPy Avatar" fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-extrabold text-white truncate">{userName || "StarPy"}</span>
                  <span className="font-mono text-sky-300 font-bold">Lv. {level}</span>
                </div>
                {/* XP Progress Bar */}
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                  <div
                    className="bg-gradient-to-r from-sky-400 to-emerald-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (xp % 100))}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>{xp % 100}/100 XP</span>
                  <span>ผ่าน {completedCount}/24 ด่าน ({progressPercent}%)</span>
                </div>
              </div>
            </div>

            {/* Quick Action Navigation Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => onSelectStep(currentStepId ? currentStepId - 1 : 0)}
                className="flex items-center gap-2 p-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 font-bold transition-all active:scale-95 cursor-pointer"
              >
                <Play size={14} className="fill-sky-300" />
                <span>เริ่มเรียน</span>
              </button>

              <button
                onClick={onOpenArena}
                className="flex items-center gap-2 p-2 rounded-xl bg-gradient-to-r from-purple-500/30 to-indigo-500/30 hover:from-purple-500/40 hover:to-indigo-500/40 text-purple-200 border border-purple-400/40 font-bold transition-all active:scale-95 cursor-pointer shadow-xs"
                title="ทำคำถามวัดความรู้ 15 ข้อ"
              >
                <Gamepad2 size={15} className="text-purple-300" />
                <span>คำถามวัดความรู้ 15 ข้อ</span>
              </button>

              <button
                onClick={onOpenCertificate}
                className="flex items-center gap-2 p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold transition-all active:scale-95 cursor-pointer"
              >
                <Trophy size={14} />
                <span>ความสำเร็จ</span>
              </button>

              <button
                onClick={onOpenSettings}
                className="flex items-center gap-2 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold transition-all active:scale-95 cursor-pointer"
              >
                <Settings size={14} />
                <span>ตั้งค่า</span>
              </button>
            </div>

            <div className="text-center pt-1 border-t border-slate-800/80">
              <span className="text-[11px] font-mono text-sky-200/70 tracking-wider">
                ✨ Little Steps • Big Dreams ✨
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. 24 LESSONS GRID (4 Rows x 6 Cols = 24 Cards)
      ──────────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🗺️</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              ผังการเรียนรู้ 24 บทเรียน (Curriculum Roadmap)
            </h2>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
            อ้างอิงหลักสูตร MarcusCode
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3.5 sm:gap-4">
          {steps.slice(0, 24).map((s, idx) => {
            const stepId = s.id;
            const cardMeta = ROADMAP_CARD_DATA[stepId] || {
              icon: "💻",
              thaiTitle: s.title,
              codeSnippet: "code",
              codeType: "code",
            };

            const isCompleted = completedStepIds.includes(stepId);
            const isCurrent = stepId === currentStepId;
            const isUnlocked = isCompleted || stepId === 1 || completedStepIds.includes(stepId - 1);

            return (
              <div
                key={stepId}
                onClick={() => {
                  if (!isUnlocked) return;
                  onSelectStep(idx);
                }}
                className={`group relative rounded-2xl p-3.5 border transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer ${
                  isCurrent
                    ? "bg-white border-sky-400 ring-2 ring-sky-300/60 shadow-lg shadow-sky-500/15 scale-[1.02]"
                    : isCompleted
                    ? "bg-white/95 border-emerald-300 hover:border-emerald-400 hover:shadow-md shadow-xs"
                    : isUnlocked
                    ? "bg-white/90 border-slate-200/90 hover:border-sky-300 hover:shadow-md shadow-xs"
                    : "bg-slate-100/60 border-slate-200/60 opacity-60 cursor-not-allowed"
                }`}
              >
                {/* 1. Top Card Row: Step Number Badge + Title + Stars ★★ */}
                <div className="flex items-center justify-between gap-1.5 mb-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-extrabold flex items-center justify-center shrink-0 shadow-xs ${
                        isCompleted
                          ? "bg-emerald-500 text-white"
                          : isCurrent
                          ? "bg-sky-500 text-white ring-2 ring-sky-200"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {stepId}
                    </span>
                    <span className="font-extrabold text-xs text-slate-800 truncate group-hover:text-sky-600 transition-colors">
                      {s.titleEn.split(",")[0].split("&")[0].trim()}
                    </span>
                  </div>

                  <div className="flex items-center text-amber-400 text-[11px] shrink-0">
                    <span>★★</span>
                  </div>
                </div>

                {/* 2. Middle Visual Box: Mascot Screen Illustration */}
                <div className="relative w-full aspect-[4/3] rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950 p-2.5 overflow-hidden flex flex-col justify-between text-white shadow-inner my-1.5">
                  {/* Subtle inner grid lines */}
                  <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:12px_12px] opacity-20 pointer-events-none" />

                  {/* Top corner mini mascot face */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-white/40 shadow-xs shrink-0">
                      <Image src="/starpy.jpg" alt="StarPy" fill className="object-cover" />
                    </div>
                    <span className="text-[10px] font-mono text-sky-300/80 uppercase">
                      Ch.{s.chapterId}
                    </span>
                  </div>

                  {/* Center Code Display Box on Screen */}
                  <div className="relative z-10 my-auto text-center py-1">
                    {cardMeta.codeType === "tags" && cardMeta.tags ? (
                      <div className="flex flex-wrap gap-1 justify-center">
                        {cardMeta.tags.map((t, tidx) => (
                          <span
                            key={tidx}
                            className="px-1.5 py-0.5 rounded bg-sky-500/20 border border-sky-400/40 text-[9px] font-mono font-bold text-sky-200"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <pre className="font-mono text-[10px] sm:text-[11px] text-sky-300 font-bold leading-tight">
                        {cardMeta.codeSnippet}
                      </pre>
                    )}
                  </div>

                  {/* Bottom Monitor Frame Line */}
                  <div className="relative z-10 flex items-center justify-between text-[9px] text-slate-400 pt-1 border-t border-slate-800">
                    <span className="font-mono">{s.category}</span>
                    <span className="text-amber-400 font-mono">+{s.xp} XP</span>
                  </div>
                </div>

                {/* 3. Bottom Row: Thai Title & Icon + Status Indicator */}
                <div className="pt-1.5 flex items-center justify-between gap-1 text-[11px]">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-sm shrink-0">{cardMeta.icon}</span>
                    <span className="text-slate-600 font-semibold truncate leading-tight">
                      {cardMeta.thaiTitle}
                    </span>
                  </div>

                  {/* Status Indicator Badge */}
                  <div className="shrink-0">
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-0.5 text-emerald-600 font-bold text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                        <CheckCircle2 size={11} className="stroke-[2.5]" />
                        <span>ผ่าน</span>
                      </span>
                    ) : isCurrent ? (
                      <span className="inline-flex items-center gap-0.5 text-sky-600 font-bold text-[10px] bg-sky-50 px-1.5 py-0.5 rounded-md border border-sky-200 animate-pulse">
                        <Play size={9} className="fill-sky-600" />
                        <span>ลุยต่อ</span>
                      </span>
                    ) : isUnlocked ? (
                      <span className="inline-flex items-center gap-0.5 text-slate-500 font-semibold text-[10px] bg-slate-100 px-1.5 py-0.5 rounded-md">
                        <span>เริ่ม</span>
                      </span>
                    ) : (
                      <span className="text-slate-400" title="ต้องผ่านด่านก่อนหน้า">
                        <Lock size={12} />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. BOTTOM INSPIRATIONAL FOOTER (Exact Match with Image)
      ──────────────────────────────────────────────────────────────── */}
      <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500">
          <span>🐾</span>
          <span className="italic">
            &ldquo;... ทุกก้าวเล็กๆ คือก้าวสำคัญ สู่อนาคตที่ยิ่งใหญ่ ...&rdquo;
          </span>
          <span>🐾</span>
        </div>

        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-sky-600">
          <span>You can do it! ❤️</span>
        </div>
      </div>
    </div>
  );
}
