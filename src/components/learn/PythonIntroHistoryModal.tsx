"use client";

import React from "react";
import { X, Sparkles, BookOpen, ExternalLink, ShieldCheck, Award, Terminal } from "lucide-react";
import { PYTHON_INTRODUCTION_HISTORY } from "@/lib/curriculumData";

interface PythonIntroHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PythonIntroHistoryModal({
  isOpen,
  onClose,
}: PythonIntroHistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="relative px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <Sparkles size={12} className="text-amber-300" />
                <span>MarcusCode Python Curriculum</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                {PYTHON_INTRODUCTION_HISTORY.title}
              </h2>
              <p className="text-xs text-slate-300 flex items-center gap-1">
                <span>{PYTHON_INTRODUCTION_HISTORY.source}</span>
                <a
                  href="https://marcuscode.com/lang/python"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-0.5 underline decoration-cyan-400/50"
                >
                  <ExternalLink size={11} />
                </a>
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-700 leading-relaxed">
          {PYTHON_INTRODUCTION_HISTORY.sections.map((sec, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all space-y-3"
            >
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-black shrink-0">
                  {idx + 1}
                </span>
                <span>{sec.title}</span>
              </h3>

              <div className="text-sm sm:text-base space-y-2 text-slate-600">
                {sec.content.split("\n\n").map((para, pIdx) => {
                  if (para.startsWith("- ") || para.startsWith("1. ")) {
                    const lines = para.split("\n");
                    return (
                      <ul key={pIdx} className="space-y-1.5 pl-4 my-2">
                        {lines.map((l, lIdx) => {
                          const clean = l.replace(/^(-\s*|\d+\.\s*)/, "");
                          // Format bold text
                          const parts = clean.split(/(\*\*.*?\*\*)/g);
                          return (
                            <li key={lIdx} className="list-disc text-slate-700">
                              {parts.map((pt, ptIdx) => {
                                if (pt.startsWith("**") && pt.endsWith("**")) {
                                  return (
                                    <strong key={ptIdx} className="text-slate-900 font-semibold">
                                      {pt.slice(2, -2)}
                                    </strong>
                                  );
                                }
                                return pt;
                              })}
                            </li>
                          );
                        })}
                      </ul>
                    );
                  }

                  const parts = para.split(/(\*\*.*?\*\*)/g);
                  return (
                    <p key={pIdx} className="leading-relaxed">
                      {parts.map((pt, ptIdx) => {
                        if (pt.startsWith("**") && pt.endsWith("**")) {
                          return (
                            <strong key={ptIdx} className="text-slate-900 font-semibold">
                              {pt.slice(2, -2)}
                            </strong>
                          );
                        }
                        return pt;
                      })}
                    </p>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>หลักสูตรสมบูรณ์ 6 Chapters 24 Steps อ้างอิง MarcusCode</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer shadow-sm"
          >
            เริ่มเข้าสู่บทเรียน 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
