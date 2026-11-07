"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Play,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Terminal,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Code2,
  BookOpen,
  Sparkles,
  Flame,
  Heart,
  Trophy,
  Layers,
  Send,
  Zap,
  ArrowRight,
  Cpu,
  Award,
  AlertTriangle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Home,
  LogOut,
  ShieldCheck,
  Gamepad2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MASCOTS, Mascot } from "@/lib/mascots";
import { PythonIntroHistoryModal } from "@/components/learn/PythonIntroHistoryModal";
import { CourseCurriculumRoadmap } from "@/components/learn/CourseCurriculumRoadmap";
import { ExpandableConceptSummary } from "@/components/learn/ExpandableConceptSummary";
import { Roadmap24GridView } from "@/components/learn/Roadmap24GridView";

import {
  STEPS,
  CHAPTERS,
  Step,
  Chapter,
  Env,
  TestCase,
  PYTHON_INTRODUCTION_HISTORY,
  isMinigamesUnlocked,
} from "@/lib/curriculumData";

/* ═══════════════════════════════════════════════════════════════════
   PYTHON TOKENIZER & SYNTAX HIGHLIGHTER
═══════════════════════════════════════════════════════════════════ */

function escHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const KW = new Set([
  "False","None","True","and","as","assert","async","await",
  "break","class","continue","def","del","elif","else","except",
  "finally","for","from","global","if","import","in","is",
  "lambda","nonlocal","not","or","pass","raise","return","try",
  "while","with","yield",
]);
const BI = new Set([
  "print","len","range","input","int","float","str","bool",
  "list","dict","tuple","set","type","sum","max","min","abs",
  "round","sorted","enumerate","zip","map","filter","isinstance",
]);

type TokType = "kw" | "bi" | "str" | "cmt" | "num" | "op" | "punc" | "id" | "sp";

function tokenizeLine(line: string): Array<{ t: TokType; v: string }> {
  const out: Array<{ t: TokType; v: string }> = [];
  let i = 0;

  while (i < line.length) {
    const ch = line[i];

    // Comment
    if (ch === "#") {
      out.push({ t: "cmt", v: line.slice(i) });
      break;
    }

    // f/r/b prefix + string
    if (
      (ch === "f" || ch === "r" || ch === "b") &&
      (line[i + 1] === '"' || line[i + 1] === "'")
    ) {
      const q = line[i + 1];
      let j = i + 2;
      while (j < line.length && line[j] !== q) {
        if (line[j] === "\\") j++;
        j++;
      }
      out.push({ t: "str", v: line.slice(i, j + 1) });
      i = j + 1;
      continue;
    }

    // String
    if (ch === '"' || ch === "'") {
      let j = i + 1;
      while (j < line.length && line[j] !== ch) {
        if (line[j] === "\\") j++;
        j++;
      }
      out.push({ t: "str", v: line.slice(i, j + 1) });
      i = j + 1;
      continue;
    }

    // Number
    if (/\d/.test(ch)) {
      let j = i;
      while (j < line.length && /[\d.e_]/.test(line[j])) j++;
      out.push({ t: "num", v: line.slice(i, j) });
      i = j;
      continue;
    }

    // Identifier / keyword / builtin
    if (/[a-zA-Z_]/.test(ch)) {
      let j = i;
      while (j < line.length && /\w/.test(line[j])) j++;
      const word = line.slice(i, j);
      out.push({
        t: KW.has(word) ? "kw" : BI.has(word) ? "bi" : "id",
        v: word,
      });
      i = j;
      continue;
    }

    // Operators
    if (/[+\-*/%=<>!&|^~@]/.test(ch)) {
      let j = i + 1;
      while (j < line.length && /[+\-*/%=<>!&|^~]/.test(line[j])) j++;
      out.push({ t: "op", v: line.slice(i, j) });
      i = j;
      continue;
    }

    // Punctuation
    if (/[()[\]{},.:;]/.test(ch)) {
      out.push({ t: "punc", v: ch });
      i++;
      continue;
    }

    // Whitespace
    let j = i;
    while (j < line.length && /\s/.test(line[j])) j++;
    if (j > i) {
      out.push({ t: "sp", v: line.slice(i, j) });
      i = j;
      continue;
    }
    out.push({ t: "sp", v: ch });
    i++;
  }
  return out;
}

const TOK_COLOR: Record<TokType, string> = {
  kw: "#cba6f7",
  bi: "#89b4fa",
  str: "#a6e3a1",
  cmt: "#6c7086",
  num: "#fab387",
  op: "#89dceb",
  punc: "#cdd6f4",
  id: "#f8fafc",
  sp: "inherit",
};

function highlightPython(code: string): string {
  return code
    .split("\n")
    .map((line) =>
      tokenizeLine(line)
        .map(({ t, v }) => {
          const c = TOK_COLOR[t];
          const s = escHtml(v);
          if (t === "cmt")
            return `<span style="color:${c};font-style:italic">${s}</span>`;
          if (t === "sp") return s;
          return `<span style="color:${c}">${s}</span>`;
        })
        .join("")
    )
    .join("\n");
}

/* ═══════════════════════════════════════════════════════════════════
   EXECUTION ENGINE WITH MEMORY TRACER
═══════════════════════════════════════════════════════════════════ */

export interface ExecutionTraceStep {
  lineNum: number;
  codeLine: string;
  envSnapshot: {
    name: string;
    type: string;
    value: string;
    address: string;
  }[];
}

interface RunResult {
  output: string;
  error: string | null;
  env: Env;
  trace: ExecutionTraceStep[];
}

function splitTopLevel(s: string, delim: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let inStr: string | null = null;
  let start = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (inStr) {
      if (ch === "\\") {
        i++;
        continue;
      }
      if (ch === inStr) inStr = null;
    } else if (ch === '"' || ch === "'") {
      inStr = ch;
    } else if ("([{".includes(ch)) {
      depth++;
    } else if (")]}".includes(ch)) {
      depth--;
    } else if (depth === 0 && s.slice(i, i + delim.length) === delim) {
      parts.push(s.slice(start, i).trim());
      i += delim.length - 1;
      start = i + 1;
    }
  }
  parts.push(s.slice(start).trim());
  return parts;
}

function evalExpr(raw: string, env: Env): unknown {
  const e = raw.trim();

  // f-string
  if (/^f["']/.test(e)) {
    const inner = e.slice(2, -1);
    return inner.replace(/\{([^}]+)\}/g, (_, k) => {
      try {
        return String(evalExpr(k.trim(), env));
      } catch {
        return `{${k}}`;
      }
    });
  }

  // String literal
  if (
    (e.startsWith('"') && e.endsWith('"')) ||
    (e.startsWith("'") && e.endsWith("'"))
  ) {
    return e
      .slice(1, -1)
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "\t")
      .replace(/\\'/g, "'")
      .replace(/\\"/g, '"');
  }

  // Primitives
  if (e === "None") return null;
  if (e === "True") return true;
  if (e === "False") return false;

  // type()
  const typeM = e.match(/^type\((.+)\)$/);
  if (typeM) {
    const v = evalExpr(typeM[1], env);
    if (v === null) return "<class 'NoneType'>";
    if (typeof v === "boolean") return "<class 'bool'>";
    if (typeof v === "number")
      return Number.isInteger(v as number)
        ? "<class 'int'>"
        : "<class 'float'>";
    return "<class 'str'>";
  }

  // len()
  const lenM = e.match(/^len\((.+)\)$/);
  if (lenM) {
    const v = evalExpr(lenM[1], env);
    return String(v).length;
  }

  // Number literal
  if (/^-?\d+$/.test(e)) return parseInt(e, 10);
  if (/^-?\d+\.\d*$/.test(e)) return parseFloat(e);

  // Identifier
  if (/^[a-zA-Z_]\w*$/.test(e)) {
    if (e in env) return env[e];
    throw new Error(`NameError: name '${e}' is not defined`);
  }

  // Arithmetic with variable substitution
  const safe = e.replace(/[a-zA-Z_]\w*/g, (name) => {
    if (name in env) {
      const v = env[name];
      if (typeof v === "number") return String(v);
      if (typeof v === "boolean") return v ? "1" : "0";
      throw new Error(`TypeError: cannot use '${name}' in arithmetic`);
    }
    throw new Error(`NameError: name '${name}' is not defined`);
  });

  if (/^[\d\s+\-*/.()%*]+$/.test(safe)) {
    try {
      // eslint-disable-next-line no-new-func
      return Function(`"use strict"; return (${safe})`)();
    } catch {
      /* fall through */
    }
  }

  // String concatenation
  const parts = splitTopLevel(e, "+");
  if (parts.length > 1) {
    try {
      const vals = parts.map((p) => evalExpr(p, env));
      return vals.map(String).join("");
    } catch {
      /* fall through */
    }
  }

  return e;
}

function runPythonWithTrace(code: string): RunResult {
  const lines = code.split("\n");
  const env: Env = {};
  const trace: ExecutionTraceStep[] = [];
  let output = "";

  const getEnvSnapshot = () =>
    Object.entries(env).map(([k, v], idx) => {
      let t = "str";
      if (typeof v === "number") t = Number.isInteger(v) ? "int" : "float";
      else if (typeof v === "boolean") t = "bool";
      else if (v === null) t = "NoneType";
      return {
        name: k,
        type: t,
        value: typeof v === "string" ? `"${v}"` : String(v),
        address: `0x7fff3a${(16 + idx * 8).toString(16).toUpperCase()}`,
      };
    });

  try {
    for (let n = 0; n < lines.length; n++) {
      const trimmed = lines[n].trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      // print(...)
      const printM = trimmed.match(/^print\(([\s\S]*)\)$/);
      if (printM) {
        const argsRaw = printM[1].trim();
        if (!argsRaw) {
          output += "\n";
        } else {
          const args = splitTopLevel(argsRaw, ",");
          const vals = args.map((a) => {
            const v = evalExpr(a.trim(), env);
            if (v === null) return "None";
            if (typeof v === "boolean") return v ? "True" : "False";
            return String(v);
          });
          output += vals.join(" ") + "\n";
        }
        trace.push({
          lineNum: n + 1,
          codeLine: trimmed,
          envSnapshot: getEnvSnapshot(),
        });
        continue;
      }

      // var = expr
      const assignM = trimmed.match(/^([a-zA-Z_]\w*)\s*=\s*([\s\S]+)$/);
      if (assignM) {
        const val = evalExpr(assignM[2].trim(), env);
        env[assignM[1]] = val as string | number | boolean | null;
        trace.push({
          lineNum: n + 1,
          codeLine: trimmed,
          envSnapshot: getEnvSnapshot(),
        });
        continue;
      }

      // Control flow
      if (/^(if\b|elif\b|else:|for\b|while\b|def\b|class\b|try:|except\b|return\b|continue|break)/.test(trimmed)) {
        const inlinePrint = trimmed.match(/:\s*print\(([\s\S]*)\)$/);
        if (inlinePrint) {
          const argsRaw = inlinePrint[1].trim();
          const args = splitTopLevel(argsRaw, ",");
          const vals = args.map((a) => {
            const v = evalExpr(a.trim(), env);
            if (v === null) return "None";
            if (typeof v === "boolean") return v ? "True" : "False";
            return String(v);
          });
          output += vals.join(" ") + "\n";
        }
        trace.push({
          lineNum: n + 1,
          codeLine: trimmed,
          envSnapshot: getEnvSnapshot(),
        });
        continue;
      }

      // Method calls
      const methodM = trimmed.match(/^([a-zA-Z_]\w*)\.([a-zA-Z_]\w*)\(([\s\S]*)\)$/);
      if (methodM) {
        trace.push({
          lineNum: n + 1,
          codeLine: trimmed,
          envSnapshot: getEnvSnapshot(),
        });
        continue;
      }

      // Function calls
      const fnCallM = trimmed.match(/^([a-zA-Z_]\w*)\(([\s\S]*)\)$/);
      if (fnCallM) {
        trace.push({
          lineNum: n + 1,
          codeLine: trimmed,
          envSnapshot: getEnvSnapshot(),
        });
        continue;
      }

      throw new Error(`SyntaxError (line ${n + 1}): '${trimmed.slice(0, 40)}'`);
    }
    return { output, error: null, env, trace };
  } catch (err) {
    return {
      output,
      error: err instanceof Error ? err.message : String(err),
      env,
      trace,
    };
  }
}

/* ═══════════════════════════════════════════════════════════════════
   CONFETTI CELEBRATION
═══════════════════════════════════════════════════════════════════ */

function triggerConfetti() {
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "9999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles: Array<{
    x: number; y: number; vx: number; vy: number;
    size: number; color: string; rotation: number; vrot: number;
  }> = [];

  const colors = ["#10b981", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4"];
  for (let i = 0; i < 120; i++) {
    particles.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 200,
      y: canvas.height * 0.4,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 1) * 14 - 3,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vrot: (Math.random() - 0.5) * 10,
    });
  }

  let animationFrame: number;
  let opacity = 1;

  function render() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.35; p.rotation += p.vrot;
      if (p.y < canvas.height + 50) alive = true;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = opacity;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
      ctx.restore();
    }
    opacity -= 0.009;
    if (alive && opacity > 0) {
      animationFrame = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animationFrame);
      canvas.remove();
    }
  }
  render();
}

function renderInlineFormatted(str: string) {
  if (!str) return null;
  const parts = str.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="font-mono text-[12px] sm:text-[13px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300/70 px-1.5 py-0.5 rounded shadow-2xs mx-0.5 inline-block"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function renderFormattedMarkdown(text: string) {
  if (!text) return null;
  // Normalize escaped literal \n and real newlines
  const normalized = text.replace(/\\n/g, "\n");
  const lines = normalized.split("\n");
  return (
    <div className="space-y-3 text-slate-700 text-sm sm:text-[15px] leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-2" />;

        // Section Headings: ### ...
        if (trimmed.startsWith("### ")) {
          return (
            <div
              key={idx}
              className="pt-2 pb-1 text-base sm:text-lg font-bold text-slate-900 border-b border-slate-200 flex items-center gap-2.5"
            >
              <span className="w-1.5 h-5 bg-emerald-500 rounded-full inline-block shrink-0" />
              <span>{trimmed.replace(/^###\s*/, "")}</span>
            </div>
          );
        }

        // Numbered sections: e.g. 1.1 **Title**: Description or 1. Title
        const numMatch = trimmed.match(/^(\d+(\.\d+)?)\s+(.*)$/);
        if (numMatch) {
          return (
            <div
              key={idx}
              className="flex items-start gap-3 p-3.5 rounded-xl bg-white/95 border border-slate-200/80 shadow-2xs hover:border-emerald-300 transition-colors"
            >
              <span className="shrink-0 text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300/60 mt-0.5">
                {numMatch[1]}
              </span>
              <div className="leading-relaxed text-slate-700 text-sm sm:text-[15px] flex-1">
                {renderInlineFormatted(numMatch[3])}
              </div>
            </div>
          );
        }

        // Bullet points: - ... or * ...
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const bulletContent = trimmed.slice(2);
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-3 py-0.5">
              <span className="text-emerald-500 font-bold shrink-0 mt-0.5 text-base leading-none">•</span>
              <div className="leading-relaxed text-slate-700 text-sm sm:text-[15px] flex-1">
                {renderInlineFormatted(bulletContent)}
              </div>
            </div>
          );
        }

        return (
          <p key={idx} className="leading-relaxed text-slate-700 text-sm sm:text-[15px]">
            {renderInlineFormatted(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN LEARN PAGE – CLEAN SINGLE-COLUMN GUIDED FLOW
═══════════════════════════════════════════════════════════════════ */

export default function LearnPage() {
  // ── Core State ──
  const [stepIdx, setStepIdx] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [code, setCode] = useState(STEPS[0].starterCode);
  const [output, setOutput] = useState("");
  const [runError, setRunError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [passed, setPassed] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showRoadmapView, setShowRoadmapView] = useState(false);
  const [roadmapTab, setRoadmapTab] = useState<"grid" | "timeline">("grid");

  // ── User Data ──
  const [userName, setUserName] = useState("");
  const [xp, setXp] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [streak, setStreak] = useState(1);
  const [level, setLevel] = useState(1);
  const [userRole, setUserRole] = useState("user");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ── Mascot ──
  const [mascot, setMascot] = useState<Mascot>(MASCOTS[0]);

  // ── UI State ──
  const [showHint, setShowHint] = useState(false);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [showStepList, setShowStepList] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [traceHistory, setTraceHistory] = useState<ExecutionTraceStep[]>([]);
  const [traceStepIdx, setTraceStepIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const router = useRouter();

  // ── Logout Handler ──
  const handleLogout = async () => {
    try {
      setShowProfileMenu(false);
      await fetch("/api/auth/signout", { method: "POST" });
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
      window.location.href = "/";
    }
  };

  const step = STEPS[stepIdx];
  const chapter = CHAPTERS.find((c) => c.id === step.chapterId) || CHAPTERS[0];

  // ── Load User Data & Progress from Database ──
  useEffect(() => {
    async function loadUserData() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.authenticated && data.user) {
          setIsLoggedIn(true);
          setUserName(data.user.name);
          setUserRole(data.user.role || (data.user.name === "admin" ? "admin" : "user"));
          setXp(data.user.xp || 0);
          setHearts(data.user.hearts || 5);
          setStreak(data.user.streak || 1);
          setLevel(data.user.level || 1);

          const completed: number[] = data.user.completedStepIds || [];
          setCompletedSteps(completed);

          // Find the first incomplete step to resume
          if (completed.length > 0 && completed.length < STEPS.length) {
            const sortedCompleted = [...completed].sort((a, b) => a - b);
            const lastCompleted = sortedCompleted[sortedCompleted.length - 1];
            const nextStepIdx = STEPS.findIndex((s) => s.id === lastCompleted + 1);
            if (nextStepIdx >= 0) {
              setStepIdx(nextStepIdx);
              setCode(STEPS[nextStepIdx].starterCode);
            }
          } else if (completed.length >= STEPS.length) {
            // All completed, show first step
            setStepIdx(0);
            setCode(STEPS[0].starterCode);
          }

          // Load mascot
          if (data.user.selectedMascot) {
            const found = MASCOTS.find((m) => m.name === data.user.selectedMascot);
            if (found) setMascot(found);
          }
        }
      } catch (err) {
        console.error("Failed to load user data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    // Also try localStorage mascot
    try {
      const saved = localStorage.getItem("userMascot");
      if (saved) {
        const parsed = JSON.parse(saved);
        const matched = MASCOTS.find((m) => m.id === parsed.id);
        if (matched) setMascot(matched);
      }
    } catch {}

    loadUserData();
  }, []);

  // ── Step Navigation ──
  const goToStep = useCallback((idx: number) => {
    if (idx < 0 || idx >= STEPS.length) return;
    setStepIdx(idx);
    setCode(STEPS[idx].starterCode);
    setOutput("");
    setRunError(null);
    setPassed(false);
    setShowHint(false);
    setShowVictoryModal(false);
    setShowVisualizer(false);
    setTraceHistory([]);
    setTraceStepIdx(0);
    setShowStepList(false);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // ── Run Code ──
  const handleRun = () => {
    setIsRunning(true);
    setRunError(null);

    setTimeout(() => {
      const result = runPythonWithTrace(code);
      setOutput(result.output);
      setRunError(result.error);
      setTraceHistory(result.trace);
      setTraceStepIdx(Math.max(0, result.trace.length - 1));
      setIsRunning(false);

      if (!result.error) {
        const allPass = step.testCases.every((tc) =>
          tc.check(result.output, result.env, code)
        );

        if (allPass && !passed) {
          setPassed(true);
          const updatedCompleted = Array.from(new Set([...completedSteps, step.id]));
          setCompletedSteps(updatedCompleted);
          const newXp = xp + step.xp;
          setXp(newXp);
          triggerConfetti();

          // Persist to database
          fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              stepId: step.id,
              xp: step.xp,
            }),
          }).catch((err) => console.error("Failed to persist progress:", err));

          setShowVictoryModal(true);
        }
      }
    }, 280);
  };

  // ── Reset Code ──
  const handleReset = () => {
    setCode(step.starterCode);
    setOutput("");
    setRunError(null);
    setPassed(false);
    setShowHint(false);
    setTraceHistory([]);
    setTraceStepIdx(0);
  };

  // ── Copy Code ──
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Derived ──
  const isStepCompleted = (id: number) => completedSteps.includes(id);
  const totalProgress = Math.round((completedSteps.length / STEPS.length) * 100);

  // ── Loading Screen ──
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">กำลังโหลดข้อมูลการเรียน...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ─────────────────────────────────────────────────────
          STICKY HEADER – Simple & Clean
      ───────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Left: Logo + Home */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-sm">
                <Code2 size={16} className="text-white" />
              </div>
              <span className="font-extrabold text-slate-900 text-sm hidden sm:inline">PyStep</span>
            </Link>

            {/* Progress Bar */}
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${totalProgress}%` }}
                />
              </div>
              <span className="text-[11px] font-mono text-slate-500 font-semibold">{totalProgress}%</span>
            </div>
          </div>

          {/* Center: Step Info (clickable to open step list) */}
          <button
            onClick={() => setShowStepList(!showStepList)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group"
          >
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
              {chapter.icon} Ch.{chapter.number}
            </span>
            <span className="text-sm font-semibold text-slate-700 hidden md:inline max-w-[200px] truncate">
              Step {step.id}: {step.title}
            </span>
            <ChevronDown size={14} className={cn(
              "text-slate-400 transition-transform",
              showStepList && "rotate-180"
            )} />
          </button>

          {/* Right: Gamification Stats */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* XP */}
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600" title="Experience Points">
              <Trophy size={14} className="text-amber-500" />
              <span className="hidden sm:inline">{xp} XP</span>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-1 text-xs font-bold text-amber-600" title="Day Streak">
              <Flame size={14} className="text-amber-500 fill-amber-400" />
              <span>{streak}</span>
            </div>

            {/* Hearts */}
            <div className="flex items-center gap-1 text-xs font-bold text-rose-600" title="Hearts">
              <Heart size={14} className="text-rose-500 fill-rose-400" />
              <span>{hearts}</span>
            </div>

            {/* Certificate Link */}
            <Link
              href="/certificate"
              className={cn(
                "hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all",
                completedSteps.length >= STEPS.length
                  ? "bg-amber-100 text-amber-800 border border-amber-300 animate-pulse"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
              )}
              title="เกียรติบัตร"
            >
              <Award size={14} />
              <span className="hidden lg:inline">เกียรติบัตร</span>
            </Link>

            {/* Leaderboard Button */}
            <Link
              href="/leaderboard"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-all cursor-pointer shadow-xs"
              title="กระดานผู้นำ (Leaderboard)"
            >
              <Trophy size={14} className="text-amber-500" />
              <span className="hidden lg:inline">Leaderboard</span>
            </Link>

            {/* Game Arena 15 Questions Button */}
            <Link
              href="/arena"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 hover:from-purple-500 hover:to-sky-500 text-white shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer"
              title="คำถามวัดความรู้ 15 ข้อ (Game Arena)"
            >
              <Gamepad2 size={14} />
              <span className="hidden sm:inline">คำถามวัดความรู้ 15 ข้อ</span>
              <span className="sm:hidden">15 ข้อ 🎮</span>
            </Link>

            {/* User Avatar + Profile Dropdown */}
            {isLoggedIn && (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-bold text-xs shadow-sm cursor-pointer hover:ring-2 hover:ring-emerald-300 hover:ring-offset-1 transition-all"
                  title={userName}
                >
                  {userName.charAt(0)}
                </button>

                {/* Profile Dropdown Menu */}
                {showProfileMenu && (
                  <>
                    {/* Backdrop to close when clicking outside (under dropdown) */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowProfileMenu(false)}
                    />

                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* User Info */}
                      <div className="px-4 py-4 bg-gradient-to-br from-emerald-50 to-cyan-50 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">
                            {userName.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">{userName}</p>
                            <p className="text-[11px] text-slate-500">Level {level} • {xp} XP</p>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="px-4 py-3 border-b border-slate-100 grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-xs font-bold text-emerald-600">{completedSteps.length}/{STEPS.length}</p>
                          <p className="text-[10px] text-slate-400">เสร็จแล้ว</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-amber-600">{streak} 🔥</p>
                          <p className="text-[10px] text-slate-400">Streak</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-rose-600">{hearts} ❤️</p>
                          <p className="text-[10px] text-slate-400">Hearts</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="p-2 space-y-1">
                        {(userRole === "admin" || userName === "admin") && (
                          <Link
                            href="/admin"
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <ShieldCheck size={15} className="text-emerald-600" />
                            <span>ระบบหลังบ้าน (Admin)</span>
                          </Link>
                        )}
                        <Link
                          href="/arena"
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <Gamepad2 size={15} className="text-purple-600" />
                          <span>คำถามวัดความรู้ 15 ข้อ</span>
                        </Link>
                        <Link
                          href="/certificate"
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <Award size={15} className="text-amber-500" />
                          <span>เกียรติบัตร</span>
                        </Link>
                        <Link
                          href="/"
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <Home size={15} className="text-slate-500" />
                          <span>หน้าหลัก</span>
                        </Link>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer border-t border-slate-100 pt-2.5"
                        >
                          <LogOut size={15} />
                          <span>ออกจากระบบ</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Step Dropdown List */}
        {showStepList && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg z-50 max-h-[60vh] overflow-y-auto">
            <div className="max-w-5xl mx-auto px-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {CHAPTERS.map((ch) => (
                  <div key={ch.id} className="space-y-1.5">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                      {ch.icon} Chapter {ch.number}: {ch.title}
                    </h4>
                    {STEPS.filter((s) => s.chapterId === ch.id).map((s) => {
                      const isDone = isStepCompleted(s.id);
                      const isCurrent = s.id === step.id;
                      const isUnlocked = s.id === 1 || isStepCompleted(s.id - 1) || isDone;
                      return (
                        <button
                          key={s.id}
                          onClick={() => isUnlocked ? goToStep(s.id - 1) : null}
                          disabled={!isUnlocked}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-lg text-xs flex items-center gap-2 transition-all",
                            isCurrent
                              ? "bg-emerald-50 border-2 border-emerald-400 text-emerald-800 font-bold"
                              : isDone
                              ? "bg-slate-50 text-slate-600 hover:bg-slate-100 cursor-pointer"
                              : isUnlocked
                              ? "bg-white text-slate-700 hover:bg-slate-50 cursor-pointer border border-slate-200"
                              : "bg-slate-50 text-slate-400 cursor-not-allowed opacity-60"
                          )}
                        >
                          {isDone ? (
                            <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                          ) : isCurrent ? (
                            <Zap size={14} className="text-emerald-500 shrink-0" />
                          ) : (
                            <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 shrink-0" />
                          )}
                          <span className="truncate">Step {s.id}: {s.title}</span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Click outside to close step list */}
      {showStepList && (
        <div className="fixed inset-0 z-30" onClick={() => setShowStepList(false)} />
      )}

      {/* ─────────────────────────────────────────────────────
          MAIN CONTENT – Single Column Guided Flow
      ───────────────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">

        {/* ═══ SECTION 1: Step Header ═══ */}
        <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2 flex-1">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {chapter.icon} Ch.{chapter.number} • {step.summaryBadge}
                </span>
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-600">
                  {step.difficulty} • ~{step.estimatedMinutes} นาที
                </span>
                {passed && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-300">
                    <CheckCircle2 size={12} /> ผ่านแล้ว ✅
                  </span>
                )}
                <button
                  onClick={() => setShowHistoryModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors cursor-pointer shadow-2xs"
                >
                  <BookOpen size={12} className="text-indigo-600" />
                  <span>📖 ประวัติ & ปรัชญา Python (MarcusCode)</span>
                </button>
                <button
                  onClick={() => setShowRoadmapView(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer shadow-2xs"
                >
                  <Layers size={12} className="text-emerald-600" />
                  <span>🗺️ Timeline แผนที่เรียน</span>
                </button>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Step {step.id}: {step.title}
              </h1>
              <p className="text-sm text-slate-500 font-mono">{step.titleEn}</p>
              <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
            </div>

            {/* Mascot Mini */}
            <div className="flex items-center gap-3 sm:shrink-0">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-emerald-300 shadow-md">
                <Image src={mascot.avatar} alt={mascot.name} fill className="object-cover" />
              </div>
              <div className="sm:hidden">
                <p className="text-xs font-bold text-slate-800">{mascot.name} {mascot.emoji}</p>
                <p className="text-[11px] text-slate-500">{mascot.title}</p>
              </div>
            </div>
          </div>

          {/* Step Progress Dots */}
          <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-slate-100 overflow-x-auto pb-1">
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goToStep(i)}
                title={`Step ${s.id}: ${s.title}`}
                className={cn(
                  "h-2 rounded-full transition-all duration-300 shrink-0 cursor-pointer",
                  i === stepIdx
                    ? "w-8 bg-emerald-500 shadow-sm shadow-emerald-300"
                    : isStepCompleted(s.id)
                    ? "w-2.5 bg-emerald-400"
                    : "w-2.5 bg-slate-200 hover:bg-slate-300"
                )}
              />
            ))}
          </div>
        </section>

        {/* ═══ SECTION 2: Deep Concept & Theory (MarcusCode Curriculum) ═══ */}
        <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600 shadow-2xs">
                <BookOpen size={18} />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  เนื้อหาบทเรียนเชิงลึก (MarcusCode Curriculum)
                </h2>
                <p className="text-xs text-slate-500">
                  คำอธิบายโครงสร้างภาษา ไวยากรณ์ และทฤษฎีอย่างละเอียดทุกหัวข้อย่อย ห้ามสรุปสั้น
                </p>
              </div>
            </div>
            <span className="self-start sm:self-auto text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold border border-slate-200/60">
              MarcusCode Reference
            </span>
          </div>

          {/* Deep Concept Summary with Interactive Expandable Cards */}
          {step.conceptSummary && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-blue-50/40 border border-slate-200/90 shadow-2xs">
              <ExpandableConceptSummary
                conceptSummary={step.conceptSummary}
                step={step}
                onLoadCodeToEditor={(codeSnippet) => setCode(codeSnippet)}
                highlightPython={highlightPython}
              />
            </div>
          )}

          {/* Key Points */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-500" />
              <span>สรุปประเด็นหัวใจสำคัญ</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {step.keyPoints.map((kp, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
                >
                  <span className="text-xl shrink-0 mt-0.5">{kp.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{kp.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{kp.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Extended Explanation Details */}
          {step.explanation && step.explanation.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Zap size={13} className="text-emerald-500" />
                <span>หลักการทำงานและเกร็ดเสริมเชิงลึก</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-600 pl-4 list-disc">
                {step.explanation.map((exp, i) => (
                  <li key={i} className="leading-relaxed">{exp}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* ═══ SECTION 3: Code Example & Expected Output ═══ */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 sm:px-6 py-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Code2 size={16} className="text-purple-500" />
              <span>ตัวอย่างโค้ด (Code Example)</span>
            </h2>
            <button
              onClick={() => setCode(step.exampleCode)}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              ลองใน Editor <ArrowRight size={12} />
            </button>
          </div>
          <div className="bg-[#1e1e2e] p-4 sm:p-5 overflow-x-auto">
            <pre
              className="text-xs sm:text-sm font-mono leading-relaxed"
              dangerouslySetInnerHTML={{ __html: highlightPython(step.exampleCode) }}
            />
          </div>
          {step.expectedOutput && (
            <div className="bg-[#181825] px-4 sm:px-5 py-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-start gap-2">
              <span className="text-[11px] font-mono font-bold text-emerald-400 shrink-0">
                # ผลลัพธ์ (Output):
              </span>
              <pre className="text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap">
                {step.expectedOutput}
              </pre>
            </div>
          )}
        </section>

        {/* ═══ SECTION 4: Challenge Mission & Pitfall Box ═══ */}
        <section className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-2xl border-2 border-emerald-300 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-amber-400 animate-ping" />
            <h2 className="text-sm font-extrabold text-emerald-800 uppercase tracking-wider">
              🎯 ภารกิจประจำ Step
            </h2>
          </div>
          <div className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
            {renderInlineFormatted(step.challenge)}
          </div>

          {/* Common Pitfall Warning Box */}
          {step.commonPitfall && (
            <div className="p-4 sm:p-5 rounded-xl bg-amber-500/10 border-2 border-amber-400/80 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-black text-amber-900 tracking-wide uppercase">
                <AlertTriangle size={15} className="text-amber-600 shrink-0" />
                <span>⚠️ ข้อผิดพลาดที่พบบ่อย (Common Pitfall)</span>
              </div>
              <div className="text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
                {renderInlineFormatted(step.commonPitfall.replace(/^⚠️\s*\*\*Common Pitfall\*\*:\s*/, ""))}
              </div>
            </div>
          )}
        </section>

        {/* ═══ SECTION 5: Hint from Mascot ═══ */}
        <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden border-2 border-cyan-300 shrink-0">
                <Image src={mascot.avatar} alt={mascot.name} fill className="object-cover" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{mascot.name} {mascot.emoji} <span className="text-xs font-normal text-slate-500">({mascot.title})</span></p>
                <p className="text-xs text-slate-500">
                  {showHint ? "💡 คำใบ้สำหรับ Step นี้:" : mascot.phrase}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHint(!showHint)}
                className={cn(
                  "px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer",
                  showHint
                    ? "bg-amber-100 text-amber-800 border border-amber-300"
                    : "bg-cyan-50 text-cyan-700 border border-cyan-200 hover:bg-cyan-100"
                )}
              >
                <Lightbulb size={14} className={showHint ? "text-amber-500" : ""} />
                {showHint ? "ซ่อนคำใบ้" : "ขอคำใบ้"}
              </button>
            </div>
          </div>
          {showHint && (
            <div className="mt-3 p-4 bg-amber-50 rounded-xl border border-amber-200 text-sm text-amber-900 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
              {step.starPyHint}
            </div>
          )}
        </section>

        {/* ═══ SECTION 6: CODE EDITOR ═══ */}
        <section className="bg-[#1e1e2e] rounded-2xl border border-slate-700 shadow-lg overflow-hidden">
          {/* Editor Toolbar */}
          <div className="h-12 bg-[#181825] border-b border-slate-700 px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-400/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-400/80" />
              </div>
              <span className="text-xs font-mono font-bold text-slate-400">main.py</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Copy */}
              <button
                onClick={handleCopy}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="คัดลอกโค้ด"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>

              {/* Reset */}
              <button
                onClick={handleReset}
                title="รีเซ็ตโค้ดกลับค่าเริ่มต้น"
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <RotateCcw size={14} />
              </button>

              {/* Run Code */}
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-md shadow-emerald-500/25 flex items-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <Play size={14} className="fill-slate-950" />
                <span>{isRunning ? "กำลังรัน..." : "▶ Run Code"}</span>
              </button>
            </div>
          </div>

          {/* Code Editor */}
          <div className="relative min-h-[200px] max-h-[400px] overflow-auto flex">
            {/* Line Numbers */}
            <div
              className="shrink-0 w-12 py-4 pr-3 text-right font-mono text-xs text-slate-600 select-none bg-[#181825] border-r border-slate-800/60"
              style={{ lineHeight: 1.8 }}
            >
              {code.split("\n").map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Editor Canvas */}
            <div className="relative flex-1 overflow-auto">
              <pre
                aria-hidden
                className="absolute inset-0 p-4 font-mono text-sm leading-[1.8] whitespace-pre pointer-events-none"
                dangerouslySetInnerHTML={{ __html: highlightPython(code + "\n") }}
              />
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Tab") {
                    e.preventDefault();
                    const ta = e.currentTarget;
                    const s = ta.selectionStart;
                    const end = ta.selectionEnd;
                    const next = code.slice(0, s) + "    " + code.slice(end);
                    setCode(next);
                    requestAnimationFrame(() => {
                      ta.selectionStart = ta.selectionEnd = s + 4;
                    });
                  }
                }}
                spellCheck={false}
                autoCapitalize="none"
                autoCorrect="off"
                className="absolute inset-0 w-full h-full p-4 font-mono text-sm leading-[1.8] whitespace-pre resize-none bg-transparent text-transparent caret-cyan-400 outline-none border-none"
              />
            </div>
          </div>
        </section>

        {/* ═══ SECTION 7: OUTPUT TERMINAL ═══ */}
        <section className="bg-[#0f0f17] rounded-2xl border border-slate-700 shadow-lg overflow-hidden">
          <div className="h-10 bg-[#0a0a12] border-b border-slate-800 px-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400">
              <Terminal size={14} className="text-emerald-400" />
              <span>Terminal Output</span>
            </div>
            <div className="text-[10px] font-mono text-slate-500">
              {runError ? (
                <span className="text-rose-400 font-bold flex items-center gap-1">
                  <XCircle size={11} /> Error
                </span>
              ) : output ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 size={11} /> Success
                </span>
              ) : (
                <span>Ready</span>
              )}
            </div>
          </div>
          <div className="p-4 min-h-[80px] max-h-[200px] overflow-auto">
            {!output && !runError ? (
              <p className="text-slate-600 text-xs italic font-mono">
                &gt;&gt;&gt; กดปุ่ม "Run Code" เพื่อรันโปรแกรม...
              </p>
            ) : runError ? (
              <pre className="text-rose-400 text-xs font-mono whitespace-pre-wrap leading-relaxed">
                {runError}
              </pre>
            ) : (
              <pre className="text-emerald-400 text-xs font-mono whitespace-pre-wrap leading-relaxed drop-shadow-[0_0_8px_rgba(52,211,153,0.25)]">
                {output}
              </pre>
            )}
          </div>
        </section>

        {/* ═══ SECTION 8: TEST CASES ═══ */}
        <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-cyan-500" />
            🧪 ผลการตรวจสอบ ({step.testCases.length} Tests)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {step.testCases.map((tc) => {
              const isPassing = output
                ? tc.check(output, runPythonWithTrace(code).env, code)
                : false;
              return (
                <div
                  key={tc.id}
                  className={cn(
                    "p-3 rounded-xl border flex items-center justify-between text-xs transition-all",
                    output && isPassing
                      ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                      : output && !isPassing
                      ? "bg-rose-50 border-rose-300 text-rose-800"
                      : "bg-slate-50 border-slate-200 text-slate-500"
                  )}
                >
                  <div>
                    <p className="font-bold">{tc.name}</p>
                    <p className="text-[11px] opacity-70 mt-0.5">{tc.description}</p>
                  </div>
                  <span className="shrink-0 ml-2">
                    {output && isPassing ? (
                      <CheckCircle2 size={18} className="text-emerald-500" />
                    ) : output && !isPassing ? (
                      <XCircle size={18} className="text-rose-500" />
                    ) : (
                      <span className="text-[10px] font-mono text-slate-400">รอรัน</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══ SECTION 9: Memory Visualizer (Collapsible) ═══ */}
        {traceHistory.length > 0 && (
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <button
              onClick={() => setShowVisualizer(!showVisualizer)}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <Cpu size={16} className="text-purple-500" />
                <span>🔍 Memory Visualizer</span>
                <span className="text-[10px] font-mono text-slate-400 font-normal">
                  ({traceHistory.length} steps recorded)
                </span>
              </div>
              {showVisualizer ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
            </button>

            {showVisualizer && (
              <div className="px-5 pb-5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* Step scrubber */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setTraceStepIdx(Math.max(0, traceStepIdx - 1))}
                    disabled={traceStepIdx === 0}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <div className="flex-1">
                    <input
                      type="range"
                      min={0}
                      max={traceHistory.length - 1}
                      value={traceStepIdx}
                      onChange={(e) => setTraceStepIdx(Number(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                  </div>
                  <button
                    onClick={() => setTraceStepIdx(Math.min(traceHistory.length - 1, traceStepIdx + 1))}
                    disabled={traceStepIdx === traceHistory.length - 1}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight size={14} />
                  </button>
                  <span className="text-xs font-mono text-slate-500 w-16 text-right">
                    {traceStepIdx + 1}/{traceHistory.length}
                  </span>
                </div>

                {/* Current line highlight */}
                <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs font-mono">
                  <span className="text-purple-600 font-bold">Line {traceHistory[traceStepIdx]?.lineNum}:</span>{" "}
                  <code className="text-purple-900">{traceHistory[traceStepIdx]?.codeLine}</code>
                </div>

                {/* Variables Table */}
                {traceHistory[traceStepIdx]?.envSnapshot.length > 0 && (
                  <div className="rounded-xl overflow-hidden border border-slate-200">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-100">
                        <tr>
                          <th className="px-3 py-2 text-left font-bold text-slate-600">ตัวแปร</th>
                          <th className="px-3 py-2 text-left font-bold text-slate-600">ชนิด</th>
                          <th className="px-3 py-2 text-left font-bold text-slate-600">ค่า</th>
                          <th className="px-3 py-2 text-left font-bold text-slate-600 hidden sm:table-cell">Address</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {traceHistory[traceStepIdx].envSnapshot.map((v, vi) => (
                          <tr key={vi} className="hover:bg-slate-50">
                            <td className="px-3 py-2 font-mono font-bold text-blue-600">{v.name}</td>
                            <td className="px-3 py-2 text-slate-500">{v.type}</td>
                            <td className="px-3 py-2 font-mono text-emerald-700">{v.value}</td>
                            <td className="px-3 py-2 font-mono text-slate-400 hidden sm:table-cell">{v.address}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* ═══ SECTION 10: Code Review & Guidelines (Collapsible) ═══ */}
        {output && (
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="w-full px-5 py-4 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <Sparkles size={16} className="text-purple-500" />
                <span>✨ Code Review & Best Practices</span>
              </div>
            </div>
            <div className="px-5 pb-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-slate-500 text-[10px]">Correctness</span>
                  <p className="text-emerald-700 font-bold mt-0.5">{passed ? "100% Passed ✅" : "Partial"}</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                  <span className="text-slate-500 text-[10px]">PEP 8 Style</span>
                  <p className="text-blue-700 font-bold mt-0.5">{step.aiReviewTips.pep8}</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
                  <span className="text-slate-500 text-[10px]">Efficiency</span>
                  <p className="text-purple-700 font-bold mt-0.5">{step.aiReviewTips.efficiency}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ═══ STEP NAVIGATION BUTTONS ═══ */}
        <div className="flex items-center justify-between py-4">
          <button
            onClick={() => goToStep(stepIdx - 1)}
            disabled={stepIdx === 0}
            className="px-5 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 cursor-pointer bg-white shadow-sm"
          >
            <ChevronLeft size={16} />
            <span>ก่อนหน้า</span>
          </button>

          {stepIdx === STEPS.length - 1 ? (
            <Link
              href="/certificate"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-400/30 flex items-center gap-2 transition-all hover:from-amber-300 hover:to-amber-400"
            >
              <Award size={16} />
              <span>ดูเกียรติบัตร 🎓</span>
            </Link>
          ) : (
            <button
              onClick={() => goToStep(stepIdx + 1)}
              className={cn(
                "px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm",
                passed
                  ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-emerald-400/30 hover:from-emerald-400 hover:to-cyan-400 animate-pulse"
                  : "bg-slate-900 text-white hover:bg-slate-800"
              )}
            >
              <span>{passed ? "ไปขั้นตอนถัดไป 🚀" : "ข้ามไปก่อน"}</span>
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </main>

      {/* ─────────────────────────────────────────────────────
          VICTORY MODAL
      ───────────────────────────────────────────────────── */}
      {showVictoryModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-sm bg-white border-2 border-emerald-300 rounded-3xl p-6 text-center shadow-2xl space-y-4 animate-in zoom-in-95">
            {/* Mascot */}
            <div className="relative w-20 h-20 mx-auto rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-lg">
              <Image src={mascot.avatar} alt={mascot.name} fill className="object-cover" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                <Sparkles size={13} className="text-amber-500" />
                <span>MISSION ACCOMPLISHED</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                ยอดเยี่ยม! +{step.xp} XP 🎉
              </h3>
              <p className="text-xs text-slate-500">
                คุณผ่าน &quot;{step.title}&quot; เรียบร้อยแล้ว!
              </p>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  setShowVictoryModal(false);
                  if (stepIdx < STEPS.length - 1) {
                    goToStep(stepIdx + 1);
                  }
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-extrabold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>
                  {stepIdx === STEPS.length - 1
                    ? "สำเร็จครบทุก Step 🎉"
                    : "ไปขั้นตอนถัดไป 🚀"}
                </span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => setShowVictoryModal(false)}
                className="text-xs text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                ดูโค้ดและผลลัพธ์ต่อ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Python Introduction & History Modal (MarcusCode) ═══ */}
      <PythonIntroHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
      />

      {/* ═══ Timeline Curriculum Roadmap Full Modal ═══ */}
      {showRoadmapView && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col animate-in fade-in duration-200">
          <div className="px-4 sm:px-6 py-3.5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-sky-100 text-sky-800 text-base">🗺️</span>
              <div>
                <h2 className="text-sm sm:text-base font-black text-slate-900">
                  {roadmapTab === "grid" ? "PyStep Roadmap — 24 บทเรียน (MarcusCode)" : "Timeline การเรียนรู้ 6 Chapters"}
                </h2>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  {roadmapTab === "grid"
                    ? "คลิกที่การ์ดบทเรียนเพื่อเริ่มเรียน หรือดูสถานะความก้าวหน้า"
                    : "เส้นทางเรียนรู้แบบ Timeline เจาะลึกราย Chapter"}
                </p>
              </div>
            </div>

            {/* View Switcher Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setRoadmapTab("grid")}
                className={cn(
                  "px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5",
                  roadmapTab === "grid"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <span>🗺️ ผัง 24 บทเรียน (Grid)</span>
              </button>
              <button
                onClick={() => setRoadmapTab("timeline")}
                className={cn(
                  "px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5",
                  roadmapTab === "timeline"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <span>📜 Timeline (6 Chapters)</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/arena"
                className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 font-bold text-xs transition-colors"
              >
                <Gamepad2 size={13} className="text-purple-600" />
                <span>Game Arena 🎮</span>
              </Link>

              <button
                onClick={() => setShowRoadmapView(false)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                กลับสู่ห้องเรียน ✕
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 sm:p-4 bg-slate-50">
            {roadmapTab === "grid" ? (
              <div className="max-w-7xl mx-auto">
                <Roadmap24GridView
                  steps={STEPS}
                  completedStepIds={completedSteps}
                  currentStepId={step.id}
                  userName={userName}
                  level={level}
                  xp={xp}
                  streak={streak}
                  onSelectStep={(idx) => {
                    goToStep(idx);
                    setShowRoadmapView(false);
                  }}
                  onOpenArena={() => {
                    setShowRoadmapView(false);
                    router.push("/arena");
                  }}
                  onOpenCertificate={() => {
                    setShowRoadmapView(false);
                    router.push("/certificate");
                  }}
                  onOpenSettings={() => {
                    setShowRoadmapView(false);
                    setShowProfileMenu(true);
                  }}
                />
              </div>
            ) : (
              <CourseCurriculumRoadmap
                steps={STEPS}
                chapters={CHAPTERS}
                completedStepIds={completedSteps}
                currentStepId={step.id}
                onSelectStep={(idx) => {
                  goToStep(idx);
                  setShowRoadmapView(false);
                }}
                onSwitchToWorkspace={() => setShowRoadmapView(false)}
                onOpenMinigame={() => {
                  setShowRoadmapView(false);
                  router.push("/arena");
                }}
                onOpenHistoryModal={() => {
                  setShowRoadmapView(false);
                  setShowHistoryModal(true);
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
