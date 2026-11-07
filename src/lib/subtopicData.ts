export interface SubtopicDetail {
  number: string;
  title: string;
  summary: string;
  deepDive: {
    overview: string;
    keyConcepts: {
      subtitle: string;
      explanation: string;
      bulletPoints?: string[];
    }[];
    codeExample?: {
      title: string;
      code: string;
      output?: string;
      explanation: string;
    };
    underTheHood?: string;
    commonPitfall?: string;
    proTips?: string[];
  };
}

export const DETAILED_SUBTOPICS: Record<string, SubtopicDetail> = {
  /* ══════════════════════════════════════════════════════════════
     STEP 1 SUBTOPICS (1.1 - 1.5)
  ══════════════════════════════════════════════════════════════ */
  "1.1": {
    number: "1.1",
    title: "จุดกำเนิดและการพัฒนาของภาษา Python (Origin & History)",
    summary: "ภาษา Python ถูกสร้างขึ้นในปลายปี 1980 โดย Guido van Rossum ที่ CWI ประเทศเนเธอร์แลนด์ ได้รับแรงบันดาลใจจากภาษา ABC",
    deepDive: {
      overview: "ภาษา Python ถือกำเนิดขึ้นในช่วงปลายทศวรรษ 1980 และเริ่มเปิดตัวโค้ดรุ่นแรก (Version 0.9.0) ในเดือนกุมภาพันธ์ปี 1991 โดยโปรแกรมเมอร์ชาวดัตช์ชื่อ Guido van Rossum ขณะทำงานที่สถาบันวิจัย Centrum Wiskunde & Informatica (CWI) ในกรุงอัมสเตอร์ดัม ประเทศเนเธอร์แลนด์",
      keyConcepts: [
        {
          subtitle: "แรงบันดาลใจจากภาษา ABC",
          explanation: "Guido เคยมีส่วนร่วมในการพัฒนาภาษา ABC ซึ่งเป็นภาษาสำหรับการเรียนการสอนโปรแกรมมิ่งที่มีไวยากรณ์สะอาดตามาก แต่มีข้อจำกัดเรื่องการเข้าถึงระบบลึกๆ Guido จึงนำข้อดีด้านความอ่านง่ายของภาษา ABC มาผสมผสานกับความสามารถในการเข้าถึงระบบปฏิบัติการ Amoeba และการรองรับการเขียนโปรแกรมเชิงวัตถุ (OOP) จนเกิดเป็นภาษา Python",
          bulletPoints: [
            "พัฒนาต่อยอดจากข้อดีของภาษา ABC",
            "เพิ่มความสามารถในการจัดการข้อผิดพลาด (Exception Handling)",
            "รองรับการเรียกใช้และขยายขีดความสามารถด้วยภาษา C/C++ (Extensibility)",
          ],
        },
        {
          subtitle: "วิวัฒนาการสู่ Python 3",
          explanation: "Python พัฒนาผ่านสองยุคสำคัญคือ Python 2.x (ปี 2000) และ Python 3.0 (ปี 2008) โดย Python 3 มีการปรับเปลี่ยนเพื่อแก้ไขข้อบกพร่องพื้นฐาน รองรับ Unicode เต็มรูปแบบ และประกาศยุติการสนับสนุน Python 2 (End of Life) อย่างเป็นทางการในปี 2020",
        },
      ],
      codeExample: {
        title: "โค้ดทดสอบประวัติความเป็นมาและการตรวจสอบเวอร์ชัน",
        code: `# ตรวจสอบเวอร์ชัน Python และสภาพแวดล้อมระบบ\nimport sys\n\nprint("เวอร์ชัน Python ปัจจุบัน:")\nprint(sys.version)\nprint("แพลตฟอร์มที่กำลังทำงาน:", sys.platform)`,
        output: "เวอร์ชัน Python ปัจจุบัน:\n3.12.0 (tags/v3.12.0:0fb18b0, Oct 2 2023)\nแพลตฟอร์มที่กำลังทำงาน: win32",
        explanation: "โมดูล sys เป็นโมดูลมาตรฐานที่สร้างมาตั้งแต่ยุคแรกของ Python ใช้เข้าถึงข้อมูลของตัวแปลภาษาและระบบปฏิบัติการ",
      },
      underTheHood: "Guido van Rossum ได้รับตำแหน่ง 'Benevolent Dictator For Life' (BDFL) หรือผู้นำการตัดสินใจทิศทางของภาษานี้มาอย่างยาวนาน ก่อนจะก้าวลงจากตำแหน่งในปี 2018 และส่งมอบอำนาจให้ Steering Council เป็นผู้ดูแลแทน",
      commonPitfall: "อย่าสับสนระหว่าง Python 2 และ Python 3 เพราะไวยากรณ์บางคำสั่งเช่น print ใน Python 2 ไม่ต้องใส่วงเล็บ แต่ใน Python 3 บังคับใส่วงเล็บ print(...) เสมอ",
      proTips: [
        "ตรวจสอบเวอร์ชันใน Terminal เสมอด้วยคำสั่ง `python --version`",
        "ศึกษาบันทึกการเปลี่ยนแปลงของภาษาผ่านเอกสาร PEP (Python Enhancement Proposals)",
      ],
    },
  },

  "1.2": {
    number: "1.2",
    title: "ที่มาของชื่อ 'Python' และมาสคอต",
    summary: "ชื่อภาษาไม่ได้มาจากงู แต่มาจากรายการตลก Monty Python's Flying Circus ของช่อง BBC ยุค 1970",
    deepDive: {
      overview: "คนส่วนใหญ่มักเข้าใจผิดว่าชื่อภาษา Python ตั้งตามชื่องูหลาม แต่แท้จริงแล้ว Guido van Rossum เป็นแฟนตัวยงของซีรีส์ตลกแนวคอมเมดี้ชื่อดังของประเทศอังกฤษที่ออกอากาศทางช่อง BBC ชื่อ 'Monty Python's Flying Circus'",
      keyConcepts: [
        {
          subtitle: "เหตุผลที่เลือกชื่อนี้",
          explanation: "ในช่วงที่เริ่มพัฒนาภาษา Guido ต้องการชื่อที่สั้น กระชับ แปลกใหม่ และแฝงความลึกลับน่าค้นหา จึงหยิบคำว่า 'Python' มาตั้งเป็นชื่อภาษา",
          bulletPoints: [
            "สร้างความรู้สึกสนุกสนาน ไม่เคร่งเครียดเกินไปสำหรับการเขียนโปรแกรม",
            "ในเอกสารคู่มือทางการของ Python ยุคแรกมักมีมุกตลกและตัวอย่างที่อ้างอิงถึง Monty Python เช่น การใช้ชื่อ spam และ eggs แทน foo และ bar",
          ],
        },
      ],
      codeExample: {
        title: "ธรรมเนียมการใช้ชื่อ Spam and Eggs ใน Python",
        code: `# ตัวอย่างการตั้งชื่อเล่นตามสไตล์ Monty Python\nspam = "อาหารกระป๋องยอดนิยม"\neggs = 12\n\nprint(f"เมนูวันนี้: {spam} จำนวน {eggs} ฟอง")`,
        output: "เมนูวันนี้: อาหารกระป๋องยอดนิยม จำนวน 12 ฟอง",
        explanation: "ในคอมมูนิตี้ Python นิยมใช้ตัวแปรชื่อ spam, eggs, ham เป็นตัวอย่างแทน foo, bar, baz เพื่อรำลึกถึงที่มาของชื่อภาษา",
      },
      underTheHood: "แม้ชื่อจะมาจากรายการตลก แต่โลโก้ของ Python ได้รับการออกแบบให้เป็นรูปงูสองตัวสีน้ำเงินและสีเหลืองพันกัน ซึ่งสื่อถึงความยืดหยุ่นและการทำงานร่วมกันอย่างกลมกลืน",
      proTips: ["เวลาอ่านเอกสารทางการของ Python หากเจอคำว่า spam หรือ eggs นั่นคือธรรมเนียมสากลของโปรแกรมเมอร์สาย Python"],
    },
  },

  "1.3": {
    number: "1.3",
    title: "ปรัชญาการออกแบบ: The Zen of Python (PEP 20)",
    summary: "หลักคิดสำคัญที่ชี้นำการออกแบบไวยากรณ์ เช่น ความเรียบง่าย อ่านง่าย โค้ดที่สะอาด และมีวิธีแก้ปัญหาที่ชัดเจนเพียงวิธีเดียว",
    deepDive: {
      overview: "The Zen of Python คือชุดปรัชญาและแนวคิดหลัก 19 ข้อ (จากเดิมตั้งใจให้มี 20 ข้อ) ที่เขียนขึ้นโดย Tim Peters วิศวกรซอฟต์แวร์ผู้มีบทบาทสำคัญ เพื่อเป็นแนวทางให้นักพัฒนาเขียนโค้ดที่เป็น 'Pythonic' คือเรียบง่าย สง่างาม และอ่านเข้าใจได้ในทันที",
      keyConcepts: [
        {
          subtitle: "หัวใจสำคัญของ The Zen of Python",
          explanation: "ปรัชญาที่โปรแกรมเมอร์ทุกคนควรยึดถือประกอบด้วยข้อความสั้นๆ ที่ทรงพลัง:",
          bulletPoints: [
            "Beautiful is better than ugly (สวยงามย่อมดีกว่ารกรุงรัง)",
            "Explicit is better than implicit (ระบุเจตนาชัดเจนย่อมดีกว่าแอบแฝง)",
            "Simple is better than complex (เรียบง่ายย่อมดีกว่าซับซ้อน)",
            "Readability counts (ความสามารถในการอ่านและเข้าใจง่ายคือหัวใจสำคัญสูงสุด)",
            "There should be one-- and preferably only one --obvious way to do it (ควรมีวิธีที่ชัดเจนเพียงวิธีเดียวในการแก้ปัญหา)",
          ],
        },
      ],
      codeExample: {
        title: "คำสั่งลับเปิดดู The Zen of Python ในตัวแปลภาษา",
        code: `# พิมพ์คำสั่ง import this ใน Python เพื่ออ่านบทกวีแห่งปรัชญา\nimport this`,
        output: "The Zen of Python, by Tim Peters\n\nBeautiful is better than ugly.\nExplicit is better than implicit.\nSimple is better than complex.\nComplex is better than complicated.\nFlat is better than nested.\nSparse is better than dense.\nReadability counts.\n...",
        explanation: "คำสั่ง import this เป็น Easter Egg ชื่อดังของภาษา Python ที่บรรจุปรัชญานี้ไว้ในโมดูลของตัวแปลภาษาโดยตรง",
      },
      underTheHood: "ด้วยปรัชญา 'Readability counts' ทำให้ Python ตัดสัญลักษณ์ที่รกรุงรังเช่นเครื่องหมายเซมิโคลอน (;) หรือปีกกา ({}) ออก และเลือกใช้การย่อหน้า (Indentation) บังคับให้ทุกคนเขียนโค้ดที่มีโครงสร้างสวยงามเหมือนกัน",
      proTips: [
        "เมื่อต้องเลือกระหว่างโค้ดสั้นแต่ซับซ้อน กับโค้ดที่ยาวกว่าเล็กน้อยแต่อ่านเข้าใจง่าย จงเลือกโค้ดที่อ่านเข้าใจง่ายเสมอ",
      ],
    },
  },

  "1.4": {
    number: "1.4",
    title: "คุณสมบัติเด่นเชิงสถาปัตยกรรม (Architectural Features)",
    summary: "Dynamic typing, Automatic memory management, Multi-paradigm (OOP, Functional, Procedural) และ Batteries Included",
    deepDive: {
      overview: "Python ได้รับการออกแบบให้เป็นภาษาระดับสูงที่มีความยืดหยุ่นสูงมาก รองรับงานได้ตั้งแต่สคริปต์อัตโนมัติขนาดเล็ก ไปจนถึงระบบปัญญาประดิษฐ์ (AI / Data Science) และเว็บแอปพลิเคชันระดับโลก",
      keyConcepts: [
        {
          subtitle: "Dynamic Typing",
          explanation: "คุณไม่จำเป็นต้องระบุชนิดตัวแปรเช่น int หรือ string ล่วงหน้า ตัวแปลภาษาจะระบุชนิดข้อมูลให้เองในขณะรันไทม์ตามค่าที่กำหนด",
        },
        {
          subtitle: "Automatic Memory Management & Garbage Collection",
          explanation: "Python มีระบบนับการอ้างอิง (Reference Counting) และระบบตรวจสอบวงจรอ้างอิงขยะ (Cyclic Garbage Collector) คอยคืนหน่วยความจำให้ระบบอัตโนมัติเมื่อตัวแปรไม่ได้ถูกใช้งานแล้ว หมดกังวลเรื่อง Memory Leak",
        },
        {
          subtitle: "Batteries Included",
          explanation: "Python มาพร้อมไลบรารีมาตรฐานขนาดมหึมาที่พร้อมใช้งานได้ทันทีโดยไม่ต้องติดตั้งแพ็กเกจเพิ่ม เช่น โมดูล math, json, sqlite3, datetime, urllib, re",
        },
      ],
      codeExample: {
        title: "ตัวอย่าง Dynamic Typing และการตรวจสอบชนิดข้อมูล",
        code: `# ตัวแปรเดียวกันสามารถเปลี่ยนชนิดข้อมูลได้ตามค่าใหม่\nx = 100\nprint("ค่า:", x, "| ชนิดข้อมูล:", type(x))\n\nx = "กลายเป็นข้อความแล้ว"\nprint("ค่า:", x, "| ชนิดข้อมูล:", type(x))`,
        output: "ค่า: 100 | ชนิดข้อมูล: <class 'int'>\nค่า: กลายเป็นข้อความแล้ว | ชนิดข้อมูล: <class 'str'>",
        explanation: "ฟังก์ชัน type() ใช้ตรวจสอบชนิดคลาสของอ็อบเจกต์ที่ตัวแปรผูกอยู่ ณ ขณะนั้น",
      },
      underTheHood: "ใน Python ทุกสิ่งคือ 'Object' (Everything is an object) แม้กระทั่งตัวเลข 1, ข้อความ, หรือแม้แต่ฟังก์ชันและคลาส ล้วนเป็นอ็อบเจกต์ในหน่วยความจำที่มีแอดเดรสและเมทอดประจำตัว",
      proTips: ["ใช้คำสั่ง dir(object) เพื่อดูรายการเมทอดทั้งหมดที่อ็อบเจกต์นั้นรองรับ"],
    },
  },

  "1.5": {
    number: "1.5",
    title: "สภาพแวดล้อมการเขียนโปรแกรม (Development Environment & REPL)",
    summary: "เครื่องมือพัฒนา IDLE, VS Code, PyCharm และ Interactive REPL Shell สำหรับทดสอบคำสั่ง",
    deepDive: {
      overview: "ในการพัฒนาโปรแกรมด้วย Python สามารถทำได้หลายรูปแบบ ตั้งแต่การใช้ Interactive Shell ใน Terminal ไปจนถึงการใช้ Integrated Development Environment (IDE) ระดับมืออาชีพ",
      keyConcepts: [
        {
          subtitle: "IDLE (Integrated Development and Learning Environment)",
          explanation: "โปรแกรมแก้ไขโค้ดมาตรฐานที่ติดตั้งมาพร้อมกับตัวติดตั้ง Python มีหน้าต่าง Shell สำหรับทดสอบคำสั่งและ Editor สำหรับเขียนไฟล์ .py เหมาะอย่างยิ่งสำหรับผู้เริ่มต้น",
        },
        {
          subtitle: "Modern IDEs: VS Code & PyCharm",
          explanation: "VS Code พร้อมส่วนขยาย Python Extension และ PyCharm Community/Professional เป็นเครื่องมือมาตรฐานในอุตสาหกรรม มีระบบ IntelliSense, Linter (Flake8, Ruff), Debugger, และ Git Integration",
        },
        {
          subtitle: "Jupyter Notebooks",
          explanation: "เหมาะสำหรับงาน Data Science, การวิเคราะห์ข้อมูล และ Machine Learning เพราะสามารถรันโค้ดทีละเซลล์ แสดงกราฟภาพและข้อความประกอบได้ในที่เดียว",
        },
      ],
      codeExample: {
        title: "ทดลองพิมพ์คำสั่งแรกใน Python Shell",
        code: `# สั่งพิมพ์ข้อความออกหน้าจอ\nprint("Hello from PyStep!")\n\n# คำนวณคณิตศาสตร์ทันใจ\nprint("2 ยกกำลัง 10 เท่ากับ:", 2 ** 10)`,
        output: "Hello from PyStep!\n2 ยกกำลัง 10 เท่ากับ: 1024",
        explanation: "เครื่องหมาย ** ใช้สำหรับการคำนวณเลขยกกำลัง เช่น 2 ** 10 คือ 2 ยกกำลัง 10",
      },
      proTips: [
        "หากใช้ VS Code ให้ตั้งค่าฟอร์แมตเตอร์ Black หรือ Ruff เพื่อจัดระเบียบโค้ดตามมาตรฐาน PEP 8 อัตโนมัติทุกครั้งที่กด Save",
      ],
    },
  },

  /* ══════════════════════════════════════════════════════════════
     STEP 2 SUBTOPICS (2.1 - 2.4) [ตรงตามภาพของผู้ใช้]
  ══════════════════════════════════════════════════════════════ */
  "2.1": {
    number: "2.1",
    title: "การประมวลผลโค้ด (Code Execution, Bytecode & PVM)",
    summary: "Python เป็น Interpreted Language ที่แปลงโค้ดเป็น Bytecode (.pyc) แล้วรันผ่าน Python Virtual Machine (PVM) ทีละบรรทัด",
    deepDive: {
      overview: "หลายคนคิดว่า Python อ่านโค้ดภาษาอังกฤษแล้วรันกับฮาร์ดแวร์โดยตรง แต่ในความเป็นจริง CPython (ตัวแปลภาษามาตรฐาน) ทำงาน 2 ขั้นตอนอย่างมีประสิทธิภาพ: แปลง Source Code เป็นรหัสตัวกลาง (Bytecode) ก่อน แล้วจึงส่งให้ Python Virtual Machine (PVM) ประมวลผล",
      keyConcepts: [
        {
          subtitle: "ขั้นตอนที่ 1: การ Compile สู่ Bytecode",
          explanation: "เมื่อสั่งรันไฟล์ .py ตัวคอมไพเลอร์ของ Python จะตรวจสอบไวยากรณ์ (Syntax) และแปลงโค้ดให้อยู่ในรูปรหัสระดับต่ำที่เรียกว่า Bytecode (มีนามสกุลไฟล์เป็น .pyc ถูกเก็บไว้ในโฟลเดอร์ __pycache__)",
          bulletPoints: [
            "Bytecode เป็นชุดคำสั่งที่เป็นกลาง ไม่ขึ้นกับสถาปัตยกรรม CPU ของคอมพิวเตอร์",
            "หากไฟล์ .py ไม่มีการแก้ไข ในการรันครั้งถัดไป Python จะโหลดไฟล์ .pyc ในแคชมาใช้ทันที ทำให้โปรแกรมเริ่มทำงานเร็วขึ้นมาก",
          ],
        },
        {
          subtitle: "ขั้นตอนที่ 2: การประมวลผลผ่าน PVM (Python Virtual Machine)",
          explanation: "PVM คือลูปซอฟต์แวร์ขนาดใหญ่ที่ทำหน้าที่อ่านคำสั่ง Bytecode ทีละบรรทัด แล้วแปลงเป็นภาษาเครื่อง (Machine Code) เพื่อส่งต่อไปยัง CPU จริงของคอมพิวเตอร์",
          bulletPoints: [
            "PVM มีระบบความปลอดภัยและจัดการหน่วยความจำให้โปรแกรม",
            "หากบรรทัดใดเกิดข้อผิดพลาดขณะรันไทม์ (Runtime Error) PVM จะหยุดทำงานและโยน Exception แจ้งหมายเลขบรรทัดทันที",
          ],
        },
      ],
      codeExample: {
        title: "ส่องดู Bytecode จริงของฟังก์ชันด้วยโมดูล dis (Disassembler)",
        code: `import dis\n\ndef calculate(a, b):\n    result = a * 2 + b\n    return result\n\nprint("--- ชุดคำสั่ง Bytecode ของฟังก์ชัน calculate ---")\ndis.dis(calculate)`,
        output: `--- ชุดคำสั่ง Bytecode ของฟังก์ชัน calculate ---
  4           0 LOAD_FAST                0 (a)
              2 LOAD_CONST               1 (2)
              4 BINARY_MULTIPLY
              6 LOAD_FAST                1 (b)
              8 BINARY_ADD
             10 STORE_FAST               2 (result)
  5          12 LOAD_FAST                2 (result)
             14 RETURN_VALUE`,
        explanation: "โมดูล dis แสดงให้เห็นว่า Python แปลงโค้ดเป็นคำสั่ง Stack Machine เช่น LOAD_FAST, BINARY_MULTIPLY และ BINARY_ADD ก่อนที่ PVM จะนำไปประมวลผล",
      },
      underTheHood: "นอกจาก CPython ที่เขียนด้วยภาษา C แล้ว ยังมีตัวแปลภาษาทางเลือกอื่นๆ เช่น PyPy (มี JIT Compiler รันเร็วกว่าหลายเท่า), Jython (รันบน Java JVM), และ IronPython (รันบน .NET Framework)",
      commonPitfall: "อย่าลบโฟลเดอร์ __pycache__ เพราะมันไม่ได้เป็นอันตรายต่อเครื่อง แต่เป็นไฟล์แคชช่วยเร่งความเร็วในการโหลดโมดูล",
      proTips: [
        "สามารถสั่งรันโค้ดโดยไม่สร้างโฟลเดอร์แคช .pyc ได้ด้วยคำสั่ง `python -B script.py`",
      ],
    },
  },

  "2.2": {
    number: "2.2",
    title: "โหมดการเขียนโปรแกรม (Interactive Shell vs Script Mode)",
    summary: "โหมด Interactive Shell (REPL) สำหรับทดสอบคำสั่งสั้นๆ ทันใจ และ Script Mode (.py) สำหรับโปรแกรมจริงขนาดเต็ม",
    deepDive: {
      overview: "ภาษา Python มีความยืดหยุ่นในการเขียนและทดสอบโค้ด 2 โหมดหลักที่ทำงานควบคู่กัน: โหมดโต้ตอบทันที (Interactive Mode) และโหมดบันทึกไฟล์สคริปต์ (Script Mode)",
      keyConcepts: [
        {
          subtitle: "1. Interactive Shell Mode (REPL)",
          explanation: "REPL ย่อมาจาก Read - Evaluate - Print - Loop เมื่อคุณเปิด Terminal แล้วพิมพ์คำสั่ง `python` หน้าจอจะมีเครื่องหมาย Prompt `>>>` รอรับคำสั่ง เมื่อกด Enter โปรแกรมจะประมวลผลและแสดงผลลัพธ์ทันที",
          bulletPoints: [
            "เหมาะสำหรับการทดลองฟังก์ชันใหม่ๆ การคำนวณเร็วๆ หรือดูคู่มือผ่านฟังก์ชัน `help()`",
            "ตัวแปรพิเศษ `_` (Underscore) ใน Shell จะเก็บผลลัพธ์ล่าสุดของการคำนวณไว้เสมอ",
            "ข้อจำกัด: คำสั่งที่พิมพ์จะไม่ถูกบันทึกเก็บไว้ เมื่อปิดหน้าต่าง Shell ทุกอย่างจะหายไป",
          ],
        },
        {
          subtitle: "2. Script Mode (ไฟล์ .py)",
          explanation: "คือการเขียนคำสั่ง Python ทั้งหมดลงในไฟล์ข้อความแล้วบันทึกด้วยนามสกุล `.py` เช่น `main.py` จากนั้นรันผ่าน Terminal ด้วยคำสั่ง `python main.py`",
          bulletPoints: [
            "เหมาะสำหรับโปรแกรมจริง โครงงานขนาดใหญ่ที่มีการทำงานต่อเนื่องหลายร้อยบรรทัด",
            "สามารถนำไฟล์ไปเผยแพร่ แชร์ให้ผู้อื่นรัน หรือตั้งเวลาให้รันอัตโนมัติได้",
            "ผลลัพธ์จะแสดงออกมาเฉพาะคำสั่งที่มีการเรียกใช้ฟังก์ชัน `print()` เท่านั้น",
          ],
        },
      ],
      codeExample: {
        title: "ตัวอย่างความแตกต่างระหว่างผลลัพธ์ใน Shell กับ Script Mode",
        code: `# ใน Interactive Shell แค่พิมพ์ 10 + 20 แล้วกด Enter ผลลัพธ์ 30 จะปรากฏทันที\n# แต่ใน Script Mode (.py) ต้องใช้คำสั่ง print() ดังนี้:\n\nx = 10\ny = 20\ntotal = x + y\n\n# หากเขียนแค่ total บรรทัดนี้ในไฟล์สคริปต์ จะไม่มีอะไรแสดงบนหน้าจอ\n# ต้องสั่งพิมพ์ผลลัพธ์:\nprint("ผลรวมทั้งหมดคือ:", total)`,
        output: "ผลรวมทั้งหมดคือ: 30",
        explanation: "ใน Script Mode ตัวแปลภาษาจะไม่พิมพ์ค่าของนิพจน์ออกมาให้โดยอัตโนมัติเหมือนใน Interactive Shell โปรแกรมเมอร์ต้องระบุ print(...) ชัดเจน",
      },
      underTheHood: "คุณสามารถรันสคริปต์และเปิด Interactive Shell ค้างไว้เพื่อตรวจสอบตัวแปรหลังรันจบได้ด้วยคำสั่ง `python -i script.py`",
      proTips: [
        "ใช้คำสั่ง `exit()` หรือกด Ctrl + Z (บน Windows) หรือ Ctrl + D (บน Mac/Linux) เพื่อออกจาก Interactive Shell",
      ],
    },
  },

  "2.3": {
    number: "2.3",
    title: "การ Comment โค้ด (Single-line Comments & Docstrings)",
    summary: "คอมเมนต์บรรทัดเดียวใช้เครื่องหมาย # ส่วนคอมเมนต์หลายบรรทัดหรือเอกสารกำกับฟังก์ชัน (Docstring) ใช้ \"\"\"...\"\"\"",
    deepDive: {
      overview: "คอมเมนต์ (Comment) คือข้อความที่เขียนไว้ในโค้ดเพื่ออธิบายจุดประสงค์ แนวคิด หรือวิธีใช้งานโปรแกรม โดยตัวแปลภาษา Python จะข้ามข้อความเหล่านี้ทั้งหมด ไม่นำไปประมวลผลเป็นคำสั่ง ช่วยให้โค้ดสามารถอ่านและบำรุงรักษาได้ง่ายในอนาคต",
      keyConcepts: [
        {
          subtitle: "1. คอมเมนต์บรรทัดเดียว (Single-line Comment)",
          explanation: "เริ่มต้นด้วยเครื่องหมายสัญลักษณ์ชาร์ป `#` (Hash) ข้อความทั้งหมดที่อยู่หลังเครื่องหมาย `#` ในบรรทัดนั้นจะถือเป็นคอมเมนต์",
          bulletPoints: [
            "สามารถวางไว้โดดๆ บรรทัดใหม่เพื่ออธิบายบล็อกคำสั่งด้านล่าง",
            "หรือวางไว้ท้ายบรรทัดของคำสั่ง (Inline Comment) โดยเว้นวรรค 2 เคาะตามข้อกำหนด PEP 8",
          ],
        },
        {
          subtitle: "2. เอกสารกำกับ Docstring (Multi-line Documentation)",
          explanation: "ใช้เครื่องหมายคำพูด 3 ตัวซ้อนกัน เช่น `\"\"\"...\"\"\"` หรือ `'''...'''` ครอบข้อความหลายบรรทัด นิยมวางไว้บรรทัดแรกสุดใต้การนิยามฟังก์ชัน คลาส หรือโมดูล",
          bulletPoints: [
            "Docstring ไม่ใช่แค่คอมเมนต์ธรรมดา แต่จะถูกเก็บไว้ในแอตทริบิวต์ `__doc__` ของอ็อบเจกต์",
            "สามารถอ่านได้ผ่านฟังก์ชัน `help(function_name)` หรือเครื่องมือสร้างเอกสารอัตโนมัติเช่น Sphinx",
          ],
        },
      ],
      codeExample: {
        title: "ตัวอย่างการใช้งาน Single-line Comment และ Docstring",
        code: `# ==========================================\n# โปรแกรมคำนวณภาษีมูลค่าเพิ่ม (VAT 7%)\n# พัฒนาโดย: ทีมงาน PyStep Academy\n# ==========================================\n\ndef calculate_vat(price: float) -> float:\n    """คำนวณและคืนค่าภาษีมูลค่าเพิ่ม 7% จากราคาสินค้า\n    \n    Parameters:\n        price (float): ราคาสินค้าก่อนหักภาษี\n    Returns:\n        float: ยอดเงินภาษีมูลค่าเพิ่ม\n    """\n    vat_rate = 0.07  # อัตราภาษี 7% ตามกฎหมายไทย\n    return price * vat_rate\n\nprint("ค่าภาษีสินค้า 1,000 บาท =", calculate_vat(1000.0))\nprint("\\nดูคำอธิบายฟังก์ชันผ่าน __doc__:")\nprint(calculate_vat.__doc__)`,
        output: "ค่าภาษีสินค้า 1,000 บาท = 70.0\n\nดูคำอธิบายฟังก์ชันผ่าน __doc__:\nคำนวณและคืนค่าภาษีมูลค่าเพิ่ม 7% จากราคาสินค้า\n    \n    Parameters:\n        price (float): ราคาสินค้าก่อนหักภาษี\n    Returns:\n        float: ยอดเงินภาษีมูลค่าเพิ่ม",
        explanation: "ตัวอย่างแสดงให้เห็นทั้งการใช้คอมเมนต์ # สำหรับบันทึกความจำ และการใช้ Docstring สำหรับสร้างคู่มืออธิบายฟังก์ชัน",
      },
      underTheHood: "ใน Python ไม่มีไวยากรณ์คอมเมนต์หลายบรรทัดแบบ /* ... */ เหมือนภาษา C หากนำสตริงแบบ \"\"\"...\"\"\" ไปวางลอยๆ นอกฟังก์ชัน Python จะมองเป็น Multi-line String ที่ไม่มีตัวแปรมารับค่า และระบบ Garbage Collection จะเก็บกวาดทิ้งไปทันที",
      commonPitfall: "อย่าเขียนคอมเมนต์ที่อธิบายสิ่งที่โค้ดบอกชัดเจนอยู่แล้ว เช่น `x = 5 # กำหนด x เท่ากับ 5` แต่ให้เขียนอธิบายว่า 'ทำไมถึงต้องทำแบบนี้' (Why) แทนที่จะเขียนว่า 'โค้ดทำอะไร' (What)",
      proTips: [
        "ใน VS Code สามารถกดคีย์ลัด Ctrl + / (หรือ Cmd + /) เพื่อเปิด/ปิดคอมเมนต์บรรทัดที่เลือกได้อย่างรวดเร็ว",
      ],
    },
  },

  "2.4": {
    number: "2.4",
    title: "การขึ้นบรรทัดใหม่และการแบ่งคำสั่ง (Line Structure & Continuation)",
    summary: "Python ใช้การขึ้นบรรทัดใหม่แบ่งคำสั่ง ไม่ต้องใช้เซมิโคลอน (;) และรองรับการตัดบรรทัดยาวด้วยวงเล็บตาม PEP 8",
    deepDive: {
      overview: "ในภาษาอื่นๆ เช่น C, Java, JavaScript ทุกประโยคคำสั่งจะต้องปิดท้ายด้วยเครื่องหมายเซมิโคลอน (;) แต่สำหรับภาษา Python 'การขึ้นบรรทัดใหม่' (Newline) คือตัวบอกจุดสิ้นสุดของประโยคคำสั่งอย่างเป็นทางการ ทำให้โค้ดสะอาดตาและพิมพ์ได้รวดเร็วกว่ามาก",
      keyConcepts: [
        {
          subtitle: "1. การละทิ้งเครื่องหมายเซมิโคลอน (;)",
          explanation: "แม้ว่า Python จะยอมให้ใส่เซมิโคลอนปิดท้ายคำสั่งได้โดยไม่แจ้ง Error แต่นี่คือสิ่งที่ผิดหลัก PEP 8 และคอมมูนิตี้ถือเป็น Bad Practice ยกเว้นในกรณีเขียนคำสั่งสั้นๆ 2 คำสั่งในบรรทัดเดียว (ซึ่งก็ไม่แนะนำให้ทำอยู่ดี)",
        },
        {
          subtitle: "2. การตัดบรรทัดคำสั่งที่ยาวเกินไป (Line Continuation)",
          explanation: "ตามมาตรฐาน PEP 8 แนะนำให้โค้ดในแต่ละบรรทัดมีความยาวไม่เกิน 79 ตัวอักษร หากคำสั่งมีความยาวมาก สามารถแบ่งคำสั่งออกเป็นหลายบรรทัดได้ 2 วิธี:",
          bulletPoints: [
            "Implicit Line Continuation (วิธีที่แนะนำสูงสุด): หากโค้ดอยู่ภายในวงเล็บกลม (), วงเล็บเหลี่ยม [], หรือวงเล็บปีกกา {} คุณสามารถเคาะขึ้นบรรทัดใหม่ได้ทันทีโดยไม่ต้องใส่สัญลักษณ์พิเศษใดๆ",
            "Explicit Line Continuation: ใช้เครื่องหมายแบ็กสแลช `\\` วางไว้ท้ายบรรทัดเพื่อบอกว่าคำสั่งยังไม่จบ (แนะนำให้หลีกเลี่ยงหากใช้วงเล็บแทนได้)",
          ],
        },
      ],
      codeExample: {
        title: "ตัวอย่างการแบ่งบรรทัดคำสั่งแบบถูกหลัก PEP 8",
        code: `# ตัวอย่างการตัดบรรทัดด้วย Implicit Line Continuation ผ่านวงเล็บ ()\ntotal_price = (\n    1500  # ราคาสินค้าหลัก\n    + 350   # ค่าจัดส่งด่วนพิเศษ\n    + 120   # ประกันความเสียหาย\n    - 200   # คูปองส่วนลดพิเศษ\n)\n\n# ตัวอย่างรายการข้อมูลแบบหลายบรรทัด\ntechnologies = [\n    "Python 3.12",\n    "FastAPI",\n    "Next.js App Router",\n    "Prisma ORM",\n]\n\nprint("ยอดชำระสุทธิ:", total_price, "บาท")\nprint("เทคโนโลยีที่รองรับ:", ", ".join(technologies))`,
        output: "ยอดชำระสุทธิ: 1770 บาท\nเทคโนโลยีที่รองรับ: Python 3.12, FastAPI, Next.js App Router, Prisma ORM",
        explanation: "การใช้วงเล็บครอบนิพจน์คณิตศาสตร์หรือการขึ้นบรรทัดใหม่ใน List ช่วยให้โค้ดอ่านง่าย สามารถใส่คอมเมนต์กำกับแต่ละรายการได้ชัดเจน",
      },
      underTheHood: "ตัววิเคราะห์ไวยากรณ์ (Lexer & Parser) ของ Python มีคำสั่งพิเศษชื่อ NEWLINE และ DEDENT ในตาราง Token เพื่อควบคุมโครงสร้างโปรแกรม การขึ้นบรรทัดใหม่จึงถูกแปลงเป็น Token ในระดับภาษาศาสตร์",
      commonPitfall: "หากใช้แบ็กสแลช `\\` ในการตัดบรรทัด ห้ามมีช่องว่าง (Spacebar) แม้แต่นิดเดียวอยู่หลังเครื่องหมาย `\\` เพราะจะทำให้เกิด SyntaxError: unexpected character after line continuation character ทันที",
      proTips: [
        "จำกฎทอง: เมื่อใดที่โค้ดยาวเกินไป ให้ใช้วงเล็บกลม `(...)` ครอบไว้เสมอ แล้วเคาะ Enter ขึ้นบรรทัดใหม่ได้อย่างอิสระและปลอดภัยที่สุด",
      ],
    },
  },
};

/**
 * Intelligent helper to retrieve subtopic details for any step and number key (e.g. stepId: 2, numKey: "2.1")
 * If not explicitly registered in DETAILED_SUBTOPICS, it crafts a rich fallback payload
 * from the step's metadata, key points, explanation, and common pitfalls.
 */
export function getSubtopicDetail(
  numKey: string,
  stepTitle?: string,
  conceptSummaryText?: string,
  stepExplanation?: string[],
  stepCommonPitfall?: string,
  stepCodeExample?: string
): SubtopicDetail {
  if (DETAILED_SUBTOPICS[numKey]) {
    return DETAILED_SUBTOPICS[numKey];
  }

  // Parse title from conceptSummary line if available
  let title = `หัวข้อย่อย ${numKey}`;
  let summary = `เนื้อหาและรายละเอียดเชิงลึกของหัวข้อ ${numKey}`;

  if (conceptSummaryText) {
    const unescaped = conceptSummaryText.replace(/\\n/g, "\n");
    const lines = unescaped.split("\n");
    for (const l of lines) {
      const trimmed = l.trim();
      if (trimmed.startsWith(numKey)) {
        const afterNum = trimmed.replace(new RegExp(`^${numKey}\\s*`), "");
        const matchTitle = afterNum.match(/^\*\*([^*]+)\*\*:\s*(.*)$/);
        if (matchTitle) {
          title = matchTitle[1];
          summary = matchTitle[2];
        } else {
          summary = afterNum;
        }
        break;
      }
    }
  }

  return {
    number: numKey,
    title,
    summary,
    deepDive: {
      overview: `รายละเอียดเชิงลึกและหลักการทำงานของ **${title}** อ้างอิงตามหลักสูตรภาษา Python ของ MarcusCode เพื่อให้ผู้เรียนเข้าใจทั้งในระดับทฤษฎี การใช้งานจริง และพฤติกรรมเบื้องหลังของภาษา`,
      keyConcepts: [
        {
          subtitle: `สาระสำคัญของ ${title}`,
          explanation: summary,
          bulletPoints:
            stepExplanation && stepExplanation.length > 0
              ? stepExplanation.slice(0, 3)
              : [
                  "เข้าใจโครงสร้างไวยากรณ์และพฤติกรรมของตัวแปลภาษา Python",
                  "ปฏิบัติตามมาตรฐานการเขียนโค้ด PEP 8 เพื่อความสะอาดและอ่านง่าย",
                  "คำนึงถึงประสิทธิภาพการทำงานและการใช้หน่วยความจำ",
                ],
        },
      ],
      codeExample: stepCodeExample
        ? {
            title: `ตัวอย่างการประยุกต์ใช้งาน ${title}`,
            code: stepCodeExample.replace(/\\n/g, "\n").replace(/\\"/g, '"'),
            explanation: `โค้ดแสดงการทำงานจริงของ ${title} พร้อมผลลัพธ์ที่ถูกต้องตามมาตรฐาน Python 3`,
          }
        : undefined,
      commonPitfall: stepCommonPitfall
        ? stepCommonPitfall.replace(/^⚠️\s*\*\*Common Pitfall\*\*:\s*/, "").replace(/\\n/g, "\n").replace(/\\"/g, '"')
        : undefined,
      proTips: [
        "ทดลองพิมพ์โค้ดด้วยตัวเองใน Code Editor ด้านขวาเพื่อสร้างความเข้าใจจากประสบการณ์ตรง",
        "สังเกตข้อความแจ้งเตือนข้อผิดพลาด (Traceback Error) เพื่อพัฒนาทักษะการดีบักอย่างรวดเร็ว",
      ],
    },
  };
}
