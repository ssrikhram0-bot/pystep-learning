"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Gamepad2 } from "lucide-react";
import { StarPy3DQuestGame } from "@/components/game/StarPy3DQuestGame";
import { useGame } from "@/context/GameContext";

export default function GameArenaPage() {
  const {
    completedSteps,
    setCompletedSteps,
    setUserName,
    setXp,
    setLevel,
    setLoading,
  } = useGame();

  const [userEmail, setUserEmail] = React.useState<string | null>(null);

  // Fetch Current User Progress from API and populate context
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUserName(data.user.name || "Learner");
          setUserEmail(data.user.email || data.user.id || null);
          setCompletedSteps(data.user.completedStepIds || []);
          setXp(data.user.xp || 0);
          setLevel(data.user.level || 1);
        }
      } catch (e) {
        console.error("Error loading user in arena:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [setCompletedSteps, setLevel, setLoading, setUserName, setXp]);

  return (
    <div className="min-h-screen bg-[#050914] text-slate-100 flex flex-col justify-between selection:bg-sky-500 selection:text-slate-950 font-sans">
      {/* ─────────────────────────────────────────────────────────────
          1. TOP NAVIGATION
      ──────────────────────────────────────────────────────────────── */}
      <header className="relative z-20 border-b border-indigo-500/20 bg-[#070c1d]/90 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/learn"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
              title="กลับสู่ห้องเรียน"
            >
              <ArrowLeft size={18} />
            </Link>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-sky-500/20">
                <Gamepad2 size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-black text-base tracking-tight text-white">
                    PyStep: StarPy 3D Quest
                  </h1>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    คำถามวัดความรู้ 15 ข้อ
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  คำถามวัดความรู้ Python 15 ข้อในรูปแบบเกม 3D กับน้องแมว StarPy
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-indigo-500/20 text-xs font-mono">
              <span className="text-slate-400">เรียนผ่าน:</span>
              <span className="font-bold text-sky-400">{completedSteps.length}/24 บท</span>
            </div>

            <Link
              href="/learn"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-slate-950 font-black text-xs transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <span>ห้องเรียน 24 บท</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN GAME ARENA (STARPY 3D QUEST: 15 STAGES & BOSS)
      ──────────────────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 md:py-8">
        <StarPy3DQuestGame userEmail={userEmail} />
      </main>

      {/* ─────────────────────────────────────────────────────────────
          3. FOOTER
      ──────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-indigo-500/10 bg-[#040711] px-6 py-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>PyStep Game Arena — StarPy 3D Quest (15 ด่าน & บอส)</span>
        <div className="flex items-center gap-4">
          <Link href="/quest" className="hover:text-sky-300 transition-colors">
            StarPy 3D Quest
          </Link>
          <Link href="/learn" className="hover:text-sky-300 transition-colors">
            ห้องเรียน 24 บทเรียน
          </Link>
          <Link href="/certificate" className="hover:text-sky-300 transition-colors">
            ใบประกาศนียบัตร
          </Link>
        </div>
      </footer>
    </div>
  );
}
