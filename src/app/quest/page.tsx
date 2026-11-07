"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Gamepad2, Award } from "lucide-react";
import { StarPy3DQuestGame } from "@/components/game/StarPy3DQuestGame";

export default function QuestStandalonePage() {
  return (
    <div className="min-h-screen bg-[#050914] text-slate-100 flex flex-col justify-between selection:bg-sky-500 selection:text-slate-950 font-sans">
      {/* Top Header */}
      <header className="relative z-20 border-b border-indigo-500/20 bg-[#070c1d]/90 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/arena"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
              title="กลับสู่ Game Arena"
            >
              <ArrowLeft size={18} />
            </Link>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-sky-500/20">
                <Gamepad2 size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-black text-base tracking-tight text-white">
                    StarPy Python Quest (3D)
                  </h1>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    15 STAGES + BOSS
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  หมุนตัวน้องแมว 360° ตอบคำถาม Python และพิชิตบอส
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/arena"
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold transition-all"
            >
              Game Arena
            </Link>
            <Link
              href="/learn"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-slate-950 font-black text-xs transition-all shadow-md active:scale-95"
            >
              ห้องเรียน 24 บท
            </Link>
          </div>
        </div>
      </header>

      {/* Main 3D Game Area */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 md:py-8">
        <StarPy3DQuestGame />
      </main>

      {/* Footer */}
      <footer className="border-t border-indigo-500/10 bg-[#040711] px-6 py-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>StarPy Python Quest — 3D Three.js Interactive EdTech Game</span>
        <div className="flex items-center gap-4">
          <Link href="/arena" className="hover:text-sky-300 transition-colors">
            Game Arena
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
