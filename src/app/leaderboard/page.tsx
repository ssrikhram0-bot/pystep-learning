"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Trophy,
  Award,
  Flame,
  CheckCircle2,
  Search,
  ArrowLeft,
  Sparkles,
  Crown,
  Medal,
  ChevronRight,
  TrendingUp,
  User,
  ShieldCheck,
  Zap,
  BookOpen,
  Filter,
} from "lucide-react";

interface LeaderboardUser {
  id: string;
  name: string;
  mascot: string;
  xp: number;
  streak: number;
  level: number;
  role: string;
  completedSteps: number;
  isCertified: boolean;
  rank: number;
}

interface ApiResponse {
  success: boolean;
  totalLearners: number;
  certifiedCount: number;
  podium: LeaderboardUser[];
  leaderboard: LeaderboardUser[];
  currentUser: LeaderboardUser | null;
}

const MASCOT_MAP: Record<
  string,
  { name: string; avatar: string; emoji: string; color: string; badge: string }
> = {
  StarPy: {
    name: "StarPy",
    avatar: "/starpy.jpg",
    emoji: "🐱",
    color: "from-cyan-400 to-blue-600",
    badge: "Personal AI Mentor",
  },
  FoxPy: {
    name: "FoxPy",
    avatar: "/mascot2.jpg",
    emoji: "🦊",
    color: "from-orange-400 to-amber-500",
    badge: "Algorithm Champion",
  },
  PandaPy: {
    name: "PandaPy",
    avatar: "/mascot3.jpg",
    emoji: "🐼",
    color: "from-emerald-400 to-teal-600",
    badge: "Cyber Tank",
  },
  BunnyCode: {
    name: "BunnyCode",
    avatar: "/mascot4.jpg",
    emoji: "🐰",
    color: "from-pink-400 to-rose-500",
    badge: "Speed Runner",
  },
  OwlLog: {
    name: "OwlLog",
    avatar: "/mascot5.jpg",
    emoji: "🦉",
    color: "from-indigo-400 to-purple-600",
    badge: "Logic Grandmaster",
  },
  BearStack: {
    name: "BearStack",
    avatar: "/mascot6.jpg",
    emoji: "🐻",
    color: "from-amber-600 to-stone-700",
    badge: "System Architect",
  },
  KoalaByte: {
    name: "KoalaByte",
    avatar: "/mascot7.jpg",
    emoji: "🐨",
    color: "from-teal-400 to-cyan-700",
    badge: "Data Sentinel",
  },
  PixelPup: {
    name: "PixelPup",
    avatar: "/mascot8.jpg",
    emoji: "🐶",
    color: "from-violet-400 to-purple-600",
    badge: "Frontend Wizard",
  },
};

export default function LeaderboardPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"xp" | "streak" | "steps">("xp");
  const [filterType, setFilterType] = useState<"all" | "completed">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          sort: sortBy,
          filter: filterType,
          search: search.trim(),
        });
        const res = await fetch(`/api/leaderboard?${query.toString()}`);
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      } catch (e) {
        console.error("Failed to fetch leaderboard", e);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchLeaderboard();
    }, 200);

    return () => clearTimeout(timer);
  }, [sortBy, filterType, search]);

  const top3 = useMemo(() => {
    return data?.podium || [];
  }, [data]);

  const listUsers = useMemo(() => {
    return data?.leaderboard || [];
  }, [data]);

  const getMascotInfo = (mascotKey: string) => {
    return (
      MASCOT_MAP[mascotKey] || {
        name: mascotKey || "StarPy",
        avatar: "/starpy.jpg",
        emoji: "🐱",
        color: "from-sky-400 to-blue-600",
        badge: "Python Pioneer",
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#070b19] text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-sans pb-28">
      {/* ─────────────────────────────────────────────────────────────
          1. TOP NAVIGATION
      ──────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-indigo-500/15 bg-[#070b19]/90 backdrop-blur-md px-4 sm:px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
              title="กลับสู่หน้าแรก"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 via-amber-500 to-yellow-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/25">
                <Trophy size={20} className="fill-slate-950" />
              </div>
              <div>
                <h1 className="font-black text-base tracking-tight text-white flex items-center gap-2">
                  กระดานผู้นำ PyStep Leaderboard
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30">
                    Season 1
                  </span>
                </h1>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  จัดอันดับผู้เรียนยอดเยี่ยมตามคะแนน XP ความสม่ำเสมอ และบทเรียนที่พิชิต
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/certificate"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-amber-500/20 text-xs text-amber-300 hover:bg-slate-800 transition-all"
            >
              <Award size={14} />
              <span>เกียรติบัตร</span>
            </Link>
            <Link
              href="/learn"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95"
            >
              <span>เข้าสู่ห้องเรียน</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO BANNER
      ──────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-8 pb-10 px-4 sm:px-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px]" />
          <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-sky-500/10 rounded-full blur-[90px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Sparkles size={14} className="animate-spin text-amber-400" />
            <span>Hall of Fame • ทำเนียบยอดนักโค้ดไพธอน</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-3">
            กระดานเกียรติยศผู้เรียน{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300">
              PyStep
            </span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            สะสม XP ผ่านการเรียนบทเรียน 24 สเตป ตอบคำถาม และรักษาระดับ Streak
            เพื่อก้าวขึ้นสู่จุดสูงสุดบนตารางผู้นำระดับประเทศ!
          </p>

          {/* Quick Stats Counter */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto mt-6">
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-indigo-500/20 backdrop-blur-sm">
              <div className="text-xs text-slate-400">ผู้เรียนทั้งหมด</div>
              <div className="text-lg sm:text-xl font-black text-sky-400 font-mono">
                {data ? data.totalLearners.toLocaleString() : "..."} คน
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-indigo-500/20 backdrop-blur-sm">
              <div className="text-xs text-slate-400">จบครบ 24 บท</div>
              <div className="text-lg sm:text-xl font-black text-amber-400 font-mono">
                {data ? data.certifiedCount.toLocaleString() : "..."} คน
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-slate-900/80 border border-indigo-500/20 backdrop-blur-sm">
              <div className="text-xs text-slate-400">รางวัลสูงสุด</div>
              <div className="text-lg sm:text-xl font-black text-emerald-400 font-mono">
                เกียรติบัตรทองคำ
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. PODIUM (TOP 3 CHAMPIONS)
      ──────────────────────────────────────────────────────────────── */}
      {top3.length >= 3 && !search && filterType === "all" && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-12">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end pt-8">
            {/* 🥈 Rank 2 (Silver) */}
            <div className="flex flex-col items-center">
              <div className="relative mb-2 group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-1 bg-gradient-to-tr from-slate-400 to-slate-200 shadow-lg shadow-slate-400/20 overflow-hidden relative">
                  <Image
                    src={getMascotInfo(top3[1]?.mascot).avatar}
                    alt={top3[1]?.name || "Rank 2"}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-300 text-slate-950 font-black text-xs px-2 py-0.5 rounded-full shadow-md border border-white flex items-center gap-0.5">
                  🥈 #2
                </div>
              </div>
              <div className="text-center w-full px-1">
                <div className="font-bold text-xs sm:text-sm text-slate-200 truncate">
                  {top3[1]?.name}
                </div>
                <div className="text-[11px] font-mono font-bold text-sky-400">
                  {top3[1]?.xp.toLocaleString()} XP
                </div>
              </div>
              {/* Pedestal 2 */}
              <div className="w-full h-24 sm:h-28 mt-2 rounded-t-2xl bg-gradient-to-b from-slate-700/60 to-slate-800/40 border-t-2 border-slate-400 flex flex-col items-center justify-center p-2 backdrop-blur-sm">
                <Medal size={20} className="text-slate-300 mb-1" />
                <span className="text-[10px] text-slate-400 font-mono">
                  ผ่าน {top3[1]?.completedSteps}/24 บท
                </span>
                <span className="text-[10px] text-amber-300 font-mono flex items-center gap-1">
                  <Flame size={11} fill="currentColor" /> {top3[1]?.streak} วัน
                </span>
              </div>
            </div>

            {/* 🥇 Rank 1 (Gold / Champion) */}
            <div className="flex flex-col items-center -translate-y-4">
              <div className="relative mb-2 group">
                {/* Crown */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-amber-400 animate-bounce">
                  <Crown size={28} fill="currentColor" />
                </div>
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl p-1.5 bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 shadow-xl shadow-amber-500/30 overflow-hidden relative ring-4 ring-amber-400/30">
                  <Image
                    src={getMascotInfo(top3[0]?.mascot).avatar}
                    alt={top3[0]?.name || "Rank 1"}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full shadow-lg border border-yellow-200 flex items-center gap-0.5">
                  🥇 #1
                </div>
              </div>
              <div className="text-center w-full px-1">
                <div className="font-black text-sm sm:text-base text-yellow-300 truncate flex items-center justify-center gap-1">
                  <span>{top3[0]?.name}</span>
                </div>
                <div className="text-xs sm:text-sm font-mono font-black text-amber-400">
                  {top3[0]?.xp.toLocaleString()} XP
                </div>
              </div>
              {/* Pedestal 1 */}
              <div className="w-full h-32 sm:h-36 mt-2 rounded-t-2xl bg-gradient-to-b from-amber-500/30 to-slate-800/60 border-t-4 border-amber-400 flex flex-col items-center justify-center p-2 backdrop-blur-md shadow-lg shadow-amber-500/10">
                <Trophy size={24} className="text-amber-400 mb-1" />
                <span className="text-[11px] font-bold text-amber-200 font-mono">
                  CHAMPION
                </span>
                <span className="text-[10px] text-slate-300 font-mono">
                  ผ่าน {top3[0]?.completedSteps}/24 บท
                </span>
                <span className="text-[10px] text-amber-300 font-mono flex items-center gap-1">
                  <Flame size={11} fill="currentColor" /> {top3[0]?.streak} วัน
                </span>
              </div>
            </div>

            {/* 🥉 Rank 3 (Bronze) */}
            <div className="flex flex-col items-center">
              <div className="relative mb-2 group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-1 bg-gradient-to-tr from-amber-700 to-amber-600 shadow-lg shadow-amber-800/20 overflow-hidden relative">
                  <Image
                    src={getMascotInfo(top3[2]?.mascot).avatar}
                    alt={top3[2]?.name || "Rank 3"}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-700 text-amber-100 font-black text-xs px-2 py-0.5 rounded-full shadow-md border border-amber-500 flex items-center gap-0.5">
                  🥉 #3
                </div>
              </div>
              <div className="text-center w-full px-1">
                <div className="font-bold text-xs sm:text-sm text-slate-200 truncate">
                  {top3[2]?.name}
                </div>
                <div className="text-[11px] font-mono font-bold text-sky-400">
                  {top3[2]?.xp.toLocaleString()} XP
                </div>
              </div>
              {/* Pedestal 3 */}
              <div className="w-full h-20 sm:h-24 mt-2 rounded-t-2xl bg-gradient-to-b from-amber-900/40 to-slate-800/40 border-t-2 border-amber-600 flex flex-col items-center justify-center p-2 backdrop-blur-sm">
                <Medal size={20} className="text-amber-500 mb-1" />
                <span className="text-[10px] text-slate-400 font-mono">
                  ผ่าน {top3[2]?.completedSteps}/24 บท
                </span>
                <span className="text-[10px] text-amber-300 font-mono flex items-center gap-1">
                  <Flame size={11} fill="currentColor" /> {top3[2]?.streak} วัน
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. CONTROLS (TABS & SEARCH)
      ──────────────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/90 border border-indigo-500/20 backdrop-blur-md">
          {/* Sort Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => {
                setSortBy("xp");
                setFilterType("all");
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                sortBy === "xp" && filterType === "all"
                  ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Trophy size={13} />
              <span>XP สูงสุด</span>
            </button>
            <button
              onClick={() => {
                setSortBy("streak");
                setFilterType("all");
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                sortBy === "streak" && filterType === "all"
                  ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Flame size={13} />
              <span>เรียนต่อเนื่อง</span>
            </button>
            <button
              onClick={() => {
                setFilterType("completed");
                setSortBy("xp");
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                filterType === "completed"
                  ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Award size={13} />
              <span>จบ 24 บทแล้ว</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[200px]">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="ค้นหาชื่อผู้เรียน..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950/80 border border-slate-800 focus:border-amber-400 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. LEADERBOARD LIST
      ──────────────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900/60 border border-indigo-500/20 rounded-3xl overflow-hidden backdrop-blur-md">
          {/* Header Row */}
          <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-indigo-500/15 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            <div className="col-span-2 sm:col-span-1 text-center">อันดับ</div>
            <div className="col-span-6 sm:col-span-5">ผู้เรียน & มาสคอต</div>
            <div className="col-span-4 sm:col-span-2 text-right sm:text-center">
              บทเรียนที่ผ่าน
            </div>
            <div className="hidden sm:block sm:col-span-2 text-center">
              Streak
            </div>
            <div className="hidden sm:block sm:col-span-2 text-right">
              คะแนน XP
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-2">
              <Sparkles size={24} className="animate-spin text-amber-400" />
              <p className="text-xs">กำลังโหลดข้อมูลกระดานเกียรติยศ...</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && listUsers.length === 0 && (
            <div className="py-16 text-center text-slate-400">
              <p className="text-sm font-semibold text-slate-300">
                ไม่พบรายชื่อผู้เรียนที่ตรงกับคำค้นหา
              </p>
              <p className="text-xs text-slate-500 mt-1">
                ลองค้นหาด้วยคำอื่น หรือกดรีเซ็ตการค้นหา
              </p>
            </div>
          )}

          {/* User Rows */}
          {!loading &&
            listUsers.map((learner) => {
              const mascot = getMascotInfo(learner.mascot);
              const isTop3 = learner.rank <= 3;
              const isCurrentUser = data?.currentUser?.id === learner.id;

              return (
                <div
                  key={learner.id}
                  className={`grid grid-cols-12 gap-2 items-center px-4 py-3 border-b border-slate-800/60 hover:bg-slate-800/40 transition-colors ${
                    isCurrentUser
                      ? "bg-amber-500/10 border-l-4 border-l-amber-400"
                      : ""
                  }`}
                >
                  {/* Rank Column */}
                  <div className="col-span-2 sm:col-span-1 text-center flex items-center justify-center">
                    {learner.rank === 1 && (
                      <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 font-black text-xs flex items-center justify-center shadow-md shadow-amber-400/20">
                        1
                      </span>
                    )}
                    {learner.rank === 2 && (
                      <span className="w-7 h-7 rounded-full bg-slate-300 text-slate-950 font-black text-xs flex items-center justify-center shadow-sm">
                        2
                      </span>
                    )}
                    {learner.rank === 3 && (
                      <span className="w-7 h-7 rounded-full bg-amber-700 text-amber-100 font-black text-xs flex items-center justify-center shadow-sm">
                        3
                      </span>
                    )}
                    {learner.rank > 3 && (
                      <span className="font-mono text-xs font-bold text-slate-400">
                        #{learner.rank}
                      </span>
                    )}
                  </div>

                  {/* Learner Info Column */}
                  <div className="col-span-6 sm:col-span-5 flex items-center gap-3">
                    <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0 border border-slate-700">
                      <Image
                        src={mascot.avatar}
                        alt={learner.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-xs sm:text-sm text-slate-200 truncate">
                          {learner.name}
                        </span>
                        {isCurrentUser && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-400 text-slate-950">
                            คุณ
                          </span>
                        )}
                        {learner.isCertified && (
                          <span
                            title="ผ่านครบ 24 บท ได้รับเกียรติบัตรแล้ว"
                            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-medium"
                          >
                            <CheckCircle2 size={10} className="text-emerald-400" />
                            <span>จบ 24 บท</span>
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2">
                        <span>{mascot.name}</span>
                        <span>•</span>
                        <span className="text-sky-400 font-mono">
                          Lv.{learner.level}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Column */}
                  <div className="col-span-4 sm:col-span-2 text-right sm:text-center">
                    <div className="inline-flex flex-col items-end sm:items-center">
                      <span className="text-xs font-mono font-bold text-slate-200">
                        {learner.completedSteps}/24 บท
                      </span>
                      <span className="text-[10px] text-amber-400 font-mono sm:hidden">
                        {learner.xp.toLocaleString()} XP
                      </span>
                      <div className="w-16 sm:w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              (learner.completedSteps / 24) * 100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Streak Column */}
                  <div className="hidden sm:flex sm:col-span-2 items-center justify-center">
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono font-bold">
                      <Flame size={13} fill="currentColor" />
                      <span>{learner.streak} วัน</span>
                    </div>
                  </div>

                  {/* XP Column */}
                  <div className="hidden sm:block sm:col-span-2 text-right">
                    <div className="font-mono font-black text-sm text-sky-400">
                      {learner.xp.toLocaleString()}{" "}
                      <span className="text-[10px] font-sans text-slate-400">
                        XP
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. CURRENT LOGGED IN USER STICKY POSITION
      ──────────────────────────────────────────────────────────────── */}
      {data?.currentUser && (
        <aside aria-label="อันดับของคุณ" className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-30">
          <div className="bg-gradient-to-r from-[#0d1633] via-[#101e47] to-[#0d1633] border-2 border-amber-400/70 rounded-2xl p-3.5 shadow-2xl shadow-amber-500/20 backdrop-blur-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center shadow-md">
                #{data.currentUser.rank}
              </div>
              <div>
                <div className="text-xs text-amber-300 font-semibold flex items-center gap-1.5">
                  <User size={13} />
                  <span>ตำแหน่งปัจจุบันของคุณ: {data.currentUser.name}</span>
                </div>
                <div className="text-xs text-slate-300 font-mono mt-0.5">
                  <span className="text-sky-300 font-bold">
                    {data.currentUser.xp.toLocaleString()} XP
                  </span>{" "}
                  • ผ่าน{" "}
                  <span className="text-white font-bold">
                    {data.currentUser.completedSteps}/24
                  </span>{" "}
                  บท • ไฟแรง {data.currentUser.streak} วัน
                </div>
              </div>
            </div>

            <Link
              href="/learn"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs transition-all shadow-md active:scale-95 whitespace-nowrap flex items-center gap-1"
            >
              <span>เรียนต่อเพื่อไต่อันดับ</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </aside>
      )}
    </div>
  );
}
