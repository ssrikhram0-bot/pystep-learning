"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Download,
  ArrowLeft,
  Award,
  CheckCircle2,
  Lock,
  Sparkles,
  ShieldCheck,
  Code2,
  User,
  ExternalLink,
} from "lucide-react";

interface CertificateUser {
  id: string;
  name: string;
  email?: string;
  role?: string;
  xp: number;
  completedStepIds: number[];
  isCompletedAll?: boolean;
  completionDate?: string;
}

function CertificateContent() {
  const searchParams = useSearchParams();
  const userIdParam = searchParams.get("userId");

  const [userData, setUserData] = useState<CertificateUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [adminPreview, setAdminPreview] = useState(false);
  const [quickIssuing, setQuickIssuing] = useState(false);
  const [issueDate, setIssueDate] = useState("");
  const certificateRef = useRef<HTMLDivElement>(null);

  const TOTAL_STEPS = 24;

  const handleQuickIssue = async () => {
    if (!userData?.id || quickIssuing) return;
    setQuickIssuing(true);
    try {
      const res = await fetch(`/api/admin/users/${userData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unlockCertificate: true }),
      });
      const data = await res.json();
      if (data.success) {
        setUserData((prev) =>
          prev
            ? {
                ...prev,
                isCompletedAll: true,
                completedStepIds: Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1),
              }
            : null
        );
        setAdminPreview(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setQuickIssuing(false);
    }
  };

  useEffect(() => {
    const url = userIdParam
      ? `/api/certificate?userId=${encodeURIComponent(userIdParam)}`
      : `/api/certificate`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUserData(data.user);
          if (data.user.completionDate) {
            const dateObj = new Date(data.user.completionDate);
            setIssueDate(
              dateObj.toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            );
          }
        } else {
          // Fallback if not logged in
          setUserData(null);
        }
      })
      .catch((err) => {
        console.error("Failed to load certificate:", err);
      })
      .finally(() => {
        setLoading(false);
        if (!issueDate) {
          const today = new Date();
          setIssueDate(
            today.toLocaleDateString("th-TH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          );
        }
      });
  }, [userIdParam]);

  // Fallback pure HTML5 Canvas drawing (bulletproof across all browsers & OS)
  const downloadWithPureCanvas = (studentName: string, studentEmail: string, certId: string, certDate: string) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1920;
    canvas.height = 1358;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context not supported");

    // 1. Background
    const bgGradient = ctx.createLinearGradient(0, 0, 1920, 1358);
    bgGradient.addColorStop(0, "#FCFAF2");
    bgGradient.addColorStop(0.5, "#FFFFFF");
    bgGradient.addColorStop(1, "#FAF6EA");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1920, 1358);

    // 2. Borders
    // Outer Gold Border
    ctx.strokeStyle = "#D4AF37";
    ctx.lineWidth = 12;
    ctx.strokeRect(40, 40, 1840, 1278);

    // Inner Delicate Border
    ctx.strokeStyle = "#B8860B";
    ctx.lineWidth = 3;
    ctx.strokeRect(60, 60, 1800, 1238);

    // Fine inner outline
    ctx.strokeStyle = "#F3E5AB";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(70, 70, 1780, 1218);

    // 3. Corner Ornaments
    const drawCorner = (x: number, y: number, angle: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = "#B8860B";
      ctx.fillRect(0, 0, 45, 6);
      ctx.fillRect(0, 0, 6, 45);
      ctx.restore();
    };
    drawCorner(85, 85, 0);
    drawCorner(1835, 85, Math.PI / 2);
    drawCorner(1835, 1273, Math.PI);
    drawCorner(85, 1273, -Math.PI / 2);

    // 4. Header & Platform
    ctx.textAlign = "center";
    ctx.fillStyle = "#996515";
    ctx.font = "bold 22px 'Prompt', 'Noto Sans Thai', sans-serif";
    ctx.fillText("★   PYSTEP — PYTHON CODE LEARNING PLATFORM   ★", 960, 160);

    // 5. Title
    ctx.fillStyle = "#1E293B";
    ctx.font = "900 64px 'Times New Roman', serif";
    ctx.fillText("CERTIFICATE OF ACHIEVEMENT", 960, 260);

    ctx.fillStyle = "#856404";
    ctx.font = "600 24px 'Prompt', 'Noto Sans Thai', sans-serif";
    ctx.fillText("ประกาศนียบัตรฉบับนี้ให้ไว้เพื่อแสดงว่า", 960, 320);

    // 6. Student Name
    ctx.fillStyle = "#0F172A";
    ctx.font = "bold 68px 'Prompt', 'Noto Sans Thai', sans-serif";
    ctx.fillText(studentName, 960, 450);

    // Underline
    ctx.strokeStyle = "#D4AF37";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(460, 485);
    ctx.lineTo(1460, 485);
    ctx.stroke();

    // Student Email
    if (studentEmail) {
      ctx.fillStyle = "#64748B";
      ctx.font = "bold 20px monospace";
      ctx.fillText(`(${studentEmail})`, 960, 525);
    }

    // 7. Course Details
    ctx.fillStyle = "#475569";
    ctx.font = "500 26px 'Prompt', 'Noto Sans Thai', sans-serif";
    ctx.fillText("ได้ผ่านการฝึกอบรมและสำเร็จหลักสูตรการเขียนโปรแกรมภาษา Python", 960, 630);

    ctx.fillStyle = "#1E293B";
    ctx.font = "bold 42px 'Prompt', 'Noto Sans Thai', sans-serif";
    ctx.fillText("« Python Programming Mastery »", 960, 710);

    ctx.fillStyle = "#64748B";
    ctx.font = "400 20px 'Prompt', 'Noto Sans Thai', sans-serif";
    ctx.fillText(
      "รวมระยะเวลา 6 บทเรียน 24 หัวข้อเชิงลึก ครอบคลุมไวยากรณ์พื้นฐาน, ตัวแปร, Control Flow, ลูป,",
      960,
      780
    );
    ctx.fillText(
      "โครงสร้างข้อมูล, ฟังก์ชัน, การจัดการข้อยกเว้น และ Capstone Project ผ่านเกณฑ์ 100%",
      960,
      815
    );

    // 8. Signatures & Seals
    // Left: Academic Council
    ctx.fillStyle = "#0F172A";
    ctx.font = "italic bold 32px 'Times New Roman', serif";
    ctx.fillText("PyStep Academic Council", 400, 1060);

    ctx.strokeStyle = "#94A3B8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(250, 1085);
    ctx.lineTo(550, 1085);
    ctx.stroke();

    ctx.fillStyle = "#334155";
    ctx.font = "bold 18px 'Prompt', 'Noto Sans Thai', sans-serif";
    ctx.fillText("ประธานหลักสูตรวิชาการ", 400, 1120);

    ctx.fillStyle = "#64748B";
    ctx.font = "400 16px 'Prompt', sans-serif";
    ctx.fillText("PyStep Coding Academy", 400, 1150);

    // Center: Gold Seal
    ctx.save();
    ctx.beginPath();
    ctx.arc(960, 1060, 75, 0, Math.PI * 2);
    const sealGradient = ctx.createLinearGradient(900, 1000, 1020, 1120);
    sealGradient.addColorStop(0, "#FFDF73");
    sealGradient.addColorStop(0.5, "#D4AF37");
    sealGradient.addColorStop(1, "#AA771C");
    ctx.fillStyle = sealGradient;
    ctx.fill();
    ctx.strokeStyle = "#856404";
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 6]);
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = "#5B4000";
    ctx.font = "900 16px sans-serif";
    ctx.fillText("OFFICIAL", 960, 1045);
    ctx.fillText("VERIFIED", 960, 1070);
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("EXCELLENCE", 960, 1090);

    ctx.fillStyle = "#64748B";
    ctx.font = "bold 18px monospace";
    ctx.fillText(`ID: ${certId}`, 960, 1165);

    // Right: Date
    ctx.fillStyle = "#0F172A";
    ctx.font = "bold 26px 'Prompt', 'Noto Sans Thai', sans-serif";
    ctx.fillText(certDate, 1520, 1060);

    ctx.strokeStyle = "#94A3B8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(1370, 1085);
    ctx.lineTo(1670, 1085);
    ctx.stroke();

    ctx.fillStyle = "#334155";
    ctx.font = "bold 18px 'Prompt', 'Noto Sans Thai', sans-serif";
    ctx.fillText("วันที่ออกประกาศนียบัตร", 1520, 1120);

    ctx.fillStyle = "#64748B";
    ctx.font = "bold 16px monospace";
    ctx.fillText(`Total Score: ${userData?.xp || 2400} XP`, 1520, 1150);

    // Export & Download
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    const cleanName = studentName.replace(/\s+/g, "_");
    link.download = `PyStep_Certificate_${cleanName}.png`;
    link.href = dataUrl;
    link.click();
  };

  // Download certificate as high-resolution PNG image
  const handleDownloadImage = async () => {
    if (downloading) return;
    setDownloading(true);

    const studentName = userData?.name || "Student";
    const studentEmail = userData?.email || "";
    const certId = `PY-${userData?.id?.slice(0, 8).toUpperCase() || "2026-CERT"}`;
    const certDate = issueDate || new Date().toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" });

    try {
      // 1. Try html-to-image first
      if (certificateRef.current) {
        try {
          const { toPng } = await import("html-to-image");
          const dataUrl = await toPng(certificateRef.current, {
            quality: 1.0,
            pixelRatio: 2,
            backgroundColor: "#ffffff",
            cacheBust: true,
          });
          const link = document.createElement("a");
          const cleanName = studentName.replace(/\s+/g, "_");
          link.download = `PyStep_Certificate_${cleanName}.png`;
          link.href = dataUrl;
          link.click();
          return;
        } catch (domErr) {
          console.warn("html-to-image export encountered an issue, falling back to pure canvas:", domErr);
        }
      }

      // 2. Fallback to bulletproof pure Canvas 2D
      downloadWithPureCanvas(studentName, studentEmail, certId, certDate);
    } catch (err) {
      console.error("Failed to generate certificate image:", err);
      try {
        downloadWithPureCanvas(studentName, studentEmail, certId, certDate);
      } catch (finalErr) {
        console.error("Canvas fallback also failed:", finalErr);
        alert("ไม่สามารถสร้างไฟล์รูปได้ กรุณาลองใหม่อีกครั้ง");
      }
    } finally {
      setDownloading(false);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">กำลังตรวจสอบข้อมูลใบประกาศนียบัตร...</p>
        </div>
      </div>
    );
  }

  // If user is Admin (Admin shouldn't have a personal certificate)
  if (userData?.role === "admin" && !userIdParam) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 relative">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-xl text-center space-y-5 z-10">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto text-purple-600 shadow-inner">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">บัญชีผู้ดูแลระบบ (Admin)</h1>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              เกียรติบัตรนี้มีไว้สำหรับผู้เรียนที่ผ่านหลักสูตรครบ 24 สเต็ป <br />
              แอดมินสามารถเปิดดูและดาวน์โหลดเกียรติบัตรของผู้เรียนแต่ละท่านได้จากหน้า <strong>ทำเนียบเกียรติบัตร</strong> ในระบบหลังบ้าน
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/admin"
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Award size={15} />
              <span>ไปที่ทำเนียบเกียรติบัตรผู้เรียน (Admin)</span>
            </Link>
            <Link
              href="/learn"
              className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-all"
            >
              เข้าห้องเรียน Python
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const completedCount = userData?.completedStepIds?.length || 0;
  const isCompletedAll = completedCount >= TOTAL_STEPS;

  // If student hasn't completed all 24 steps and not in adminPreview mode
  if (!isCompletedAll && !adminPreview) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 relative overflow-hidden">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-xl text-center space-y-6 z-10">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-600 ring-8 ring-amber-50">
            <Lock size={36} />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              ยังไม่สำเร็จหลักสูตร
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              ผู้เรียน <strong className="text-slate-800">{userData?.name || "ท่านนี้"}</strong> สำเร็จไปแล้ว{" "}
              <span className="font-bold text-emerald-600">{completedCount}</span> จากทั้งหมด {TOTAL_STEPS} สเต็ป
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5 text-left">
            <div className="flex justify-between text-xs font-mono font-bold text-slate-600">
              <span>ความคืบหน้า</span>
              <span>{Math.round((completedCount / TOTAL_STEPS) * 100)}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-700"
                style={{ width: `${(completedCount / TOTAL_STEPS) * 100}%` }}
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            {userIdParam ? (
              <>
                <button
                  onClick={() => setAdminPreview(true)}
                  className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Award size={15} />
                  <span>ดูตัวอย่างเกียรติบัตรของผู้เรียนคนนี้ (Admin Preview)</span>
                </button>

                <button
                  onClick={handleQuickIssue}
                  disabled={quickIssuing}
                  className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles size={14} />
                  <span>{quickIssuing ? "กำลังปลดล็อก..." : "⚡ ปลดล็อก 24 สเต็ปและออกเกียรติบัตรทันที"}</span>
                </button>
              </>
            ) : (
              <Link
                href="/learn"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/20 hover:from-emerald-500 hover:to-cyan-500 transition-all flex items-center justify-center gap-2"
              >
                <span>ลุยต่ออีก {TOTAL_STEPS - completedCount} สเต็ป ให้ครบ! 🚀</span>
              </Link>
            )}

            {/* แสดงลิงก์กลับสู่ระบบผู้ดูแลเฉพาะบัญชีที่เป็น Admin เท่านั้น */}
            {(userData?.role === "admin" || userData?.name === "admin" || Boolean(userIdParam)) && (
              <Link
                href="/admin"
                className="text-xs text-slate-400 hover:text-slate-700 transition-colors pt-1"
              >
                กลับสู่ระบบผู้ดูแล (Admin)
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 py-8 px-4 flex flex-col items-center justify-center selection:bg-amber-400 selection:text-slate-950">
      {/* ── Top Bar Controls ── */}
      <div className="w-full max-w-[1050px] mb-5 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href={userIdParam ? "/admin" : "/learn"}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>{userIdParam ? "กลับสู่แดชบอร์ดแอดมิน (Admin)" : "กลับไปยังห้องเรียน"}</span>
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Download Image Button */}
          <button
            onClick={handleDownloadImage}
            disabled={downloading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <Download size={16} className={downloading ? "animate-bounce" : ""} />
            <span>{downloading ? "กำลังสร้างไฟล์รูป..." : "ดาวน์โหลดลงเครื่อง (PNG)"}</span>
          </button>

        </div>
      </div>

      {/* Mobile scroll hint */}
      <div className="w-full max-w-[1050px] mb-2 px-1 text-center md:hidden text-xs text-slate-500 font-medium">
        💡 แตะหรือเลื่อนซ้าย-ขวา เพื่อดูเกียรติบัตรเต็มแผ่น หรือกดปุ่มดาวน์โหลดภาพ (PNG) ความละเอียดสูง
      </div>

      {/* ── Printable Certificate Canvas (A4 Landscape) ── */}
      <div className="w-full max-w-[1050px] overflow-x-auto pb-4">
        <div
          ref={certificateRef}
          id="certificate-print-area"
          className="certificate-container w-full min-w-[680px] md:min-w-0 max-w-[1050px] aspect-[1.414/1] bg-white text-slate-900 shadow-2xl rounded-2xl relative p-6 sm:p-12 overflow-hidden border-2 border-slate-200 select-none print:shadow-none print:border-none print:m-0 print:p-8 print:w-full print:rounded-none"
        >
        {/* Outer Gold Border Frame */}
        <div className="absolute inset-4 sm:inset-6 border-[3px] border-[#D4AF37] rounded-xl pointer-events-none" />
        <div className="absolute inset-5 sm:inset-7 border border-[#F3E5AB] rounded-lg pointer-events-none" />

        {/* Corner Accents */}
        <div className="absolute top-6 left-6 w-12 h-12 border-t-4 border-l-4 border-[#B8860B] pointer-events-none" />
        <div className="absolute top-6 right-6 w-12 h-12 border-t-4 border-r-4 border-[#B8860B] pointer-events-none" />
        <div className="absolute bottom-6 left-6 w-12 h-12 border-b-4 border-l-4 border-[#B8860B] pointer-events-none" />
        <div className="absolute bottom-6 right-6 w-12 h-12 border-b-4 border-r-4 border-[#B8860B] pointer-events-none" />

        {/* Certificate Content */}
        <div className="h-full flex flex-col justify-between items-center text-center relative z-10 px-4 sm:px-12 py-2">
          {/* Header & Logo */}
          <div className="space-y-2 mt-2">
            <div className="flex items-center justify-center gap-2 text-[#996515] font-black tracking-widest text-xs uppercase">
              <Award size={20} className="text-[#D4AF37]" />
              <span>PyStep — Python Code Learning Platform</span>
              <Award size={20} className="text-[#D4AF37]" />
            </div>

            <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-wider text-[#1E293B] uppercase pt-2">
              CERTIFICATE OF ACHIEVEMENT
            </h1>
            <p className="text-xs sm:text-sm tracking-widest text-[#856404] font-medium uppercase">
              ประกาศนียบัตรฉบับนี้ให้ไว้เพื่อแสดงว่า
            </p>
          </div>

          {/* Student Name */}
          <div className="my-auto py-4 space-y-2 w-full max-w-2xl border-b-2 border-[#D4AF37]/50">
            <div className="text-3xl sm:text-5xl font-black text-[#0F172A] tracking-normal font-sans py-1">
              {userData?.name || "ผู้สำเร็จการศึกษา"}
            </div>
            {userData?.email && (
              <p className="text-xs font-mono text-slate-400">
                ({userData.email})
              </p>
            )}
          </div>

          {/* Achievement Description */}
          <div className="space-y-3 max-w-2xl text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p className="font-medium">
              ได้ผ่านการฝึกอบรมและสำเร็จหลักสูตรการเขียนโปรแกรมภาษา Python
            </p>
            <p className="text-base sm:text-lg font-bold text-slate-800 tracking-wide font-sans">
              « Python Programming Mastery »
            </p>
            <p className="text-xs text-slate-500">
              รวมระยะเวลา 6 บทเรียน 24 หัวข้อเชิงลึก ครอบคลุมไวยากรณ์พื้นฐาน, ตัวแปร, Control Flow, ลูป,
              โครงสร้างข้อมูล, ฟังก์ชัน, การจัดการข้อยกเว้น และ Capstone Project ผ่านเกณฑ์ 100%
            </p>
          </div>

          {/* Signatures & Seal Footer */}
          <div className="w-full flex items-end justify-between pt-6 mt-4 px-4 sm:px-8 border-t border-slate-200/60">
            {/* Instructor Signature */}
            <div className="text-center space-y-1">
              <div className="font-serif italic text-lg sm:text-xl text-[#0F172A] font-bold">
                PyStep Academic Council
              </div>
              <div className="w-36 h-0.5 bg-slate-400 mx-auto" />
              <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                ประธานหลักสูตรวิชาการ
              </p>
              <p className="text-[10px] text-slate-400">PyStep Coding Academy</p>
            </div>

            {/* Gold Seal / Badge */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#FFDF73] to-[#AA771C] p-1 shadow-lg flex items-center justify-center">
                <div className="w-full h-full rounded-full border-2 border-dashed border-[#856404] flex flex-col items-center justify-center text-center p-1 bg-white/20 backdrop-blur-xs">
                  <ShieldCheck size={28} className="text-[#5B4000]" />
                  <span className="text-[8px] font-black text-[#5B4000] tracking-tighter uppercase leading-none mt-1">
                    OFFICIAL VERIFIED
                  </span>
                  <span className="text-[7px] text-[#5B4000] font-bold leading-none mt-0.5">
                    EXCELLENCE
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 font-mono">
                ID: PY-{userData?.id?.slice(0, 8).toUpperCase() || "2026-CERT"}
              </span>
            </div>

            {/* Issue Date */}
            <div className="text-center space-y-1">
              <div className="text-xs sm:text-sm font-bold text-slate-800">
                {issueDate}
              </div>
              <div className="w-36 h-0.5 bg-slate-400 mx-auto" />
              <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                วันที่ออกประกาศนียบัตร
              </p>
              <p className="text-[10px] text-slate-400 font-mono">
                Total Score: {userData?.xp || 2400} XP
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default function CertificatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CertificateContent />
    </Suspense>
  );
}
