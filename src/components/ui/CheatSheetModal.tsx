"use client";

import React, { useEffect, useState } from "react";
import { X, Search, Copy, Check, BookOpen, Code2, Terminal } from "lucide-react";

interface CheatItem {
  title: string;
  code: string;
  description: string;
}

interface CheatCategory {
  name: string;
  icon: string;
  items: CheatItem[];
}

const PYTHON_CHEAT_SHEET: CheatCategory[] = [
  {
    name: "🖨️ Output & Input",
    icon: "🖨️",
    items: [
      {
        title: "print()",
        code: 'print("Hello, World!")',
        description: "แสดงผลข้อความออกหน้าจอ",
      },
      {
        title: "print หลายค่า",
        code: 'print("Name:", name, "Age:", age)',
        description: "แสดงหลายค่าคั่นด้วย comma",
      },
      {
        title: "f-string",
        code: 'print(f"ชื่อ {name} อายุ {age} ปี")',
        description: "แทรกตัวแปรในข้อความด้วย f-string",
      },
      {
        title: "input()",
        code: 'name = input("ชื่ออะไร? ")',
        description: "รับค่าจากผู้ใช้ (ได้ string เสมอ)",
      },
      {
        title: "input แปลงเป็นตัวเลข",
        code: 'age = int(input("อายุ? "))',
        description: "รับค่าแล้วแปลงเป็น int",
      },
    ],
  },
  {
    name: "📦 ตัวแปร & ชนิดข้อมูล",
    icon: "📦",
    items: [
      {
        title: "สร้างตัวแปร",
        code: 'name = "StarPy"\nage = 5\nscore = 99.5\nis_cool = True',
        description: "str, int, float, bool",
      },
      {
        title: "ตรวจสอบชนิด",
        code: "type(name)   # <class 'str'>\ntype(age)    # <class 'int'>",
        description: "ใช้ type() เช็คชนิดข้อมูล",
      },
      {
        title: "แปลงชนิด",
        code: 'int("42")     # 42\nstr(100)      # "100"\nfloat("3.14") # 3.14',
        description: "แปลง string ↔ ตัวเลข",
      },
    ],
  },
  {
    name: "🔀 เงื่อนไข (if-else)",
    icon: "🔀",
    items: [
      {
        title: "if / elif / else",
        code: 'if score >= 80:\n    print("เก่งมาก!")\nelif score >= 50:\n    print("ผ่าน")\nelse:\n    print("ต้องพยายามอีก")',
        description: "ตรวจสอบเงื่อนไขหลายกรณี",
      },
      {
        title: "ตัวดำเนินการเปรียบเทียบ",
        code: "==  !=  >  <  >=  <=",
        description: "เท่ากับ, ไม่เท่า, มากกว่า, น้อยกว่า...",
      },
      {
        title: "and / or / not",
        code: 'if age >= 18 and has_id:\n    print("เข้าได้")\nif not is_banned:\n    print("ยินดีต้อนรับ")',
        description: "เชื่อมเงื่อนไขหลายตัว",
      },
    ],
  },
  {
    name: "🔁 ลูป (Loops)",
    icon: "🔁",
    items: [
      {
        title: "for loop",
        code: "for i in range(5):\n    print(i)  # 0, 1, 2, 3, 4",
        description: "วนซ้ำตามจำนวนรอบ",
      },
      {
        title: "for กับ list",
        code: 'fruits = ["🍎", "🍌", "🍇"]\nfor f in fruits:\n    print(f)',
        description: "วนซ้ำแต่ละตัวใน list",
      },
      {
        title: "while loop",
        code: "count = 0\nwhile count < 3:\n    print(count)\n    count += 1",
        description: "วนซ้ำจนกว่าเงื่อนไขเป็น False",
      },
      {
        title: "break & continue",
        code: "for i in range(10):\n    if i == 5:\n        break     # หยุดลูป\n    if i % 2 == 0:\n        continue  # ข้ามรอบนี้\n    print(i)",
        description: "ควบคุมการทำงานของลูป",
      },
    ],
  },
  {
    name: "⚡ ฟังก์ชัน (Functions)",
    icon: "⚡",
    items: [
      {
        title: "สร้างฟังก์ชัน",
        code: 'def greet(name):\n    return f"สวัสดี {name}!"',
        description: "ใช้ def สร้าง, return ส่งค่ากลับ",
      },
      {
        title: "ค่า default",
        code: 'def greet(name="โลก"):\n    print(f"สวัสดี {name}!")\n\ngreet()        # สวัสดี โลก!\ngreet("แมว")   # สวัสดี แมว!',
        description: "กำหนดค่าเริ่มต้นให้พารามิเตอร์",
      },
      {
        title: "หลาย return",
        code: "def calc(a, b):\n    return a + b, a * b\n\ns, p = calc(3, 4)  # s=7, p=12",
        description: "return หลายค่าด้วย tuple",
      },
    ],
  },
  {
    name: "📋 List",
    icon: "📋",
    items: [
      {
        title: "สร้าง List",
        code: 'nums = [1, 2, 3, 4, 5]\nnames = ["A", "B", "C"]',
        description: "เก็บข้อมูลหลายตัวเรียงกัน",
      },
      {
        title: "เข้าถึง / แก้ไข",
        code: "nums[0]     # 1 (ตัวแรก)\nnums[-1]    # 5 (ตัวสุดท้าย)\nnums[1] = 99",
        description: "index เริ่มที่ 0",
      },
      {
        title: "เพิ่ม / ลบ",
        code: "nums.append(6)      # เพิ่มท้าย\nnums.insert(0, 0)   # แทรกที่ index 0\nnums.remove(3)      # ลบค่า 3\nnums.pop()          # ลบตัวสุดท้าย",
        description: "จัดการสมาชิกใน List",
      },
      {
        title: "Slice & len",
        code: "nums[1:4]    # ตัวที่ 1-3\nlen(nums)    # จำนวนสมาชิก\nsorted(nums) # เรียงลำดับ",
        description: "ตัดช่วง, นับจำนวน, เรียง",
      },
    ],
  },
  {
    name: "✂️ String",
    icon: "✂️",
    items: [
      {
        title: "ต่อ String",
        code: '"Hello" + " " + "World"  # Hello World\n"Ha" * 3                 # HaHaHa',
        description: "ใช้ + ต่อ, * ซ้ำ",
      },
      {
        title: "Method ยอดฮิต",
        code: '"hello".upper()       # HELLO\n"HELLO".lower()       # hello\n"  hi  ".strip()      # hi\n"a,b,c".split(",")    # ["a","b","c"]\nlen("Python")         # 6',
        description: "ฟังก์ชันจัดการข้อความ",
      },
      {
        title: "ตรวจสอบ",
        code: '"Py" in "Python"      # True\n"hello".startswith("he")  # True\n"42".isdigit()        # True',
        description: "เช็คข้อความย่อย",
      },
    ],
  },
  {
    name: "📁 Dictionary",
    icon: "📁",
    items: [
      {
        title: "สร้าง Dict",
        code: 'student = {\n    "name": "StarPy",\n    "age": 5,\n    "level": 10\n}',
        description: "เก็บข้อมูลแบบ key: value",
      },
      {
        title: "เข้าถึง / แก้ไข",
        code: 'student["name"]          # StarPy\nstudent.get("gpa", 0)   # 0 (default)\nstudent["age"] = 6       # แก้ค่า',
        description: "อ่าน/เขียนค่าด้วย key",
      },
      {
        title: "วนลูป Dict",
        code: "for key, val in student.items():\n    print(f\"{key}: {val}\")",
        description: "ใช้ .items() วนทั้ง key และ value",
      },
    ],
  },
];

interface CheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheatSheetModal({ isOpen, onClose }: CheatSheetModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState(0);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      setCopiedCode(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Filter items based on search
  const filteredCategories = PYTHON_CHEAT_SHEET.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 text-slate-100 shadow-2xl shadow-black/50 border border-slate-800/60 flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60 bg-slate-900/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <BookOpen size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Python Cheat Sheet</h2>
              <p className="text-xs text-slate-400">สรุปคำสั่ง Python ที่ใช้บ่อย</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            aria-label="Close cheat sheet"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-3 border-b border-slate-800/40 shrink-0">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="ค้นหาคำสั่ง... เช่น print, for, list"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 transition-all"
            />
          </div>
        </div>

        {/* Category Tabs */}
        {!searchTerm && (
          <div className="px-4 py-2 border-b border-slate-800/40 shrink-0 overflow-x-auto">
            <div className="flex gap-1.5 min-w-max">
              {PYTHON_CHEAT_SHEET.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCategory(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    activeCategory === idx
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {(searchTerm ? filteredCategories : [PYTHON_CHEAT_SHEET[activeCategory]]).map((cat, catIdx) => (
            <div key={catIdx}>
              {searchTerm && (
                <h3 className="text-sm font-bold text-slate-300 mb-2 flex items-center gap-2">
                  <span>{cat.icon}</span> {cat.name}
                </h3>
              )}
              <div className="space-y-2.5">
                {cat.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="group rounded-xl bg-slate-800/40 border border-slate-700/30 hover:border-emerald-500/30 transition-all overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <Code2 size={14} className="text-emerald-400 shrink-0" />
                        <span className="text-sm font-semibold text-slate-200">{item.title}</span>
                      </div>
                      <span className="text-xs text-slate-500">{item.description}</span>
                    </div>
                    <div className="relative px-4 pb-3">
                      <pre className="bg-slate-950/60 rounded-lg p-3 text-xs font-mono text-emerald-300 overflow-x-auto border border-slate-800/50">
                        <code>{item.code}</code>
                      </pre>
                      <button
                        onClick={() => handleCopy(item.code)}
                        className="absolute top-1 right-5 p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                        title="Copy code"
                      >
                        {copiedCode === item.code ? (
                          <Check size={13} className="text-emerald-400" />
                        ) : (
                          <Copy size={13} />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {searchTerm && filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <Terminal size={40} className="mx-auto text-slate-600 mb-3" />
              <p className="text-sm text-slate-500">ไม่พบคำสั่งที่ค้นหา</p>
              <p className="text-xs text-slate-600 mt-1">ลองค้นหาคำอื่น เช่น print, loop, list</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950/60 border-t border-slate-800/40 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>📚 {PYTHON_CHEAT_SHEET.reduce((acc, cat) => acc + cat.items.length, 0)} คำสั่ง ใน {PYTHON_CHEAT_SHEET.length} หมวด</span>
          <span>กด <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300 mx-1">Esc</kbd> เพื่อปิด</span>
        </div>
      </div>
    </div>
  );
}
