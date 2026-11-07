"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import * as THREE from "three";
import {
  Heart,
  Star,
  Trophy,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Play,
  ArrowRight,
  Volume2,
  VolumeX,
  Compass,
  Crown,
  CheckCircle2,
  XCircle,
  Eye,
  Award,
} from "lucide-react";

// 15 Levels Data as provided by User
export interface LevelData {
  t: string; // Title / Category
  h: string; // Header keyword
  q: string; // Question
  c: string; // Code snippet
  k: "c" | "f"; // 'c' = choice, 'f' = fill-in-the-blank
  o?: string[]; // Options for choice
  a: number | string[]; // Correct answer index or acceptable strings
  hint: string;
  e: string; // Explanation
}

export const QUEST_LEVELS: LevelData[] = [
  {
    t: "พื้นฐาน",
    h: "print()",
    q: "โค้ดนี้จะแสดงอะไรบนหน้าจอ?",
    c: 'print("Meow")',
    k: "c",
    o: ["Meow", '"Meow"', "print", "Error"],
    a: 0,
    hint: "print แสดงข้อความโดยไม่แสดงเครื่องหมายคำพูด",
    e: 'print() พิมพ์ค่าข้อความออกมา เครื่องหมาย " เป็นแค่ตัวบอกว่าเป็นสตริง',
  },
  {
    t: "ตัวแปร",
    h: "variable",
    q: "พิมพ์ผลลัพธ์ที่แสดงออกมา",
    c: "x = 5\ny = x + 2\nprint(y)",
    k: "f",
    a: ["7"],
    hint: "x เก็บค่า 5 แล้วนำไปบวก 2",
    e: "y = 5 + 2 = 7",
  },
  {
    t: "ชนิดข้อมูล",
    h: "type()",
    q: "type(3.14) ให้ผลเป็นอะไร?",
    c: "print(type(3.14))",
    k: "c",
    o: ["<class 'int'>", "<class 'float'>", "<class 'str'>", "<class 'bool'>"],
    a: 1,
    hint: "ตัวเลขมีจุดทศนิยม",
    e: "3.14 เป็นเลขทศนิยม ชนิด float",
  },
  {
    t: "สตริง",
    h: "string",
    q: "พิมพ์ผลลัพธ์ที่แสดงออกมา (ระวังช่องว่าง)",
    c: 'name = "Mio"\nprint("Hi " + name)',
    k: "f",
    a: ["Hi Mio"],
    hint: "เครื่องหมาย + ต่อสตริงเข้าด้วยกัน",
    e: '"Hi " มีช่องว่างอยู่ท้าย ต่อกับ Mio ได้ Hi Mio',
  },
  {
    t: "ตัวดำเนินการ",
    h: "operators",
    q: "พิมพ์ผลลัพธ์ของ 7 // 2",
    c: "print(7 // 2)",
    k: "f",
    a: ["3"],
    hint: "// คือหารแบบปัดเศษลง",
    e: "7 หาร 2 ได้ 3.5 ปัดลงเหลือ 3",
  },
  {
    t: "เงื่อนไข",
    h: "if / else",
    q: "โค้ดนี้พิมพ์อะไร?",
    c: 'x = 10\nif x > 5:\n    print("A")\nelse:\n    print("B")',
    k: "c",
    o: ["A", "B", "A และ B", "ไม่พิมพ์อะไร"],
    a: 0,
    hint: "10 มากกว่า 5 หรือเปล่า",
    e: "เงื่อนไข x > 5 เป็นจริง จึงเข้า if แล้วพิมพ์ A",
  },
  {
    t: "ลูป",
    h: "for",
    q: "พิมพ์ผลลัพธ์ (ติดกันไม่มีช่องว่าง)",
    c: 'for i in range(3):\n    print(i, end="")',
    k: "f",
    a: ["012"],
    hint: "range(3) ได้ 0, 1, 2",
    e: 'end="" ทำให้ไม่ขึ้นบรรทัดใหม่ จึงได้ 012',
  },
  {
    t: "ลิสต์",
    h: "list",
    q: "len(a) เป็นเท่าไร?",
    c: "a = [1, 2, 3]\na.append(4)\nprint(len(a))",
    k: "f",
    a: ["4"],
    hint: "append เพิ่มสมาชิกท้ายลิสต์",
    e: "เพิ่ม 4 เข้าไป ลิสต์มี 4 ตัว",
  },
  {
    t: "การเข้าถึงลิสต์",
    h: "index",
    q: "พิมพ์ผลลัพธ์ที่แสดงออกมา",
    c: 'a = ["c", "a", "t"]\nprint(a[-1])',
    k: "f",
    a: ["t"],
    hint: "index -1 คือตัวสุดท้าย",
    e: "a[-1] คือสมาชิกตัวสุดท้าย ได้ t",
  },
  {
    t: "ดิกชันนารี",
    h: "dict",
    q: "โค้ดนี้พิมพ์ค่าอะไร?",
    c: 'd = {"cat": 3, "dog": 5}\nprint(d["cat"])',
    k: "c",
    o: ["3", "5", "cat", "KeyError"],
    a: 0,
    hint: 'ใช้ key "cat" ไปหา value',
    e: 'dict เก็บคู่ key:value การเรียก d["cat"] ได้ 3',
  },
  {
    t: "ฟังก์ชัน",
    h: "def",
    q: "พิมพ์ผลลัพธ์ที่แสดงออกมา",
    c: "def f(a, b=2):\n    return a * b\n\nprint(f(4))",
    k: "f",
    a: ["8"],
    hint: "b ไม่ได้ส่งมา จึงใช้ค่าเริ่มต้น 2",
    e: "f(4) = 4 * 2 = 8",
  },
  {
    t: "เมธอดของสตริง",
    h: "string methods",
    q: "พิมพ์ผลลัพธ์ที่แสดงออกมา",
    c: 'print("meow".upper())',
    k: "f",
    a: ["MEOW"],
    hint: "upper() แปลงเป็นตัวพิมพ์ใหญ่",
    e: "upper() คืนสตริงตัวพิมพ์ใหญ่ทั้งหมด",
  },
  {
    t: "List comprehension",
    h: "comprehension",
    q: "ผลลัพธ์คืออะไร?",
    c: "print([x * x for x in range(4)])",
    k: "c",
    o: ["[0, 1, 4, 9]", "[1, 4, 9, 16]", "[0, 1, 2, 3]", "[0, 2, 4, 6]"],
    a: 0,
    hint: "range(4) ได้ 0 ถึง 3 แล้วยกกำลังสอง",
    e: "0²,1²,2²,3² = 0,1,4,9",
  },
  {
    t: "จัดการข้อผิดพลาด",
    h: "try / except",
    q: "โค้ดนี้พิมพ์อะไร?",
    c: 'try:\n    int("a")\nexcept ValueError:\n    print("oops")',
    k: "f",
    a: ["oops"],
    hint: 'int("a") แปลงไม่ได้ จึงเกิด ValueError',
    e: "เกิดข้อผิดพลาด จึงไปทำงานในบล็อก except",
  },
  {
    t: "ด่านบอส: คลาส",
    h: "class",
    q: "บอสตัวสุดท้าย! พิมพ์ผลลัพธ์ที่แสดงออกมา",
    c: 'class Cat:\n    def __init__(self, n):\n        self.n = n\n    def speak(self):\n        return self.n + " meow"\n\nprint(Cat("Mio").speak())',
    k: "f",
    a: ["Mio meow"],
    hint: "speak() ต่อชื่อกับคำว่า meow",
    e: '__init__ เก็บชื่อไว้ใน self.n แล้ว speak() คืน "Mio meow"',
  },
];

export function StarPy3DQuestGame({ userEmail }: { userEmail?: string | null }) {
  const mountRef = useRef<HTMLDivElement>(null);

  // Game Progress States
  const [cur, setCur] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState<number[]>(Array(QUEST_LEVELS.length).fill(0));
  const [tries, setTries] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; ok: boolean } | null>(null);
  const [sayText, setSayText] = useState(
    "สวัสดี! ฉัน StarPy ลากที่ตัวฉันเพื่อหมุนดูได้ 360° เลยนะ! 🚀"
  );
  const [fillInput, setFillInput] = useState("");
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isAutoRotate, setIsAutoRotate] = useState(true);

  // Three.js References
  const catGroupRef = useRef<THREE.Group | null>(null);
  const emotionRef = useRef<{ type: "neutral" | "happy" | "sad"; timer: number }>({
    type: "neutral",
    timer: 0,
  });
  const autoRotateRef = useRef<boolean>(true);
  const targetRotationRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Highest stage unlocked (ด่าน 1 ปลดล็อกเสมอ, ด่านต่อๆ ไปปลดล็อกเมื่อด่านก่อนหน้าได้ดาว > 0)
  const unlockedCount = useMemo(() => {
    let unlocked = 1;
    for (let i = 0; i < QUEST_LEVELS.length - 1; i++) {
      if (stars[i] > 0) {
        unlocked = i + 2;
      } else {
        break;
      }
    }
    return Math.min(QUEST_LEVELS.length, unlocked);
  }, [stars]);

  // Storage key uniquely tied to user's email
  const getStorageKey = useCallback(() => {
    if (!userEmail) return null;
    return `pystep_arena_v2_${userEmail.toLowerCase().trim()}`;
  }, [userEmail]);

  // Load Saved Game from localStorage per email
  useEffect(() => {
    try {
      // Clear legacy global catdj key to prevent any old leftover leaks
      localStorage.removeItem("catdj");

      const key = getStorageKey();
      if (!key) {
        // If no user email loaded yet, start clean at stage 1
        setCur(0);
        setScore(0);
        setStars(Array(QUEST_LEVELS.length).fill(0));
        setHearts(5);
        return;
      }

      const savedStr = localStorage.getItem(key);
      if (savedStr) {
        const saved = JSON.parse(savedStr);
        if (saved) {
          const loadedStars = Array.isArray(saved.stars)
            ? saved.stars
            : Array(QUEST_LEVELS.length).fill(0);
          setStars(loadedStars);

          if (typeof saved.score === "number") setScore(saved.score);

          // Calculate unlocked count based on saved stars
          let maxUnlocked = 1;
          for (let i = 0; i < QUEST_LEVELS.length - 1; i++) {
            if (loadedStars[i] > 0) {
              maxUnlocked = i + 2;
            } else {
              break;
            }
          }

          if (typeof saved.cur === "number") {
            setCur(Math.min(saved.cur, maxUnlocked - 1));
          } else {
            setCur(maxUnlocked - 1);
          }
          return;
        }
      }

      // If user has NEVER played before (no saved record for this email):
      // Must start at stage 1 (cur = 0), 0 stars, 0 score, no green circles!
      setCur(0);
      setScore(0);
      setStars(Array(QUEST_LEVELS.length).fill(0));
      setHearts(5);
      setIsFinished(false);
    } catch {
      // ignore
    }
  }, [getStorageKey, userEmail]);

  // Save Progress tied to user's email
  const saveProgress = useCallback(
    (newScore: number, newStars: number[], newCur: number) => {
      try {
        const key = getStorageKey();
        if (key) {
          localStorage.setItem(
            key,
            JSON.stringify({ score: newScore, stars: newStars, cur: newCur })
          );
        }
      } catch {
        // ignore
      }
    },
    [getStorageKey]
  );

  // Sync auto rotate state to ref
  useEffect(() => {
    autoRotateRef.current = isAutoRotate;
  }, [isAutoRotate]);

  // Trigger 3D Mascot Reaction Emotion
  const triggerCatEmotion = (emotion: "happy" | "sad", durationMs: number = 2000) => {
    emotionRef.current = {
      type: emotion,
      timer: Date.now() + durationMs,
    };
  };

  // ─────────────────────────────────────────────────────────────────
  // THREE.JS 3D SCENE INITIALIZATION & ANIMATION LOOP
  // ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 340;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 4.5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffaed, 1.2);
    dirLight.position.set(5, 8, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const cyanPoint = new THREE.PointLight(0x38bdf8, 1.5, 8);
    cyanPoint.position.set(-2, 1, 2);
    scene.add(cyanPoint);

    const pinkPoint = new THREE.PointLight(0xf472b6, 1.2, 8);
    pinkPoint.position.set(2, 0.5, 2);
    scene.add(pinkPoint);

    // ──────────────────────── CREATE 3D STARPY CAT ────────────────────────
    const catGroup = new THREE.Group();
    catGroupRef.current = catGroup;

    // Fur Material (Cute Pastel Cyan/Blue)
    const furMat = new THREE.MeshStandardMaterial({
      color: 0x4dd0e1,
      roughness: 0.35,
      metalness: 0.1,
    });

    // Belly / Inner Ear Material (Soft Pink / Cream)
    const creamMat = new THREE.MeshStandardMaterial({
      color: 0xffebee,
      roughness: 0.5,
    });
    const pinkMat = new THREE.MeshStandardMaterial({
      color: 0xf48fb1,
      roughness: 0.4,
    });

    // Head
    const headGeo = new THREE.SphereGeometry(1.0, 32, 32);
    const head = new THREE.Mesh(headGeo, furMat);
    head.position.y = 0.9;
    catGroup.add(head);

    // Cheeks Fluff (Left & Right)
    const cheekGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const leftCheek = new THREE.Mesh(cheekGeo, furMat);
    leftCheek.position.set(-0.75, 0.65, 0.4);
    head.add(leftCheek);
    const rightCheek = new THREE.Mesh(cheekGeo, furMat);
    rightCheek.position.set(0.75, 0.65, 0.4);
    head.add(rightCheek);

    // Ears (Cones)
    const earGeo = new THREE.ConeGeometry(0.42, 0.75, 16);
    const leftEar = new THREE.Mesh(earGeo, furMat);
    leftEar.position.set(-0.62, 1.7, 0.1);
    leftEar.rotation.z = 0.35;
    leftEar.rotation.x = -0.1;
    catGroup.add(leftEar);

    const rightEar = new THREE.Mesh(earGeo, furMat);
    rightEar.position.set(0.62, 1.7, 0.1);
    rightEar.rotation.z = -0.35;
    rightEar.rotation.x = -0.1;
    catGroup.add(rightEar);

    // Inner Ears
    const innerEarGeo = new THREE.ConeGeometry(0.25, 0.55, 16);
    const leftInnerEar = new THREE.Mesh(innerEarGeo, pinkMat);
    leftInnerEar.position.set(-0.6, 1.68, 0.18);
    leftInnerEar.rotation.z = 0.35;
    leftInnerEar.rotation.x = -0.1;
    catGroup.add(leftInnerEar);

    const rightInnerEar = new THREE.Mesh(innerEarGeo, pinkMat);
    rightInnerEar.position.set(0.6, 1.68, 0.18);
    rightInnerEar.rotation.z = -0.35;
    rightInnerEar.rotation.x = -0.1;
    catGroup.add(rightInnerEar);

    // Big Anime Eyes
    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.1,
    });
    const eyeGeo = new THREE.SphereGeometry(0.2, 24, 24);

    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.35, 0.95, 0.88);
    catGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.35, 0.95, 0.88);
    catGroup.add(rightEye);

    // Eye Star Highlights
    const highlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const highlightGeo = new THREE.SphereGeometry(0.065, 12, 12);

    const leftSpark = new THREE.Mesh(highlightGeo, highlightMat);
    leftSpark.position.set(-0.3, 1.02, 1.02);
    catGroup.add(leftSpark);

    const rightSpark = new THREE.Mesh(highlightGeo, highlightMat);
    rightSpark.position.set(0.4, 1.02, 1.02);
    catGroup.add(rightSpark);

    // Pink Nose
    const noseGeo = new THREE.ConeGeometry(0.08, 0.12, 8);
    const nose = new THREE.Mesh(noseGeo, pinkMat);
    nose.position.set(0, 0.76, 1.0);
    nose.rotation.x = Math.PI;
    catGroup.add(nose);

    // Body
    const bodyGeo = new THREE.SphereGeometry(0.85, 32, 32);
    const body = new THREE.Mesh(bodyGeo, furMat);
    body.position.y = -0.2;
    body.scale.set(0.95, 1.15, 0.9);
    catGroup.add(body);

    // Belly patch
    const bellyGeo = new THREE.SphereGeometry(0.6, 24, 24);
    const belly = new THREE.Mesh(bellyGeo, creamMat);
    belly.position.set(0, -0.25, 0.4);
    belly.scale.set(0.8, 1.0, 0.5);
    catGroup.add(belly);

    // Front Paws
    const pawGeo = new THREE.SphereGeometry(0.22, 16, 16);
    const leftPaw = new THREE.Mesh(pawGeo, creamMat);
    leftPaw.position.set(-0.4, -0.9, 0.65);
    catGroup.add(leftPaw);

    const rightPaw = new THREE.Mesh(pawGeo, creamMat);
    rightPaw.position.set(0.4, -0.9, 0.65);
    catGroup.add(rightPaw);

    // Tail (Wagging curve)
    const tailGeo = new THREE.CylinderGeometry(0.12, 0.18, 1.1, 16);
    const tail = new THREE.Mesh(tailGeo, furMat);
    tail.position.set(0, -0.4, -0.85);
    tail.rotation.x = -0.8;
    catGroup.add(tail);

    // ──────────────────────── GLOWING NEON HEADPHONES ────────────────────────
    const headphoneMat = new THREE.MeshStandardMaterial({
      color: 0x1e1b4b,
      metalness: 0.8,
      roughness: 0.2,
    });
    const neonCyanMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00d8ff,
      emissiveIntensity: 0.8,
      roughness: 0.2,
    });
    const goldStarMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.6,
      metalness: 0.7,
      roughness: 0.2,
    });

    // Headband
    const bandGeo = new THREE.TorusGeometry(1.08, 0.08, 16, 48, Math.PI);
    const headband = new THREE.Mesh(bandGeo, headphoneMat);
    headband.position.set(0, 0.92, 0);
    headband.rotation.z = Math.PI;
    catGroup.add(headband);

    // Earcups (Left & Right)
    const cupGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.32, 24);

    const leftCup = new THREE.Mesh(cupGeo, headphoneMat);
    leftCup.position.set(-1.08, 0.92, 0);
    leftCup.rotation.z = Math.PI / 2;
    catGroup.add(leftCup);

    const rightCup = new THREE.Mesh(cupGeo, headphoneMat);
    rightCup.position.set(1.08, 0.92, 0);
    rightCup.rotation.z = Math.PI / 2;
    catGroup.add(rightCup);

    // Glowing LED Ring on Earcups
    const ringGeo = new THREE.TorusGeometry(0.36, 0.045, 12, 32);
    const leftRing = new THREE.Mesh(ringGeo, neonCyanMat);
    leftRing.position.set(-1.25, 0.92, 0);
    leftRing.rotation.y = Math.PI / 2;
    catGroup.add(leftRing);

    const rightRing = new THREE.Mesh(ringGeo, neonCyanMat);
    rightRing.position.set(1.25, 0.92, 0);
    rightRing.rotation.y = Math.PI / 2;
    catGroup.add(rightRing);

    // Gold Star on Headband / Cups
    const starGeo = new THREE.OctahedronGeometry(0.12, 0);
    const starLogo = new THREE.Mesh(starGeo, goldStarMat);
    starLogo.position.set(0, 2.05, 0);
    catGroup.add(starLogo);

    catGroup.position.y = -0.1;
    scene.add(catGroup);

    // ──────────────────────── MOUSE / TOUCH DRAG INTERACTION ────────────────────────
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;
      prevMouseX = clientX;
      prevMouseY = clientY;

      targetRotationRef.current.y += deltaX * 0.01;
      targetRotationRef.current.x += deltaY * 0.005;
      targetRotationRef.current.x = Math.max(-0.4, Math.min(0.4, targetRotationRef.current.x));
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);

    domElement.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp);

    // ──────────────────────── ANIMATION RENDER LOOP ────────────────────────
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Auto Rotate or Drag Interpolation
      if (autoRotateRef.current && !isDragging) {
        targetRotationRef.current.y += 0.008;
      }

      // Smooth Lerp rotation
      catGroup.rotation.y += (targetRotationRef.current.y - catGroup.rotation.y) * 0.08;
      catGroup.rotation.x += (targetRotationRef.current.x - catGroup.rotation.x) * 0.08;

      // Idle Breathing & Floating
      const isHappy =
        emotionRef.current.type === "happy" && Date.now() < emotionRef.current.timer;
      const isSad =
        emotionRef.current.type === "sad" && Date.now() < emotionRef.current.timer;

      if (isHappy) {
        // Happy bounce & ear wiggle
        catGroup.position.y = -0.1 + Math.abs(Math.sin(elapsedTime * 8)) * 0.28;
        leftEar.rotation.z = 0.35 + Math.sin(elapsedTime * 12) * 0.15;
        rightEar.rotation.z = -0.35 - Math.sin(elapsedTime * 12) * 0.15;
      } else if (isSad) {
        // Sad droop & head shake
        catGroup.position.y = -0.22;
        catGroup.rotation.z = Math.sin(elapsedTime * 10) * 0.06;
      } else {
        // Normal gentle bobbing
        catGroup.position.y = -0.1 + Math.sin(elapsedTime * 2.2) * 0.05;
        catGroup.rotation.z = 0;
      }

      // Tail wagging
      tail.rotation.z = Math.sin(elapsedTime * 3.5) * 0.25;

      // Headphone LED Pulsing
      neonCyanMat.emissiveIntensity = 0.6 + Math.sin(elapsedTime * 4) * 0.4;
      starLogo.rotation.y = elapsedTime * 2;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      domElement.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      domElement.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Reset Cat Rotation to Front
  const handleFaceFront = () => {
    targetRotationRef.current = { x: 0, y: 0 };
    if (catGroupRef.current) {
      catGroupRef.current.rotation.set(0, 0, 0);
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // GAMEPLAY LOGIC (MATCHING USER SCRIPT)
  // ─────────────────────────────────────────────────────────────────
  const currentLevel = QUEST_LEVELS[cur];

  // Switch Stage
  const handleSelectStage = (idx: number) => {
    if (idx >= unlockedCount) return;
    setCur(idx);
    setTries(0);
    setAnswered(false);
    setFeedback(null);
    setFillInput("");
    setSelectedChoice(null);
    setSayText(
      idx === QUEST_LEVELS.length - 1
        ? "บอสมาแล้ว! สู้ๆ นะ เมี๊ยวววว! 👑"
        : `ด่าน ${idx + 1}: ${QUEST_LEVELS[idx].t} พร้อมไหม?`
    );
  };

  // Judge Answer
  const handleJudge = (isCorrect: boolean) => {
    const nextTries = tries + 1;
    setTries(nextTries);

    if (isCorrect) {
      setAnswered(true);
      const earnedStars = nextTries === 1 ? 3 : nextTries === 2 ? 2 : 1;
      const newStars = [...stars];
      newStars[cur] = Math.max(newStars[cur], earnedStars);
      const newScore = score + earnedStars * 10;

      setStars(newStars);
      setScore(newScore);
      saveProgress(newScore, newStars, cur);

      setFeedback({
        ok: true,
        text: `ถูกต้อง! ได้ ${"⭐".repeat(earnedStars)} · ${currentLevel.e}`,
      });
      triggerCatEmotion("happy");
      setSayText("เยี่ยมมาก! เมี๊ยว~ ♪ 🌟");
    } else {
      const nextHearts = hearts - 1;
      setHearts(nextHearts);
      triggerCatEmotion("sad");

      if (nextHearts <= 0) {
        setHearts(5);
        const penaltyScore = Math.max(0, score - 20);
        setScore(penaltyScore);
        saveProgress(penaltyScore, stars, cur);
        setFeedback({
          ok: false,
          text: "หัวใจหมด! แมวขอให้เริ่มด่านนี้ใหม่ ลองอ่านคำใบ้ก่อนนะ",
        });
        setSayText("อุ๊ย… ไม่เป็นไร ลองใหม่นะต้าวทาส!");
        setTimeout(() => {
          setTries(0);
          setAnswered(false);
          setFeedback(null);
          setFillInput("");
          setSelectedChoice(null);
        }, 1800);
      } else {
        setFeedback({
          ok: false,
          text: "ยังไม่ถูก ลองอีกครั้ง หรือกดใบ้ดูนะ",
        });
        setSayText("อุ๊ย… ไม่เป็นไร ลองใหม่!");
      }
    }
  };

  // Handle Choice Click
  const handleChoiceClick = (choiceIdx: number) => {
    if (answered) return;
    setSelectedChoice(choiceIdx);
    const isCorrect = choiceIdx === currentLevel.a;
    handleJudge(isCorrect);
  };

  // Handle Fill-in Submit
  const handleFillSubmit = () => {
    if (answered) return;
    const cleanInput = fillInput.trim().replace(/\s+/g, " ");
    if (!cleanInput) return;
    const acceptable = Array.isArray(currentLevel.a)
      ? currentLevel.a
      : [String(currentLevel.a)];
    const isCorrect = acceptable.includes(cleanInput);
    handleJudge(isCorrect);
  };

  // Next Stage or Finish
  const handleNextStage = () => {
    if (cur < QUEST_LEVELS.length - 1) {
      handleSelectStage(cur + 1);
    } else {
      setIsFinished(true);
      triggerCatEmotion("happy", 4000);
      setSayText("เก่งที่สุด! คุณพิชิตครบทุกด่านแล้ว เมี๊ยวววว ♪♪ 👑");
    }
  };

  // Reset Game
  const handleResetGame = () => {
    if (confirm("เริ่มเล่นใหม่ทั้งหมดหรือไม่?")) {
      setCur(0);
      setHearts(5);
      setScore(0);
      const emptyStars = Array(QUEST_LEVELS.length).fill(0);
      setStars(emptyStars);
      setTries(0);
      setAnswered(false);
      setFeedback(null);
      setFillInput("");
      setSelectedChoice(null);
      setIsFinished(false);
      saveProgress(0, emptyStars, 0);
      setSayText("เริ่มใหม่แล้ว! ลุยไปด้วยกันนะต้าวทาส!");
    }
  };

  const totalStars = stars.reduce((a, b) => a + b, 0);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-slate-100 font-sans">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER HUD
      ──────────────────────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-[#0c142e] via-[#090f23] to-[#0c142e] p-4 sm:p-6 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-sky-500/30">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>🎧 StarPy Python Quest</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold">
                3D INTERACTIVE
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              หมุนตัวน้องแมว 360° ตอบคำถาม Python 15 ด่าน & สู้บอสคลาส!
            </p>
          </div>
        </div>

        {/* HUD Counters & Reset */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          {/* Hearts */}
          <div className="flex items-center gap-1 text-sm font-bold text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i}>{i < hearts ? "❤" : "🤍"}</span>
            ))}
          </div>

          {/* Score */}
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
            <Trophy size={14} className="text-amber-400" />
            <span>{score} คะแนน</span>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-sky-300 bg-sky-500/10 px-3 py-1.5 rounded-xl border border-sky-500/20">
            <Star size={14} fill="currentColor" className="text-amber-400" />
            <span>
              {totalStars} / {QUEST_LEVELS.length * 3}
            </span>
          </div>

          {/* Reset */}
          <button
            onClick={handleResetGame}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs font-bold transition-colors cursor-pointer"
            title="เริ่มเล่นใหม่ทั้งหมด"
          >
            <RotateCcw size={13} className="inline mr-1" />
            เริ่มใหม่
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. 15-STAGE MAP NODES
      ──────────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-1">
        {QUEST_LEVELS.map((_, i) => {
          const isCur = i === cur;
          const isDone = stars[i] > 0;
          const isLocked = i >= unlockedCount;
          const isBoss = i === QUEST_LEVELS.length - 1;

          return (
            <button
              key={i}
              disabled={isLocked}
              onClick={() => handleSelectStage(i)}
              className={`shrink-0 w-10 h-10 rounded-2xl border-2 font-bold text-xs flex items-center justify-center transition-all cursor-pointer ${
                isCur
                  ? "border-sky-400 bg-sky-500 text-slate-950 font-black shadow-lg shadow-sky-500/30 scale-105"
                  : isDone
                  ? "border-emerald-400 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60"
                  : isBoss
                  ? "border-rose-400/80 bg-rose-950/40 text-rose-300"
                  : "border-slate-800 bg-slate-950/80 text-slate-400 hover:border-indigo-500/40"
              } ${isLocked ? "opacity-35 cursor-not-allowed" : ""}`}
              title={`ด่าน ${i + 1}: ${QUEST_LEVELS[i].t}`}
            >
              {isBoss ? "👑" : i + 1}
            </button>
          );
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. MAIN STAGE & 3D STARPY CANVAS (GRID)
      ──────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ──────── LEFT: 3D THREE.JS CANVAS STAGE (5 COLS) ──────── */}
        <div className="lg:col-span-5 relative rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-[#0a132c] to-[#060a17] shadow-2xl overflow-hidden flex flex-col justify-between min-h-[400px]">
          {/* Top Floating Badge */}
          <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-400/20 border border-amber-300 flex items-center gap-1">
            <span>⭐</span>
            <span>QUEST READY</span>
          </div>

          {/* Top-Right 3D Controls */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5">
            <button
              onClick={() => setIsAutoRotate((prev) => !prev)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer ${
                isAutoRotate
                  ? "bg-sky-500/20 text-sky-300 border-sky-500/40"
                  : "bg-slate-900/80 text-slate-400 border-slate-700"
              }`}
            >
              ↻ {isAutoRotate ? "หมุนอยู่" : "หมุนเอง"}
            </button>
            <button
              onClick={handleFaceFront}
              className="px-2.5 py-1 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-bold transition-colors cursor-pointer"
            >
              หันหน้า
            </button>
          </div>

          {/* Three.js Canvas Container */}
          <div
            ref={mountRef}
            className="w-full flex-1 min-h-[320px] cursor-grab active:cursor-grabbing flex items-center justify-center"
            title="ลากด้วยเมาส์หรือนิ้วเพื่อหมุนดู StarPy ได้ 360°"
          />

          {/* Dialogue Speech Bubble */}
          <div className="p-4 relative z-10">
            <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-sky-500/30 text-xs text-sky-200 shadow-xl backdrop-blur-md">
              <div className="font-bold text-[10px] uppercase font-mono text-sky-400 mb-0.5 flex items-center gap-1.5">
                <Sparkles size={11} />
                StarPy Voice:
              </div>
              <p className="leading-relaxed">{sayText}</p>
            </div>
          </div>
        </div>

        {/* ──────── RIGHT: QUESTION & INTERACTION PANEL (7 COLS) ──────── */}
        <div className="lg:col-span-7 rounded-3xl border border-indigo-500/30 bg-[#070d1e] p-6 sm:p-8 shadow-2xl flex flex-col justify-between space-y-6">
          {!isFinished ? (
            <>
              {/* Question Header */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
                    ด่าน {cur + 1} / {QUEST_LEVELS.length} · {currentLevel.t}
                  </span>
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    {stars[cur] > 0 ? "⭐".repeat(stars[cur]) : "☆☆☆"}
                  </span>
                </div>

                <h2 className="text-2xl font-black text-white">
                  {currentLevel.h}
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {currentLevel.q}
                </p>

                {/* Code Block */}
                <pre className="p-4 rounded-2xl bg-[#090f23] border border-indigo-500/20 font-mono text-xs sm:text-sm text-sky-200 overflow-x-auto shadow-inner leading-relaxed">
                  <code>{currentLevel.c}</code>
                </pre>
              </div>

              {/* Options (Choice or Fill-in) */}
              <div className="space-y-4">
                {currentLevel.k === "c" && currentLevel.o ? (
                  /* Multiple Choice */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentLevel.o.map((optText, i) => {
                      const isSelected = selectedChoice === i;
                      const isCorrect = i === currentLevel.a;

                      let btnStyle =
                        "bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-800 hover:border-sky-400";
                      if (answered) {
                        if (isCorrect) {
                          btnStyle =
                            "bg-emerald-950/70 border-emerald-400 text-emerald-200 shadow-md shadow-emerald-500/20";
                        } else if (isSelected) {
                          btnStyle = "bg-rose-950/70 border-rose-400 text-rose-200";
                        }
                      }

                      return (
                        <button
                          key={i}
                          disabled={answered}
                          onClick={() => handleChoiceClick(i)}
                          className={`p-3.5 rounded-xl border font-mono text-xs text-left transition-all cursor-pointer ${btnStyle}`}
                        >
                          {optText}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  /* Fill-in-the-blank */
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="text"
                      value={fillInput}
                      disabled={answered}
                      onChange={(e) => setFillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleFillSubmit();
                      }}
                      placeholder="พิมพ์คำตอบที่นี่..."
                      className="flex-1 min-w-[200px] px-4 py-3 rounded-xl bg-[#090f23] border border-indigo-500/30 text-sky-200 font-mono text-sm outline-none focus:border-sky-400 transition-colors"
                    />
                    <button
                      disabled={answered || !fillInput.trim()}
                      onClick={handleFillSubmit}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 disabled:opacity-40 text-slate-950 font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      ตรวจคำตอบ
                    </button>
                  </div>
                )}

                {/* Feedback Alert */}
                {feedback && (
                  <div
                    className={`p-4 rounded-2xl border text-xs leading-relaxed animate-in fade-in duration-150 ${
                      feedback.ok
                        ? "bg-emerald-950/50 border-emerald-500/40 text-emerald-200"
                        : "bg-rose-950/50 border-rose-500/40 text-rose-200"
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5 mb-1">
                      {feedback.ok ? (
                        <CheckCircle2 size={15} className="text-emerald-400" />
                      ) : (
                        <XCircle size={15} className="text-rose-400" />
                      )}
                      <span>{feedback.ok ? "ยอดเยี่ยม!" : "ลองใหม่อีกครั้ง"}</span>
                    </div>
                    <p>{feedback.text}</p>
                  </div>
                )}
              </div>

              {/* Bottom Actions: Hint & Next Stage */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-indigo-500/20">
                <button
                  onClick={() => {
                    setFeedback({
                      ok: false,
                      text: "คำใบ้: " + currentLevel.hint,
                    });
                    setSayText("ลองคิดตามทีละบรรทัดนะ เมี๊ยว! 💡");
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <HelpCircle size={14} className="text-amber-400" />
                  <span>💡 คำใบ้</span>
                </button>

                {answered && (
                  <button
                    onClick={handleNextStage}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer animate-bounce"
                  >
                    <span>
                      {cur < QUEST_LEVELS.length - 1
                        ? "ไปด่านถัดไป"
                        : "ดูผลสรุปชัยชนะ 👑"}
                    </span>
                    <ArrowRight size={15} />
                  </button>
                )}
              </div>
            </>
          ) : (
            /* ──────────────── VICTORY FINISH SCREEN ──────────────── */
            <div className="text-center py-8 space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center mx-auto shadow-2xl shadow-amber-400/40">
                <Crown size={48} />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  🎉 ALL 15 STAGES CLEARED
                </span>
                <h2 className="text-3xl font-black text-white">
                  จบเกม! คุณคือ Python DJ ตัวจริง
                </h2>
                <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  ได้รับดาวทั้งหมด {totalStars} จาก {QUEST_LEVELS.length * 3} ดาว
                  · คะแนนรวม {score} คะแนน! น้องแมว StarPy ภูมิใจในตัวคุณมากที่สุด!
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => {
                    setIsFinished(false);
                    setCur(0);
                    setAnswered(false);
                  }}
                  className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all cursor-pointer"
                >
                  ย้อนกลับไปเก็บดาวด่านเดิม
                </button>

                <Link
                  href="/certificate"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-400/20 cursor-pointer"
                >
                  ดูใบประกาศนียบัตร 🏆
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
