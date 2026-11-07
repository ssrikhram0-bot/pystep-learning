"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Gamepad2,
  Lock,
  Unlock,
  Play,
  RotateCcw,
  Sparkles,
  Award,
  ChevronLeft,
  ChevronRight,
  Flame,
  Heart,
  Volume2,
  VolumeX,
  HelpCircle,
  CheckCircle2,
  Terminal,
  Code2,
  Tv,
  Film,
  Zap,
  Star,
  Layers,
  ArrowRight,
  Laptop,
  Check,
} from "lucide-react";
import { isMinigamesUnlocked } from "@/lib/curriculumData";

// 24 Stages Data from Roadmap Image
export interface GameStage {
  id: number;
  title: string;
  thaiTitle: string;
  icon: string;
  stars: number;
  snippet: string;
  mission: string;
  defaultCode: string;
  outputExpected: string;
  hint: string;
  catDialogue: string;
}

export const GAME_STAGES_24: GameStage[] = [
  {
    id: 1,
    title: "Python History",
    thaiTitle: "ประวัติความเป็นมาและการติดตั้ง",
    icon: "📖",
    stars: 2,
    snippet: "Python",
    mission: "เปิดเครื่อง Terminal แล้วสั่งให้น้อง StarPy กล่าวทักทายโลก Python!",
    defaultCode: 'print("Hello, PyStep Universe!")',
    outputExpected: "Hello, PyStep Universe!",
    hint: "กดปุ่ม 'รันคำสั่ง' เพื่อเริ่มใช้งานคอมพิวเตอร์ของ StarPy",
    catDialogue: "เมี๊ยวว! ยินดีต้อนรับสู่ก้าวแรก มาเริ่มเขียน Python กันเลย!",
  },
  {
    id: 2,
    title: "Python Structure",
    thaiTitle: "โครงสร้างภาษาและไวยากรณ์",
    icon: "</>",
    stars: 2,
    snippet: "print()\n# comment",
    mission: "จัดรูปแบบโครงสร้างโค้ดและใส่คอมเมนต์บอกตำแหน่งกระเป๋าวิเศษ",
    defaultCode: '# บรรทัดนี้คือคอมเมนต์\nprint("Cat Code Dream: Ready!")',
    outputExpected: "Cat Code Dream: Ready!",
    hint: "เครื่องหมาย # ใช้สำหรับเขียนบันทึกช่วยจำที่คอมพิวเตอร์จะไม่รัน",
    catDialogue: "จัดโค้ดให้สะอาด น้องแมวจะได้อ่านเข้าใจง่ายๆ นะ!",
  },
  {
    id: 3,
    title: "Variables & Data Types",
    thaiTitle: "ตัวแปรและชนิดข้อมูลพื้นฐาน",
    icon: "🧊",
    stars: 2,
    snippet: "int float\nstr bool",
    mission: "ประกาศตัวแปรเก็บชื่อและระดับพลังของ StarPy (str, int, float, bool)",
    defaultCode: 'cat_name = "StarPy"\npower_level = 9000\nis_cute = True\nprint(f"{cat_name} Power: {power_level}, Cute: {is_cute}")',
    outputExpected: "StarPy Power: 9000, Cute: True",
    hint: "ตัวแปรเปรียบเสมือนกล่องเก็บของ มีทั้งกล่องข้อความ ตัวเลข และจริง/เท็จ",
    catDialogue: "เย้! ตอนนี้พลังของ StarPy พุ่งทะลุ 9000 แล้วน้า!",
  },
  {
    id: 4,
    title: "Input & Output",
    thaiTitle: "รับข้อมูลและแสดงผล",
    icon: "📥",
    stars: 2,
    snippet: "name = input()\nprint()",
    mission: "รับคำสั่งจากผู้เล่นผ่าน input() แล้วแสดงผลผ่าน print()",
    defaultCode: 'user_cmd = "Fly"\nprint(f"Executing StarPy Action: {user_cmd}!")',
    outputExpected: "Executing StarPy Action: Fly!",
    hint: "input() รับข้อมูลเข้ามา และ print() ส่งข้อมูลออกหน้าจอ",
    catDialogue: "ป้อนคำสั่งมาได้เลย StarPy พร้อมกระโดดแล้ว!",
  },
  {
    id: 5,
    title: "Type Conversion",
    thaiTitle: "การแปลงชนิดข้อมูล",
    icon: "🔁",
    stars: 2,
    snippet: "int()\nfloat()\nstr()",
    mission: "แปลงค่าสตริง '100' ให้เป็น int() เพื่อนำไปคำนวณคะแนนโบนัส",
    defaultCode: 'score_str = "100"\nbonus = int(score_str) + 50\nprint(f"Total Score: {bonus}")',
    outputExpected: "Total Score: 150",
    hint: "ใช้ int() เพื่อเปลี่ยนตัวหนังสือตัวเลขให้กลายเป็นจำนวนเต็มที่บวกเลขได้",
    catDialogue: "แปลงร่างข้อมูลสำเร็จ ได้แต้มโบนัสเพิ่มแล้ว!",
  },
  {
    id: 6,
    title: "Operators",
    thaiTitle: "ตัวดำเนินการทางคณิตศาสตร์และตรรกะ",
    icon: "🧮",
    stars: 2,
    snippet: "+ - * /\n> < and or",
    mission: "ใช้เครื่องหมายคณิตศาสตร์คำนวณพลังงานปลาทูของน้องแมว",
    defaultCode: "fish_energy = (10 * 3) + 20\nprint(f'StarPy Energy: {fish_energy}%')",
    outputExpected: "StarPy Energy: 50%",
    hint: "คูณและหารจะทำก่อนบวกและลบ เสมือนลำดับการกินขนม",
    catDialogue: "งั่มๆ! ได้พลังงานปลาทูเต็มเปี่ยม พร้อมลุยด่านถัดไป!",
  },
  {
    id: 7,
    title: "If Statement",
    thaiTitle: "คำสั่ง if",
    icon: "🔀",
    stars: 2,
    snippet: "if ...:\n  pass",
    mission: "สร้างเงื่อนไขตรวจสอบว่าน้อง StarPy หิวหรือไม่",
    defaultCode: 'is_hungry = True\nif is_hungry:\n    print("StarPy: ขอกระป๋องปลาทูหน่อยน้า!")',
    outputExpected: "StarPy: ขอกระป๋องปลาทูหน่อยน้า!",
    hint: "ถ้าเงื่อนไขหลัง if เป็นจริง โค้ดที่ย่อหน้าด้านในจะทำงาน",
    catDialogue: "ถ้าหิวก็ต้องกิน! เงื่อนไขเป็นจริงอย่างไม่ต้องสงสัย!",
  },
  {
    id: 8,
    title: "If-Else & If-Elif-Else",
    thaiTitle: "คำสั่ง if-else และ if-elif-else",
    icon: "🔀",
    stars: 2,
    snippet: "if\nelif\nelse",
    mission: "แบ่งเส้นทางเดินของ StarPy ตามสภาพอากาศ (Sunny, Rainy, Starry)",
    defaultCode: 'weather = "Starry"\nif weather == "Rainy":\n    print("กางร่ม")\nelif weather == "Starry":\n    print("นอนดูดาวบนหลังคา")\nelse:\n    print("วิ่งเล่น")',
    outputExpected: "นอนดูดาวบนหลังคา",
    hint: "elif ย่อมาจาก else if ช่วยให้ตรวจจับได้หลายเงื่อนไขตามลำดับ",
    catDialogue: "คืนนี้ดาวสวยจังเลย ขอนอนดูดาวชิลๆ ก่อนนะเมี๊ยว~",
  },
  {
    id: 9,
    title: "Nested Conditions",
    thaiTitle: "เงื่อนไขซ้อนเงื่อนไข",
    icon: "🔀",
    stars: 2,
    snippet: "if:\n  if:\n  else:",
    mission: "ตรวจสอบเงื่อนไข 2 ชั้นเพื่อเปิดประตูกลปริศนา",
    defaultCode: 'has_key = True\nmana = 100\nif has_key:\n    if mana >= 50:\n        print("ประตูวิเศษเปิดออกแล้ว!")',
    outputExpected: "ประตูวิเศษเปิดออกแล้ว!",
    hint: "เงื่อนไขชั้นในจะทำงานก็ต่อเมื่อเงื่อนไขชั้นนอกเป็นจริงก่อน",
    catDialogue: "มีทั้งกุญแจและมานา ประตูเปิดแล้ว ลุยเลย!",
  },
  {
    id: 10,
    title: "While Loop",
    thaiTitle: "ลูป while",
    icon: "🔄",
    stars: 2,
    snippet: "while True:\n  ...",
    mission: "สร้างลูปให้น้อง StarPy นับถอยหลังจุดชนวนจรวดสตาร์ชิป",
    defaultCode: 'count = 3\nwhile count > 0:\n    print(f"Countdown: {count}...")\n    count -= 1\nprint("Blast off! 🚀")',
    outputExpected: "Countdown: 3...\nCountdown: 2...\nCountdown: 1...\nBlast off! 🚀",
    hint: "อย่าลืมลดค่าตัวนับ count -= 1 เพื่อไม่ให้เกิดลูปไม่รู้จบ (Infinite Loop)",
    catDialogue: "3.. 2.. 1.. จรวดพุ่งทะยานสู่ห้วงอวกาศแล้ว!",
  },
  {
    id: 11,
    title: "For Loop & Range()",
    thaiTitle: "ลูป for และ range()",
    icon: "🔄",
    stars: 2,
    snippet: "for i in range(10):",
    mission: "สั่งให้น้อง StarPy เดินก้าวไปข้างหน้า 5 ก้าวด้วย for และ range()",
    defaultCode: 'steps = [f"ก้าวที่ {i+1}" for i in range(5)]\nprint(" -> ".join(steps))',
    outputExpected: "ก้าวที่ 1 -> ก้าวที่ 2 -> ก้าวที่ 3 -> ก้าวที่ 4 -> ก้าวที่ 5",
    hint: "range(5) จะให้ตัวเลขตั้งแต่ 0 ถึง 4 รวมเป็น 5 รอบ",
    catDialogue: "ก้าวเล็กๆ รวมกันกลายเป็นก้าวที่ยิ่งใหญ่ได้เสมอ!",
  },
  {
    id: 12,
    title: "Break & Continue",
    thaiTitle: "คำสั่ง break และ continue",
    icon: "⚡",
    stars: 2,
    snippet: "break\ncontinue",
    mission: "ข้ามสิ่งกีดขวางด้วย continue และหยุดเมื่อพบสมบัติด้วย break",
    defaultCode: 'items = ["ก้อนหิน", "ข้าม", "หีบสมบัติ", "กับดัก"]\nfor item in items:\n    if item == "ข้าม":\n        continue\n    if item == "หีบสมบัติ":\n        print("พบหีบสมบัติทองคำแล้ว!")\n        break',
    outputExpected: "พบหีบสมบัติทองคำแล้ว!",
    hint: "continue จะข้ามไปรอบถัดไปทันที ส่วน break จะหยุดลูปทั้งหมด",
    catDialogue: "สมบัติทองคำเป็นของเราแล้ว เมี๊ยวว!",
  },
  {
    id: 13,
    title: "Strings",
    thaiTitle: "การจัดการข้อความ",
    icon: "💬",
    stars: 2,
    snippet: '"Hello"\n"Python"',
    mission: "ตัดต่อและแปลงข้อความลับเป็นตัวพิมพ์ใหญ่ด้วย .upper()",
    defaultCode: 'secret = "starpy code dream"\nprint(secret.upper())',
    outputExpected: "STARPY CODE DREAM",
    hint: "String มีเมธอดมากมาย เช่น .upper(), .lower(), .strip(), .replace()",
    catDialogue: "ข้อความเรืองแสงสีฟ้านีออน เท่สุดๆ ไปเลย!",
  },
  {
    id: 14,
    title: "Sequences & Collections",
    thaiTitle: "ลำดับข้อมูลและคอลเลกชัน",
    icon: "📋",
    stars: 2,
    snippet: "list tuple\nset dict",
    mission: "สร้างคลังกระเป๋าไอเทมด้วย Dictionary และ List",
    defaultCode: 'inventory = {"snack": "Tuna", "stars": 24, "ready": True}\nprint(f"Item: {inventory[\'snack\']}, Stars: {inventory[\'stars\']}")',
    outputExpected: "Item: Tuna, Stars: 24",
    hint: "Dictionary เก็บข้อมูลแบบ Key-Value หยิบมาใช้ผ่านชื่อกุญแจ",
    catDialogue: "กระเป๋าพร้อม อุปกรณ์ครบ พร้อมออกเดินทาง!",
  },
  {
    id: 15,
    title: "Functions",
    thaiTitle: "ฟังก์ชัน",
    icon: "📦",
    stars: 2,
    snippet: "def name():\n  ...",
    mission: "สร้างฟังก์ชัน def meow_power() ร่ายมนตร์บัฟพลัง",
    defaultCode: 'def meow_power(name):\n    return f"🌟 {name} ได้รับบัฟเกราะนีออน!"\nprint(meow_power("StarPy"))',
    outputExpected: "🌟 StarPy ได้รับบัฟเกราะนีออน!",
    hint: "ฟังก์ชันช่วยให้เราเขียนโค้ดครั้งเดียวแล้วเรียกใช้ซ้ำได้ไม่จำกัด",
    catDialogue: "ร่ายเวทมนตร์เสร็จแล้ว หูฟังมีประกายแสงวิบวับเลย!",
  },
  {
    id: 16,
    title: "Return & Scope",
    thaiTitle: "การคืนค่าและขอบเขตตัวแปร",
    icon: "↩️",
    stars: 2,
    snippet: "return x",
    mission: "ส่งค่าตัวเลขพลังจากการคำนวณคืนกลับมาด้วย return",
    defaultCode: 'def calculate_exp(level):\n    return level * 100\nprint(f"Current EXP: {calculate_exp(5)} pts")',
    outputExpected: "Current EXP: 500 pts",
    hint: "คำสั่ง return จะส่งผลลัพธ์ออกจากฟังก์ชันไปยังจุดที่ถูกเรียก",
    catDialogue: "ค่าพลังคำนวณเสร็จเรียบร้อย แม่นยำระดับซูเปอร์คอมพิวเตอร์!",
  },
  {
    id: 17,
    title: "Lambda Functions",
    thaiTitle: "ฟังก์ชันแบบ lambda",
    icon: "λ",
    stars: 2,
    snippet: "lambda x: x*2",
    mission: "สร้างฟังก์ชันย่อบรรทัดเดียวคำนวณความเร็วแสงของน้องแมว",
    defaultCode: "speed_boost = lambda x: x * 3\nprint(f'Max Speed: {speed_boost(100)} km/h')",
    outputExpected: "Max Speed: 300 km/h",
    hint: "Lambda คือฟังก์ชันนิรนามที่เขียนจบในบรรทัดเดียว นิยมใช้กับ map/filter",
    catDialogue: "ความเร็ว 3 เท่า! วิ่งเร็วจนมองไม่ทันแล้วเมี๊ยว!",
  },
  {
    id: 18,
    title: "Exceptions",
    thaiTitle: "การจัดการข้อผิดพลาด",
    icon: "⚠️",
    stars: 2,
    snippet: "try:\nexcept:",
    mission: "กางบาเรียป้องกันโปรแกรมพังเมื่อเกิดข้อผิดพลาด",
    defaultCode: 'try:\n    val = 10 / 0\nexcept ZeroDivisionError:\n    print("บาเรียทำงาน: ป้องกันหารด้วยศูนย์สำเร็จ!")',
    outputExpected: "บาเรียทำงาน: ป้องกันหารด้วยศูนย์สำเร็จ!",
    hint: "ใช้ try-except เพื่อดักจับ Error ไม่ให้โปรแกรมหยุดทำงานกะทันหัน",
    catDialogue: "รอดปลอดภัย! ไม่มีบั๊กไหนทำลายระบบของเราได้!",
  },
  {
    id: 19,
    title: "Try-Except-Else-Finally",
    thaiTitle: "คำสั่ง try-except-else-finally",
    icon: "🛡️",
    stars: 2,
    snippet: "try except\nelse finally",
    mission: "จัดกระบวนการทำงานครบ 4 ขั้นตอนพร้อมการทำความสะอาดระบบ",
    defaultCode: 'try:\n    print("กำลังเชื่อมต่อเซิร์ฟเวอร์...")\nfinally:\n    print("ปิดการเชื่อมต่ออย่างปลอดภัย")',
    outputExpected: "กำลังเชื่อมต่อเซิร์ฟเวอร์...\nปิดการเชื่อมต่ออย่างปลอดภัย",
    hint: "บล็อก finally จะทำงานเสมอ ไม่ว่าจะมี error หรือไม่ก็ตาม",
    catDialogue: "ระบบทำงานอย่างเป็นระเบียบและปลอดภัยที่สุด!",
  },
  {
    id: 20,
    title: "File Input/Output",
    thaiTitle: "การอ่านและเขียนไฟล์",
    icon: "📄",
    stars: 2,
    snippet: ".open()\n.read()\n.write()",
    mission: "บันทึกและอ่านสมุดบันทึกการเดินทางของ StarPy",
    defaultCode: 'log = "Day 24: เข้าใกล้เป้าหมาย Capstone แล้ว!"\nprint(f"[File Saved]: {log}")',
    outputExpected: "[File Saved]: Day 24: เข้าใกล้เป้าหมาย Capstone แล้ว!",
    hint: "การใช้ with open() เป็นวิธีที่ดีที่สุดเพราะปิดไฟล์ให้อัตโนมัติ",
    catDialogue: "บันทึกเรื่องราวการผจญภัยลงในสมุดไดอารี่เรียบร้อย!",
  },
  {
    id: 21,
    title: "OOP Classes & Objects",
    thaiTitle: "คลาสและอ็อบเจกต์",
    icon: "🏗️",
    stars: 2,
    snippet: "class Cat:\n  def __init__",
    mission: "สร้างพิมพ์เขียว Class CyberCat พร้อมความสามารถพิเศษ",
    defaultCode: 'class CyberCat:\n    def __init__(self, name):\n        self.name = name\n    def purr(self):\n        return f"{self.name} กำลังเพลิดเพลินกับเสียงเพลงในหูฟัง!"\ncat = CyberCat("StarPy")\nprint(cat.purr())',
    outputExpected: "StarPy กำลังเพลิดเพลินกับเสียงเพลงในหูฟัง!",
    hint: "Class คือพิมพ์เขียว ส่วน Object คือสิ่งที่สร้างขึ้นมาจากพิมพ์เขียวนั้น",
    catDialogue: "เมี๊ยว! ตอนนี้ StarPy มีตัวตนเป็น Object ในระบบแล้ว!",
  },
  {
    id: 22,
    title: "Inheritance & Polymorphism",
    thaiTitle: "การสืบทอดและพหุรูปแบบ",
    icon: "🌳",
    stars: 2,
    snippet: "class Animal:\nclass Dog(Animal):",
    mission: "สืบทอดความสามารถจากคลาสแม่สู่ StarPy ขั้นสุดยอด",
    defaultCode: 'class Robot:\n    def power_on(self):\n        return "System Active"\nclass StarPy(Robot):\n    def power_on(self):\n        return "StarPy Glow Active 🌟"\np = StarPy()\nprint(p.power_on())',
    outputExpected: "StarPy Glow Active 🌟",
    hint: "การสืบทอดช่วยให้คลาสลูกดึงความสามารถของคลาสแม่มาใช้และปรับแต่งได้",
    catDialogue: "อัปเกรดร่างใหม่ แสงไฟนีออนสว่างไสวสุดเท่!",
  },
  {
    id: 23,
    title: "Advanced Topics",
    thaiTitle: "Thread, Date & Time",
    icon: "⚙️",
    stars: 2,
    snippet: "Thread, Date & Time",
    mission: "จำลองการทำงานคู่ขนานและบันทึกเวลาความสำเร็จ",
    defaultCode: 'import datetime\nnow = datetime.datetime.now().strftime("%H:%M:%S")\nprint(f"Timestamp Verified: {now} | Threads: 4 Active")',
    outputExpected: "Timestamp Verified: [Time] | Threads: 4 Active",
    hint: "หัวข้อขั้นสูงช่วยให้เราสร้างระบบที่ทำงานพร้อมกันหลายงานได้อย่างมีประสิทธิภาพ",
    catDialogue: "ระบบขั้นสูงพร้อมทำงานควบคู่กันแล้ว อีกนิดเดียวจะถึงด่านสุดท้าย!",
  },
  {
    id: 24,
    title: "Capstone Project",
    thaiTitle: "โปรเจกต์สุดท้ายและสรุปบทเรียน",
    icon: "🏆",
    stars: 2,
    snippet: "</>",
    mission: "ด่านมหาศึกสุดท้าย! รวมความรู้ 24 บทสร้าง PyStep Terminal Game สำเร็จ!",
    defaultCode: 'print("="*40)\nprint("🎉 PYSTEP PYTHON JOURNEY: COMPLETED! 🎉")\nprint("น้องแมว StarPy ภูมิใจในตัวคุณมากที่สุด!")\nprint("="*40)',
    outputExpected: "========================================\n🎉 PYSTEP PYTHON JOURNEY: COMPLETED! 🎉\nน้องแมว StarPy ภูมิใจในตัวคุณมากที่สุด!\n========================================",
    hint: "ยินดีด้วย! คุณพิชิตครบทั้ง 24 ด่านแล้ว ทุกก้าวเล็กๆ กลายเป็นความสำเร็จที่ยิ่งใหญ่!",
    catDialogue: "ยินดีด้วยเจ้านาย! คุณทำสำเร็จแล้ว! ขอบคุณที่เดินเคียงข้างกันมาตลอดนะเมี๊ยว!",
  },
];

interface PyStepGameArenaProps {
  completedStepIds?: number[];
  initialLevel?: number;
  initialXp?: number;
}

export function PyStepGameArena({
  completedStepIds = [],
  initialLevel = 1,
  initialXp = 0,
}: PyStepGameArenaProps) {
  // Check strict unlock condition (Chapter 24 completed)
  const isStrictUnlocked = isMinigamesUnlocked(completedStepIds);

  // Dev Preview mode toggle: Allows testing the game interface immediately
  const [devPreviewMode, setDevPreviewMode] = useState(false);
  const isUnlocked = isStrictUnlocked || devPreviewMode;

  // Selected Stage (1 to 24)
  const [currentStageId, setCurrentStageId] = useState(1);
  const currentStage =
    GAME_STAGES_24.find((s) => s.id === currentStageId) || GAME_STAGES_24[0];

  // Game Arena States
  const [code, setCode] = useState(currentStage.defaultCode);
  const [terminalOutput, setTerminalOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showTeaserModal, setShowTeaserModal] = useState(false);
  const [showStageSelector, setShowStageSelector] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [clearedStages, setClearedStages] = useState<number[]>([1]);

  // Update code when stage changes
  useEffect(() => {
    setCode(currentStage.defaultCode);
    setTerminalOutput(`// Stage ${currentStage.id}: ${currentStage.title}\n// พร้อมรันการทดสอบ...`);
    setIsSuccess(false);
    setShowHint(false);
  }, [currentStageId, currentStage]);

  // Handle Run Action Simulation
  const handleRunCode = () => {
    setIsRunning(true);
    setTerminalOutput("⚡ กำลังรันคำสั่งเข้าสู่ระบบ StarPy Terminal...");

    setTimeout(() => {
      setIsRunning(false);
      setTerminalOutput(
        `> python3 stage_${currentStage.id}.py\n` +
          currentStage.outputExpected +
          "\n\n✔ Status: EXECUTED SUCCESSFUL (+50 XP, +10 Coins)"
      );
      setIsSuccess(true);
      if (!clearedStages.includes(currentStage.id)) {
        setClearedStages((prev) => [...prev, currentStage.id]);
      }
      setStreak((prev) => prev + 1);
    }, 850);
  };

  // Reset current stage
  const handleReset = () => {
    setCode(currentStage.defaultCode);
    setTerminalOutput(`// Reset Stage ${currentStage.id} สำเร็จ`);
    setIsSuccess(false);
    setShowHint(false);
  };

  // Switch to Next Stage
  const handleNextStage = () => {
    if (currentStageId < 24) {
      setCurrentStageId((prev) => prev + 1);
    }
  };

  // Switch to Prev Stage
  const handlePrevStage = () => {
    if (currentStageId > 1) {
      setCurrentStageId((prev) => prev - 1);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* ─────────────────────────────────────────────────────────────
          1. UNLOCK / STATUS BAR & TEASER TRIGGER
      ──────────────────────────────────────────────────────────────── */}
      <div
        className={`relative overflow-hidden rounded-3xl border transition-all p-5 sm:p-7 ${
          isUnlocked
            ? "bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border-sky-500/40 shadow-2xl shadow-sky-500/10"
            : "bg-gradient-to-r from-amber-950/60 via-slate-900 to-rose-950/50 border-amber-500/40 shadow-xl"
        }`}
      >
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left: Lock / Unlock Banner */}
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                isUnlocked
                  ? "bg-gradient-to-tr from-sky-500 to-indigo-500 text-white shadow-sky-500/30"
                  : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
              }`}
            >
              {isUnlocked ? <Sparkles size={28} /> : <Lock size={28} />}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                    isUnlocked
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  }`}
                >
                  {isUnlocked ? "🎮 GAME ZONE OPEN • 24 STAGES" : "🔒 เงื่อนไขการปลดล็อก"}
                </span>

                {devPreviewMode && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    DEV PREVIEW MODE
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {isUnlocked
                  ? "PyStep Game Arena: ตะลุยด่านตาม 24 บทเรียน!"
                  : "เกมถูกล็อกไว้ — จนกว่าจะเรียนจบ Chapter 24 (Capstone Project)"}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                {isUnlocked
                  ? "เลือกด่าน 1 ถึง 24 เพื่อจำลองการเล่น ปลุกพลังน้องแมว StarPy ผ่านแต่ละบทเรียน"
                  : "ตามเงื่อนไขหลักสูตร: ต้องผ่านบทเรียนครบทุกสเตปจนถึง Chapter 24 จึงจะปลดล็อก หรือเปิดโหมดพรีวิวเพื่อตรวจหน้าเกม"}
              </p>
            </div>
          </div>

          {/* Right: Teaser Video Button & Preview Toggle */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
            {/* Video Teaser Button */}
            <button
              onClick={() => setShowTeaserModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 hover:from-purple-500 hover:to-sky-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-500/25 active:scale-95 transition-all cursor-pointer"
            >
              <Film size={16} />
              <span>ดูทีเซอร์ตัวอย่างเกม</span>
            </button>

            {/* Dev Mode Preview Toggle */}
            <button
              onClick={() => setDevPreviewMode((prev) => !prev)}
              className={`px-3.5 py-2.5 rounded-xl border text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
                devPreviewMode
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : "bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700"
              }`}
              title="เปิด/ปิดโหมดทดลองเล่นเพื่อตรวจหน้าเกม"
            >
              {devPreviewMode ? <Unlock size={14} /> : <Lock size={14} />}
              <span>{devPreviewMode ? "โหมดพรีวิว: เปิดอยู่" : "ทดลองเล่น (Dev)"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. IF LOCKED: SHOW STRICT LOCK SCREEN (UNLESS PREVIEW MODE)
      ──────────────────────────────────────────────────────────────── */}
      {!isUnlocked && (
        <div className="relative rounded-3xl border border-amber-600/30 bg-slate-900/90 shadow-2xl p-8 sm:p-12 text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-inner">
            <Lock size={40} />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-2xl font-black text-white">
              ด่านเกมจะปลดล็อกเมื่อสำเร็จ Chapter 24
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              คุณได้เรียนผ่านไปแล้ว {completedStepIds.length} / 24 ด่าน 
              สะสมบทเรียนให้ครบเพื่อปลดล็อกสนามประลองเกมทั้ง 24 ด่านนี้!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/learn"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition-all flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <span>ไปเรียนต่อให้ครบ 24 บท</span>
              <ArrowRight size={14} />
            </Link>

            <button
              onClick={() => setDevPreviewMode(true)}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer border border-slate-700"
            >
              <Unlock size={14} />
              <span>เปิดดูหน้าตาด่านเกม (พรีวิว)</span>
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. MAIN GAME SCREEN (MATCHING ROADMAP PALETTE & THEME)
      ──────────────────────────────────────────────────────────────── */}
      {isUnlocked && (
        <div className="space-y-6">
          {/* ═════════ 3.1 TOP GAME HUD (STARPY + 24 STAGES SELECTOR) ═════════ */}
          <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-[#0e172e] to-[#070b16] p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-indigo-500/20">
              {/* Mascot Status */}
              <div className="flex items-center gap-3.5 w-full md:w-auto">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-sky-400/60 shadow-lg shadow-sky-500/25 shrink-0 bg-slate-950">
                  <Image
                    src="/pystep-game-roadmap.jpg"
                    alt="StarPy"
                    fill
                    className="object-cover object-top scale-175"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-2xl" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white text-base">StarPy Pilot</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      Lv. {initialLevel}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Flame size={13} /> {streak}x Streak
                    </span>
                    <span className="flex items-center gap-1 text-rose-400 font-bold">
                      <Heart size={13} fill="currentColor" /> {lives} Lives
                    </span>
                    <span className="text-sky-400 font-mono font-bold">
                      XP: {initialXp + clearedStages.length * 50}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stage Jump & Actions */}
              <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
                <button
                  onClick={() => setShowStageSelector((prev) => !prev)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-500/30 text-indigo-200 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Layers size={14} />
                  <span>ดูแผนที่ 24 ด่าน ({clearedStages.length}/24)</span>
                </button>

                <button
                  onClick={() => setSoundEnabled((prev) => !prev)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title={soundEnabled ? "ปิดเสียง" : "เปิดเสียง"}
                >
                  {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>
              </div>
            </div>

            {/* 24 Stage Mini-Pills Bar */}
            <div className="pt-4 overflow-x-auto no-scrollbar flex items-center gap-2">
              {GAME_STAGES_24.map((stage) => {
                const isSelected = stage.id === currentStageId;
                const isCleared = clearedStages.includes(stage.id);

                return (
                  <button
                    key={stage.id}
                    onClick={() => setCurrentStageId(stage.id)}
                    className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-sky-500 text-slate-950 border-sky-300 shadow-md shadow-sky-500/30 scale-105"
                        : isCleared
                        ? "bg-slate-900/90 text-emerald-300 border-emerald-500/40 hover:bg-slate-800"
                        : "bg-slate-950/70 text-slate-400 border-slate-800 hover:border-indigo-500/40 hover:text-slate-200"
                    }`}
                  >
                    <span className="font-mono text-[11px] font-black">{stage.id}</span>
                    <span className="truncate max-w-[110px]">{stage.title}</span>
                    {isCleared && <Check size={12} className="text-emerald-400 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ═════════ 3.2 24-STAGE MAP OVERLAY (TOGGLEABLE) ═════════ */}
          {showStageSelector && (
            <div className="rounded-3xl border border-sky-500/30 bg-slate-950/95 backdrop-blur-2xl p-6 shadow-2xl space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Layers size={18} className="text-sky-400" />
                  <h3 className="font-black text-white text-base">
                    แผนที่การเดินทาง 24 ด่าน (PyStep Stages)
                  </h3>
                </div>
                <button
                  onClick={() => setShowStageSelector(false)}
                  className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-slate-900"
                >
                  ปิดแผนที่ ✕
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {GAME_STAGES_24.map((s) => {
                  const isCurrent = s.id === currentStageId;
                  const isDone = clearedStages.includes(s.id);

                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        setCurrentStageId(s.id);
                        setShowStageSelector(false);
                      }}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        isCurrent
                          ? "bg-sky-500/20 border-sky-400 ring-2 ring-sky-400/40 text-white"
                          : isDone
                          ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-200"
                          : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono font-bold">
                        <span>ด่าน {s.id}</span>
                        <span>★★</span>
                      </div>
                      <div className="font-bold text-xs text-slate-200 truncate mt-1">
                        {s.title}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        {s.thaiTitle}
                      </div>
                      <div className="mt-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-sky-300 truncate">
                        {s.snippet.replace("\n", " ")}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═════════ 3.3 THE GAME SCREEN (NEON LAPTOP DESK THEME) ═════════ */}
          <div className="relative rounded-3xl border border-indigo-500/40 bg-[#070d1e] shadow-2xl overflow-hidden">
            {/* Window Title Bar */}
            <div className="bg-[#0b142b] border-b border-indigo-500/20 px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="h-4 w-[1px] bg-indigo-500/20" />
                <div className="flex items-center gap-2">
                  <Laptop size={15} className="text-sky-400" />
                  <span className="text-xs font-mono font-bold text-slate-300">
                    PyStep Terminal • Stage {currentStage.id}: {currentStage.title}
                  </span>
                </div>
              </div>

              {/* Prev / Next Stage Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrevStage}
                  disabled={currentStageId === 1}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 disabled:cursor-not-allowed transition-colors"
                  title="ด่านก่อนหน้า"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-mono font-bold text-sky-400 px-2">
                  {currentStageId} / 24
                </span>
                <button
                  onClick={handleNextStage}
                  disabled={currentStageId === 24}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 disabled:cursor-not-allowed transition-colors"
                  title="ด่านถัดไป"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Stage Body Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
              {/* ──────── LEFT: VISUAL STAGE ARENA & STARPY MASCOT (5 COLS) ──────── */}
              <div className="lg:col-span-5 p-6 border-b lg:border-b-0 lg:border-r border-indigo-500/20 bg-gradient-to-b from-[#0a1228] to-[#060a16] flex flex-col justify-between space-y-6">
                {/* Stage Header Info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-black px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      STAGE {currentStage.id} OF 24
                    </span>
                    <div className="flex items-center gap-1 text-amber-400 text-xs">
                      <Star size={13} fill="currentColor" />
                      <Star size={13} fill="currentColor" />
                      <span className="text-[11px] text-slate-400 font-mono ml-1">★★ Normal</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                      <span>{currentStage.title}</span>
                    </h3>
                    <p className="text-xs text-sky-300 font-medium mt-0.5">
                      {currentStage.thaiTitle}
                    </p>
                  </div>

                  {/* Mission Card */}
                  <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-slate-200 space-y-1">
                    <div className="text-[10px] font-mono font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Zap size={12} className="text-amber-400" />
                      ภารกิจประจำด่าน (Mission Goal)
                    </div>
                    <p className="leading-relaxed">{currentStage.mission}</p>
                  </div>
                </div>

                {/* Mascot StarPy Animated Scene (Matching Image) */}
                <div className="relative rounded-2xl border border-sky-500/30 bg-gradient-to-tr from-[#0a1532] via-[#101d42] to-[#151a3a] p-5 overflow-hidden text-center shadow-inner group">
                  {/* Glowing Headphones Ambient Ring */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-sky-500/20 rounded-full blur-2xl pointer-events-none animate-pulse" />

                  <div className="relative z-10 space-y-3">
                    <div className="relative w-36 h-36 mx-auto rounded-3xl overflow-hidden border-2 border-sky-400/80 shadow-2xl shadow-sky-500/40 bg-slate-950 group-hover:scale-105 transition-transform duration-300">
                      <Image
                        src="/pystep-game-roadmap.jpg"
                        alt="StarPy with Headphones"
                        fill
                        className="object-cover object-top scale-160"
                      />
                      {/* Audio Pulse Ring */}
                      <div className="absolute inset-0 ring-2 ring-sky-400/50 rounded-3xl animate-ping opacity-25" />
                    </div>

                    {/* Speech Dialogue Bubble */}
                    <div className="relative p-3 rounded-2xl bg-slate-900/90 border border-sky-500/30 text-xs text-sky-200 shadow-md">
                      <p className="font-medium italic leading-relaxed">
                        &quot;{currentStage.catDialogue}&quot;
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hint Bar / Dev Note */}
                <div className="space-y-2">
                  {showHint ? (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 animate-in fade-in duration-150">
                      <div className="font-bold flex items-center gap-1.5 mb-1">
                        <HelpCircle size={13} />
                        <span>คำใบ้จากน้อง StarPy:</span>
                      </div>
                      <p>{currentStage.hint}</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowHint(true)}
                      className="w-full py-2 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-500/20 text-indigo-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <HelpCircle size={14} />
                      <span>ขอดูคำใบ้ของด่านนี้</span>
                    </button>
                  )}

                  <div className="text-[10px] text-slate-500 text-center font-mono">
                    💡 โครงหน้าเกม 24 ด่านพร้อมแล้ว รอใส่ข้อมูลเกมที่กำลังคิดอยู่ได้ทันที!
                  </div>
                </div>
              </div>

              {/* ──────── RIGHT: CODE WORKSPACE & TERMINAL OUTPUT (7 COLS) ──────── */}
              <div className="lg:col-span-7 p-6 flex flex-col justify-between space-y-6 bg-[#060a17]">
                {/* Editor Header */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-400 flex items-center gap-1.5">
                      <Code2 size={14} className="text-sky-400" />
                      stage_{currentStage.id}.py
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      Python 3.12 • Virtual Sandbox
                    </span>
                  </div>

                  {/* Interactive Code Editor (Ready for player inputs) */}
                  <div className="relative rounded-2xl border border-indigo-500/30 bg-[#090f23] p-4 font-mono text-xs shadow-inner focus-within:border-sky-400 transition-colors">
                    <div className="flex items-start gap-3">
                      {/* Line Numbers */}
                      <div className="select-none text-slate-600 font-mono text-right text-xs space-y-1 pt-1">
                        <div>1</div>
                        <div>2</div>
                        <div>3</div>
                        <div>4</div>
                        <div>5</div>
                      </div>

                      {/* Code Textarea */}
                      <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        rows={6}
                        className="w-full bg-transparent text-sky-100 font-mono text-xs leading-relaxed outline-none resize-none selection:bg-sky-500/30"
                        spellCheck={false}
                      />
                    </div>
                  </div>
                </div>

                {/* Terminal Output Console */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-mono flex items-center gap-1.5">
                      <Terminal size={13} className="text-emerald-400" />
                      Terminal Output
                    </span>
                    {isSuccess && (
                      <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                        <CheckCircle2 size={13} /> STAGE CLEAR!
                      </span>
                    )}
                  </div>

                  <div className="p-4 rounded-2xl bg-black/80 border border-slate-800 font-mono text-xs text-sky-300 min-h-[140px] whitespace-pre-wrap shadow-inner overflow-y-auto leading-relaxed">
                    {terminalOutput}
                  </div>
                </div>

                {/* Game Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold flex items-center gap-2 border border-slate-800 transition-colors cursor-pointer"
                  >
                    <RotateCcw size={14} />
                    <span>รีเซ็ตโค้ด</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {isSuccess && currentStageId < 24 && (
                      <button
                        onClick={handleNextStage}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer animate-bounce"
                      >
                        <span>ไปด่านถัดไป (ด่าน {currentStageId + 1})</span>
                        <ChevronRight size={15} />
                      </button>
                    )}

                    <button
                      onClick={handleRunCode}
                      disabled={isRunning}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 hover:from-sky-300 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-sky-500/25 active:scale-95 transition-all cursor-pointer"
                    >
                      {isRunning ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                          <span>กำลังรันคำสั่ง...</span>
                        </>
                      ) : (
                        <>
                          <Play size={15} fill="currentColor" />
                          <span>รันคำสั่ง (Run Action)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ═════════ 3.4 FOOTER NOTICE & READINESS NOTE ═════════ */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-center text-xs text-slate-400 space-y-1">
            <span className="text-sky-300 font-bold">✨ ระบบโครงสร้างเกม 24 ด่านติดตั้งสมบูรณ์: </span>
            <span>
              คุณสามารถคิดโจทย์หรือมินิเกมของแต่ละด่านไว้ได้เลย เมื่อพร้อมแล้วสามารถนำข้อมูลหรือแนวเกม (เช่น ต่อบล็อก, ตอบคำถาม, หรือแก้ปริศนาเขาวงกต) มาเสียบแทนที่ได้ทันทีครับ!
            </span>
          </div>
        </div>
      )}

    </div>
  );
}
