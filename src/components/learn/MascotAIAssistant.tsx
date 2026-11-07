"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Sparkles,
  X,
  Send,
  Lightbulb,
  AlertCircle,
  Code2,
  RefreshCw,
  Bot,
  Zap,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";
import { Mascot } from "@/lib/mascots";
import { cn } from "@/lib/utils";

interface MascotAIAssistantProps {
  mascot: Mascot;
  code: string;
  stepTitle: string;
  stepGoal: string;
  runError: string | null;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  externalTriggerAction?: "hint" | "fix_error" | "review" | null;
  onClearTrigger?: () => void;
}

interface Message {
  id: string;
  sender: "user" | "mascot";
  text: string;
  timestamp: Date;
  isHint?: boolean;
  isErrorFix?: boolean;
}

export function MascotAIAssistant({
  mascot,
  code,
  stepTitle,
  stepGoal,
  runError,
  isOpen,
  onClose,
  onOpen,
  externalTriggerAction,
  onClearTrigger,
}: MascotAIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      sender: "mascot",
      text: `สวัสดี! เราคือ ${mascot.name} 🌟 พี่เลี้ยง AI ส่วนตัวของคุณ มีข้อสงสัยเรื่องโค้ด Python หรืออยากได้คำใบ้ด่าน "${stepTitle}" ถามเราได้ตลอดเลยนะ!`,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isLoading]);

  // Handle external trigger (e.g. user clicked "Ask Mascot about Error" or "Ask for Hint")
  useEffect(() => {
    if (!externalTriggerAction) return;

    if (externalTriggerAction === "hint") {
      handleRequestAI("hint", "💡 ขอคำใบ้สำหรับด่านนี้หน่อยครับ");
    } else if (externalTriggerAction === "fix_error" && runError) {
      handleRequestAI("fix_error", `⚠️ โค้ดติด Error นี้ ช่วยดูให้หน่อยครับ:\n${runError}`);
    } else if (externalTriggerAction === "review") {
      handleRequestAI("review", "✨ ช่วยตรวจรีวิวโค้ดที่ผมเขียนหน่อยครับ");
    }

    if (onClearTrigger) onClearTrigger();
  }, [externalTriggerAction, runError]);

  const handleRequestAI = async (
    action: "hint" | "fix_error" | "review" | "chat",
    userPrompt: string
  ) => {
    if (isLoading) return;

    // Add user message to list
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: userPrompt,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/mascot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mascotName: mascot.name,
          action,
          code,
          stepTitle,
          stepGoal,
          error: runError || undefined,
          userMessage: action === "chat" ? userPrompt : undefined,
        }),
      });

      const data = await res.json();

      let reply = "";
      if (data.review) {
        reply = `⭐ **คะแนนโค้ด:** ${data.review.score}/100 (${data.review.status})
- **ความถูกต้อง:** ${data.review.correctness}
- **สไตล์โค้ด:** ${data.review.style}
- **ประสิทธิภาพ:** ${data.review.efficiency}

💬 **${mascot.name} ฝากบอก:** ${data.review.mascotPraise}`;
      } else if (data.text) {
        reply = data.text;
      } else if (data.error) {
        reply = `ขออภัยด้วยนะ เกิดข้อผิดพลาด: ${data.details || data.error}`;
      } else {
        reply = "ขออภัยด้วยนะ ดูเหมือนระบบ AI กำลังยุ่ง ลองใหม่อีกครั้งนะ!";
      }

      const mascotMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "mascot",
        text: reply,
        timestamp: new Date(),
        isHint: action === "hint",
        isErrorFix: action === "fix_error",
      };
      setMessages((prev) => [...prev, mascotMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "mascot",
          text: "เกิดข้อผิดพลาดในการเชื่อมต่อกับ Gemini AI ลองตรวจการเชื่อมต่ออินเทอร์เน็ตดูนะ!",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) return;

    setInputValue("");
    handleRequestAI("chat", trimmed);
  };

  return (
    <>
      {/* ── Floating Action Button (FAB) ── */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
          {/* Tooltip bubble */}
          <div className="hidden md:flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-slate-200 text-xs font-semibold text-slate-700 animate-bounce duration-1000">
            <Sparkles size={14} className="text-amber-500 animate-spin" />
            <span>ถาม <strong>{mascot.name}</strong> ได้นะ!</span>
          </div>

          <button
            onClick={onOpen}
            className={cn(
              "relative group p-1.5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer bg-gradient-to-tr",
              mascot.gradient || "from-cyan-400 to-blue-600"
            )}
            style={{ boxShadow: `0 10px 25px -5px ${mascot.auraGlow || "rgba(6,182,212,0.4)"}` }}
            aria-label="Open AI Mascot Assistant"
          >
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white bg-slate-900">
              <Image src={mascot.avatar} alt={mascot.name} fill className="object-cover" />
            </div>

            {/* AI badge */}
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 text-[10px] font-black text-white shadow-md border border-white/50 flex items-center gap-0.5">
              <Zap size={10} className="fill-amber-300 text-amber-300" />
              AI
            </span>
          </button>
        </div>
      )}

      {/* ── Slide-over Chat Drawer ── */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md h-full bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className={cn(
              "px-5 py-4 border-b border-white/20 text-white flex items-center justify-between bg-gradient-to-r",
              mascot.gradient || "from-cyan-500 to-blue-600"
            )}>
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-2xl overflow-hidden border-2 border-white/80 shadow-md">
                  <Image src={mascot.avatar} alt={mascot.name} fill className="object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-black text-base tracking-wide flex items-center gap-1">
                      {mascot.name} {mascot.emoji}
                    </h3>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-white/20 text-white border border-white/30 backdrop-blur-sm">
                      Gemini 3.8
                    </span>
                  </div>
                  <p className="text-xs text-white/80 font-medium">{mascot.title} • AI Mentor</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick action chips */}
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                disabled={isLoading}
                onClick={() => handleRequestAI("hint", "💡 ช่วยใบ้โจทย์ด่านนี้หน่อยครับ")}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-amber-200 text-amber-800 text-[11px] font-semibold hover:bg-amber-50 shrink-0 flex items-center gap-1 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
              >
                <Lightbulb size={12} className="text-amber-500" />
                ขอคำใบ้
              </button>

              <button
                disabled={isLoading}
                onClick={() => handleRequestAI("review", "✨ ช่วยตรวจโค้ดใน editor ให้หน่อยครับ")}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-purple-200 text-purple-800 text-[11px] font-semibold hover:bg-purple-50 shrink-0 flex items-center gap-1 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles size={12} className="text-purple-500" />
                ตรวจโค้ด
              </button>

              {runError && (
                <button
                  disabled={isLoading}
                  onClick={() => handleRequestAI("fix_error", `⚠️ ช่วยอธิบาย Error นี้ที:\n${runError}`)}
                  className="px-2.5 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[11px] font-semibold hover:bg-red-100 shrink-0 flex items-center gap-1 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                >
                  <AlertCircle size={12} className="text-red-500" />
                  แก้บั๊ก Error
                </button>
              )}
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
              {messages.map((m) => {
                const isMascot = m.sender === "mascot";
                return (
                  <div
                    key={m.id}
                    className={cn(
                      "flex gap-2.5 max-w-[90%]",
                      isMascot ? "self-start" : "self-end ml-auto flex-row-reverse"
                    )}
                  >
                    {isMascot && (
                      <div className="relative w-8 h-8 rounded-xl overflow-hidden shrink-0 border border-slate-200 shadow-2xs">
                        <Image src={mascot.avatar} alt={mascot.name} fill className="object-cover" />
                      </div>
                    )}

                    <div
                      className={cn(
                        "rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-xs whitespace-pre-wrap",
                        isMascot
                          ? "bg-white text-slate-800 border border-slate-200/90 rounded-tl-sm"
                          : "bg-slate-900 text-white rounded-tr-sm"
                      )}
                    >
                      {m.text}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex gap-2.5 self-start items-center text-xs text-slate-500">
                  <div className="relative w-8 h-8 rounded-xl overflow-hidden shrink-0 border border-slate-200 shadow-2xs animate-pulse">
                    <Image src={mascot.avatar} alt={mascot.name} fill className="object-cover" />
                  </div>
                  <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-2xl rounded-tl-sm flex items-center gap-2 shadow-xs">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
                    <span>{mascot.name} กำลังคิดคำตอบ...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`ถาม ${mascot.name} เกี่ยวกับ Python...`}
                disabled={isLoading}
                className="flex-1 bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-xs text-slate-800 rounded-xl px-3.5 py-2.5 border border-transparent focus:border-cyan-400 focus:outline-hidden transition-all placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className={cn(
                  "p-2.5 rounded-xl text-white shadow-md transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r",
                  mascot.gradient || "from-cyan-500 to-blue-600"
                )}
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
