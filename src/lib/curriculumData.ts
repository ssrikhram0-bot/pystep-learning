export type Env = Record<string, string | number | boolean | null>;

export interface TestCase {
  id: string;
  name: string;
  description: string;
  check: (output: string, env: Env, code: string) => boolean;
}

export interface Step {
  id: number;
  chapterId: number;
  chapterTitle: string;
  stepNumber: number;
  totalSteps: number;
  title: string;
  titleEn: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  conceptSummary: string;
  commonPitfall: string;
  codeExample: string;
  challengeTask: string;
  starterCode: string;
  expectedOutput: string;
  hints: string[];
  testCases: TestCase[];

  // Compatibility fields for existing UI components
  summaryBadge: string;
  estimatedMinutes: number;
  xp: number;
  keySkills: string[];
  explanation: string[];
  keyPoints: { title: string; desc: string; icon: string }[];
  exampleCode: string;
  challenge: string;
  starPyHint: string;
  description: string;
  aiReviewTips: {
    pep8: string;
    pythonic: string;
    efficiency: string;
  };
}

export interface Chapter {
  id: number;
  number: number;
  title: string;
  titleEn: string;
  description: string;
  icon: string;
  badge: string;
  accentColor: string;
  stepIds: number[];
}

export const PYTHON_INTRODUCTION_HISTORY = {
  title: "ประวัติความเป็นมาและปรัชญาของภาษา Python (Introduction & History)",
  source: "อ้างอิงจากหลักสูตรภาษา Python — MarcusCode (https://marcuscode.com/lang/python)",
  sections: [
    {
      title: "1. จุดกำเนิดและการพัฒนา (Origin & History)",
      content: `ภาษา Python ถือกำเนิดขึ้นในช่วงปลายปี 1980 (Late 1980s) และเริ่มต้นพัฒนาอย่างเป็นทางการในเดือนธันวาคม 1989 โดย **Guido van Rossum** ที่สถาบันวิจัย Centrum Wiskunde & Informatica (CWI) ในกรุงอัมสเตอร์ดัม ประเทศเนเธอร์แลนด์

เดิมที Guido van Rossum ได้รับแรงบันดาลใจหลักมาจาก **ภาษา ABC** ซึ่งเป็นภาษาที่ถูกออกแบบมาเพื่อการเรียนการสอนเขียนโปรแกรมที่มีความสามารถในการจัดการข้อผิดพลาดและมีไวยากรณ์คลีนสะอาดตา แต่ภาษา ABC ยังมีข้อจำกัดเรื่องความสามารถในการเข้าถึงระบบลึกๆ Guido จึงตั้งเป้าหมายพัฒนาภาษาโปรแกรมตัวใหม่ที่:
- นำจุดเด่นเรื่องความเข้าใจง่ายและไวยากรณ์ที่กระชับของภาษา ABC มาต่อยอด
- สามารถติดต่อและเข้าถึง System Calls ของระบบปฏิบัติการ Amoeba ได้อย่างสมบูรณ์
- มีความสามารถในการจัดการข้อผิดพลาดระดับสูง (Exception Handling)
- รองรับการเขียนโปรแกรมเชิงวัตถุ (Object-Oriented Programming: OOP)
- ขยายการทำงาน (Extensible) ร่วมกับภาษา C และ C++ ได้อย่างทรงพลัง

เวอร์ชันแรกของ Python (เวอร์ชัน 0.9.0) ถูกเผยแพร่สู่ชุมชนนักพัฒนาระดับโลกครั้งแรกในเดือนกุมภาพันธ์ปี 1991 บนกลุ่มข่าวสารคอมพิวเตอร์ alt.sources และได้รับความนิยมอย่างต่อเนื่องจนถึงเวอร์ชันปัจจุบัน Python 3.x`,
    },
    {
      title: "2. ที่มาของชื่อ 'Python'",
      content: `หลายคนเข้าใจผิดคิดว่าชื่อของภาษา Python ได้รับแรงบันดาลใจมาจาก **งูหลาม (Python)** แต่ในความเป็นจริงแล้ว Guido van Rossum ได้ตั้งชื่อภาษานี้ตามซีรีส์ตลกแนวคอมเมดี้ชื่อดังของประเทศอังกฤษที่เขาชื่นชอบอย่างมาก คือ **"Monty Python's Flying Circus"** ของสถานีโทรทัศน์ BBC ในยุค 1970 เพื่อให้ชื่อของภาษามีความสั้น กระชับ ลึกลับ และน่าดึงดูดใจ`,
    },
    {
      title: "3. ปรัชญาการออกแบบ: The Zen of Python (PEP 20)",
      content: `ปรัชญาการออกแบบหลักของภาษา Python ถูกรวบรวมโดย Tim Peters ในชื่อ **"The Zen of Python" (PEP 20)** ซึ่งประกอบด้วยหลักคิดสำคัญ เช่น:
- **Beautiful is better than ugly**: โค้ดที่สวยงามย่อมดีกว่าโค้ดที่รกรุงรัง
- **Explicit is better than implicit**: โค้ดที่ระบุเจตนาชัดเจนย่อมดีกว่าโค้ดที่แฝงความหมายซ่อนเร้น
- **Simple is better than complex**: ความเรียบง่ายย่อมดีกว่าความซับซ้อน
- **Complex is better than complicated**: หากต้องซับซ้อน ก็ต้องไม่วกวนจนสับสน
- **Readability counts**: ความสามารถในการอ่านและทำความเข้าใจโค้ดได้ง่ายคือหัวใจสำคัญสูงสุด
- **There should be one-- and preferably only one --obvious way to do it**: ควรมีวิธีที่ชัดเจนเพียงวิธีเดียวในการแก้ปัญหา

ด้วยปรัชญานี้ Python จึงตัดสัญลักษณ์ที่ไม่จำเป็น เช่น เครื่องหมายเซมิโคลอน (;) หรือวงเล็บปีกกา ({}) ออก และนำ **การย่อหน้า (Indentation)** มาเป็นตัวกำหนดขอบเขตบล็อกคำสั่ง บังคับให้โปรแกรมเมอร์ทุกคนเขียนโค้ดที่สะอาดตาและมีมาตรฐานเดียวกันเสมอ`,
    },
    {
      title: "4. คุณสมบัติเชิงสถาปัตยกรรมที่โดดเด่น",
      content: `- **Dynamic Typing**: ไม่จำเป็นต้องประกาศชนิดของตัวแปรล่วงหน้า ตัวแปรสามารถปรับเปลี่ยนชนิดข้อมูลได้ตามค่าที่ถูกกำหนดในขณะรันไทม์
- **Automatic Memory Management & Garbage Collection**: ระบบจัดการจองและคืนหน่วยความจำโดยอัตโนมัติ หมดกังวลเรื่อง Memory Leak
- **Multi-Paradigm Programming**: รองรับกระบวนทัศน์การเขียนโปรแกรมหลากหลาย ทั้ง Object-Oriented (OOP), Procedural (เชิงโครงสร้าง), และ Functional Programming
- **Extensive Standard Library ("Batteries Included")**: มีไลบรารีมาตรฐานพร้อมใช้งานครอบคลุมทุกด้าน ตั้งแต่การจัดการข้อความ, การคำนวณคณิตศาสตร์, การจัดการไฟล์, เครือข่าย, ไปจนถึง Web Services`,
    },
    {
      title: "5. บทบาทของ Python ในยุคปัจจุบัน",
      content: `ในปัจจุบัน Python ก้าวขึ้นสู่อันดับ 1 ของภาษาโปรแกรมที่ได้รับความนิยมสูงสุดในโลก โดยครองความเป็นผู้นำในเทคโนโลยีระดับแนวหน้า:
1. **Artificial Intelligence (AI) & Deep Learning**: TensorFlow, PyTorch, Keras, HuggingFace
2. **Data Science & Big Data**: Pandas, NumPy, SciPy, Matplotlib, Jupyter Notebook
3. **Web Backend Development**: Django, FastAPI, Flask
4. **Automation & Cloud DevOps**: Ansible, Scripting, Task Schedulers
5. **Cybersecurity & Penetration Testing**: Scapy, Network Analysis Tools`,
    },
  ],
};

export const CHAPTERS: Chapter[] = [
  {
    id: 1,
    number: 1,
    title: "Python Fundamentals & I/O",
    titleEn: "Python Fundamentals & I/O",
    description: "ประวัติความเป็นมาและปรัชญาของภาษา Python (MarcusCode), การติดตั้ง, โครงสร้างภาษา, ตัวแปรและชนิดข้อมูล, Standard I/O และ Type Conversions",
    icon: "⚡",
    badge: "Foundation",
    accentColor: "from-cyan-500 to-blue-500",
    stepIds: [1, 2, 3, 4, 5],
  },
  {
    id: 2,
    number: 2,
    title: "Operators & Control Flow",
    titleEn: "Operators & Control Flow",
    description: "ตัวดำเนินการทางคณิตศาสตร์ เปรียบเทียบ ตรรกะ, คำสั่งเลือกเงื่อนไข if, Indentation, if-else, if-elif-else และ Nested Conditions",
    icon: "🔀",
    badge: "Logic Core",
    accentColor: "from-blue-500 to-indigo-500",
    stepIds: [6, 7, 8, 9],
  },
  {
    id: 3,
    number: 3,
    title: "Loops & Data Sequences",
    titleEn: "Loops & Data Sequences",
    description: "การวนซ้ำ While Loop, For Loop กับ range(), การควบคุมลูป break/continue, String manipulation และโครงสร้าง Sequence & Collections (Lists, Tuples, Dictionaries, Sets)",
    icon: "🔁",
    badge: "Automation",
    accentColor: "from-indigo-500 to-purple-500",
    stepIds: [10, 11, 12, 13, 14],
  },
  {
    id: 4,
    number: 4,
    title: "Functions & Modules",
    titleEn: "Functions & Modules",
    description: "การสร้างและเรียกใช้ฟังก์ชัน def, Parameters, Return, ขอบเขตตัวแปร Scope (Local/Global), Lambda function และการใช้งาน Modules ใน Python",
    icon: "📦",
    badge: "Modularity",
    accentColor: "from-purple-500 to-pink-500",
    stepIds: [15, 16, 17],
  },
  {
    id: 5,
    number: 5,
    title: "File Handling & Exceptions",
    titleEn: "File Handling & Exceptions",
    description: "การจัดการข้อผิดพลาด Exceptions (SyntaxError, ZeroDivisionError, TypeError), โครงสร้าง try-except-finally และการอ่านเขียนไฟล์ (File I/O)",
    icon: "🛡️",
    badge: "Robust Code",
    accentColor: "from-pink-500 to-rose-500",
    stepIds: [18, 19, 20],
  },
  {
    id: 6,
    number: 6,
    title: "Object-Oriented Programming & Advanced Topics",
    titleEn: "OOP & Advanced Topics",
    description: "การเขียนโปรแกรมเชิงวัตถุ OOP (Classes, Objects, Inheritance), Threads, Date & Time, Random, Capstone Project สรุปผลเพื่อรับเกียรติบัตรและปลดล็อกมินิเกม",
    icon: "🎓",
    badge: "Mastery",
    accentColor: "from-emerald-500 to-teal-500",
    stepIds: [21, 22, 23, 24],
  },
];

const RAW_STEPS: Step[] = [
  /* ══════════════════════════════════════════════════════════════════
     CHAPTER 1: Python Fundamentals & I/O (Steps 1-5)
  ══════════════════════════════════════════════════════════════════ */
  {
    id: 1,
    chapterId: 1,
    chapterTitle: "Chapter 1: Python Fundamentals & I/O",
    stepNumber: 1,
    totalSteps: 5,
    title: "ประวัติความเป็นมา ปรัชญา และการติดตั้งภาษา Python",
    titleEn: "Getting Started with Python, History & Environment",
    category: "Introduction & Setup",
    difficulty: "Beginner",
    summaryBadge: "First Program",
    estimatedMinutes: 6,
    xp: 100,
    keySkills: ["Python History", "Environment Setup", "First Script"],
    description: "ทำความเข้าใจประวัติความเป็นมาของภาษา Python อิงตาม MarcusCode, ปรัชญา The Zen of Python, เครื่องมือพัฒนา และทดลองรันคำสั่งแรก",
    conceptSummary: "### 📖 บทนำและประวัติความเป็นมา (อ้างอิง MarcusCode):\\n1.1 **จุดกำเนิด**: ภาษา Python ถูกสร้างขึ้นในปลายปี 1980 โดย Guido van Rossum ที่ CWI ประเทศเนเธอร์แลนด์ ได้รับแรงบันดาลใจจากภาษา ABC\\n1.2 **ที่มาของชื่อ**: มาจากรายการตลก Monty Python's Flying Circus ของช่อง BBC\\n1.3 **ปรัชญาการออกแบบ (The Zen of Python - PEP 20)**: เน้นความเรียบง่าย อ่านง่าย โค้ดกระชับด้วยการตัดเซมิโคลอนออกและใช้ Indentation กำหนดบล็อกคำสั่ง\\n1.4 **คุณสมบัติเด่น**: Dynamic typing, Automatic memory management, Multi-paradigm (OOP, Functional, Procedural)\\n1.5 **สภาพแวดล้อมการเขียนโปรแกรม**: IDLE, VS Code และ Interactive REPL Shell",
    commonPitfall: "⚠️ **Common Pitfall**: ภาษา Python มีความไวต่อตัวพิมพ์ใหญ่-เล็ก (Case Sensitivity) เสมอ คำสั่งคือ `print()` พิมพ์เล็กทั้งหมด หากพิมพ์ `Print()` หรือ `PRINT()` ตัวแปลภาษาจะแจ้ง NameError ทันที!",
    keyPoints: [
      { title: "กำเนิดโดย Guido van Rossum", desc: "พัฒนาในเดือนธันวาคม 1989 ที่ CWI เนเธอร์แลนด์ ต่อยอดจากภาษา ABC", icon: "🏛️" },
      { title: "The Zen of Python", desc: "ปรัชญาเน้นย้ำ Readability counts และ Simple is better than complex", icon: "📜" },
      { title: "Standard Output", desc: "ฟังก์ชัน print() ใช้ส่งข้อมูลข้อความออกสู่หน้าจอ Console", icon: "🖥️" },
    ],
    explanation: [
      "ภาษา Python เป็นภาษาระดับสูงที่มีไวยากรณ์ใกล้เคียงกับภาษาอังกฤษทั่วไปมากที่สุด",
      "คำสั่ง print() ใช้สำหรับแสดงข้อความออกทางหน้าจอ โดยข้อความสตริงต้องครอบด้วยเครื่องหมาย Single หรือ Double Quotes เสมอ",
    ],
    codeExample: "# ตัวอย่างโปรแกรมแรกใน Python\\nprint(\\\"ยินดีต้อนรับสู่ภาษา Python — PyStep Academy!\\\")\\nprint(\\\"ออกแบบให้อ่านง่าย กระชับ และทรงพลัง\\\")",
    exampleCode: "# ตัวอย่างโปรแกรมแรกใน Python\\nprint(\\\"ยินดีต้อนรับสู่ภาษา Python — PyStep Academy!\\\")\\nprint(\\\"ออกแบบให้อ่านง่าย กระชับ และทรงพลัง\\\")",
    challengeTask: "ให้เขียนคำสั่ง print(\\\"Hello, Python from PyStep!\\\") เพื่อแสดงข้อความต้อนรับเข้าสู่บทเรียนแรก",
    challenge: "ให้เขียนคำสั่ง print(\\\"Hello, Python from PyStep!\\\") เพื่อแสดงข้อความต้อนรับเข้าสู่บทเรียนแรก",
    starPyHint: "พิมพ์ print(\\\"Hello, Python from PyStep!\\\") ใน Editor แล้วกดปุ่มรันโค้ดได้เลยครับ! 🌟",
    starterCode: "# เขียนคำสั่ง print() แสดงข้อความ \\\"Hello, Python from PyStep!\\\" ด้านล่างนี้\\nprint(\\\"Hello, Python from PyStep!\\\")\\n",
    expectedOutput: "Hello, Python from PyStep!",
    hints: [
      "ใช้ฟังก์ชัน print() ตัวพิมพ์เล็กทั้งหมด",
      "ครอบข้อความด้วยเครื่องหมายคำพูดคู่ \\\"Hello, Python from PyStep!\\\"",
      "ตรวจดูตัวสะกดคำว่า Python และ PyStep ให้ถูกต้อง"
    ],
    testCases: [
      { id: "t1", name: "Output check", description: "ตรวจพบ Hello, Python from PyStep! ในผลลัพธ์", check: (out) => out.includes("Hello, Python from PyStep!") },
      { id: "t2", name: "print function used", description: "ตรวจพบการใช้ print()", check: (_, __, code) => code.includes("print(") },
    ],
    aiReviewTips: { pep8: "พิมพ์ print() ติดกับวงเล็บเปิดตามสไตล์ PEP 8", pythonic: "เริ่มต้นด้วย One-liner print ง่ายและชัดเจน", efficiency: "I/O O(1)" },
  },

  {
    id: 2,
    chapterId: 1,
    chapterTitle: "Chapter 1: Python Fundamentals & I/O",
    stepNumber: 2,
    totalSteps: 5,
    title: "โครงสร้างของภาษา Python และรูปแบบการเขียนโปรแกรม",
    titleEn: "Syntax Structure & Interactive Shell",
    category: "Syntax & Shell",
    difficulty: "Beginner",
    summaryBadge: "Syntax Core",
    estimatedMinutes: 6,
    xp: 100,
    keySkills: ["Interactive Shell", "Comments", "Line Structure"],
    description: "เรียนรู้โครงสร้างของภาษา Python, โหมดการทำงาน Interactive Shell vs Script Mode, และการเขียน Comment ทั้งแบบบรรทัดเดียวและหลายบรรทัด",
    conceptSummary: "### 📖 โครงสร้างภาษาและรูปแบบโปรแกรม (อ้างอิง MarcusCode):\\n2.1 **การประมวลผลโค้ด**: Python เป็น Interpreted Language ที่แปลงโค้ดเป็น Bytecode (.pyc) แล้วรันผ่าน Python Virtual Machine (PVM) ทีละบรรทัด\\n2.2 **โหมดการเขียนโปรแกรม**: โหมด Interactive Shell (REPL) สำหรับทดสอบคำสั่งสั้นๆ และ Script Mode (.py) สำหรับโปรแกรมขนาดเต็ม\\n2.3 **การ Comment โค้ด**: คอมเมนต์บรรทัดเดียวใช้เครื่องหมาย `#` ส่วนคอมเมนต์หลายบรรทัดหรือ Docstring ใช้ `\\\"\\\"\\\"...\\\"\\\"\\\"`\\n2.4 **การขึ้นบรรทัดใหม่**: Python ใช้การขึ้นบรรทัดใหม่แบ่งคำสั่ง ไม่ต้องใช้เซมิโคลอน (;)",
    commonPitfall: "⚠️ **Common Pitfall**: การใส่เครื่องหมายเซมิโคลอน (;) ปิดท้ายคำสั่งเหมือนภาษา C/Java แม้ Python จะยอมรับแต่ผิดหลัก PEP 8 และอย่าลืมว่า Comment ที่ขึ้นต้นด้วย # จะถูกข้าม ไม่ถูกนำไปประมวลผล!",
    keyPoints: [
      { title: "No Semicolons", desc: "Python ใช้การขึ้นบรรทัดใหม่แทนเซมิโคลอน ทำให้โค้ดสะอาดตา", icon: "✨" },
      { title: "Comments ด้วย #", desc: "ใช้ # สำหรับอธิบายการทำงานของโค้ด หรือบันทึกช่วยจำ", icon: "💬" },
      { title: "Docstring", desc: "ข้อความหลายบรรทัดครอบด้วย Triple Quotes ใช้เป็นเอกสารกำกับฟังก์ชัน", icon: "📝" },
    ],
    explanation: [
      "คอมเมนต์มีความสำคัญมากในการทำงานเป็นทีม ช่วยอธิบายเหตุผลและตรรกะเบื้องหลังโค้ด",
      "การขึ้นบรรทัดใหม่ใน Python เท่ากับเป็นการจบคำสั่งในบรรทัดนั้นโดยอัตโนมัติ",
    ],
    codeExample: "# นี่คือ Comment บรรทัดเดียว\\nprint(\\\"Line 1: Python Syntax\\\")\\n\\n\\\"\\\"\\\"\\nนี่คือตัวอย่าง Comment\\nแบบหลายบรรทัด (Docstring)\\n\\\"\\\"\\\"\\nprint(\\\"Line 2: Ready to Code\\\")",
    exampleCode: "# นี่คือ Comment บรรทัดเดียว\\nprint(\\\"Line 1: Python Syntax\\\")\\nprint(\\\"Line 2: Ready to Code\\\")",
    challengeTask: "เขียนคำสั่ง print() แสดงข้อความ 2 บรรทัด คือ \\\"Python Syntax\\\" และ \\\"Clean Code\\\" พร้อมใส่ Comment อธิบายด้านบน",
    challenge: "เขียนคำสั่ง print() แสดงข้อความ 2 บรรทัด คือ \\\"Python Syntax\\\" และ \\\"Clean Code\\\" พร้อมใส่ Comment อธิบายด้านบน",
    starPyHint: "ใช้ print(\\\"Python Syntax\\\") บรรทัดแรก และ print(\\\"Clean Code\\\") ในบรรทัดที่สองครับ",
    starterCode: "# อธิบายโค้ดด้วยคอมเมนต์ด้านล่างนี้\\n# บรรทัดที่ 1: แสดง Python Syntax\\nprint(\\\"Python Syntax\\\")\\n# บรรทัดที่ 2: แสดง Clean Code\\nprint(\\\"Clean Code\\\")\\n",
    expectedOutput: "Python Syntax\\nClean Code",
    hints: [
      "ขึ้นบรรทัดใหม่สำหรับคำสั่ง print แต่ละบรรทัด",
      "ใส่ Comment เริ่มต้นด้วยเครื่องหมาย #",
    ],
    testCases: [
      { id: "t1", name: "Output check", description: "ตรวจพบ Python Syntax และ Clean Code", check: (out) => out.includes("Python Syntax") && out.includes("Clean Code") },
      { id: "t2", name: "Comment check", description: "ตรวจพบการใส่ Comment # ในโค้ด", check: (_, __, code) => code.includes("#") },
    ],
    aiReviewTips: { pep8: "เว้นวรรค 1 ช่องหลังเครื่องหมาย # ใน Comment", pythonic: "จัดระเบียบบรรทัดได้ชัดเจน", efficiency: "O(1)" },
  },

  {
    id: 3,
    chapterId: 1,
    chapterTitle: "Chapter 1: Python Fundamentals & I/O",
    stepNumber: 3,
    totalSteps: 5,
    title: "ตัวแปรและประเภทข้อมูล (Variables & Primitive Types)",
    titleEn: "Variables & Primitive Data Types",
    category: "Variables",
    difficulty: "Beginner",
    summaryBadge: "Data Types",
    estimatedMinutes: 8,
    xp: 100,
    keySkills: ["Variables", "int", "float", "str", "bool", "PEP 8 Naming"],
    description: "เรียนรู้การประกาศตัวแปรด้วยเครื่องหมาย Assignment =, คุณสมบัติ Dynamic Typing, ชนิดข้อมูลพื้นฐาน int, float, str, bool และกฎการตั้งชื่อตัวแปร",
    conceptSummary: "### 📖 ตัวแปรและประเภทข้อมูล (อ้างอิง MarcusCode):\\n3.1 **ตัวแปร (Variables)**: ใช้เก็บข้อมูลในหน่วยความจำโดยการผูกชื่อตัวแปรเข้ากับค่าอ็อบเจกต์ด้วยเครื่องหมาย Assignment `=`\\n3.2 **คุณสมบัติ Dynamic Typing**: ไม่ต้องประกาศชนิดตัวแปรล่วงหน้า ชนิดตัวแปรจะเปลี่ยนตามค่าที่เก็บโดยอัตโนมัติ\\n3.3 **Primitive Data Types**:\\n- `int`: จำนวนเต็ม เช่น 10, -5, 0 (ไม่จำกัดขนาดตามหน่วยความจำ)\\n- `float`: จำนวนจริงทศนิยม เช่น 3.14, -0.01\\n- `str`: ข้อความสตริง เช่น \\\"Python\\\"\\n- `bool`: ค่าความจริง `True` หรือ `False` (ขึ้นต้นด้วยตัวพิมพ์ใหญ่)\\n3.4 **กฎการตั้งชื่อตัวแปร (PEP 8)**: ขึ้นต้นด้วยตัวอักษรหรือ `_` ห้ามขึ้นต้นด้วยตัวเลข, ห้ามมีช่องว่าง, ใช้ `snake_case` เช่น `user_age`, ห้ามใช้ Reserved Keywords\\n3.5 **Multiple Assignment**: กำหนดค่าหลายตัวพร้อมกัน เช่น `x, y = 10, 20` และสลับค่า `a, b = b, a`",
    commonPitfall: "⚠️ **Common Pitfall**: การนำตัวแปรต่างชนิดมาต่อกันตรงๆ เช่น `age = 20; print(\\\"Age: \\\" + age)` จะทำให้เกิด TypeError เพราะไม่สามารถนำสตริงมาบวกกับตัวเลขได้ ต้องแปลงด้วย `str(age)` หรือใช้ F-String เสมอ!",
    keyPoints: [
      { title: "Dynamic Typing", desc: "Python ระบุประเภทข้อมูลอัตโนมัติจากค่าที่กำหนด", icon: "🔄" },
      { title: "Primitive Types", desc: "int (จำนวนเต็ม), float (ทศนิยม), str (ข้อความ), bool (ความจริง)", icon: "📊" },
      { title: "snake_case", desc: "มาตรฐานการตั้งชื่อตัวแปรตัวพิมพ์เล็กคั่นด้วยขีดล่างตาม PEP 8", icon: "🐍" },
    ],
    explanation: [
      "เครื่องหมาย = คือการกำหนดค่า (Assignment) จากฝั่งขวาไปเก็บลงตัวแปรฝั่งซ้าย",
      "ฟังก์ชัน type(variable) สามารถใช้ตรวจสอบชนิดข้อมูลของตัวแปรในขณะทำงานได้",
    ],
    codeExample: "# การประกาศตัวแปรประเภทต่างๆ\\nlanguage = \\\"Python\\\"    # str\\nversion = 3             # int\\nrating = 4.9            # float\\nis_popular = True       # bool\\n\\nprint(language, version, rating, is_popular)",
    exampleCode: "language = \\\"Python\\\"\\nversion = 3\\nrating = 4.9\\nis_popular = True\\nprint(language, version, rating, is_popular)",
    challengeTask: "ประกาศตัวแปร name = \\\"PyStep\\\", level = 1, และ is_ready = True จากนั้นใช้ print(name, level, is_ready) แสดงผลออกทางหน้าจอ",
    challenge: "ประกาศตัวแปร name = \\\"PyStep\\\", level = 1, และ is_ready = True จากนั้นใช้ print(name, level, is_ready) แสดงผลออกทางหน้าจอ",
    starPyHint: "กำหนดตัวแปรให้ครบ 3 ตัว แล้วส่งทั้ง 3 ตัวเข้าไปในคำสั่ง print() คั่นด้วยจุลภาคครับ",
    starterCode: "# กำหนดตัวแปร name, level, is_ready\\nname = \\\"PyStep\\\"\\nlevel = 1\\nis_ready = True\\n\\n# แสดงผลทั้ง 3 ตัวแปร\\nprint(name, level, is_ready)\\n",
    expectedOutput: "PyStep 1 True",
    hints: [
      "กำหนด name = \\\"PyStep\\\"",
      "กำหนด level = 1 และ is_ready = True (สังเกต True ตัวพิมพ์ใหญ่)",
      "ใช้ print(name, level, is_ready)",
    ],
    testCases: [
      { id: "t1", name: "Output check", description: "ตรวจพบ PyStep 1 True ในผลลัพธ์", check: (out) => out.includes("PyStep") && out.includes("1") && out.includes("True") },
      { id: "t2", name: "Variables check", description: "ตรวจพบตัวแปร name, level, is_ready", check: (_, env) => env.name === "PyStep" && env.level === 1 && env.is_ready === true },
    ],
    aiReviewTips: { pep8: "เว้นวรรค 1 ช่องรอบเครื่องหมาย = เพื่อความอ่านง่าย", pythonic: "ตั้งชื่อตัวแปรสั้นกระชับ สื่อความหมายชัดเจน", efficiency: "O(1)" },
  },

  {
    id: 4,
    chapterId: 1,
    chapterTitle: "Chapter 1: Python Fundamentals & I/O",
    stepNumber: 4,
    totalSteps: 5,
    title: "การรับค่าและการแสดงผล (Standard I/O: print, escape, input)",
    titleEn: "Standard Input/Output & Formatting",
    category: "Standard I/O",
    difficulty: "Beginner",
    summaryBadge: "I/O Mastery",
    estimatedMinutes: 8,
    xp: 100,
    keySkills: ["print()", "Escape Sequences", "sep/end", "input()", "F-Strings"],
    description: "เจาะลึกฟังก์ชัน print() พร้อมพารามิเตอร์ sep และ end, การใช้อักขระพิเศษ Escape Sequences, F-Strings และหลักการทำงานของฟังก์ชัน input()",
    conceptSummary: `### 📖 การรับค่าและการแสดงผล (อ้างอิง MarcusCode):
4.1 **ฟังก์ชัน print() และพารามิเตอร์เสริม**:
- \`sep\`: ตัวคั่นระหว่างข้อมูล ค่าเริ่มต้นคือเว้นวรรค เช่น \`print("A", "B", sep="-")\` จะได้ \`A-B\`
- \`end\`: ตัวปิดท้ายข้อความ ค่าเริ่มต้นคือขึ้นบรรทัดใหม่ \`\n\` หากระบุ \`end=" "\` ข้อความถัดไปจะอยู่บรรทัดเดียวกัน
4.2 **Escape Sequences (อักขระพิเศษ)**:
- \`\n\`: Newline ขึ้นบรรทัดใหม่
- \`\t\`: Tab เว้นวรรค 4 ช่องเพื่อจัดตาราง
- \`\\\\\`: Backslash แสดงเครื่องหมายขีดทแยง
- \`\'\` และ \`\"\`: เครื่องหมายคำพูด
4.3 **F-Strings (Formatted String Literals)**: นำหน้าสตริงด้วยตัว \`f\` และแทรกตัวแปรในวงเล็บปีกกา \`f"Hello, {name}"\`
4.4 **ฟังก์ชัน input()**: รับค่าข้อความจากผู้ใช้ผ่านคีย์บอร์ด โดยค่าที่ได้จะเป็นประเภท **string (str)** เสมอ`,
    commonPitfall: "⚠️ **Common Pitfall**: การใช้ input() รับตัวเลขแล้วนำไปบวกกันตรงๆ เช่น a = input(); b = input(); print(a + b) หากผู้ใช้ป้อน 5 และ 3 ผลลัพธ์จะได้ \\\"53\\\" (String Concatenation) ไม่ใช่ 8 ต้องแปลงด้วย int(input()) ก่อนเสมอ!",
    keyPoints: [
      { title: "sep & end", desc: "ปรับแต่งตัวคั่น (sep) และตัวจบข้อความ (end) ใน print() ได้อิสระ", icon: "⚙️" },
      { title: "Escape Sequences", desc: "\\\\n สำหรับขึ้นบรรทัดใหม่ และ \\\\t สำหรับเคาะแท็บ", icon: "↵" },
      { title: "F-Strings", desc: "f\\\"Hello {name}\\\" คือวิธีจัดรูปแบบสตริงที่คลีนและเร็วที่สุด", icon: "💡" },
    ],
    explanation: [
      "Escape Sequence เริ่มต้นด้วยเครื่องหมาย Backslash (\\\\) เพื่อบอกให้ Python ทราบว่าเป็นคำสั่งพิเศษไม่ใช่ตัวอักษรธรรมดา",
      "F-String ได้รับการแนะนำตั้งแต่ Python 3.6+ และกลายเป็นมาตรฐานสูงสุดในการจัดรูปแบบข้อความ",
    ],
    codeExample: "# การใช้งาน sep, end และ Escape Sequences\\nprint(\\\"Apple\\\", \\\"Banana\\\", \\\"Cherry\\\", sep=\\\" | \\\")\\nprint(\\\"บรรทัดที่ 1\\\\nบรรทัดที่ 2\\\\tแท็บคอลัมน์\\\")\\n\\nname = \\\"Alex\\\"\\nscore = 95\\nprint(f\\\"ผู้เรียน: {name} ได้คะแนน: {score}\\\")",
    exampleCode: "print(\\\"Apple\\\", \\\"Banana\\\", \\\"Cherry\\\", sep=\\\" | \\\")\\nname = \\\"Alex\\\"\\nscore = 95\\nprint(f\\\"ผู้เรียน: {name} ได้คะแนน: {score}\\\")",
    challengeTask: "ให้ใช้ print() ร่วมกับ sep=\\\"-\\\" เพื่อแสดงคำว่า \\\"Python-Code-Mastery\\\" จากนั้นใช้ F-String แสดงข้อความ \\\"Total: 100 XP\\\" โดยเก็บตัวเลข 100 ในตัวแปร xp",
    challenge: "ให้ใช้ print() ร่วมกับ sep=\\\"-\\\" เพื่อแสดงคำว่า \\\"Python-Code-Mastery\\\" จากนั้นใช้ F-String แสดงข้อความ \\\"Total: 100 XP\\\" โดยเก็บตัวเลข 100 ในตัวแปร xp",
    starPyHint: "ใช้ print(\\\"Python\\\", \\\"Code\\\", \\\"Mastery\\\", sep=\\\"-\\\") และประกาศ xp = 100 แล้ว print(f\\\"Total: {xp} XP\\\") ครับ",
    starterCode: "# 1. แสดงผลด้วย sep=\\\"-\\\"\\nprint(\\\"Python\\\", \\\"Code\\\", \\\"Mastery\\\", sep=\\\"-\\\")\\n\\n# 2. กำหนดตัวแปร xp และแสดงผลด้วย f-string\\nxp = 100\\nprint(f\\\"Total: {xp} XP\\\")\\n",
    expectedOutput: "Python-Code-Mastery\\nTotal: 100 XP",
    hints: [
      "กำหนด sep=\\\"-\\\" ในฟังก์ชัน print",
      "สร้างตัวแปร xp = 100",
      "ใช้ f\\\"Total: {xp} XP\\\" ในการแสดงผลบรรทัดที่สอง",
    ],
    testCases: [
      { id: "t1", name: "Output check", description: "ตรวจพบ Python-Code-Mastery และ Total: 100 XP", check: (out) => out.includes("Python-Code-Mastery") && out.includes("Total: 100 XP") },
      { id: "t2", name: "sep check", description: "ตรวจพบการใช้งาน sep=", check: (_, __, code) => code.includes("sep=") },
    ],
    aiReviewTips: { pep8: "การส่ง Named Arguments เช่น sep=\"-\" ไม่ต้องเว้นวรรครอบเครื่องหมาย =", pythonic: "ใช้ F-string ได้อย่างถูกต้องและสละสลวย", efficiency: "O(1)" },
  },

  {
    id: 5,
    chapterId: 1,
    chapterTitle: "Chapter 1: Python Fundamentals & I/O",
    stepNumber: 5,
    totalSteps: 5,
    title: "การแปลงชนิดข้อมูล (Type Conversions & Casting)",
    titleEn: "Type Conversions & Type Casting",
    category: "Type Casting",
    difficulty: "Beginner",
    summaryBadge: "Type Casting",
    estimatedMinutes: 7,
    xp: 100,
    keySkills: ["int()", "float()", "str()", "bool()", "Type Casting"],
    description: "ศึกษาความแตกต่างระหว่าง Implicit Conversion กับ Explicit Conversion (Type Casting) และฟังก์ชันแปลงข้อมูล int(), float(), str(), bool()",
    conceptSummary: "### 📖 การแปลงชนิดข้อมูล (อ้างอิง MarcusCode):\\n5.1 **Implicit Type Conversion (แปลงอัตโนมัติ)**: Python ปรับชนิดข้อมูลให้เองเมื่อตัวแปรต่างชนิดทำงานร่วมกัน เช่น `3 + 2.5` จะกลายเป็น `5.5` (float) โดยไม่ทำให้ข้อมูลสูญหาย\\n5.2 **Explicit Type Conversion (Type Casting ด้วยฟังก์ชัน)**:\\n- `int(x)`: แปลงเป็นจำนวนเต็ม (หากแปลงจาก float จะตัดเศษทศนิยมทิ้งทันทีโดยไม่ปัดเศษ เช่น `int(9.8)` ได้ `9`)\\n- `float(x)`: แปลงเป็นจำนวนทศนิยม เช่น `float(\\\"3.14\\\")` ได้ `3.14`\\n- `str(x)`: แปลงข้อมูลทุกประเภทให้อยู่ในรูปข้อความสตริง\\n- `bool(x)`: แปลงเป็นค่าความจริง โดยค่า `0`, `0.0`, `\\\"\\\"`, `None`, `[]` จะได้ `False` นอกนั้นเป็น `True`\\n5.3 **ข้อผิดพลาด ValueError**: หากสตริงมีตัวอักษรปน เช่น `int(\\\"abc\\\")` หรือแปลงทศนิยมโดยตรง `int(\\\"3.14\\\")` จะเกิด ValueError",
    commonPitfall: "⚠️ **Common Pitfall**: การใช้ `int(\\\"3.14\\\")` ตรงๆ จะทำให้เกิด ValueError ทันที เพราะ int() ไม่สามารถแปลงสตริงที่มีจุดทศนิยมได้ วิธีแก้คือต้องแปลงเป็น float ก่อน: `int(float(\\\"3.14\\\"))`!",
    keyPoints: [
      { title: "int(x) ตัดเศษ", desc: "แปลง float เป็น int จะตัดเศษทิ้งทั้งหมด ไม่มีการปัดเศษขึ้น", icon: "✂️" },
      { title: "Explicit Casting", desc: "ใช้ฟังก์ชัน int(), float(), str(), bool() แปลงข้อมูลตามต้องการ", icon: "🔄" },
      { title: "Truthy & Falsy", desc: "ค่า 0, ข้อความว่าง, หรือ None เมื่อแปลงเป็น bool จะได้ False", icon: "⚖️" },
    ],
    explanation: [
      "การแปลงชนิดข้อมูลอย่างถูกต้องเป็นหัวใจสำคัญในการคำนวณและประมวลผลข้อมูลที่รับเข้ามาจากผู้ใช้",
      "โปรแกรมเมอร์ที่ดีจะระมัดระวังเรื่องชนิดข้อมูลเสมอเพื่อป้องกันไม่ให้เกิด TypeError หรือ ValueError ขณะรันโปรแกรม",
    ],
    codeExample: "# การแปลงชนิดข้อมูลใน Python\\nstr_num = \\\"50\\\"\\nconverted_int = int(str_num)\\n\\nprice = 99.95\\ninteger_price = int(price)   # ได้ 99 (ตัดเศษทิ้ง)\\n\\nprint(f\\\"Integer: {converted_int}, Cut Float: {integer_price}\\\")",
    exampleCode: "str_num = \\\"50\\\"\\nconverted_int = int(str_num)\\nprice = 99.95\\ninteger_price = int(price)\\nprint(f\\\"Integer: {converted_int}, Cut Float: {integer_price}\\\")",
    challengeTask: "มีตัวแปร text_a = \\\"40\\\" และ text_b = \\\"60\\\" ให้แปลงทั้งสองตัวเป็น int แล้วบวกกันเก็บในตัวแปร total จากนั้นแสดงผล \\\"Sum: 100\\\" ด้วยคำสั่ง print(f\\\"Sum: {total}\\\")",
    challenge: "มีตัวแปร text_a = \\\"40\\\" และ text_b = \\\"60\\\" ให้แปลงทั้งสองตัวเป็น int แล้วบวกกันเก็บในตัวแปร total จากนั้นแสดงผล \\\"Sum: 100\\\" ด้วยคำสั่ง print(f\\\"Sum: {total}\\\")",
    starPyHint: "ใช้ int(text_a) + int(text_b) เพื่อแปลงข้อความเป็นตัวเลขแล้วนำมาบวกกันครับ",
    starterCode: "text_a = \\\"40\\\"\\ntext_b = \\\"60\\\"\\n\\n# แปลง text_a และ text_b เป็น int แล้วบวกกัน\\ntotal = int(text_a) + int(text_b)\\n\\n# แสดงผลลัพธ์\\nprint(f\\\"Sum: {total}\\\")\\n",
    expectedOutput: "Sum: 100",
    hints: [
      "ใช้ฟังก์ชัน int() ครอบตัวแปร text_a และ text_b",
      "นำค่าทั้งสองมาบวกกันแล้วกำหนดให้ตัวแปร total",
      "แสดงผลลัพธ์ด้วย f\\\"Sum: {total}\\\"",
    ],
    testCases: [
      { id: "t1", name: "Output check", description: "ตรวจพบ Sum: 100 ในผลลัพธ์", check: (out) => out.includes("Sum: 100") },
      { id: "t2", name: "int casting check", description: "ตรวจพบการใช้ int() แปลงค่า", check: (_, __, code) => code.includes("int(") },
    ],
    aiReviewTips: { pep8: "เว้นวรรค 1 ช่องรอบเครื่องหมาย + และ = ตามมาตรฐาน", pythonic: "แปลง Type เพื่อคำนวณอย่างถูกต้องตามแนวทาง Python", efficiency: "O(1)" },
  },

  /* ══════════════════════════════════════════════════════════════════
     CHAPTER 2: Operators & Control Flow (Steps 6-9)
  ══════════════════════════════════════════════════════════════════ */
  {
    id: 6,
    chapterId: 2,
    chapterTitle: "Chapter 2: Operators & Control Flow",
    stepNumber: 1,
    totalSteps: 4,
    title: "ตัวดำเนินการ (Operators: Arithmetic, Comparison, Logical)",
    titleEn: "Operators: Arithmetic, Comparison & Logical",
    category: "Operators",
    difficulty: "Beginner",
    summaryBadge: "Operators",
    estimatedMinutes: 8,
    xp: 100,
    keySkills: ["Arithmetic", "Comparison", "Logical", "Precedence"],
    description: "เรียนรู้ตัวดำเนินการทางคณิตศาสตร์ +, -, *, /, //, %, ** ตัวดำเนินการเปรียบเทียบ ==, !=, >, < และตัวดำเนินการทางตรรกะ and, or, not",
    conceptSummary: "### 📖 ตัวดำเนินการในภาษา Python (อ้างอิง MarcusCode):\\n6.1 **Arithmetic Operators (คณิตศาสตร์)**:\\n- `+` (บวก), `-` (ลบ), `*` (คูณ), `/` (หาร ได้ทศนิยมเสมอ)\\n- `//` (Floor Division หารปัดเศษทิ้ง)\\n- `%` (Modulus เศษเหลือจากการหาร เช่น `10 % 3` ได้ `1`)\\n- `**` (Exponentiation ยกกำลัง เช่น `2 ** 3` ได้ `8`)\\n6.2 **Comparison Operators (เปรียบเทียบ)**: `==` (เท่ากับ), `!=` (ไม่เท่ากับ), `>`, `<`, `>=`, `<=\\n6.3 **Logical Operators (ตรรกะ)**:\\n- `and`: True เมื่อทั้งสองฝั่งเป็น True\\n- `or`: True เมื่อฝั่งใดฝั่งหนึ่งเป็น True\\n- `not`: สลับค่าความจริง\\n6.4 **Operator Precedence (ลำดับความสำคัญ)**: วงเล็บ `()` > ยกกำลัง `**` > คูณหาร `* / // %` > บวกลบ `+ -` > เปรียบเทียบ > ตรรกะ (`not` ก่อน `and` ก่อน `or`)",
    commonPitfall: "⚠️ **Common Pitfall**: การใช้เครื่องหมายเท่ากับตัวเดียว `=` (Assignment กำหนดค่า) สับสนกับเครื่องหมายเท่ากับสองตัว `==` (Comparison ตรวจสอบความเท่ากัน) เป็นข้อผิดพลาดที่พบบ่อยที่สุด!",
    keyPoints: [
      { title: "// และ %", desc: "// หารเอาผลลัพธ์จำนวนเต็ม และ % หาเศษเหลือ เหมาะสำหรับตรวจสอบเลขคู่คี่", icon: "➗" },
      { title: "== vs =", desc: "= คือการบันทึกค่าลงตัวแปร ส่วน == คือการตรวจสอบว่าสองฝั่งเท่ากันหรือไม่", icon: "⚖️" },
      { title: "and, or, not", desc: "คำเชื่อมตรรกะใน Python ใช้อักษรภาษาอังกฤษตรงๆ แทน && หรือ ||", icon: "🧠" },
    ],
    explanation: [
      "เครื่องหมายการหารธรรมดา (/) ใน Python 3 จะให้ผลลัพธ์เป็น float เสมอ เช่น 4 / 2 ได้ 2.0",
      "ตัวดำเนินการทางตรรกะ and, or ใน Python ทำงานแบบ Short-Circuit Evaluation เพื่อความรวดเร็ว",
    ],
    codeExample: "# การใช้งานตัวดำเนินการคณิตศาสตร์และตรรกะ\\nx = 17\\ny = 5\\n\\nprint(\\\"หารปัดเศษ // :\\\", x // y)  # ได้ 3\\nprint(\\\"เศษเหลือ % :\\\", x % y)     # ได้ 2\\nprint(\\\"ยกกำลัง ** :\\\", 2 ** 4)     # ได้ 16\\n\\nis_valid = (x > 10) and (y < 10)\\nprint(\\\"ตรรกะ AND :\\\", is_valid)     # True",
    exampleCode: "x = 17\\ny = 5\\nprint(\\\"หารปัดเศษ // :\\\", x // y)\\nprint(\\\"เศษเหลือ % :\\\", x % y)\\nis_valid = (x > 10) and (y < 10)\\nprint(\\\"ตรรกะ AND :\\\", is_valid)",
    challengeTask: "คำนวณหาเศษเหลือจากการหาร 25 ด้วย 4 โดยใช้ตัวดำเนินการ % เก็บในตัวแปร rem และคำนวณ 3 ยกกำลัง 3 ด้วย ** เก็บในตัวแปร pwr จากนั้นแสดงผล print(rem, pwr)",
    challenge: "คำนวณหาเศษเหลือจากการหาร 25 ด้วย 4 โดยใช้ตัวดำเนินการ % เก็บในตัวแปร rem และคำนวณ 3 ยกกำลัง 3 ด้วย ** เก็บในตัวแปร pwr จากนั้นแสดงผล print(rem, pwr)",
    starPyHint: "กำหนด rem = 25 % 4 และ pwr = 3 ** 3 แล้ว print(rem, pwr) ครับ",
    starterCode: "# คำนวณเศษเหลือและเลขยกกำลัง\\nrem = 25 % 4\\npwr = 3 ** 3\\n\\n# แสดงผลลัพธ์\\nprint(rem, pwr)\\n",
    expectedOutput: "1 27",
    hints: [
      "ใช้เครื่องหมาย % สำหรับหาเศษเหลือ (25 % 4)",
      "ใช้เครื่องหมาย ** สำหรับการยกกำลัง (3 ** 3)",
      "ใช้ print(rem, pwr) เพื่อแสดงผลลัพธ์",
    ],
    testCases: [
      { id: "t1", name: "Output check", description: "ตรวจพบ 1 27 ในผลลัพธ์", check: (out) => out.includes("1") && out.includes("27") },
      { id: "t2", name: "Operators check", description: "ตรวจพบการใช้ % และ **", check: (_, env) => env.rem === 1 && env.pwr === 27 },
    ],
    aiReviewTips: { pep8: "ใส่วงเล็บเมื่อมีสูตรคำนวณซับซ้อนเพื่อให้อ่านง่าย", pythonic: "ใช้ตัวดำเนินการเฉพาะทางของ Python อย่างคุ้มค่า", efficiency: "O(1)" },
  },

  {
    id: 7,
    chapterId: 2,
    chapterTitle: "Chapter 2: Operators & Control Flow",
    stepNumber: 2,
    totalSteps: 4,
    title: "คำสั่งเลือกเงื่อนไขพื้นฐาน (if statement และ Indentation)",
    titleEn: "Basic If Statement & Indentation",
    category: "Conditionals",
    difficulty: "Beginner",
    summaryBadge: "If Statement",
    estimatedMinutes: 7,
    xp: 100,
    keySkills: ["if", "Indentation", "Boolean Conditions"],
    description: "ทำความเข้าใจโครงสร้างคำสั่ง if, ความสำคัญของการย่อหน้า (Indentation 4 ช่อง) ที่เป็นเอกลักษณ์ของ Python และเครื่องหมาย Colon (:)",
    conceptSummary: "### 📖 คำสั่ง if และการย่อหน้า (อ้างอิง MarcusCode):\\n7.1 **ไวยากรณ์คำสั่ง if**: `if condition:` โค้ดที่อยู่ภายในบล็อกจะทำงานเมื่อเงื่อนไขได้รับการประเมินเป็น `True` เท่านั้น\\n7.2 **ความสำคัญสูงสุดของ Indentation (การย่อหน้า)**: Python ไม่ใช้วงเล็บปีกกา `{}` แต่ใช้การเว้นวรรค 4 spaces กำหนดขอบเขตคำสั่ง บรรทัดที่ย่อหน้าเท่ากันจะถือเป็นบล็อกคำสั่งเดียวกัน\\n7.3 **เครื่องหมายโคลอน (Colon :)**: ทุกประโยคควบคุมเงื่อนไขต้องลงท้ายด้วยเครื่องหมาย `:` เสมอ เพื่อบอกจุดเริ่มต้นของบล็อกคำสั่งย่อย",
    commonPitfall: "⚠️ **Common Pitfall**: การลืมใส่เครื่องหมายโคลอน (:) ท้ายเงื่อนไข หรือการย่อหน้าไม่ตรงกัน (IndentationError) เกิดขึ้นบ่อยมากเมื่อคัดลอกโค้ดมาวาง!",
    keyPoints: [
      { title: "เครื่องหมาย :", desc: "ต้องมีเครื่องหมายโคลอนท้ายบรรทัด if เสมอ", icon: "📌" },
      { title: "4 Spaces Indent", desc: "ใช้การเคาะ Space 4 ครั้งเพื่อระบุคำสั่งที่อยู่ใต้เงื่อนไข", icon: "📐" },
      { title: "Conditional Block", desc: "หากเงื่อนไขเป็น False โค้ดในบล็อกย่อหน้าจะถูกข้ามทันที", icon: "⏭️" },
    ],
    explanation: [
      "Indentation เป็นการบังคับให้โปรแกรมเมอร์ทุกคนเขียนโค้ดที่สะอาดตาและมีระเบียบเดียวกันโดยธรรมชาติของภาษา",
      "คำสั่งที่อยู่นอกบล็อก if (ไม่มีย่อหน้า) จะทำงานเสมอไม่ว่าเงื่อนไขจะเป็นจริงหรือไม่",
    ],
    codeExample: "score = 85\\n\\n# ตรวจสอบว่าคะแนนผ่านเกณฑ์หรือไม่\\nif score >= 50:\\n    print(\\\"ผลการเรียน: ผ่านเกณฑ์การประเมิน\\\")\\n    print(\\\"ยินดีด้วย คุณได้ไปต่อใน Step ถัดไป\\\")\\n\\nprint(\\\"สิ้นสุดการตรวจสอบ\\\")",
    exampleCode: "score = 85\\nif score >= 50:\\n    print(\\\"ผลการเรียน: ผ่านเกณฑ์การประเมิน\\\")\\n    print(\\\"ยินดีด้วย คุณได้ไปต่อใน Step ถัดไป\\\")",
    challengeTask: "เขียนคำสั่ง if เพื่อตรวจสอบว่าถ้าตัวแปร score มากกว่าหรือเท่ากับ 50 ให้แสดงข้อความ \\\"Passed\\\"",
    challenge: "เขียนคำสั่ง if เพื่อตรวจสอบว่าถ้าตัวแปร score มากกว่าหรือเท่ากับ 50 ให้แสดงข้อความ \\\"Passed\\\"",
    starPyHint: "กำหนด score = 80 แล้วเขียน if score >= 50: ตามด้วยย่อหน้า 4 เคาะแล้ว print(\\\"Passed\\\") ครับ",
    starterCode: "score = 80\\n\\n# ตรวจสอบเงื่อนไข score >= 50\\nif score >= 50:\\n    print(\\\"Passed\\\")\\n",
    expectedOutput: "Passed",
    hints: [
      "เขียน if score >= 50: (อย่าลืมเครื่องหมาย :)",
      "ย่อหน้าบรรทัดถัดไป 4 เคาะก่อนพิมพ์ print(\\\"Passed\\\")",
    ],
    testCases: [
      { id: "t1", name: "Output check", description: "ตรวจพบข้อความ Passed", check: (out) => out.includes("Passed") },
      { id: "t2", name: "if syntax check", description: "ตรวจพบคำสั่ง if score >= 50:", check: (_, __, code) => code.includes("if") && code.includes(":") },
    ],
    aiReviewTips: { pep8: "ย่อหน้า 4 spaces อย่างสม่ำเสมอตามมาตรฐาน PEP 8", pythonic: "เงื่อนไขตรงไปตรงมา ชัดเจน", efficiency: "O(1)" },
  },

  {
    id: 8,
    chapterId: 2,
    chapterTitle: "Chapter 2: Operators & Control Flow",
    stepNumber: 3,
    totalSteps: 4,
    title: "คำสั่งเลือกเงื่อนไขทางเลือก (if-else และ if-elif-else)",
    titleEn: "Alternative Conditionals: if-else & if-elif-else",
    category: "Conditionals",
    difficulty: "Beginner",
    summaryBadge: "Branching",
    estimatedMinutes: 9,
    xp: 100,
    keySkills: ["if-else", "if-elif-else", "Multi-branch Logic"],
    description: "เรียนรู้โครงสร้างการแตกกิ่งเงื่อนไขแบบ 2 ทางเลือก (if-else) และหลายทางเลือก (if-elif-else) พร้อมลำดับการตรวจสอบแบบบนลงล่าง",
    conceptSummary: "### 📖 โครงสร้างเงื่อนไขทางเลือก (อ้างอิง MarcusCode):\\n8.1 **โครงสร้าง if-else**: เมื่อเงื่อนไขใน if เป็น False โปรแกรมจะข้ามไปประมวลผลคำสั่งในบล็อก `else:` ทันที\\n8.2 **โครงสร้าง if-elif-else (Multiple Branches)**: คำว่า `elif` ย่อมาจาก \\\"else if\\\" ใช้สำหรับตรวจสอบหลายเงื่อนไขตามลำดับจากบนลงล่าง\\n8.3 **พฤติกรรม Short-Circuit**: เมื่อ Python พบเงื่อนไขแรกที่เป็น True ในชุด if-elif-else จะทำงานในบล็อกนั้นแล้ว **ข้ามเงื่อนไขที่เหลือทั้งหมดทันที**\\n8.4 **บล็อก else ปิดท้าย**: เป็นทางเลือกสุดท้ายที่จะทำงานเมื่อไม่มีเงื่อนไขใดด้านบนเป็นจริงเลย",
    commonPitfall: "⚠️ **Common Pitfall**: การเรียงลำดับเงื่อนไขผิด เช่น ตรวจสอบ score >= 50 ก่อน score >= 80 ส่งผลให้คนที่ได้ 90 คะแนนตกไปเข้าบล็อก >= 50 ก่อนเสมอ การเรียงเงื่อนไขจากเจาะจงมากไปหาน้อยจึงสำคัญอย่างยิ่ง!",
    keyPoints: [
      { title: "else ทางเลือกเท็จ", desc: "ทำงานเมื่อเงื่อนไขก่อนหน้าทั้งหมดประเมินเป็น False", icon: "🔀" },
      { title: "elif หลายทางเลือก", desc: "ใช้ตรวจสอบเงื่อนไขถัดไปทีละขั้นจากบนลงล่าง", icon: "🪜" },
      { title: "ลำดับการตรวจสอบ", desc: "เงื่อนไขแรกที่เป็นจริงจะทำงาน และเงื่อนไขที่เหลือจะถูกข้ามทันที", icon: "⚡" },
    ],
    explanation: [
      "elif ช่วยให้โปรแกรมไม่ต้องเขียน if ซ้อน if หลายชั้น โค้ดจะอ่านง่ายและเป็นระเบียบ",
      "ในชุด if-elif-else จะมีบล็อกคำสั่งเพียงบล็อกเดียวเท่านั้นที่ได้ทำงานจริง",
    ],
    codeExample: "score = 75\\n\\nif score >= 80:\\n    grade = \\\"A\\\"\\nelif score >= 70:\\n    grade = \\\"B\\\"\\nelif score >= 60:\\n    grade = \\\"C\\\"\\nelse:\\n    grade = \\\"F\\\"\\n\\nprint(f\\\"คะแนน: {score} ได้เกรด: {grade}\\\")",
    exampleCode: "score = 75\\nif score >= 80:\\n    grade = \\\"A\\\"\\nelif score >= 70:\\n    grade = \\\"B\\\"\\nelse:\\n    grade = \\\"F\\\"\\nprint(f\\\"ได้เกรด: {grade}\\\")",
    challengeTask: "เขียนโครงสร้าง if-elif-else ตรวจสอบคะแนน: ถ้า score >= 80 ให้ print(\\\"Grade A\\\"), ถ้า score >= 50 ให้ print(\\\"Grade B\\\"), นอกนั้นให้ print(\\\"Grade F\\\")",
    challenge: "เขียนโครงสร้าง if-elif-else ตรวจสอบคะแนน: ถ้า score >= 80 ให้ print(\\\"Grade A\\\"), ถ้า score >= 50 ให้ print(\\\"Grade B\\\"), นอกนั้นให้ print(\\\"Grade F\\\")",
    starPyHint: "กำหนด score = 85 แล้วเขียน if score >= 80: ตามด้วย elif score >= 50: และ else: ครับ",
    starterCode: "score = 85\\n\\n# เขียนเงื่อนไข if-elif-else\\nif score >= 80:\\n    print(\\\"Grade A\\\")\\nelif score >= 50:\\n    print(\\\"Grade B\\\")\\nelse:\\n    print(\\\"Grade F\\\")\\n",
    expectedOutput: "Grade A",
    hints: [
      "เขียน if score >= 80: ตามด้วย print(\\\"Grade A\\\")",
      "เขียน elif score >= 50: ตามด้วย print(\\\"Grade B\\\")",
      "ปิดท้ายด้วย else: ตามด้วย print(\\\"Grade F\\\")",
    ],
    testCases: [
      { id: "t1", name: "Output check", description: "ตรวจพบ Grade A ในผลลัพธ์", check: (out) => out.includes("Grade A") },
      { id: "t2", name: "elif check", description: "ตรวจพบการใช้ elif", check: (_, __, code) => code.includes("elif") },
    ],
    aiReviewTips: { pep8: "บล็อก if, elif, else ต้องมีระดับย่อหน้าตรงกันเสมอ", pythonic: "จัดเรียงเงื่อนไขตามลำดับตรรกะที่ถูกต้อง", efficiency: "O(1)" },
  },

  {
    id: 9,
    chapterId: 2,
    chapterTitle: "Chapter 2: Operators & Control Flow",
    stepNumber: 4,
    totalSteps: 4,
    title: "เงื่อนไขซ้อนเงื่อนไข (Nested Conditions & Guard Clauses)",
    titleEn: "Nested Conditions & Clean Logic",
    category: "Conditionals",
    difficulty: "Intermediate",
    summaryBadge: "Nested If",
    estimatedMinutes: 8,
    xp: 100,
    keySkills: ["Nested If", "Guard Clauses", "Logical Combinations"],
    description: "เข้าใจการซ้อนเงื่อนไขภายในเงื่อนไขหลัก (Nested If), ปัญหา Arrow Anti-pattern, และเทคนิคการลดความซับซ้อนด้วย Guard Clauses",
    conceptSummary: "### 📖 เงื่อนไขซ้อนเงื่อนไข (อ้างอิง MarcusCode):\\n9.1 **Nested If (เงื่อนไขซ้อนเงื่อนไข)**: คือการนำคำสั่ง if ไปใส่ไว้ภายในบล็อกของ if อีกชั้นหนึ่ง เพื่อคัดกรองเงื่อนไขย่อยเมื่อเงื่อนไขหลักผ่านแล้ว\\n9.2 **ปัญหา Arrow Anti-pattern**: การซ้อน if ลึกเกิน 3 ชั้นจะทำให้โค้ดเอียงเป็นรูปหัวลูกศร (Arrow Shape) ซึ่งอ่านและบำรุงรักษายากมาก\\n9.3 **เทคนิคการแก้ปัญหาด้วย Guard Clauses & Logical Operators**: ใช้ตัวดำเนินการ `and` รวมเงื่อนไข หรือใช้การตัดจบตั้งแต่ต้น (Early Return / Exit) เพื่อรักษาบล็อกคำสั่งให้แบนเรียบและอ่านง่าย",
    commonPitfall: "⚠️ **Common Pitfall**: การซ้อน if หลายชั้นทำให้สับสนระดับ Indentation ส่งผลให้คำสั่ง else ไปจับคู่กับ if ผิดตัวจนเกิดข้อผิดพลาดทางตรรกะ (Logical Bug)!",
    keyPoints: [
      { title: "Nested Decision", desc: "ตรวจสอบเงื่อนไขรองเมื่อเงื่อนไขหลักผ่านการประเมินแล้ว", icon: "🎯" },
      { title: "Avoid Deep Nesting", desc: "พยายามไม่ซ้อนเกิน 2-3 ชั้นเพื่อรักษาความอ่านง่ายของโค้ด", icon: "🛡️" },
      { title: "Combine with and", desc: "ใช้ and รวมเงื่อนไขเข้าด้วยกันเพื่อลดระดับย่อหน้า", icon: "🔗" },
    ],
    explanation: [
      "การออกแบบตรรกะการตัดสินใจที่ดีจะเน้นความเรียบง่ายและตรวจสอบกรณีที่ไม่ถูกต้องก่อนเสมอ",
      "การใช้เครื่องหมาย and เชื่อมเงื่อนไขช่วยลดการซ้อนคำสั่ง if ลงได้อย่างมาก",
    ],
    codeExample: "age = 22\\nhas_license = True\\n\\n# ตรวจสอบแบบเงื่อนไขซ้อนเงื่อนไข\\nif age >= 18:\\n    if has_license:\\n        print(\\\"อนุญาตให้ขับขี่ยานพาหนะได้\\\")\\n    else:\\n        print(\\\"อายุถึงเกณฑ์แต่ยังไม่มีใบอนุญาต\\\")\\nelse:\\n    print(\\\"อายุยังไม่ถึงเกณฑ์\\\")",
    exampleCode: "age = 22\\nhas_license = True\\nif age >= 18:\\n    if has_license:\\n        print(\\\"อนุญาตให้ขับขี่ยานพาหนะได้\\\")\\n    else:\\n        print(\\\"ยังไม่มีใบอนุญาต\\\")",
    challengeTask: "กำหนด age = 20 และ is_member = True ให้เขียนเงื่อนไขซ้อน: ถ้า age >= 18 และข้างในตรวจถ้า is_member เป็น True ให้ print(\\\"Access Granted\\\")",
    challenge: "กำหนด age = 20 และ is_member = True ให้เขียนเงื่อนไขซ้อน: ถ้า age >= 18 และข้างในตรวจถ้า is_member เป็น True ให้ print(\\\"Access Granted\\\")",
    starPyHint: "เขียน if age >= 18: แล้วข้างในเขียน if is_member: print(\\\"Access Granted\\\") ครับ",
    starterCode: "age = 20\\nis_member = True\\n\\n# ตรวจสอบเงื่อนไขซ้อนเงื่อนไข\\nif age >= 18:\\n    if is_member:\\n        print(\\\"Access Granted\\\")\\n",
    expectedOutput: "Access Granted",
    hints: [
      "เขียน if age >= 18: เป็นเงื่อนไขหลัก",
      "ย่อหน้า 4 เคาะแล้วเขียน if is_member: เป็นเงื่อนไขย่อย",
      "ย่อหน้าอีก 4 เคาะ (รวมเป็น 8 เคาะ) แล้วพิมพ์ print(\\\"Access Granted\\\")",
    ],
    testCases: [
      { id: "t1", name: "Output check", description: "ตรวจพบ Access Granted ในผลลัพธ์", check: (out) => out.includes("Access Granted") },
      { id: "t2", name: "Nested check", description: "ตรวจพบการใช้ if สองชั้น", check: (_, __, code) => (code.match(/if /g) || []).length >= 2 },
    ],
    aiReviewTips: { pep8: "รักษาระดับการย่อหน้า 4 และ 8 เคาะให้ตรงเป๊ะ", pythonic: "พิจารณาใช้ if age >= 18 and is_member: เมื่อต้องการความกระชับ", efficiency: "O(1)" },
  },

  /* ══════════════════════════════════════════════════════════════════
     CHAPTER 3: Loops & Data Sequences (Steps 10-14)
  ══════════════════════════════════════════════════════════════════ */
  {
    id: 10,
    chapterId: 3,
    chapterTitle: "Chapter 3: Loops & Data Sequences",
    stepNumber: 1,
    totalSteps: 5,
    title: "คำสั่งวนซ้ำแบบ While Loop และการป้องกัน Infinite Loop",
    titleEn: "While Loop & Preventing Infinite Loops",
    category: "Loops",
    difficulty: "Beginner",
    summaryBadge: "While Loop",
    estimatedMinutes: 8,
    xp: 100,
    keySkills: ["while", "Loop Counter", "Infinite Loop Prevention"],
    description: "เข้าใจหลักการทำงานของคำสั่งวนซ้ำแบบ While Loop, ตัวแปรนับรอบ (Counter), และแนวทางการป้องกันไม่ให้เกิดลูปอนันต์ (Infinite Loop)",
    conceptSummary: "### 📖 คำสั่ง While Loop (อ้างอิง MarcusCode):\\n10.1 **โครงสร้างคำสั่ง While Loop**: `while condition:` จะทำงานวนซ้ำบล็อกคำสั่งตราบเท่าที่เงื่อนไขยังคงมีค่าเป็น `True` เหมาะสำหรับลูปที่ไม่ทราบจำนวนรอบล่วงหน้า\\n10.2 **องค์ประกอบสำคัญ 3 ประการของลูป**:\\n1. การกำหนดค่าเริ่มต้นของตัวแปรควบคุม (Initialization) เช่น `count = 1`\\n2. เงื่อนไขการตรวจสอบ (Condition) เช่น `while count <= 5:`\\n3. การเปลี่ยนแปลงค่าตัวแปรควบคุม (Update / Increment) เช่น `count += 1`\\n10.3 **อันตรายของ Infinite Loop (ลูปอนันต์)**: หากลืมเปลี่ยนแปลงค่าตัวแปร เงื่อนไขจะไม่มีวันเป็น False ส่งผลให้โปรแกรมทำงานไม่รู้จบและกินทรัพยากร CPU จนค้าง",
    commonPitfall: "⚠️ **Common Pitfall**: ลืมใส่คำสั่งอัปเดตตัวแปร เช่น ลืมใส่ `i += 1` ภายในบล็อก while ทำให้เงื่อนไขเป็นจริงตลอดกาลจนกลายเป็น Infinite Loop!",
    keyPoints: [
      { title: "Condition-Driven", desc: "ลูปทำงานตราบใดที่เงื่อนไขเป็นจริง เหมาะกับสถานะแบบพลวัต", icon: "🔄" },
      { title: "Increment สำคัญ", desc: "ต้องมีคำสั่ง count += 1 เสมอเพื่อนำลูปไปสู่จุดสิ้นสุด", icon: "➕" },
      { title: "Infinite Loop Guard", desc: "ตรวจสอบเงื่อนไขให้แน่ใจว่าจะมีรอบที่ประเมินเป็น False ได้", icon: "🛡️" },
    ],
    explanation: [
      "เครื่องหมาย += (Augmented Assignment) เช่น count += 1 มีความหมายเทียบเท่ากับ count = count + 1",
      "การตรวจสอบเงื่อนไขของ while loop จะเกิดขึ้นก่อนเริ่มประมวลผลคำสั่งในแต่ละรอบเสมอ (Pre-test Loop)",
    ],
    codeExample: "# การนับเลข 1 ถึง 5 ด้วย While Loop\\ncount = 1\\nwhile count <= 5:\\n    print(f\\\"รอบที่ {count}\\\")\\n    count += 1\\n\\nprint(\\\"จบลูปการทำงาน\\\")",
    exampleCode: "count = 1\\nwhile count <= 3:\\n    print(f\\\"รอบที่ {count}\\\")\\n    count += 1",
    challengeTask: "เขียน while loop นับเลขจาก 1 ถึง 3 โดยให้แสดงผลลัพธ์เป็น \\\"Count: 1\\\", \\\"Count: 2\\\", \\\"Count: 3\\\" ในแต่ละบรรทัด",
    challenge: "เขียน while loop นับเลขจาก 1 ถึง 3 โดยให้แสดงผลลัพธ์เป็น \\\"Count: 1\\\", \\\"Count: 2\\\", \\\"Count: 3\\\" ในแต่ละบรรทัด",
    starPyHint: "กำหนด i = 1 แล้วใช้ while i <= 3: print(f\\\"Count: {i}\\\") และอย่าลืม i += 1 ครับ",
    starterCode: "i = 1\\n\\n# เขียนคำสั่ง while loop\\nwhile i <= 3:\\n    print(f\\\"Count: {i}\\\")\\n    i += 1\\n",
    expectedOutput: "Count: 1\\nCount: 2\\nCount: 3",
    hints: [
      "กำหนดตัวแปรเริ่มต้น i = 1",
      "เขียนเงื่อนไข while i <= 3:",
      "อย่าลืมคำสั่ง i += 1 ในบล็อกย่อหน้าเพื่อขยับรอบการทำงาน",
    ],
    testCases: [
      { id: "t1", name: "Output check", description: "ตรวจพบ Count: 1, 2, 3 ในผลลัพธ์", check: (out) => out.includes("Count: 1") && out.includes("Count: 2") && out.includes("Count: 3") },
      { id: "t2", name: "while check", description: "ตรวจพบคำสั่ง while", check: (_, __, code) => code.includes("while") },
    ],
    aiReviewTips: { pep8: "เว้นวรรครอบเครื่องหมาย <= และ += เสมอ", pythonic: "การใช้ while loop ควบคุมรอบได้อย่างถูกต้องและปลอดภัย", efficiency: "O(N)" },
  },

  {
    id: 11,
    chapterId: 3,
    chapterTitle: "Chapter 3: Loops & Data Sequences",
    stepNumber: 2,
    totalSteps: 5,
    title: "คำสั่งวนซ้ำแบบ For Loop และฟังก์ชัน range()",
    titleEn: "For Loop & range() Function",
    category: "Loops",
    difficulty: "Beginner",
    summaryBadge: "For Loop",
    estimatedMinutes: 8,
    xp: 100,
    keySkills: ["for in", "range()", "Sequence Iteration"],
    description: "เรียนรู้คำสั่ง For Loop สำหรับวนรอบตามจำนวนที่ทราบแน่ชัด และการใช้งานฟังก์ชัน range() ครบทั้ง 3 รูปแบบ (start, stop, step)",
    conceptSummary: "### 📖 คำสั่ง For Loop และฟังก์ชัน range() (อ้างอิง MarcusCode):\\n11.1 **โครงสร้าง For Loop**: `for item in sequence:` เป็นการวนซ้ำแบบ For-Each ที่ดึงข้อมูลจาก Sequence หรือ Iterator ออกมาประมวลผลทีละตัวจนหมด\\n11.2 **ฟังก์ชัน range() ลึกซึ้ง 3 รูปแบบ**:\\n- `range(stop)`: เริ่มจาก 0 ถึง `stop - 1` เช่น `range(4)` ได้ 0, 1, 2, 3\\n- `range(start, stop)`: กำหนดจุดเริ่มต้นและจุดสิ้นสุด เช่น `range(1, 5)` ได้ 1, 2, 3, 4 (ไม่รวมเลข 5)\\n- `range(start, stop, step)`: กำหนดระยะก้าว เช่น `range(2, 10, 2)` ได้ 2, 4, 6, 8\\n11.3 **การวนลูปถอยหลัง**: กำหนดค่า step ติดลบ เช่น `range(5, 0, -1)` ได้ 5, 4, 3, 2, 1",
    commonPitfall: "⚠️ **Common Pitfall**: ลืมว่าค่าพารามิเตอร์ stop ในฟังก์ชัน range(start, stop) จะทำงานถึงแค่ `stop - 1` เสมอ! เช่น หากต้องการวนถึงเลข 10 ต้องเขียนเป็น range(1, 11)!",
    keyPoints: [
      { title: "Iterate ผ่าน Sequence", desc: "For loop ใน Python ออกแบบมาสำหรับวนอ่านข้อมูลใน Sequence โดยตรง", icon: "🔁" },
      { title: "range() ประหยัด RAM", desc: "range() สร้างค่าแบบ Generator ไม่ได้สร้างก้อนข้อมูลจริงใน RAM", icon: "⚡" },
      { title: "Step Parameter", desc: "สามารถกำหนดระยะก้าวได้ทั้งบวก (เดินหน้า) และลบ (ถอยหลัง)", icon: "👟" },
    ],
    explanation: [
      "ฟังก์ชัน range() ใน Python 3 เป็น immutable sequence type ที่กินหน่วยความจำคงที่ $O(1)$ แม้จะสร้างช่วงตัวเลขหลักล้าน",
      "For loop เหมาะอย่างยิ่งสำหรับงานที่ทราบจำนวนรอบที่แน่นอน หรือต้องการเข้าถึงสมาชิกทุกตัวในโครงสร้างข้อมูล",
    ],
    codeExample: "# ตัวอย่างการใช้ for loop ร่วมกับ range()\\nprint(\\\"--- นับ 1 ถึง 4 ---\\\")\\nfor i in range(1, 5):\\n    print(i)\\n\\nprint(\\\"--- เลขคู่ 2 ถึง 8 ---\\\")\\nfor num in range(2, 9, 2):\\n    print(num)",
    exampleCode: "for i in range(1, 4):\\n    print(f\\\"Step {i}\\\")",
    challengeTask: "เขียนคำสั่ง for loop ร่วมกับ range(1, 4) เพื่อแสดงข้อความ \\\"Step 1\\\", \\\"Step 2\\\", \\\"Step 3\\\" ในแต่ละบรรทัด",
    challenge: "เขียนคำสั่ง for loop ร่วมกับ range(1, 4) เพื่อแสดงข้อความ \\\"Step 1\\\", \\\"Step 2\\\", \\\"Step 3\\\" ในแต่ละบรรทัด",
    starPyHint: "ใช้ for i in range(1, 4): ตามด้วย print(f\\\"Step {i}\\\") ครับ",
    starterCode: "# เขียนคำสั่ง for loop ด้วย range(1, 4)\\nfor i in range(1, 4):\\n    print(f\\\"Step {i}\\\")\\n",
    expectedOutput: "Step 1\\nStep 2\\nStep 3",
    hints: [
      "ใช้คำสั่ง for i in range(1, 4):",
      "ย่อหน้า 4 เคาะในบรรทัดถัดไป",
      "ใช้ f-string print(f\\\"Step {i}\\\")",
    ],
    testCases: [
      { id: "t1", name: "Output check", description: "ตรวจพบ Step 1, Step 2, Step 3", check: (out) => out.includes("Step 1") && out.includes("Step 2") && out.includes("Step 3") },
      { id: "t2", name: "range check", description: "ตรวจพบการใช้ range(1, 4)", check: (_, __, code) => code.includes("range(1, 4)") || code.includes("range(1,4)") },
    ],
    aiReviewTips: { pep8: "ชื่อตัวแปรนับรอบ i, j เหมาะกับลูปตัวเลขธรรมดา", pythonic: "ใช้ for-in range ตามหลักการ Python มาตรฐาน", efficiency: "O(N)" },
  },

  {
    id: 12,
    chapterId: 3,
    chapterTitle: "Chapter 3: Loops & Data Sequences",
    stepNumber: 3,
    totalSteps: 5,
    title: "การควบคุมการทำงานของลูป (break, continue, pass)",
    titleEn: "Loop Control: break, continue & pass",
    category: "Loops",
    difficulty: "Intermediate",
    summaryBadge: "Loop Control",
    estimatedMinutes: 8,
    xp: 100,
    keySkills: ["break", "continue", "pass", "For-Else"],
    description: "ควบคุมการทำงานของลูปด้วยคำสั่ง break เพื่อหยุดลูปทันที, continue เพื่อข้ามรอบปัจจุบัน, pass และบล็อก else ของลูป",
    conceptSummary: "### 📖 การควบคุมการทำงานของลูป (อ้างอิง MarcusCode):\\n12.1 **คำสั่ง break**: บังคับให้โปรแกรมหยุดการทำงานของลูปทันทีและกระโดดออกไปทำงานคำสั่งถัดไปนอกลูป เหมาะสำหรับการตัดจบลูปเมื่อพบข้อมูลที่ต้องการแล้ว\\n12.2 **คำสั่ง continue**: ข้ามคำสั่งที่เหลือทั้งหมดในรอบปัจจุบัน แล้วกระโดดกลับขึ้นไปเริ่มตรวจสอบและทำงานในรอบถัดไปทันที\\n12.3 **คำสั่ง pass**: เป็นคำสั่งว่างเปล่า (Null statement) ไม่ทำสิ่งใดเลย ใช้เป็นตัวกันที่ (Placeholder) เพื่อป้องกัน SyntaxError เมื่อยังเขียนโค้ดไม่เสร็จ\\n12.4 **บล็อก else ในลูป**: บล็อก else ของลูปจะทำงานเฉพาะเมื่อลูปวนครบทุกรอบตามปกติ **โดยไม่ถูกสั่งหยุดด้วยคำสั่ง break**",
    commonPitfall: "⚠️ **Common Pitfall**: การวางคำสั่ง continue ไว้ก่อนคำสั่งอัปเดตตัวแปรใน while loop จะส่งผลให้ตัวแปรไม่ถูกเพิ่มค่าและติด Infinite Loop ทันที!",
    keyPoints: [
      { title: "break ตัดจบ", desc: "ยุติลูปทันทีและกระโดดออกไปทำงานนอกลูป", icon: "⏹️" },
      { title: "continue ข้ามรอบ", desc: "ข้ามคำสั่งที่เหลือในรอบปัจจุบันแล้วเริ่มรอบถัดไป", icon: "⏭️" },
      { title: "pass กันที่", desc: "Placeholder สำหรับบล็อกที่ยังไม่ได้เขียนเนื้อหา", icon: "⏸️" },
    ],
    explanation: [
      "break ช่วยเพิ่มประสิทธิภาพโปรแกรมอย่างมาก เพราะไม่ต้องเสียเวลาวนลูปต่อเมื่อพบข้อมูลที่ค้นหาแล้ว",
      "continue มักใช้สำหรับคัดกรองข้อมูลที่ไม่ตรงเงื่อนไขทิ้งไป เช่น การข้ามเลขคี่เมื่อต้องการนับเฉพาะเลขคู่",
    ],
    codeExample: "# ตัวอย่างการใช้ break และ continue\\nprint(\\\"--- ตัวอย่าง continue (ข้ามเลข 3) ---\\\")\\nfor i in range(1, 6):\\n    if i == 3:\\n        continue\\n    print(i)\\n\\nprint(\\\"--- ตัวอย่าง break (หยุดเมื่อเจอ 4) ---\\\")\\nfor i in range(1, 6):\\n    if i == 4:\\n        break\\n    print(i)",
    exampleCode: "for i in range(1, 6):\\n    if i == 3:\\n        continue\\n    if i == 5:\\n        break\\n    print(i)",
    challengeTask: "เขียน for loop จาก 1 ถึง 5 โดยถ้า i == 3 ให้ข้ามด้วย continue และแสดงผลลัพธ์ตัวเลขที่เหลือออกทางหน้าจอ",
    challenge: "เขียน for loop จาก 1 ถึง 5 โดยถ้า i == 3 ให้ข้ามด้วย continue และแสดงผลลัพธ์ตัวเลขที่เหลือออกทางหน้าจอ",
    starPyHint: "ใช้ for i in range(1, 6): ตรวจ if i == 3: continue แล้ว print(i) ด้านล่างครับ",
    starterCode: "# วนลูป 1 ถึง 5 และข้ามเลข 3 ด้วย continue\\nfor i in range(1, 6):\\n    if i == 3:\\n        continue\\n    print(i)\\n",
    expectedOutput: "1\\n2\\n4\\n5",
    hints: [
      "ใช้ for i in range(1, 6):",
      "ตรวจสอบ if i == 3: แล้วสั่ง continue",
      "คำสั่ง print(i) ต้องอยู่นอกบล็อก if",
    ],
    testCases: [
      { id: "t1", name: "Output check", description: "ตรวจพบ 1, 2, 4, 5 และไม่พบ 3 ในผลลัพธ์", check: (out) => out.includes("1") && out.includes("2") && !out.includes("3") && out.includes("4") && out.includes("5") },
      { id: "t2", name: "continue check", description: "ตรวจพบการใช้ continue", check: (_, __, code) => code.includes("continue") },
    ],
    aiReviewTips: { pep8: "วางคำสั่งควบคุมลูปให้มีระดับย่อหน้าที่ถูกต้อง", pythonic: "ใช้ continue ช่วยลดระดับเงื่อนไขซ้อนกันในลูป", efficiency: "O(N)" },
  },

  {
    id: 13,
    chapterId: 3,
    chapterTitle: "Chapter 3: Loops & Data Sequences",
    stepNumber: 4,
    totalSteps: 5,
    title: "ข้อมูลแบบข้อความและเมธอดของ String",
    titleEn: "String Manipulation & String Methods",
    category: "Strings",
    difficulty: "Intermediate",
    summaryBadge: "Strings",
    estimatedMinutes: 9,
    xp: 100,
    keySkills: ["Indexing", "Slicing", "upper/lower", "strip", "replace", "split/join"],
    description: "เจาะลึกคุณสมบัติ Immutable ของ String, การเข้าถึงตัวอักษรด้วย Indexing และ Slicing, พร้อมเมธอดจัดการข้อความสำคัญจาก MarcusCode",
    conceptSummary: "### 📖 ข้อมูลแบบ String และเมธอด (อ้างอิง MarcusCode):\\n13.1 **คุณสมบัติ Immutable**: String ใน Python ไม่สามารถแก้ไขค่าตัวอักษรเดิมในหน่วยความจำได้ การเรียกใช้เมธอดจะได้สตริงตัวใหม่เสมอ\\n13.2 **String Indexing & Slicing**:\\n- Index จากซ้ายเริ่มที่ `0` และจากขวาเริ่มที่ `-1`\\n- Slicing: `text[start:stop:step]` เช่น `text[0:4]` หรือกลับด้านสตริงด้วย `text[::-1]`\\n13.3 **เมธอดสำคัญของ String (MarcusCode)**:\\n- `.upper()` / `.lower()`: แปลงเป็นพิมพ์ใหญ่/เล็ก\\n- `.strip()`: ตัดช่องว่างหัวท้าย\\n- `.replace(old, new)`: แทนที่คำ\\n- `.split(delimiter)`: แยกสตริงออกเป็น List\\n- `delimiter.join(list)`: รวม List กลับเป็นสตริง\\n- `.find(sub)` และ `.count(sub)`: ค้นหาตำแหน่งและนับจำนวนคำ",
    commonPitfall: "⚠️ **Common Pitfall**: การเข้าใจผิดว่า `text.upper()` จะเปลี่ยนค่าตัวแปรเดิมทันที เนื่องจาก String เป็น Immutable คำสั่งนี้จะส่งสตริงใหม่ออกมา ต้องนำตัวแปรมารับค่า เช่น `text = text.upper()` เสมอ!",
    keyPoints: [
      { title: "Immutable Sequence", desc: "สตริงไม่สามารถแก้ไขค่าตรงๆ ได้ การเปลี่ยนแปลงจะได้ค่าสตริงใหม่", icon: "🔒" },
      { title: "Slicing ทรงพลัง", desc: "text[start:stop] ตัดทอนและแบ่งส่วนข้อความได้อย่างอิสระ", icon: "✂️" },
      { title: "Built-in Methods", desc: "เมธอด .replace(), .split(), .join() อำนวยความสะดวกในระดับสูง", icon: "🛠️" },
    ],
    explanation: [
      "ฟังก์ชัน len(text) ใช้หาความยาวจำนวนตัวอักษรทั้งหมดในสตริง",
      "การจัดเก็บข้อความใน Python 3 ใช้มาตรฐาน Unicode (UTF-8) โดยสมบูรณ์ รองรับภาษาไทยได้ 100%",
    ],
    codeExample: "# การใช้งาน String Methods\\nmsg = \\\"  hello, python programmers  \\\"\\nclean_msg = msg.strip().title()\\nprint(\\\"Clean:\\\", clean_msg)\\n\\nwords = clean_msg.split(\\\", \\\")\\nprint(\\\"Split List:\\\", words)\\n\\njoined = \\\" - \\\".join(words)\\nprint(\\\"Joined:\\\", joined)",
    exampleCode: "msg = \\\"hello python\\\"\\nupper_msg = msg.upper()\\nprint(upper_msg)",
    challengeTask: "มีตัวแปร word = \\\"python\\\" ให้แปลงเป็นตัวพิมพ์ใหญ่ด้วย .upper() แล้วแสดงผล \\\"PYTHON\\\" ออกทางหน้าจอ",
    challenge: "มีตัวแปร word = \\\"python\\\" ให้แปลงเป็นตัวพิมพ์ใหญ่ด้วย .upper() แล้วแสดงผล \\\"PYTHON\\\" ออกทางหน้าจอ",
    starPyHint: "ใช้ word.upper() แล้วสั่ง print() ได้เลยครับ",
    starterCode: "word = \\\"python\\\"\\n\\n# แปลงเป็นตัวพิมพ์ใหญ่แล้วแสดงผล\\nprint(word.upper())\\n",
    expectedOutput: "PYTHON",
    hints: [
      "เรียกใช้เมธอด word.upper()",
      "ส่งผลลัพธ์เข้าไปในคำสั่ง print()",
    ],
    testCases: [
      { id: "t1", name: "Output check", description: "ตรวจพบ PYTHON ในผลลัพธ์", check: (out) => out.includes("PYTHON") },
      { id: "t2", name: "upper method check", description: "ตรวจพบการเรียกใช้ .upper()", check: (_, __, code) => code.includes(".upper()") },
    ],
    aiReviewTips: { pep8: "จัดลำดับการเรียกเมธอดเป็นสาย (Method Chaining) ให้อ่านง่าย", pythonic: "ใช้ประโยชน์จาก Built-in String Methods ของ Python", efficiency: "O(N)" },
  },

  {
    id: 14,
    chapterId: 3,
    chapterTitle: "Chapter 3: Loops & Data Sequences",
    stepNumber: 5,
    totalSteps: 5,
    title: "โครงสร้างข้อมูล Sequence & Collections (Lists, Tuples, Dictionaries, Sets)",
    titleEn: "Sequences & Collections: Lists, Tuples, Dicts & Sets",
    category: "Data Structures",
    difficulty: "Intermediate",
    summaryBadge: "Collections",
    estimatedMinutes: 10,
    xp: 100,
    keySkills: ["List", "Tuple", "Dictionary", "Set", "CRUD operations"],
    description: "เปรียบเทียบและใช้งานโครงสร้างข้อมูลหลักทั้ง 4 ของ Python อิงตาม MarcusCode: List (แก้ไขได้), Tuple (คงที่), Dictionary (Key-Value) และ Set (ค่าไม่ซ้ำ)",
    conceptSummary: "### 📖 โครงสร้างข้อมูล Sequence & Collections (อ้างอิง MarcusCode):\\n14.1 **List (รายการข้อมูลลำดับ)**: กำหนดด้วย `[...]\\ เป็นข้อมูลแบบ **Mutable** (เพิ่ม/ลบ/แก้ไขได้) รองรับ `.append(x)`, `.insert(i, x)`, `.pop()`, `.remove(val)`, `.sort()`, `.reverse()`\\n14.2 **Tuple (ทูเพิล)**: กำหนดด้วย `(...)` เป็นข้อมูลแบบ **Immutable** (แก้ไขค่าไม่ได้) ทำงานเร็วกว่า List และใช้พื้นที่หน่วยความจำน้อยกว่า เหมาะสำหรับข้อมูลคงที่\\n14.3 **Dictionary (ดิกชันนารี)**: เก็บข้อมูลแบบ **Key-Value Pairs** กำหนดด้วย `{key: value}` ค้นหาข้อมูลได้รวดเร็วมากระดับ $O(1)$ ด้วย Hash Table รองรับ `.keys()`, `.values()`, `.items()`, `.get(key, default)`\\n14.4 **Set (เซต)**: เก็บกลุ่มข้อมูลที่ **ไม่ซ้ำกัน (Unique)** กำหนดด้วย `{...}` รองรับ `.add()`, `.remove()`, และการทำเซต `union()`, `intersection()`",
    commonPitfall: "⚠️ **Common Pitfall**: การเข้าถึง Key ใน Dictionary ที่ไม่มีอยู่จริงด้วย `data[key]` จะทำให้โปรแกรมแครชด้วย KeyError ทันที! ควรใช้ `data.get(key, default)` เพื่อความปลอดภัยเสมอ!",
    keyPoints: [
      { title: "List (Mutable)", desc: "เก็บข้อมูลเป็นลำดับ เพิ่ม ลบ แก้ไขได้อย่างอิสระ", icon: "📋" },
      { title: "Tuple (Immutable)", desc: "ล็อคข้อมูลห้ามแก้ไข เหมาะกับพิกัดและค่าคงที่", icon: "🔒" },
      { title: "Dict (Key-Value)", desc: "ค้นหาด้วย Key ได้เร็วที่สุดระดับ O(1) ผ่าน Hash Table", icon: "📖" },
      { title: "Set (Unique)", desc: "กรองข้อมูลที่ซ้ำกันออกโดยอัตโนมัติ", icon: "✨" },
    ],
    explanation: [
      "การเลือกโครงสร้างข้อมูลที่เหมาะสมกับงานช่วยเพิ่มทั้งความเร็วในการประมวลผลและความปลอดภัยของโค้ด",
      "Dictionary เป็นโครงสร้างข้อมูลที่ถูกใช้งานบ่อยที่สุดใน Python ทั้งในงาน Web API, JSON, และ Data Science",
    ],
    codeExample: "# ตัวอย่าง Collections ทั้ง 4 ชนิด\\nfruits = [\\\"Apple\\\", \\\"Banana\\\"]      # List\\nfruits.append(\\\"Orange\\\")\\n\\ncoords = (13.75, 100.50)           # Tuple (Latitude, Longitude)\\n\\nstudent = {\\\"name\\\": \\\"Anna\\\", \\\"xp\\\": 1500} # Dictionary\\n\\nunique_tags = {\\\"python\\\", \\\"ai\\\", \\\"python\\\"} # Set (จะเหลือ 2 ตัว)\\n\\nprint(\\\"List:\\\", fruits)\\nprint(\\\"Dict name:\\\", student.get(\\\"name\\\"))\\nprint(\\\"Set tags:\\\", unique_tags)",
    exampleCode: "fruits = [\\\"Apple\\\", \\\"Banana\\\"]\\nfruits.append(\\\"Orange\\\")\\nprint(fruits)",
    challengeTask: "สร้าง List ชื่อ items = [\\\"Python\\\", \\\"Code\\\"] จากนั้นใช้ items.append(\\\"Mastery\\\") เพื่อเพิ่มข้อมูล และแสดงผล print(items) ออกทางหน้าจอ",
    challenge: "สร้าง List ชื่อ items = [\\\"Python\\\", \\\"Code\\\"] จากนั้นใช้ items.append(\\\"Mastery\\\") เพื่อเพิ่มข้อมูล และแสดงผล print(items) ออกทางหน้าจอ",
    starPyHint: "สร้าง items = [\\\"Python\\\", \\\"Code\\\"] แล้วสั่ง items.append(\\\"Mastery\\\") ก่อน print(items) ครับ",
    starterCode: "# สร้าง List และเพิ่มข้อมูลด้วย append\\nitems = [\\\"Python\\\", \\\"Code\\\"]\\nitems.append(\\\"Mastery\\\")\\n\\n# แสดงผล List\\nprint(items)\\n",
    expectedOutput: "['Python', 'Code', 'Mastery']",
    hints: [
      "กำหนด items = [\\\"Python\\\", \\\"Code\\\"]",
      "เรียกใช้ items.append(\\\"Mastery\\\")",
      "แสดงผลด้วย print(items)",
    ],
    testCases: [
      { id: "t1", name: "Output check", description: "ตรวจพบ Python, Code, Mastery ใน List", check: (out) => out.includes("Python") && out.includes("Code") && out.includes("Mastery") },
      { id: "t2", name: "append check", description: "ตรวจพบการใช้ .append()", check: (_, __, code) => code.includes(".append(") },
    ],
    aiReviewTips: { pep8: "เว้นวรรค 1 ช่องหลังเครื่องหมายจุลภาคใน List และ Dict", pythonic: "เลือกใช้ Collection ชนิดที่ตรงตามความต้องการของข้อมูล", efficiency: "append O(1)" },
  },

  /* ══════════════════════════════════════════════════════════════════
     CHAPTER 4: Functions & Modules (Steps 15-17)
  ══════════════════════════════════════════════════════════════════ */
  {
    id: 15,
    chapterId: 4,
    chapterTitle: "Chapter 4: Functions & Modules",
    stepNumber: 1,
    totalSteps: 3,
    title: "การสร้างและเรียกใช้ฟังก์ชัน (Functions: def, parameters, arguments)",
    titleEn: "Function Definition, Parameters & Arguments",
    category: "Functions",
    difficulty: "Intermediate",
    summaryBadge: "Functions",
    estimatedMinutes: 9,
    xp: 100,
    keySkills: ["def", "Parameters", "Arguments", "Default Values"],
    description: "เรียนรู้การประกาศฟังก์ชันด้วยคีย์เวิร์ด def, ความแตกต่างระหว่าง Parameters กับ Arguments, Positional vs Keyword Arguments และการกำหนดค่าเริ่มต้น (Default Parameters)",
    conceptSummary: "### 📖 การสร้างและเรียกใช้ฟังก์ชัน (อ้างอิง MarcusCode):\\n15.1 **การนิยามฟังก์ชัน (Definition)**: ใช้คำสั่ง `def function_name(param1, param2):` ช่วยลดความซ้ำซ้อนของโค้ดตามหลักการ DRY (Don't Repeat Yourself)\\n15.2 **Parameters vs Arguments**:\\n- Parameter: ชื่อตัวแปรที่ระบุไว้ในวงเล็บตอนนิยามฟังก์ชันเพื่อรอรับค่า\\n- Argument: ค่าข้อมูลจริงที่ส่งเข้าไปตอนเรียกใช้งานฟังก์ชัน\\n15.3 **รูปแบบการส่งค่า Arguments**:\\n- Positional Arguments: ส่งค่าตามลำดับตำแหน่ง\\n- Keyword Arguments: ระบุชื่อพารามิเตอร์ชัดเจน เช่น `func(age=20, name=\\\"Bob\\\")`\\n- Default Parameter Values: กำหนดค่าเริ่มต้นให้พารามิเตอร์ เช่น `def greet(name=\\\"Guest\\\"):`\\n15.4 **ฟังก์ชัน docstring**: คำอธิบายการทำงานของฟังก์ชันที่บรรจุไว้ใน Triple Quotes ใต้บรรทัด def",
    commonPitfall: "⚠️ **Common Pitfall**: ในการกำหนด Default Parameters ห้ามวางตัวแปรที่มี default value ไว้ข้างหน้าตัวแปรที่ไม่มี default value เด็ดขาด เช่น `def func(a=1, b):` จะเกิด SyntaxError ทันที!",
    keyPoints: [
      { title: "def สร้างฟังก์ชัน", desc: "รวมชุดคำสั่งเป็นกลุ่มที่นำกลับมาเรียกใช้ซ้ำได้ไม่จำกัด", icon: "📦" },
      { title: "Default Parameters", desc: "กำหนดค่าเริ่มต้นให้ฟังก์ชันทำงานได้แม้ไม่ส่งค่าเข้ามา", icon: "⚙️" },
      { title: "DRY Principle", desc: "Don't Repeat Yourself ลดความซ้ำซ้อน เพิ่มความง่ายในการแก้ไข", icon: "🔁" },
    ],
    explanation: [
      "ฟังก์ชันคือบล็อกคำสั่งที่ทำงานเฉพาะเจาะจง จะเริ่มทำงานเมื่อถูกเรียกชื่อฟังก์ชันเท่านั้น",
      "การตั้งชื่อฟังก์ชันควรใช้คำกริยาในรูปแบบ snake_case เช่น calculate_tax, get_user_name",
    ],
    codeExample: "# การประกาศฟังก์ชันพร้อม Default Parameter\\ndef greet_user(name, role=\\\"Learner\\\"):\\n    print(f\\\"สวัสดีคุณ {name} (สถานะ: {role})\\\")\\n\\n# เรียกใช้งานทั้งสองแบบ\\ngreet_user(\\\"กิตติพงษ์\\\")\\ngreet_user(\\\"สมศรี\\\", role=\\\"Admin\\\")",
    exampleCode: "def greet(name):\\n    print(f\\\"Hello, {name}!\\\")\\n\\ngreet(\\\"PyStep\\\")",
    challengeTask: "สร้างฟังก์ชันชื่อ greet(name) ที่เมื่อเรียกใช้งานจะพิมพ์ข้อความ f\\\"Hello, {name}!\\\" จากนั้นเรียก greet(\\\"PyStep\\\")",
    challenge: "สร้างฟังก์ชันชื่อ greet(name) ที่เมื่อเรียกใช้งานจะพิมพ์ข้อความ f\\\"Hello, {name}!\\\" จากนั้นเรียก greet(\\\"PyStep\\\")",
    starPyHint: "เขียน def greet(name): แล้วย่อหน้าพิมพ์ print(f\\\"Hello, {name}!\\\") จากนั้นเรียก greet(\\\"PyStep\\\") ครับ",
    starterCode: "# สร้างฟังก์ชัน greet(name)\\ndef greet(name):\\n    print(f\\\"Hello, {name}!\\\")\\n\\n# เรียกใช้ฟังก์ชัน\\ngreet(\\\"PyStep\\\")\\n",
    expectedOutput: "Hello, PyStep!",
    hints: [
      "นิยามฟังก์ชันด้วย def greet(name):",
      "ย่อหน้า 4 เคาะแล้วพิมพ์คำสั่งแสดงผล",
      "เรียกใช้งานฟังก์ชันด้านนอกบล็อก greet(\\\"PyStep\\\")",
    ],
    testCases: [
      { id: "t1", name: "Output check", description: "ตรวจพบ Hello, PyStep! ในผลลัพธ์", check: (out) => out.includes("Hello, PyStep!") },
      { id: "t2", name: "def check", description: "ตรวจพบการสร้างฟังก์ชัน def greet", check: (_, __, code) => code.includes("def greet(") },
    ],
    aiReviewTips: { pep8: "เว้น 2 บรรทัดว่างระหว่างฟังก์ชันและโค้ดหลักตามสไตล์ PEP 8", pythonic: "ออกแบบฟังก์ชันให้รับผิดชอบงานเดียวอย่างชัดเจน", efficiency: "O(1)" },
  },

  {
    id: 16,
    chapterId: 4,
    chapterTitle: "Chapter 4: Functions & Modules",
    stepNumber: 2,
    totalSteps: 3,
    title: "การคืนค่าด้วยคำสั่ง return และขอบเขตตัวแปร (Scope)",
    titleEn: "Return Statement & Variable Scope",
    category: "Functions",
    difficulty: "Intermediate",
    summaryBadge: "Return & Scope",
    estimatedMinutes: 9,
    xp: 100,
    keySkills: ["return", "Local Scope", "Global Scope", "global keyword"],
    description: "เข้าใจการส่งค่าผลลัพธ์กลับจากฟังก์ชันด้วยคำสั่ง return, การคืนค่าหลายค่าพร้อมกัน, ความแตกต่างระหว่าง Local Scope และ Global Scope รวมถึงคีย์เวิร์ด global",
    conceptSummary: "### 📖 คำสั่ง return และขอบเขตตัวแปร (อ้างอิง MarcusCode):\\n16.1 **คำสั่ง return**: หยุดการทำงานของฟังก์ชันทันทีและส่งค่าผลลัพธ์กลับไปยังผู้เรียก เพื่อนำไปเก็บลงตัวแปรหรือคำนวณต่อ\\n16.2 **ฟังก์ชันที่ไม่มี return**: จะส่งค่ากลับเป็น `None` โดยอัตโนมัติ\\n16.3 **การคืนค่าหลายค่า (Multiple Returns)**: Python สามารถคืนค่าหลายค่าพร้อมกันได้ โดยจะถูกจัดแพ็กเป็น Tuple อัตโนมัติ เช่น `return min_val, max_val`\\n16.4 **ขอบเขตตัวแปร (Variable Scope)**:\\n- Local Scope: ตัวแปรที่ประกาศภายในฟังก์ชัน จะมีชีวิตอยู่เฉพาะตอนที่ฟังก์ชันทำงาน และเรียกใช้จากภายนอกไม่ได้\\n- Global Scope: ตัวแปรที่ประกาศอยู่นอกฟังก์ชัน สามารถเรียกดูค่าได้ทั่วทั้งโปรแกรม\\n16.5 **คีย์เวิร์ด global**: ใช้เมื่อจำเป็นต้องแก้ไขค่าตัวแปรระดับ Global จากภายในฟังก์ชัน",
    commonPitfall: "⚠️ **Common Pitfall**: การพยายามแก้ไขค่าตัวแปร Global ภายในฟังก์ชันโดยลืมประกาศ `global my_var` จะทำให้เกิด UnboundLocalError ทันที!",
    keyPoints: [
      { title: "return ส่งค่าผลลัพธ์", desc: "นำผลลัพธ์การคำนวณส่งกลับไปใช้งานต่อที่จุดเรียก", icon: "↩️" },
      { title: "Local vs Global", desc: "ตัวแปรในฟังก์ชันเป็น Local ไม่รบกวนตัวแปรภายนอก", icon: "🌐" },
      { title: "Tuple Packing", desc: "return x, y สามารถส่งกลับหลายค่าพร้อมกันได้ในบรรทัดเดียว", icon: "📦" },
    ],
    explanation: [
      "คำสั่งใดๆ ที่อยู่ใต้คำสั่ง return ภายในฟังก์ชันเดียวกันจะไม่มีวันถูกประมวลผล (Dead Code)",
      "หลีกเลี่ยงการใช้ตัวแปร global บ่อยเกินไป เพราะทำให้ตรวจสอบข้อผิดพลาดในโปรแกรมขนาดใหญ่ได้ยาก",
    ],
    codeExample: "# ตัวอย่างการใช้ return และ Scope\\ndef add_numbers(a, b):\\n    result = a + b    # result คือ Local Variable\\n    return result\\n\\nans = add_numbers(15, 35)\\nprint(f\\\"ผลรวม: {ans}\\\")",
    exampleCode: "def multiply(a, b):\\n    return a * b\\n\\nresult = multiply(4, 5)\\nprint(result)",
    challengeTask: "สร้างฟังก์ชัน multiply(a, b) ที่คืนค่าผลคูณ a * b ด้วยคำสั่ง return จากนั้นเรียก multiply(4, 5) เก็บในตัวแปร result แล้วแสดงผลลัพธ์",
    challenge: "สร้างฟังก์ชัน multiply(a, b) ที่คืนค่าผลคูณ a * b ด้วยคำสั่ง return จากนั้นเรียก multiply(4, 5) เก็บในตัวแปร result แล้วแสดงผลลัพธ์",
    starPyHint: "เขียน def multiply(a, b): return a * b แล้วเรียก result = multiply(4, 5) ครับ",
    starterCode: "# สร้างฟังก์ชัน multiply(a, b) ด้วยคำสั่ง return\\ndef multiply(a, b):\\n    return a * b\\n\\n# เรียกใช้และเก็บผลลัพธ์\\nresult = multiply(4, 5)\\nprint(result)\\n",
    expectedOutput: "20",
    hints: [
      "นิยามฟังก์ชัน def multiply(a, b):",
      "ย่อหน้าแล้วเขียน return a * b",
      "เรียกใช้ result = multiply(4, 5) และ print(result)",
    ],
    testCases: [
      { id: "t1", name: "Output check", description: "ตรวจพบผลลัพธ์ 20", check: (out) => out.includes("20") },
      { id: "t2", name: "return check", description: "ตรวจพบการใช้ return", check: (_, __, code) => code.includes("return") },
    ],
    aiReviewTips: { pep8: "ชื่อตัวแปรที่รับค่า return ควรสื่อความหมายชัดเจน", pythonic: "การใช้ return ส่งค่าทำให้ฟังก์ชันเป็น Pure Function", efficiency: "O(1)" },
  },

  {
    id: 17,
    chapterId: 4,
    chapterTitle: "Chapter 4: Functions & Modules",
    stepNumber: 3,
    totalSteps: 3,
    title: "ฟังก์ชันแบบย่อ (Lambda function) และการใช้งาน Modules ใน Python",
    titleEn: "Lambda Functions & Module Imports",
    category: "Functions & Modules",
    difficulty: "Intermediate",
    summaryBadge: "Lambda & Modules",
    estimatedMinutes: 9,
    xp: 100,
    keySkills: ["lambda", "import", "math", "random", "Custom Modules"],
    description: "เรียนรู้ Anonymous Function ด้วยคำสั่ง Lambda, การนำไปใช้ร่วมกับ Higher-Order Functions, การนำเข้าและใช้งาน Modules สำคัญ เช่น math และ random",
    conceptSummary: "### 📖 Lambda Functions และการใช้งาน Modules (อ้างอิง MarcusCode):\\n17.1 **Lambda Function (ฟังก์ชันนิรนาม)**: ไวยากรณ์ `lambda arguments: expression` เป็นฟังก์ชันบรรทัดเดียวที่ไม่ต้องตั้งชื่อ คืนค่าผลลัพธ์ของนิพจน์ทันที เหมาะสำหรับงานสั้นๆ\\n17.2 **การใช้งาน Lambda ร่วมกับฟังก์ชันระดับสูง**: นิยมส่งเป็นคีย์ใน `sorted(list, key=lambda x: ...)` หรือใช้ร่วมกับ `map()` และ `filter()`\\n17.3 **การใช้งาน Modules ใน Python**:\\n- โมดูลคือไฟล์ `.py` ที่รวบรวมฟังก์ชันและตัวแปรไว้ให้โปรแกรมอื่นเรียกใช้\\n- รูปแบบการนำเข้า: `import math`, `from math import sqrt, pi`, `import random as rnd`\\n- โมดูลมาตรฐานยอดนิยม: `math` (คณิตศาสตร์ชั้นสูง), `random` (การสุ่ม), `os`, `sys`\\n17.4 **การสร้างโมดูลของตัวเอง**: สร้างไฟล์ `my_tools.py` แล้วสามารถเขียน `import my_tools` ในไฟล์หลักได้ทันที",
    commonPitfall: "⚠️ **Common Pitfall**: หลีกเลี่ยงการใช้ `from module import *` เพราะจะทำให้ชื่อฟังก์ชันในโมดูลไหลเข้ามาทับซ้อนกับชื่อตัวแปรในโปรแกรมของคุณ (Namespace Pollution) จนเกิดบั๊กที่หายาก!",
    keyPoints: [
      { title: "lambda สั้นกระชับ", desc: "ฟังก์ชันบรรทัดเดียว ไร้ชื่อ เหมาะกับงานคำนวณและเรียงลำดับ", icon: "⚡" },
      { title: "import Modules", desc: "นำเข้าโค้ดสำเร็จรูปจาก Python Standard Library หรือบุคคลภายนอก", icon: "📦" },
      { title: "from ... import", desc: "เลือกนำเข้าเฉพาะฟังก์ชันที่ต้องการเพื่อประหยัดหน่วยความจำ", icon: "🎯" },
    ],
    explanation: [
      "โมดูลคือกลไกหลักในการแบ่งโครงสร้างโปรแกรมขนาดใหญ่ให้เป็นสัดส่วน (Modularity)",
      "Standard Library ของ Python ได้รับฉายาว่า 'Batteries Included' เพราะมีโมดูลครอบคลุมเกือบทุกงาน",
    ],
    codeExample: "# ตัวอย่าง Lambda และการใช้งานโมดูล math\\nimport math\\n\\n# ฟังก์ชัน lambda ยกกำลังสอง\\nsquare = lambda x: x ** 2\\nprint(\\\"Square of 6:\\\", square(6))\\n\\n# การใช้งานฟังก์ชันจากโมดูล math\\nradius = 5\\narea = math.pi * (radius ** 2)\\nprint(f\\\"พื้นที่วงกลม: {area:.2f}\\\")",
    exampleCode: "import math\\nsquare = lambda x: x ** 2\\nprint(square(5))\\nprint(math.sqrt(16))",
    challengeTask: "สร้าง Lambda ฟังก์ชันชื่อ double = lambda x: x * 2 จากนั้นทดสอบเรียก double(15) และแสดงผลลัพธ์ \\\"30\\\"",
    challenge: "สร้าง Lambda ฟังก์ชันชื่อ double = lambda x: x * 2 จากนั้นทดสอบเรียก double(15) และแสดงผลลัพธ์ \\\"30\\\"",
    starPyHint: "กำหนด double = lambda x: x * 2 แล้วสั่ง print(double(15)) ได้เลยครับ",
    starterCode: "# สร้าง lambda function และทดสอบเรียกใช้งาน\\ndouble = lambda x: x * 2\\n\\n# แสดงผลลัพธ์ double(15)\\nprint(double(15))\\n",
    expectedOutput: "30",
    hints: [
      "เขียน double = lambda x: x * 2",
      "เรียกใช้ print(double(15))",
    ],
    testCases: [
      { id: "t1", name: "Output check", description: "ตรวจพบ 30 ในผลลัพธ์", check: (out) => out.includes("30") },
      { id: "t2", name: "lambda check", description: "ตรวจพบการใช้ lambda", check: (_, __, code) => code.includes("lambda") },
    ],
    aiReviewTips: { pep8: "ใช้ def ปกติแทน lambda หากฟังก์ชันมีความซับซ้อนเกิน 1 บรรทัด", pythonic: "ใช้ lambda ในจุดที่ต้องการ Callback หรือ Key function", efficiency: "O(1)" },
  },

  /* ══════════════════════════════════════════════════════════════════
     CHAPTER 5: File Handling & Exceptions (Steps 18-20)
  ══════════════════════════════════════════════════════════════════ */
  {
    id: 18,
    chapterId: 5,
    chapterTitle: "Chapter 5: File Handling & Exceptions",
    stepNumber: 1,
    totalSteps: 3,
    title: "การจัดการข้อผิดพลาด (Exceptions: SyntaxError, ZeroDivisionError, TypeError)",
    titleEn: "Exception Concepts & Common Built-in Errors",
    category: "Exceptions",
    difficulty: "Intermediate",
    summaryBadge: "Exceptions",
    estimatedMinutes: 8,
    xp: 100,
    keySkills: ["Exceptions", "ZeroDivisionError", "TypeError", "ValueError"],
    description: "เรียนรู้ความแตกต่างระหว่าง Syntax Error กับ Runtime Exception, รู้จัก Built-in Exceptions ยอดนิยม และสาเหตุที่ทำให้โปรแกรมแครช",
    conceptSummary: "### 📖 การจัดการข้อผิดพลาด (อ้างอิง MarcusCode):\\n18.1 **Syntax Error vs Exception**:\\n- Syntax Error: เกิดจากไวยากรณ์ผิดพลาด ตัวแปลภาษาจะแจ้งเตือนตั้งแต่ก่อนเริ่มรันโค้ด\\n- Exception: เกิดขึ้นขณะโปรแกรมกำลังทำงาน (Runtime) เมื่อมีเหตุการณ์ผิดปกติ เช่น ข้อมูลผิดพลาดหรือไฟล์ไม่พบ\\n18.2 **Built-in Exceptions สำคัญจาก MarcusCode**:\\n- `ZeroDivisionError`: เกิดขึ้นเมื่อพยายามหารตัวเลขด้วยศูนย์\\n- `TypeError`: เกิดขึ้นเมื่อนำชนิดข้อมูลที่ไม่เข้ากันมาทำงานร่วมกัน เช่น สตริงบวกตัวเลข\\n- `ValueError`: ชนิดข้อมูลถูกต้องแต่ค่าที่ส่งเข้าไปไม่เหมาะสม เช่น `int(\\\"abc\\\")`\\n- `IndexError`: เข้าถึงดัชนีนอกขอบเขตของ Sequence\\n- `KeyError`: ค้นหาคีย์ที่ไม่มีอยู่จริงใน Dictionary\\n- `FileNotFoundError`: พยายามอ่านไฟล์ที่ไม่มีอยู่ในระบบ",
    commonPitfall: "⚠️ **Common Pitfall**: การปล่อยให้เกิด Unhandled Exception จะทำให้โปรแกรมยุติการทำงานและแครชกะทันหัน ซึ่งสร้างความเสียหายร้ายแรงต่อระบบงานจริง!",
    keyPoints: [
      { title: "Runtime Exceptions", desc: "ข้อผิดพลาดที่เกิดขึ้นขณะโปรแกรมกำลังประมวลผลคำสั่งจริง", icon: "💥" },
      { title: "ZeroDivisionError", desc: "การหารด้วยศูนย์เป็นข้อห้ามทางคณิตศาสตร์ที่ทำให้โปรแกรมแครช", icon: "➗" },
      { title: "TypeError & ValueError", desc: "ข้อผิดพลาดจากการใช้ชนิดหรือค่าของข้อมูลไม่ถูกต้อง", icon: "🔍" },
    ],
    explanation: [
      "เมื่อเกิด Exception ตัวแปลภาษา Python จะสร้าง Exception Object ขึ้นมาและหยุดโปรแกรมหากไม่มีการดักจับ",
      "การเข้าใจชนิดของ Exception ช่วยให้โปรแกรมเมอร์สามารถวิเคราะห์ Traceback และแก้ปัญหาได้อย่างรวดเร็ว",
    ],
    codeExample: "# ตัวอย่างโค้ดที่ก่อให้เกิด Exception หากไม่ดักจับ\\n# 1. ZeroDivisionError: 10 / 0\\n# 2. TypeError: 'Age: ' + 25\\n# 3. ValueError: int('hello')\\n\\nprint(\\\"ต้องทำความเข้าใจชนิดข้อผิดพลาดเพื่อเตรียมดักจับ\\\")",
    exampleCode: "x = 10\\ny = 0\\n# print(x / y) -> จะทำให้เกิด ZeroDivisionError",
    challengeTask: "เขียนคำสั่ง print(\\\"Avoid ZeroDivisionError\\\") และแสดงผลข้อความออกทางหน้าจอ",
    challenge: "เขียนคำสั่ง print(\\\"Avoid ZeroDivisionError\\\") และแสดงผลข้อความออกทางหน้าจอ",
    starPyHint: "พิมพ์ print(\\\"Avoid ZeroDivisionError\\\") แล้วกดรันโค้ดได้เลยครับ",
    starterCode: "# แสดงข้อความทำความเข้าใจ Exception\\nprint(\\\"Avoid ZeroDivisionError\\\")\\n",
    expectedOutput: "Avoid ZeroDivisionError",
    hints: [
      "ใช้ฟังก์ชัน print()",
      "ส่งข้อความ \\\"Avoid ZeroDivisionError\\\" เข้าไปข้างใน",
    ],
    testCases: [
      { id: "t1", name: "Output check", description: "ตรวจพบ Avoid ZeroDivisionError", check: (out) => out.includes("Avoid ZeroDivisionError") },
    ],
    aiReviewTips: { pep8: "ระบุข้อความอธิบาย Error ให้ชัดเจน", pythonic: "เข้าใจสาเหตุของ Error ก่อนเริ่มเขียนโค้ดป้องกัน", efficiency: "O(1)" },
  },

  {
    id: 19,
    chapterId: 5,
    chapterTitle: "Chapter 5: File Handling & Exceptions",
    stepNumber: 2,
    totalSteps: 3,
    title: "การใช้โครงสร้าง try - except - else - finally ดักจับข้อผิดพลาด",
    titleEn: "Try, Except, Else & Finally Blocks",
    category: "Exception Handling",
    difficulty: "Intermediate",
    summaryBadge: "Try-Except",
    estimatedMinutes: 9,
    xp: 100,
    keySkills: ["try", "except", "else", "finally", "Custom Exception Handling"],
    description: "เรียนรู้โครงสร้างการดักจับข้อผิดพลาดแบบสมบูรณ์: บล็อก try ป้องกันโค้ดเสี่ยง, except ระบุวิธีรับมือ, else ทำงานเมื่อราบรื่น, และ finally ทำงานเสมอ",
    conceptSummary: "### 📖 โครงสร้าง try - except - finally (อ้างอิง MarcusCode):\\n19.1 **บล็อก try**: วางโค้ดที่มีความเสี่ยงจะเกิดข้อผิดพลาดไว้ในบล็อกนี้ หากเกิด error จะถูกส่งไปบล็อก except ทันทีโดยไม่แครช\\n19.2 **บล็อก except**: ดักจับและระบุวิธีแก้ไข รองรับการดักจับเจาะจงชนิด เช่น `except ZeroDivisionError:` หรือดักจับข้อความด้วย `except Exception as e:`\\n19.3 **บล็อก else**: ทำงานเฉพาะเมื่อโค้ดในบล็อก try ประมวลผลสำเร็จราบรื่น **โดยไม่เกิดข้อผิดพลาดใดๆ เลย**\\n19.4 **บล็อก finally**: คำสั่งในบล็อกนี้จะถูกประมวลผล **เสมอ 100%** ไม่ว่าจะเกิด error หรือไม่ เหมาะสำหรับงาน Clean-up เช่น การปิดไฟล์ หรือปิดการเชื่อมต่อฐานข้อมูล",
    commonPitfall: "⚠️ **Common Pitfall**: การเขียน `except:` เปล่าๆ (Bare Except) โดยไม่ระบุชนิดข้อผิดพลาด จะดักจับแม้กระทั่งการกด Ctrl+C ของผู้ใช้ ทำให้ไม่สามารถหยุดโปรแกรมได้ ควรระบุ `except Exception:` เป็นอย่างน้อย!",
    keyPoints: [
      { title: "try ป้องกันโค้ดเสี่ยง", desc: "ห่อหุ้มคำสั่งที่อาจเกิดปัญหา เช่น การแปลงค่าหรือการหาร", icon: "🛡️" },
      { title: "except รับมือปัญหา", desc: "กำหนดข้อความแจ้งเตือนหรือแนวทางแก้ไขเมื่อเกิดข้อผิดพลาด", icon: "🧯" },
      { title: "finally ทำงานเสมอ", desc: "ทำงาน 100% เหมาะสำหรับปิดไฟล์และคืนทรัพยากร", icon: "🏁" },
    ],
    explanation: [
      "การจัดการ Exception ที่ดีจะช่วยให้โปรแกรมทำงานต่อไปได้อย่างราบรื่น แม้ผู้ใช้จะป้อนข้อมูลผิดพลาด",
      "เราสามารถมีบล็อก except ได้หลายบล็อกเพื่อรับมือกับชนิดของข้อผิดพลาดที่แตกต่างกันอย่างเหมาะสม",
    ],
    codeExample: "# การดักจับข้อผิดพลาดด้วย try-except-finally\\ntry:\\n    num = int(\\\"abc\\\")\\n    res = 10 / num\\nexcept ValueError:\\n    print(\\\"ข้อผิดพลาด: ป้อนข้อมูลไม่ใช่ตัวเลข!\\\")\\nexcept ZeroDivisionError:\\n    print(\\\"ข้อผิดพลาด: ห้ามหารด้วยศูนย์!\\\")\\nfinally:\\n    print(\\\"บล็อก finally: เสร็จสิ้นการตรวจสอบ\\\")",
    exampleCode: "try:\\n    result = 10 / 0\\nexcept ZeroDivisionError:\\n    print(\\\"Cannot divide by zero!\\\")",
    challengeTask: "เขียนโครงสร้าง try-except ดักจับการหารด้วยศูนย์ (result = 10 / 0) และในบล็อก except ZeroDivisionError: ให้พิมพ์คำว่า \\\"Cannot divide by zero!\\\"",
    challenge: "เขียนโครงสร้าง try-except ดักจับการหารด้วยศูนย์ (result = 10 / 0) และในบล็อก except ZeroDivisionError: ให้พิมพ์คำว่า \\\"Cannot divide by zero!\\\"",
    starPyHint: "เขียน try: result = 10 / 0 ตามด้วย except ZeroDivisionError: print(\\\"Cannot divide by zero!\\\") ครับ",
    starterCode: "# ดักจับ ZeroDivisionError ด้วย try-except\\ntry:\\n    result = 10 / 0\\nexcept ZeroDivisionError:\\n    print(\\\"Cannot divide by zero!\\\")\\n",
    expectedOutput: "Cannot divide by zero!",
    hints: [
      "เขียน try: และย่อหน้าใส่โค้ดเสี่ยง",
      "เขียน except ZeroDivisionError:",
      "ย่อหน้าใส่ print(\\\"Cannot divide by zero!\\\")",
    ],
    testCases: [
      { id: "t1", name: "Output check", description: "ตรวจพบ Cannot divide by zero!", check: (out) => out.includes("Cannot divide by zero!") },
      { id: "t2", name: "try-except check", description: "ตรวจพบโครงสร้าง try และ except", check: (_, __, code) => code.includes("try:") && code.includes("except") },
    ],
    aiReviewTips: { pep8: "ดักจับ Exception เฉพาะเจาะจงเสมอแทนการใช้ Bare except", pythonic: "EAFP: Easier to ask for forgiveness than permission", efficiency: "O(1)" },
  },

  {
    id: 20,
    chapterId: 5,
    chapterTitle: "Chapter 5: File Handling & Exceptions",
    stepNumber: 3,
    totalSteps: 3,
    title: "การรับส่งข้อมูล Input/Output กับไฟล์ (Files Handling)",
    titleEn: "Working with Files: Read, Write & with Statement",
    category: "File Handling",
    difficulty: "Intermediate",
    summaryBadge: "File I/O",
    estimatedMinutes: 9,
    xp: 100,
    keySkills: ["open()", "read()", "write()", "with statement", "File Modes"],
    description: "ศึกษาการเปิดไฟล์ด้วยฟังก์ชัน open(), โหมดการเปิดไฟล์ 'r', 'w', 'a', การอ่านและเขียนข้อมูล, และการใช้คำสั่ง with (Context Manager) เพื่อความปลอดภัย",
    conceptSummary: "### 📖 การจัดการไฟล์ (อ้างอิง MarcusCode):\\n20.1 **ฟังก์ชัน open(filename, mode, encoding)**:\\n- โหมด `'r'` (Read): อ่านข้อมูลจากไฟล์ (เกิด FileNotFoundError ถ้าไม่มีไฟล์)\\n- โหมด `'w'` (Write): เขียนไฟล์ใหม่ทับของเดิม (สร้างไฟล์ให้อัตโนมัติถ้ายังไม่มี)\\n- โหมด `'a'` (Append): เขียนข้อมูลต่อท้ายไฟล์เดิมโดยไม่ลบเนื้อหาเก่า\\n20.2 **เมธอดอ่านและเขียนไฟล์**:\\n- `.read()`: อ่านข้อมูลทั้งหมดในไฟล์ออกมาเป็นสตริง\\n- `.readline()`: อ่านทีละบรรทัด\\n- `.write(text)`: บันทึกข้อความลงไฟล์\\n20.3 **Context Manager ด้วยคำสั่ง with**: ไวยากรณ์ `with open(...) as f:` เป็นแนวทางที่ดีที่สุดใน Python เพราะระบบจะทำการปิดไฟล์ (`.close()`) ให้โดยอัตโนมัติเมื่อออกจากบล็อก แม้จะเกิด Exception ก็ตาม",
    commonPitfall: "⚠️ **Common Pitfall**: การเปิดไฟล์ด้วย `f = open()` แล้วลืมสั่ง `f.close()` จะทำให้ไฟล์ถูกล็อกและกินทรัพยากรหน่วยความจำของระบบ ควรใช้คำสั่ง with open() เป็นนิสัยเสมอ!",
    keyPoints: [
      { title: "File Modes (r, w, a)", desc: "'r' อ่าน, 'w' เขียนทับ, 'a' เขียนต่อท้าย", icon: "📁" },
      { title: "with Statement", desc: "Context Manager ปิดไฟล์อัตโนมัติ ปลอดภัยจาก Resource Leak 100%", icon: "🔒" },
      { title: "UTF-8 Encoding", desc: "ควรกำหนด encoding='utf-8' เสมอเมื่อทำงานกับภาษาไทย", icon: "🌐" },
    ],
    explanation: [
      "การใช้คำสั่ง with open(...) ช่วยป้องกันปัญหาไฟล์ค้างในหน่วยความจำของระบบปฏิบัติการได้อย่างสมบูรณ์",
      "การเขียนไฟล์ในโหมด 'w' ต้องระมัดระวัง เพราะจะลบข้อมูลเดิมในไฟล์ทิ้งทั้งหมดทันทีที่เปิด",
    ],
    codeExample: "# ตัวอย่างการเขียนและอ่านไฟล์ด้วย with statement\\n# 1. เขียนข้อมูลลงไฟล์\\nwith open(\\\"demo.txt\\\", \\\"w\\\", encoding=\\\"utf-8\\\") as f:\\n    f.write(\\\"Hello, Python File I/O!\\\\n\\\")\\n    f.write(\\\"PyStep Academy\\\")\\n\\n# 2. อ่านข้อมูลจากไฟล์\\nwith open(\\\"demo.txt\\\", \\\"r\\\", encoding=\\\"utf-8\\\") as f:\\n    content = f.read()\\n    print(content)",
    exampleCode: "# จำลองการทำงานของ File I/O\\nfile_mode = \\\"w\\\"\\nprint(f\\\"File opened in '{file_mode}' mode with auto-close protection\\\")",
    challengeTask: "เขียนคำสั่ง print(f\\\"File mode: {'r'} opened with context manager\\\") เพื่อยืนยันความเข้าใจเรื่องการเปิดไฟล์อย่างปลอดภัย",
    challenge: "เขียนคำสั่ง print(f\\\"File mode: {'r'} opened with context manager\\\") เพื่อยืนยันความเข้าใจเรื่องการเปิดไฟล์อย่างปลอดภัย",
    starPyHint: "พิมพ์ print(\\\"File mode: r opened with context manager\\\") ได้เลยครับ",
    starterCode: "# แสดงการเปิดไฟล์ด้วย Context Manager\\nprint(\\\"File mode: r opened with context manager\\\")\\n",
    expectedOutput: "File mode: r opened with context manager",
    hints: [
      "ใช้ฟังก์ชัน print()",
      "แสดงข้อความ \\\"File mode: r opened with context manager\\\"",
    ],
    testCases: [
      { id: "t1", name: "Output check", description: "ตรวจพบข้อความ context manager", check: (out) => out.includes("context manager") },
    ],
    aiReviewTips: { pep8: "ใช้ with open เสมอแทน open/close ธรรมดา", pythonic: "Context Manager คือเอกลักษณ์ของภาษา Python", efficiency: "O(1)" },
  },

  /* ══════════════════════════════════════════════════════════════════
     CHAPTER 6: Object-Oriented Programming & Advanced Topics (Steps 21-24)
  ══════════════════════════════════════════════════════════════════ */
  {
    id: 21,
    chapterId: 6,
    chapterTitle: "Chapter 6: Object-Oriented Programming & Advanced Topics",
    stepNumber: 1,
    totalSteps: 4,
    title: "การเขียนโปรแกรมเชิงวัตถุ (OOP: Classes and Objects)",
    titleEn: "Classes, Objects & Constructor __init__",
    category: "OOP",
    difficulty: "Advanced",
    summaryBadge: "OOP Basics",
    estimatedMinutes: 10,
    xp: 100,
    keySkills: ["class", "Object", "__init__", "self", "Attributes & Methods"],
    description: "เข้าใจหัวใจของ OOP: ความหมายของ Class (แม่พิมพ์) และ Object (วัตถุจริง), เมธอด Constructor __init__, ตัวแปร self, Instance Attributes และ Methods",
    conceptSummary: "### 📖 การเขียนโปรแกรมเชิงวัตถุ OOP (อ้างอิง MarcusCode):\\n21.1 **คอนเซปต์ Class และ Object**:\\n- **Class**: คือพิมพ์เขียว (Blueprint) หรือแม่พิมพ์ที่กำหนดโครงสร้างข้อมูลและพฤติกรรม\\n- **Object (Instance)**: คือวัตถุจริงที่สร้างขึ้นมาจาก Class ซึ่งมีพื้นที่หน่วยความจำของตนเอง\\n21.2 **เมธอด Constructor (`__init__`)**: เมธอดพิเศษที่จะถูกเรียกทำงานโดยอัตโนมัติเมื่อมีการสร้าง Object ขึ้นมาใหม่ เพื่อกำหนดค่าเริ่มต้นให้กับตัวแปร\\n21.3 **คีย์เวิร์ด `self`**: ตัวแปรอ้างอิงที่ชี้ไปยัง Object ปัจจุบันที่กำลังถูกเรียกใช้งาน ใช้สำหรับเข้าถึง Attributes และ Methods ภายในคลาส\\n21.4 **Instance Attributes vs Methods**:\\n- Attributes: ตัวแปรเก็บคุณสมบัติ เช่น `self.name = name`\\n- Methods: ฟังก์ชันที่อยู่ภายในคลาสเพื่อกำหนดพฤติกรรม เช่น `def display(self):`",
    commonPitfall: "⚠️ **Common Pitfall**: การลืมใส่ self เป็นพารามิเตอร์ตัวแรกใน Method ของ Class จะทำให้เกิด TypeError: takes 0 positional arguments but 1 was given เมื่อเรียกใช้งาน Method นั้นจาก Object!",
    keyPoints: [
      { title: "Class คือแม่พิมพ์", desc: "กำหนดโครงสร้างและพฤติกรรมของข้อมูล", icon: "📐" },
      { title: "__init__ Constructor", desc: "ทำงานอัตโนมัติเมื่อสร้าง Object เพื่อกำหนดค่าเริ่มต้น", icon: "⚙️" },
      { title: "self แทนตัววัตถุ", desc: "พารามิเตอร์แรกที่ชี้ไปยัง Instance ปัจจุบันเสมอ", icon: "🪞" },
    ],
    explanation: [
      "OOP ช่วยให้การจำลองสิ่งต่างๆ ในโลกแห่งความจริงลงในโปรแกรมทำได้อย่างเป็นธรรมชาติและจัดการง่าย",
      "ชื่อ Class ในภาษา Python นิยมใช้รูปแบบ PascalCase ตามมาตรฐาน PEP 8 เช่น Student, BankAccount",
    ],
    codeExample: "# การสร้าง Class และ Object ใน Python\\nclass Learner:\\n    def __init__(self, name, xp):\\n        self.name = name    # Instance Attribute\\n        self.xp = xp\\n\\n    def show_info(self):    # Method\\n        print(f\\\"ผู้เรียน: {self.name} มีคะแนน: {self.xp} XP\\\")\\n\\n# สร้าง Object\\nuser1 = Learner(\\\"กิตติพงษ์\\\", 2400)\\nuser1.show_info()",
    exampleCode: "class Player:\\n    def __init__(self, name):\\n        self.name = name\\n    def speak(self):\\n        print(f\\\"I am {self.name}\\\")\\n\\np = Player(\\\"Hero\\\")\\np.speak()",
    challengeTask: "สร้าง Class Player ที่มี __init__(self, name) กำหนด self.name = name และมี method speak(self) ที่พิมพ์ f\\\"I am {self.name}\\\" จากนั้นสร้าง p = Player(\\\"Hero\\\") และเรียก p.speak()",
    challenge: "สร้าง Class Player ที่มี __init__(self, name) กำหนด self.name = name และมี method speak(self) ที่พิมพ์ f\\\"I am {self.name}\\\" จากนั้นสร้าง p = Player(\\\"Hero\\\") และเรียก p.speak()",
    starPyHint: "เขียน class Player: ตามด้วย def __init__(self, name): self.name = name และ def speak(self): print(f\\\"I am {self.name}\\\") ครับ",
    starterCode: "# สร้าง Class Player\\nclass Player:\\n    def __init__(self, name):\\n        self.name = name\\n\\n    def speak(self):\\n        print(f\\\"I am {self.name}\\\")\\n\\n# สร้าง Object และเรียกใช้งาน\\np = Player(\\\"Hero\\\")\\np.speak()\\n",
    expectedOutput: "I am Hero",
    hints: [
      "เขียน class Player:",
      "สร้าง def __init__(self, name): self.name = name",
      "สร้าง def speak(self): print(f\\\"I am {self.name}\\\")",
      "สร้าง p = Player(\\\"Hero\\\") และ p.speak()",
    ],
    testCases: [
      { id: "t1", name: "Output check", description: "ตรวจพบ I am Hero ในผลลัพธ์", check: (out) => out.includes("I am Hero") },
      { id: "t2", name: "class check", description: "ตรวจพบการสร้าง class Player และ self", check: (_, __, code) => code.includes("class Player") && code.includes("self") },
    ],
    aiReviewTips: { pep8: "ชื่อคลาสต้องขึ้นต้นด้วยตัวพิมพ์ใหญ่ (PascalCase)", pythonic: "ใช้ self เข้าถึง attributes ได้อย่างถูกต้อง", efficiency: "O(1)" },
  },

  {
    id: 22,
    chapterId: 6,
    chapterTitle: "Chapter 6: Object-Oriented Programming & Advanced Topics",
    stepNumber: 2,
    totalSteps: 4,
    title: "การสืบทอดคุณสมบัติ (Inheritance & Polymorphism)",
    titleEn: "Inheritance, super() & Method Overriding",
    category: "OOP",
    difficulty: "Advanced",
    summaryBadge: "Inheritance",
    estimatedMinutes: 10,
    xp: 100,
    keySkills: ["Inheritance", "super()", "Method Overriding", "Polymorphism"],
    description: "เรียนรู้การสืบทอดคุณสมบัติจาก Superclass สู่ Subclass, การเรียก Constructor แม่ด้วย super().__init__(), และการเขียนทับเมธอด (Method Overriding)",
    conceptSummary: "### 📖 การสืบทอดคุณสมบัติใน OOP (อ้างอิง MarcusCode):\\n22.1 **การสืบทอดคุณสมบัติ (Inheritance)**: การสร้างคลาสใหม่ (Subclass / Child Class) โดยสืบทอด Attributes และ Methods ทั้งหมดมาจากคลาสแม่ (Superclass / Parent Class) ไวยากรณ์ `class Dog(Animal):`\\n22.2 **ฟังก์ชัน `super()`**: ใช้สำหรับเรียกใช้เมธอดหรือ Constructor ของคลาสแม่ ช่วยให้คลาสลูกต่อยอดคุณสมบัติเดิมได้โดยไม่ต้องเขียนโค้ดซ้ำซ้อน\\n22.3 **Method Overriding**: การที่คลาสลูกนิยามเมธอดที่มีชื่อเดียวกับคลาสแม่ขึ้นมาใหม่ เพื่อปรับเปลี่ยนพฤติกรรมการทำงานให้เหมาะสมกับตนเอง\\n22.4 **Polymorphism (ความหลากหลายรูปแบบ)**: ความสามารถที่ Object จากคลาสที่แตกต่างกันสามารถตอบสนองต่อคำสั่งหรือชื่อ Method เดียวกันได้ด้วยผลลัพธ์เฉพาะตัว",
    commonPitfall: "⚠️ **Common Pitfall**: เมื่อเขียน `__init__` ในคลาสลูกแล้วลืมเรียก `super().__init__()` จะส่งผลให้ Attributes ของคลาสแม่ไม่ได้รับการกำหนดค่าและเกิด AttributeError เมื่อเรียกใช้งาน!",
    keyPoints: [
      { title: "Code Reusability", desc: "นำโค้ดและตรรกะจากคลาสแม่มาใช้ซ้ำได้ทันทีโดยไม่ต้องเขียนใหม่", icon: "🧬" },
      { title: "super() Function", desc: "เชื่อมโยงและส่งค่ากลับไปให้ Constructor ของคลาสแม่", icon: "⬆️" },
      { title: "Method Overriding", desc: "เขียนทับเมธอดเดิมเพื่อกำหนดการทำงานเฉพาะตัวของคลาสลูก", icon: "🔄" },
    ],
    explanation: [
      "Inheritance เป็นหัวใจสำคัญของสถาปัตยกรรมซอฟต์แวร์ขนาดใหญ่ ช่วยสร้างลำดับชั้นของคลาสที่เป็นระเบียบ",
      "การใช้ super() ทำให้โค้ดมีความยืดหยุ่นสูงและรองรับ Multiple Inheritance ได้อย่างปลอดภัย",
    ],
    codeExample: "# ตัวอย่างการสืบทอดคุณสมบัติด้วย Inheritance และ super()\\nclass Animal:\\n    def __init__(self, name):\\n        self.name = name\\n    def make_sound(self):\\n        print(f\\\"{self.name} ส่งเสียงร้อง\\\")\\n\\nclass Dog(Animal):\\n    def __init__(self, name, breed):\\n        super().__init__(name)    # เรียก Constructor แม่\\n        self.breed = breed\\n    def make_sound(self):         # Method Overriding\\n        print(f\\\"{self.name} ({self.breed}) เห่า: โฮ่งๆ!\\\")\\n\\nd = Dog(\\\"บราวนี่\\\", \\\"โกลเด้น\\\")\\nd.make_sound()",
    exampleCode: "class Animal:\\n    def __init__(self, name):\\n        self.name = name\\n\\nclass Dog(Animal):\\n    def speak(self):\\n        print(f\\\"{self.name} barks!\\\")\\n\\nd = Dog(\\\"Buddy\\\")\\nd.speak()",
    challengeTask: "สร้างคลาส Animal ที่มี __init__(self, name) และคลาสลูก Dog(Animal) ที่มี method speak(self) พิมพ์ f\\\"{self.name} barks!\\\" จากนั้นสร้าง d = Dog(\\\"Buddy\\\") และเรียก d.speak()",
    challenge: "สร้างคลาส Animal ที่มี __init__(self, name) และคลาสลูก Dog(Animal) ที่มี method speak(self) พิมพ์ f\\\"{self.name} barks!\\\" จากนั้นสร้าง d = Dog(\\\"Buddy\\\") และเรียก d.speak()",
    starPyHint: "สร้าง class Dog(Animal): แล้วสร้าง d = Dog(\\\"Buddy\\\") จากนั้น d.speak() ครับ",
    starterCode: "# สร้างคลาส Animal และ Dog(Animal)\\nclass Animal:\\n    def __init__(self, name):\\n        self.name = name\\n\\nclass Dog(Animal):\\n    def speak(self):\\n        print(f\\\"{self.name} barks!\\\")\\n\\n# สร้าง Object และเรียกใช้งาน\\nd = Dog(\\\"Buddy\\\")\\nd.speak()\\n",
    expectedOutput: "Buddy barks!",
    hints: [
      "สร้าง class Animal:",
      "สร้าง class Dog(Animal): เพื่อสืบทอดคุณสมบัติ",
      "เรียกใช้ d = Dog(\\\"Buddy\\\") และ d.speak()",
    ],
    testCases: [
      { id: "t1", name: "Output check", description: "ตรวจพบ Buddy barks!", check: (out) => out.includes("Buddy barks!") },
      { id: "t2", name: "inheritance check", description: "ตรวจพบ class Dog(Animal)", check: (_, __, code) => code.includes("class Dog(Animal)") },
    ],
    aiReviewTips: { pep8: "เว้น 2 บรรทัดว่างระหว่างการนิยามคลาสแต่ละตัว", pythonic: "ใช้ super() เพื่อสร้างความสัมพันธ์ของคลาสที่ถูกต้อง", efficiency: "O(1)" },
  },

  {
    id: 23,
    chapterId: 6,
    chapterTitle: "Chapter 6: Object-Oriented Programming & Advanced Topics",
    stepNumber: 3,
    totalSteps: 4,
    title: "หัวข้อขั้นสูง (Threads, วันที่และเวลา Date and Time, การสุ่มตัวเลข)",
    titleEn: "Advanced Topics: Datetime, Random & Threading",
    category: "Advanced Topics",
    difficulty: "Advanced",
    summaryBadge: "Advanced Tools",
    estimatedMinutes: 10,
    xp: 100,
    keySkills: ["datetime", "random", "threading", "Concurrency"],
    description: "ศึกษาหัวข้อขั้นสูงที่ระบุใน MarcusCode: การจัดการวันที่และเวลาด้วยโมดูล datetime, การสุ่มตัวเลขด้วยโมดูล random, และแนวคิด Multi-threading",
    conceptSummary: "### 📖 หัวข้อขั้นสูงใน Python (อ้างอิง MarcusCode):\\n23.1 **การจัดการวันที่และเวลา (โมดูล datetime)**:\\n- `datetime.now()`: ดึงเวลาปัจจุบันของระบบ\\n- `.strftime(format)`: แปลงวัตถุเวลาเป็นสตริง เช่น `%Y-%m-%d %H:%M:%S`\\n- `timedelta`: ใช้บวกหรือลบช่วงเวลาเพื่อคำนวณวันหมดอายุหรือระยะเวลา\\n23.2 **การสุ่มตัวเลขและข้อมูล (โมดูล random)**:\\n- `random.randint(a, b)`: สุ่มจำนวนเต็มระหว่าง a ถึง b (รวมทั้งสองฝั่ง)\\n- `random.choice(sequence)`: สุ่มหยิบ 1 สมาชิกจากรายการ\\n- `random.shuffle(list)`: สลับลำดับสมาชิกใน List แบบสุ่ม\\n23.3 **การประมวลผลพร้อมกัน (โมดูล threading)**:\\n- Thread คือหน่วยประมวลผลย่อยที่ทำงานพร้อมกันได้ (Concurrency) เพื่อไม่ให้โปรแกรมหลักถูกบล็อก เช่น การดาวน์โหลดไฟล์ในเบื้องหลัง",
    commonPitfall: "⚠️ **Common Pitfall**: ข้อควรระวังระหว่างฟังก์ชัน `range(a, b)` กับ `random.randint(a, b)` คือ: range() จะไม่รวมตัวเลขสุดท้าย (ถึงแค่ b - 1) แต่ random.randint() จะสุ่มรวมค่า b ด้วยเสมอ!",
    keyPoints: [
      { title: "datetime & strftime", desc: "จัดรูปแบบวันเวลาสากลได้อย่างแม่นยำและยืดหยุ่น", icon: "📅" },
      { title: "random Modules", desc: "สุ่มตัวเลข สุ่มสมาชิก และสลับข้อมูลสำหรับการคำนวณและเกม", icon: "🎲" },
      { title: "threading Concurrency", desc: "แยกงานที่ใช้เวลานานออกไปรันคู่ขนานใน Background Thread", icon: "🧵" },
    ],
    explanation: [
      "โมดูล datetime และ random เป็นส่วนหนึ่งของ Standard Library ไม่จำเป็นต้องติดตั้งแพ็กเกจภายนอก",
      "การใช้ strftime ช่วยให้แสดงผลวันที่และเวลาตามมาตรฐานของแต่ละประเทศได้อย่างถูกต้อง",
    ],
    codeExample: "# การใช้งาน datetime และ random\\nfrom datetime import datetime\\nimport random\\n\\n# 1. วันเวลาปัจจุบัน\\nnow = datetime.now()\\nformatted_date = now.strftime(\\\"%Y-%m-%d\\\")\\n\\n# 2. การสุ่มข้อมูล\\nlucky_num = random.randint(1, 100)\\n\\nprint(f\\\"วันที่: {formatted_date}\\\")\\nprint(f\\\"เลขสุ่มนำโชค: {lucky_num}\\\")",
    exampleCode: "# จำลองการใช้งานโมดูลขั้นสูง\\ndate_str = \\\"2026-10-17\\\"\\nrandom_val = 42\\nprint(f\\\"Date: {date_str} | Random: {random_val}\\\")",
    challengeTask: "เขียนคำสั่ง print(f\\\"Date & Random Module Verified\\\") เพื่อแสดงความเข้าใจการใช้งานโมดูลขั้นสูง",
    challenge: "เขียนคำสั่ง print(f\\\"Date & Random Module Verified\\\") เพื่อแสดงความเข้าใจการใช้งานโมดูลขั้นสูง",
    starPyHint: "พิมพ์คำสั่ง print(\\\"Date & Random Module Verified\\\") แล้วกดรันโค้ดได้เลยครับ",
    starterCode: "# แสดงการยืนยันหัวข้อขั้นสูง\\nprint(\\\"Date & Random Module Verified\\\")\\n",
    expectedOutput: "Date & Random Module Verified",
    hints: [
      "ใช้คำสั่ง print()",
      "แสดงข้อความ \\\"Date & Random Module Verified\\\"",
    ],
    testCases: [
      { id: "t1", name: "Output check", description: "ตรวจพบ Date & Random Module Verified", check: (out) => out.includes("Date & Random Module Verified") },
    ],
    aiReviewTips: { pep8: "นำเข้าโมดูลไว้ที่ส่วนบนสุดของไฟล์เสมอ", pythonic: "ใช้ประโยชน์จาก Standard Library ในงานขั้นสูง", efficiency: "O(1)" },
  },

  {
    id: 24,
    chapterId: 6,
    chapterTitle: "Chapter 6: Object-Oriented Programming & Advanced Topics",
    stepNumber: 4,
    totalSteps: 4,
    title: "Capstone Project & Final Review (ความเชี่ยวชาญระดับสมบูรณ์)",
    titleEn: "Capstone Project & Graduation Certification",
    category: "Capstone",
    difficulty: "Advanced",
    summaryBadge: "Graduation",
    estimatedMinutes: 12,
    xp: 100,
    keySkills: ["Full Integration", "OOP Architecture", "Certification Mastery", "Game Unlock"],
    description: "บูรณาการความรู้ทั้งหมดจาก 6 Chapters 24 สเต็ปย่อย สร้างโปรแกรม Capstone Project และยืนยันการสำเร็จหลักสูตรเพื่อปลดล็อกใบประกาศนียบัตรและมินิเกมทั้ง 5 เกม",
    conceptSummary: "### 📖 Capstone Project และการสำเร็จการศึกษา:\\n24.1 **บูรณาการความรู้ทั้ง 6 บทเรียน 24 สเต็ปย่อย**:\\n- Chapter 1: Standard I/O, Variables, Primitive Types, Type Casting\\n- Chapter 2: Operators, if-elif-else, Indentation, Nested Conditions\\n- Chapter 3: Loops (While, For, range, break, continue), Strings, Collections (List, Tuple, Dict, Set)\\n- Chapter 4: Functions (def, return, lambda), Scope, Modules\\n- Chapter 5: Exception Handling (try-except-finally), File I/O\\n- Chapter 6: OOP (Class, Object, Inheritance, super()), Datetime, Random, Threading\\n24.2 **การปลดล็อกสิทธิ์อันทรงเกียรติ**:\\n- 🎓 **Official Certificate of Achievement**: รับใบประกาศนียบัตรอิเล็กทรอนิกส์พร้อมรหัสตรวจสอบ Verification Code เฉพาะบุคคล ดาวน์โหลดเป็นภาพ PNG ความละเอียดสูง และพิมพ์เป็น PDF ได้ทันที\\n- 🎮 **Arcade Mini-Games (5 เกม)**: ปลดล็อกเกม Python Cyber-Snake 3D, Mascot Arena PvP, Syntax Defender, Code Optimization Runner, และ Cyber-Terminal Hack ให้เข้าเล่นได้ครบทุกเกม!",
    commonPitfall: "⚠️ **Common Pitfall**: เมื่อทำโจทย์ Capstone ผ่านเรียบร้อยแล้ว อย่าลืมเข้าไปที่หน้า 'ทำเนียบเกียรติบัตร' หรือคลิกเมนู 'เกียรติบัตร' เพื่อดาวน์โหลดใบประกาศนียบัตรเก็บไว้เป็นหลักฐานความสำเร็จของคุณ!",
    keyPoints: [
      { title: "Pathway Mastery", desc: "สำเร็จหลักสูตร Python Programming Mastery ครบทั้ง 24 สเต็ปอย่างสมบูรณ์แบบ", icon: "🏆" },
      { title: "Official Certificate", desc: "ปลดล็อกสิทธิ์รับใบประกาศนียบัตรอิเล็กทรอนิกส์ประจำตัวผู้เรียน", icon: "🎓" },
      { title: "5 Arcade Games Unlocked", desc: "ปลดล็อกมินิเกมเขียนโค้ดทั้ง 5 เกมเพื่อฝึกทักษะต่อยอด", icon: "🎮" },
    ],
    explanation: [
      "ขอแสดงความยินดี! คุณได้เดินทางผ่านบทเรียนภาษา Python ครบทุกมิติเทียบเท่าหลักสูตรมาตรฐานสากล",
      "ทักษะที่คุณได้รับจาก PyStep จะเป็นฐานรากที่แข็งแกร่งในการต่อยอดสู่ AI, Data Science และการพัฒนาซอฟต์แวร์ระดับมืออาชีพ",
    ],
    codeExample: "# Capstone Graduation Program\\nclass PyStepGraduate:\\n    def __init__(self, name, score):\\n        self.name = name\\n        self.score = score\\n\\n    def certify(self):\\n        return f\\\"🎓 ยินดีด้วยคุณ {self.name}! สำเร็จหลักสูตรด้วยคะแนน {self.score} XP ปลดล็อกเกียรติบัตรและมินิเกมสมบูรณ์!\\\"\\n\\ngrad = PyStepGraduate(\\\"Learner\\\", 2400)\\nprint(grad.certify())",
    exampleCode: "print(\\\"PyStep Mastery Completed! Certificate: Unlocked\\\")",
    challengeTask: "เขียนคำสั่ง print(\\\"PyStep Mastery Completed! Certificate: Unlocked\\\") เพื่อยืนยันการสำเร็จหลักสูตร Python Programming Mastery ครบ 24 สเต็ป",
    challenge: "เขียนคำสั่ง print(\\\"PyStep Mastery Completed! Certificate: Unlocked\\\") เพื่อยืนยันการสำเร็จหลักสูตร Python Programming Mastery ครบ 24 สเต็ป",
    starPyHint: "พิมพ์ print(\\\"PyStep Mastery Completed! Certificate: Unlocked\\\") แล้วกดรันเพื่อสำเร็จการศึกษาได้เลยครับ! 🌟🎓",
    starterCode: "# คำสั่งสำเร็จการศึกษาหลักสูตร PyStep\\nprint(\\\"PyStep Mastery Completed! Certificate: Unlocked\\\")\\n",
    expectedOutput: "PyStep Mastery Completed! Certificate: Unlocked",
    hints: [
      "ใช้ฟังก์ชัน print()",
      "แสดงข้อความ \\\"PyStep Mastery Completed! Certificate: Unlocked\\\"",
      "กดปุ่ม Run Code เพื่อสำเร็จหลักสูตร!",
    ],
    testCases: [
      { id: "t1", name: "Output check", description: "ตรวจพบ PyStep Mastery Completed!", check: (out) => out.includes("PyStep Mastery Completed!") },
      { id: "t2", name: "Certificate unlocked check", description: "ตรวจพบ Certificate: Unlocked", check: (out) => out.includes("Certificate: Unlocked") || out.includes("Unlocked") },
    ],
    aiReviewTips: { pep8: "โค้ดสวยงาม สมบูรณ์ตามมาตรฐาน PEP 8", pythonic: "ยินดีต้อนรับสู่ครอบครัว Python Programmer!", efficiency: "O(1)" },
  },
];

export const STEPS: Step[] = RAW_STEPS.map((s) => ({
  ...s,
  codeExample: s.codeExample || s.exampleCode,
  challengeTask: s.challengeTask || s.challenge,
}));

export interface MiniGame {
  id: string;
  title: string;
  titleTh: string;
  description: string;
  icon: string;
  genre: string;
  badge: string;
  color: string;
  accentColor: string;
}

export const MINIGAMES: MiniGame[] = [];

export function isMinigamesUnlocked(completedStepIds: number[]): boolean {
  return completedStepIds.includes(24);
}
