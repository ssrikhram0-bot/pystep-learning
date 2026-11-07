"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Code2,
  Sparkles,
  ArrowRight,
  Terminal,
  Layers,
  CheckCircle,
  X,
  Play,
  LogIn,
  Zap,
  ShieldCheck,
  Award,
  Gamepad2,
  HelpCircle,
  Menu,
} from "lucide-react";
import { PremiumAuthForm } from "@/components/ui/premium-auth";
import CheatSheetModal from "@/components/ui/CheatSheetModal";


export default function Home() {
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bubbleTextIndex, setBubbleTextIndex] = useState(0);
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const musicIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Lo-fi ambient BGM using Web Audio API
  const startMusic = useCallback(() => {
    if (audioCtxRef.current) return;
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.12;
    masterGain.connect(ctx.destination);
    gainNodeRef.current = masterGain;

    // Pentatonic scale notes (relaxing)
    const notes = [261.6, 293.7, 329.6, 392.0, 440.0, 523.3, 587.3, 659.3];
    let noteIndex = 0;

    const playNote = () => {
      if (!audioCtxRef.current) return;
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      osc.type = "sine";
      const freq = notes[noteIndex % notes.length];
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Soft fade in/out
      noteGain.gain.setValueAtTime(0, ctx.currentTime);
      noteGain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
      noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc.connect(noteGain);
      noteGain.connect(masterGain);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1.3);

      noteIndex = (noteIndex + 1) % notes.length;
    };

    playNote();
    musicIntervalRef.current = setInterval(playNote, 1400);
  }, []);

  const stopMusic = useCallback(() => {
    if (musicIntervalRef.current) {
      clearInterval(musicIntervalRef.current);
      musicIntervalRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    gainNodeRef.current = null;
  }, []);

  // Sync music state
  useEffect(() => {
    if (musicOn) {
      startMusic();
    } else {
      stopMusic();
    }
    return () => stopMusic();
  }, [musicOn, startMusic, stopMusic]);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; role: string } | null>(null);

  // Check login state
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(!!(data.authenticated && data.user));
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, []);

  const speechMessages = [
    "Hi, I'm StarPy! พร้อมลุย Python หรือยัง! 🌟",
    "เขียนโค้ดบรรทัดแรกไปด้วยกันนะ! 🚀",
    "ไม่ต้องติดตั้งอะไร รันบนเว็บได้ทันที! ⚡",
    "มีภารกิจและโจทย์สนุกๆ รออยู่เพียบ! ⭐",
  ];

  // Rotate speech bubble every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setBubbleTextIndex((prev) => (prev + 1) % speechMessages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [speechMessages.length]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsAuthModalOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 overflow-hidden selection:bg-emerald-500 selection:text-white flex flex-col justify-between">
      {/* ─────────────────────────────────────────────────────────────
          1. 3D WIREFRAME GRID BACKGROUND (Light Minimal Tech/Game Style)
      ──────────────────────────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Soft Ambient Glows */}
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-violet-400/10 rounded-full blur-3xl" />

        {/* 2D subtle grid overlay for entire screen */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* 3D Perspective Wireframe Floor Grid at Bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[480px] origin-bottom overflow-hidden"
          style={{
            perspective: "800px",
          }}
        >
          <div
            className="absolute inset-x-[-50%] bottom-[-80px] h-[750px] opacity-[0.14]"
            style={{
              transform: "rotateX(72deg)",
              transformOrigin: "50% 100%",
              backgroundImage: `
                linear-gradient(to right, #0284c7 1.5px, transparent 1.5px),
                linear-gradient(to bottom, #059669 1.5px, transparent 1.5px)
              `,
              backgroundSize: "60px 60px",
              maskImage:
                "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 45%, transparent 95%)",
              WebkitMaskImage:
                "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 45%, transparent 95%)",
            }}
          />
        </div>

        {/* Subtle Tech Crosshairs / Coordinates */}
        <div className="absolute top-28 left-12 text-[10px] font-mono text-slate-300 hidden lg:block tracking-widest">
          + GRID_X: 104.2 // Y: 290.8
        </div>
        <div className="absolute top-44 right-16 text-[10px] font-mono text-slate-300 hidden lg:block tracking-widest">
          // SYS_STATUS: OPERATIONAL
        </div>
        <div className="absolute bottom-16 left-16 text-[10px] font-mono text-slate-300 hidden lg:block tracking-widest">
          + LATENCY: 0.12ms // ENGINE: PY3.12
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          NAVBAR HEADER
      ──────────────────────────────────────────────────────────────── */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 via-blue-950 to-indigo-900 flex items-center justify-center shadow-md shadow-blue-900/10 transition-transform group-hover:scale-105">
            <Code2 size={20} className="text-emerald-400" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                PyStep
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 tracking-wider">
                HUB
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              Python Learning & Game
            </span>
          </div>
        </Link>

        {/* Center Nav Badges / Quick Links */}
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-600">
          <Link
            href="/learn"
            className="hover:text-slate-900 transition-colors flex items-center gap-1.5"
          >
            <Layers size={15} className="text-blue-500" />
            บทเรียน 24 สเตป
          </Link>
          <Link
            href="/arena"
            className="hover:text-slate-900 transition-colors flex items-center gap-1.5"
          >
            <Gamepad2 size={15} className="text-purple-500" />
            เกม 3D Quest
          </Link>
          <Link
            href="/certificate"
            className="hover:text-slate-900 transition-colors flex items-center gap-1.5"
          >
            <Award size={15} className="text-amber-500" />
            รับเกียรติบัตร
          </Link>
          <Link
            href="/leaderboard"
            className="hover:text-slate-900 transition-colors flex items-center gap-1.5"
          >
            <Award size={15} className="text-amber-500" />
            Leaderboard
          </Link>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {currentUser?.role === "admin" && (
                <Link
                  href="/admin"
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white transition-all shadow-md active:scale-95"
                >
                  <ShieldCheck size={16} />
                  <span>Admin</span>
                </Link>
              )}
              <Link
                href="/learn"
                className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-sm active:scale-95"
              >
                <Play size={14} className="fill-white" />
                <span>เข้าห้องเรียน</span>
              </Link>
            </div>
          ) : (
            <>
              <Link
                href="/auth?mode=signin"
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-950 hover:bg-white/80 rounded-xl border border-slate-200/80 shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
              >
                <LogIn size={15} />
                <span>Sign In</span>
              </Link>
              <Link
                href="/auth?mode=signup"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-sm active:scale-95"
              >
                <Play size={14} className="fill-white" />
                <span>สมัครสมาชิก</span>
              </Link>
            </>
          )}

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden relative z-30 px-4 pb-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xl p-4 space-y-2">
            <Link
              href="/learn"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
            >
              <Layers size={18} className="text-emerald-600" />
              <span>บทเรียน 24 สเต็ป (Python)</span>
            </Link>
            <Link
              href="/arena"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-purple-50 hover:text-purple-700 transition-colors"
            >
              <Gamepad2 size={18} className="text-purple-600" />
              <span>เกม 3 มิติ (StarPy 3D Quest)</span>
            </Link>
            <Link
              href="/certificate"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-amber-50 hover:text-amber-700 transition-colors"
            >
              <Award size={18} className="text-amber-500" />
              <span>รับเกียรติบัตร (Certificate)</span>
            </Link>
            <Link
              href="/leaderboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-sky-50 hover:text-sky-700 transition-colors"
            >
              <Award size={18} className="text-sky-500" />
              <span>กระดานเกียรติยศ (Leaderboard)</span>
            </Link>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setShowCheatSheet(true);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <HelpCircle size={15} />
                <span>Cheat Sheet</span>
              </button>
              <button
                onClick={() => setMusicOn((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  musicOn ? "bg-indigo-100 text-indigo-700 font-bold" : "bg-slate-100 text-slate-600"
                }`}
              >
                <span>{musicOn ? "🔊 Music On" : "🔇 Music Off"}</span>
              </button>
            </div>
            {!isAuthenticated && (
              <Link
                href="/auth?mode=signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full mt-2 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-center text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Play size={13} className="fill-slate-950" />
                <span>สมัครสมาชิกเรียนฟรี</span>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          HERO SECTION (TWO-COLUMN MASCOT HERO LAYOUT)
      ──────────────────────────────────────────────────────────────── */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 md:py-12 flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center w-full">
          {/* ─────────────────────────────────────────────────────────
              2. ฝั่งซ้าย (Hero Content & Typography)
          ──────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            {/* Pop Tech Badges */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/25 text-xs font-mono font-bold tracking-wide shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                {"{STEP BY STEP}"}
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 border border-blue-500/25 text-xs font-mono font-bold tracking-wide shadow-xs">
                <Terminal size={12} className="text-blue-600" />
                {"[LIVE EDITOR]"}
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-700 border border-violet-500/25 text-xs font-mono font-bold tracking-wide shadow-xs">
                <span>🎮</span> MINI-GAME
              </span>

              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-800 border border-amber-500/20 text-xs font-mono font-semibold">
                <Zap size={11} className="text-amber-500 fill-amber-500" />
                FAST TRACK
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] text-slate-900 uppercase">
                PYTHON CODE <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 bg-clip-text text-transparent">
                  LEARNING & GAME
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-xl font-normal leading-relaxed pt-2">
                เริ่มต้นเขียนโค้ดภาษา Python สนุกเหมือนเล่นเกม ผ่านระบบบทเรียนทีละสเต็ป 
                ทดลองพิมพ์และรันโค้ดจริงในเบราว์เซอร์ พร้อมเฉลยและระบบตรวจผลลัพธ์ทันที!
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl pt-1">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/80 border border-slate-200/60 shadow-xs">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <CheckCircle size={15} />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-slate-800">5 บทเรียนเริ่มต้น</p>
                  <p className="text-slate-500">ปูพื้นฐานกระชับ</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/80 border border-slate-200/60 shadow-xs">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <Terminal size={15} />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-slate-800">Live Editor</p>
                  <p className="text-slate-500">มี Syntax Color</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/80 border border-slate-200/60 shadow-xs">
                <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                  <Zap size={15} />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-slate-800">Zero Setup</p>
                  <p className="text-slate-500">ไม่ต้องลงโปรแกรม</p>
                </div>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2 w-full">
              {/* Vibrant Green Start Learning Button */}
              <Link
                href={isAuthenticated ? "/learn" : "/auth?mode=signup"}
                className="group relative inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm sm:text-base tracking-wide transition-all duration-200 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{isAuthenticated ? "เข้าสู่ห้องเรียน (24 Steps)" : "Start Learning (24 Steps)"}</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
                </span>
              </Link>

              {/* 3D Quest Game Arena */}
              <Link
                href="/arena"
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
              >
                <Gamepad2 size={16} className="text-white" />
                <span>เกม 3D Quest Arena</span>
              </Link>

              {/* Cheat Sheet Modal Trigger */}
              <button
                onClick={() => setShowCheatSheet(true)}
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium text-xs sm:text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <HelpCircle size={15} className="text-slate-300" />
                <span>Cheat Sheet</span>
              </button>

              {/* Music Toggle */}
              <button
                onClick={() => setMusicOn((prev) => !prev)}
                className={`inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-medium text-xs sm:text-sm shadow-sm transition-all duration-300 cursor-pointer active:scale-95 ${
                  musicOn
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white ring-2 ring-indigo-400/40 shadow-indigo-500/20"
                    : "bg-slate-700 hover:bg-slate-600 text-slate-300"
                }`}
              >
                <span className={`transition-transform duration-300 ${musicOn ? "animate-pulse" : ""}`}>
                  {musicOn ? "🔊" : "🔇"}
                </span>
                <span>{musicOn ? "Music On" : "Music Off"}</span>
              </button>

              {/* Sign In Button (Only shown if not logged in) */}
              {!isAuthenticated && (
                <Link
                  href="/auth?mode=signin"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm border border-slate-200 shadow-xs transition-colors"
                >
                  <LogIn size={15} />
                  <span>Sign In</span>
                </Link>
              )}
            </div>

            <CheatSheetModal isOpen={showCheatSheet} onClose={() => setShowCheatSheet(false)} />

            {/* Micro Social Proof / Prompt */}
            <p className="text-xs text-slate-400 flex items-center gap-2 font-mono">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              เริ่มต้นเรียนฟรีได้ทันที หรือ Sign In เพื่อบันทึกประวัติการเรียน
            </p>
          </div>

          {/* ─────────────────────────────────────────────────────────
              3. ฝั่งขวา (Mascot Section)
          ──────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
              {/* Decorative Tech Halo Rings & Cyber Grid Circles */}
              <div className="absolute inset-0 rounded-full border border-dashed border-emerald-500/25 animate-spin [animation-duration:40s] pointer-events-none" />
              <div className="absolute inset-6 rounded-full border border-blue-500/20 pointer-events-none" />
              <div className="absolute inset-14 rounded-full bg-gradient-to-tr from-cyan-100/40 via-blue-50/50 to-amber-100/40 blur-2xl pointer-events-none" />

              {/* Speech Bubble from Mascot */}
              <div className="absolute -top-6 sm:-top-8 -right-2 sm:-right-4 z-20 max-w-[270px] animate-float-slow">
                <div
                  onClick={() => setBubbleTextIndex((prev) => (prev + 1) % speechMessages.length)}
                  className="cursor-pointer group relative bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/90 transition-all hover:scale-105 hover:border-cyan-400"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-cyan-600 uppercase tracking-wider">
                      StarPy 🌟
                    </span>
                    <span className="ml-auto text-[10px] text-slate-400 font-mono">
                      (คลิกเปลี่ยนคำ)
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-800 leading-snug">
                    {speechMessages[bubbleTextIndex]}
                  </p>

                  {/* Speech bubble tail pointing toward mascot */}
                  <div className="absolute -bottom-2.5 left-8 w-4 h-4 bg-white border-b border-r border-slate-200/90 transform rotate-45" />
                </div>
              </div>

              {/* Mascot Floating Character Card */}
              <div className="relative z-10 w-full h-full flex items-center justify-center animate-float">
                <div className="relative w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] md:w-[380px] md:h-[380px] max-w-[88vw] aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 border-4 border-white bg-white/60">
                  <Image
                    src="/starpy.jpg"
                    alt="StarPy Mascot"
                    fill
                    priority
                    className="object-cover object-center transition-transform duration-500 hover:scale-105"
                  />

                  {/* Inner subtle bottom gradient overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />

                  {/* Mascot status pill on image */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-2 rounded-xl bg-white/90 backdrop-blur-md border border-white/60 shadow-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
                      <span className="text-xs font-bold text-slate-800">
                        StarPy: Your Personal Tutor 🌟
                      </span>
                    </div>
                    <span className="text-[11px] font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      READY!
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Code Sticker on bottom-left */}
              <div className="absolute -bottom-4 -left-3 sm:-left-6 z-20 animate-float-slow [animation-delay:1.5s]">
                <div className="bg-slate-900 text-white font-mono text-[11px] px-3.5 py-2 rounded-xl shadow-xl shadow-slate-900/20 border border-slate-800 flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">&gt;&gt;&gt;</span>
                  <span className="text-slate-200">print(&quot;Hello, Python!&quot;)</span>
                </div>
              </div>

              {/* Floating Game XP Badge on top-left */}
              <div className="absolute top-10 -left-4 sm:-left-8 z-20 animate-float [animation-delay:0.8s]">
                <div className="bg-amber-400 text-slate-950 font-extrabold text-xs px-3 py-1.5 rounded-full shadow-lg shadow-amber-400/30 flex items-center gap-1.5 border-2 border-white">
                  <span>⭐</span>
                  <span>QUEST READY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          FOOTER
      ──────────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 border-t border-slate-200/60">
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <span className="font-semibold text-slate-600">PyStep</span>
          <span>—</span>
          <span>Step-by-Step Python Learning Hub</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href={isAuthenticated ? "/learn" : "/auth?mode=signup"}
            className="hover:text-slate-600 transition-colors"
          >
            {isAuthenticated ? "เข้าสู่ห้องเรียน" : "สมัครเรียนฟรี"}
          </Link>
          <Link
            href="/admin"
            className="hover:text-emerald-600 transition-colors flex items-center gap-1 font-mono text-[11px]"
          >
            <span>🔐 Admin Portal</span>
          </Link>
        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────────
          4. SIGN IN MODAL (AUTH FORM POPUP)
      ──────────────────────────────────────────────────────────────── */}
      {isAuthModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAuthModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-md animate-in zoom-in-95 duration-200">
            {/* Modal Close Button */}
            <button
              onClick={() => setIsAuthModalOpen(false)}
              aria-label="Close modal"
              className="absolute -top-3 -right-3 z-20 w-8 h-8 rounded-full bg-white shadow-md border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
            >
              <X size={16} />
            </button>

            {/* Embedded Auth Form */}
            <PremiumAuthForm
              onSubmit={async (values, mode) => {
                const name =
                  Object.entries(values).find(([k]) => k.includes("name"))?.[1] || "";
                const email =
                  Object.entries(values).find(([k]) => k.includes("email"))?.[1] || "";
                const password =
                  Object.entries(values).find(
                    ([k]) => k.includes("password") && !k.includes("confirm")
                  )?.[1] || "";

                const endpoint =
                  mode === "signin" ? "/api/auth/signin" : "/api/auth/signup";
                const res = await fetch(endpoint, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ name, email, password }),
                });

                const data = await res.json();
                if (!res.ok) {
                  throw new Error(data.error || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
                }

                setIsAuthModalOpen(false);
                if (data.user?.role === "admin" || data.user?.name === "admin" || email === "admin@pystep.com") {
                  router.push("/admin");
                } else {
                  router.push("/learn");
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
