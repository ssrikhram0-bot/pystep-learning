"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  BookOpen,
  Code2,
  Terminal,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  Cpu,
  ArrowRight,
  Check,
  Copy,
  Layers,
  ExternalLink,
} from "lucide-react";
import { Step } from "@/lib/curriculumData";
import { getSubtopicDetail, SubtopicDetail } from "@/lib/subtopicData";

interface ExpandableConceptSummaryProps {
  conceptSummary: string;
  step: Step;
  onLoadCodeToEditor?: (code: string) => void;
  highlightPython?: (code: string) => string;
}

export function ExpandableConceptSummary({
  conceptSummary,
  step,
  onLoadCodeToEditor,
  highlightPython,
}: ExpandableConceptSummaryProps) {
  // Parse lines from conceptSummary
  const normalized = (conceptSummary || "")
    .replace(/\\n/g, "\n")
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'");
  const lines = normalized.split("\n");

  // Extract heading if present
  let headingText = "เนื้อหาบทเรียนเจาะลึก";
  const subtopicItems: {
    numKey: string;
    rawTitle: string;
    rawDesc: string;
    detail: SubtopicDetail;
  }[] = [];

  const otherLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("### ")) {
      headingText = trimmed.replace(/^###\s*/, "");
      continue;
    }

    // Match numbered subtopics e.g. "2.1 **Title**: Description" or "2.1 Title: Description"
    const numMatch = trimmed.match(/^(\d+(\.\d+)?)\s+(.*)$/);
    if (numMatch) {
      const numKey = numMatch[1];
      const rest = numMatch[3];
      const boldMatch = rest.match(/^\*\*([^*]+)\*\*:\s*(.*)$/);
      const rawTitle = boldMatch ? boldMatch[1] : rest.split(":")[0] || rest;
      const rawDesc = boldMatch
        ? boldMatch[2]
        : rest.includes(":")
        ? rest.slice(rest.indexOf(":") + 1).trim()
        : rest;

      const detail = getSubtopicDetail(
        numKey,
        step.title,
        conceptSummary,
        step.explanation,
        step.commonPitfall,
        step.codeExample
      );

      subtopicItems.push({
        numKey,
        rawTitle,
        rawDesc,
        detail,
      });
    } else {
      otherLines.push(trimmed);
    }
  }

  // Expanded subtopic keys state
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);

  const toggleExpand = (key: string) => {
    setExpandedKeys((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const expandAll = () => {
    const next: Record<string, boolean> = {};
    for (const item of subtopicItems) {
      next[item.numKey] = true;
    }
    setExpandedKeys(next);
  };

  const collapseAll = () => {
    setExpandedKeys({});
  };

  const allExpanded =
    subtopicItems.length > 0 &&
    subtopicItems.every((item) => expandedKeys[item.numKey]);

  const handleCopyCode = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleLoadCode = (code: string, key: string) => {
    if (onLoadCodeToEditor) {
      onLoadCodeToEditor(code);
      setLoadedKey(key);
      setTimeout(() => setLoadedKey(null), 2500);
    }
  };

  // Helper to format inline code & bold
  const renderInline = (str: string) => {
    if (!str) return null;
    const clean = str.replace(/\\"/g, '"').replace(/\\'/g, "'");
    const parts = clean.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
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
  };

  return (
    <div className="space-y-4">
      {/* ── Heading & Expand All Toolbar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-6 bg-emerald-500 rounded-full inline-block shrink-0" />
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            {renderInline(headingText)}
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            💡 {subtopicItems.length} หัวข้อย่อยเจาะลึก
          </span>

          {subtopicItems.length > 0 && (
            <button
              onClick={allExpanded ? collapseAll : expandAll}
              className="text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              {allExpanded ? (
                <>
                  <ChevronUp size={14} />
                  <span>ยุบทั้งหมด</span>
                </>
              ) : (
                <>
                  <ChevronDown size={14} />
                  <span>เปิดอ่านทั้งหมด</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* ── Subtopic Interactive Cards ── */}
      <div className="space-y-3">
        {subtopicItems.map(({ numKey, rawTitle, rawDesc, detail }) => {
          const isExpanded = !!expandedKeys[numKey];
          const dive = detail.deepDive;

          return (
            <div
              key={numKey}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isExpanded
                  ? "bg-white border-emerald-400 shadow-md ring-2 ring-emerald-400/20"
                  : "bg-white/95 border-slate-200/90 shadow-2xs hover:border-emerald-300 hover:shadow-xs"
              }`}
            >
              {/* Card Header (Clickable Trigger) */}
              <button
                type="button"
                onClick={() => toggleExpand(numKey)}
                className="w-full text-left p-4 sm:p-4.5 flex items-start gap-3 sm:gap-4 transition-colors cursor-pointer group"
                aria-expanded={isExpanded}
              >
                {/* Number Badge */}
                <span
                  className={`shrink-0 text-xs sm:text-sm font-mono font-bold px-2.5 py-1 rounded-lg transition-colors mt-0.5 ${
                    isExpanded
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : "bg-emerald-100/90 text-emerald-800 border border-emerald-300/60 group-hover:bg-emerald-200"
                  }`}
                >
                  {numKey}
                </span>

                {/* Title & Preview */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {detail.title || rawTitle}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {renderInline(detail.summary || rawDesc)}
                  </p>
                </div>

                {/* Right Action Hint / Toggle Icon */}
                <div className="shrink-0 flex items-center gap-2 mt-0.5">
                  <span
                    className={`hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md transition-colors ${
                      isExpanded
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-700"
                    }`}
                  >
                    <BookOpen size={11} />
                    {isExpanded ? "ปิดเนื้อหา" : "คลิกดูเจาะลึก"}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                      isExpanded
                        ? "bg-emerald-100 text-emerald-800 rotate-180"
                        : "bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-700"
                    }`}
                  >
                    <ChevronDown size={16} />
                  </div>
                </div>
              </button>

              {/* Card Expanded Body (Deep Dive Content) */}
              {isExpanded && (
                <div className="px-4 pb-5 sm:px-6 sm:pb-6 pt-2 border-t border-slate-100 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 bg-slate-50/40">
                  {/* Overview Paragraph */}
                  {dive.overview && (
                    <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wide">
                        <Sparkles size={14} className="text-amber-500" />
                        <span>ภาพรวมและหลักการสำคัญ</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {renderInline(dive.overview)}
                      </p>
                    </div>
                  )}

                  {/* Key Concepts Subsections */}
                  {dive.keyConcepts && dive.keyConcepts.length > 0 && (
                    <div className="space-y-3">
                      {dive.keyConcepts.map((kc, kidx) => (
                        <div
                          key={kidx}
                          className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-2"
                        >
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                            <span className="w-1.5 h-3.5 bg-emerald-500 rounded-full inline-block" />
                            <span>{kc.subtitle}</span>
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            {renderInline(kc.explanation)}
                          </p>

                          {kc.bulletPoints && kc.bulletPoints.length > 0 && (
                            <ul className="space-y-1.5 pt-1 pl-3 text-xs sm:text-sm text-slate-700">
                              {kc.bulletPoints.map((bp, bidx) => (
                                <li
                                  key={bidx}
                                  className="flex items-start gap-2"
                                >
                                  <span className="text-emerald-500 font-bold shrink-0 mt-0.5">
                                    •
                                  </span>
                                  <span className="leading-relaxed">
                                    {renderInline(bp)}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Dedicated Subtopic Code Example */}
                  {dive.codeExample && (
                    <div className="rounded-xl border border-slate-800/80 overflow-hidden shadow-sm bg-[#1e1e2e]">
                      <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
                        <div className="flex items-center gap-2">
                          <Code2 size={14} className="text-cyan-400" />
                          <span className="font-semibold text-slate-200">
                            {dive.codeExample.title || "ตัวอย่างโค้ดประกอบหัวข้อนี้"}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* Copy Code */}
                          <button
                            type="button"
                            onClick={() =>
                              handleCopyCode(dive.codeExample!.code, numKey)
                            }
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            {copiedKey === numKey ? (
                              <>
                                <Check size={11} className="text-emerald-400" />
                                <span className="text-emerald-400">คัดลอกแล้ว</span>
                              </>
                            ) : (
                              <>
                                <Copy size={11} />
                                <span>คัดลอก</span>
                              </>
                            )}
                          </button>

                          {/* Load into main editor */}
                          {onLoadCodeToEditor && (
                            <button
                              type="button"
                              onClick={() =>
                                handleLoadCode(dive.codeExample!.code, numKey)
                              }
                              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                            >
                              {loadedKey === numKey ? (
                                <>
                                  <Check size={11} />
                                  <span>โหลดแล้ว!</span>
                                </>
                              ) : (
                                <>
                                  <span>ลองใน Editor</span>
                                  <ArrowRight size={11} />
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Code Block */}
                      <div className="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-slate-200 leading-relaxed">
                        {highlightPython ? (
                          <pre
                            dangerouslySetInnerHTML={{
                              __html: highlightPython(dive.codeExample.code),
                            }}
                          />
                        ) : (
                          <pre>{dive.codeExample.code}</pre>
                        )}
                      </div>

                      {/* Output Preview */}
                      {dive.codeExample.output && (
                        <div className="px-4 py-2.5 bg-[#181825] border-t border-slate-800/80 text-xs font-mono flex items-start gap-2">
                          <Terminal size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-emerald-400 font-bold mr-2"># Output:</span>
                            <span className="text-slate-300 whitespace-pre-wrap">
                              {dive.codeExample.output}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Under the Hood / Technical Insight */}
                  {dive.underTheHood && (
                    <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200/80 space-y-1.5 shadow-2xs">
                      <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 uppercase tracking-wider">
                        <Cpu size={14} className="text-indigo-600 shrink-0" />
                        <span>เกร็ดเสริมเชิงลึก (Under the Hood)</span>
                      </div>
                      <p className="text-xs sm:text-sm text-indigo-950 leading-relaxed">
                        {renderInline(dive.underTheHood)}
                      </p>
                    </div>
                  )}

                  {/* Common Pitfall specific to subtopic */}
                  {dive.commonPitfall && (
                    <div className="p-4 rounded-xl bg-amber-500/10 border-2 border-amber-400/80 space-y-1.5 shadow-2xs">
                      <div className="flex items-center gap-2 text-xs font-black text-amber-900 tracking-wide uppercase">
                        <AlertTriangle size={14} className="text-amber-600 shrink-0" />
                        <span>⚠️ ข้อผิดพลาดที่ต้องระวัง</span>
                      </div>
                      <p className="text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
                        {renderInline(dive.commonPitfall)}
                      </p>
                    </div>
                  )}

                  {/* Pro Tips */}
                  {dive.proTips && dive.proTips.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/70 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 uppercase">
                        <Lightbulb size={13} className="text-emerald-600" />
                        <span>คำแนะนำระดับมือโปร (Pro Tips)</span>
                      </div>
                      <ul className="space-y-1 text-xs text-emerald-950 pl-3">
                        {dive.proTips.map((tip, tidx) => (
                          <li key={tidx} className="flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold">•</span>
                            <span className="leading-relaxed">{renderInline(tip)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Any remaining unnumbered lines */}
      {otherLines.length > 0 && (
        <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-600 space-y-1">
          {otherLines.map((ol, oidx) => (
            <p key={oidx} className="leading-relaxed">
              {renderInline(ol)}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
