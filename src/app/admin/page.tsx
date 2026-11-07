"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Users,
  Award,
  Sparkles,
  TrendingUp,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  XCircle,
  Database,
  ArrowRight,
  LogOut,
  RefreshCw,
  RotateCcw,
  Code2,
  ShieldCheck,
  Zap,
  Flame,
  Heart,
  BookOpen,
  Lock,
  ChevronRight,
  Download,
  Printer,
  X,
  Server,
  Layers,
  BarChart3,
  Menu,
  ChevronLeft,
  LayoutDashboard,
  Home,
} from "lucide-react";
import { MASCOTS, getMascotById } from "@/lib/mascots";
import { STEPS } from "@/lib/curriculumData";

interface UserItem {
  id: string;
  name: string;
  email: string | null;
  phoneNumber: string | null;
  role: string;
  selectedMascot: string;
  xp: number;
  streak: number;
  level: number;
  hearts: number;
  createdAt: string;
  updatedAt: string;
  completedStepsCount: number;
  isCertificateUnlocked: boolean;
  completedStepIds: number[];
}

interface StatsData {
  totalUsers: number;
  totalAdmins: number;
  regularLearners: number;
  totalCertificates: number;
  totalStepsCompleted: number;
  totalXp: number;
  averageXp: number;
  averageStreak: number;
  completionRate: number;
  databaseProvider: string;
  dbUrlDisplay: string;
}

interface MascotDistribution {
  mascot: string;
  count: number;
  percentage: number;
}

interface StepFunnelItem {
  stepId: number;
  count: number;
  percentage: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();

  // State
  const [activeTab, setActiveTab] = useState<"users" | "analytics" | "certificates" | "database">("users");
  const [stats, setStats] = useState<StatsData | null>(null);
  const [mascotDist, setMascotDist] = useState<MascotDistribution[]>([]);
  const [stepFunnel, setStepFunnel] = useState<StepFunnelItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [mascotFilter, setMascotFilter] = useState("all");
  const [certSubFilter, setCertSubFilter] = useState<"all" | "completed" | "in_progress" | "not_started">("all");
  const [certSearch, setCertSearch] = useState("");

  // Modals
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<UserItem | null>(null);

  // Form states for Add/Edit
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "user",
    selectedMascot: "StarPy",
    xp: 0,
    level: 1,
    streak: 1,
    hearts: 5,
    unlockCertificate: false,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Load Data
  const loadDashboardData = useCallback(async () => {
    try {
      setRefreshing(true);
      const [statsRes, usersRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/users"),
      ]);

      if (statsRes.status === 401 || usersRes.status === 401) {
        router.push("/admin/login");
        return;
      }

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();

      if (statsData.success) {
        setStats(statsData.stats);
        setMascotDist(statsData.mascotDistribution || []);
        setStepFunnel(statsData.stepFunnel || []);
      }

      if (usersData.success) {
        setUsers(usersData.users || []);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Handle Logout
  const handleLogout = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/admin/login");
  };

  // Open Edit Modal
  const handleOpenEdit = (user: UserItem) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      password: "",
      role: user.role,
      selectedMascot: user.selectedMascot || "StarPy",
      xp: user.xp,
      level: user.level,
      streak: user.streak,
      hearts: user.hearts,
      unlockCertificate: user.isCertificateUnlocked,
    });
    setFormError(null);
    setIsEditModalOpen(true);
  };

  // Submit Edit User
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setFormSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "บันทึกข้อมูลไม่สำเร็จ");
      }

      setIsEditModalOpen(false);
      loadDashboardData();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Error updating user");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Submit Create User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "สร้างผู้ใช้ไม่สำเร็จ");
      }

      setIsAddModalOpen(false);
      loadDashboardData();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Error creating user");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete User
  const handleDeleteUser = async () => {
    if (!deleteConfirmUser) return;
    try {
      const res = await fetch(`/api/admin/users/${deleteConfirmUser.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || "ไม่สามารถลบผู้ใช้นี้ได้");
        return;
      }
      setDeleteConfirmUser(null);
      loadDashboardData();
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการลบ");
    }
  };

  // Quick Action: Unlock all 24 steps
  const handleQuickUnlockCertificate = async (user: UserItem) => {
    if (!confirm(`ต้องการปลดล็อก 24 สเต็ปให้แก่ "${user.name}" เพื่อให้ได้รับเกียรติบัตรทันทีหรือไม่?`)) return;
    try {
      await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "unlock_all_steps" }),
      });
      loadDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  // Quick Action: Reset Progress
  const handleQuickResetProgress = async (user: UserItem) => {
    if (!confirm(`ยืนยันการรีเซ็ตผลการเรียนของ "${user.name}" กลับเป็น 0 หรือไม่?`)) return;
    try {
      await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_progress" }),
      });
      loadDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered Users List
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      searchTerm === "" ||
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.phoneNumber && u.phoneNumber.includes(searchTerm));

    const matchesRole = roleFilter === "all" || u.role === roleFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "certificate" && u.isCertificateUnlocked) ||
      (statusFilter === "in_progress" && !u.isCertificateUnlocked);

    const matchesMascot = mascotFilter === "all" || u.selectedMascot === mascotFilter;

    return matchesSearch && matchesRole && matchesStatus && matchesMascot;
  });

  // Exclude admin from all learner certificate lists
  const learners = users.filter((u) => u.role !== "admin" && u.name !== "admin");
  const certificateAchievers = learners.filter((u) => u.isCertificateUnlocked);
  const inProgressLearners = learners.filter((u) => !u.isCertificateUnlocked && u.completedStepsCount > 0);
  const notStartedLearners = learners.filter((u) => u.completedStepsCount === 0);

  // Filtered learners for Tab 3 (Certificates & Registry Hub)
  const filteredCertLearners = learners.filter((u) => {
    const matchesSearch =
      certSearch === "" ||
      u.name.toLowerCase().includes(certSearch.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(certSearch.toLowerCase())) ||
      (u.phoneNumber && u.phoneNumber.includes(certSearch));

    if (!matchesSearch) return false;

    if (certSubFilter === "completed") return u.isCertificateUnlocked;
    if (certSubFilter === "in_progress") return !u.isCertificateUnlocked && u.completedStepsCount > 0;
    if (certSubFilter === "not_started") return u.completedStepsCount === 0;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-400">กำลังโหลดระบบหลังบ้าน PyStep Admin...</p>
      </div>
    );
  }

  const menuItems = [
    { name: "Dashboard / ผู้เรียน", icon: LayoutDashboard, tab: "users" },
    { name: "สถิติและผลการเรียน", icon: BarChart3, tab: "analytics" },
    { name: "ทำเนียบเกียรติบัตร", icon: Award, tab: "certificates" },
    { name: "ห้องเรียน Python", icon: Home, href: "/learn" },
    { name: "ออกจากระบบ", icon: LogOut, action: handleLogout },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white font-sans relative">
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-3.5 left-4 z-50 p-2.5 rounded-xl bg-slate-900/95 text-white hover:bg-slate-800 transition-colors shadow-xl border border-slate-700 cursor-pointer backdrop-blur-md"
        aria-label="Toggle Navigation Menu"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-30 transition-opacity backdrop-blur-xs"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ─────────────────────────────────────────────────────────────
          1. FIXED COLLAPSIBLE SIDEBAR (Exact requested design)
      ──────────────────────────────────────────────────────────────── */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/80 transition-all duration-300 ease-in-out z-40 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ${
          isSidebarCollapsed ? "lg:w-20" : "lg:w-64"
        } w-64 shadow-2xl flex flex-col justify-between`}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-700/80">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shrink-0 shadow-md">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              {!isSidebarCollapsed && (
                <div className="min-w-0">
                  <h1 className="text-lg font-bold text-white tracking-wide truncate flex items-center gap-1.5">
                    PyStep <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-bold border border-purple-500/30">ADMIN</span>
                  </h1>
                </div>
              )}
            </div>

            {/* Desktop Collapse Button */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:block p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors duration-200 cursor-pointer"
              title={isSidebarCollapsed ? "ขยายเมนู" : "ย่อเมนู"}
            >
              <ChevronLeft
                size={18}
                className={`transition-transform duration-300 ${
                  isSidebarCollapsed ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Navigation */}
          <nav className="p-3 space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.tab ? activeTab === item.tab : false;

              if (item.href) {
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="w-full flex items-center space-x-3 px-3.5 py-3 rounded-lg text-slate-300 hover:bg-slate-700/60 hover:text-white transition-all duration-200 group"
                  >
                    <Icon size={19} className="text-slate-400 group-hover:text-white transition-colors shrink-0" />
                    {!isSidebarCollapsed && (
                      <span className="font-medium text-xs truncate">
                        {item.name}
                      </span>
                    )}
                  </Link>
                );
              }

              return (
                <button
                  key={item.name}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else if (item.tab) {
                      setActiveTab(item.tab as "users" | "analytics" | "certificates" | "database");
                      setIsSidebarOpen(false);
                    }
                  }}
                  className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-lg transition-all duration-200 group cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-600/20"
                      : "text-slate-300 hover:bg-slate-700/60 hover:text-white"
                  }`}
                >
                  <Icon
                    size={19}
                    className={`transition-colors duration-200 shrink-0 ${
                      isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                    }`}
                  />
                  {!isSidebarCollapsed && (
                    <span className="font-medium text-xs truncate">
                      {item.name}
                    </span>
                  )}

                  {/* Active indicator */}
                  {isActive && !isSidebarCollapsed && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full opacity-90 shrink-0 shadow-xs" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Profile */}
        {!isSidebarCollapsed && (
          <div className="p-4 border-t border-slate-700/80 bg-slate-900/40">
            <div className="flex items-center space-x-3 px-1 py-1">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-md">
                AD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate flex items-center gap-1">
                  admin <ShieldCheck size={12} className="text-emerald-400" />
                </p>
                <p className="text-[11px] text-slate-400 truncate font-mono">
                  admin@pystep.com
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN CONTENT AREA (Offset by sidebar width)
      ──────────────────────────────────────────────────────────────── */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out min-w-0 ${
          isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        {/* Top Bar inside Content Area */}
        <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3 ml-12 lg:ml-0">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                {activeTab === "users" && (
                  <>
                    <LayoutDashboard size={17} className="text-blue-400" />
                    <span>Dashboard & รายชื่อผู้เรียน</span>
                  </>
                )}
                {activeTab === "analytics" && (
                  <>
                    <BarChart3 size={17} className="text-emerald-400" />
                    <span>สถิติและผลการเรียน (Analytics Funnel)</span>
                  </>
                )}
                {activeTab === "certificates" && (
                  <>
                    <Award size={17} className="text-amber-400" />
                    <span>ทำเนียบผู้สำเร็จหลักสูตร (Certificates)</span>
                  </>
                )}
                {activeTab === "database" && (
                  <>
                    <Database size={17} className="text-cyan-400" />
                    <span>การเชื่อมต่อฐานข้อมูล (Database Status)</span>
                  </>
                )}
              </h2>
              <p className="text-[11px] text-slate-400">
                ระบบบริหารจัดการหลังบ้าน PyStep สำหรับแอดมิน
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={loadDashboardData}
              disabled={refreshing}
              title="รีเฟรชข้อมูล"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
            </button>

            <Link
              href="/learn"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Home size={14} className="text-blue-400" />
              <span className="hidden sm:inline">ห้องเรียน</span>
            </Link>
          </div>
        </header>

        {/* KPI STATS OVERVIEW CARDS */}
        <section className="w-full px-6 pt-5">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            {/* Total Learners */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-400">ผู้เรียนทั้งหมด</span>
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <Users size={15} />
                </div>
              </div>
              <p className="text-2xl font-black text-white">{stats?.totalUsers || 0}</p>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                <span>แอดมิน {stats?.totalAdmins || 0} คน</span>
                <span>•</span>
                <span className="text-blue-400 font-semibold">{stats?.regularLearners || 0} ผู้เรียน</span>
              </div>
            </div>

            {/* Certificates Issued */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-400">ใบประกาศนียบัตร</span>
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Award size={15} />
                </div>
              </div>
              <p className="text-2xl font-black text-amber-400">
                {stats?.totalCertificates || 0}
              </p>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                <span className="text-emerald-400 font-semibold">{stats?.completionRate || 0}%</span>
                <span>อัตราจบหลักสูตร</span>
              </div>
            </div>

            {/* Total Steps Cleared */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-400">สเต็ปที่ผ่านสะสม</span>
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 size={15} />
                </div>
              </div>
              <p className="text-2xl font-black text-emerald-400">
                {stats?.totalStepsCompleted || 0}
              </p>
              <div className="text-[11px] text-slate-500 mt-1">
                จากหลักสูตร 24 ขั้นตอน
              </div>
            </div>

            {/* Platform XP */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-400">XP รวมทั้งระบบ</span>
                <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <Sparkles size={15} />
                </div>
              </div>
              <p className="text-2xl font-black text-purple-400">
                {(stats?.totalXp || 0).toLocaleString()}
              </p>
              <div className="text-[11px] text-slate-500 mt-1">
                เฉลี่ย {stats?.averageXp || 0} XP/คน
              </div>
            </div>

            {/* Average Streak */}
            <div className="col-span-2 lg:col-span-1 p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-400">Streak เฉลี่ย</span>
                <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center">
                  <Flame size={15} />
                </div>
              </div>
              <p className="text-2xl font-black text-orange-400">
                {stats?.averageStreak || 0} <span className="text-xs font-normal text-slate-400">วัน</span>
              </p>
              <div className="text-[11px] text-slate-500 mt-1">
                ความต่อเนื่องในการเรียน
              </div>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT TABS */}
        <main className="w-full px-6 py-5 flex-1">
        {/* ══════════════ TAB 1: USER MANAGEMENT ══════════════ */}
        {activeTab === "users" && (
          <div className="space-y-4">
            {/* Action Bar (Search & Filter) */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
              <div className="flex flex-wrap items-center gap-2.5 flex-1">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ค้นหาชื่อ, อีเมล, เบอร์โทร..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Role Filter */}
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
                >
                  <option value="all">บทบาท: ทั้งหมด</option>
                  <option value="admin">แอดมิน (Admin)</option>
                  <option value="user">ผู้เรียน (User)</option>
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
                >
                  <option value="all">สถานะ: ทั้งหมด</option>
                  <option value="certificate">จบหลักสูตร (24/24)</option>
                  <option value="in_progress">กำลังเรียน</option>
                </select>

                {/* Mascot Filter */}
                <select
                  value={mascotFilter}
                  onChange={(e) => setMascotFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
                >
                  <option value="all">มาสคอต: ทั้งหมด</option>
                  {MASCOTS.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.emoji} {m.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Add User Button */}
              <button
                onClick={() => {
                  setFormData({
                    name: "",
                    email: "",
                    phoneNumber: "",
                    password: "user1234",
                    role: "user",
                    selectedMascot: "StarPy",
                    xp: 100,
                    level: 1,
                    streak: 1,
                    hearts: 5,
                    unlockCertificate: false,
                  });
                  setFormError(null);
                  setIsAddModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <Plus size={15} />
                <span>เพิ่มผู้เรียนใหม่</span>
              </button>
            </div>

            {/* Result Counter & Hint */}
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span className="flex items-center gap-1.5 font-medium">
                <Users size={14} className="text-emerald-400" />
                แสดง <strong className="text-white font-mono">{filteredUsers.length}</strong> จากทั้งหมด <strong className="text-white font-mono">{users.length}</strong> บัญชี
              </span>
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                💡 คลิกที่แถวหรือชื่อเพื่อเปิดดูรายละเอียดประวัติการเรียนแบบละเอียด
              </span>
            </div>

            {/* Users Data Table */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px] font-bold">
                    <tr>
                      <th className="py-3 px-4">ผู้ใช้งาน</th>
                      <th className="py-3 px-3">บทบาท</th>
                      <th className="py-3 px-3">มาสคอต</th>
                      <th className="py-3 px-3">ความคืบหน้า (24 Steps)</th>
                      <th className="py-3 px-3">Level / XP</th>
                      <th className="py-3 px-3">เกียรติบัตร</th>
                      <th className="py-3 px-4 text-right">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-500 font-medium">
                          ไม่พบข้อมูลผู้เรียนที่ตรงตามเงื่อนไข
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => {
                        const mascotObj = getMascotById(u.selectedMascot);
                        const progressPercent = Math.round((u.completedStepsCount / 24) * 100);

                        return (
                          <tr
                            key={u.id}
                            onClick={(e) => {
                              const target = e.target as HTMLElement;
                              if (target.closest("button") || target.closest("a")) return;
                              setSelectedUser(u);
                              setIsViewModalOpen(true);
                            }}
                            className="hover:bg-slate-800/60 transition-colors cursor-pointer group"
                          >
                            {/* User details */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-slate-700 shrink-0 group-hover:border-emerald-400 transition-colors">
                                  <Image src={mascotObj.avatar} alt={u.name} fill className="object-cover" />
                                </div>
                                <div>
                                  <p className="font-bold text-white text-xs sm:text-sm group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                                    {u.name}
                                    <span className="opacity-0 group-hover:opacity-100 text-[10px] text-emerald-400 font-normal transition-opacity flex items-center gap-0.5">
                                      <Eye size={10} /> ดูรายละเอียด
                                    </span>
                                  </p>
                                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                                    <span>{u.email || "-"}</span>
                                    {u.phoneNumber && <span>• {u.phoneNumber}</span>}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Role */}
                            <td className="py-3.5 px-3">
                              {u.role === "admin" ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                                  <ShieldCheck size={11} /> ADMIN
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-medium">
                                  LEARNER
                                </span>
                              )}
                            </td>

                            {/* Mascot */}
                            <td className="py-3.5 px-3">
                              <span className="text-xs text-slate-300 font-medium flex items-center gap-1">
                                <span>{mascotObj.emoji}</span>
                                <span>{mascotObj.name}</span>
                              </span>
                            </td>

                            {/* Progress */}
                            <td className="py-3.5 px-3 min-w-[140px]">
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="font-mono text-slate-300 font-bold">
                                    {u.completedStepsCount} / 24
                                  </span>
                                  <span className="text-slate-400 font-mono">{progressPercent}%</span>
                                </div>
                                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all duration-500 ${
                                      u.isCertificateUnlocked ? "bg-amber-400" : "bg-emerald-500"
                                    }`}
                                    style={{ width: `${progressPercent}%` }}
                                  />
                                </div>
                              </div>
                            </td>

                            {/* Level / XP */}
                            <td className="py-3.5 px-3">
                              <div>
                                <span className="text-xs font-bold text-white">Lv.{u.level}</span>
                                <p className="text-[11px] font-mono text-purple-400">{u.xp} XP</p>
                              </div>
                            </td>

                            {/* Certificate Status */}
                            <td className="py-3.5 px-3">
                              {u.role === "admin" ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/25 text-[10px] font-bold">
                                  <ShieldCheck size={11} /> ผู้ดูแลระบบ
                                </span>
                              ) : u.isCertificateUnlocked ? (
                                <Link
                                  href={`/certificate?userId=${u.id}`}
                                  target="_blank"
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-[11px] font-extrabold shadow-sm shadow-amber-400/20 transition-all cursor-pointer"
                                  title={`คลิกเพื่อดูและโหลดเกียรติบัตรของ ${u.name}`}
                                >
                                  <Award size={12} />
                                  <span>ดูเกียรติบัตร 🎓</span>
                                </Link>
                              ) : (
                                <Link
                                  href={`/certificate?userId=${u.id}`}
                                  target="_blank"
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[10px] font-mono transition-colors group cursor-pointer"
                                  title={`คลิกเพื่อดูสถานะเกียรติบัตรของ ${u.name} (ขาดอีก ${24 - u.completedStepsCount} สเต็ป)`}
                                >
                                  <Award size={11} className="text-amber-400/80 group-hover:text-amber-300" />
                                  <span>ขาดอีก {24 - u.completedStepsCount} สเต็ป ↗</span>
                                </Link>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Direct Certificate View Button */}
                                {u.role !== "admin" && (
                                  <Link
                                    href={`/certificate?userId=${u.id}`}
                                    target="_blank"
                                    title={`เปิดดูเกียรติบัตรของ ${u.name}`}
                                    className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                                      u.isCertificateUnlocked
                                        ? "bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-slate-950 border-amber-400/40"
                                        : "bg-slate-800 hover:bg-slate-700 text-amber-400/80 hover:text-amber-300 border-slate-700"
                                    }`}
                                  >
                                    <Award size={13} />
                                  </Link>
                                )}

                                {/* View Full Details */}
                                <button
                                  onClick={() => {
                                    setSelectedUser(u);
                                    setIsViewModalOpen(true);
                                  }}
                                  title="ดูข้อมูลและประวัติการเรียนทั้งหมดของผู้สมัครนี้"
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                                >
                                  <Eye size={13} />
                                </button>

                                {/* Edit */}
                                <button
                                  onClick={() => handleOpenEdit(u)}
                                  title="แก้ไขข้อมูลผู้ใช้"
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 transition-colors cursor-pointer"
                                >
                                  <Edit size={13} />
                                </button>

                                {/* Quick unlock / reset toggle */}
                                {!u.isCertificateUnlocked ? (
                                  <button
                                    onClick={() => handleQuickUnlockCertificate(u)}
                                    title="ปลดล็อก 24 สเต็ปให้ผู้เรียนนี้ทันที"
                                    className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition-colors cursor-pointer"
                                  >
                                    <Zap size={13} />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleQuickResetProgress(u)}
                                    title="รีเซ็ตผลการเรียนกลับเป็น 0"
                                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors cursor-pointer"
                                  >
                                    <RefreshCw size={13} />
                                  </button>
                                )}

                                {/* Delete */}
                                <button
                                  onClick={() => setDeleteConfirmUser(u)}
                                  title="ลบบัญชีผู้ใช้"
                                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ TAB 2: ANALYTICS & FUNNEL ══════════════ */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            {/* Step Completion Funnel */}
            <div className="bg-slate-900/60 border border-slate-800 p-5 sm:p-6 rounded-2xl shadow-sm space-y-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart3 size={18} className="text-emerald-400" />
                  อัตราการผ่านบทเรียนทีละสเต็ป (Step 1 - 24 Funnel)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  กราฟแสดงสัดส่วนผู้เรียนที่ทำภารกิจสำเร็จในแต่ละ Step เพื่อดูจุดที่ผู้เรียนเริ่มติดขัด
                </p>
              </div>

              <div className="space-y-2 pt-2">
                {stepFunnel.map((item) => (
                  <div key={item.stepId} className="flex items-center gap-3 text-xs font-mono">
                    <span className="w-16 shrink-0 text-slate-400 font-bold">
                      Step {item.stepId.toString().padStart(2, "0")}
                    </span>
                    <div className="flex-1 h-6 rounded-lg bg-slate-950 overflow-hidden p-0.5 border border-slate-800">
                      <div
                        className={`h-full rounded-md transition-all duration-500 flex items-center px-2 text-[10px] font-bold ${
                          item.stepId === 24
                            ? "bg-gradient-to-r from-amber-500 to-amber-300 text-slate-950"
                            : "bg-gradient-to-r from-emerald-600 to-cyan-500 text-slate-950"
                        }`}
                        style={{ width: `${Math.max(5, item.percentage)}%` }}
                      >
                        {item.count} คน ({item.percentage}%)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mascot Popularity Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles size={18} className="text-cyan-400" />
                  ความนิยมของมาสคอต (Mascot Popularity)
                </h3>
                <div className="space-y-3">
                  {mascotDist.map((item) => {
                    const m = MASCOTS.find((x) => x.name === item.mascot) || MASCOTS[0];
                    return (
                      <div key={item.mascot} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{m.emoji}</span>
                          <span className="font-bold text-slate-200">{m.name}</span>
                          <span className="text-[11px] text-slate-500">({m.title})</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-slate-300 font-bold">{item.count} คน</span>
                          <span className="text-emerald-400 font-semibold w-12 text-right">
                            ({item.percentage}%)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Learning Highlights */}
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Flame size={18} className="text-orange-400" />
                  ภาพรวมพฤติกรรมการเรียน
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">ผู้เรียนที่จบหลักสูตร 100%</span>
                    <span className="font-mono font-bold text-amber-400 text-sm">
                      {stats?.totalCertificates || 0} คน ({stats?.completionRate || 0}%)
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">สเต็ปที่ผ่านเฉลี่ยต่อคน</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      {stats?.totalUsers ? Math.round((stats.totalStepsCompleted / stats.totalUsers) * 10) / 10 : 0} สเต็ป
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">XP รวมสูงสุดในระบบ</span>
                    <span className="font-mono font-bold text-purple-400 text-sm">
                      {users.length > 0 ? Math.max(...users.map((u) => u.xp)) : 0} XP
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">Streak สูงสุดในระบบ</span>
                    <span className="font-mono font-bold text-orange-400 text-sm">
                      {users.length > 0 ? Math.max(...users.map((u) => u.streak)) : 0} วันต่อเนื่อง
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ TAB 3: CERTIFICATES & LEARNERS REGISTRY HUB ══════════════ */}
        {activeTab === "certificates" && (
          <div className="space-y-5">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/20 border border-amber-500/30 p-5 rounded-2xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                    <Award size={18} />
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    ทำเนียบผู้เรียนและเกียรติบัตร (Learners & Certificates Registry)
                  </h3>
                </div>
                <p className="text-xs text-slate-400 pl-10">
                  ข้อมูลสถิติผู้สมัครเรียนทั้งหมด <strong>{learners.length} ท่าน</strong> (เฉพาะบัญชีผู้เรียน - ระบบคัดแยกแอดมินออกอย่างชัดเจน)
                </p>
              </div>

              <div className="flex items-center gap-2 pl-10 md:pl-0">
                <span className="text-[11px] px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 font-medium flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-amber-400" />
                  เกียรติบัตรเป็นของผู้เรียนจริงเท่านั้น
                </span>
              </div>
            </div>

            {/* Quick Stats Summary Grid (All Learners Overview) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* Total Learners */}
              <div
                onClick={() => setCertSubFilter("all")}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  certSubFilter === "all"
                    ? "bg-blue-600/15 border-blue-500/60 shadow-md shadow-blue-500/10"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="font-semibold">ผู้สมัครเรียนทั้งหมด</span>
                  <Users size={14} className="text-blue-400" />
                </div>
                <p className="text-2xl font-black text-white">{learners.length}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">อีเมลตามชื่อผู้สมัครทุกคน</p>
              </div>

              {/* Completed Achievers */}
              <div
                onClick={() => setCertSubFilter("completed")}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  certSubFilter === "completed"
                    ? "bg-amber-500/15 border-amber-400 shadow-md shadow-amber-400/10"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="font-semibold text-amber-300">ผ่านครบ 24 สเต็ป 🏆</span>
                  <Award size={14} className="text-amber-400" />
                </div>
                <p className="text-2xl font-black text-amber-400">{certificateAchievers.length}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {learners.length > 0 ? Math.round((certificateAchievers.length / learners.length) * 100) : 0}% รับเกียรติบัตรได้
                </p>
              </div>

              {/* In Progress */}
              <div
                onClick={() => setCertSubFilter("in_progress")}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  certSubFilter === "in_progress"
                    ? "bg-cyan-500/15 border-cyan-400 shadow-md shadow-cyan-400/10"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="font-semibold text-cyan-300">กำลังศึกษาอยู่ ⏳</span>
                  <TrendingUp size={14} className="text-cyan-400" />
                </div>
                <p className="text-2xl font-black text-cyan-400">{inProgressLearners.length}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">ผ่านแล้ว 1 - 23 สเต็ป</p>
              </div>

              {/* Not Started */}
              <div
                onClick={() => setCertSubFilter("not_started")}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  certSubFilter === "not_started"
                    ? "bg-slate-800 border-slate-600 shadow-md"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="font-semibold text-slate-400">ยังไม่เริ่มเรียน 💤</span>
                  <BookOpen size={14} className="text-slate-500" />
                </div>
                <p className="text-2xl font-black text-slate-400">{notStartedLearners.length}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">สเต็ปสะสม 0/24</p>
              </div>
            </div>

            {/* Filter Toolbar & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อผู้เรียน, อีเมล, เบอร์โทร..."
                  value={certSearch}
                  onChange={(e) => setCertSearch(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                />
                {certSearch && (
                  <button
                    onClick={() => setCertSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Sub-filter tabs */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto">
                <button
                  onClick={() => setCertSubFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    certSubFilter === "all"
                      ? "bg-slate-800 text-white shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  ทั้งหมด ({learners.length})
                </button>
                <button
                  onClick={() => setCertSubFilter("completed")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                    certSubFilter === "completed"
                      ? "bg-amber-400 text-slate-950 font-bold shadow-xs"
                      : "text-amber-400/80 hover:text-amber-300"
                  }`}
                >
                  <Award size={12} />
                  <span>จบหลักสูตร ({certificateAchievers.length})</span>
                </button>
                <button
                  onClick={() => setCertSubFilter("in_progress")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    certSubFilter === "in_progress"
                      ? "bg-cyan-500 text-slate-950 font-bold shadow-xs"
                      : "text-cyan-400/80 hover:text-cyan-300"
                  }`}
                >
                  กำลังเรียน ({inProgressLearners.length})
                </button>
                <button
                  onClick={() => setCertSubFilter("not_started")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    certSubFilter === "not_started"
                      ? "bg-slate-700 text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  ยังไม่เริ่ม ({notStartedLearners.length})
                </button>
              </div>
            </div>

            {/* Learner Cards Grid */}
            {filteredCertLearners.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
                <Users size={32} className="mx-auto text-slate-600 mb-2" />
                <p className="text-sm font-semibold text-slate-400">ไม่พบรายชื่อผู้เรียนตามเงื่อนไขที่ค้นหา</p>
                <button
                  onClick={() => {
                    setCertSearch("");
                    setCertSubFilter("all");
                  }}
                  className="mt-3 text-xs text-amber-400 hover:underline cursor-pointer"
                >
                  ล้างตัวกรองทั้งหมด
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCertLearners.map((u) => {
                  const mascotObj = getMascotById(u.selectedMascot);
                  const progressPercent = Math.round((u.completedStepsCount / 24) * 100);

                  return (
                    <div
                      key={u.id}
                      className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-3.5 ${
                        u.isCertificateUnlocked
                          ? "bg-gradient-to-br from-slate-900 to-amber-950/20 border-amber-500/40 shadow-sm hover:border-amber-400"
                          : u.completedStepsCount > 0
                          ? "bg-slate-900/70 border-slate-800 hover:border-slate-700"
                          : "bg-slate-900/40 border-slate-850 hover:border-slate-800 opacity-80"
                      }`}
                    >
                      {/* Top: Avatar + Identity */}
                      <div className="flex items-start gap-3">
                        <div
                          className={`relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border-2 shadow-xs ${
                            u.isCertificateUnlocked
                              ? "border-amber-400"
                              : u.completedStepsCount > 0
                              ? "border-cyan-500/40"
                              : "border-slate-700"
                          }`}
                        >
                          <Image src={mascotObj.avatar} alt={u.name} fill className="object-cover" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="font-bold text-white text-sm truncate">{u.name}</h4>
                            <span className="text-[10px] font-mono text-slate-500 bg-slate-800/80 px-1.5 py-0.5 rounded shrink-0">
                              Lv.{u.level}
                            </span>
                          </div>

                          <p className="text-[11px] font-mono text-emerald-400 truncate mt-0.5">
                            {u.email || "ไม่มีอีเมล"}
                          </p>

                          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-mono">
                            <span>📞 {u.phoneNumber || "ไม่ระบุเบอร์"}</span>
                            <span>•</span>
                            <span className="text-purple-400 font-bold">{u.xp} XP</span>
                          </div>
                        </div>
                      </div>

                      {/* Middle: Progress Bar and Status */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-xs">
                          {u.isCertificateUnlocked ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400">
                              <Award size={13} />
                              ผ่านครบ 24/24 สเต็ป (สำเร็จหลักสูตร)
                            </span>
                          ) : u.completedStepsCount > 0 ? (
                            <span className="text-[11px] font-medium text-cyan-300">
                              ผ่านแล้ว {u.completedStepsCount}/24 สเต็ป (ขาดอีก {24 - u.completedStepsCount})
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-500">
                              ยังไม่ได้เริ่มทำแบบทดสอบ (0/24)
                            </span>
                          )}
                          <span className="font-mono text-[11px] text-slate-400 font-bold">
                            {progressPercent}%
                          </span>
                        </div>

                        <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              u.isCertificateUnlocked
                                ? "bg-gradient-to-r from-amber-500 to-amber-300"
                                : u.completedStepsCount > 0
                                ? "bg-gradient-to-r from-cyan-500 to-emerald-400"
                                : "bg-slate-700"
                            }`}
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Bottom Actions */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
                        {u.isCertificateUnlocked ? (
                          <>
                            {/* Direct View / Download Certificate */}
                            <Link
                              href={`/certificate?userId=${u.id}`}
                              target="_blank"
                              className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-400/20 flex items-center justify-center gap-1.5 transition-all"
                            >
                              <Award size={13} />
                              <span>ดู & โหลดเกียรติบัตร (PNG)</span>
                              <ArrowRight size={12} />
                            </Link>

                            <button
                              onClick={() => {
                                setSelectedUser(u);
                                setIsViewModalOpen(true);
                              }}
                              title="ดูรายละเอียดการเรียน"
                              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                            >
                              <Eye size={13} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setSelectedUser(u);
                                setIsViewModalOpen(true);
                              }}
                              className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Eye size={13} />
                              <span>ดูประวัติการเรียน</span>
                            </button>

                            {/* Quick unlock button for admin */}
                            <button
                              onClick={() => handleQuickUnlockCertificate(u)}
                              title="ปลดล็อก 24 สเต็ปให้ผู้เรียนนี้ทันที"
                              className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition-colors cursor-pointer"
                            >
                              <Award size={13} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══════════════ TAB 4: DATABASE CONNECTION ══════════════ */}
        {activeTab === "database" && (
          <div className="space-y-6 max-w-4xl">
            {/* Database Status Card */}
            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Database size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      การเชื่อมต่อฐานข้อมูล: {stats?.databaseProvider || "MySQL"}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {stats?.dbUrlDisplay || "mysql://root:@localhost:3306/pystep_db"}
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
                  ● ACTIVE
                </span>
              </div>
            </div>

            {/* MySQL Setup Instructions */}
            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Server size={18} className="text-blue-400" />
                คำแนะนำในการเชื่อมต่อไปยัง MySQL เมื่อดาวน์โหลดเรียบร้อยแล้ว
              </h3>

              <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <p className="font-bold text-white text-sm">ขั้นตอนที่ 1: เปิดใช้งาน MySQL Server</p>
                  <p className="text-slate-400">
                    หากใช้ <strong>XAMPP</strong> หรือ <strong>Laragon</strong>: กดปุ่ม Start ที่โมดูล <strong>MySQL</strong> (พอร์ตเริ่มต้น 3306)
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <p className="font-bold text-white text-sm">ขั้นตอนที่ 2: ตรวจสอบการตั้งค่าในไฟล์ .env</p>
                  <p className="text-slate-400">
                    ไฟล์ <code className="text-emerald-400 font-mono">.env</code> ในโปรเจกต์ตั้งค่าพร้อมใช้งานไว้แล้ว:
                  </p>
                  <pre className="p-3 rounded-lg bg-slate-900 text-emerald-300 font-mono text-[11px] overflow-x-auto">
                    DATABASE_URL="mysql://root:@localhost:3306/pystep_db"
                  </pre>
                  <p className="text-slate-500 text-[11px]">
                    *หาก MySQL ของคุณมีรหัสผ่าน ให้เปลี่ยนเป็น: <code className="text-slate-300 font-mono">mysql://root:รหัสผ่านของคุณ@localhost:3306/pystep_db</code>
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <p className="font-bold text-white text-sm">ขั้นตอนที่ 3: สั่งสร้างตารางและใส่ข้อมูลตัวอย่างลง MySQL</p>
                  <p className="text-slate-400">
                    รันคำสั่งด้านล่างนี้ใน Terminal เพื่อสร้างตารางอัตโนมัติและนำเข้าแอดมิน + ผู้เรียนตัวอย่าง 35+ ท่าน:
                  </p>
                  <div className="space-y-2 font-mono text-[11px]">
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="text-emerald-400">npm run db:push</span>
                      <span className="text-slate-500 font-sans text-[10px]">สร้าง Database และ Schema ลง MySQL</span>
                    </div>
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="text-emerald-400">npm run db:seed</span>
                      <span className="text-slate-500 font-sans text-[10px]">นำเข้าแอดมิน (admin / admin123) และผู้เรียน 35+ คน</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 space-y-1.5">
                  <p className="font-bold">💡 สลับฐานข้อมูลได้ตามต้องการใน 1 คำสั่ง:</p>
                  <p className="text-[11px]">
                    • สลับเป็น MySQL: <code className="font-mono bg-blue-950 px-1.5 py-0.5 rounded text-white">npm run use:mysql</code>
                    <br />
                    • สลับกลับเป็น SQLite: <code className="font-mono bg-blue-950 px-1.5 py-0.5 rounded text-white">npm run use:sqlite</code>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MODAL: VIEW USER DETAILS (RICH OVERVIEW FOR ALL 137 ACCOUNTS)
      ──────────────────────────────────────────────────────────────── */}
      {isViewModalOpen && selectedUser && (() => {
        const mascot = getMascotById(selectedUser.selectedMascot);
        return (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-slate-200 my-8">
              {/* Header Profile */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3.5">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-emerald-500/50 shadow-md shrink-0">
                    <Image
                      src={mascot.avatar || "/starpy.jpg"}
                      alt={selectedUser.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-lg text-white">{selectedUser.name}</h3>
                      {selectedUser.role === "admin" ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-extrabold flex items-center gap-0.5">
                          <ShieldCheck size={11} /> ADMIN
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] font-bold">
                          LEARNER
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {selectedUser.email || "ไม่มีอีเมล"} {selectedUser.phoneNumber && `• ${selectedUser.phoneNumber}`}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                      <span>มาสคอต: {mascot.emoji} {mascot.name} ({mascot.title})</span>
                      <span>•</span>
                      <span>ID: {selectedUser.id.slice(0, 8)}...</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Status Banner */}
              <div className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs ${
                selectedUser.isCertificateUnlocked
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                  : "bg-slate-950 border-slate-800 text-slate-300"
              }`}>
                <div className="flex items-center gap-2">
                  <Award size={18} className={selectedUser.isCertificateUnlocked ? "text-amber-400" : "text-slate-500"} />
                  <div>
                    <p className="font-bold">
                      {selectedUser.isCertificateUnlocked
                        ? "🎉 สำเร็จหลักสูตร 24/24 สเต็ปครบถ้วน"
                        : `กำลังศึกษา: สำเร็จ ${selectedUser.completedStepsCount} จาก 24 สเต็ป`}
                    </p>
                    <p className="text-[11px] opacity-75">
                      {selectedUser.isCertificateUnlocked
                        ? "มีสิทธิ์ได้รับใบประกาศนียบัตรอิเล็กทรอนิกส์ (Certificate of Completion)"
                        : `ยังขาดอีก ${24 - selectedUser.completedStepsCount} สเต็ป เพื่อสำเร็จหลักสูตร`}
                    </p>
                  </div>
                </div>
                {selectedUser.role !== "admin" && (
                  <Link
                    href={`/certificate?userId=${selectedUser.id}`}
                    target="_blank"
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs shrink-0 transition-all shadow-md shadow-amber-400/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Award size={13} />
                    <span>{selectedUser.isCertificateUnlocked ? "ดู & โหลดเกียรติบัตร (PNG)" : "ดูเกียรติบัตร / ตัวอย่าง ↗"}</span>
                  </Link>
                )}
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <p className="text-slate-500 text-[10px] font-bold">LEVEL</p>
                  <p className="font-black text-lg text-white mt-0.5">Lv.{selectedUser.level}</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <p className="text-slate-500 text-[10px] font-bold">TOTAL XP</p>
                  <p className="font-black text-lg text-purple-400 mt-0.5">{selectedUser.xp}</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <p className="text-slate-500 text-[10px] font-bold">STREAK</p>
                  <p className="font-black text-lg text-orange-400 mt-0.5">{selectedUser.streak} วัน</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <p className="text-slate-500 text-[10px] font-bold">HEARTS</p>
                  <p className="font-black text-lg text-rose-500 mt-0.5">{selectedUser.hearts} ❤️</p>
                </div>
              </div>

              {/* Progress Matrix with Step Titles */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    แผนผังความคืบหน้า 24 สเต็ป (Curriculum Matrix)
                  </span>
                  <span className="font-mono text-emerald-400 font-bold text-[11px]">
                    {selectedUser.completedStepsCount} / 24 ({Math.round((selectedUser.completedStepsCount / 24) * 100)}%)
                  </span>
                </div>

                <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
                  {Array.from({ length: 24 }, (_, i) => i + 1).map((stepNum) => {
                    const isDone = selectedUser.completedStepIds.includes(stepNum);
                    const stepData = STEPS[stepNum - 1];
                    const stepTitle = stepData ? `${stepData.chapterTitle}: ${stepData.title}` : `Step ${stepNum}`;
                    return (
                      <div
                        key={stepNum}
                        title={`Step ${stepNum}: ${stepTitle} (${isDone ? "ผ่านแล้ว ✅" : "ยังไม่ผ่าน ⏳"})`}
                        className={`h-9 rounded-xl flex flex-col items-center justify-center font-mono text-[11px] font-bold border transition-all cursor-help relative group ${
                          isDone
                            ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-xs"
                            : "bg-slate-900/60 text-slate-600 border-slate-800"
                        }`}
                      >
                        <span>{stepNum}</span>
                        {isDone && <span className="text-[8px] leading-none text-emerald-400">✓</span>}
                      </div>
                    );
                  })}
                </div>
                <p className="text-[10px] text-slate-500 italic text-right">
                  * เลื่อนเมาส์ชี้ที่หมายเลขเพื่อดูชื่อบทเรียนของแต่ละสเต็ป
                </p>
              </div>

              {/* Modal Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      handleOpenEdit(selectedUser);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit size={13} />
                    <span>แก้ไขบัญชีนี้</span>
                  </button>

                  {!selectedUser.isCertificateUnlocked ? (
                    <button
                      onClick={async () => {
                        await handleQuickUnlockCertificate(selectedUser);
                        setSelectedUser((prev) => prev ? {
                          ...prev,
                          isCertificateUnlocked: true,
                          completedStepsCount: 24,
                          completedStepIds: Array.from({ length: 24 }, (_, i) => i + 1),
                        } : null);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Zap size={13} className="text-amber-400" />
                      <span>ปลดล็อก 24 สเต็ป</span>
                    </button>
                  ) : (
                    <button
                      onClick={async () => {
                        await handleQuickResetProgress(selectedUser);
                        setSelectedUser((prev) => prev ? {
                          ...prev,
                          isCertificateUnlocked: false,
                          completedStepsCount: 0,
                          completedStepIds: [],
                        } : null);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw size={13} className="text-rose-400" />
                      <span>รีเซ็ตความคืบหน้า</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: EDIT USER
      ──────────────────────────────────────────────────────────────── */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-black text-base text-white">แก้ไขข้อมูลผู้ใช้งาน</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">ชื่อ-นามสกุล</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">บทบาท (Role)</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="user">User (ผู้เรียนทั่วไป)</option>
                    <option value="admin">Admin (ผู้ดูแลระบบ)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">อีเมล</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">เบอร์โทรศัพท์</label>
                  <input
                    type="text"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">
                  รหัสผ่านใหม่ <span className="font-normal text-slate-500">(เว้นว่างถ้าไม่ต้องการเปลี่ยน)</span>
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="อย่างน้อย 6 ตัวอักษร"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">XP</label>
                  <input
                    type="number"
                    value={formData.xp}
                    onChange={(e) => setFormData({ ...formData, xp: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Level</label>
                  <input
                    type="number"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Streak</label>
                  <input
                    type="number"
                    value={formData.streak}
                    onChange={(e) => setFormData({ ...formData, streak: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">มาสคอตประจำตัว</label>
                <select
                  value={formData.selectedMascot}
                  onChange={(e) => setFormData({ ...formData, selectedMascot: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                >
                  {MASCOTS.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.emoji} {m.name} ({m.title})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black transition-colors cursor-pointer disabled:opacity-50"
                >
                  {formSubmitting ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: ADD NEW USER
      ──────────────────────────────────────────────────────────────── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-black text-base text-white">เพิ่มผู้ใช้งานใหม่</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">ชื่อ-นามสกุล *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="เช่น นาย สมชาย สายโค้ด"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">อีเมล</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="learner@gmail.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">เบอร์โทรศัพท์</label>
                  <input
                    type="text"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="081-234-5678"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">รหัสผ่าน *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="อย่างน้อย 6 ตัวอักษร"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">บทบาท</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="user">User (ผู้เรียน)</option>
                    <option value="admin">Admin (ผู้ดูแลระบบ)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">มาสคอต</label>
                  <select
                    value={formData.selectedMascot}
                    onChange={(e) => setFormData({ ...formData, selectedMascot: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  >
                    {MASCOTS.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.emoji} {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Option to grant certificate immediately */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5">
                <input
                  type="checkbox"
                  id="unlockCert"
                  checked={formData.unlockCertificate}
                  onChange={(e) => setFormData({ ...formData, unlockCertificate: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="unlockCert" className="text-xs text-slate-300 cursor-pointer">
                  ปลดล็อกครบ 24 สเต็ปทันที (มอบใบประกาศนียบัตร)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black transition-colors cursor-pointer disabled:opacity-50"
                >
                  {formSubmitting ? "กำลังสร้าง..." : "ยืนยันสร้างผู้ใช้"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: DELETE CONFIRMATION
      ──────────────────────────────────────────────────────────────── */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/30 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
              <Trash2 size={24} />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">ยืนยันการลบบัญชีผู้ใช้?</h3>
              <p className="text-xs text-slate-400 mt-1">
                คุณกำลังจะลบผู้ใช้ <strong className="text-white">"{deleteConfirmUser.name}"</strong> ข้อมูลและประวัติการเรียนทั้งหมดจะถูกลบถาวร
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                ยืนยันการลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
