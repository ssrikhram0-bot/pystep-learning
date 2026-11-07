"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PremiumAuthForm } from "@/components/ui/premium-auth";
import { ArrowLeft, Code2 } from "lucide-react";

function AuthFormCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode");
  const defaultMode = modeParam === "signin" ? "signin" : "signup";

  const handleAuthSubmit = async (
    values: Record<string, string>,
    mode: "signin" | "signup"
  ) => {
    const name = Object.entries(values).find(([k]) => k.includes("name"))?.[1] || "";
    const email = Object.entries(values).find(([k]) => k.includes("email"))?.[1] || "";
    const password =
      Object.entries(values).find(
        ([k]) => k.includes("password") && !k.includes("confirm")
      )?.[1] || "";

    const endpoint = mode === "signin" ? "/api/auth/signin" : "/api/auth/signup";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "เกิดข้อผิดพลาดในการดำเนินการ");
    }

    setTimeout(() => {
      if (data.user?.role === "admin" || data.user?.name === "admin" || email === "admin@pystep.com") {
        router.push("/admin");
      } else {
        router.push("/learn");
      }
    }, 300);
  };

  return (
    <div className="w-full max-w-md z-10 shadow-xl rounded-2xl overflow-hidden border border-slate-200/80 bg-white">
      <PremiumAuthForm defaultMode={defaultMode} onSubmit={handleAuthSubmit} />
    </div>
  );
}

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Soft Glows & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Back Link */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>กลับสู่หน้าแรก</span>
        </Link>
        <div className="flex items-center gap-1.5 text-slate-800 font-bold text-sm">
          <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow-xs">
            <Code2 size={14} />
          </div>
          <span>PyStep</span>
        </div>
      </div>

      <Suspense fallback={<div className="w-full max-w-md h-96 bg-white rounded-2xl animate-pulse" />}>
        <AuthFormCard />
      </Suspense>
    </div>
  );
}
