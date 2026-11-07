export interface Mascot {
  id: string;
  name: string;
  emoji: string;
  avatar: string;
  title: string;
  phrase: string;
  gradient: string;
  themeColor: string;
  auraGlow: string;
  accentColor: string;
  badge: string;
}

// 8 Official 3D Mascots for PyStep (High Quality 3D EdTech Characters)
export const MASCOTS: Mascot[] = [
  {
    id: "mascot-1",
    name: "StarPy",
    emoji: "🐱",
    avatar: "/starpy.jpg",
    title: "เจ้าแมวน้อยนักโค้ด",
    phrase: "ส่องแสงนำทางทุกบรรทัดโค้ด พร้อมลุยไปด้วยกันนะ! ✨",
    gradient: "from-cyan-400 to-blue-600",
    themeColor: "from-cyan-400 to-blue-600",
    auraGlow: "rgba(6, 182, 212, 0.45)",
    accentColor: "#06b6d4",
    badge: "Personal AI Mentor",
  },
  {
    id: "mascot-2",
    name: "FoxPy",
    emoji: "🦊",
    avatar: "/mascot2.jpg",
    title: "จิ้งจอกอัจฉริยะ",
    phrase: "คิดโซลูชันที่เร็ว ฉลาด และคลีนที่สุดได้เสมอ ลุยเลย! 🔥",
    gradient: "from-orange-400 to-amber-500",
    themeColor: "from-orange-400 to-amber-500",
    auraGlow: "rgba(249, 115, 22, 0.45)",
    accentColor: "#f97316",
    badge: "Algorithm Champion",
  },
  {
    id: "mascot-3",
    name: "PandaPy",
    emoji: "🐼",
    avatar: "/mascot3.jpg",
    title: "แพนด้าสายลุย",
    phrase: "สุขุมดั่งต้นไผ่ แต่ตรรกะแม่นยำ ลุยโค้ดดิ้งไม่มีถอย! 🎋",
    gradient: "from-emerald-400 to-teal-600",
    themeColor: "from-emerald-400 to-teal-600",
    auraGlow: "rgba(16, 185, 129, 0.45)",
    accentColor: "#10b981",
    badge: "Cyber Tank",
  },
  {
    id: "mascot-4",
    name: "BunnyCode",
    emoji: "🐰",
    avatar: "/mascot4.jpg",
    title: "กระต่ายสปีดโค้ด",
    phrase: "พิมพ์โค้ดเร็วดั่งติดสปีด แซงทุก Deadline แน่นอน ⚡",
    gradient: "from-pink-400 to-rose-500",
    themeColor: "from-pink-400 to-rose-500",
    auraGlow: "rgba(244, 63, 94, 0.45)",
    accentColor: "#f43f5e",
    badge: "Hyper Fast Coder",
  },
  {
    id: "mascot-5",
    name: "OwlLog",
    emoji: "🦉",
    avatar: "/mascot5.jpg",
    title: "นกฮูกนักตรรกะ",
    phrase: "มองทะลุทุกเงื่อนไข จัดการโครงสร้างลึกซึ้งไร้ที่ติ 📚",
    gradient: "from-indigo-400 to-purple-600",
    themeColor: "from-indigo-400 to-purple-600",
    auraGlow: "rgba(99, 102, 241, 0.45)",
    accentColor: "#6366f1",
    badge: "Logic Master",
  },
  {
    id: "mascot-6",
    name: "BearStack",
    emoji: "🐻",
    avatar: "/mascot6.jpg",
    title: "หมีสแต็กพลังสูง",
    phrase: "รับโหลดหนักแค่ไหนก็ไม่ล่ม แบกโปรเจกต์ได้สบายๆ 🪵",
    gradient: "from-sky-400 to-indigo-500",
    themeColor: "from-sky-400 to-indigo-500",
    auraGlow: "rgba(14, 165, 233, 0.45)",
    accentColor: "#0ea5e9",
    badge: "Full-Stack Titan",
  },
  {
    id: "mascot-7",
    name: "KoalaByte",
    emoji: "🐨",
    avatar: "/mascot7.jpg",
    title: "โคอาลาซิลล์",
    phrase: "เรียนแบบไม่เร่งรีบ เข้าใจลึกซึ้ง ไร้ความเครียดนะยูว์ 🍃",
    gradient: "from-teal-400 to-cyan-600",
    themeColor: "from-teal-400 to-cyan-600",
    auraGlow: "rgba(20, 184, 166, 0.45)",
    accentColor: "#14b8a6",
    badge: "Chill Coder",
  },
  {
    id: "mascot-8",
    name: "PixelPup",
    emoji: "🐶",
    avatar: "/mascot8.jpg",
    title: "สุนัขพิกเซล",
    phrase: "นั่งเคียงข้างคุณเสมอ แม้เจอ Error พันบรรทัดก็ไม่ท้อ! 🐕",
    gradient: "from-yellow-400 to-orange-500",
    themeColor: "from-yellow-400 to-orange-500",
    auraGlow: "rgba(245, 158, 11, 0.45)",
    accentColor: "#f59e0b",
    badge: "Pixel Companion",
  },
];

export const DEFAULT_MASCOT: Mascot = MASCOTS[0];

export function getMascotById(idOrName: string): Mascot {
  return (
    MASCOTS.find((m) => m.id === idOrName || m.name === idOrName) ||
    DEFAULT_MASCOT
  );
}
